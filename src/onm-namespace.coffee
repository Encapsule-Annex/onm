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

AddressToken = require('./implementation/onm-address-token')
AddressTokenBinder = require('./implementation/onm-address-binder')
Address = require('./onm-address')

#
#
# ****************************************************************************
class NamespaceDetails
    constructor: (namespace_, store_, address_, mode_) ->
        try
            @dataReference = store_.implementation.dataReference? and store_.implementation.dataReference or throw new Error("Cannot resolve object store's root data reference.")
            @resolvedTokenArray = []
            @getResolvedToken = => @resolvedTokenArray.length and @resolvedTokenArray[@resolvedTokenArray.length - 1] or undefined
            @resolvedAddress = undefined
            @pendingSubcomponentDescriptors = []

        catch exception
            throw new Error("NamespaceDetails failure: #{exception.message}")

#
#
# ****************************************************************************
# optional parameters passed by onm.Store.createComponent (i.e. mode="new")
# keyArray_ --- to be applied in order, tail-justified, to the component token vector key array
# propertyAssignmentObject_ --- options object of property assignments to be cherry-picked and transcribed to newly-contructed components _prior_ to observer signal

module.exports = class Namespace
    constructor: (store_, address_, mode_, keyArray_, propertyAssignmentObject_) ->
        try
            if not (store_? and store_) then throw new Error("Missing object store input parameter.")
            @store = store_

            @implementation = new NamespaceDetails(@, store_, address_, mode_)

            # As a matter of policy, if no address is specified or if a zero-length address is specified, open the root namespace.
            address = undefined
            if not (address_? and address_ and address_.implementation.tokenVector.length)
                objectModel = store_.model
                address = new Address(objectModel, [ new AddressToken(objectModel, undefined, undefined, 0) ] )
            else
                address = address_
            
            # Ensure that address and store objects were both created using the same model.
            objectModelNameStore = store_.model.jsonTag
            objectModelNameKeys = address.model.jsonTag
            if objectModelNameStore != objectModelNameKeys
                throw new Error("You cannot access a '#{objectModelNameStore}' store namespace with a '#{objectModelNameKeys}' object model address!")

            # Token in the address specifies a root component namespace?
            if not address.isComplete() then throw new Error("Specified address is invalid because the first address token does not specify the object store's root component.")

            mode = mode_? and mode_ or "bypass"

            if (mode != "new") and not address.isResolvable()
                throw new Error("'#{mode}' mode error: Unresolvable address '#{address.getHumanReadableString()}' invalid for this operation.")

            # Let's try to do some address manipulation here based on the keyArray_ and propertyAssignmentObject_ params
            keyArrayCount = keyArray_? and keyArray_.length or 0
            tokenArrayCount = address.implementation.tokenVector.length

            if keyArrayCount
                if keyArrayCount > (tokenArrayCount - 1)
                    throw new Error("Too many component keys specified in optional key array parameter for address '#{address_.getHumanReadableString()}'.")

                # Clone the address
                address = address.clone();

                # Overwrite overlapping keys
                keyIndex = 0
                while keyIndex < keyArrayCount
                    key = keyArray_[keyIndex]
                    tokenIndex = tokenArrayCount - keyArrayCount + keyIndex
                    address.implementation.tokenVector[tokenIndex].key = key
                    keyIndex++

            # The actual store data.
            tokenCount = 0
            for addressToken in address.implementation.tokenVector

                workingOnLastToken = (tokenArrayCount - 1) == tokenCount
                tokenCount++

                # do not apply the propertyAssignmentObject_ until we're creating the target data component.
                constructionOptions = workingOnLastToken and propertyAssignmentObject_ or undefined;

                tokenBinder = new AddressTokenBinder(store_, @implementation.dataReference, addressToken, mode, constructionOptions)

                @implementation.resolvedTokenArray.push tokenBinder.resolvedToken
                @implementation.dataReference = tokenBinder.dataReference

                if mode == "new"
                    if addressToken.idComponent 
                        if not (addressToken.key? and addressToken.key)
                            resolvedAddress = new Address(@store.model, @implementation.resolvedTokenArray)
                            componentAddress = resolvedAddress.createComponentAddress()
                            @store.implementation.reifier.reifyStoreComponent(componentAddress)
                            extensionPointAddress = componentAddress.createParentAddress()
                            extensionPointNamespace = @store.openNamespace(extensionPointAddress)
                            extensionPointNamespace.update()

                if tokenBinder.subcomponentDescriptors.length > 0
                    console.log("AND... WE HAVE UNFINISHED BUSINESS: " + tokenBinder.subcomponentDescriptors.length + " subcomponent descriptors await...")

                for subcomponentDescriptor in tokenBinder.subcomponentDescriptors
                    console.log(".... onmNamepspace pending subcomponent " + JSON.stringify(subcomponentDescriptor.parentExtensionPoint.propertyAssignmentObject))

                @implementation.pendingSubcomponentDescriptors = tokenBinder.subcomponentDescriptors

                true

        catch exception
            throw new Error("Namespace failure: #{exception.message}")

    #
    # ============================================================================
    getResolvedAddress: =>
        try
            if @implementation.resolvedAddress? and @implementation.resolvedAddress
                return @implementation.resolvedAddress
            @implementation.resolvedAddress = new Address(@store.model, @implementation.resolvedTokenArray)
            return @implementation.resolvedAddress
        catch exception
            throw new Error("getResolvedAddress failure: #{exception.message}")


    #
    # ============================================================================
    getComponentKey: =>
        try
            return @implementation.getResolvedToken().key

        catch exception
            throw new Error("getComponentKey failure: #{exception.message}")


    #
    # ============================================================================
    getResolvedLabel: =>
        try
            resolvedDescriptor = @implementation.getResolvedToken().namespaceDescriptor
            semanticBindings = @store.model.getSemanticBindings()
            getLabelBinding = semanticBindings? and semanticBindings and semanticBindings.getLabel? and semanticBindings.getLabel or undefined
            resolvedLabel = undefined
            if getLabelBinding? and getLabelBinding
                resolvedLabel = getLabelBinding(@data(), @getResolvedAddress())
            else
                resolvedLabel = resolvedDescriptor.label

            return resolvedLabel
            
        catch exception
            throw new Error("getResolvedLabel failure: #{exception.message}")

    #
    # ============================================================================
    data: => @implementation.dataReference


    #
    # ============================================================================
    toJSON: (replacer_, space_) =>
        try
            namespaceDescriptor = @implementation.getResolvedToken().namespaceDescriptor
            resultObject = {}
            resultObject[namespaceDescriptor.jsonTag] = @data()
            space = space_? and space_ or 0
            resultJSON = JSON.stringify(resultObject, replacer_, space)
            if not (resultJSON? and resultJSON)
                throw new Error("Cannot serialize Javascript object to JSON!")
            return resultJSON

        catch exception
            throw new Error("toJSON failure: #{exception.message}")


    #
    # ============================================================================
    fromData: (data_) =>
        try
            address = @getResolvedAddress()
            model = address.getModel()

            # Validate request.
            if not ((model.namespaceType == "root") or (model.namespaceType == "component"))
                throw new Error("Data import only supported on its root and component namespaces. This namespace '#{model.namespaceType}'-type namespace.")

            if (model.namespaceType == "component")
                newComponentKey = @store.model.getSemanticBindings().getUniqueKey(data_)
                namespaceComponentKey = address.implementation.getLastToken().key
                if (newComponentKey != namespaceComponentKey)
                    throw new Error("Unexpected input data missing or unexpected component key value.")

            namespaceData = @implementation.dataReference

            # Notify registered observers that we're about to remove the specified data component.
            @store.implementation.reifier.unreifyStoreComponent(address)

            # Remove the contents of the addressed component.
            for property, value of @implementation.dataReference
                delete namespaceData[property]

            # Replace the contents of the new data object.
            for property, value of data_
                namespaceData[property] = value

            # Notify registered observers that we're replaced the contents of the specified data component.
            @store.implementation.reifier.reifyStoreComponent(address)

            return address

        catch exception
            throw new Error("fromData failure: #{exception.message}")



    #
    # ============================================================================
    fromJSON: (json_) =>
        try
            # Attempt to deserialize the specified JSON.
            data = undefined
            try
                parsedData = JSON.parse(json_)
            catch exception
                throw new Error("Unable to deserialize the specified JSON data: #{exception.message}")

            # Unwrap and verify the request before delegating to the fromData method.
            resolvedAddress = @getResolvedAddress()
            model = resolvedAddress.getModel()
            dataPayload = parsedData[model.jsonTag]
            if not (dataPayload? and dataPayload)
                throw new Error("JSON data is missing expeced top-level object '#{model.jsonTag}'.")

            # Delegate to the fromData method:
            try
                resolvedAddress = @fromData(dataPayload)
            catch exception
                throw new Error("After successful JSON parse, namespace data update failed: #{exception.message}")
            return resolvedAddress
            
        catch exception
            throw new Error("fromJSON failure: #{exception.message}")


    #
    # ============================================================================
    # Trigger data change callback notifications to observer routines registered
    # with this onm.Namespace's parent onm.Store instance.
    #
    update: =>
        try
            # First update the store namespace data and all its parents.
            # Note the search direction is fixed but the callback is defined in the
            # object model declaration (or not).

            address = @getResolvedAddress()
            semanticBindings = @store.model.getSemanticBindings()
            updateAction = semanticBindings? and semanticBindings and semanticBindings.update? and semanticBindings.update or undefined

            # Update all the parent namespaces. (may mutate store data depending on updateAction implementation)
            if updateAction? and updateAction
                updateAction(@data())
                address.visitParentAddressesDescending( (address__) =>
                    dataReference = @store.openNamespace(address__).data()
                    updateAction(dataReference))


            # Now we need to generate some observer notification.
            count = 0
            containingComponentNotified = false
            while address? and address
                descriptor = address.implementation.getDescriptor()
                if count == 0
                    @store.implementation.reifier.dispatchCallback(address, "onNamespaceUpdated", undefined)
                else
                    @store.implementation.reifier.dispatchCallback(address, "onSubnamespaceUpdated", undefined)

                if descriptor.namespaceType == "component" or descriptor.namespaceType == "root"
                   if not containingComponentNotified
                       @store.implementation.reifier.dispatchCallback(address, "onComponentUpdated", undefined)
                       containingComponentNotified = true
                   else
                       @store.implementation.reifier.dispatchCallback(address, "onSubcomponentUpdated", undefined)

                address = address.createParentAddress() # returns undefined if address == root namespace of the store
                count++
            
        catch exception
            throw new Error("update failure: #{exception.message}")



    #
    # ============================================================================
    getExtensionPointSubcomponentCount: =>
        try
            resolvedToken = @implementation.getResolvedToken()
            if not (resolvedToken? and resolvedToken) then throw new Error("Internal error: unable to resolve token.")
            componentCount = 0
            if resolvedToken.namespaceDescriptor.namespaceType == "extensionPoint"
                componentCount = Object.keys(@data()).length
            return componentCount

        catch exception
            throw new Error("getExtensionPointSubcomponentCount failure: #{exception: message}")



    #
    # ============================================================================
    visitExtensionPointSubcomponents: (callback_) =>
        try
            resolvedToken = @implementation.getResolvedToken()
            if not (resolvedToken? and resolvedToken) then throw new Error("Internal error: unable to resolve token.")

            if resolvedToken.namespaceDescriptor.namespaceType != "extensionPoint"
                throw new Error("You may only visit the subcomponents of an extension point namespace.")

            for key, object of @data()
                address = @getResolvedAddress().clone()
                token = new AddressToken(@store.model, resolvedToken.idNamespace, key, resolvedToken.namespaceDescriptor.archetypePathId)
                address.implementation.pushToken(token)
                try
                    callback_(address)
                catch exception
                    throw new Error("Failure occurred inside your callback function implementation: #{exception.message}")

            true

        catch exception
            throw new Error("visitExtensionPointSubcomponents failure: #{exception.message}")


