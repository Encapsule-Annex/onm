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


resolveNamedObject = require('./onm-named-object-resolver')

componentContextHelpers = require('./onm-component-context')

# ==============================================================================
module.exports = resolveComponent = (options_) ->

    try
        # DEBUG: Verify the base-level semantics of options_ in-paramaeter
        if not componentContextHelpers.checkValidContextInput options_
            throw new Error "Invalid options in-parameter."

        # Initialize the data I/O context object shared by subroutines of the component resolver.
        context = componentContextHelpers.initializeContextObject options_

        # Deduce a vector of namespace descriptor ID's corresponding to the named object resolution
        # sequence that must be satisfied in order to complete the requested component resolution.
        namedObjectResolutionVector = initializeNamedObjectResolutionVectorFromToken context.input.addressToken

        namedObjectResolutionQueue = []
        namedObjectPendingQueue = []
        dataChangeEventJournal = []

        targetNamedObjectResolutionResult = null

        # Resolve the data component's root named object using the requested resolution strategy.
        namedObjectResolveOptions =
            strategy: context.input.strategy
            parentDataReference: context.input.parentDataReference
            targetNamespaceDescriptor: context.input.addressToken.componentDescriptor
            targetNamespaceKey: context.input.addressToken.key
            semanticBindingsReference: context.input.semanticBindingsReference
            propertyAssignmentObject: (context.input.addressToken.idComponent == context.input.addressToken.idNamespace) and context.input.propertyAssignmentObject or {}

        namedObjectResolutionQueue.push
            input: namedObjectResolveOptions
            output: resolveNamedObject namedObjectResolveOptions

        while namedObjectResolutionQueue.length

            namedObjectResolution = namedObjectResolutionQueue.pop()

            # Pick out the results as they go by and plug them in.
            resolvedOnVector = namedObjectResolutionVector[namedObjectResolution.output.resolvedId]
            if resolvedOnVector? and resolvedOnVector
                namedObjectResolutionVector[namedObjectResolution.output.resolvedId] = namedObjectResolution

            # Aggregate data change event journal entries.
            dataChangeEventJournal.push namedObjectResolution.output.dataChangeEventJournal # TODO: Get this unpacked correctly

            if namedObjectResolution.output.pendingNamespaceDescriptors.length
                if namedObjectResolution.input.targetNamespaceDescriptor.namespaceType != 'extensionPoint'
                    # Permissively resolve sub-named objects within this data component.
                    while namedObjectResolution.output.pendingNamespaceDescriptors.length
                        namedObjectResolveOptions = namedObjectResolution.output.pendingNamespaceDescriptors.pop()
                        namedObjectResolutionQueue.push
                            input: namedObjectResolveOptions
                            output: resolveNamedObject namedObjectResolveOptions
                else
                    # Do not resolve sub-named objects that are the root(s) of subcomponents. This job is the purview
                    # of onm.Namespace that frames component resolves just as the component resolver frames named object
                    # resolves.
                    while namedObjectResolution.output.pendingNamespaceDescriptors.length
                        namedObjectPendingQueue.push namedObjectResolution.output.pendingNamespaceDescriptors.pop()


        console.log JSON.stringify dataChangeEventJournal

        # DEBUG: Verify the base-level semantics of the result.
        if not componentContextHelpers.checkValidContextOutput context.output
            throw new Error "Internal test case failure: context.output object validation failed."

        # Return the results.

        return context.output

    catch exception_
        message = "resolveComponent exception occurred during execution of strategy '#{options_.strategy}': '#{exception_.message}'."
        throw new Error message



# ==============================================================================
initializeNamedObjectResolutionVectorFromToken = (addressToken_) ->
    targetDepth = addressToken_.namespaceDescriptor.parentPathIdVector.length - addressToken_.componentDescriptor.parentPathIdVector.length
    idVector = addressToken_.namespaceDescriptor.parentPathIdVector.slice -targetDepth
    idVector.push addressToken_.namespaceDescriptor.id
    resolutionVector = [];
    for id in idVector
        resolutionVector[id] = {}
    resolutionVector







