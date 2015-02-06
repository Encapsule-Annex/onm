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

helperFunctions = require('./impl/onm-util-functions')
Address = require('./onm-address')
AddressToken = require('./impl/onm-address-token')
uuid = require('node-uuid')

LUID = 1

#
#
# ****************************************************************************
class ModelDetails
    constructor: (model_, objectModelDeclaration_) ->
        try
            @model = (model_? and model_) or throw new Error("Internal error missing model input parameter.");

            # --------------------------------------------------------------------------
            buildOMDescriptorFromLayout = (ONMD_, path_, parentDescriptor_, componentDescriptor_, parentPathIdVector_, parentPathExtensionPointIdVector_) =>
                try
                    if not (ONMD_? and ONMD_) 
                        throw new Error("Missing object model layout object input parameter! If you specified the namespace declaration via object reference, check the validity of the reference.");

                    if not (ONMD_.jsonTag? and ONMD_.jsonTag) then throw new Error("Missing required namespace declaration property 'jsonTag'.");

                    # Local variables used to construct this descriptor.
                    tag = ONMD_.jsonTag? and ONMD_.jsonTag or throw new Error("Namespace declaration missing required `jsonTag` property.");
                    path = path_? and path_ and "#{path_}.#{tag}" or tag

                    label = ONMD_.____label? and ONMD_.____label or ONMD_.jsonTag
                    description = ONMD_.____description? and ONMD_.____description or "no description provided"
                    id = @countDescriptors++

                    namespaceType = (ONMD_.namespaceType? and ONMD_.namespaceType) or (not id and (ONMD_.namespaceType = "root")) or throw new Error("Internal error unable to determine namespace type.");
                    parentPathExtensionPoints = undefined
                    if parentPathExtensionPointIdVector_? and parentPathExtensionPointIdVector_
                        parentPathExtensionPoints = helperFunctions.clone parentPathExtensionPointIdVector_
                    else
                        parentPathExtensionPoints = []

                    namespaceProperties = ONMD_.namespaceProperties? and ONMD_.namespaceProperties or {}

                    # Build this descriptor and add it to the OM's descriptor array.

                    thisDescriptor = @objectModelDescriptorById[id] = {
                        # valid only if namespaceType == "component" (set to ID of extension point's corresponding archetype)
                        "archetypePathId": -1           
                        "children": []
                        "componentNamespaceIds": []
                        "description": description
                        # valid only if namespaceType == "component" (populated with extension point ID's that specify this archetype by reference)
                        "extensionPointReferenceIds": []
                        "id": id
                        "idComponent": id
                        "isComponent": false
                        "jsonTag": tag
                        "label": label
                        "namespaceType": namespaceType
                        "namespaceModelDeclaration": ONMD_
                        "namespaceModelPropertiesDeclaration": namespaceProperties
                        "parent": parentDescriptor_
                        "parentPathExtensionPoints": parentPathExtensionPoints # self-extensible objects makes this superfluous I think
                        "parentPathIdVector": []
                        "path": path
                         }

                    # Add this descriptor to the OM intance's path map for fast look-up based on path.
                    @objectModelPathMap[path] = thisDescriptor

                    # Add this descriptor to parent descriptor's children array
                    if parentDescriptor_? and parentDescriptor_
                        parentDescriptor_.children.push thisDescriptor
                        # Clone the parent's parentPathIdVector and add ourselves to it.
                        thisDescriptor.parentPathIdVector = helperFunctions.clone parentDescriptor_.parentPathIdVector
                        thisDescriptor.parentPathIdVector.push parentDescriptor_.id

                    if @rankMax < thisDescriptor.parentPathIdVector.length
                        @rankMax = thisDescriptor.parentPathIdVector.length

                    componentDescriptor = undefined

                    switch namespaceType
                        when "extensionPoint"

                            if not (componentDescriptor_? and componentDescriptor_) then throw new Error("Internal error: componentDescriptor_ should be defined.");
                            thisDescriptor.idComponent = componentDescriptor_.id
                            componentDescriptor = componentDescriptor_
                            componentDescriptor.extensionPoints[path] = thisDescriptor

                            processArchetypeDeclaration = undefined
                            archetypeDescriptor = undefined
                            if ONMD_.componentArchetype? and ONMD_.componentArchetype
                                processArchetypeDeclaration = true
                                archetypeDescriptor = ONMD_.componentArchetype # may be undefined
                            else if ONMD_.componentArchetypePath? and ONMD_.componentArchetypePath
                                processArchetypeDeclaration = false
                                pathReference = ONMD_.componentArchetypePath
                                objectModelDescriptorReference = @objectModelPathMap[pathReference]
                                if not (objectModelDescriptorReference? and objectModelDescriptorReference)
                                    throw new Error("Extension point namespace '#{path}' component archetype '#{pathReference}' was not found and is invalid.");
                                if objectModelDescriptorReference.namespaceType != "component"
                                    throw new Error("Extension point namespace '#{path}' declares component archetype '#{pathReference}' which is not a 'component' namespace type.");
                                # Add the extension point ID to the archetype's list of extension points
                                # that specify it by reference.
                                objectModelDescriptorReference.extensionPointReferenceIds.push thisDescriptor.id
                                thisDescriptor.children.push objectModelDescriptorReference

                                # Add the archetype's ID to this extension point's descriptor.
                                thisDescriptor.archetypePathId = objectModelDescriptorReference.id
                                @countExtensionReferences++

                            else
                                throw new Error("Cannot process extension point declaration because its corresponding extension archetype is missing from the object model declaration.");

                            updatedParentPathExtensionPointIdVector = helperFunctions.clone parentPathExtensionPoints
                            updatedParentPathExtensionPointIdVector.push id
                            @countExtensionPoints++

                            # *** RECURSION (conditionally based on if the extension point defines its own archetype or referes to another by its path string)
                            if processArchetypeDeclaration
                                buildOMDescriptorFromLayout(archetypeDescriptor, path, thisDescriptor, componentDescriptor, thisDescriptor.parentPathIdVector, updatedParentPathExtensionPointIdVector)

                            break

                        when "component"
                            thisDescriptor.isComponent = true
                            thisDescriptor.extensionPoints = {}
                            parentDescriptor_.archetypePathId = id
                            componentDescriptor = thisDescriptor
                            @countExtensions++
                            @countComponents++
                            break

                        when "root"
                            if componentDescriptor_? or componentDescriptor then throw new Error("Internal error: componentDescriptor_ should be undefined.");
                            thisDescriptor.isComponent = true
                            thisDescriptor.extensionPoints = {}
                            componentDescriptor = thisDescriptor
                            @countComponents++
                            break

                        when "child"
                            if not (componentDescriptor_? and componentDescriptor_) then throw new Error("Internal error: componentDescriptor_ should be defined.");
                            thisDescriptor.idComponent = componentDescriptor_.id
                            componentDescriptor = componentDescriptor_
                            @countChildren++
                            break
                        else
                            throw new Error("Unrecognized namespace type '#{namespaceType}' in object model namespace declaration.");

                    @objectModelDescriptorById[thisDescriptor.idComponent].componentNamespaceIds.push thisDescriptor.id

                    if not (ONMD_.subNamespaces? and ONMD_.subNamespaces)
                        return true

                    for subNamespace in ONMD_.subNamespaces
                        # *** RECURSION
                        buildOMDescriptorFromLayout(subNamespace, path, thisDescriptor, componentDescriptor, thisDescriptor.parentPathIdVector, parentPathExtensionPoints)

                    return true

                catch exception
                    throw new Error("buildOMDescriptorFromLayout failure on path '#{path_}'. Details: #{exception.message}");

            # / END: buildOMDesriptorFromLayout

            # --------------------------------------------------------------------------
            @getNamespaceDescriptorFromPathId = (pathId_) =>
                try
                    if not (pathId_?) then throw new Error("Missing path ID parameter!");
                    if (pathId_ < 0) or (pathId_ >= @objectModelDescriptorById.length)
                        throw new Error("Out of range path ID '#{pathId_} cannot be resolved.");
                    objectModelDescriptor = @objectModelDescriptorById[pathId_]
                    if not (objectModelDescriptor? and objectModelDescriptor)
                        throw new Error("Cannot resolve path ID `#{pathId_}` in data model '#{@objectModelDescriptorById[0].jsonTag}'.");
                    return objectModelDescriptor
                catch exception
                    throw new Error("getNamespaceDescriptorFromPathId failure: #{exception.message}");
            #
            # / END: @getNamespaceDescriptorFromPathId

            # --------------------------------------------------------------------------
            @getNamespaceDescriptorFromPath = (path_) =>
                try
                    return @getNamespaceDescriptorFromPathId(@getPathIdFromPath(path_))
                catch exception
                    throw new Error("getNamespaceDescriptorFromPath failure: #{exception.message}");
            #
            # / END: @getNamespaceDescriptorFromPath
                
            # --------------------------------------------------------------------------
            @getPathIdFromPath = (path_) =>
                try
                    if not (path_? and path_) then throw new Error("Missing object model path parameter!");
                    objectModelDescriptor = @objectModelPathMap[path_]
                    if not (objectModelDescriptor? and objectModelDescriptor)
                        throw new Error("Path '#{path_}' is not in the '#{@model.jsonTag}' model's address space.");
                    objectModelPathId = objectModelDescriptor.id
                    if not objectModelPathId?
                        throw new Error("Internal error: Invalid object model descriptor doesn't support id property for path '#{objectModelPath_}'.");
                    return objectModelPathId
                catch exception
                    throw new Error("getPathIdFromPath fail: #{exception.message}");
            #
            # / END: @getPathIdFromPath

            # --------------------------------------------------------------------------
            @getPathFromPathId = (pathId_) =>
                try
                    objectModelDescriptor = @getNamespaceDescriptorFromPathId(pathId_)
                    if not (objectModelDescriptor? and objectModelDescriptor)
                        throw new Error("Internal error: Can't find object descriptor for valid path ID '#{pathId_}.");
                    path = objectModelDescriptor.path
                    if not (path? and path)
                        throw new Error("Internal error: Invalid object model descriptor doesn't support path property for path '#{objectModelPath_}'.");
                    return path
                catch exception
                    throw new Error("getPathFromPathId fail: #{exception.message}");
            #
            # / END: @getPathFromPathId

            # --------------------------------------------------------------------------
            @createAddressFromPathId = (pathId_) ->
                try
                    if not pathId_? then throw new Error("Missing path input parameter.");
                    targetDescriptor = @getNamespaceDescriptorFromPathId(pathId_)
                    newAddress = new Address(@model)
                    token = undefined
                    pathIds = helperFunctions.clone(targetDescriptor.parentPathIdVector)
                    pathIds.push(targetDescriptor.id)
                    for parentPathId in pathIds
                        descriptor = @getNamespaceDescriptorFromPathId(parentPathId)
                        if descriptor.namespaceType == "component"
                            newAddress.implementation.pushToken token
                        token = new AddressToken(@model, descriptor.idExtensionPoint, undefined, descriptor.id)
                    newAddress.implementation.pushToken(token)
                    return newAddress
                catch exception
                    throw new Error("getAddressFromPathId failure: #{exception.message}");
            #
            # / END: @createAddressFromPathId
        
            # --------------------------------------------------------------------------
            @parseAddressHashString = (addressHashString_) ->
                try
                    addressTokenVector = []
                    addressToken = undefined
                    key = undefined
                    processNewComponent = false
                    stringTokens = addressHashString_.split(".")
                    stringTokenCount = 0
                    for stringToken in stringTokens
                        if not stringTokenCount
                            if stringToken != @model.jsonTag
                                throw new Error("Invalid data model name '" + stringToken + "' in hash string.")
                            addressToken = new AddressToken(@model, undefined, undefined, 0)
                        else
                            if addressToken.namespaceDescriptor.namespaceType != "extensionPoint"
                                addressToken = new AddressToken(@model, addressToken.idExtenstionPoint, addressToken.key, stringToken);
                            else
                                if not processNewComponent
                                    addressTokenVector.push(addressToken)
                                    addressToken = addressToken.clone()
                                    if stringToken != "-"
                                        key = stringToken;
                                    processNewComponent = true;
                                else
                                    addressToken = new AddressToken(@model, addressToken.namespaceDescriptor.id, key, stringToken)
                                    key = undefined
                                    processNewComponent = false;

                        stringTokenCount++
                        # END: / for loop
                    addressTokenVector.push(addressToken)
                    newAddress = new Address(@model, addressTokenVector); 
                    return newAddress
                catch exception
                    throw new Error("parseAddressHashString failure: #{exception.message}")


            # --------------------------------------------------------------------------
            @parseAddressHumanReadableString = (addressHumanReadableString_) ->
                try
                    addressTokenVector = []
                    addressToken = undefined
                    stringTokens = addressHumanReadableString_.split(".")

                    for stringToken in stringTokens
                    
                        if not addressToken

                            # First string token
                            if stringToken != @model.jsonTag
                                throw new Error("Invalid data model name '" + stringToken + "' in hash string.")
                            addressToken = new AddressToken(@model, undefined, undefined, 0)

                        else
                            # 2nd through N string token

                            if addressToken.namespaceDescriptor.namespaceType != "extensionPoint"

                                # The string token corresponds to the jsonTag value of a subnamespace
                                # declaration of parent namespace referenced by the current addressToken.
                                # Search the data model declaration and update the addressToken.

                                descriptorFound = false
                                for childDescriptor in addressToken.namespaceDescriptor.children
                                    if childDescriptor.jsonTag == stringToken
                                        descriptorFound = true
                                        addressToken = new AddressToken(@model, addressToken.idExtensionPoint, addressToken.key, childDescriptor.id)
                                        break

                                if not descriptorFound
                                    throw new Error("Cannot resolve '#{stringToken}' token of human-readable onm.Address string '#{addressHumanReadableString_}'.")

                            else

                                # The current addressToken is references an extension point namespace declaration
                                if not processNewComponent

                                    # Push the current token, and setup a new address token for the next
                                    # iteration of the tokenString loop.
                                    addressTokenVector.push(addressToken)

                                    # Setup for next string token.
                                    addressToken = addressToken.clone()
                                    if stringToken != "-"
                                        key = stringToken

                                    processNewComponent = true

                                else
                                    descriptorFound = false
                                    for childDescriptor in addressToken.namespaceDescriptor.children
                                        if childDescriptor.jsonTag == stringToken
                                            descriptorFound = true
                                            break

                                    if not descriptorFound
                                        throw new Error("Cannot resolve '#{stringToken}' token of human-readable onm.Address string '#{addressHumanReadableString_}'.")

                                    addressToken = new AddressToken(@model, addressToken.idNamespace, key, childDescriptor.id)
                                    key = undefined
                                    processNewComponent = false

                        # END: / for loop

                    if processNewComponent
                        throw new Error("Cannot deserialize incomplete human-readable onm.Address string '#{addressHumanReadableString_}'.")

                    addressTokenVector.push(addressToken);
                    newAddress = new Address(@model, addressTokenVector); 
                    return newAddress

                catch exception
                    throw new Error("parseAddressHumanReadableString failure: #{exception.message}")


            # --------------------------------------------------------------------------
            @resetKeyGenerator = ->
                LUID = 1
                @model

            # --------------------------------------------------------------------------
            # ModelDetails CONSTRUCTOR

            if not (objectModelDeclaration_? and objectModelDeclaration_)
                throw new Error("Missing object model delcaration input parameter!");

            if not (objectModelDeclaration_.jsonTag? and objectModelDeclaration_.jsonTag)
                throw new Error("Missing required root namespace property 'jsonTag'.");

            @model.jsonTag = objectModelDeclaration_.jsonTag
            @model.label = objectModelDeclaration_.____label? and objectModelDeclaration_.____label or objectModelDeclaration_.jsonTag
            @model.description = objectModelDeclaration_.____description? and objectModelDeclaration_.____description or "<no description provided>"

            # Deep copy the specified object model declaration object.
            @objectModelDeclaration = helperFunctions.clone objectModelDeclaration_
            Object.freeze @objectModelDeclaration

            if not (@objectModelDeclaration? and @objectModelDeclaration)
                throw new Error("Failed to deep copy (clone) source object model declaration.");

            #
            # objectModelDescriptor = (required) reference to OM layout declaration object
            # path = (optional/used in recursion) parent descriptor's OM path (defaults to jsonTag if undefined)
            # rank = (optional/used in recursion) directed graph rank (aka level - a zero-based count of tree height)
            # parentDescriptor_ = (optional/used in recursion) (if undefined, then 
            #
            # buildOMDescriptorFromLayout additionally depends on the following class members
            #

            @objectModelPathMap = {}
            @objectModelDescriptorById = []

            @countDescriptors = 0
            @countComponents = 0
            @countExtensionPoints = 0
            @countExtensions = 0
            @countExtensionReferences = 0
            @countChildren = 0
            @rankMax = 0

            # *** START RECURSIVE PARSE/BUILD OF OBJECT MODEL DESCRIPTOR(s).
            buildOMDescriptorFromLayout(objectModelDeclaration_)

            # Some basic consistency checks to ensure that completely screwed up declaratons
            # aren't foisted upon unsuspecting observers.

            if @countExtensionPoints != @countExtensions + @countExtensionReferences
                throw new Error("Layout declaration error: extension point and extension descriptor counts do not match. countExtensionPoints=#{@countExtensionPoints} countExtensions=#{@countExtensions}");

            if @countComponents != @countExtensionPoints + 1 - @countExtensionReferences
                throw new Error("Layout declaration error: component count should be " +
                     "extension count + 1 - extension references. componentCount=#{@countComponents} " +
                     " countExtensions=#{@countExtensions} extensionReferences=#{@countExtensionReferences}");

            Object.freeze @objectModelPathMap
            Object.freeze @objectModelDescriptorById

            defaultSemanticBindings = {
                componentKeyGenerator: 'internalUuid'
                namespaceVersion: 'disabled'
            }

            @semanticBindings = {}


            @componentKeyGenerator = 'internalUuid' # default
            @namespaceVersioning = 'disabled' # default

            if @objectModelDeclaration.semanticBindings? and @objectModelDeclaration.semanticBindings
                if @objectModelDeclaration.semanticBindings.componentKeyGenerator? and @objectModelDeclaration.semanticBindings.componentKeyGenerator
                    @componentKeyGenerator = @objectModelDeclaration.semanticBindings.componentKeyGenerator
                if @objectModelDeclaration.semanticBindings.namespaceVersioning? and @objectModelDeclaration.semanticBindings.namespaceVersioning
                    @namespaceVersioning = @objectModelDeclaration.semanticBindings.namespaceVersioning

            switch @componentKeyGenerator
                when "internalLuid"
                    @semanticBindings.getUniqueKey = => 
                        "#{LUID++}"
                    break
                when "internalUuid"
                    @semanticBindings.getUniqueKey = => 
                        uuid.v4()
                    break
                else
                    throw new Error("Unrecognized componentKeyGenerator='#{@componentKeyGenerator}.'");

            switch @namespaceVersioning
                when "disabled"
                    if @semanticBindings.update? and @semanticBindings.update
                        delete @semanticBindings.update
                    break
                when "internalSimple"
                    @semanticBindings.update = (data_) ->
                        if data_.revision?
                            data_.revision++
                    break
                when "internalAdvanced"
                    @semanticBindings.update = (data_) ->
                        if data_.revision?
                            data_.revision++
                        if data_.uuidRevision?
                            data_.uuidRevision = uuid.v4()
                        if data_.revisionTime?
                            data_.revisionTime = helperFunctions.getEpochTime()
                    break
                when "external"
                    break
                else
                    throw new Error("Unrecognized namespaceVersionion=`#{@namespaceUpdateRevision}'");

        catch exception
            throw new Error("onm.Model.implementation failed: #{exception.message}");


