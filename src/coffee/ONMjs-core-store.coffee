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

jslib = require('./encapsule-lib-javascript')
StoreReifier = require('./ONMjs-core-store-reifier')
AddressToken = require('./ONMjs-core-address-token')
AddressTokenBinder = require('./ONMjs-core-address-binder')
Namespace = require('./ONMjs-core-namespace')
uuid = require('node-uuid')

class StoreDetails
    constructor: (store_, model_, initialStateJSON_) ->
        try
            @store = store_
            @model = model_

            # Reifer "makes real" the contents of the store in the eye of the beholder (i.e. registered observers).
            # Reifier does this by traversing the contents of the store and calling change signal callback handlers
            # registered by a store's observer(s).
            @reifier = new StoreReifier(@store)

            @dataReference = {} # the new store actual

            @objectStoreSource = undefined # this is flag indicating if the store was created from a JSON string


            # We use a map to store registered model view observers. 
            @observers = {}

            # Private (and opaque) state managed on behalf of registered model view observers.
            @observersState = {}


        catch exception
            throw "StoreDetails failure: #{exception}"


module.exports = class Store
    constructor: (model_, initialStateJSON_) ->
        try
            @implementation = new StoreDetails(@, model_, initialStateJSON_)

            #
            # ============================================================================

            # Validate parameters.
            if not (model_? and model_) then throw "Missing object model parameter!"

            # Keep a reference to this object store's associated object model.
            @model = model_

            @jsonTag = model_.jsonTag
            @label = model_.label
            @description = model_.description
 
            if initialStateJSON_? and initialStateJSON_
                @implementation.dataReference = JSON.parse(initialStateJSON_)
                if not (@implementation.dataReference? and @implementation.dataReference)
                    throw "Cannot deserialize specified JSON string!"
                @implementation.objectStoreSource = "json"
                
            else
                @implementation.dataReference = {}
                @implementation.objectStoreSource = "new"
                # Low-level create of the root component.
                token = new AddressToken(model_, undefined, undefined, 0)
                tokenBinder = new AddressTokenBinder(@, @implementation.dataReference, token, "new")


            #
            # ============================================================================
            # Returns true iff the specified Address and Store objects are both bound to the same Model.
            @validateAddressModel = (address_) =>
                try
                    if not (address_? and address_) then throw "Missing address input parameter."
                    return @model.isEqual(address_.model)
                catch exception
                    throw "validateAddressModel failure: #{exception}"


            #
            # ============================================================================
            @createComponent = (address_) =>
                try
                    if not (address_? and address_) then throw "Missing object model namespace selector input parameter."
                    if not @validateAddressModel(address_) then throw "The specified address cannot be used to reference this store because it's not bound to the same model as this store."
                    if address_.isQualified() then throw "The specified address is qualified and may only be used to specify existing objects in the store."
                    descriptor = address_.implementation.getDescriptor()
                    if not descriptor.isComponent then throw "The specified address does not specify the root of a component."
                    if descriptor.namespaceType == "root" then throw "The specified address refers to the root namespace of the store which is created automatically."

                    # Creating the root namespace of a component automatically creates all its sub-namespaces as well.
                    componentNamespace = new Namespace(@, address_, "new")
                    return componentNamespace

                catch exception

                    throw "createComponent failure: #{exception}"

            #
            # ============================================================================
            @removeComponent = (address_) =>
                try
                    if not (address_? and address_) then throw "Missing address input parameter!"
                    if not @validateAddressModel(address_) then throw "The specified address cannot be used to reference this store because it's not bound to the same model as this store."
                    if not address_.isQualified() then throw "You cannot use an unqualified address to remove a component."
                    descriptor = address_.implementation.getDescriptor()
                    if not descriptor.isComponent then throw "The specified address does not specify the root of a component."
                    if descriptor.namespace == "root" then throw "The specified address refers to the root namespace of the store which cannot be removed."
                    # Unrefify the component before actually making any modifications to the store.
                    # modelViewObserver_ == undefined -> broadcast to all registered observers
                    # undoFlag_ == true -> invert namespace traversal order and invoke remove callbacks
                    @implementation.reifier.reifyStoreExtensions(address_, undefined, true)
                    @implementation.reifier.unreifyStoreComponent(address_)
                    componentNamespace = @openNamespace(address_)
                    extensionPointAddress = address_.createParentAddress()
                    extensionPointNamespace = @openNamespace(extensionPointAddress)
                    componentDictionary = extensionPointNamespace.data()
                    componentKey = address_.implementation.getLastToken().key
                    delete componentDictionary[componentKey]
                    extensionPointNamespace.update()
                    return componentNamespace

                catch exception
                    throw "removeComponent failure: #{exception}"


            #
            # ============================================================================
            # Assumes the existence of the namespace indicated by the specified selector.
            # Throws if the selector cannot be resolved against the contents of the store.
            #
            @openNamespace = (address_) =>
                try
                    if not (address_ and address_) then throw "Missing address input parameter."
                    if not @validateAddressModel(address_) then throw "The specified address cannot be used to reference this store because it's not bound to the same model as this store."
                    namespace = new Namespace(@, address_, "bypass")
                    return namespace

                catch exception
                    throw "openNamespace failure: #{exception}"
                

            #
            # ============================================================================
            @toJSON = (replacer_, space_) =>
                try
                    rootNamespace = @openNamespace(@model.createRootAddress())
                    resultJSON = rootNamespace.toJSON(replacer_, space_)
                    return resultJSON

                catch exception
                    throw "toJSON fail on object store #{@jsonTag} : #{exception}"

            # 
            # ============================================================================
            # A model view object may be registered with the OM store object to receive
            # callbacks when the contents of the store is modified. In the context of
            # registration, the observer will receive series of callbacks (one per store
            # namespace) that the model view class leverages to initialize its internal
            # state. Subsequently, mutation of the store will generate additional callback(s)
            # specifying the namespace(s) that have been modified. Any number of model view
            # object may be registered with the store. Upon successful registration, this
            # method returns an "observer ID code" that the observer should cache. An
            # observer can be unregistered by calling unregisterModelViewObserver providing
            # the "observer ID code" received when it was registered.
            #
            @registerObserver = (observerCallbackInterface_, observingEntityReference_) =>
                try
                    if not (observerCallbackInterface_? and observerCallbackInterface_) then throw "Missing callback interface namespace input parameter.."
                    observerCallbackInterface_.observingEntity = observingEntityReference_

                    # Create a new observer ID code (UUID because multiple registrations allowed).
                    observerIdCode = uuid.v4()

                    # Affect the registration using the observer ID as the key and the caller's modelViewObject_ by reference.
                    @implementation.observers[observerIdCode] = observerCallbackInterface_

                    # The root namespace of an object store always exists and comprises the base of the root component -
                    # a hierarchy of sub-namespaces defined as the set of all descendents including extension point
                    # collections but excluding the components contained with child extension points.

                    # Get the store's root address.
                    rootAddress = @model.createRootAddress()

                    @implementation.reifier.dispatchCallback(undefined, "onObserverAttachBegin", observerIdCode)

                    # Reify the store's root component in the eye of the observer. Not that this function
                    # also reifieis all of the component's descendant namespaces as well.
                    @implementation.reifier.reifyStoreComponent(rootAddress, observerIdCode)

                    # Enumerate and reify this component's subcomponents contained in its extension points.
                    # Note that this process is repeated for every component discovered until all descendant
                    # subcomponents of the specified component have been enumerated and reified in the eye
                    # of the observer.
                    @implementation.reifier.reifyStoreExtensions(rootAddress, observerIdCode)

                    @implementation.reifier.dispatchCallback(undefined, "onObserverAttachEnd", observerIdCode)

                    return observerIdCode

                catch exception
                    throw "registerObserver failure: #{exception}"

            #
            # ============================================================================
            @unregisterObserver = (observerIdCode_) =>
                try
                    if not (observerIdCode_? and observerIdCode_) then throw "Missing observer ID code input parameter!"

                    registeredObserver = @implementation.observers[observerIdCode_]

                    if not (registeredObserver? and registeredObserver)
                        throw "Unknown observer ID code provided. No registration to remove."

                    @implementation.reifier.dispatchCallback(undefined, "onObserverDetachBegin", observerIdCode_)

                    # Get the store's root address.
                    rootAddress = @model.createRootAddress()

                    @implementation.reifier.reifyStoreExtensions(rootAddress, observerIdCode_, true)
                    @implementation.reifier.unreifyStoreComponent(rootAddress, observerIdCode_)

                    @implementation.reifier.dispatchCallback(undefined, "onObserverDetachEnd", observerIdCode_)

                    @removeObserverState(observerIdCode_)

                    # Remove the registration.
                    delete @implementation.observers[observerIdCode_]

                catch exception
                    throw "unregisterObserver failure: #{exception}"

            #
            # ============================================================================
            @openObserverState = (observerId_) =>
                try
                    if not (observerId_? and observerId_) then throw "Missing observer ID parameter!"
                    observerState = @implementation.observersState[observerId_]? and @implementation.observersState[observerId_] or @implementation.observersState[observerId_] = []
                    return observerState                    

                catch exception
                    throw "openObserverStateObject failure: #{exception}"

            #
            # ============================================================================
            @removeObserverState = (observerId_) =>
                if not (observerId_? and observerId_) then throw "Missing observer ID parameter!"
                if observerState? and observerState
                    if @implementation.observerState[observerId_]? and @implementation.observerState[observerId_]
                        delete @implementation.observerState[observerId_]
                @

            #
            # ============================================================================
            @openObserverComponentState = (observerId_, address_) =>
                try
                    if not (observerId_? and observerId_) then throw "Missing observer ID parameter."
                    if not (address_? and address_) then throw "Missing address input parameter."
                    token = address_.implementation.getLastToken()
                    componentNamespaceId = token.componentDescriptor.id
                    componentAddress = address_.createComponentAddress()
                    return @openObserverNamespaceState(observerId_, componentAddress)
                catch exception
                    throw "openObserverComponentState failure: #{exception}"

            #
            # ============================================================================
            @openObserverNamespaceState = (observerId_, address_) =>
                try
                    if not (observerId_? and observerId_) then throw "Missing observer ID parameter."
                    if not (address_? and address_) then throw "Missing address input parameter."
                    observerState = @openObserverState(observerId_)
                    token = address_.implementation.getLastToken()
                    namespacePathId = token.namespaceDescriptor.id
                    namespacePathState = observerState[namespacePathId]? and observerState[namespacePathId] or observerState[namespacePathId] = {}
                    namespaceURN = address_.getHashString()
                    namespaceState = namespacePathState[namespaceURN]? and namespacePathState[namespaceURN] or namespacePathState[namespaceURN] = {}
                    return namespaceState

                catch exception
                    throw "openObserverNamespaceState failure: #{exception}"

            #
            # ============================================================================
            @removeObserverNamespaceState = (observerId_, address_) =>

                observerState = @modelViewObserversState[observerId_]
                if not (observerState? and observerState)
                    return @
                pathRecord = observerState[namespaceSelector_.pathId]
                if not (pathRecord? and pathRecord)
                    return @
                namespaceHash = namespaceSelector_.getHashString()
                delete pathRecord[namespaceHash]
                if jslib.dictionaryLength(pathRecord) == 0
                    delete observerState[namespaceSelector_.pathId]
                return @


        catch exception
            throw "Store failure: #{exception}"


        

        
