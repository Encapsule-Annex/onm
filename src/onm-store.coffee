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
StoreReifier = require('./impl/onm-store-reifier')
AddressToken = require('./impl/onm-address-token')
Address = require('./onm-address')
Namespace = require('./onm-namespace')
uuid = require('node-uuid')
addressResolver = require './impl/onm-address-resolver'

class StoreDetails
    constructor: (store_, model_, data_) ->
        try
            @store = store_
            @model = model_

            # Reifer "makes real" the contents of the store in the eye of the beholder (i.e. registered observers).
            # Reifier does this by traversing the contents of the store and calling change signal callback handlers
            # registered by a store's observer(s).
            @reifier = new StoreReifier(@store)

            @dataReference = {}

            @objectStoreSource = "new"

            # Initialize the new data store.
            ingress = (data_) =>
                result = undefined
                if data_? and data_
                    dataType = Object.prototype.toString.call data_
                    switch dataType
                        when '[object Object]'
                            result = data_
                            @objectStoreSource = "json"
                            break
                        when '[object String]'
                            result = ingress JSON.parse data_
                            break
                        else
                            throw new Error "Invalid store construction data type '#{dataType}'. Expected '[object Object]' or JSON equivalent string serialization."
                result? and result or {}

            addressResolverOptions =
                strategy: 'create'
                address: @model.createRootAddress()
                propertyAssignmentObject: ingress data_
                parentDataReference: @dataReference
                semanticBindingsReference: @model.getSemanticBindings()

            # TODO: connect journal notifications
            # resolved address context object == onm.Namespace construction in-parameter.
            resolvedAddressContext = addressResolver.resolve addressResolverOptions

            # We use a map to store registered model view observers. 
            @observers = {}

            # Private (and opaque) state managed on behalf of registered model view observers.
            @observersState = {}

        catch exception_
            throw new Error("StoreDetails failure: #{exception_.message}");


