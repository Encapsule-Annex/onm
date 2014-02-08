###
------------------------------------------------------------------------------

The MIT License (MIT)

Copyright (c) 2013 Encapsule Project
  
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

AddressToken = require('./ONMjs-core-address-token')
AddressTokenBinder = require('./ONMjs-core-address-binder')
Address = require('./ONMjs-core-address')

#
#
# ****************************************************************************
class NamespaceDetails
    constructor: (namespace_, store_, address_, mode_) ->
        try
            @dataReference = store_.implementation.dataReference? and store_.implementation.dataReference or throw "Cannot resolve object store's root data reference."
            @resolvedTokenArray = []
            @getResolvedToken = => @resolvedTokenArray.length and @resolvedTokenArray[@resolvedTokenArray.length - 1] or undefined
            @resolvedAddress = undefined

        catch exception
            throw "NamespaceDetails failure: #{exception}"

#
#
# ****************************************************************************
module.exports = class Namespace
    constructor: (store_, address_, mode_) ->
        try
            if not (store_? and store_) then throw "Missing object store input parameter."
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
                throw "You cannot access a '#{objectModelNameStore}' store namespace with a '#{objectModelNameKeys}' object model address!"

            # Token in the address specifies a root component namespace?
            if not address.isComplete() then throw "Specified address is invalid because the first address token does not specify the object store's root component."

            mode = mode_? and mode_ or "bypass"

            if (mode != "new") and not address.isResolvable()
                throw "'#{mode}' mode error: Unresolvable address '#{address.getHumanReadableString()}' invalid for this operation."

            # The actual store data.

            for addressToken in address.implementation.tokenVector
                tokenBinder = new AddressTokenBinder(store_, @implementation.dataReference, addressToken, mode)
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
                            extensionPointNamespace.update();
                true

        catch exception
            throw "Namespace failure: #{exception}"

    #
    # ============================================================================
    getResolvedAddress: =>
        try
            if @implementation.resolvedAddress? and @implementation.resolvedAddress
                return @implementation.resolvedAddress
            @implementation.resolvedAddress = new Address(@store.model, @implementation.resolvedTokenArray)
            return @implementation.resolvedAddress
        catch exception
            throw "getResolvedAddress failure: #{exception}"


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
            throw "getResolvedLabel failure: #{exception}"

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
                throw "Cannot serialize Javascript object to JSON!"
            return resultJSON

        catch exception
            throw "toJSON failure: #{exception}"


    #
    # ============================================================================
    fromData: (data_) =>
        try
            address = @getResolvedAddress()
            model = address.getModel()

            # Validate request.
            if not ((model.namespaceType == "root") or (model.namespaceType == "component"))
                throw "Data import only supported on its root and component namespaces. This namespace '#{model.namespaceType}'-type namespace."

            newComponentData = data_[model.jsonTag]
            if not (newComponentData? and newComponentData)
                throw "Unexpected input data missing expected root object '#{model.jsonTag}'."

            newComponentKey = @store.model.getSemanticBindings().getUniqueKey(newComponentData)
            namespaceComponentKey = address.implementation.getLastToken().key
            if (newComponentKey != namespaceComponentKey)
                throw "Unexpected input data missing or unexpected component key value."

            extensionPointNamespace = @store.openNamespace(address.createParentAddress())

            # Remove the target component from the parent onm.Store instance.
            @store.removeComponent(address);

            extensionPointNamespace.data()[address.implementation.getLastToken().key] = newComponentData

            @store.implementation.reifier.reifyStoreComponent(address)

            return address

        catch exception
            throw "fromData failure: #{exception}"



    #
    # ============================================================================
    fromJSON: (json_) =>
        try
            data = undefined
            try
                data = JSON.parse(json_)
            catch exception
                throw "JSON.parse failed: #{exception}"

            resolvedAddress = undefined
            try
                resolvedAddress = @fromData(data)
            catch exception
                throw "After successful JSON parse, failure in data handler: #{exception}"            

            return resolvedAddress
            
        catch exception
            throw "fromJSON failure: #{exception}"


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
            throw "update failure: #{exception}"




    #
    # ============================================================================
    visitExtensionPointSubcomponents: (callback_) =>
        try
            resolvedToken = @implementation.getResolvedToken()
            if not (resolvedToken? and resolvedToken) then throw "Internal error: unable to resolve token."

            if resolvedToken.namespaceDescriptor.namespaceType != "extensionPoint"
                throw "You may only visit the subcomponents of an extension point namespace."

            for key, object of @data()
                address = @getResolvedAddress().clone()
                token = new AddressToken(@store.model, resolvedToken.idNamespace, key, resolvedToken.namespaceDescriptor.archetypePathId)
                address.implementation.pushToken(token)
                try
                    callback_(address)
                catch exception
                    throw "Failure occurred inside your callback function implementation: #{exception}"

            true

        catch exception
            throw "visitExtensionPointSubcomponents failure: #{exception}"
    # ============================================================================


