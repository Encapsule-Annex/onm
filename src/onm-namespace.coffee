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
    # Renamed in v0.3
    name: =>
        try
            return @implementation.getResolvedToken().key

        catch exception
            throw new Error("getComponentKey failure: #{exception.message}")

    # DEPRECATED in v0.3
    getComponentKey: =>
        console.log "onm v0.3: onm.Namespace.getComponentKey is deprecated. Use onm.Namespace.name API."
        @name()


    #
    # ============================================================================
    data: => @implementation.dataReference


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
            throw new Error "onm.Namespace.toJSON serialization failed on address '#{@getResolvedAddress().getHumanReadableString()}' with detail: #{exception_.message}"



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
            throw new Error("update failure: #{exception.message}")



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


