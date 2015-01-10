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

namespaceResolverContext = require('./onm-named-object-context')

module.exports = namedObjectPropertyResolver = {}

# ==============================================================================
namedObjectPropertyResolver.visitNamespaceProperties = (resolutionPolicyInterface_, context_) ->
    if not (resolutionPolicyInterface_.processNamespaceProperty? and resolutionPolicyInterface_.processNamespaceProperty) then return true
    namespaceDescriptor = namespaceResolverContext.getNamespaceDescriptorFromContext context_
    if (namespaceDescriptor.namespaceType == 'extensionPoint') then return true
    result = true
    propertiesDeclaration = namespaceDescriptor.namespaceModelPropertiesDeclaration
    if propertiesDeclaration.userImmutable? and propertiesDeclaration.userImmutable
        for propertyName, propertyDeclaration of propertiesDeclaration.userImmutable
            if not result then break
            result = resolutionPolicyInterface_.processNamespaceProperty context_, propertyName, propertyDeclaration
    if propertiesDeclaration.userMutable? and propertiesDeclaration.userMutable
        for propertyName, propertyDeclaration of propertiesDeclaration.userMutable
            if not result then break
            result = resolutionPolicyInterface_.processNamespaceProperty context_, propertyName, propertyDeclaration
    result

# ==============================================================================
namedObjectPropertyResolver.visitNamespaceChildren = (resolutionPolicyInterface_, context_) ->
    if not (resolutionPolicyInterface_.processSubnamespace? and resolutionPolicyInterface_.processSubnamespace) then return true
    result = true
    namespaceDescriptor = namespaceResolverContext.getNamespaceDescriptorFromContext context_
    for childNamespaceDescriptor in namespaceDescriptor.children
        if not result then break
        result = resolutionPolicyInterface_.processSubnamespace context_, childNamespaceDescriptor
    result

# ==============================================================================
namedObjectPropertyResolver.processPropertyOptions = (resolutionPolicyInterface_, context_) ->
    resolutionPolicyInterface_.processPropertyOptions? and resolutionPolicyInterface_.processPropertyOptions and resolutionPolicyInterface_.processPropertyOptions(context_) or true

# ==============================================================================
namedObjectPropertyResolver.finalizeContext = (resolutionPolicyInterface_, context_) ->
    resolutionPolicyInterface_.finalizeContext? and resolutionPolicyInterface_.finalizeContext and resolutionPolicyInterface_.finalizeContext(context_) or true