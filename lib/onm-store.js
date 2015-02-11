
/*
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
 */

(function() {
  var Address, AddressToken, Namespace, Store, StoreDetails, StoreReifier, addressResolver, helperFunctions, uuid;

  helperFunctions = require('./impl/onm-util-functions');

  StoreReifier = require('./impl/onm-store-reifier');

  AddressToken = require('./impl/onm-address-token');

  Address = require('./onm-address');

  Namespace = require('./onm-namespace');

  uuid = require('node-uuid');

  addressResolver = require('./impl/onm-address-resolver');

  StoreDetails = (function() {
    function StoreDetails(store_, model_, data_) {
      var addressResolverOptions, exception_, ingress, resolvedAddressContext;
      try {
        this.store = store_;
        this.model = model_;
        this.reifier = new StoreReifier(this.store);
        this.dataReference = {};
        this.objectStoreSource = "new";
        ingress = (function(_this) {
          return function(data_) {
            var dataType, result;
            result = void 0;
            if ((data_ != null) && data_) {
              dataType = Object.prototype.toString.call(data_);
              switch (dataType) {
                case '[object Object]':
                  result = data_;
                  _this.objectStoreSource = "json";
                  break;
                case '[object String]':
                  result = ingress(JSON.parse(data_));
                  break;
                default:
                  throw new Error("Invalid store construction data type '" + dataType + "'. Expected '[object Object]' or JSON equivalent string serialization.");
              }
            }
            return (result != null) && result || {};
          };
        })(this);
        addressResolverOptions = {
          strategy: 'create',
          address: this.model.createRootAddress(),
          propertyAssignmentObject: ingress(data_),
          parentDataReference: this.dataReference,
          semanticBindingsReference: this.model.getSemanticBindings()
        };
        resolvedAddressContext = addressResolver.resolve(addressResolverOptions);
        this.observers = {};
        this.observersState = {};
      } catch (_error) {
        exception_ = _error;
        throw new Error("StoreDetails failure: " + exception_.message);
      }
    }

    return StoreDetails;

  })();

  module.exports = Store = (function() {
    function Store(model_, data_) {
      var exception_;
      try {
        this.implementation = new StoreDetails(this, model_, data_);
        if (!((model_ != null) && model_)) {
          throw new Error("Missing object model parameter!");
        }
        this.model = model_;
        this.jsonTag = model_.jsonTag;
        this.label = model_.label;
        this.description = model_.description;
        this.validateAddressModel = (function(_this) {
          return function(address_) {
            var exception_;
            try {
              if (!((address_ != null) && address_)) {
                throw new Error("Missing address input parameter.");
              }
              if (!((address_.model != null) && address_.model)) {
                throw new Error("Invalid address object passed as input parameter.");
              }
              return _this.model.isEqual(address_.model);
            } catch (_error) {
              exception_ = _error;
              throw new Error("onm.Store.validateAddressModel failed: " + exception_.message);
            }
          };
        })(this);
        this.address = (function(_this) {
          return function(request_) {
            var addressRoot, addressSubpath, exception_, rls, rlsType;
            try {
              addressRoot = _this.model.createRootAddress();
              if (!((request_ != null) && request_)) {
                return addressRoot;
              }
              if (!((request_.rls != null) && request.rls)) {
                throw new Error("Request missing required resource locator string property 'rls'.");
              }
              rlsType = Object.prototype.toString.call(request_.rls);
              if (rlsType !== '[object String]') {
                throw new Error("Invalid resource locator type '" + rlsType + "'. Expected '[object String]'.");
              }
              rls = request_.rls;
              addressSubpath = null;
              try {
                addressSubpath = _this.model.createPathAddress(rls);
              } catch (_error) {
                exception_ = _error;
                try {
                  addressSubpath = _this.model.createAddressFromHumanReadableString(rls);
                } catch (_error) {
                  exception_ = _error;
                  try {
                    addressSubpath = _this.model.createAddressFromHashString(rls);
                  } catch (_error) {
                    exception_ = _error;
                    throw new Error("Invalid resource locator string '" + rls + "'.");
                  }
                }
              }
              return subpathAddress;
            } catch (_error) {
              exception_ = _error;
              throw new Error("onm.Store.address failed: " + exception_.message);
            }
          };
        })(this);
        this.namespace = (function(_this) {
          return function(request_) {
            var addressResolverOptions, exception_, namespace, request, resolvedAddressContext, rlType;
            try {
              request = {
                operation: (request_ != null) && request_ && (request_.operation != null) && request_.operation || 'access',
                address: void 0,
                data: (request_ != null) && request_ && (request_.data != null) && request_.data || {}
              };
              if (!((request_ != null) && request_)) {
                request.address = _this.address();
              } else {
                if (!((request_.rl != null) && request_.rl)) {
                  request.address = _this.address();
                } else {
                  rlType = Object.prototype.toString.call(request_.rl);
                  if (rlType === '[object String]') {
                    request.address = _this.address(request_.rl);
                  } else {
                    if (request_.rl instanceof Address) {
                      if (!_this.model.isEqual(request_.rl.model)) {
                        throw new Error("Invalid resource locator is bound to model " + request_.rl.model.uuid + ":" + request_.rl.model.uuidVersion + " not " + _this.model.uuid + ":" + _this.model.uuidVersion + " as expected.");
                      }
                      request.address = request_.rl;
                    } else {
                      throw new Error("Invalid resource locator type '" + rlType + "' specified. Expecting either onm.Address or onm-format resource locator string.");
                    }
                  }
                }
              }
              addressResolverOptions = {};
              addressResolverOptions.strategy = (request.operation === 'access' && 'negotiate') || request.operation;
              addressResolverOptions.address = request.address;
              addressResolverOptions.propertyAssignmentObject = request.data;
              addressResolverOptions.parentDataReference = _this.implementation.dataReference;
              addressResolverOptions.semanticBindingsReference = _this.model.getSemanticBindings();
              resolvedAddressContext = addressResolver.resolve(addressResolverOptions);
              namespace = new Namespace(_this, resolvedAddressContext);
              return namespace;
            } catch (_error) {
              exception_ = _error;
              throw new Error("onm.Store.namespace failed: " + exception_.message);
            }
          };
        })(this);
        this.nscreate = (function(_this) {
          return function(rl_, data_) {
            var exception_;
            try {
              return _this.namespace({
                operation: 'create',
                rl: rl_,
                data: data_
              });
            } catch (_error) {
              exception_ = _error;
              throw new Error("onm.Store.createComponent failed: " + exception_.message);
            }
          };
        })(this);
        this.nsopen = (function(_this) {
          return function(rl_, data_) {
            var exception_;
            try {
              return _this.namespace({
                operation: 'open',
                rl: rl_,
                data: data_
              });
            } catch (_error) {
              exception_ = _error;
              throw new Error("onm.Store.openNamespace failed: " + exception_.message);
            }
          };
        })(this);
        this.nsaccess = (function(_this) {
          return function(rl_, data_) {
            var exception_;
            try {
              return _this.namespace({
                operation: 'access',
                rl: rl_,
                data: data_
              });
            } catch (_error) {
              exception_ = _error;
              throw new Error("onm.Store.accessNamespace failed: " + exception_.message);
            }
          };
        })(this);
        this.createComponent = (function(_this) {
          return function(rl_, data_) {
            console.log("onm v0.3: Store.createComponent is deprecated. Use v0.3 Store.nscreate, or Store.namespace API's.");
            return _this.nscreate(rl_, data_);
          };
        })(this);
        this.openNamespace = (function(_this) {
          return function(rl_, data_) {
            console.log("onm v0.3: Store.openNamespace is deprecated. Use v0.3 Store.nsopen, or Store.namespace API's.");
            return _this.nsopen(rl_, data_);
          };
        })(this);
        this.removeComponent = (function(_this) {
          return function(address_) {
            var componentDictionary, componentKey, componentNamespace, descriptor, exception_, extensionPointAddress, extensionPointNamespace;
            try {
              if (!((address_ != null) && address_)) {
                throw new Error("Missing address input parameter!");
              }
              if (!_this.validateAddressModel(address_)) {
                throw new Error("The specified address cannot be used to reference this store because it's not bound to the same model as this store.");
              }
              if (!address_.isQualified()) {
                throw new Error("You cannot use an unqualified address to remove a component.");
              }
              descriptor = address_.implementation.getDescriptor();
              if (!descriptor.isComponent) {
                throw new Error("The specified address does not specify the root of a component.");
              }
              if (descriptor.namespaceType === "root") {
                throw new Error("The specified address refers to the root namespace of the store which cannot be removed.");
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
              exception_ = _error;
              throw new Error("onm.Store.removeComponent failed: " + exception_.message);
            }
          };
        })(this);
        this.toJSON = (function(_this) {
          return function(replacer_, space_) {
            var exception_;
            try {
              return _this.namespace().toJSON(replacer_, space_);
            } catch (_error) {
              exception_ = _error;
              throw new Error("onm.Store.toJSON failed: " + exception_.message);
            }
          };
        })(this);
        this.registerObserver = (function(_this) {
          return function(observerCallbackInterface_, observingEntityReference_) {
            var exception, observerIdCode, rootAddress;
            try {
              if (!((observerCallbackInterface_ != null) && observerCallbackInterface_)) {
                throw new Error("Missing callback interface namespace input parameter..");
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
              throw new Error("registerObserver failure: " + exception_.message);
            }
          };
        })(this);
        this.unregisterObserver = (function(_this) {
          return function(observerIdCode_) {
            var exception_, registeredObserver, rootAddress;
            try {
              if (!((observerIdCode_ != null) && observerIdCode_)) {
                throw new Error("Missing observer ID code input parameter!");
              }
              registeredObserver = _this.implementation.observers[observerIdCode_];
              if (!((registeredObserver != null) && registeredObserver)) {
                throw new Error("Unknown observer ID code provided. No registration to remove.");
              }
              _this.implementation.reifier.dispatchCallback(void 0, "onObserverDetachBegin", observerIdCode_);
              rootAddress = _this.model.createRootAddress();
              _this.implementation.reifier.reifyStoreExtensions(rootAddress, observerIdCode_, true);
              _this.implementation.reifier.unreifyStoreComponent(rootAddress, observerIdCode_);
              _this.implementation.reifier.dispatchCallback(void 0, "onObserverDetachEnd", observerIdCode_);
              _this.removeObserverState(observerIdCode_);
              return delete _this.implementation.observers[observerIdCode_];
            } catch (_error) {
              exception_ = _error;
              throw new Error("unregisterObserver failure: " + exception_.message);
            }
          };
        })(this);
        this.openObserverState = (function(_this) {
          return function(observerId_) {
            var exception_, observerState;
            try {
              if (!((observerId_ != null) && observerId_)) {
                throw new Error("Missing observer ID parameter!");
              }
              observerState = (_this.implementation.observersState[observerId_] != null) && _this.implementation.observersState[observerId_] || (_this.implementation.observersState[observerId_] = []);
              return observerState;
            } catch (_error) {
              exception_ = _error;
              throw new Error("openObserverStateObject failure: " + exception_.message);
            }
          };
        })(this);
        this.removeObserverState = (function(_this) {
          return function(observerId_) {
            if (!((observerId_ != null) && observerId_)) {
              throw new Error("Missing observer ID parameter!");
            }
            if ((typeof observerState !== "undefined" && observerState !== null) && observerState) {
              if ((_this.implementation.observerState[observerId_] != null) && _this.implementation.observerState[observerId_]) {
                delete _this.implementation.observerState[observerId_];
              }
            }
            return _this;
          };
        })(this);
        this.openObserverComponentState = (function(_this) {
          return function(observerId_, address_) {
            var componentAddress, componentNamespaceId, exception_, token;
            try {
              if (!((observerId_ != null) && observerId_)) {
                throw new Error("Missing observer ID parameter.");
              }
              if (!((address_ != null) && address_)) {
                throw new Error("Missing address input parameter.");
              }
              token = address_.implementation.getLastToken();
              componentNamespaceId = token.componentDescriptor.id;
              componentAddress = address_.createComponentAddress();
              return _this.openObserverNamespaceState(observerId_, componentAddress);
            } catch (_error) {
              exception_ = _error;
              throw new Error("openObserverComponentState failure: " + exception_.message);
            }
          };
        })(this);
        this.openObserverNamespaceState = (function(_this) {
          return function(observerId_, address_) {
            var exception_, namespacePathId, namespacePathState, namespaceState, namespaceURN, observerState, token;
            try {
              if (!((observerId_ != null) && observerId_)) {
                throw new Error("Missing observer ID parameter.");
              }
              if (!((address_ != null) && address_)) {
                throw new Error("Missing address input parameter.");
              }
              observerState = _this.openObserverState(observerId_);
              token = address_.implementation.getLastToken();
              namespacePathId = token.namespaceDescriptor.id;
              namespacePathState = (observerState[namespacePathId] != null) && observerState[namespacePathId] || (observerState[namespacePathId] = {});
              namespaceURN = address_.getHashString();
              namespaceState = (namespacePathState[namespaceURN] != null) && namespacePathState[namespaceURN] || (namespacePathState[namespaceURN] = {});
              return namespaceState;
            } catch (_error) {
              exception_ = _error;
              throw new Error("openObserverNamespaceState failure: " + exception_.message);
            }
          };
        })(this);
        this.removeObserverNamespaceState = (function(_this) {
          return function(observerId_, address_) {
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
            if (helperFunctions.dictionaryLength(pathRecord) === 0) {
              delete observerState[namespaceSelector_.pathId];
            }
            return _this;
          };
        })(this);
      } catch (_error) {
        exception_ = _error;
        throw new Error("Store failure: " + exception_.message);
      }
    }

    return Store;

  })();

}).call(this);
