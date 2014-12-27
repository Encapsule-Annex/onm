###
------------------------------------------------------------------------------

The MIT License (MIT)

Copyright (c) 2014 Encapsule Project
  
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

module.exports = namespaceResolver = {}
namespaceResolver.helpers = {}
namespaceResolver.visitor = {}

# ==============================================================================
namespaceResolver.resolve = (visitorInterface_, context_) ->
    state = '0:0::start'
    try
        result = true

        # ----------------------------------------------------------------------------
        state = '0:5::prepareContext'
        result = result and namespaceResolver.visitor.initializeContext(visitorInterface_, context_)
        # ----------------------------------------------------------------------------
        state = '1:5::dereferenceNamedObject'
        result = result and namespaceResolver.visitor.dereferenceNamedObject(visitorInterface_, context_)
        # ----------------------------------------------------------------------------
        state = '2:5::visitNamespaceProperties'
        result = result and namespaceResolver.visitor.visitNamespaceProperties(visitorInterface_, context_)
        # ----------------------------------------------------------------------------
        state = '3:5::visitNamespaceChildren'
        result = result and namespaceResolver.visitor.visitNamespaceChildren(visitorInterface_, context_)
        # ----------------------------------------------------------------------------
        state = '4:5::processPropertyOptions'
        result = result and namespaceResolver.visitor.processPropertyOptions(visitorInterface_, context_)
        # ----------------------------------------------------------------------------
        state = '5:5::finalizeContext'
        result = result and namespaceResolver.visitor.finalizeContext(visitorInterface_, context_)

        result

    catch exception_
        message = "resolveNamespaceDescriptor failed in state '#{state}' while executing policy '#{visitorInterface_.policyName}': #{exception_.message}"
        throw new Error message

# ==============================================================================
namespaceResolver.helpers.getNamespaceDescriptorFromContext = (context_) ->
    context_.options.targetNamespaceDescriptor

# ==============================================================================
namespaceResolver.visitor.initializeContext = (visitorInterface_, context_) ->
    visitorInterface_.initializeContext context_

# ==============================================================================
namespaceResolver.visitor.dereferenceNamedObject = (visitorInterface_, context_) ->
   visitorInterface_.dereferenceNamedObject context_

# ==============================================================================
namespaceResolver.visitor.visitNamespaceProperties = (visitorInterface_, context_) ->
    if not (visitorInterface_.processNamespaceProperty? and visitorInterface_.processNamespaceProperty) then return true
    namespaceDescriptor = namespaceResolver.helpers.getNamespaceDescriptorFromContext context_
    if (namespaceDescriptor.namespaceType == 'extensionPoint') then return true
    result = true
    propertiesDeclaration = namespaceDescriptor.namespaceModelPropertiesDeclaration
    if propertiesDeclaration.userImmutable? and propertiesDeclaration.userImmutable
        for propertyName, propertyDeclaration of propertiesDeclaration.userImmutable
            if not result then break
            result = visitorInterface_.processNamespaceProperty propertyName, propertyDeclaration, context_
    if propertiesDeclaration.userMutable? and propertiesDeclaration.userMutable
        for propertyName, propertyDeclaration of propertiesDeclaration.userMutable
            if not result then break
            result = visitorInterface_.processNamespaceProperty propertyName, propertyDeclaration, context_
    result

# ==============================================================================
namespaceResolver.visitor.visitNamespaceChildren = (visitorInterface_, context_) ->
    if not (visitorInterface_.processSubnamespace? and visitorInterface_.processSubnamespace) then return true
    result = true
    namespaceDescriptor = namespaceResolver.helpers.getNamespaceDescriptorFromContext context_
    for childNamespaceDescriptor in namespaceDescriptor.children
        if not result then break
        result = visitorInterface_.processSubnamespace(childNamespaceDescriptor, context_)
    result

# ==============================================================================
namespaceResolver.visitor.processPropertyOptions = (visitorInterface_, context_) ->
    visitorInterface_.processPropertyOptions? and visitorInterface_.processPropertyOptions and visitorInterface_.processPropertyOptions(context_) or true

# ==============================================================================
namespaceResolver.visitor.finalizeContext = (visitorInterface_, context_) ->
    visitorInterface_.finalizeContext? and visitorInterface_.finalizeContext and visitorInterface_.finalizeContext(context_) or true




