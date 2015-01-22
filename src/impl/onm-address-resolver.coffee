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

        resolvedComponentVector = [] # The result

        sourceTokenQueue = []
        for token in options_.address.implementation.tokenVector
            sourceTokenQueue.push token.clone()
        lastSourceTokenResolved = undefined

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
            
        resolvedComponentWorkQueue = [] 
        resolvedComponentWorkQueue.push componentResolutionContext

        while resolvedComponentWorkQueue.length

            componentResolutionContext = resolvedComponentWorkQueue.shift()

            onResultVector = componentResolutionContext.input.onVector? and componentResolutionContext.input.onVector or false

            if onResultVector
                resolvedComponentVector.push componentResolutionContext

            # If the resolved component under evaluation is "off vector", then its pending subcomponents
            # will also be off vector. If the source token queue is empty, then we've completed the vector
            # and are by definition "off vector". Complete "off vector" pending subcomponent resolutions
            # for the resolved component under evaluation.

            if (not onResultVector) or (sourceTokenQueue.length == 0)

                # Resolve any pending subcomponents of the resolved component under evaluation off vector
                while componentResolutionContext.output.pendingSubcomponentStack.length

                    pendingSubcomponent = componentResolutionContext.output.pendingSubcomponentStack.pop()

                    componentResolutionContext =
                        input: pendingSubcomponent
                        output: resolveComponent pendingSubcomponent
                    resolvedComponentWorkQueue.push componentResolutionContext

                continue

            # The resolved component under evaluation is itself "on vector". And, there's at least
            # one unresolved address token in the source queue. So, we need to examine the pending
            # subcomponet resolution request, determine if it's on or off the component resolution
            # vector by peeking at the source token queue, and if it is "on vector", we need to shift
            # the source token queue, modify the target namespace of the pending component resolutions
            # address token to coincide with the token target namespace, and complete the pendind
            # component resolution "on vector". Otherwise, complete the pending component resolution
            # "off vector".

            console.log "Hit the case I'm interested in."

            # At this point the component under evaluation has to be an extension point namespace.

            descriptorID = componentResolutionContext.input.addressToken.idNamespace

            headExtensionPointId = componentResolutionContext.input.addressToken.idNamespace
            nextOnVectorComponentUnderExtensionPointId = sourceTokenQueue[0].idExtensionPoint
            
            if headExtensionPointId != nextOnVectorComponentUnderExtensionPointId

                # Resolve any pending subcomponents of the resolved component under evaluation off vector
                while componentResolutionContext.output.pendingSubcomponentStack.length
                    pendingSubcomponent = componentResolutionContext.output.pendingSubcomponentStack.pop()
                    componentResolutionContext =
                        input: pendingSubcomponent
                        output: resolveComponent pendingSubcomponent
                    resolvedComponentWorkQueue.push componentResolutionContext
                continue

            while componentResolutionContext.output.pendingSubcomponentStack.length
                pendingSubcomponent = componentResolutionContext.output.pendingSubcomponentStack.pop()



        true            













        

        




        




    catch exception_
        throw new Error "resolveAddress failed: #{exception_.message}"