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

helperFunctions = require './onm-util-functions'
componentResolver = require './onm-component-resolver'
Address = require '../onm-address'

module.exports = addressResolver = {}

# ==============================================================================
addressResolver.resolve = (options_) ->
    inputOptionsValid = false                        
    try
        # options_ validation
        if not (options_? and options_) then throw new Error "Missing options input parameter."
        if not (options_.parentDataReference? and options_.parentDataReference) then throw new Error "Missing options.parentDataReference parameter."
        if not (options_.address? and options_.address) then throw new Error "Missing options.address parameter."
        if not (options_.strategy? and options_.strategy) then throw new Error "Missing options.strategy parameter."
        if not ((options_.strategy == 'open') or (options_.strategy == 'create') or (options_.strategy == 'negotiate')) 
            throw new Error "Unrecognized options.strategy value."
        # options_.propertyAssignmentObject is optional

        inputOptionsValid = true

         # The result is an object containing named references to the resolved component vector and change event journal.
        resolvedComponentVector = []
        dataChangeEventJournal = []

        sourceTokenQueue = []
        evaluatedTokenQueue = [] # For error reporting currently.

        for token in options_.address.implementation.tokenVector
            sourceTokenQueue.push token.clone()

        resolvedComponentWorkQueue = [] 

        currentToken = sourceTokenQueue.shift()

        componentResolveOptions = 
            strategy: (sourceTokenQueue.length == 0) and options_.strategy or 'negotiate'
            parentDataReference: options_.parentDataReference
            addressToken: currentToken
            semanticBindingsReference: options_.address.model.getSemanticBindings()
            propertyAssignmentObject: (sourceTokenQueue.length == 0) and options_.propertyAssignmentObject or {}
            onVector: true

        componentResolutionContext =
            input: componentResolveOptions
            output: componentResolver.resolve componentResolveOptions
        resolvedComponentWorkQueue.push componentResolutionContext

        componentsEvaluated = 0 # debug spew
        while resolvedComponentWorkQueue.length

            #console.log "----------------------------------------------------------------------------"
            #console.log "ADDRESS RESOLVE COMPONENT #{++componentsEvaluated}:"
            #console.log JSON.stringify options_.parentDataReference, undefined, 4

            # Retrieve the last resolved component context object off the work queue and evaluate.
            componentResolutionContext = resolvedComponentWorkQueue.shift()

            # Consolidate change event journal entries.
            for changeEvent in componentResolutionContext.output.dataChangeEventJournal
                dataChangeEventJournal.push changeEvent

            # Determine if the resolved component under evaluation is on or off the resolution vector.
            onResultVector = componentResolutionContext.input.onVector? and componentResolutionContext.input.onVector or false

            # Stash the resolved component context in the results vector iff the component under evaluation is on the resolution vector.
            if onResultVector
                # This is where we need to bag-n-tag.
                resolvedComponentVector.push componentResolutionContext
                evaluatedTokenQueue.push componentResolutionContext.input.addressToken

            # If the component under evaluation was resolved off vector, complete the resolution
            # of its pending subcomponents off vector as well. Also, if the source token queue is empty
            # then we're by definition completing pending work above the requested namespace (i.e. the
            # address has been resolved but the strategy has not yet completed).

            if (not onResultVector) or (sourceTokenQueue.length == 0)
                # Resolve any pending subcomponents of the resolved component under evaluation off-vector
                while componentResolutionContext.output.pendingSubcomponentStack.length
                    pendingSubcomponent = componentResolutionContext.output.pendingSubcomponentStack.pop()
                    pendingSubcomponent.onVector = false
                    resolvedComponentWorkQueue.push input: pendingSubcomponent, output: componentResolver.resolve pendingSubcomponent
                continue

            # ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

            # I THINK THIS FIST ASSERT IS WRONG: We can certainly resolve a component that target's a non-extension point namespace.
            # But it does have to be last component in the address. So this should be updated, or possibly removed.
            if componentResolutionContext.input.addressToken.namespaceDescriptor.namespaceType != 'extensionPoint'
                # Re-enabling this for testing. We'll see how it goes... Tests currently passing w/enabled...
                throw new Error "Internal consistency check error: expected the most-recently resolved component namespace type to be an extension point."
                # console.log "Internal consistency check error: expected the most-recently resolved component namespace type to be an extension point."

            # I THINK THIS IS OKAY AS IT ENFORCES AN INVARIANT ON ADDRESS TOKENS
            if componentResolutionContext.input.addressToken.idNamespace != sourceTokenQueue[0].idExtensionPoint
                # Re-enabling this for testing. We'll see how it goes... Tests currently passing w/enabled.
                throw new Error "Internal consistency check error: unexpected component found at the head of the source token queue."
                # console.log "Internal consistency check error: unexpected component found at the head of the source token queue."
            
            if componentResolutionContext.output.pendingSubcomponentStack.length and (sourceTokenQueue.length != 1)
                throw new Error "Internal consistency check error: unexpected pending subcomponent stack size. should be empty."
                # console.log "Internal consistency check error? pendingSubcomponentStack.length=#{componentResolutionContext.output.pendingSubcomponentStack.length} sourceTokenQueue.length=#{sourceTokenQueue.length}"

            # ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

            # The vector of resolved named objects that comprise the resolved component under evaluation.
            norv = componentResolutionContext.output.namedObjectResolutionVector

            # The head resolved named object data reference the component under evaluation.
            parentDataReference = norv[norv.length-1].output.namespaceDataReference

            # If the component under evaluation has no pending unresolved subcomponent(s), manually initiate the resolution of the next address token.
            if not componentResolutionContext.output.pendingSubcomponentStack.length

                currentToken = sourceTokenQueue.shift()

                componentResolveOptions = 
                    strategy: (sourceTokenQueue.length == 0) and options_.strategy or 'negotiate'
                    parentDataReference: parentDataReference
                    addressToken: currentToken
                    semanticBindingsReference: options_.address.model.getSemanticBindings()
                    propertyAssignmentObject: (sourceTokenQueue.length == 0) and options_.propertyAssignmentObject or {}
                    onVector: true

                resolvedComponentWorkQueue.push {
                    input: componentResolveOptions
                    output: componentResolver.resolve componentResolveOptions
                    }

            else
                # Complete the pending subcomponent resolutions using the next address token from the source queue off vector
                while componentResolutionContext.output.pendingSubcomponentStack.length
                    pendingComponentResolutionOptions = componentResolutionContext.output.pendingSubcomponentStack.pop()
                    pendingComponentResolutionOptions.onVector = true
                    pendingComponentResolutionOptions.propertyAssignmentObject = (sourceTokenQueue.length == 0) and options_.propertyAssignmentObject or {}
                    resolvedComponentWorkQueue.push {
                        input: pendingComponentResolutionOptions
                        output: componentResolver.resolve pendingComponentResolutionOptions
                        }


        #console.log "----------------------------------------------------------------------------"

       
        # ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        if sourceTokenQueue.length
            throw new Error "Internal consistency check error: unexpected address resolver exit with non-empty source token queue."
        if resolvedComponentVector.length != options_.address.implementation.tokenVector.length
            throw new Error "Internal consistency check error: unexpected address resolver exit with too few resolved components."
        # ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

        #console.log "----------------------------------------------------------------------------"
        #console.log "FINAL JSON:"
        #console.log JSON.stringify options_.parentDataReference, undefined, 4
        #console.log "----------------------------------------------------------------------------"
        #console.log "CHANGE LOG:"
        #console.log JSON.stringify dataChangeEventJournal, undefined, 4
        #console.log "----------------------------------------------------------------------------"

        return resolvedComponentVector: resolvedComponentVector, dataChangeEventJournal: dataChangeEventJournal

    catch exception_
        if not inputOptionsValid
            message = "addressResolver failed in function prologue: #{exception_.message}"
        else
            targetAddressString = options_.address.getHumanReadableString()
            resolvedAddressString = evaluatedTokenQueue.length and (new Address(options_.address.model, evaluatedTokenQueue).getHumanReadableString()) or ''
            unresolvedAddressString = targetAddressString.substring(resolvedAddressString.length, targetAddressString.length)
            message = "addressResolver.resolve failed to resolve '#{resolvedAddressString}>>#{unresolvedAddressString}<<' via strategy '#{options_.strategy}':: #{exception_.message}"
        throw new Error message

