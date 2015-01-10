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

# ============================================================================
module.exports =

    # ==============================================================================
    resolveNamespaceDescriptorOpen: (options_) ->
        if options_? and options_
            options_.strategy = 'open'
        resolveNamespaceDescriptor options_

    # ==============================================================================
    resolveNamespaceDescriptorCreate: (options_) ->
        if options_? and options_
            options_.strategy = 'create'
        resolveNamespaceDescriptor options_


# IMPLEMENTATION
# ============================================================================

# Dependencies
namedObjectResolver = require('./onm-named-object-resolver')
namedObjectPropertyResolver = require('./onm-named-object-property-resolver')
namespaceResolverContext = require('./onm-namespace-resolver-context')

# Look-up table keyed by the name of the named object resolution strategy
# used to resolve the named object reference.

propertyResolutionPolicyInterfaces =
    open: require('./onm-named-object-property-policy-update')
    create: require('./onm-named-object-property-policy-initialize')


# ==============================================================================
resolveNamespaceDescriptor = (options_) ->
    try
        context = input: options_, output: {}
        result = true

        # Perform generic initialization of the context paramater.
        state = 'prepareContext'
        namespaceResolverContext.initializeContextObject context

        # Obtain a reference to the specified named object.
        state = 'resolveNamedObject'
        result = namedObjectResolver.resolve context

        # Dynamically select named object property resolution policy.
        propertyResolutionPolicyInterface = propertyResolutionPolicyInterfaces[context.output.strategyFollowed]

        # Visit the namespace's declared properties.
        state = 'visitNamespaceProperties'
        result = result and namedObjectPropertyResolver.visitNamespaceProperties propertyResolutionPolicyInterface, context

        # Visit the namespace's declared subnamespaces.
        state = 'visitNamespaceChildren'
        result = result and namedObjectPropertyResolver.visitNamespaceChildren propertyResolutionPolicyInterface, context

        # Process remaining caller-supplied data not consumed by the previous stages.
        state = 'processPropertyOptions'
        result = result and namedObjectPropertyResolver.processPropertyOptions propertyResolutionPolicyInterface, context

        # Finalize the context object prior to returning results.
        state = 'finalizeContext'
        result = result and namedObjectPropertyResolver.finalizeContext propertyResolutionPolicyInterface, context

        # Return the results.
        context.output

    catch exception_
        policyName = propertyResolutionPolicyInterface? and propertyResolutionPolicyInterface and propertyResolutionPropertyInterface.policyName or 'not yet determined'
        message = "resolveNamespaceDescriptor failed in state '#{state}' while executing policy '#{policyName}': #{exception_.message}"
        throw new Error message


