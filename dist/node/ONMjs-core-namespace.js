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
  var Address, AddressToken, AddressTokenBinder, Namespace, NamespaceDetails,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  AddressToken = require('./ONMjs-core-address-token');

  AddressTokenBinder = require('./ONMjs-core-address-binder');

  Address = require('./ONMjs-core-address');

  NamespaceDetails = (function() {
    function NamespaceDetails(namespace_, store_, address_, mode_) {
      var exception,
        _this = this;
      try {
        this.dataReference = (store_.implementation.dataReference != null) && store_.implementation.dataReference || (function() {
          throw "Cannot resolve object store's root data reference.";
        })();
        this.resolvedTokenArray = [];
        this.getResolvedToken = function() {
          return _this.resolvedTokenArray.length && _this.resolvedTokenArray[_this.resolvedTokenArray.length - 1] || void 0;
        };
        this.resolvedAddress = void 0;
      } catch (_error) {
        exception = _error;
        throw "NamespaceDetails failure: " + exception;
      }
    }

    return NamespaceDetails;

  })();

  module.exports = Namespace = (function() {
    function Namespace(store_, address_, mode_) {
      this.visitExtensionPointSubcomponents = __bind(this.visitExtensionPointSubcomponents, this);
      this.update = __bind(this.update, this);
      this.fromJSON = __bind(this.fromJSON, this);
      this.fromData = __bind(this.fromData, this);
      this.toJSON = __bind(this.toJSON, this);
      this.data = __bind(this.data, this);
      this.getResolvedLabel = __bind(this.getResolvedLabel, this);
      this.getResolvedAddress = __bind(this.getResolvedAddress, this);
      var address, addressToken, componentAddress, exception, extensionPointAddress, extensionPointNamespace, mode, objectModel, objectModelNameKeys, objectModelNameStore, resolvedAddress, tokenBinder, _i, _len, _ref;
      try {
        if (!((store_ != null) && store_)) {
          throw "Missing object store input parameter.";
        }
        this.store = store_;
        this.implementation = new NamespaceDetails(this, store_, address_, mode_);
        address = void 0;
        if (!((address_ != null) && address_ && address_.implementation.tokenVector.length)) {
          objectModel = store_.model;
          address = new Address(objectModel, [new AddressToken(objectModel, void 0, void 0, 0)]);
        } else {
          address = address_;
        }
        objectModelNameStore = store_.model.jsonTag;
        objectModelNameKeys = address.model.jsonTag;
        if (objectModelNameStore !== objectModelNameKeys) {
          throw "You cannot access a '" + objectModelNameStore + "' store namespace with a '" + objectModelNameKeys + "' object model address!";
        }
        if (!address.isComplete()) {
          throw "Specified address is invalid because the first address token does not specify the object store's root component.";
        }
        mode = (mode_ != null) && mode_ || "bypass";
        if ((mode !== "new") && !address.isResolvable()) {
          throw "'" + mode + "' mode error: Unresolvable address '" + (address.getHumanReadableString()) + "' invalid for this operation.";
        }
        _ref = address.implementation.tokenVector;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          addressToken = _ref[_i];
          tokenBinder = new AddressTokenBinder(store_, this.implementation.dataReference, addressToken, mode);
          this.implementation.resolvedTokenArray.push(tokenBinder.resolvedToken);
          this.implementation.dataReference = tokenBinder.dataReference;
          if (mode === "new") {
            if (addressToken.idComponent) {
              if (!((addressToken.key != null) && addressToken.key)) {
                resolvedAddress = new Address(this.store.model, this.implementation.resolvedTokenArray);
                componentAddress = resolvedAddress.createComponentAddress();
                this.store.implementation.reifier.reifyStoreComponent(componentAddress);
                extensionPointAddress = componentAddress.createParentAddress();
                extensionPointNamespace = this.store.openNamespace(extensionPointAddress);
                extensionPointNamespace.update();
              }
            }
          }
          true;
        }
      } catch (_error) {
        exception = _error;
        throw "Namespace failure: " + exception;
      }
    }

    Namespace.prototype.getResolvedAddress = function() {
      var exception;
      try {
        if ((this.implementation.resolvedAddress != null) && this.implementation.resolvedAddress) {
          return this.implementation.resolvedAddress;
        }
        this.implementation.resolvedAddress = new Address(this.store.model, this.implementation.resolvedTokenArray);
        return this.implementation.resolvedAddress;
      } catch (_error) {
        exception = _error;
        throw "getResolvedAddress failure: " + exception;
      }
    };

    Namespace.prototype.getResolvedLabel = function() {
      var exception, getLabelBinding, resolvedDescriptor, resolvedLabel, semanticBindings;
      try {
        resolvedDescriptor = this.implementation.getResolvedToken().namespaceDescriptor;
        semanticBindings = this.store.model.getSemanticBindings();
        getLabelBinding = (semanticBindings != null) && semanticBindings && (semanticBindings.getLabel != null) && semanticBindings.getLabel || void 0;
        resolvedLabel = void 0;
        if ((getLabelBinding != null) && getLabelBinding) {
          resolvedLabel = getLabelBinding(this.data(), this.getResolvedAddress());
        } else {
          resolvedLabel = resolvedDescriptor.label;
        }
        return resolvedLabel;
      } catch (_error) {
        exception = _error;
        throw "getResolvedLabel failure: " + exception;
      }
    };

    Namespace.prototype.data = function() {
      return this.implementation.dataReference;
    };

    Namespace.prototype.toJSON = function(replacer_, space_) {
      var exception, namespaceDescriptor, resultJSON, resultObject, space;
      try {
        namespaceDescriptor = this.implementation.getResolvedToken().namespaceDescriptor;
        resultObject = {};
        resultObject[namespaceDescriptor.jsonTag] = this.data();
        space = (space_ != null) && space_ || 0;
        resultJSON = JSON.stringify(resultObject, replacer_, space);
        if (!((resultJSON != null) && resultJSON)) {
          throw "Cannot serialize Javascript object to JSON!";
        }
        return resultJSON;
      } catch (_error) {
        exception = _error;
        throw "toJSON failure: " + exception;
      }
    };

    Namespace.prototype.fromData = function(data_) {
      var address, exception, extensionPointNamespace, model, namespaceComponentKey, newComponentData, newComponentKey;
      try {
        address = this.getResolvedAddress();
        model = address.getModel();
        if (!((model.namespaceType === "root") || (model.namespaceType === "component"))) {
          throw "Data import only supported on its root and component namespaces. This namespace '" + model.namespaceType + "'-type namespace.";
        }
        newComponentData = data_[model.jsonTag];
        if (!((newComponentData != null) && newComponentData)) {
          throw "Unexpected input data missing expected root object '" + model.jsonTag + "'.";
        }
        if (model.namespaceType === "component") {
          newComponentKey = this.store.model.getSemanticBindings().getUniqueKey(newComponentData);
          namespaceComponentKey = address.implementation.getLastToken().key;
          if (newComponentKey !== namespaceComponentKey) {
            throw "Unexpected input data missing or unexpected component key value.";
          }
        }
        extensionPointNamespace = this.store.openNamespace(address.createParentAddress());
        this.store.removeComponent(address);
        extensionPointNamespace.data()[address.implementation.getLastToken().key] = newComponentData;
        this.store.implementation.reifier.reifyStoreComponent(address);
        return address;
      } catch (_error) {
        exception = _error;
        throw "fromData failure: " + exception;
      }
    };

    Namespace.prototype.fromJSON = function(json_) {
      var data, exception, resolvedAddress;
      try {
        data = void 0;
        try {
          data = JSON.parse(json_);
        } catch (_error) {
          exception = _error;
          throw "JSON.parse failed: " + exception;
        }
        resolvedAddress = void 0;
        try {
          resolvedAddress = this.fromData(data);
        } catch (_error) {
          exception = _error;
          throw "After successful JSON parse, failure in data handler: " + exception;
        }
        return resolvedAddress;
      } catch (_error) {
        exception = _error;
        throw "fromJSON failure: " + exception;
      }
    };

    Namespace.prototype.update = function() {
      var address, containingComponentNotified, count, descriptor, exception, semanticBindings, updateAction, _results,
        _this = this;
      try {
        address = this.getResolvedAddress();
        semanticBindings = this.store.model.getSemanticBindings();
        updateAction = (semanticBindings != null) && semanticBindings && (semanticBindings.update != null) && semanticBindings.update || void 0;
        if ((updateAction != null) && updateAction) {
          updateAction(this.data());
          address.visitParentAddressesDescending(function(address__) {
            var dataReference;
            dataReference = _this.store.openNamespace(address__).data();
            return updateAction(dataReference);
          });
        }
        count = 0;
        containingComponentNotified = false;
        _results = [];
        while ((address != null) && address) {
          descriptor = address.implementation.getDescriptor();
          if (count === 0) {
            this.store.implementation.reifier.dispatchCallback(address, "onNamespaceUpdated", void 0);
          } else {
            this.store.implementation.reifier.dispatchCallback(address, "onSubnamespaceUpdated", void 0);
          }
          if (descriptor.namespaceType === "component" || descriptor.namespaceType === "root") {
            if (!containingComponentNotified) {
              this.store.implementation.reifier.dispatchCallback(address, "onComponentUpdated", void 0);
              containingComponentNotified = true;
            } else {
              this.store.implementation.reifier.dispatchCallback(address, "onSubcomponentUpdated", void 0);
            }
          }
          address = address.createParentAddress();
          _results.push(count++);
        }
        return _results;
      } catch (_error) {
        exception = _error;
        throw "update failure: " + exception;
      }
    };

    Namespace.prototype.visitExtensionPointSubcomponents = function(callback_) {
      var address, exception, key, object, resolvedToken, token, _ref;
      try {
        resolvedToken = this.implementation.getResolvedToken();
        if (!((resolvedToken != null) && resolvedToken)) {
          throw "Internal error: unable to resolve token.";
        }
        if (resolvedToken.namespaceDescriptor.namespaceType !== "extensionPoint") {
          throw "You may only visit the subcomponents of an extension point namespace.";
        }
        _ref = this.data();
        for (key in _ref) {
          object = _ref[key];
          address = this.getResolvedAddress().clone();
          token = new AddressToken(this.store.model, resolvedToken.idNamespace, key, resolvedToken.namespaceDescriptor.archetypePathId);
          address.implementation.pushToken(token);
          try {
            callback_(address);
          } catch (_error) {
            exception = _error;
            throw "Failure occurred inside your callback function implementation: " + exception;
          }
        }
        return true;
      } catch (_error) {
        exception = _error;
        throw "visitExtensionPointSubcomponents failure: " + exception;
      }
    };

    return Namespace;

  })();

}).call(this);
