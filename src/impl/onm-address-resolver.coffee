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

        resolvedAddressComponents = [] # The result

        sourceTokenQueue = []
        for token in options_.address.implementation.tokenVector
            sourceTokenQueue.push token.clone()

        componentResolveOptions = 
            strategy: options_.strategy
            parentDataReference: options_.parentDataReference
            addressToken: sourceTokenQueue[0]
            semanticBindingsReference: options_.address.model.getSemanticBindings()
            propertyAssignmentObject: options_.propertyAssignmentObject

        componentResolutionContext =
            input: componentResolveOptions
            output: resolveComponent componentResolveOptions
            
        resolvedComponentWorkQueue = [] 
        resolvedComponentWorkQueue.push componentResolutionContext

        while resolvedComponentWorkQueue.length

            componentResolutionContext = resolvedComponentWorkQueue.shift()


            



            # Peek the sourceTokenQueue and see if the next address token
            if resolvedComponent.namedObjectResolutionVector[0].resolvedId == sourceTokenQueue[0].idComponent

                sourceTokenQueue.shift()
                resolvedAddressComponents.push currentComponentResolution

            













        

        




        




    catch exception_
        throw new Error "resolveAddress failed: #{exception_.message}"