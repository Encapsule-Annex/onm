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

namedObjectContextHelpers = require('./onm-named-object-context')

namedObjectPropertyVisitor = require('./onm-named-object-property-visitor')

namedObjectPropertyVisitorInterfaces =
    open: require('./onm-named-object-property-policy-update')
    create: require('./onm-named-object-property-policy-initialize')
    

# ==============================================================================
module.exports = resolveNamedObject = (options_) ->
    try
        # DEBUG: Verify the base-level semantics of options_ in-paramaeter
        if not namedObjectContextHelpers.checkValidContextInput options_
            throw new Error "Internal test case failure: invalid options object in-parameter."

        # Initialize the data I/O context object shared by subroutines of the named object resolver.
        context = namedObjectContextHelpers.initializeContextObject options_

        # Obtain a reference to the specified named object.
        result = resolveNamedObjectReference context

        # Dynamically select named object property resolution policy.
        propertyResolutionPolicyInterface = namedObjectPropertyVisitorInterfaces[context.output.strategyFollowed]

        # Visit the namespace's declared properties.
        result = result and namedObjectPropertyVisitor.visitNamespaceProperties propertyResolutionPolicyInterface, context

        # Visit the namespace's declared subnamespaces.
        result = result and namedObjectPropertyVisitor.visitNamespaceChildren propertyResolutionPolicyInterface, context

        # Process remaining caller-supplied data not consumed by the previous stages.
        result = result and namedObjectPropertyVisitor.processPropertyOptions propertyResolutionPolicyInterface, context

        # Finalize the context object prior to returning results.
        result = result and namedObjectPropertyVisitor.finalizeContext propertyResolutionPolicyInterface, context

        # DEBUG: Verify the base-level semantics of the result.
        if not namedObjectContextHelpers.checkValidContextOutput context.output
            throw new Error "Internal test case failure: context.output object validation failed."

        # Return the results.
        context.output

    catch exception_
        message = "resolveNamedObject exception occurred during execution of strategy '#{options_.input.strategy}': '#{exception_.message}'."
        throw new Error message


# ==============================================================================
resolveNamedObjectReference = (context_) ->
    try
        input = context_.input
        output = context_.output
        descriptor = input.targetNamespaceDescriptor

        # FUNCTION PROLOGUE

        # Deduce and cache the named object's effective object name, or key.
        output.namespaceEffectiveKey = effectiveKey = (descriptor.namespaceType != 'component') and descriptor.jsonTag or input.targetNamespaceKey

        # Attempt to dereference an existing object of the same name in the context of the parent object.
        output.namespaceDataReference = input.parentDataReference[effectiveKey]

        # Select a strategy to follow based on the results of our attempted named object dereference.
        switch input.strategy
            when 'open'
                if not (output.namespaceDataReference? and output.namespaceDataReference)
                    throw new Error "Cannot open named object for #{descriptor.namespaceType} namespace '#{descriptor.jsonTag}'. Object does not exist."
                output.strategyFollowed = 'open'
                break
            when 'create'
                if output.namespaceDataReference? and output.namespaceDataReference
                    throw new Error "Cannot create named object for #{descriptor.namespaceType} namespace '#{descriptor.jsonTag}'. Object already exists."
                output.strategyFollowed = 'create'
                break
            when 'negotiate'
                output.strategyFollowed = output.namespaceDataReference? and output.namespaceDataReference and 'open' or 'create'
                break
            else
                throw new Error "Unrecognized named object dereference strategy '#{input.strategy}'."

        # FUNCTION EPILOGUE        

        # Exit if following 'open', or instantiate a new named object if following 'create' strategy.
        switch output.strategyFollowed
            when 'open'
                # The requested named object reference has been resolved.
                break
            when 'create'
                if not (effectiveKey? and effectiveKey and effectiveKey.length? and effectiveKey.length)
                    # TODO: FIX THIS: function call semantic should be simplified to 'create key' only
                    output.namespaceEffectiveKey = effectiveKey = input.semanticBindingsReference.setUniqueKey({}); 
                output.namespaceDataReference = input.parentDataReference[effectiveKey] = {}
                output.dataChangeEventJournal.push
                    layer: 'namedObject'
                    event: 'namedObjectCreated'
                    eventData:
                        namespaceType: descriptor.namespaceType
                        namespaceModelPath: descriptor.path
                        namespaceModelId: descriptor.id
                        key: effectiveKey
                break
        true

    catch exception_
        throw new Error "resolveNamedObjectReference failed with exception '#{exception_.message}'."


