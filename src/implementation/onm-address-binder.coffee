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




#
# ****************************************************************************
InitializeNamespaceProperties = (data_, descriptor_, propertyAssignmentObject_) ->
    try
        if not (data_? and data_) then throw new Error("Missing data reference input parameter.")
        if not (descriptor_? and descriptor_) then throw new Error("Missing descriptor input parameter.")

        propertyAssignmentObject = propertyAssignmentObject_? and propertyAssignmentObject_ or {}

        if descriptor_.userImmutable? and descriptor_.userImmutable
            for memberName, functions of descriptor_.userImmutable
                if propertyAssignmentObject[memberName]? and propertyAssignmentObject[memberName]
                    data_[memberName] = propertyAssignmentObject[memberName]
                else if functions.fnCreate? and functions.fnCreate
                    data_[memberName] = functions.fnCreate()
                else
                    data_[memberName] = functions.defaultValue
        if descriptor_.userMutable? and descriptor_.userMutable
            for memberName, functions of descriptor_.userMutable
                if propertyAssignmentObject[memberName]? and propertyAssignmentObject[memberName]
                    data_[memberName] = propertyAssignmentObject[memberName]
                else if functions.fnCreate? and functions.fnCreate
                    data_[memberName] = functions.fnCreate()
                else
                    data_[memberName] = functions.defaultValue
        return true

    catch exception
        throw new Error("InitializeNamespaceProperties failure #{exception.message}.");


#
# ****************************************************************************
VerifyNamespaceProperties = (data_, descriptor_) ->
    try
        if not (data_? and data_) then throw new Error("Missing data reference input parameter.");
        if not (descriptor_? and descriptor_) then throw new Error("Missing descriptor input parameter.");

        if descriptor_.userImmutable? and descriptor_.userImmutable
            for memberName, functions of descriptor_.userImmutable
                memberReference = data_[memberName]
                if not memberReference?
                    throw new Error("Expected immutable member '#{memberName}' not found.");

        if descriptor_.userMutable? and descriptor_.userMutable
            for memberName, functions of descriptor_.userMutable
                memberReference = data_[memberName]
                if not memberReference?
                    throw new Error("Expected mutable member '#{memberName}' not found.");
        return true

    catch exception
        throw new Error("VerifyNamespaceMembers failure #{exception.message}.");


#
# ****************************************************************************
InitializeComponentNamespaces = (store_, data_, descriptor_, extensionPointId_, key_, propertyAssignmentObject_) ->
    try
        if not (data_? and data_) then throw new Error("Missing data reference input parameter.");
        if not (descriptor_? and descriptor_) then throw new Error("Missing descriptor input parameter.");
        if not (extensionPointId_? and extensionPointId_) then throw new Error("Missing extension point ID input parameter.");

        for childDescriptor in descriptor_.children
            if childDescriptor.namespaceType != "component"

                propertyAssignmentObject = propertyAssignmentObject_? and propertyAssignmentObject_ and 
                    propertyAssignmentObject_[childDescriptor.jsonTag]? and propertyAssignmentObject_[childDescriptor.jsonTag] or {}

                resolveResults = ResolveNamespaceDescriptor({}, store_, data_, childDescriptor, key_, "new", propertyAssignmentObject)
                InitializeComponentNamespaces(store_, resolveResults.dataReference, childDescriptor, extensionPointId_, key_, propertyAssignmentObject)

        return true

    catch exception
        throw new Error("InitializeComponentNamespaces failure: #{exception.message}.");


#
# ****************************************************************************
VerifyComponentNamespaces = (store_, data_, descriptor_, extensionPointId_) ->
    try
        if not (data_? and data_) then throw new Error("Missing data reference input parameter.");
        if not (descriptor_? and descriptor_) then throw new Error("Missing descriptor input parameter.");

        return true

    catch exception
        throw new Error("VerifyComponentNamespaces failure: #{exception.message}.");



