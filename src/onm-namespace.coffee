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

AddressToken = require('./impl/onm-address-token')
Address = require('./onm-address')
addressResolver = require './impl/onm-address-resolver'

#
#
# ****************************************************************************
class NamespaceDetails
    constructor: (namespace_, store_, resolvedAddressContext_) ->
        try
            # Extract the context we need to retain from the resolved address context object.
            @dataReference = addressResolver.getResolvedNamedObjectReference resolvedAddressContext_
            @resolvedTokenArray = addressResolver.getResolvedTokenVector resolvedAddressContext_
            @getResolvedToken = => @resolvedTokenArray.length and @resolvedTokenArray[@resolvedTokenArray.length - 1] or undefined
            @resolvedAddress = undefined
        catch exception
            throw new Error("NamespaceDetails failure: #{exception.message}")

#
#
# ****************************************************************************
module.exports = class Namespace

    constructor: (store_, resolvedAddressContext_) ->
        try
            if not (store_? and store_) then throw new Error("Missing object store input parameter.")
            @store = store_
            @implementation = new NamespaceDetails(@, store_, resolvedAddressContext_)

        catch exception
            throw new Error("onm.Namespace constructor failed: #{exception.message}")

    #
    # ============================================================================
    # Returns the namespace model's 'jsonTag' value.
    name: =>
        try
            @implementation.getResolvedToken().namespaceDescriptor.jsonTag
        catch exception
            throw new Error("onm.Namespace.name failed: #{exception.message}")

    #
    # ============================================================================
    # Returns a reference to the namespace's associated data object.
    data: => @implementation.dataReference

    #
    # ============================================================================
    # Returns a reference to namespace's associated model descriptor object.
    model: =>
        try
            @adress().getModel()
        catch exception_
            throw new Error "onm.Namespace.model failed: #{exception_.message}"

    #
    # ============================================================================
    # Returns this namespace component's assigned key value.
    ckey: =>
        try
            @implementation.getResolvedToken().key
        catch exception_
            throw new Error "onm.Namespace.ckey failed: #{exception_.message}"

    #
    # ============================================================================
    caddress: =>
        try
            @address().createComponentAddress()
        catch exception_
            throw new Error "onm.Namespace.caddress failed: #{exception_.message}"

    #
    # ============================================================================
    # Returns onm.Address of the store's root namespace.
    raddress: =>
        try
            @store.address()
        catch exception_
            throw new Error "onm.Namespace.raddress faled: #{exception_.message}"

    #
    # ============================================================================
    getComponentKey: =>
        console.log "onm v0.3: onm.Namespace.getComponentKey is deprecated. Use v0.3 onm.Namespace.ckey API."
        @key()

    #
    # ============================================================================
    getResolvedAddress: =>
        console.log "onm v0.3: onm.Namespace.getResolvedAddress has been deprecated. Use v0.3 onm.Namespace.address API."
        @address()

    #
    # ============================================================================
    # rprls = relative path resource locator string
    # If ommitted, address returns onm.Address of this namespace.
    address: (rprls_) =>
        try
            targetAddress = @implementation.resolvedAddress
            if not (targetAddress? and targetAddress)
                targetAddress = @implementation.resolvedAddress = new Address @store.model, @implementation.resolvedTokenArray
            if not (rprls_? and rprls_)
                return targetAddress
            rprlsType = Object.prototype.toString.call rprls_
            if rprlsType != '[object String]'
                throw new Error "Invalid type '#{rprsType}'. Expected '[object String]'."
            rprlsTokens = rprls_.split '.'
            generations = 0
            for prlsToken in rprlsTokens
                if prlsToken == '//'
                    generations++
                else
                    break
            rprlsAscend = rprlsTokens.join generations, rprplsTokens.length, '.'
            if generations
                targetAddress = targetAddress.createParentAddress descendCount
            targetAddress.createSubpathAddress rprlsAscend
        catch exception_
            throw new Error "onm.Namespace.address failed: #{exception_.message}"

    #
    # ============================================================================
    # request_ = {
    #     operation: string one of "open", "create", or "access"
    #     rl: typically a relative path resource locator string, but may also
    #         be an onm.Address, or onm-format URI or LRI string assessed
    #         relative to the store container namespace, not the namespace.
    #     data: optional JavaScript object or JSON convertible to a JavaScript object
    # }
    namespace: (request_) =>
        try
            if not (request_? and request_)
                return @
            request =
                operation: request_.operation? and request_.operation or 'access'
                address: undefined
                data: request_.data? and request_.data

            if not (request_.rl? and request_.rl)
                request.address = @address()
            else
                if request_.rl instance of Address
                    request.address = request_.rl
                else
                    try
                        request.address = @address request_.rl
                    catch exception_
                        try
                            request.address = @store.address request_.rl
                        catch exception_
                            rlType = Object.prototype.toString.call request_.rl
                            switch rlType
                                when '[object String]'
                                    message = "Invalid resource locator '#{request_.rl}'. Not in model address space."
                                    break
                                else
                                    message = "Unrecognized resource locator type '#{typeof request_.rl}'."
                                    break
                            throw new Error message
            @store.namespace {
                operation: request.operation
                rl: request.rl
                data: request.data
            }

        catch exception_
            throw new Error "onm.Namespace.namespace failed: #{exception_.message}"

    #
    # ============================================================================
    nsAccess: (rl_, data_) =>
        try
            @namespace { operaton: 'access', rl: rl_, data: data_ }
        catch exception_
            throw new Error "onm.Namespace.nsAccess failed: #{exception_.message}"

    #
    # ============================================================================
    nsCreate: (rl_, data_) =>
        try
            @namespace { operation: 'create', rl: rl_, data: data_ }
        catch exception_
            throw new Error "onm.Namespace.nsCreate failed: #{exception_.message}"

    #
    # ============================================================================
    nsOpen: (rl_, data_) =>
        try
            @namespace { operation: 'open', rl: rl_, data: data_ }
        catch
            throw new Error "onm.Namespace.nsOpen failed: #{exception_.message}"

    #
    # ============================================================================
    nsComponent: (data_) =>
        try
            @namespace { operation: 'open', rl: @caddress(), data: data_ }
        catch exception_
            throw new Error "onm.Namespace.nsComponent failed: #{exception_.message}"


    #
    # ============================================================================
    toJSON: (replacer_, space_) =>
        try
            space = space_? and space_ or 0
            resultJSON = JSON.stringify(@implementation.dataReference, replacer_, space)
            if not (resultJSON? and resultJSON)
                throw new Error "Namespace data is corrupt. Unable to serialize to JSON."
            return resultJSON
        catch exception_
            throw new Error "onm.Namespace.toJSON serialization failed on address '#{@address().uri()}' with detail: #{exception_.message}"


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

            address = @address()
            semanticBindings = @store.model.getSemanticBindings()
            updateAction = semanticBindings? and semanticBindings and semanticBindings.update? and semanticBindings.update or undefined

            # Update all the parent namespaces. (may mutate store data depending on updateAction implementation)
            if updateAction? and updateAction
                updateAction(@implementation.dataReference)
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
            throw new Error("onm.Namespace.update failed: #{exception.message}")

    #
    # ============================================================================
    getExtensionPointSubcomponentCount: =>
        try
            resolvedToken = @implementation.getResolvedToken()
            if not (resolvedToken? and resolvedToken) then throw new Error("Internal error: unable to resolve token.")
            componentCount = 0
            if resolvedToken.namespaceDescriptor.namespaceType == "extensionPoint"
                componentCount = Object.keys(@implementation.dataReference).length
            return componentCount
        catch exception_
            throw new Error("onm.Namespace.getExtensionPointSubcomponentCount failed: #{exception_.message}")

    #
    # ============================================================================
    visitExtensionPointSubcomponents: (callback_) =>
        try
            resolvedToken = @implementation.getResolvedToken()
            if not (resolvedToken? and resolvedToken) then throw new Error("Internal error: unable to resolve token.")

            if resolvedToken.namespaceDescriptor.namespaceType != "extensionPoint"
                throw new Error("You may only visit the subcomponents of an extension point namespace.")

            for key, object of @implementation.dataReference
                address = @address().clone()
                token = new AddressToken(@store.model, resolvedToken.idNamespace, key, resolvedToken.namespaceDescriptor.archetypePathId)
                address.implementation.pushToken(token)
                try
                    callback_(address)
                catch exception
                    throw new Error("Failure occurred inside your callback function implementation: #{exception.message}")
            true

        catch exception
            throw new Error("onm.Namespace.visitExtensionPointSubcomponents failed: #{exception.message}")


