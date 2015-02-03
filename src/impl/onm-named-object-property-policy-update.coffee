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

propertyCommonLib = require './onm-named-object-property-policy-common'

module.exports =

    ### open existing namespace policy implementation
    - open existing namespace
    - throw if namespace does not exist
    - write declared property values specified in caller-provided data
    - visit declared child namespaces and queue deferred resolves based on caller-provided data only
    - overlay namespace data with remaining, caller-provided properties
    ###

    policyName: 'update exisiting namespace properties'

    # ----------------------------------------------------------------------------
    processNamespaceProperty: (context_, name_, declaration_) ->
        input = context_.input
        output = context_.output
        if not (input.propertyAssignmentObject? and input.propertyAssignmentObject)
            return true
        value = input.propertyAssignmentObject[name_]
        if not propertyCommonLib.checkValidPropertyValue value
            return true
        delete context_.input.propertyAssignmentObject[name_]
        output = context_.output
        output.namespaceDataReference[name_] = value
        output.dataChangeEventJournal.push
            layer: 'namedObject'
            event: 'propertyUpdated'
            eventData:
                name: name_
                model: true
                value: JSON.stringify(value)
                source: 'data'
        true

    # ----------------------------------------------------------------------------
    processSubnamespace: (context_, descriptor_) ->

        propertyAssignmentObject = context_.input.propertyAssignmentObject
        switch descriptor_.namespaceType
            when 'component'
                deleteKeyNames = []
                for keyName, subcomponentPropertyAssignmentObject of propertyAssignmentObject
                    if not propertyCommonLib.checkValidNamedObject subcomponentPropertyAssignmentObject
                        throw new Error "Caller data framing error: Expected '#{keyName}' to be a named object but instead found type '#{Object.prototype.toString.call(subcomponentPropertyAssignmentObject)}'."
                    deleteKeyNames.push keyName
                    context_.output.pendingResolutionStack.push
                        parentDataReference: context_.output.namespaceDataReference
                        targetNamespaceDescriptor: descriptor_
                        targetNamespaceKey: keyName
                        semanticBindingsReference: context_.input.semanticBindingsReference
                        propertyAssignmentObject: subcomponentPropertyAssignmentObject? and subcomponentPropertyAssignmentObject or {}
                        strategy: 'negotiate'
                while deleteKeyNames.length
                    delete context_.input.propertyAssignmentObject[deleteKeyNames.pop()]
                break
            else
                subcomponentPropertyAssignmentObject = propertyAssignmentObject[descriptor_.jsonTag]
                if subcomponentPropertyAssignmentObject? and subcomponentPropertyAssignmentObject
                    if not propertyCommonLib.checkValidNamedObject subcomponentPropertyAssignmentObject
                        throw new Error "Caller data framing error: Expected '#{keyName}' to be a named object but instead found type '#{Object.prototype.toString.call(subcomponentPropertyAssignmentObject)}'."
                    context_.output.pendingResolutionStack.push
                        parentDataReference: context_.output.namespaceDataReference
                        targetNamespaceDescriptor: descriptor_
                        targetNamespaceKey: keyName
                        semanticBindingsReference: context_.input.semanticBindingsReference
                        propertyAssignmentObject: subcomponentPropertyAssignmentObject
                        strategy: context_.output.strategyFollowed
                    delete context_.input.propertyAssignmentObject[descriptor_.jsonTag]
                break
        true

    # ----------------------------------------------------------------------------
    processPropertyOptions: (context_) ->
        deleteKeyNames = []
        input = context_.input
        output = context_.output
        for propertyName, subObject of input.propertyAssignmentObject
            if not propertyCommonLib.checkValidPropertyValue subObject
                throw new Error "Invalid value for assignment to property name '#{propertyName}'."
            output.namespaceDataReference[propertyName] = subObject
            deleteKeyNames.push propertyName
            output.dataChangeEventJournal.push
                layer: 'namedObject'
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
        true



