/*
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
*/


(function() {
  var AddressToken, AddressTokenBinder, Namespace, Store, StoreDetails, StoreReifier, jslib, uuid;

  jslib = require('./encapsule-lib-javascript');

  StoreReifier = require('./ONMjs-core-store-reifier');

  AddressToken = require('./ONMjs-core-address-token');

  AddressTokenBinder = require('./ONMjs-core-address-binder');

  Namespace = require('./ONMjs-core-namespace');

  uuid = require('node-uuid');

  StoreDetails = (function() {
    function StoreDetails(store_, model_, initialStateJSON_) {
      var exception;
      try {
        this.store = store_;
        this.model = model_;
        this.reifier = new StoreReifier(this.store);
        this.dataReference = {};
        this.objectStoreSource = void 0;
        this.observers = {};
        this.observersState = {};
      } catch (_error) {
        exception = _error;
        throw "StoreDetails failure: " + exception;
      }
    }

    return StoreDetails;

  })();

  module.exports = Store = (function() {
    function Store(model_, initialStateJSON_) {
      var exception, token, tokenBinder,
        _this = this;
      try {
        this.implementation = new StoreDetails(this, model_, initialStateJSON_);
        if (!((model_ != null) && model_)) {
          throw "Missing object model parameter!";
        }
        this.model = model_;
        this.jsonTag = model_.jsonTag;
        this.label = model_.label;
        this.description = model_.description;
        if ((initialStateJSON_ != null) && initialStateJSON_) {
          this.implementation.dataReference = JSON.parse(initialStateJSON_);
          if (!((this.implementation.dataReference != null) && this.implementation.dataReference)) {
            throw "Cannot deserialize specified JSON string!";
          }
          this.implementation.objectStoreSource = "json";
        } else {
          this.implementation.dataReference = {};
          this.implementation.objectStoreSource = "new";
          token = new AddressToken(model_, void 0, void 0, 0);
          tokenBinder = new AddressTokenBinder(this, this.implementation.dataReference, token, "new");
        }
        this.validateAddressModel = function(address_) {
          var exception;
          try {
            if (!((address_ != null) && address_)) {
              throw "Missing address input parameter.";
            }
            return _this.model.isEqual(address_.model);
          } catch (_error) {
            exception = _error;
            throw "validateAddressModel failure: " + exception;
          }
        };
        this.createComponent = function(address_) {
          var componentNamespace, descriptor, exception;
          try {
            if (!((address_ != null) && address_)) {
              throw "Missing object model namespace selector input parameter.";
            }
            if (!_this.validateAddressModel(address_)) {
              throw "The specified address cannot be used to reference this store because it's not bound to the same model as this store.";
            }
            if (address_.isQualified()) {
              throw "The specified address is qualified and may only be used to specify existing objects in the store.";
            }
            descriptor = address_.implementation.getDescriptor();
            if (!descriptor.isComponent) {
              throw "The specified address does not specify the root of a component.";
            }
            if (descriptor.namespaceType === "root") {
              throw "The specified address refers to the root namespace of the store which is created automatically.";
            }
            componentNamespace = new Namespace(_this, address_, "new");
            return componentNamespace;
          } catch (_error) {
            exception = _error;
            throw "createComponent failure: " + exception;
          }
        };
        this.removeComponent = function(address_) {
          var componentDictionary, componentKey, componentNamespace, descriptor, exception, extensionPointAddress, extensionPointNamespace;
          try {
            if (!((address_ != null) && address_)) {
              throw "Missing address input parameter!";
            }
            if (!_this.validateAddressModel(address_)) {
              throw "The specified address cannot be used to reference this store because it's not bound to the same model as this store.";
            }
            if (!address_.isQualified()) {
              throw "You cannot use an unqualified address to remove a component.";
            }
            descriptor = address_.implementation.getDescriptor();
            if (!descriptor.isComponent) {
              throw "The specified address does not specify the root of a component.";
            }
            if (descriptor.namespace === "root") {
              throw "The specified address refers to the root namespace of the store which cannot be removed.";
            }
            _this.implementation.reifier.reifyStoreExtensions(address_, void 0, true);
            _this.implementation.reifier.unreifyStoreComponent(address_);
            componentNamespace = _this.openNamespace(address_);
            extensionPointAddress = address_.createParentAddress();
            extensionPointNamespace = _this.openNamespace(extensionPointAddress);
            componentDictionary = extensionPointNamespace.data();
            componentKey = address_.implementation.getLastToken().key;
            delete componentDictionary[componentKey];
            extensionPointNamespace.update();
            return componentNamespace;
          } catch (_error) {
            exception = _error;
            throw "removeComponent failure: " + exception;
          }
        };
        this.openNamespace = function(address_) {
          var exception, namespace;
          try {
            if (!(address_ && address_)) {
              throw "Missing address input parameter.";
            }
            if (!_this.validateAddressModel(address_)) {
              throw "The specified address cannot be used to reference this store because it's not bound to the same model as this store.";
            }
            namespace = new Namespace(_this, address_, "bypass");
            return namespace;
          } catch (_error) {
            exception = _error;
            throw "openNamespace failure: " + exception;
          }
        };
        this.toJSON = function(replacer_, space_) {
          var exception, resultJSON, rootNamespace;
          try {
            rootNamespace = _this.openNamespace(_this.model.createRootAddress());
            resultJSON = rootNamespace.toJSON(replacer_, space_);
            return resultJSON;
          } catch (_error) {
            exception = _error;
            throw "toJSON fail on object store " + _this.jsonTag + " : " + exception;
          }
        };
        this.registerObserver = function(observerCallbackInterface_, observingEntityReference_) {
          var exception, observerIdCode, rootAddress;
          try {
            if (!((observerCallbackInterface_ != null) && observerCallbackInterface_)) {
              throw "Missing callback interface namespace input parameter..";
            }
            observerCallbackInterface_.observingEntity = observingEntityReference_;
            observerIdCode = uuid.v4();
            _this.implementation.observers[observerIdCode] = observerCallbackInterface_;
            rootAddress = _this.model.createRootAddress();
            _this.implementation.reifier.dispatchCallback(void 0, "onObserverAttachBegin", observerIdCode);
            _this.implementation.reifier.reifyStoreComponent(rootAddress, observerIdCode);
            _this.implementation.reifier.reifyStoreExtensions(rootAddress, observerIdCode);
            _this.implementation.reifier.dispatchCallback(void 0, "onObserverAttachEnd", observerIdCode);
            return observerIdCode;
          } catch (_error) {
            exception = _error;
            throw "registerObserver failure: " + exception;
          }
        };
        this.unregisterObserver = function(observerIdCode_) {
          var exception, registeredObserver, rootAddress;
          try {
            if (!((observerIdCode_ != null) && observerIdCode_)) {
              throw "Missing observer ID code input parameter!";
            }
            registeredObserver = _this.implementation.observers[observerIdCode_];
            if (!((registeredObserver != null) && registeredObserver)) {
              throw "Unknown observer ID code provided. No registration to remove.";
            }
            _this.implementation.reifier.dispatchCallback(void 0, "onObserverDetachBegin", observerIdCode_);
            rootAddress = _this.model.createRootAddress();
            _this.implementation.reifier.reifyStoreExtensions(rootAddress, observerIdCode_, true);
            _this.implementation.reifier.unreifyStoreComponent(rootAddress, observerIdCode_);
            _this.implementation.reifier.dispatchCallback(void 0, "onObserverDetachEnd", observerIdCode_);
            _this.removeObserverState(observerIdCode_);
            return delete _this.implementation.observers[observerIdCode_];
          } catch (_error) {
            exception = _error;
            throw "unregisterObserver failure: " + exception;
          }
        };
        this.openObserverState = function(observerId_) {
          var exception, observerState;
          try {
            if (!((observerId_ != null) && observerId_)) {
              throw "Missing observer ID parameter!";
            }
            observerState = (_this.implementation.observersState[observerId_] != null) && _this.implementation.observersState[observerId_] || (_this.implementation.observersState[observerId_] = []);
            return observerState;
          } catch (_error) {
            exception = _error;
            throw "openObserverStateObject failure: " + exception;
          }
        };
        this.removeObserverState = function(observerId_) {
          if (!((observerId_ != null) && observerId_)) {
            throw "Missing observer ID parameter!";
          }
          if ((typeof observerState !== "undefined" && observerState !== null) && observerState) {
            if ((_this.implementation.observerState[observerId_] != null) && _this.implementation.observerState[observerId_]) {
              delete _this.implementation.observerState[observerId_];
            }
          }
          return _this;
        };
        this.openObserverComponentState = function(observerId_, address_) {
          var componentAddress, componentNamespaceId, exception;
          try {
            if (!((observerId_ != null) && observerId_)) {
              throw "Missing observer ID parameter.";
            }
            if (!((address_ != null) && address_)) {
              throw "Missing address input parameter.";
            }
            token = address_.implementation.getLastToken();
            componentNamespaceId = token.componentDescriptor.id;
            componentAddress = address_.createComponentAddress();
            return _this.openObserverNamespaceState(observerId_, componentAddress);
          } catch (_error) {
            exception = _error;
            throw "openObserverComponentState failure: " + exception;
          }
        };
        this.openObserverNamespaceState = function(observerId_, address_) {
          var exception, namespacePathId, namespacePathState, namespaceState, namespaceURN, observerState;
          try {
            if (!((observerId_ != null) && observerId_)) {
              throw "Missing observer ID parameter.";
            }
            if (!((address_ != null) && address_)) {
              throw "Missing address input parameter.";
            }
            observerState = _this.openObserverState(observerId_);
            token = address_.implementation.getLastToken();
            namespacePathId = token.namespaceDescriptor.id;
            namespacePathState = (observerState[namespacePathId] != null) && observerState[namespacePathId] || (observerState[namespacePathId] = {});
            namespaceURN = address_.getHashString();
            namespaceState = (namespacePathState[namespaceURN] != null) && namespacePathState[namespaceURN] || (namespacePathState[namespaceURN] = {});
            return namespaceState;
          } catch (_error) {
            exception = _error;
            throw "openObserverNamespaceState failure: " + exception;
          }
        };
        this.removeObserverNamespaceState = function(observerId_, address_) {
          var namespaceHash, observerState, pathRecord;
          observerState = _this.modelViewObserversState[observerId_];
          if (!((observerState != null) && observerState)) {
            return _this;
          }
          pathRecord = observerState[namespaceSelector_.pathId];
          if (!((pathRecord != null) && pathRecord)) {
            return _this;
          }
          namespaceHash = namespaceSelector_.getHashString();
          delete pathRecord[namespaceHash];
          if (jslib.dictionaryLength(pathRecord) === 0) {
            delete observerState[namespaceSelector_.pathId];
          }
          return _this;
        };
      } catch (_error) {
        exception = _error;
        throw "Store failure: " + exception;
      }
    }

    return Store;

  })();

}).call(this);
