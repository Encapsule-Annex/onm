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

namespaceResolverContext = require('./onm-namespace-resolver-context')

namedObjectResolver = require('./onm-named-object-resolver')
namedObjectPropertyResolver = require('./onm-named-object-property-resolver')

module.exports = namespaceResolver = {}

propertyResolutionPolicyInterfaces =
    open: require('./onm-namespace-resolver-policy-open')
    create: require('./onm-namespace-resolver-policy-create')


# ==============================================================================
namespaceResolver.resolve = (context_) ->
    state = 'start'
    try
        result = true

        # ----------------------------------------------------------------------------
        state = 'prepareContext'
        namespaceResolverContext.initializeContextObject context_

        # ----------------------------------------------------------------------------
        state = 'resolveNamedObject'
        result = namedObjectResolver.resolve context_

        propertyResolutionPolicyInterface = propertyResolutionPolicyInterfaces[context_.output.resolutionStrategy]
        if not (propertyResolutionPolicyInterface? and propertyResolutionPolicyInterface)
            throw new Error "Internal error: no named object property initialization policy interface is available."

        # ----------------------------------------------------------------------------
        state = 'visitNamespaceProperties'
        result = result and namedObjectPropertyResolver.visitNamespaceProperties propertyResolutionPolicyInterface, context_

        # ----------------------------------------------------------------------------
        state = 'visitNamespaceChildren'
        result = result and namedObjectPropertyResolver.visitNamespaceChildren propertyResolutionPolicyInterface, context_

        # ----------------------------------------------------------------------------
        state = 'processPropertyOptions'
        result = result and namedObjectPropertyResolver.processPropertyOptions propertyResolutionPolicyInterface, context_

        # ----------------------------------------------------------------------------
        state = 'finalizeContext'
        result = result and namedObjectPropertyResolver.finalizeContext propertyResolutionPolicyInterface, context_

        context_.output

    catch exception_
        message = "resolveNamespaceDescriptor failed in state '#{state}' while executing policy '#{propertyResolutionPolicyInterface.policyName}': #{exception_.message}"
        throw new Error message