#
#
# ****************************************************************************
module.exports = class Model
    constructor: (objectModelDeclaration_) ->
        try
            @implementation = new ModelDetails(@, objectModelDeclaration_)

            # --------------------------------------------------------------------------
            @createRootAddress = =>
                try
                    return new Address(@, [ new AddressToken(@, undefined, undefined, 0) ])
                catch exception
                    throw new Error("createRootAddress failure: #{exception.message}");
            

            # --------------------------------------------------------------------------
            @createPathAddress = (path_) =>
                try
                    pathId = @implementation.getPathIdFromPath(path_)
                    newAddress = @implementation.createAddressFromPathId(pathId)
                    return newAddress
                catch exception
                    throw new Error("createPathAddress failure: #{exception.message}");


            # --------------------------------------------------------------------------
            @createAddressFromHumanReadableString = (humanReadableString_) =>
                try
                    if not (humanReadableString_? and humanReadableString_)
                        throw new Error("Missing human-readbale string input parameter.");
                    newAddress = @implementation.parseAddressHumanReadableString(humanReadableString_)
                    return newAddress
                catch exception
                    throw new Error("createAddressFromHumanReadableString address space failure: #{exception.message}");

            # --------------------------------------------------------------------------
            @createAddressFromHashString = (hash_) =>
                try
                    if not (hash_? and hash_)
                        throw new Error("Missing hash string input parameter.");
                    newAddress = @implementation.parseAddressHashString(hash_)
                    return newAddress
                catch exception
                    throw new Error("createAddressFromHashString address space failure: #{exception.message}");

            # --------------------------------------------------------------------------
            @getSemanticBindings = =>
                try
                    return @implementation.semanticBindings

                catch exception
                    throw new Error("getSemanticBindings failure: #{exception.message}");

            # --------------------------------------------------------------------------
            @isEqual = (model_) =>
                try
                    if not (model_.jsonTag? and model_.jsonTag)
                        throw new Error("Invalid model object passed as input parameter. Missing expectected property 'jsonTag'.");
                    @jsonTag == model_.jsonTag
                catch exception
                    throw new Error("isEqual failure: #{exception.message}");



        catch exception
            throw new Error("Model construction fail: #{exception.message}");

