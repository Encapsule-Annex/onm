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
resolveNamedObject = require './onm-named-object-resolver'
resolveComponent = require './onm-component-resolver'

# ==============================================================================
module.exports = resolveAddress = (options_) ->
    try
        # options_ validation
        if not (options_? and options_) then throw new Error "Missing options input parameter."
        if not (options_.parentDataReference? and options_.parentDataReference) then throw new Error "Missing options.parentDataReference parameter."
        if not (options_.address? and options_.address) then throw new Error "Missing options.address parameter."
        if not (options_.strategy? and options_.strategy) then throw new Error "Missing options.strategy parameter."
        if not ((options_.strategy == 'open') or (options_.strategy == 'create') or (options_.strategy == 'negotiate')) 
            throw new Error "Unrecognized options.strategy value."
        # options_.propertyAssignmentObject is optional

        dataChangeEventJournal = []

        resolvedComponentVector = [] # The result

        sourceTokenQueue = []
        for token in options_.address.implementation.tokenVector
            sourceTokenQueue.push token.clone()
        lastSourceTokenResolved = undefined

        resolvedComponentWorkQueue = [] 

        componentResolveOptions = 
            strategy: options_.strategy
            parentDataReference: options_.parentDataReference
            addressToken: sourceTokenQueue.shift()
            semanticBindingsReference: options_.address.model.getSemanticBindings()
            propertyAssignmentObject: options_.propertyAssignmentObject
            onVector: true
        componentResolutionContext =
            input: componentResolveOptions
            output: resolveComponent componentResolveOptions
        resolvedComponentWorkQueue.push componentResolutionContext

        componentsEvaluated = 0
        while resolvedComponentWorkQueue.length

            console.log "----------------------------------------------------------------------------"
            console.log "ADDRESS RESOLVE COMPONENT #{++componentsEvaluated}:"
            console.log JSON.stringify options_.parentDataReference, undefined, 4

            componentResolutionContext = resolvedComponentWorkQueue.shift()

            for changeEvent in componentResolutionContext.output.dataChangeEventJournal
                dataChangeEventJournal.push changeEvent

            onResultVector = componentResolutionContext.input.onVector? and componentResolutionContext.input.onVector or false

            if onResultVector
                resolvedComponentVector.push componentResolutionContext

            # If the resolved component under evaluation was resolved off vector, complete the resolution
            # of its pending subcomponents off vector as well. Also, if the source token queue is empty
            # then we're by definition completing pending work above the requested namespace (i.e. the
            # address has been resolved but the strategy has not yet completed).

            if (not onResultVector) or (sourceTokenQueue.length == 0)
                # Resolve any pending subcomponents of the resolved component under evaluation off-vector
                while componentResolutionContext.output.pendingSubcomponentStack.length
                    pendingSubcomponent = componentResolutionContext.output.pendingSubcomponentStack.pop()
                    pendingSubcomponent.onVector = false
                    componentResolutionContext =
                        input: pendingSubcomponent
                        output: resolveComponent pendingSubcomponent
                    resolvedComponentWorkQueue.push componentResolutionContext
                continue

            console.log "Hit the case I'm interested in."

            # ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
            if componentResolutionContext.input.addressToken.namespaceDescriptor.namespaceType != 'extensionPoint'
                throw new Error "Internal consistency check error: expected the most-recently resolved component namespace type to be an extension point."

            if componentResolutionContext.input.addressToken.idNamespace != sourceTokenQueue[0].idExtensionPoint
                throw new Error "Internal consistency check error: unexpected component found at the head of the source token queue."
            
            if componentResolutionContext.output.pendingSubcomponentStack.length and (sourceTokenQueue.length != 1)
                throw new Error "Internal consistency check error: unexpected pending subcomponent stack size. should be empty."
            # ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

            addressToken = sourceTokenQueue.shift()
            norv = componentResolutionContext.output.namedObjectResolutionVector
            parentDataReference = norv[norv.length-1].output.namespaceDataReference

            if not componentResolutionContext.output.pendingSubcomponentStack.length

                componentResolveOptions = 
                    strategy: options_.strategy # Needs some more thought
                    parentDataReference: parentDataReference
                    addressToken: addressToken
                    semanticBindingsReference: options_.address.model.getSemanticBindings()
                    propertyAssignmentObject: {}
                    onVector: true

                componentResolutionContextInner =
                    input: componentResolveOptions
                    output: resolveComponent componentResolveOptions

                resolvedComponentWorkQueue.push componentResolutionContextInner

            else

                # Complete the pending subcomponent resolutions using the next address token from the source queue off vector
                console.log "Hit the case I'm interested in."


        console.log "----------------------------------------------------------------------------"

       
        # ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        if sourceTokenQueue.length
            throw new Error "Internal consistency check error: unexpected address resolver exit with non-empty source token queue."
        if resolvedComponentVector.length != options_.address.implementation.tokenVector.length
            throw new Error "Internal consistency check error: unexpected address resolver exit with too few resolved components."
        # ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

        console.log "----------------------------------------------------------------------------"
        console.log "FINAL JSON:"
        console.log JSON.stringify options_.parentDataReference, undefined, 4
        console.log "----------------------------------------------------------------------------"
        console.log "CHANGE LOG:"
        console.log JSON.stringify dataChangeEventJournal, undefined, 4
        console.log "----------------------------------------------------------------------------"

        true            

    catch exception_
        throw new Error "resolveAddress failed: #{exception_.message}"