module.exports = class Store

    # data_ is optional. If defined, data_ must be an object, or the JSON serialization of an object.
    constructor: (model_, data_) ->
        try
            @implementation = new StoreDetails(@, model_, data_)

            #
            # ============================================================================

            # Validate parameters.
            if not (model_? and model_) then throw new Error("Missing object model parameter!");

            # Keep a reference to this object store's associated object model.
            @model = model_

            @jsonTag = model_.jsonTag
            @label = model_.label
            @description = model_.description
 
            #
            # ============================================================================
            # Returns true iff the specified Address and Store objects are both bound to the same Model.
            @validateAddressModel = (address_) =>
                try
                    if not (address_? and address_) then throw new Error("Missing address input parameter.");
                    if not (address_.model? and address_.model) then throw new Error("Invalid address object passed as input parameter.");
                    return @model.isEqual(address_.model)
                catch exception_
                    throw new Error("onm.Store.validateAddressModel failed: #{exception_.message}");

            #
            # ============================================================================
            # request_ = {
            #    // rls is an onm resource locator string: path, URI, or LRI
            #    rls: string, onm-format path, URI, or LRI
            # }
            #
            @address = (request_) =>
                try
                    addressRoot = @model.createRootAddress()
                    if not (request_? and request_)
                        return addressRoot
                    if not (request_.rls? and request.rls)
                        throw new Error "Request missing required resource locator string property 'rls'."
                    rlsType = Object.prototype.toString.call request_.rls
                    if rlsType != '[object String]'
                        throw new Error "Invalid resource locator type '#{rlsType}'. Expected '[object String]'."

                    # TODO: When we get rid of exceptions, fix this crap.
                    rls = request_.rls
                    addressSubpath = null
                    try
                        addressSubpath = @model.createPathAddress rls
                    catch exception_
                        try
                            addressSubpath = @model.createAddressFromHumanReadableString rls
                        catch exception_
                            try
                                addressSubpath = @model.createAddressFromHashString rls
                            catch exception_
                                throw new Error "Invalid resource locator string '#{rls}'."

                    subpathAddress
                        
                catch exception_
                    throw new Error "onm.Store.address failed: #{exception_.message}"

            #
            # ============================================================================
            # New in onm v0.3
            # onm.Store.namepace constructs and returns an onm.Namespace instance with
            # the specified data, if any, written over existing property values. Or,
            # in the case of namespace resource(s) that do not previous exist, data
            # is considered with priority over a namespace's modeled defaults during
            # namespace and surrounding component construction. Data is particularly
            # powerful now and not limited to a single-level object. Rather, data may
            # be arbitrary data, or a JSON string. Note that currently non-JSON value
            # types in data are flagged as exceptional (i.e. the resolver throws).
            #
            # request_ = {
            #     operation: string, one of "open", "create", or "access" (default if ommitted)
            #     rl: either an onm.Address, or onm-format resource locator string convertible to onm.Address (default to root address of model if ommitted)
            #     data: either a JavaScript object or JSON string convertible to a JavaScript object
            # }
            #
            # Note that the Store.namespace method serves a common code path for
            # new v0.3 methods Store.nscreate, Store.nsopen, Store.nsaccess. And, by
            # extension the deprecated Store.createComponent and Store.openNamespace
            # API's and are all just convience aliases for Store.namespace method.
            # Different style clients will prefer one API style over the other. 
            # Performance is roughly equal so use either as fits your coding style.
            #
            @namespace = (request_) =>
                try
                    request =
                        operation: 'access'
                        address: undefined
                        data: request_? and request_ and request_.data? and request_.data or {}
                        
                    if not (request_? and request_ and request_.rl? and request_.rl)
                        request.address = @address() # root address of the model bound to this store instance
                    else
                        rlType = Object.prototype.toString.call request_.rl
                        if rlType == '[object String]'
                            # If different data model, rls parse will sort it out.
                            request.address = @address request_.rl
                        else
                            if request_.rl instanceof Address
                                # We don't know that this address is in the right space.
                                if not @model.isEqual request_.rl.model
                                    throw new Error "Invalid resource locator is bound to model #{request_.rl.model.uuid}:#{request_.rl.model.uuidVersion} not #{@model.uuid}:#{@model.uuidVersion} as expected."
                                request.address = request_.rl
                            else
                                throw new Error "Invalid resource locator type '#{rlType}' specified. Expecting either onm.Address or onm-format resource locator string."
                        if request_.operation? and request_.operation
                            request.operation = request_.operation                                    

                    addressResolverOptions = {}
                    addressResolverOptions.strategy = (request.operation == 'access' and 'negotiate') or request.operation
                    addressResolverOptions.address = request.address
                    addressResolverOptions.propertyAssignmentObject = request.data
                    addressResolverOptions.parentDataReference = @implementation.dataReference
                    addressResolverOptions.semanticBindingsReference = @model.getSemanticBindings()
                                            
                    resolvedAddressContext = addressResolver.resolve addressResolverOptions
                    namespace = new Namespace @, resolvedAddressContext
                    return namespace

                 catch exception_
                     throw new Error "onm.Store.namespace failed: #{exception_.message}"                     
                     

            #
            # ============================================================================
            # New in v0.3. Signature is backwards compatible with onm v0.2 createComponent.
            # Enhanced resource location semantics: rl_, as always, may be a reference
            # to an Address instance. Or, rl_ may now be an onm-format resource locator 
            # string (path, URI, LRI). Also, v0.3 eliminates the restriction that the 
            # resource locator resolve to the root namespace of a data component. Rather,
            # creating any namespace within a component will result in creation of the entire
            # component. What's subtle but important about this is that it allows for component
            # creation and the application of data_ to a component subnamespace in a single call.
            # This same operation in previous versions of onm would have required 6-10 discrete
            # onm API calls to accomplish the same.
            # Throws if target resource previously exists.
            @nscreate = (rl_, data_) =>
                try
                    @namespace { operation: 'create', rl: rl_, data: data_ }
                catch exception_
                    throw new Error "onm.Store.createComponent failed: #{exception_.message}"


            #
            # ============================================================================
            # New in v0.3. Signature is backwards compatible with onm v0.2 openNamespace.
            # Resource locator semantics same as nscreate.
            # Throws if target resource does not exist.
            @nsopen = (rl_, data_) =>
                try
                    @namespace { operation: 'open', rl: rl_, data: data_ }
                catch exception_
                    throw new Error "onm.Store.openNamespace failed: #{exception_.message}"

            #
            # ============================================================================
            # New in v0.3.
            # Resource locator semantics same as nscreate
            # 'access' is an alias for open or create if not exist. Note that the resource
            # locator is not constrained to component boundaries but will fault in new
            # components as required to fullfill the request.
            @nsaccess = (rl_, data_) =>
                try
                    @namespace { operation: 'access', rl: rl_, data: data_ }
                catch exception_
                    throw new Error "onm.Store.accessNamespace failed: #{exception_.message}"



            #### \\\\ DEPRECATED \\\\ ####
            #
            # ============================================================================
            @createComponent = (rl_, data_) =>
                console.log "onm v0.3: Store.createComponent is deprecated. Use v0.3 Store.nscreate, or Store.namespace API's."
                @nscreate rl_, data_

            #
            # ============================================================================
            @openNamespace = (rl_, data_) =>
                console.log "onm v0.3: Store.openNamespace is deprecated. Use v0.3 Store.nsopen, or Store.namespace API's."
                @nsopen rl_, data_

            #### //// DEPRECATED //// ####


            #
            # ============================================================================
            # v0.3 note: I'm leaving this alone for now until I circle back to upgrade
            # the notification and observer interface systemically. onm v0.2 observer
            # interface is maintained into v0.3 at least for the time being.
            #
            @removeComponent = (address_) =>
                try
                    if not (address_? and address_) then throw new Error("Missing address input parameter!");
                    if not @validateAddressModel(address_) then throw new Error("The specified address cannot be used to reference this store because it's not bound to the same model as this store.");
                    if not address_.isQualified() then throw new Error("You cannot use an unqualified address to remove a component.");
                    descriptor = address_.implementation.getDescriptor()
                    if not descriptor.isComponent then throw new Error("The specified address does not specify the root of a component.");
                    if descriptor.namespaceType == "root" then throw new Error("The specified address refers to the root namespace of the store which cannot be removed.");
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

                catch exception_
                    throw new Error("onm.Store.removeComponent failed: #{exception_.message}");

            #
            # ============================================================================
            @toJSON = (replacer_, space_) =>
                try 
                    @namespace().toJSON replacer_, space_
                catch exception_
                    throw new Error "onm.Store.toJSON failed: #{exception_.message}"


            # 
            # ============================================================================
            @registerObserver = (observerCallbackInterface_, observingEntityReference_) =>
                try
                    if not (observerCallbackInterface_? and observerCallbackInterface_) then throw new Error("Missing callback interface namespace input parameter..");
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
                    throw new Error("registerObserver failure: #{exception_.message}");

            #
            # ============================================================================
            @unregisterObserver = (observerIdCode_) =>
                try
                    if not (observerIdCode_? and observerIdCode_) then throw new Error("Missing observer ID code input parameter!");

                    registeredObserver = @implementation.observers[observerIdCode_]

                    if not (registeredObserver? and registeredObserver)
                        throw new Error("Unknown observer ID code provided. No registration to remove.");

                    @implementation.reifier.dispatchCallback(undefined, "onObserverDetachBegin", observerIdCode_)

                    # Get the store's root address.
                    rootAddress = @model.createRootAddress()

                    @implementation.reifier.reifyStoreExtensions(rootAddress, observerIdCode_, true)
                    @implementation.reifier.unreifyStoreComponent(rootAddress, observerIdCode_)

                    @implementation.reifier.dispatchCallback(undefined, "onObserverDetachEnd", observerIdCode_)

                    @removeObserverState(observerIdCode_)

                    # Remove the registration.
                    delete @implementation.observers[observerIdCode_]

                catch exception_
                    throw new Error("unregisterObserver failure: #{exception_.message}");

            #
            # ============================================================================
            @openObserverState = (observerId_) =>
                try
                    if not (observerId_? and observerId_) then throw new Error("Missing observer ID parameter!");
                    observerState = @implementation.observersState[observerId_]? and @implementation.observersState[observerId_] or @implementation.observersState[observerId_] = []
                    return observerState                    

                catch exception_
                    throw new Error("openObserverStateObject failure: #{exception_.message}");

            #
            # ============================================================================
            @removeObserverState = (observerId_) =>
                if not (observerId_? and observerId_) then throw new Error("Missing observer ID parameter!");
                if observerState? and observerState
                    if @implementation.observerState[observerId_]? and @implementation.observerState[observerId_]
                        delete @implementation.observerState[observerId_]
                @

            #
            # ============================================================================
            @openObserverComponentState = (observerId_, address_) =>
                try
                    if not (observerId_? and observerId_) then throw new Error("Missing observer ID parameter.");
                    if not (address_? and address_) then throw new Error("Missing address input parameter.");
                    token = address_.implementation.getLastToken()
                    componentNamespaceId = token.componentDescriptor.id
                    componentAddress = address_.createComponentAddress()
                    return @openObserverNamespaceState(observerId_, componentAddress)
                catch exception_
                    throw new Error("openObserverComponentState failure: #{exception_.message}");

            #
            # ============================================================================
            @openObserverNamespaceState = (observerId_, address_) =>
                try
                    if not (observerId_? and observerId_) then throw new Error("Missing observer ID parameter.");
                    if not (address_? and address_) then throw new Error("Missing address input parameter.");
                    observerState = @openObserverState(observerId_)
                    token = address_.implementation.getLastToken()
                    namespacePathId = token.namespaceDescriptor.id
                    namespacePathState = observerState[namespacePathId]? and observerState[namespacePathId] or observerState[namespacePathId] = {}
                    namespaceURN = address_.getHashString()
                    namespaceState = namespacePathState[namespaceURN]? and namespacePathState[namespaceURN] or namespacePathState[namespaceURN] = {}
                    return namespaceState

                catch exception_
                    throw new Error("openObserverNamespaceState failure: #{exception_.message}");

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
                if helperFunctions.dictionaryLength(pathRecord) == 0
                    delete observerState[namespaceSelector_.pathId]
                return @

        catch exception_
            throw new Error("Store failure: #{exception_.message}");


        

        
