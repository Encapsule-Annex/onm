###
------------------------------------------------------------------------------

The MIT License (MIT)

Copyright (c) 2015 Encapsule Project
  
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

**** Encapsule Project :: Build better software with circuit models ****

OPEN SOURCES: http://github.com/Encapsule HOMEPAGE: http://Encapsule.org
BLOG: http://blog.encapsule.org TWITTER: https://twitter.com/Encapsule

------------------------------------------------------------------------------
------------------------------------------------------------------------------

###
#
#
#

AddressToken = require('./onm-address-token')
namedObjectResolver = require('./onm-named-object-resolver')

componentContextHelpers = require('./onm-component-context')

module.exports = componentResolver = {}

# ==============================================================================
componentResolver.resolve = (options_) ->
    try
        # DEBUG: Verify the base-level semantics of options_ in-paramaeter
        if not componentContextHelpers.checkValidContextInput options_
            throw new Error "Invalid options in-parameter."

        # Initialize the data I/O context object shared by subroutines of the component resolver.
        context = componentContextHelpers.initializeContextObject options_

        # Deduce a vector of namespace descriptor ID's corresponding to the named object resolution
        # sequence that must be satisfied in order to complete the requested component resolution.
        namedObjectResolutionContext = createNamedObjectResolutionContext context.input.addressToken

        namedObjectResolutionStack = []
        pendingSubcomponentStack = []
        dataChangeEventJournal = []

        # Resolve the data component's root named object using the requested resolution strategy.
        namedObjectResolveOptions =
            strategy: context.input.strategy
            parentDataReference: context.input.parentDataReference
            targetNamespaceDescriptor: context.input.addressToken.componentDescriptor
            targetNamespaceKey: context.input.addressToken.key
            semanticBindingsReference: context.input.semanticBindingsReference
            propertyAssignmentObject: (context.input.addressToken.idComponent == context.input.addressToken.idNamespace) and context.input.propertyAssignmentObject or {}

        namedObjectResolutionStack.push
            input: namedObjectResolveOptions
            output: namedObjectResolver.resolve namedObjectResolveOptions

        while namedObjectResolutionStack.length

            namedObjectResolution = namedObjectResolutionStack.pop()

            # Pick out the results as they go by and plug them in.
            resolvedOnVector = namedObjectResolutionContext.resultVector[namedObjectResolution.output.resolvedId]
            if resolvedOnVector != undefined
                namedObjectResolutionContext.resultVector[namedObjectResolution.output.resolvedId] = namedObjectResolutionContext.lastResolutionResult = namedObjectResolution
                namedObjectResolutionContext.workQueue.shift()

            # Aggregate data change event journal entries.
            for changeEvent in namedObjectResolution.output.dataChangeEventJournal
                dataChangeEventJournal.push changeEvent

            if namedObjectResolution.output.pendingResolutionStack.length
                switch namedObjectResolution.input.targetNamespaceDescriptor.namespaceType
                    when 'extensionPoint'
                        # Pending named object resolution(s) fall outside the scope of this data component.
                        while namedObjectResolution.output.pendingResolutionStack.length
                            namedObjectResolveOptions = namedObjectResolution.output.pendingResolutionStack.pop()
                            # Propogate 'negotiate' strategy forward if the current component negotiated to 'open' strategy.
                            if (namedObjectResolveOptions.strategy == 'open') and (context.input.strategy == 'negotiate')
                                namedObjectResolveOptions.strategy = 'negotiate'
                            pendingAddressToken = new AddressToken(
                                context.input.addressToken.model
                                namedObjectResolution.output.resolvedId
                                namedObjectResolveOptions.targetNamespaceKey
                                namedObjectResolveOptions.targetNamespaceDescriptor.id)
                            componentResolveOptions = 
                                strategy: namedObjectResolveOptions.strategy
                                parentDataReference: namedObjectResolveOptions.parentDataReference
                                addressToken: pendingAddressToken
                                semanticBindingsReference: namedObjectResolveOptions.semanticBindingsReference
                                propertyAssignmentObject: namedObjectResolveOptions.propertyAssignmentObject
                            pendingSubcomponentStack.push componentResolveOptions
                        break
                    else
                        # Pending named object resolution(s) fall within the scope of this data component.
                        while namedObjectResolution.output.pendingResolutionStack.length
                            namedObjectResolveOptions = namedObjectResolution.output.pendingResolutionStack.pop()
                            # If the pending named object resolution corresponds to the target namespace, inject the propertyAssignmentObject.
                            if namedObjectResolveOptions.targetNamespaceDescriptor.id == context.input.addressToken.idNamespace
                                if Object.keys(namedObjectResolveOptions.propertyAssignmentObject).length > 0
                                    throw new Error "Internal consistency check error: We do not expect property assignment data to be propogating below the target namespace during a component resolution."
                                namedObjectResolveOptions.propertyAssignmentObject = context.input.propertyAssignmentObject? and context.input.propertyAssignmentObject or {}
                            namedObjectResolutionStack.push
                                input: namedObjectResolveOptions
                                output: namedObjectResolver.resolve namedObjectResolveOptions
                        break

            # If the main stack is empty but the work queue is not, then this means that the ascending wave of named
            # object resolutions has propogated through all the namespaces required to satisfy the request. Grab the
            # next namespace descriptor in line from the work queue, and initiate another wave of named object resolves
            # on the main resolution stack.

            if (not namedObjectResolutionStack.length) and namedObjectResolutionContext.workQueue.length

                namedObjectResolveOptions =
                    strategy: namedObjectResolutionContext.lastResolutionResult.output.strategyFollowed
                    parentDataReference: namedObjectResolutionContext.lastResolutionResult.output.namespaceDataReference
                    targetNamespaceDescriptor: namedObjectResolutionContext.workQueue[0]
                    targetNamespaceKey: null
                    semanticBindingsReference: context.input.semanticBindingsReference
                    propertyAssignmentObject: {}

                namedObjectResolutionStack.push
                    input: namedObjectResolveOptions
                    output: namedObjectResolver.resolve namedObjectResolveOptions

        # TODO: remove this debug telemetry
        # console.log JSON.stringify dataChangeEventJournal, undefined, 4

        context.output.namedObjectResolutionVector = namedObjectResolutionContext.resultVector
        context.output.pendingSubcomponentStack = pendingSubcomponentStack
        context.output.dataChangeEventJournal = dataChangeEventJournal

        # DEBUG: Verify the base-level semantics of the result.
        if not componentContextHelpers.checkValidContextOutput context.output
            throw new Error "Internal test case failure: context.output object validation failed."

        # Return the results.
        return context.output

    catch exception_
        message = "resolveComponent exception occurred during execution of strategy '#{options_.strategy}': '#{exception_.message}'."
        throw new Error message

# ==============================================================================
createNamedObjectResolutionContext = (addressToken_) ->

    # Determine the sequence of namespace ID's that must be resolved to satisfy the request.
    targetDepth = addressToken_.namespaceDescriptor.parentPathIdVector.length - addressToken_.componentDescriptor.parentPathIdVector.length

    idVector = addressToken_.namespaceDescriptor.parentPathIdVector.slice addressToken_.componentDescriptor.parentPathIdVector.length, addressToken_.namespaceDescriptor.parentPathIdVector.length
    idVector.push addressToken_.namespaceDescriptor.id

    # Default construct the named object resolution context object.
    namedObjectResolutionContext =
        resultVector: []
        workQueue: []
        lastResolutionResult: null

    # Populate the context object.
    for id in idVector
        namedObjectResolutionContext.resultVector[id] = null
        namedObjectResolutionContext.workQueue.push addressToken_.model.implementation.getNamespaceDescriptorFromPathId id

    # Return the result
    namedObjectResolutionContext


