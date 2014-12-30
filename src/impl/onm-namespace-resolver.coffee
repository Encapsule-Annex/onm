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

namespaceResolverCore = require('./onm-namespace-resolver-core')
openPolicyBinding = require('./onm-namespace-resolver-open-policy')
createPolicyBinding = require('./onm-namespace-resolver-create-policy')

module.exports =
    resolveNamespaceDescriptorOpen: (options_) ->
        namespaceResolverCore.resolve openPolicyBinding, options_


    resolveNamespaceDescriptorCreate: (options_) ->
        namespaceResolverCore.resolve createPolicyBinding, options_
        

# legacy

implementation = require './onm-namespace-resolver-impl'
util = require('../../index').util

resolveOpenNamespaceDescriptor = require('./onm-namespace-resolver.open').resolveOpenNamespaceDescriptor




oldImplementation =

    # ==============================================================================
    resolveNamespaceDescriptorOpen: (options_) ->
        try
            if not implementation.checkValidDescriptorResolveOptions options_, true
                throw new Error("Invalid descriptor resolve options.")

            # resolveNamespaceDescriptorOpen is a policy wrapper around resolveNamespaceDescriptorOpenImpl.
            resolveResults = resolveOpenNamespaceDescriptor options_

            # Policy implementation: throw if object implied by namespace descriptor does not exist.
            if not (resolveResults.namespaceDataReference? and resolveResults.namespaceDataReference)
                resourceString = @createResourceString options_, resolveResults
                throw new Error "Cannot open expected child object in data: #{resourceString}"
                
            resolveResults

        catch exception_
            throw new Error("resolveNamespaceDescriptorOpen failure: #{exception_.message}")

    # ==============================================================================
    resolveNamespaceDescriptorCreate: (options_) ->
        try
            if not implementation.checkValidDescriptorResolveOptions options_
                throw new Error("Invalid descriptor resolve options.")

            # Determine if an object of that name already exists in the store data.
            resolveResults = resolveOpenNamespaceDescriptor options_

            # Policy implementation: throw if object implied by namespace descriptor already exists.

            if resolveResults.namespaceDataReference? and resolveResults.namespaceDataReference
                resourceString = @createResourceString options_, resolveResults
                throw new Error "Child object already exists in data: #{resourceString}"

            effectiveKeyValue = ((options_.targetNamespaceDescriptor.namespaceType != 'component') and options_.targetNamespaceDescriptor.jsonTag) or undefined
            if not (effectiveKeyValue? and effectiveKeyValue)
                effectiveKeyValue = options_.propertyAssignmentObject[options_.semanticBindingsReference.keyPropertyName]
                if effectiveKeyValue? and effectiveKeyValue
                    if options_.targetNamespaceKey? and options_.targetNamespaceKey and 
                        options_.targetNamespaceKey.length and (effectiveKeyValue != options_.targetNamespaceKey)
                            throw new Error "Contradictory onm component key values '#{effectiveKeyValue}' !== '#{options_.targetNamespaceKey}'."
                else
                    effectiveKeyValue = options_.targetNamespaceKey
                    if not (effectiveKeyValue? and effectiveKeyValue and (effectiveKeyValue.length > 0))
                        # TODO: UPDATE THIS CALL WITH NEW SEMANTIC BINDINGS GETUNIQUEKEY
                        effectiveKeyValue = options_.semanticBindingsReference.setUniqueKey({});

            # record the namespace's assigned, or effective, key value
            resolveResults.namespaceEffectiveKey = effectiveKeyValue? and effectiveKeyValue and
                effectiveKeyValue.length and effectiveKeyValue or
                throw new Error "INTERNAL ERROR deriving namespace effective key value."

            # create the namespace
            resolveResults.namespaceDataReference = options_.parentDataReference[effectiveKeyValue] = {}

            # Iff component namespace, set the key property.
            if (options_.targetNamespaceDescriptor.namespaceType == 'component') or (options_.targetNamespaceDescriptor.namespaceType =='root')
                resolveResults.namespaceDataReference[options_.semanticBindingsReference.keyPropertyName] = effectiveKeyValue

            # Assign the namespace's declared property values.
            propertiesDeclaration = options_.targetNamespaceDescriptor.namespaceModelPropertiesDeclaration

            propertyAssignmentObject = util.clone options_.propertyAssignmentObject

            if propertiesDeclaration.userImmutable? and propertiesDeclaration.userImmutable
                for memberName, functions of propertiesDeclaration.userImmutable
                    if resolveResults.namespaceDataReference[memberName]
                        continue
                    # Determine if the declared property has a value in the property assignment object.
                    effectiveValue = propertyAssignmentObject[memberName]
                    if effectiveValue? and effectiveValue
                        delete propertyAssignmentObject[memberName]
                    else
                        effectiveValue = (functions.defaultValue? and functions.defaultValue) or
                            (functions.fnCreate? and functions.fnCreate and functions.fnCreate()) or
                            throw new Error "Internal error: Unable to deduce initialization method from data model for property '#{memberName}'."
                    resolveResults.namespaceDataReference[memberName] = effectiveValue

            if propertiesDeclaration.userMutable? and propertiesDeclaration.userMutable
                for memberName, functions of propertiesDeclaration.userMutable
                    if resolveResults.namespaceDataReference[memberName]
                        continue
                    # Determine if the declared property has a value in the property assignment object.
                    effectiveValue = propertyAssignmentObject[memberName]
                    if effectiveValue? and effectiveValue
                        delete propertyAssignmentObject[memberName]
                    else
                        if functions.fnCreate? and functions.fnCreate
                            effectiveValue = functions.fnCreate()
                        else
                            effectiveValue = functions.defaultValue
                    resolveResults.namespaceDataReference[memberName] = effectiveValue

            # Process the target namespace's declared subnamespaces and queue deferred operations.
            for childNamespaceDescriptor in options_.targetNamespaceDescriptor.children
                # Every declared child namespace is queued for deferred processing.
                switch childNamespaceDescriptor.namespaceType

                    when 'component'

                        # Interpret remaining properties on property assignment object as subcomponents key values.
                        # For each named object in the property assignment object, queue a deferred descriptor
                        # resolve operations
                        deleteKeyNames = []

                        for keyName, subcomponentPropertyAssignmentObject of propertyAssignmentObject

                            pendingDescriptorResolveOptions =
                                parentDataReference: resolveResults.namespaceDataReference
                                targetNamespaceDescriptor: childNamespaceDescriptor
                                targetNamespaceKey: keyName
                                semanticBindingsReference: options_.semanticBindingsReference
                                propertyAssignmentObject: subcomponentPropertyAssignmentObject? and subcomponentPropertyAssignmentObject or {}
                            resolveResults.pendingNamespaceDescriptors.push pendingDescriptorResolveOptions
                            deleteKeyNames.push keyName

                        while deleteKeyNames.length
                            delete propertyAssignmentObject[deleteKeyNames.pop()]
                        break

                    else

                        # child namespaces of declared types 'child' and 'extensionPoint'.
                        # Default construct the deferred descriptor resolve options object.
                        subcomponentPropertyAssignmentObject = propertyAssignmentObject[childNamespaceDescriptor.jsonTag]? and
                            propertyAssignmentObject[childNamespaceDescriptor.jsonTag] or {}
                        pendingDescriptorResolveOptions =
                            parentDataReference: resolveResults.namespaceDataReference
                            targetNamespaceDescriptor: childNamespaceDescriptor
                            targetNamespaceKey: ''
                            semanticBindingsReference: options_.semanticBindingsReference
                            propertyAssignmentObject: propertyAssignmentObject[childNamespaceDescriptor.jsonTag]
                        resolveResults.pendingNamespaceDescriptors.push pendingDescriptorResolveOptions
                        delete propertyAssignmentObject[childNamespaceDescriptor.jsonTag]
                        break

            # Graft remaining properies on the assignment object on to the child object.
            deleteKeys = []
            for propertyName, subObject of propertyAssignmentObject
                resolveResults.namespaceDataReference[propertyName] = subObject
                deleteKeys.push propertyName
            while deleteKeys.length
                delete propertyAssignmentObject[deleteKeys.pop()]

            resolveResults

        catch exception_
            throw new Error("resolveNamespaceDescriptorCreate failure on decriptor '#{options_.targetNamespaceDescriptor.jsonTag}': #{exception_.message}")


