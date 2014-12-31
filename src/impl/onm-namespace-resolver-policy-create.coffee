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

policyCommon = require('./onm-namespace-resolver-policy-common')

module.exports =

    ### create new namespace policy implementation
    - create new namespace
    - throw if namespace already exists
    - initialize all declared namespace properties to value (first):
      1. caller-provided value
      2. declared default value
    - visit declared subnamespaces and queue deferred resolves based on data model and caller-supplied data
    - overlay namespace data with remaining, caller-provided properties
    ###

    # ----------------------------------------------------------------------------
    policyName: 'create new namespace'

    # ----------------------------------------------------------------------------
    initializeContext: (context_, options_) ->
        # Default initialize context_.input object from the specified options_ object.
        policyCommon.initializeContextInput context_, options_
        # Default initialize the context_.output object.
        policyCommon.initializeContextOutput context_
        true
 
    # ----------------------------------------------------------------------------
    dereferenceNamedObject: (context_) ->
        descriptor = context_.input.targetNamespaceDescriptor
        resolveResults = context_.output
        resolveResults.namespaceEffectiveKey = effectiveKey = (descriptor.namespaceType != 'component') and descriptor.jsonTag or context_.input.targetNamespaceKey
        resolveResults.namespaceDataReference = context_.input.parentDataReference[effectiveKey]
        if resolveResults.namespaceDataReference? and resolveResults.namespaceDataReference
            message = "Cannot re-create named object '#{effectiveKey}' for data model path '#{descriptor.path}'."
            throw new Error message
        if not (effectiveKey? and effectiveKey and effectiveKey.length > 0)
            resolveResults.namespaceEffectiveKey = effectiveKey = context_.input.semanticBindingsReference.setUniqueKey({}); # FIX THIS (function call semantic should be simplified to 'create key' only)
        resolveResults.namespaceDataReference = context_.input.parentDataReference[effectiveKey] = {}

        resolveResults.dataChangeEventJournal.push
            layer: 'namespace'
            event: 'namespaceCreated'
            eventData:
                namespaceType: descriptor.namespaceType
                jsonTag: descriptor.jsonTag
                key: effectiveKey


        true

    # ----------------------------------------------------------------------------
    processNamespaceProperty: (name_, declaration_, context_) ->
        value = context_.input.propertyAssignmentObject[name_]
        valueFromCallerData = false
        if value? and value
            delete context_.input.propertyAssignmentObject[name_]
            valueFromCallerData = true
        else
            value = declaration_.defaultValue
            if not (value? and value)
                value = declaration_.fnCreate? and declaration_.fnCreate and declaration_.fnCreate()
                if not (value? and value)
                    throw new Error "Cannot deduce property value for assignment for name '#{name_}'"

        output = context_.output
        output.namespaceDataReference[name_] = value

        output.dataChangeEventJournal.push
            layer: 'namespace'
            event: 'propertyInitialized'
            eventData:
                name: name_
                model: true
                value: JSON.stringify(value)
                source: valueFromCallerData and 'data' or 'model'

        true

    # ----------------------------------------------------------------------------
    processSubnamespace: (descriptor_, context_) ->
        propertyAssignmentObject = context_.input.propertyAssignmentObject
        switch descriptor_.namespaceType
            when 'component'
                deleteKeyNames = []
                for keyName, subcomponentPropertyAssignmentObject of propertyAssignmentObject
                    deleteKeyNames.push keyName
                    context_.output.pendingNamespaceDescriptors.push {
                        parentDataReference: context_.output.namespaceDataReference
                        targetNamespaceDescriptor: descriptor_
                        targetNamespaceKey: keyName
                        semanticBindingsReference: context_.input.semanticBindingsReference
                        propertyAssignmentObject: subcomponentPropertyAssignmentObject? and subcomponentPropertyAssignmentObject or {}
                    }
                while deleteKeyNames.length
                    delete context_.input.propertyAssignmentObject[deleteKeyNames.pop()]
                break
            else
                subcomponentPropertyAssignmentObject = propertyAssignmentObject[descriptor_.jsonTag]
                if subcomponentPropertyAssignmentObject? and subcomponentPropertyAssignmentObject
                    delete context_.input.propertyAssignmentObject[childNamespaceDescriptor.jsonTag]
                else
                    subcomponentPropertyAssignmentObject = {}
                context_.output.pendingNamespaceDescriptors.push {
                    parentDataReference: context_.output.namespaceDataReference
                    targetNamespaceDescriptor: descriptor_
                    targetNamespaceKey: ''
                    semanticBindingsReference: context_.input.semanticBindingsReference
                    propertyAssignmentObject: subcomponentPropertyAssignmentObject
                }
                break
        true

    # ----------------------------------------------------------------------------
    processPropertyOptions: (context_) ->
        deleteKeyNames = []
        input = context_.input
        output = context_.output
        for propertyName, subObject of input.propertyAssignmentObject
            output.namespaceDataReference[propertyName] = subObject
            deleteKeyNames.push propertyName
            output.dataChangeEventJournal.push
                layer: 'namespace'
                event: 'propertyInitialized'
                eventData:
                    name: propertyName
                    model: false
                    value: JSON.stringify(subObject)
                    source: 'data'

        while deleteKeyNames.length
            delete input.propertyAssignmentObject[deleteKeyNames.pop()]

        true

    # ----------------------------------------------------------------------------
    finalizeContext: (context_) ->
        output = context_.output
        true

