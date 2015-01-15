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

        namedObjectResolutionQueue = []
        targetNamedObjectResolutionResult = null

        # Resolve the data component's root named object using the requested resolution strategy.

        namedObjectResolutionQueue.push resolveNamedObject {
            strategy: context.input.strategy
            parentDataReference: context.input.parentDataReference
            targetNamespaceDescriptor: context.input.addressToken.componentDescriptor
            targetNamespaceKey: context.input.addressToken.key
            semanticBindingsReference: context.input.semanticBindingsReference
            propertyAssignmentObject: (context.input.addressToken.idComponent == context.input.addressToken.idNamespace) and context.input.propertyAssignmentObject or {}
            }

        while namedObjectResolutionQueue.length
            namedObjectResolution = namedObjectResolutionQueue.pop()



        # DEBUG: Verify the base-level semantics of the result.
        if not componentContextHelpers.checkValidContextOutput context.output
            throw new Error "Internal test case failure: context.output object validation failed."

        # Return the results.
        return context.output

    catch exception_
        message = "resolveComponent exception occurred during execution of strategy '#{options_.input.strategy}': '#{exception_.message}'."
        throw new Error message



# ==============================================================================
resolveComponentRootNamedObject = (context_) ->
    try

        options =
            strategy: context.input.strategy
            parentDataReference: context.input.parentDataReference
            targetNamespaceDescriptor: context.input.addressToken.componentDescriptor
            targetNamespaceKey: context.input.addressToken.key
            semanticBindingsReference: context.input.semanticBindingsReference
            propertyAssignmentObject: (context.input.addressToken.idComponent == context.input.addressToken.idNamespace) and context.input.propertyAssignmentObject or {}





    catch exception_
        throw new Error "resolveComponentRooNamedObject failed with exception '#{excpetion_.message}'."