# ==============================================================================
addressResolver.getResolvedNamedObjectReference = (resolvedAddressObject_) ->
    try
        if not (resolvedAddressObject_? and resolvedAddressObject_)
            throw new Error "Missing resolved address context object in-parameter."
        resolvedComponentCount = resolvedAddressObject_.resolvedComponentVector.length
        if not resolvedComponentCount
            throw new Error "Cannot extract a named object reference from resolved address context object because it contains no resolved components."
        resolvedComponentContext = resolvedAddressObject_.resolvedComponentVector[resolvedComponentCount - 1]
        componentResolver.getResolvedNamedObjectReference resolvedComponentContext
    catch exception_
        throw new Error "addressResolver.getResolvedNamedObjectReference failed: #{exception_.message}"

# ==============================================================================
addressResolver.getResolvedTokenVector = (resolvedAddressObject_) ->
    try
        resolvedTokenVector = []
        if not (resolvedAddressObject_? and resolvedAddressObject_)
            throw new Error "Missing resolved address context object in-parameter."
        for resolvedComponentContext in resolvedAddressObject_.resolvedComponentVector
            resolvedTokenVector.push componentResolver.getResolvedToken resolvedComponentContext
        resolvedTokenVector
    catch exception_
        throw new Error "addressResolver.getResolvedTokenVector failed: #{exception_.message}"
