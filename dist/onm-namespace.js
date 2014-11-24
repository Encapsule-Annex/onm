
/*
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
 */

(function() {
  var Address, AddressToken, AddressTokenResolver, Namespace, NamespaceDetails,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  AddressToken = require('./implementation/onm-address-token');

  AddressTokenResolver = require('./implementation/onm-address-token-resolver');

  Address = require('./onm-address');

  NamespaceDetails = (function() {
    function NamespaceDetails(namespace_, store_, address_, mode_) {
      var exception;
      try {
        this.dataReference = (store_.implementation.dataReference != null) && store_.implementation.dataReference || (function() {
          throw new Error("Cannot resolve object store's root data reference.");
        })();
        this.resolvedTokenArray = [];
        this.getResolvedToken = (function(_this) {
          return function() {
            return _this.resolvedTokenArray.length && _this.resolvedTokenArray[_this.resolvedTokenArray.length - 1] || void 0;
          };
        })(this);
        this.resolvedAddress = void 0;
        this.pendingSubcomponentDescriptors = [];
      } catch (_error) {
        exception = _error;
        throw new Error("NamespaceDetails failure: " + exception.message);
      }
    }

    return NamespaceDetails;

  })();

  module.exports = Namespace = (function() {
    function Namespace(store_, address_, mode_, keyArray_, propertyAssignmentObject_) {
      this.visitExtensionPointSubcomponents = __bind(this.visitExtensionPointSubcomponents, this);
      this.getExtensionPointSubcomponentCount = __bind(this.getExtensionPointSubcomponentCount, this);
      this.update = __bind(this.update, this);
      this.fromJSON = __bind(this.fromJSON, this);
      this.fromData = __bind(this.fromData, this);
      this.toJSON = __bind(this.toJSON, this);
      this.data = __bind(this.data, this);
      this.getResolvedLabel = __bind(this.getResolvedLabel, this);
      this.getComponentKey = __bind(this.getComponentKey, this);
      this.getResolvedAddress = __bind(this.getResolvedAddress, this);
      var address, addressToken, componentAddress, constructionOptions, exception, extensionPointAddress, extensionPointNamespace, key, keyArrayCount, keyIndex, mode, objectModel, objectModelNameKeys, objectModelNameStore, resolvedAddress, subcomponentDescriptor, tokenArrayCount, tokenBinder, tokenCount, tokenIndex, workingOnLastToken, _i, _j, _len, _len1, _ref, _ref1;
      try {
        if (!((store_ != null) && store_)) {
          throw new Error("Missing object store input parameter.");
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
          throw new Error("You cannot access a '" + objectModelNameStore + "' store namespace with a '" + objectModelNameKeys + "' object model address!");
        }
        if (!address.isComplete()) {
          throw new Error("Specified address is invalid because the first address token does not specify the object store's root component.");
        }
        mode = (mode_ != null) && mode_ || "bypass";
        if ((mode !== "new") && !address.isResolvable()) {
          throw new Error("'" + mode + "' mode error: Unresolvable address '" + (address.getHumanReadableString()) + "' invalid for this operation.");
        }
        keyArrayCount = (keyArray_ != null) && keyArray_.length || 0;
        tokenArrayCount = address.implementation.tokenVector.length;
        if (keyArrayCount) {
          if (keyArrayCount > (tokenArrayCount - 1)) {
            throw new Error("Too many component keys specified in optional key array parameter for address '" + (address_.getHumanReadableString()) + "'.");
          }
          address = address.clone();
          keyIndex = 0;
          while (keyIndex < keyArrayCount) {
            key = keyArray_[keyIndex];
            tokenIndex = tokenArrayCount - keyArrayCount + keyIndex;
            address.implementation.tokenVector[tokenIndex].key = key;
            keyIndex++;
          }
        }
        tokenCount = 0;
        _ref = address.implementation.tokenVector;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          addressToken = _ref[_i];
          workingOnLastToken = (tokenArrayCount - 1) === tokenCount;
          tokenCount++;
          constructionOptions = workingOnLastToken && propertyAssignmentObject_ || void 0;
          tokenBinder = new AddressTokenResolver(store_, this.implementation.dataReference, addressToken, mode, constructionOptions);
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
          if (tokenBinder.subcomponentDescriptors.length > 0) {
            console.log("AND... WE HAVE UNFINISHED BUSINESS: " + tokenBinder.subcomponentDescriptors.length + " subcomponent descriptors await...");
          }
          _ref1 = tokenBinder.subcomponentDescriptors;
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            subcomponentDescriptor = _ref1[_j];
            console.log(".... onmNamepspace pending subcomponent " + JSON.stringify(subcomponentDescriptor.parentExtensionPoint.propertyAssignmentObject));
          }
          this.implementation.pendingSubcomponentDescriptors = tokenBinder.subcomponentDescriptors;
          true;
        }
      } catch (_error) {
        exception = _error;
        throw new Error("Namespace failure: " + exception.message);
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
        throw new Error("getResolvedAddress failure: " + exception.message);
      }
    };

    Namespace.prototype.getComponentKey = function() {
      var exception;
      try {
        return this.implementation.getResolvedToken().key;
      } catch (_error) {
        exception = _error;
        throw new Error("getComponentKey failure: " + exception.message);
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
        throw new Error("getResolvedLabel failure: " + exception.message);
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
          throw new Error("Cannot serialize Javascript object to JSON!");
        }
        return resultJSON;
      } catch (_error) {
        exception = _error;
        throw new Error("toJSON failure: " + exception.message);
      }
    };

    Namespace.prototype.fromData = function(data_) {
      var address, exception, model, namespaceComponentKey, namespaceData, newComponentKey, property, value, _ref;
      try {
        address = this.getResolvedAddress();
        model = address.getModel();
        if (!((model.namespaceType === "root") || (model.namespaceType === "component"))) {
          throw new Error("Data import only supported on its root and component namespaces. This namespace '" + model.namespaceType + "'-type namespace.");
        }
        if (model.namespaceType === "component") {
          newComponentKey = this.store.model.getSemanticBindings().getUniqueKey(data_);
          namespaceComponentKey = address.implementation.getLastToken().key;
          if (newComponentKey !== namespaceComponentKey) {
            throw new Error("Unexpected input data missing or unexpected component key value.");
          }
        }
        namespaceData = this.implementation.dataReference;
        this.store.implementation.reifier.unreifyStoreComponent(address);
        _ref = this.implementation.dataReference;
        for (property in _ref) {
          value = _ref[property];
          delete namespaceData[property];
        }
        for (property in data_) {
          value = data_[property];
          namespaceData[property] = value;
        }
        this.store.implementation.reifier.reifyStoreComponent(address);
        return address;
      } catch (_error) {
        exception = _error;
        throw new Error("fromData failure: " + exception.message);
      }
    };

    Namespace.prototype.fromJSON = function(json_) {
      var data, dataPayload, exception, model, parsedData, resolvedAddress;
      try {
        data = void 0;
        try {
          parsedData = JSON.parse(json_);
        } catch (_error) {
          exception = _error;
          throw new Error("Unable to deserialize the specified JSON data: " + exception.message);
        }
        resolvedAddress = this.getResolvedAddress();
        model = resolvedAddress.getModel();
        dataPayload = parsedData[model.jsonTag];
        if (!((dataPayload != null) && dataPayload)) {
          throw new Error("JSON data is missing expeced top-level object '" + model.jsonTag + "'.");
        }
        try {
          resolvedAddress = this.fromData(dataPayload);
        } catch (_error) {
          exception = _error;
          throw new Error("After successful JSON parse, namespace data update failed: " + exception.message);
        }
        return resolvedAddress;
      } catch (_error) {
        exception = _error;
        throw new Error("fromJSON failure: " + exception.message);
      }
    };

    Namespace.prototype.update = function() {
      var address, containingComponentNotified, count, descriptor, exception, semanticBindings, updateAction, _results;
      try {
        address = this.getResolvedAddress();
        semanticBindings = this.store.model.getSemanticBindings();
        updateAction = (semanticBindings != null) && semanticBindings && (semanticBindings.update != null) && semanticBindings.update || void 0;
        if ((updateAction != null) && updateAction) {
          updateAction(this.data());
          address.visitParentAddressesDescending((function(_this) {
            return function(address__) {
              var dataReference;
              dataReference = _this.store.openNamespace(address__).data();
              return updateAction(dataReference);
            };
          })(this));
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
        throw new Error("update failure: " + exception.message);
      }
    };

    Namespace.prototype.getExtensionPointSubcomponentCount = function() {
      var componentCount, exception, resolvedToken;
      try {
        resolvedToken = this.implementation.getResolvedToken();
        if (!((resolvedToken != null) && resolvedToken)) {
          throw new Error("Internal error: unable to resolve token.");
        }
        componentCount = 0;
        if (resolvedToken.namespaceDescriptor.namespaceType === "extensionPoint") {
          componentCount = Object.keys(this.data()).length;
        }
        return componentCount;
      } catch (_error) {
        exception = _error;
        throw new Error("getExtensionPointSubcomponentCount failure: " + {
          exception: message
        });
      }
    };

    Namespace.prototype.visitExtensionPointSubcomponents = function(callback_) {
      var address, exception, key, object, resolvedToken, token, _ref;
      try {
        resolvedToken = this.implementation.getResolvedToken();
        if (!((resolvedToken != null) && resolvedToken)) {
          throw new Error("Internal error: unable to resolve token.");
        }
        if (resolvedToken.namespaceDescriptor.namespaceType !== "extensionPoint") {
          throw new Error("You may only visit the subcomponents of an extension point namespace.");
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
            throw new Error("Failure occurred inside your callback function implementation: " + exception.message);
          }
        }
        return true;
      } catch (_error) {
        exception = _error;
        throw new Error("visitExtensionPointSubcomponents failure: " + exception.message);
      }
    };

    return Namespace;

  })();

}).call(this);