#
# ****************************************************************************
ResolveNamespaceDescriptor = (resolveActions_, store_, data_, descriptor_, key_, mode_, propertyAssignmentObject_) ->
    try

        if not (resolveActions_? and resolveActions_) then throw new Error("Internal error: missing resolve actions structure input parameter.");
        if not (data_? and data_) then throw new Error("Internal error: missing parent data reference input parameter.");
        if not (descriptor_? and descriptor_) then throw new Error("Internal error: missing object model descriptor input parameter.");
        if not (mode_? and mode_) then throw new Error("Internal error: missing mode input parameter.");

        tokenString =  ((descriptor_.namespaceType != "component") and descriptor_.jsonTag) or key_ or undefined

        resolveResults =
            jsonTag: tokenString
            dataReference: tokenString? and tokenString and data_[tokenString] or undefined
            dataParentReference: data_
            key: key_
            mode: mode_
            descriptor: descriptor_
            store: store_
            created: false

        switch mode_
            when "bypass"
                if not (resolveResults.dataReference? and resolveResults.dataReference)
                    throw new Error("Unable to resolve expected namespace descriptor for namespace type '#{descriptor_.namespaceType}' for token '#{tokenString}'.");
                break
            when "new"
                if (resolveResults.dataReference? and resolveResults.dataReference)
                    break

                newData = {}
                # InitializeNamespaceProperties(newData, descriptor_.namespaceModelPropertiesDeclaration, propertyAssignmentObject_)

                if descriptor_.namespaceType == "component"
                    if not (resolveActions_.setUniqueKey? and resolveActions_.setUniqueKey)
                        throw new Error("You must define semanticBindings.setUniqueKey function in your data model declaration.");

                    resolveActions_.setUniqueKey(newData, key_)

                    if not (resolveActions_.getUniqueKey? and resolveActions_.getUniqueKey)
                        throw new Error("You must define semanticBindings.getUniqueKey function in your data model declaration.");

                    resolveResults.key = resolveResults.jsonTag = resolveActions_.getUniqueKey(newData)

                    if not (resolveResults.key? and resolveResults.key)
                        throw new Error("Your data model's semanticBindings.getUniqueKey function returned an invalid key. Key cannot be zero or zero-length.");

                    if key_? and key_ and (key_ != resolveResults.key)
                        throw new Error("Your data model's semanticBindings.setUniqueKey function seemingly ignores the second in-parameter.");

                InitializeNamespaceProperties(newData, descriptor_.namespaceModelPropertiesDeclaration, propertyAssignmentObject_)

                resolveResults.dataReference = resolveResults.dataParentReference[resolveResults.jsonTag] = newData
                resolveResults.created = true

                break

            when "strict"
                if not (resolveResult.dataReference? and resolveResult.dataReference)
                    throw new Error("Internal error: Unable to resolve  #{descriptor_.namespaceType} namespace descriptor in strict mode for token '#{tokenString}.");
                VerifyNamespaceProperties(result.dataReference, descriptor_.namespaceModelPropertiesDeclaration)
                break
            else
                throw new Error("Unrecognized mode parameter value.");

        return resolveResults

    catch exception
        throw new Error("ResolveNamespaceDescriptor failure: #{exception.message}");




#
# ****************************************************************************
module.exports = class AddressTokenBinder
    constructor: (store_, parentDataReference_, token_, mode_, propertyAssignmentObject_) ->
        try
            @store = store_? and store_ or throw new Error("Missing object store input parameter.");
            model = store_.model
            @parentDataReference = parentDataReference_? and parentDataReference_ or throw new Error("Missing parent data reference input parameter.");
            if not (token_? and token_) then throw new Error("Missing object model address token object input parameter.");
            if not (mode_? and mode_) then throw new Error("Missing mode input parameter.");

            @dataReference = undefined
            @resolvedToken = token_.clone()

            targetNamespaceDescriptor = token_.namespaceDescriptor
            targetComponentDescriptor = token_.componentDescriptor

            semanticBindings = model.getSemanticBindings()
            setUniqueKeyFunction = semanticBindings? and semanticBindings and semanticBindings.setUniqueKey? and semanticBindings.setUniqueKey or undefined
            getUniqueKeyFunction = semanticBindings? and semanticBindings and semanticBindings.getUniqueKey? and semanticBindings.getUniqueKey or undefined

            resolveActions = {
                setUniqueKey: setUniqueKeyFunction
                getUniqueKey: getUniqueKeyFunction
            }

            propertyAssignmentObject = propertyAssignmentObject_? and propertyAssignmentObject_ or {}
            

            # Resolve the input token's component namespace.
            resolveResults = ResolveNamespaceDescriptor(resolveActions, store_, @parentDataReference, token_.componentDescriptor, token_.key, mode_, propertyAssignmentObject)
            @dataReference = resolveResults.dataReference

            if resolveResults.created
                @resolvedToken.key = resolveResults.key

            extensionPointId = token_.extensionPointDescriptor? and token_.extensionPointDescriptor and token_.extensionPointDescriptor.id or -1

            if mode_ == "new" and resolveResults.created
                # This resolves all the children and extension points of a component and initializes their properties.
                InitializeComponentNamespaces(store_, @dataReference, targetComponentDescriptor, extensionPointId, @resolvedToken.key, propertyAssignmentObject)

            if mode_ == "strict"
                VerifyComponentNamespaces(store_, resolveResult.dataReference, targetComponentDescriptor, extensionPointId)            

            # ... If we've been asked to bind the root namespace of the component then we're done.

            if targetNamespaceDescriptor.isComponent
                return

            # ... otherwise the request is to bind a subnamespace of the component we just bound (i.e. created or opened depending on mode) above.

            # How many ranks above us in the parent/child tree is the requested subnamespace?
            generations = targetNamespaceDescriptor.parentPathIdVector.length - targetComponentDescriptor.parentPathIdVector.length - 1

            # Parent path ID's of the parent namespaces (i.e. child namespaces of the current data reference)
            parentPathIds = generations and targetNamespaceDescriptor.parentPathIdVector.slice(-generations) or []

            # ... Resolve the component subnamespace parents of the target namespace.
            for pathId in parentPathIds
                descriptor = model.implementation.getNamespaceDescriptorFromPathId(pathId)
                resolveResults = ResolveNamespaceDescriptor(resolveActions, store_, resolveResults.dataReference, descriptor, resolveResults.key, mode_)

            # ... Resolve the target namespace
            resolveResults = ResolveNamespaceDescriptor(resolveActions, store_, resolveResults.dataReference, targetNamespaceDescriptor, resolveResults.key, mode_)
            @dataReference = resolveResults.dataReference

            return

            # ----------------------------------------------------------------------------
            # ----------------------------------------------------------------------------
            # ----------------------------------------------------------------------------

        catch exception
            throw new Error("AddressTokenBinder failure: #{exception.message}");


