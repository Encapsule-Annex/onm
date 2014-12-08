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

A namespace descriptor is a low-level, should-be-viewed-as-frozen object
maintained by onm.Model used to cache details about a specific namespace
declaration in an onm data model.

Namespace descriptor objects are the basis of AddressToken object implementation,
and are ultimately the source of truth when it comes to opening or creating
specifc JavaScript object references within the scope of an onm.Store object.

Recall that a "namespace" in the parlance of onm is a generic moniker for a
named JavaScript object that has one of several onm-defined possible object roles
assigned via its 'namespaceType' property value declaration.

Generically, this module implements the low-level policy over the opening
(i.e. the resolution of onm.Address resource locators against a specific
onm.Store addressable, in-memory data store), and the creation (i.e. allocation
and initialization via multi-way priority merge algorithm) of data namespaces
within the scope of an onm.Store.

onm.Store -> delegates to...
onm.Namespace -> delegates to ...
omm.AddressTokenResolver -> delegates to...
onm.NamespaceDescriptorResolver -> this module gets it done

------------------------------------------------------------------------------

###
#
#
#


implementation = require './onm-descriptor-resolve-impl'

module.exports =


    # ****************************************************************************
    # ****************************************************************************
    # ****************************************************************************
    # Main API
    #
    #

    # ==============================================================================
    resolveNamespaceDescriptorOpen: (options_) ->
        try
            if not implementation.checkValidDescriptorResolveOptions options_, true
                throw new Error("Invalid descriptor resolve options.")

            # resolveNamespaceDescriptorOpen is a policy wrapper around resolveNamespaceDescriptorOpenImpl.
            resolveResults = @resolveNamespaceDescriptorOpenImpl options_

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
            resolveResults = @resolveNamespaceDescriptorOpenImpl options_

            # Policy implementation: throw if object implied by namespace descriptor already exists.
            if resolveResults.namespaceDataReference? and resolveResults.namespaceDataReference
                resourceString = @createResourceString options_, resolveResults
                throw new Error "Child object already exists in data: #{resourceString}"

            # Create the requested named child object without regard to namespace type.
            resolveResults.namespaceDataReference = options_.parentDataReference[resolveResults.namespaceEffectiveKey] = {}

            # Assign the child object's onm key property iff 'root' or 'component' namespace type.
            switch options_.targetNamespaceDescriptor.namespaceType
                when 'root' or 'component'
                    # Determine if the propertyAssignmentObject contains an onm component key value.
                    effectiveKeyValue = undefined
                    assignmentKeyValue = options_.semanticBindingsReference.getUniqueKey(options_.propertyAssignmentObject)
                    if assignmentKeyValue? and assignmentKeyValue
                        if options_.targetNamespaceKey and (options_.targetNamespaceKey != assignmentKeyValue)
                            resourceString = @createResourceString options_, resolveResults
                            throw new Error "Contradictory onm component key values '#{assignmentKeyValue}' !== '#{options_.targetNamespaceKey}'."
                        delete options_.propertyAssignmentObject[options_.semanticBindingsReference.keyPropertyName]
                    effectiveKeyValue = assignmentKeyValue or options_.targetNamespaceKey or undefined
                    assignedKeyValue = options_.semanticBindingsReference.setUniqueKey(resolveResults.namespaceDataReference, effectiveKeyValue)
                    break
                else
                    break

            # Assign the namespace's declared property values.
            propertiesDeclaration = options_.targetNamespaceDescriptor.namespaceModelPropertiesDeclaration
            if propertiesDeclaration.userImmutable? and propertiesDeclaration.userImmutable
                for memberName, functions of propertiesDeclaration.userImmutable
                    if resolveResults.namespaceDataReference[memberName]
                        continue
                    # Determine if the declared property has a value in the property assignment object.
                    effectiveValue = options_.propertyAssignmentObject[memberName]
                    if effectiveValue? and effectiveValue
                        delete options_.propertyAssignmentObject[memberName]
                    else
                        effectiveValue = (functions.defaultValue? and functions.defaultValue) or
                            (functions.fnCreate? and functions.fnCreate and functions.fnCreate()) or
                            throw new Error "Internal error: Unable to determine how to assign declared property default value."
                    resolveResults.namespaceDataReference[memberName] = effectiveValue
            if propertiesDeclaration.userMutable? and propertiesDeclaration.userMutable
                for memberName, functions of propertiesDeclaration.userMutable
                    if resolveResults.namespaceDataReference[memberName]
                        continue
                    # Determine if the declared property has a value in the property assignment object.
                    effectiveValue = options_.propertyAssignmentObject[memberName]
                    if effectiveValue? and effectiveValue
                        delete options_.propertyAssignmentObject[memberName]
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
                        for keyName, subcomponentPropertyAssignmentObject of options_.propertyAssignmentObject
                            pendingDescriptorResolveOptions =
                                parentDataReference: resolveResults.namespaceDataReference
                                targetNamespaceDescriptor: childNamespaceDescriptor
                                targetNamespaceKey: keyName
                                semanticBindingReference: options_.semanticBindingsReference
                                propertyAssignmentObject: subcomponentPropertyAssignmentObject
                            resolveResults.pendingNamespaceDescriptors.push pendingDescriptorResolveOptions
                        break

                    else

                        # child namespaces of declared types 'child' and 'extensionPoint'.
                        # Default construct the deferred descriptor resolve options object.
                        pendingDescriptorResolveOptions =
                            parentDataReference: resolveResults.namespaceDataReference
                            targetNamespaceDescriptor: childNamespaceDescriptor
                            targetNamespaceKey: ''
                            semanticBindingReference: options_.semanticBindingsReference
                            propertyAssignmentObject: options_.propertyAssignmentObject[childNamespaceDescriptor.jsonTag]
                        resolveResults.pendingNamespaceDescriptors.push pendingDescriptorResolveOptions

            # Clone remaining properties from the property assignment object on to the child object.


            resolveResults

        catch exception_
            throw new Error("resolveNamespaceDescriptorCreate failure: #{exception_.message}")


    # ****************************************************************************
    # ****************************************************************************
    # ****************************************************************************
    # White box test exports
    #
    #

    # ==============================================================================
    resolveNamespaceDescriptorOpenImpl: (options_) ->

        # checkValidDescriptorResolveOptions(options_) == true assumed

        resolveResults =
            namespaceEffectiveKey: null
            namespaceDataReference: null
            pendingNamespaceDescriptors: []

        descriptor = options_.targetNamespaceDescriptor
        key = options_.targetNamespaceKey
        resolveResults.namespaceEffectiveKey = effectiveKey = (descriptor.namespaceType != 'extensionPoint') and descriptor.jsonTag or key
        resolveResults.namespaceDataReference = options_.parentDataReference[effectiveKey]

        resolveResults


    createResourceString: implementation.createResourceString
    checkValidDescriptorResolveOptions: implementation.checkValidDescriptorResolveOptions
    checkValidDescriptorResolveResults: implementation.checkValidDescriptorResolveResults
