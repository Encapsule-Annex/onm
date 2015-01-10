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

namedObjectContextHelpers =  require('./onm-named-object-context')

namedObjectPropertyVisitor = require('./onm-named-object-property-visitor')

namedObjectPropertyVisitorInterfaces =
    open: require('./onm-named-object-property-policy-update')
    create: require('./onm-named-object-property-policy-initialize')
    

# ==============================================================================
module.exports = resolveNamedObject = (options_) ->
    try
        # Initialize the data I/O context object shared by all stages of the named object resolver.
        context = input: options_, output: {}
        namedObjectContextHelpers.initializeContextObject context

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

        # Return the results.
        context.output

    catch exception_
        policyName = propertyResolutionPolicyInterface? and propertyResolutionPolicyInterface and propertyResolutionPropertyInterface.policyName or 'not yet determined'
        message = "resolveNamespaceDescriptor failure '#{exception_.message}' while executing policy '#{policyName}'."
        throw new Error message


# ==============================================================================
resolveNamedObjectReference = (context_) ->
    try
        input = context_.input
        output = context_.output
        descriptor = input.targetNamespaceDescriptor

        # Deduce and cache the named object's effective object name, or key.
        output.namespaceEffectiveKey = effectiveKey = (descriptor.namespaceType != 'component') and descriptor.jsonTag or input.targetNamespaceKey
        # Attempt to dereference an existing object of the same name in the context of the parent object.
        output.namespaceDataReference = input.parentDataReference[effectiveKey]
        # Policy implementation based on existence and resolution strategy.
        switch input.strategy
            when 'open'
                if not (output.namespaceDataReference? and output.namespaceDataReference)
                    switch descriptor.namespaceType
                        when 'component'
                            message = "Cannot open named object '#{effectiveKey}' for component namespace '#{descriptor.jsonTag}'. Object does not exist."
                            break
                        else
                            message = "Cannot open named object for #{descriptor.namespaceType} namespace '#{descriptor.jsonTag}'. Object does not exist."
                            break
                    throw new Error message
                output.strategyFollowed = 'open'
                break
            when 'create'
                if output.namespaceDataReference? and output.namespaceDataReference
                    switch descriptor.namespaceType
                        when 'component'
                            message = "Cannot create named object '#{effectiveKey}' for component namespace '#{descriptor.jsonTag}'. Object already exists."
                            break
                        else
                            message = "Cannot create named object for #{descriptor.namespaceType} namespace '#{descriptor.jsonTag}'. Object already exists."
                            break
                    throw new Error message
                output.strategyFollowed = 'create'
                break
            when 'negotiate'
                output.strategyFollowed = output.namespaceDataReference? and output.namespaceDataReference and 'update' or 'initialize'
                break
            else
                throw new Error "Unrecognized named object dereference strategy '#{input.strategy}'."

        if output.strategyFollowed == 'create'
            if not (effectiveKey? and effectiveKey and effectiveKey.length > 0)
                # TODO: FIX THIS: function call semantic should be simplified to 'create key' only
                output.namespaceEffectiveKey = effectiveKey = input.semanticBindingsReference.setUniqueKey({}); 
            output.namespaceDataReference = input.parentDataReference[effectiveKey] = {}
            output.dataChangeEventJournal.push
                layer: 'namespace'
                event: 'namespaceCreated'
                eventData:
                    namespaceType: descriptor.namespaceType
                    jsonTag: descriptor.jsonTag
                    key: effectiveKey
        true

    catch exception_
        message = "resolveNamedObjectReference failure: #{exception_.message}."
        throw new Error message


