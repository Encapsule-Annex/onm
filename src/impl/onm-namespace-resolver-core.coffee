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
util = require('../lib-javascript')

module.exports = namespaceResolver = {}
namespaceResolver.helpers = {}
namespaceResolver.visitor = {}

# ==============================================================================
namespaceResolver.resolve = (visitorInterface_, context_) ->
    state = 'start'
    try
        result = true

        # ----------------------------------------------------------------------------
        state = 'prepareContext'
        namespaceResolver.helpers.initializeContextObject context_

        # ----------------------------------------------------------------------------
        state = 'dereferenceNamedObject'
        result = result and namespaceResolver.visitor.dereferenceNamedObject context_

        # ----------------------------------------------------------------------------
        state = '2:5::visitNamespaceProperties'
        result = result and namespaceResolver.visitor.visitNamespaceProperties visitorInterface_, context_
        # ----------------------------------------------------------------------------
        state = '3:5::visitNamespaceChildren'
        result = result and namespaceResolver.visitor.visitNamespaceChildren visitorInterface_, context_
        # ----------------------------------------------------------------------------
        state = '4:5::processPropertyOptions'
        result = result and namespaceResolver.visitor.processPropertyOptions visitorInterface_, context_
        # ----------------------------------------------------------------------------
        state = '5:5::finalizeContext'
        result = result and namespaceResolver.visitor.finalizeContext visitorInterface_, context_

        context_.output

    catch exception_
        message = "resolveNamespaceDescriptor failed in state '#{state}' while executing policy '#{visitorInterface_.policyName}': #{exception_.message}"
        throw new Error message

# ==============================================================================
namespaceResolver.visitor.dereferenceNamedObject = (context_) ->
    input = context_.input
    output = context_.output
    output.resolutionStrategy = 'error'
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
            output.resolutionStrategy = 'open'
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
            output.resolutionStrategy = 'create'
            break
        when 'negotiate'
            output.resolutionStrategy = output.namespaceDataReference? and output.namespaceDataReference and 'open' or 'create'
            break
        else
            throw new Error "Unrecognized named object dereference strategy '#{input.strategy}'."

    if output.resolutionStrategy == 'create'
        if not (effectiveKey? and effectiveKey and effectiveKey.length > 0)
            # FIX THIS (function call semantic should be simplified to 'create key' only)
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
            result = visitorInterface_.processNamespaceProperty context_, propertyName, propertyDeclaration
    if propertiesDeclaration.userMutable? and propertiesDeclaration.userMutable
        for propertyName, propertyDeclaration of propertiesDeclaration.userMutable
            if not result then break
            result = visitorInterface_.processNamespaceProperty context_, propertyName, propertyDeclaration
    result

# ==============================================================================
namespaceResolver.visitor.visitNamespaceChildren = (visitorInterface_, context_) ->
    if not (visitorInterface_.processSubnamespace? and visitorInterface_.processSubnamespace) then return true
    result = true
    namespaceDescriptor = namespaceResolver.helpers.getNamespaceDescriptorFromContext context_
    for childNamespaceDescriptor in namespaceDescriptor.children
        if not result then break
        result = visitorInterface_.processSubnamespace context_, childNamespaceDescriptor
    result

# ==============================================================================
namespaceResolver.visitor.processPropertyOptions = (visitorInterface_, context_) ->
    visitorInterface_.processPropertyOptions? and visitorInterface_.processPropertyOptions and visitorInterface_.processPropertyOptions(context_) or true

# ==============================================================================
namespaceResolver.visitor.finalizeContext = (visitorInterface_, context_) ->
    visitorInterface_.finalizeContext? and visitorInterface_.finalizeContext and visitorInterface_.finalizeContext(context_) or true

# ==============================================================================
namespaceResolver.helpers.initializeContextObject = (context_) ->

    context_.input =
        strategy: context_.input.strategy? and context_.input.strategy or 'error'
        parentDataReference: context_.input.parentDataReference
        targetNamespaceDescriptor: context_.input.targetNamespaceDescriptor
        targetNamespaceKey: context_.input.targetNamespaceKey
        semanticBindingsReference: context_.input.semanticBindingsReference
        propertyAssignmentObject: context_.input.propertyAssignmentObject? and context_.input.propertyAssignmentObject and
            util.clone(context_.input.propertyAssignmentObject) or {}

    context_.output =
        resolutionStrategy: 'error'
        namespaceEffectiveKey: null
        namespaceDataReference: null
        dataChangeEventJournal: []
        pendingNamespaceDescriptors: [] # TODO: pick a better name for this

    context_

# ==============================================================================
namespaceResolver.helpers.getNamespaceDescriptorFromContext = (context_) ->
    context_.input.targetNamespaceDescriptor

# ==============================================================================
namespaceResolver.helpers.checkValidDescriptorResolveOptions = (options_, isOpenResolve_) ->

    if not (options_? and options_)
        console.log("Missing options.")
        return false

    if not (options_.parentDataReference? and options_.parentDataReference)
        console.log("Invalid parentDataReference.")
        return false

    if not (options_.targetNamespaceDescriptor? and options_.targetNamespaceDescriptor)
        console.log("Invalid targetNamespaceDescriptor.")
        return false

    if not (options_.targetNamespaceDescriptor.jsonTag? and options_.targetNamespaceDescriptor.jsonTag)
        console.log("Invalid targetNamespaceDescriptor.")
        return false

    if isOpenResolve_? and isOpenResolve_
        return true

    keyValid = true
    if options_.targetNamespaceKey? and options_.targetNamespaceKey
        keyValid = options_.targetNamespaceKey.length > 0 or false

    if not keyValid
        console.log("Invalid targetNamespaceKey.")
        return false

    if not (options_.semanticBindingsReference? and options_.semanticBindingsReference)
        console.log("Invalid semanticBindingsReference.")
        return false

    if not (options_.propertyAssignmentObject? and options_.propertyAssignmentObject)
        console.log("Invalid propertyAsssignmentObject.")
        return false

    true

# ==============================================================================
namespaceResolver.helpers.checkValidDescriptorResolveResults = (results_) ->
    if not (results_? and results_)
        console.log "Missing results"
        return false
    if not (results_.namespaceEffectiveKey? and results_.namespaceEffectiveKey)
        console.log "Invalid namespaceEffectiveKey"
        return false
    if not (results_.namespaceDataReference? and results_.namespaceDataReference)
        console.log "Invalid namespaceDataReference"
        return false
    if not (results_.pendingNamespaceDescriptors? and results_.pendingNamespaceDescriptors and Array.isArray(results_.pendingNamespaceDescriptors))
        console.log "Invalid pendingNamespaceDescriptors"
        return false
    return true

