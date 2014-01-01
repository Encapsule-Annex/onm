(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
  var AddressTokenBinder, InitializeComponentNamespaces, InitializeNamespaceProperties, ResolveNamespaceDescriptor, VerifyComponentNamespaces, VerifyNamespaceProperties;

  InitializeNamespaceProperties = function(data_, descriptor_) {
    var exception, functions, memberName, _ref, _ref1;
    try {
      if (!((data_ != null) && data_)) {
        throw "Missing data reference input parameter.";
      }
      if (!((descriptor_ != null) && descriptor_)) {
        throw "Missing descriptor input parameter.";
      }
      if ((descriptor_.userImmutable != null) && descriptor_.userImmutable) {
        _ref = descriptor_.userImmutable;
        for (memberName in _ref) {
          functions = _ref[memberName];
          if ((functions.fnCreate != null) && functions.fnCreate) {
            data_[memberName] = functions.fnCreate();
          } else {
            data_[memberName] = functions.defaultValue;
          }
        }
      }
      if ((descriptor_.userMutable != null) && descriptor_.userMutable) {
        _ref1 = descriptor_.userMutable;
        for (memberName in _ref1) {
          functions = _ref1[memberName];
          if ((functions.fnCreate != null) && functions.fnCreate) {
            data_[memberName] = functions.fnCreate();
          } else {
            data_[memberName] = functions.defaultValue;
          }
        }
      }
      return true;
    } catch (_error) {
      exception = _error;
      throw "InitializeNamespaceProperties failure " + exception + ".";
    }
  };

  VerifyNamespaceProperties = function(data_, descriptor_) {
    var exception, functions, memberName, memberReference, _ref, _ref1;
    try {
      if (!((data_ != null) && data_)) {
        throw "Missing data reference input parameter.";
      }
      if (!((descriptor_ != null) && descriptor_)) {
        throw "Missing descriptor input parameter.";
      }
      if ((descriptor_.userImmutable != null) && descriptor_.userImmutable) {
        _ref = descriptor_.userImmutable;
        for (memberName in _ref) {
          functions = _ref[memberName];
          memberReference = data_[memberName];
          if (memberReference == null) {
            throw "Expected immutable member '" + memberName + "' not found.";
          }
        }
      }
      if ((descriptor_.userMutable != null) && descriptor_.userMutable) {
        _ref1 = descriptor_.userMutable;
        for (memberName in _ref1) {
          functions = _ref1[memberName];
          memberReference = data_[memberName];
          if (memberReference == null) {
            throw "Expected mutable member '" + memberName + "' not found.";
          }
        }
      }
      return true;
    } catch (_error) {
      exception = _error;
      throw "VerifyNamespaceMembers failure " + exception + ".";
    }
  };

  InitializeComponentNamespaces = function(store_, data_, descriptor_, extensionPointId_, key_) {
    var childDescriptor, exception, resolveResults, _i, _len, _ref;
    try {
      if (!((data_ != null) && data_)) {
        throw "Missing data reference input parameter.";
      }
      if (!((descriptor_ != null) && descriptor_)) {
        throw "Missing descriptor input parameter.";
      }
      if (!((extensionPointId_ != null) && extensionPointId_)) {
        throw "Missing extension point ID input parameter.";
      }
      _ref = descriptor_.children;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        childDescriptor = _ref[_i];
        if (childDescriptor.namespaceType !== "component") {
          resolveResults = ResolveNamespaceDescriptor({}, store_, data_, childDescriptor, key_, "new");
          InitializeComponentNamespaces(store_, resolveResults.dataReference, childDescriptor, extensionPointId_, key_);
        }
      }
      return true;
    } catch (_error) {
      exception = _error;
      throw "InitializeComponentNamespaces failure: " + exception + ".";
    }
  };

  VerifyComponentNamespaces = function(store_, data_, descriptor_, extensionPointId_) {
    var exception;
    try {
      if (!((data_ != null) && data_)) {
        throw "Missing data reference input parameter.";
      }
      if (!((descriptor_ != null) && descriptor_)) {
        throw "Missing descriptor input parameter.";
      }
      return true;
    } catch (_error) {
      exception = _error;
      throw "VerifyComponentNamespaces failure: " + exception + ".";
    }
  };

  ResolveNamespaceDescriptor = function(resolveActions_, store_, data_, descriptor_, key_, mode_) {
    var exception, jsonTag, newData, resolveResults;
    try {
      if (!((resolveActions_ != null) && resolveActions_)) {
        throw "Internal error: missing resolve actions structure input parameter.";
      }
      if (!((data_ != null) && data_)) {
        throw "Internal error: missing parent data reference input parameter.";
      }
      if (!((descriptor_ != null) && descriptor_)) {
        throw "Internal error: missing object model descriptor input parameter.";
      }
      if (!((mode_ != null) && mode_)) {
        throw "Internal error: missing mode input parameter.";
      }
      jsonTag = ((descriptor_.namespaceType !== "component") && descriptor_.jsonTag) || key_ || void 0;
      resolveResults = {
        jsonTag: jsonTag,
        dataReference: (jsonTag != null) && jsonTag && data_[jsonTag] || void 0,
        dataParentReference: data_,
        key: key_,
        mode: mode_,
        descriptor: descriptor_,
        store: store_,
        created: false
      };
      switch (mode_) {
        case "bypass":
          if (!((resolveResults.dataReference != null) && resolveResults.dataReference)) {
            throw "Internal error: Unable to resolve " + descriptor_.namespaceType + " namespace descriptor in bypass mode.";
          }
          break;
        case "new":
          if ((resolveResults.dataReference != null) && resolveResults.dataReference) {
            break;
          }
          newData = {};
          InitializeNamespaceProperties(newData, descriptor_.namespaceModelPropertiesDeclaration);
          if (descriptor_.namespaceType === "component") {
            if (!((resolveActions_.setUniqueKey != null) && resolveActions_.setUniqueKey)) {
              throw "You must define semanticBindings.setUniqueKey function in your data model declaration.";
            }
            resolveActions_.setUniqueKey(newData);
            if (!((resolveActions_.getUniqueKey != null) && resolveActions_.getUniqueKey)) {
              throw "You must define semanticBindings.getUniqueKey function in your data model declaration.";
            }
            resolveResults.key = resolveResults.jsonTag = resolveActions_.getUniqueKey(newData);
            if (!((resolveResults.key != null) && resolveResults.key)) {
              throw "Your data model's semanticBindings.getUniqueKey function returned an invalid key. Key cannot be zero or zero-length.";
            }
          }
          resolveResults.dataReference = resolveResults.dataParentReference[resolveResults.jsonTag] = newData;
          resolveResults.created = true;
          break;
        case "strict":
          if (!((resolveResult.dataReference != null) && resolveResult.dataReference)) {
            throw "Internal error: Unable to resolve  " + descriptor_.namespaceType + " namespace descriptor in strict mode.";
          }
          VerifyNamespaceProperties(result.dataReference, descriptor_.namespaceModelPropertiesDeclaration);
          break;
        default:
          throw "Unrecognized mode parameter value.";
      }
      return resolveResults;
    } catch (_error) {
      exception = _error;
      throw "ResolveNamespaceDescriptor failure: " + exception;
    }
  };

  module.exports = AddressTokenBinder = (function() {
    function AddressTokenBinder(store_, parentDataReference_, token_, mode_) {
      var descriptor, exception, extensionPointId, generations, getUniqueKeyFunction, model, parentPathIds, pathId, resolveActions, resolveResults, semanticBindings, setUniqueKeyFunction, targetComponentDescriptor, targetNamespaceDescriptor, _i, _len;
      try {
        this.store = (store_ != null) && store_ || (function() {
          throw "Missing object store input parameter.";
        })();
        model = store_.model;
        this.parentDataReference = (parentDataReference_ != null) && parentDataReference_ || (function() {
          throw "Missing parent data reference input parameter.";
        })();
        if (!((token_ != null) && token_)) {
          throw "Missing object model address token object input parameter.";
        }
        if (!((mode_ != null) && mode_)) {
          throw "Missing mode input parameter.";
        }
        this.dataReference = void 0;
        this.resolvedToken = token_.clone();
        targetNamespaceDescriptor = token_.namespaceDescriptor;
        targetComponentDescriptor = token_.componentDescriptor;
        semanticBindings = model.getSemanticBindings();
        setUniqueKeyFunction = (semanticBindings != null) && semanticBindings && (semanticBindings.setUniqueKey != null) && semanticBindings.setUniqueKey || void 0;
        getUniqueKeyFunction = (semanticBindings != null) && semanticBindings && (semanticBindings.getUniqueKey != null) && semanticBindings.getUniqueKey || void 0;
        resolveActions = {
          setUniqueKey: setUniqueKeyFunction,
          getUniqueKey: getUniqueKeyFunction
        };
        resolveResults = ResolveNamespaceDescriptor(resolveActions, store_, this.parentDataReference, token_.componentDescriptor, token_.key, mode_);
        this.dataReference = resolveResults.dataReference;
        if (resolveResults.created) {
          this.resolvedToken.key = resolveResults.key;
        }
        extensionPointId = (token_.extensionPointDescriptor != null) && token_.extensionPointDescriptor && token_.extensionPointDescriptor.id || -1;
        if (mode_ === "new" && resolveResults.created) {
          InitializeComponentNamespaces(store_, this.dataReference, targetComponentDescriptor, extensionPointId, this.resolvedToken.key);
        }
        if (mode_ === "strict") {
          VerifyComponentNamespaces(store_, resolveResult.dataReference, targetComponentDescriptor, extensionPointId);
        }
        if (targetNamespaceDescriptor.isComponent) {
          return;
        }
        generations = targetNamespaceDescriptor.parentPathIdVector.length - targetComponentDescriptor.parentPathIdVector.length - 1;
        parentPathIds = generations && targetNamespaceDescriptor.parentPathIdVector.slice(-generations) || [];
        for (_i = 0, _len = parentPathIds.length; _i < _len; _i++) {
          pathId = parentPathIds[_i];
          descriptor = model.implementation.getNamespaceDescriptorFromPathId(pathId);
          resolveResults = ResolveNamespaceDescriptor(resolveActions, store_, resolveResults.dataReference, descriptor, resolveResults.key, mode_);
        }
        resolveResults = ResolveNamespaceDescriptor(resolveActions, store_, resolveResults.dataReference, targetNamespaceDescriptor, resolveResults.key, mode_);
        this.dataReference = resolveResults.dataReference;
        return;
      } catch (_error) {
        exception = _error;
        throw "AddressTokenBinder failure: " + exception;
      }
    }

    return AddressTokenBinder;

  })();

}).call(this);

},{}],2:[function(require,module,exports){
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
  var AddressStore, Model, Namespace, Store,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Store = require('./ONMjs-core-store');

  Model = require('./ONMjs-core-model');

  Namespace = require('./ONMjs-core-namespace');

  module.exports = AddressStore = (function(_super) {
    __extends(AddressStore, _super);

    function AddressStore(referenceStore_, address_) {
      this.setAddress = __bind(this.setAddress, this);
      this.getAddress = __bind(this.getAddress, this);
      var exception, selectorAddress, selectorModel,
        _this = this;
      try {
        if (!((referenceStore_ != null) && referenceStore_)) {
          throw "Missing object store input parameter. Unable to determine external selector type.";
        }
        this.referenceStore = referenceStore_;
        selectorModel = new Model({
          jsonTag: "addressStore",
          label: "" + referenceStore_.model.jsonTag + " Address Cache",
          description: "" + referenceStore_.model.label + " observable address cache."
        });
        AddressStore.__super__.constructor.call(this, selectorModel);
        selectorAddress = selectorModel.createRootAddress();
        this.selectorNamespace = new Namespace(this, selectorAddress);
        this.selectorNamespaceData = this.selectorNamespace.data();
        this.selectorNamespaceData.selectedNamespace = void 0;
        this.setAddress(address_);
        this.objectStoreCallbacks = {
          onNamespaceUpdated: function(objectStore_, observerId_, address_) {
            var cachedAddress, exception;
            try {
              cachedAddress = _this.getAddress();
              if ((cachedAddress != null) && cachedAddress && cachedAddress.isEqual(address_)) {
                return _this.setAddress(address_);
              }
            } catch (_error) {
              exception = _error;
              throw "onNamespaceUpdated failure: " + exception;
            }
          },
          onNamespaceRemoved: function(objectStore_, observerId_, address_) {
            var cachedAddress, exception, parentAddress;
            try {
              cachedAddress = _this.getAddress();
              if ((cachedAddress != null) && cachedAddress && cachedAddress.isEqual(address_)) {
                parentAddress = cachedAddress.createParentAddress();
                _this.setAddress(parentAddress);
              }
            } catch (_error) {
              exception = _error;
              throw "onNamespaceRemoved failure: " + exception;
            }
          }
        };
      } catch (_error) {
        exception = _error;
        throw "AddressStore failure: " + exception;
      }
    }

    AddressStore.prototype.getAddress = function() {
      var exception, namespace;
      try {
        namespace = this.selectorNamespaceData.selectedNamespace;
        if (!((namespace != null) && namespace)) {
          return void 0;
        }
        return namespace.getResolvedAddress();
      } catch (_error) {
        exception = _error;
        throw "getSelector failure: " + exception;
      }
    };

    AddressStore.prototype.setAddress = function(address_) {
      var exception;
      try {
        if (!(address_ && address_)) {
          this.selectorNamespaceData.selectedNamespace = void 0;
        } else {
          this.selectorNamespaceData.selectedNamespace = new Namespace(this.referenceStore, address_);
        }
        return this.selectorNamespace.update();
      } catch (_error) {
        exception = _error;
        throw "setAddress failure: " + exception;
      }
    };

    return AddressStore;

  })(Store);

}).call(this);

},{"./ONMjs-core-model":5,"./ONMjs-core-namespace":6,"./ONMjs-core-store":8}],3:[function(require,module,exports){
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
  var AddressToken,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  module.exports = AddressToken = (function() {
    function AddressToken(model_, idExtensionPoint_, key_, idNamespace_) {
      this.isRoot = __bind(this.isRoot, this);
      this.isQualified = __bind(this.isQualified, this);
      this.isEqual = __bind(this.isEqual, this);
      this.clone = __bind(this.clone, this);
      var exception;
      try {
        this.model = (model_ != null) && model_ || (function() {
          throw "Missing object model input parameter.";
        })();
        if (idNamespace_ == null) {
          throw "Missing target namespace ID input parameter.";
        }
        this.idNamespace = idNamespace_;
        this.namespaceDescriptor = model_.implementation.getNamespaceDescriptorFromPathId(idNamespace_);
        this.idComponent = this.namespaceDescriptor.idComponent;
        this.componentDescriptor = model_.implementation.getNamespaceDescriptorFromPathId(this.idComponent);
        this.key = (this.componentDescriptor.id > 0) && (key_ != null) && key_ || void 0;
        this.keyRequired = false;
        this.idExtensionPoint = (idExtensionPoint_ != null) && idExtensionPoint_ || -1;
        this.extensionPointDescriptor = void 0;
        if (this.componentDescriptor.id === 0) {
          return;
        }
        this.keyRequired = true;
        if (this.idExtensionPoint === -1 && !this.componentDescriptor.extensionPointReferenceIds.length) {
          this.idExtensionPoint = this.componentDescriptor.parent.id;
        }
        if (!this.idExtensionPoint) {
          throw "You must specify the ID of the parent extension point when creating a token addressing a '" + this.componentDescriptor.path + "' component namespace.";
        }
        this.extensionPointDescriptor = this.model.implementation.getNamespaceDescriptorFromPathId(this.idExtensionPoint);
        if (!((this.extensionPointDescriptor != null) && this.extensionPointDescriptor)) {
          throw "Internal error: unable to resolve extension point object model descriptor in request.";
        }
        if (this.extensionPointDescriptor.namespaceType !== "extensionPoint") {
          throw "Invalid selector key object specifies an invalid parent extension point ID. Not an extension point.";
        }
        if (this.extensionPointDescriptor.archetypePathId !== this.componentDescriptor.id) {
          throw "Invalid selector key object specifies unsupported extension point / component ID pair.";
        }
        return;
      } catch (_error) {
        exception = _error;
        throw "AddressToken failure: " + exception;
      }
    }

    AddressToken.prototype.clone = function() {
      return new AddressToken(this.model, (this.extensionPointDescriptor != null) && this.extensionPointDescriptor && this.extensionPointDescriptor.id || -1, this.key, this.namespaceDescriptor.id);
    };

    AddressToken.prototype.isEqual = function(token_) {
      var exception, result;
      try {
        if (!((token_ != null) && token_)) {
          throw "Missing token input parameter.";
        }
        result = (this.idNamespace === token_.idNamespace) && (this.key === token_.key) && (this.idExtensionPoint === token_.idExtensionPoint);
        return result;
      } catch (_error) {
        exception = _error;
        throw "isEqual failure: " + exception;
      }
    };

    AddressToken.prototype.isQualified = function() {
      return !this.keyRequired || ((this.key != null) && this.key) || false;
    };

    AddressToken.prototype.isRoot = function() {
      return !this.componentId;
    };

    return AddressToken;

  })();

}).call(this);

},{}],4:[function(require,module,exports){
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
  var Address, AddressDetails, AddressToken,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  AddressToken = require('./ONMjs-core-address-token');

  AddressDetails = (function() {
    function AddressDetails(address_, model_, tokenVector_) {
      var exception, token, _i, _len, _ref,
        _this = this;
      try {
        this.address = ((address_ != null) && address_) || (function() {
          throw "Internal error missing address input parameter.";
        })();
        this.model = ((model_ != null) && model_) || (function() {
          throw "Internal error missing model input paramter.";
        })();
        this.getModelPath = function() {
          var exception, lastToken;
          try {
            if (!_this.tokenVector.length) {
              throw "Invalid address contains no address tokens.";
            }
            lastToken = _this.getLastToken();
            return lastToken.namespaceDescriptor.path;
          } catch (_error) {
            exception = _error;
            throw "getModelPath failure: " + exception;
          }
        };
        this.getModelDescriptorFromSubpath = function(subpath_) {
          var exception, path;
          try {
            path = "" + (_this.getModelPath()) + "." + subpath_;
            return _this.model.implementation.getNamespaceDescriptorFromPath(path);
          } catch (_error) {
            exception = _error;
            throw "getModelDescriptorFromSubpath failure: " + exception;
          }
        };
        this.createSubpathIdAddress = function(pathId_) {
          var addressedComponentDescriptor, addressedComponentToken, exception, newAddress, newToken, newTokenVector, targetNamespaceDescriptor;
          try {
            if (!((pathId_ != null) && pathId_ > -1)) {
              throw "Missing namespace path ID input parameter.";
            }
            addressedComponentToken = _this.getLastToken();
            addressedComponentDescriptor = addressedComponentToken.componentDescriptor;
            targetNamespaceDescriptor = _this.model.implementation.getNamespaceDescriptorFromPathId(pathId_);
            if (targetNamespaceDescriptor.idComponent !== addressedComponentDescriptor.id) {
              throw "Invalid path ID specified does not resolve to a namespace in the same component as the source address.";
            }
            newToken = new AddressToken(_this.model, addressedComponentToken.idExtensionPoint, addressedComponentToken.key, pathId_);
            newTokenVector = _this.tokenVector.length > 0 && _this.tokenVector.slice(0, _this.tokenVector.length - 1) || [];
            newTokenVector.push(newToken);
            newAddress = new Address(_this.model, newTokenVector);
            return newAddress;
          } catch (_error) {
            exception = _error;
            throw "createSubpathIdAddress failure: " + exception;
          }
        };
        this.pushToken = function(token_) {
          var exception, parentToken;
          try {
            if (_this.tokenVector.length) {
              parentToken = _this.tokenVector[_this.tokenVector.length - 1];
              _this.validateTokenPair(parentToken, token_);
            }
            _this.tokenVector.push(token_.clone());
            if (token_.componentDescriptor.id === 0) {
              _this.complete = true;
            }
            if (token_.keyRequired) {
              _this.keysRequired = true;
            }
            if (!token_.isQualified()) {
              _this.keysSpecified = false;
            }
            _this.humanReadableString = void 0;
            _this.hashString = void 0;
            return _this.address;
          } catch (_error) {
            exception = _error;
            throw "pushToken failure: " + exception;
          }
        };
        this.validateTokenPair = function(parentToken_, childToken_) {
          var exception;
          try {
            if (!((parentToken_ != null) && parentToken_ && (childToken_ != null) && childToken_)) {
              throw "Internal error: input parameters are not correct.";
            }
            if (!childToken_.keyRequired) {
              throw "Child token is invalid because it specifies a namespace in the root component.";
            }
            if (parentToken_.namespaceDescriptor.id !== childToken_.extensionPointDescriptor.id) {
              throw "Child token is invalid because the parent token does not select the required extension point namespace.";
            }
            if (!parentToken_.isQualified() && childToken_.isQualified()) {
              throw "Child token is invalid because the parent token is unqualified and the child is qualified.";
            }
            return true;
          } catch (_error) {
            exception = _error;
            throw "validateTokenPair the specified parent and child tokens are incompatible and cannot be used to form an address: " + exception;
          }
        };
        this.getLastToken = function() {
          var exception;
          try {
            if (!_this.tokenVector.length) {
              throw "Illegal call to getLastToken on uninitialized address class instance.";
            }
            return _this.tokenVector[_this.tokenVector.length - 1];
          } catch (_error) {
            exception = _error;
            throw "getLastToken failure: " + exception;
          }
        };
        this.getDescriptor = function() {
          var exception;
          try {
            return _this.getLastToken().namespaceDescriptor;
          } catch (_error) {
            exception = _error;
            throw "getDescriptor failure: " + exception;
          }
        };
        this.tokenVector = [];
        this.parentExtensionPointId = -1;
        this.complete = false;
        this.keysRequired = false;
        this.keysSpecified = true;
        _ref = (tokenVector_ != null) && tokenVector_ || [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          token = _ref[_i];
          this.pushToken(token);
        }
        this.parentAddressesAscending = void 0;
        this.parentAddressesDescending = void 0;
        this.subnamespaceAddressesAscending = void 0;
        this.subnamespaceAddressesDescending = void 0;
        this.subcomponentAddressesAscending = void 0;
        this.subcomponentsAddressesDescending = void 0;
        this.humanReadableString = void 0;
        this.hashString = void 0;
      } catch (_error) {
        exception = _error;
        throw "AddressDetails failure: " + exception;
      }
    }

    return AddressDetails;

  })();

  module.exports = Address = (function() {
    function Address(model_, tokenVector_) {
      this.visitExtensionPointAddresses = __bind(this.visitExtensionPointAddresses, this);
      this.visitChildAddresses = __bind(this.visitChildAddresses, this);
      this.visitSubaddressesDescending = __bind(this.visitSubaddressesDescending, this);
      this.visitSubaddressesAscending = __bind(this.visitSubaddressesAscending, this);
      this.visitParentAddressesDescending = __bind(this.visitParentAddressesDescending, this);
      this.visitParentAddressesAscending = __bind(this.visitParentAddressesAscending, this);
      this.getPropertiesModel = __bind(this.getPropertiesModel, this);
      this.getModel = __bind(this.getModel, this);
      this.createSubcomponentAddress = __bind(this.createSubcomponentAddress, this);
      this.createComponentAddress = __bind(this.createComponentAddress, this);
      this.createSubpathAddress = __bind(this.createSubpathAddress, this);
      this.createParentAddress = __bind(this.createParentAddress, this);
      this.clone = __bind(this.clone, this);
      this.isEqual = __bind(this.isEqual, this);
      this.isRoot = __bind(this.isRoot, this);
      this.getHashString = __bind(this.getHashString, this);
      this.getHumanReadableString = __bind(this.getHumanReadableString, this);
      var exception,
        _this = this;
      try {
        this.model = (model_ != null) && model_ || (function() {
          throw "Missing required object model input parameter.";
        })();
        this.implementation = new AddressDetails(this, model_, tokenVector_);
        this.isComplete = function() {
          return _this.implementation.complete;
        };
        this.isQualified = function() {
          return !_this.implementation.keysRequired || _this.implementation.keysSpecified;
        };
        this.isResolvable = function() {
          return _this.isComplete() && _this.isQualified();
        };
        this.isCreatable = function() {
          return _this.isComplete() && _this.implementation.keysRequired && !_this.implementation.keysSpecified;
        };
      } catch (_error) {
        exception = _error;
        throw "Address error: " + exception;
      }
    }

    Address.prototype.getHumanReadableString = function() {
      var exception, humanReadableString, index, token, _i, _len, _ref;
      try {
        if ((this.implementation.humanReadableString != null) && this.implementation.humanReadableString) {
          return this.implementation.humanReadableString;
        }
        index = 0;
        humanReadableString = "";
        _ref = this.implementation.tokenVector;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          token = _ref[_i];
          if (!index) {
            humanReadableString += token.model.jsonTag;
          }
          if ((token.key != null) && token.key) {
            humanReadableString += "." + token.key;
          } else {
            if (token.idExtensionPoint > 0) {
              humanReadableString += ".-";
            }
          }
          if (token.idNamespace) {
            humanReadableString += "." + token.namespaceDescriptor.jsonTag;
          }
          index++;
        }
        this.implementation.humanReadableString = humanReadableString;
        return humanReadableString;
      } catch (_error) {
        exception = _error;
        throw "getHumanReadableString failure: " + exception;
      }
    };

    Address.prototype.getHashString = function() {
      var exception, hashSource, index, token, _i, _len, _ref;
      try {
        if ((this.implementation.hashString != null) && this.implementation.hashString) {
          return this.implementation.hashString;
        }
        index = 0;
        hashSource = "";
        _ref = this.implementation.tokenVector;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          token = _ref[_i];
          if (!index) {
            hashSource += "" + token.model.jsonTag;
          }
          if ((token.key != null) && token.key) {
            hashSource += "." + token.key;
          } else {
            if (token.idExtensionPoint > 0) {
              hashSource += ".-";
            }
          }
          if (token.idNamespace) {
            hashSource += "." + token.idNamespace;
          }
          index++;
        }
        this.implementation.hashString = encodeURIComponent(hashSource).replace(/[!'()]/g, escape).replace(/\*/g, "%2A");
        return this.implementation.hashString;
      } catch (_error) {
        exception = _error;
        throw "getHashString failure: " + exception;
      }
    };

    Address.prototype.isRoot = function() {
      var exception;
      try {
        return this.implementation.getLastToken().idNamespace === 0;
      } catch (_error) {
        exception = _error;
        throw "CNMjs.Address.isRoot failure: " + exception;
      }
    };

    Address.prototype.isEqual = function(address_) {
      var exception, index, result, tokenA, tokenB;
      try {
        if (!((address_ != null) && address_)) {
          throw "Missing address input parameter.";
        }
        if (this.implementation.tokenVector.length !== address_.implementation.tokenVector.length) {
          return false;
        }
        result = true;
        index = 0;
        while (index < this.implementation.tokenVector.length) {
          tokenA = this.implementation.tokenVector[index];
          tokenB = address_.implementation.tokenVector[index];
          if (!tokenA.isEqual(tokenB)) {
            result = false;
            break;
          }
          index++;
        }
        return result;
      } catch (_error) {
        exception = _error;
        throw "isEqual failure: " + exception;
      }
    };

    Address.prototype.clone = function() {
      var exception;
      try {
        return new Address(this.model, this.implementation.tokenVector);
      } catch (_error) {
        exception = _error;
        throw "clone failure: " + exception;
      }
    };

    Address.prototype.createParentAddress = function(generations_) {
      var descriptor, exception, generations, newAddress, newTokenVector, token, tokenSourceIndex;
      try {
        if (!this.implementation.tokenVector.length) {
          throw "Invalid address contains no address tokens.";
        }
        generations = (generations_ != null) && generations_ || 1;
        tokenSourceIndex = this.implementation.tokenVector.length - 1;
        token = this.implementation.tokenVector[tokenSourceIndex--];
        if (token.namespaceDescriptor.id === 0) {
          return void 0;
        }
        while (generations) {
          descriptor = token.namespaceDescriptor;
          if (descriptor.id === 0) {
            break;
          }
          if (descriptor.namespaceType !== "component") {
            token = new AddressToken(token.model, token.idExtensionPoint, token.key, descriptor.parent.id);
          } else {
            token = (tokenSourceIndex !== -1) && this.implementation.tokenVector[tokenSourceIndex--] || (function() {
              throw "Internal error: exhausted token stack.";
            })();
          }
          generations--;
        }
        newTokenVector = ((tokenSourceIndex < 0) && []) || this.implementation.tokenVector.slice(0, tokenSourceIndex + 1);
        newAddress = new Address(token.model, newTokenVector);
        newAddress.implementation.pushToken(token);
        return newAddress;
      } catch (_error) {
        exception = _error;
        throw "createParentAddress failure: " + exception;
      }
    };

    Address.prototype.createSubpathAddress = function(subpath_) {
      var baseDescriptor, baseDescriptorHeight, baseTokenVector, descriptor, exception, newAddress, pathId, subpathDescriptor, subpathDescriptorHeight, subpathParentIdVector, token, _i, _len;
      try {
        if (!((subpath_ != null) && subpath_)) {
          throw "Missing subpath input parameter.";
        }
        subpathDescriptor = this.implementation.getModelDescriptorFromSubpath(subpath_);
        baseDescriptor = this.implementation.getDescriptor();
        if ((baseDescriptor.namespaceType === "extensionPoint") && (subpathDescriptor.namespaceType !== "component")) {
          throw "Invalid subpath string must begin with the name of the component contained by the base address' extension point.";
        }
        baseDescriptorHeight = baseDescriptor.parentPathIdVector.length;
        subpathDescriptorHeight = subpathDescriptor.parentPathIdVector.length;
        if ((subpathDescriptorHeight - baseDescriptorHeight) < 1) {
          throw "Internal error due to failed consistency check.";
        }
        subpathParentIdVector = subpathDescriptor.parentPathIdVector.slice(baseDescriptorHeight + 1, subpathDescriptorHeight);
        subpathParentIdVector.push(subpathDescriptor.id);
        baseTokenVector = this.implementation.tokenVector.slice(0, this.implementation.tokenVector.length - 1) || [];
        newAddress = new Address(this.model, baseTokenVector);
        token = this.implementation.getLastToken().clone();
        for (_i = 0, _len = subpathParentIdVector.length; _i < _len; _i++) {
          pathId = subpathParentIdVector[_i];
          descriptor = this.model.implementation.getNamespaceDescriptorFromPathId(pathId);
          switch (descriptor.namespaceType) {
            case "component":
              newAddress.implementation.pushToken(token);
              token = new AddressToken(token.model, token.namespaceDescriptor.id, void 0, pathId);
              break;
            default:
              token = new AddressToken(token.model, token.idExtensionPoint, token.key, pathId);
          }
        }
        newAddress.implementation.pushToken(token);
        return newAddress;
      } catch (_error) {
        exception = _error;
        throw "createSubpathAddress failure: " + exception;
      }
    };

    Address.prototype.createComponentAddress = function() {
      var descriptor, exception, newAddress;
      try {
        descriptor = this.implementation.getDescriptor();
        if (descriptor.isComponent) {
          return this.clone();
        }
        newAddress = this.implementation.createSubpathIdAddress(descriptor.idComponent);
        return newAddress;
      } catch (_error) {
        exception = _error;
        throw "createComponentAddress failure: " + exception;
      }
    };

    Address.prototype.createSubcomponentAddress = function() {
      var descriptor, exception, newToken;
      try {
        descriptor = this.implementation.getDescriptor();
        if (descriptor.namespaceType !== "extensionPoint") {
          throw "Unable to determine subcomponent to create because this address does not specifiy an extension point namespace.";
        }
        newToken = new AddressToken(this.model, descriptor.id, void 0, descriptor.archetypePathId);
        return this.clone().implementation.pushToken(newToken);
      } catch (_error) {
        exception = _error;
        throw "createSubcomponentAddress failure: " + exception;
      }
    };

    Address.prototype.getModel = function() {
      var exception;
      try {
        return this.implementation.getDescriptor().namespaceModelDeclaration;
      } catch (_error) {
        exception = _error;
        throw "getModel failure: " + exception;
      }
    };

    Address.prototype.getPropertiesModel = function() {
      var exception;
      try {
        return this.implementation.getDescriptor().namespaceModelPropertiesDeclaration;
      } catch (_error) {
        exception = _error;
        throw "getPropertiesModel failure: " + exception;
      }
    };

    Address.prototype.visitParentAddressesAscending = function(callback_) {
      var address, exception, _i, _len, _ref,
        _this = this;
      try {
        if (!((callback_ != null) && callback_)) {
          return false;
        }
        if (!((this.parentAddressesAscending != null) && this.parentAddressesAscending)) {
          this.parentAddressesAscending = [];
          this.visitParentAddressesDescending(function(address__) {
            _this.parentAddressesAscending.push(address__);
            return true;
          });
          this.parentAddressesAscending.reverse();
        }
        if (!this.parentAddressesAscending.length) {
          return false;
        }
        _ref = this.parentAddressesAscending;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          address = _ref[_i];
          try {
            callback_(address);
          } catch (_error) {
            exception = _error;
            throw "Failure occurred inside your registered callback function implementation: " + exception;
          }
        }
        return true;
      } catch (_error) {
        exception = _error;
        throw "visitParentAddressesAscending failure: " + exception;
      }
    };

    Address.prototype.visitParentAddressesDescending = function(callback_) {
      var address, exception, parent, _i, _len, _ref;
      try {
        if (!((callback_ != null) && callback_)) {
          return false;
        }
        if (!((this.parentAddressesDesending != null) && this.parentAddressesDesceding)) {
          this.parentAddressesDescending = [];
          parent = this.createParentAddress();
          while (parent) {
            this.parentAddressesDescending.push(parent);
            parent = parent.createParentAddress();
          }
        }
        if (!this.parentAddressesDescending.length) {
          return false;
        }
        _ref = this.parentAddressesDescending;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          address = _ref[_i];
          try {
            callback_(address);
          } catch (_error) {
            exception = _error;
            throw "Failure occurred inside your registered callback function implementation: " + exception;
          }
        }
        return true;
      } catch (_error) {
        exception = _error;
        throw "visitParentAddressesDescending failure: " + exception;
      }
    };

    Address.prototype.visitSubaddressesAscending = function(callback_) {
      var address, exception, namespaceDescriptor, subnamespaceAddress, subnamespacePathId, _i, _j, _len, _len1, _ref, _ref1;
      try {
        if (!((callback_ != null) && callback_)) {
          return false;
        }
        if (!((this.subnamespaceAddressesAscending != null) && this.subnamespaceAddressesAscending)) {
          this.subnamespaceAddressesAscending = [];
          namespaceDescriptor = this.implementation.getDescriptor();
          _ref = namespaceDescriptor.componentNamespaceIds;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            subnamespacePathId = _ref[_i];
            subnamespaceAddress = this.implementation.createSubpathIdAddress(subnamespacePathId);
            this.subnamespaceAddressesAscending.push(subnamespaceAddress);
          }
        }
        _ref1 = this.subnamespaceAddressesAscending;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          address = _ref1[_j];
          try {
            callback_(address);
          } catch (_error) {
            exception = _error;
            throw "Failure occurred inside your registered callback function implementation: " + exception;
          }
        }
        return true;
      } catch (_error) {
        exception = _error;
        throw "visitSubaddressesAscending failure: " + exception;
      }
    };

    Address.prototype.visitSubaddressesDescending = function(callback_) {
      var address, exception, _i, _len, _ref,
        _this = this;
      try {
        if (!(callback_ && callback_)) {
          return false;
        }
        if (!((this.subnamespaceAddressesDescending != null) && this.subnamespaceAddressesDescending)) {
          this.subnamespaceAddressesDescending = [];
          this.visitSubaddressesAscending(function(address__) {
            return _this.subnamespaceAddressesDescending.push(address__);
          });
          this.subnamespaceAddressesDescending.reverse();
        }
        _ref = this.subnamespaceAddressesDescending;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          address = _ref[_i];
          try {
            callback_(address);
          } catch (_error) {
            exception = _error;
            throw "Failure occurred inside your registered callback function implementation: " + exception;
          }
        }
        return true;
      } catch (_error) {
        exception = _error;
        throw "visitSubaddressesAscending failure: " + exception;
      }
    };

    Address.prototype.visitChildAddresses = function(callback_) {
      var childAddress, childDescriptor, exception, namespaceDescriptor, _i, _len, _ref;
      try {
        if (!((callback_ != null) && callback_)) {
          return false;
        }
        namespaceDescriptor = this.implementation.getDescriptor();
        _ref = namespaceDescriptor.children;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          childDescriptor = _ref[_i];
          childAddress = this.implementation.createSubpathIdAddress(childDescriptor.id);
          try {
            callback_(childAddress);
          } catch (_error) {
            exception = _error;
            throw "Failure occurred inside your registered callback function implementation: " + exception;
          }
        }
        return true;
      } catch (_error) {
        exception = _error;
        throw "visitChildAddresses failure: " + exception;
      }
    };

    Address.prototype.visitExtensionPointAddresses = function(callback_) {
      var address, exception, extensionPointAddress, extensionPointDescriptor, namespaceDescriptor, path, _i, _len, _ref, _ref1;
      try {
        if (!((callback_ != null) && callback_)) {
          return false;
        }
        if (!((this.extensionPointAddresses != null) && this.extensionPointAddresses)) {
          this.extensionPointAddresses = [];
          namespaceDescriptor = this.implementation.getDescriptor();
          _ref = namespaceDescriptor.extensionPoints;
          for (path in _ref) {
            extensionPointDescriptor = _ref[path];
            extensionPointAddress = this.implementation.createSubpathIdAddress(extensionPointDescriptor.id);
            this.extensionPointAddresses.push(extensionPointAddress);
          }
        }
        _ref1 = this.extensionPointAddresses;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          address = _ref1[_i];
          callback_(address);
        }
        return true;
      } catch (_error) {
        exception = _error;
        throw "visitExtensionPointAddresses failure: " + exception;
      }
    };

    return Address;

  })();

}).call(this);

},{"./ONMjs-core-address-token":3}],5:[function(require,module,exports){
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
  var Address, AddressToken, LUID, Model, ModelDetails, jslib, uuid;

  jslib = require('./encapsule-lib-javascript');

  Address = require('./ONMjs-core-address');

  AddressToken = require('./ONMjs-core-address-token');

  uuid = require('node-uuid');

  LUID = 0;

  ModelDetails = (function() {
    function ModelDetails(model_, objectModelDeclaration_) {
      var buildOMDescriptorFromLayout, exception,
        _this = this;
      try {
        this.model = ((model_ != null) && model_) || (function() {
          throw "Internal error missing model input parameter.";
        })();
        buildOMDescriptorFromLayout = function(ONMD_, path_, parentDescriptor_, componentDescriptor_, parentPathIdVector_, parentPathExtensionPointIdVector_) {
          var archetypeDescriptor, componentDescriptor, description, exception, id, label, namespaceProperties, namespaceType, objectModelDescriptorReference, parentPathExtensionPoints, path, pathReference, processArchetypeDeclaration, subNamespace, tag, thisDescriptor, updatedParentPathExtensionPointIdVector, _i, _len, _ref;
          try {
            if (!((ONMD_ != null) && ONMD_)) {
              throw "Missing object model layout object input parameter! If you specified the namespace declaration via object reference, check the validity of the reference.";
            }
            if (!((ONMD_.jsonTag != null) && ONMD_.jsonTag)) {
              throw "Missing required namespace declaration property 'jsonTag'.";
            }
            tag = (ONMD_.jsonTag != null) && ONMD_.jsonTag || (function() {
              throw "Namespace declaration missing required `jsonTag` property.";
            })();
            path = (path_ != null) && path_ && ("" + path_ + "." + tag) || tag;
            label = (ONMD_.____label != null) && ONMD_.____label || ONMD_.jsonTag;
            description = (ONMD_.____description != null) && ONMD_.____description || "no description provided";
            id = _this.countDescriptors++;
            namespaceType = ((ONMD_.namespaceType != null) && ONMD_.namespaceType) || (!id && (ONMD_.namespaceType = "root")) || (function() {
              throw "Internal error unable to determine namespace type.";
            })();
            parentPathExtensionPoints = void 0;
            if ((parentPathExtensionPointIdVector_ != null) && parentPathExtensionPointIdVector_) {
              parentPathExtensionPoints = jslib.clone(parentPathExtensionPointIdVector_);
            } else {
              parentPathExtensionPoints = [];
            }
            namespaceProperties = (ONMD_.namespaceProperties != null) && ONMD_.namespaceProperties || {};
            thisDescriptor = _this.objectModelDescriptorById[id] = {
              "archetypePathId": -1,
              "children": [],
              "componentNamespaceIds": [],
              "description": description,
              "extensionPointReferenceIds": [],
              "id": id,
              "idComponent": id,
              "isComponent": false,
              "jsonTag": tag,
              "label": label,
              "namespaceType": namespaceType,
              "namespaceModelDeclaration": ONMD_,
              "namespaceModelPropertiesDeclaration": namespaceProperties,
              "parent": parentDescriptor_,
              "parentPathExtensionPoints": parentPathExtensionPoints,
              "parentPathIdVector": [],
              "path": path
            };
            _this.objectModelPathMap[path] = thisDescriptor;
            if ((parentDescriptor_ != null) && parentDescriptor_) {
              parentDescriptor_.children.push(thisDescriptor);
              thisDescriptor.parentPathIdVector = jslib.clone(parentDescriptor_.parentPathIdVector);
              thisDescriptor.parentPathIdVector.push(parentDescriptor_.id);
            }
            if (_this.rankMax < thisDescriptor.parentPathIdVector.length) {
              _this.rankMax = thisDescriptor.parentPathIdVector.length;
            }
            componentDescriptor = void 0;
            switch (namespaceType) {
              case "extensionPoint":
                if (!((componentDescriptor_ != null) && componentDescriptor_)) {
                  throw "Internal error: componentDescriptor_ should be defined.";
                }
                thisDescriptor.idComponent = componentDescriptor_.id;
                componentDescriptor = componentDescriptor_;
                componentDescriptor.extensionPoints[path] = thisDescriptor;
                processArchetypeDeclaration = void 0;
                archetypeDescriptor = void 0;
                if ((ONMD_.componentArchetype != null) && ONMD_.componentArchetype) {
                  processArchetypeDeclaration = true;
                  archetypeDescriptor = ONMD_.componentArchetype;
                } else if ((ONMD_.componentArchetypePath != null) && ONMD_.componentArchetypePath) {
                  processArchetypeDeclaration = false;
                  pathReference = ONMD_.componentArchetypePath;
                  objectModelDescriptorReference = _this.objectModelPathMap[pathReference];
                  if (!((objectModelDescriptorReference != null) && objectModelDescriptorReference)) {
                    throw "Extension point namespace '" + path + "' component archetype '" + pathReference + "' was not found and is invalid.";
                  }
                  if (objectModelDescriptorReference.namespaceType !== "component") {
                    throw "Extension point namespace '" + path + "' declares component archetype '" + pathReference + "' which is not a 'component' namespace type.";
                  }
                  objectModelDescriptorReference.extensionPointReferenceIds.push(thisDescriptor.id);
                  thisDescriptor.archetypePathId = objectModelDescriptorReference.id;
                  _this.countExtensionReferences++;
                } else {
                  throw "Cannot process extension point declaration because its corresponding extension archetype is missing from the object model declaration.";
                }
                updatedParentPathExtensionPointIdVector = jslib.clone(parentPathExtensionPoints);
                updatedParentPathExtensionPointIdVector.push(id);
                _this.countExtensionPoints++;
                if (processArchetypeDeclaration) {
                  buildOMDescriptorFromLayout(archetypeDescriptor, path, thisDescriptor, componentDescriptor, thisDescriptor.parentPathIdVector, updatedParentPathExtensionPointIdVector);
                }
                break;
              case "component":
                thisDescriptor.isComponent = true;
                thisDescriptor.extensionPoints = {};
                parentDescriptor_.archetypePathId = id;
                componentDescriptor = thisDescriptor;
                _this.countExtensions++;
                _this.countComponents++;
                break;
              case "root":
                if ((componentDescriptor_ != null) || componentDescriptor) {
                  throw "Internal error: componentDescriptor_ should be undefined.";
                }
                thisDescriptor.isComponent = true;
                thisDescriptor.extensionPoints = {};
                componentDescriptor = thisDescriptor;
                _this.countComponents++;
                break;
              case "child":
                if (!((componentDescriptor_ != null) && componentDescriptor_)) {
                  throw "Internal error: componentDescriptor_ should be defined.";
                }
                thisDescriptor.idComponent = componentDescriptor_.id;
                componentDescriptor = componentDescriptor_;
                _this.countChildren++;
                break;
              default:
                throw "Unrecognized namespace type '" + namespaceType + "' in object model namespace declaration.";
            }
            _this.objectModelDescriptorById[thisDescriptor.idComponent].componentNamespaceIds.push(thisDescriptor.id);
            if (!((ONMD_.subNamespaces != null) && ONMD_.subNamespaces)) {
              return true;
            }
            _ref = ONMD_.subNamespaces;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              subNamespace = _ref[_i];
              buildOMDescriptorFromLayout(subNamespace, path, thisDescriptor, componentDescriptor, thisDescriptor.parentPathIdVector, parentPathExtensionPoints);
            }
            return true;
          } catch (_error) {
            exception = _error;
            throw "buildOMDescriptorFromLayout fail: " + exception;
          }
        };
        this.getNamespaceDescriptorFromPathId = function(pathId_) {
          var exception, objectModelDescriptor;
          try {
            if (!(pathId_ != null)) {
              throw "Missing path ID parameter!";
            }
            if ((pathId_ < 0) || (pathId_ >= _this.objectModelDescriptorById.length)) {
              throw "Out of range path ID '" + pathId_ + " cannot be resolved.";
            }
            objectModelDescriptor = _this.objectModelDescriptorById[pathId_];
            if (!((objectModelDescriptor != null) && objectModelDescriptor)) {
              throw "Internal error getting namespace descriptor for path ID=" + pathId_ + "!";
            }
            return objectModelDescriptor;
          } catch (_error) {
            exception = _error;
            throw "getNamespaceDescriptorFromPathId failure: " + exception;
          }
        };
        this.getNamespaceDescriptorFromPath = function(path_) {
          var exception;
          try {
            return _this.getNamespaceDescriptorFromPathId(_this.getPathIdFromPath(path_));
          } catch (_error) {
            exception = _error;
            throw "getNamespaceDescriptorFromPath failure: " + exception;
          }
        };
        this.getPathIdFromPath = function(path_) {
          var exception, objectModelDescriptor, objectModelPathId;
          try {
            if (!((path_ != null) && path_)) {
              throw "Missing object model path parameter!";
            }
            objectModelDescriptor = _this.objectModelPathMap[path_];
            if (!((objectModelDescriptor != null) && objectModelDescriptor)) {
              throw "Path '" + path_ + "' is not in the '" + _this.model.jsonTag + "' model's address space.";
            }
            objectModelPathId = objectModelDescriptor.id;
            if (objectModelPathId == null) {
              throw "Internal error: Invalid object model descriptor doesn't support id property for path '" + objectModelPath_ + ".";
            }
            return objectModelPathId;
          } catch (_error) {
            exception = _error;
            throw "getPathIdFromPath fail: " + exception;
          }
        };
        this.getPathFromPathId = function(pathId_) {
          var exception, objectModelDescriptor, path;
          try {
            objectModelDescriptor = _this.getNamespaceDescriptorFromPathId(pathId_);
            if (!((objectModelDescriptor != null) && objectModelDescriptor)) {
              throw "Internal error: Can't find object descriptor for valid path ID '" + pathId_ + ".";
            }
            path = objectModelDescriptor.path;
            if (!((path != null) && path)) {
              throw "Internal error: Invalid object model descriptor doesn't support path property for path '" + objectModelPath_ + ".";
            }
            return path;
          } catch (_error) {
            exception = _error;
            throw "getPathFromPathId fail: " + exception;
          }
        };
        this.createAddressFromPathId = function(pathId_) {
          var descriptor, exception, newAddress, parentPathId, pathIds, targetDescriptor, token, _i, _len;
          try {
            if (pathId_ == null) {
              throw "Missing path input parameter.";
            }
            targetDescriptor = this.getNamespaceDescriptorFromPathId(pathId_);
            newAddress = new Address(this.model);
            token = void 0;
            pathIds = jslib.clone(targetDescriptor.parentPathIdVector);
            pathIds.push(targetDescriptor.id);
            for (_i = 0, _len = pathIds.length; _i < _len; _i++) {
              parentPathId = pathIds[_i];
              descriptor = this.getNamespaceDescriptorFromPathId(parentPathId);
              if (descriptor.namespaceType === "component") {
                newAddress.implementation.pushToken(token);
              }
              token = new AddressToken(this.model, descriptor.idExtensionPoint, void 0, descriptor.id);
            }
            newAddress.implementation.pushToken(token);
            return newAddress;
          } catch (_error) {
            exception = _error;
            throw "getAddressFromPathId failure: " + exception;
          }
        };
        if (!((objectModelDeclaration_ != null) && objectModelDeclaration_)) {
          throw "Missing object model delcaration input parameter!";
        }
        if (!((objectModelDeclaration_.jsonTag != null) && objectModelDeclaration_.jsonTag)) {
          throw "Missing required root namespace property 'jsonTag'.";
        }
        this.model.jsonTag = objectModelDeclaration_.jsonTag;
        this.model.label = (objectModelDeclaration_.____label != null) && objectModelDeclaration_.____label || objectModelDeclaration_.jsonTag;
        this.model.description = (objectModelDeclaration_.____description != null) && objectModelDeclaration_.____description || "<no description provided>";
        this.objectModelDeclaration = jslib.clone(objectModelDeclaration_);
        Object.freeze(this.objectModelDeclaration);
        if (!((this.objectModelDeclaration != null) && this.objectModelDeclaration)) {
          throw "Failed to deep copy (clone) source object model declaration.";
        }
        this.objectModelPathMap = {};
        this.objectModelDescriptorById = [];
        this.countDescriptors = 0;
        this.countComponents = 0;
        this.countExtensionPoints = 0;
        this.countExtensions = 0;
        this.countExtensionReferences = 0;
        this.countChildren = 0;
        this.rankMax = 0;
        buildOMDescriptorFromLayout(objectModelDeclaration_);
        if (this.countExtensionPoints !== this.countExtensions + this.countExtensionReferences) {
          throw "Layout declaration error: extension point and extension descriptor counts do not match. countExtensionPoints=" + this.countExtensionPoints + " countExtensions=" + this.countExtensions;
        }
        if (this.countComponents !== this.countExtensionPoints + 1 - this.countExtensionReferences) {
          throw "Layout declaration error: component count should be " + ("extension count + 1 - extension references. componentCount=" + this.countComponents + " ") + (" countExtensions=" + this.countExtensions + " extensionReferences=" + this.countExtensionReferences);
        }
        Object.freeze(this.objectModelPathMap);
        Object.freeze(this.objectModelDescriptorById);
        this.semanticBindings = (this.objectModelDeclaration.semanticBindings != null) && this.objectModelDeclaration.semanticBindings || {};
        this.componentKeyGenerator = (this.semanticBindings.componentKeyGenerator != null) && this.semanticBindings.componentKeyGenerator || "external";
        this.namespaceVersioning = (this.semanticBindings.namespaceVersioning != null) && this.semanticBindings.namespaceVersioning || "disabled";
        switch (this.componentKeyGenerator) {
          case "disabled":
            if ((this.semanticBindings.getUniqueKey != null) && this.semanticBindings.getUniqueKey) {
              delete this.semanticBindings.getUniqueKey;
            }
            if ((this.semanticBindings.setUniqueKey != null) && this.semanticBindings.setUniqueKey) {
              delete this.semanticBindings.setUniqueKey;
            }
            break;
          case "internalLuid":
            this.semanticBindings.getUniqueKey = function(data_) {
              return data_.key;
            };
            this.semanticBindings.setUniqueKey = function(data_) {
              data_.key = (LUID != null) && LUID || (LUID = 1);
              LUID++;
              return data_.key;
            };
            break;
          case "internalUuid":
            this.semanticBindings.getUniqueKey = function(data_) {
              return data_.key;
            };
            this.semanticBindings.setUniqueKey = function(data_) {
              return data_.key = uuid.v4();
            };
            break;
          case "external":
            break;
          default:
            throw "Unrecognized componentKeyGenerator='" + this.componentKeyGenerator + "'";
        }
        switch (this.namespaceVersioning) {
          case "disabled":
            if ((this.semanticBindings.update != null) && this.semanticBindings.update) {
              delete this.semanticBindings.update;
            }
            break;
          case "internalSimple":
            this.semanticBindings.update = function(data_) {
              if (data_.revision != null) {
                return data_.revision++;
              }
            };
            break;
          case "internalAdvanced":
            this.semanticBindings.update = function(data_) {
              if (data_.revision != null) {
                data_.revision++;
              }
              if (data_.uuidRevision != null) {
                data_.uuidRevision = uuid.v4();
              }
              if (data_.revisionTime != null) {
                return data_.revisionTime = jslib.getEpochTime();
              }
            };
            break;
          default:
            throw "Unrecognized namespaceVersionion=`" + this.namespaceUpdateRevision + "'";
        }
      } catch (_error) {
        exception = _error;
        throw "ModelDetails failure: " + exception;
      }
    }

    return ModelDetails;

  })();

  module.exports = Model = (function() {
    function Model(objectModelDeclaration_) {
      var exception,
        _this = this;
      try {
        this.implementation = new ModelDetails(this, objectModelDeclaration_);
        this.createRootAddress = function() {
          var exception;
          try {
            return new Address(_this, [new AddressToken(_this, void 0, void 0, 0)]);
          } catch (_error) {
            exception = _error;
            throw "createRootAddress failure: " + exception;
          }
        };
        this.createPathAddress = function(path_) {
          var exception, newAddress, pathId;
          try {
            pathId = _this.implementation.getPathIdFromPath(path_);
            newAddress = _this.implementation.createAddressFromPathId(pathId);
            return newAddress;
          } catch (_error) {
            exception = _error;
            throw "createPathAddress failure: " + exception;
          }
        };
        this.getSemanticBindings = function() {
          var exception;
          try {
            return _this.implementation.semanticBindings;
          } catch (_error) {
            exception = _error;
            throw "getSemanticBindings failure: " + exception;
          }
        };
        this.isEqual = function(model_) {
          var exception;
          try {
            return _this.jsonTag === model_.jsonTag;
          } catch (_error) {
            exception = _error;
            throw "isEqual failure: " + exception;
          }
        };
      } catch (_error) {
        exception = _error;
        throw "Model construction fail: " + exception;
      }
    }

    return Model;

  })();

}).call(this);

},{"./ONMjs-core-address":4,"./ONMjs-core-address-token":3,"./encapsule-lib-javascript":10,"node-uuid":22}],6:[function(require,module,exports){
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

},{"./ONMjs-core-address":4,"./ONMjs-core-address-binder":1,"./ONMjs-core-address-token":3}],7:[function(require,module,exports){
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
  var Namespace, StoreReifier, jslib;

  jslib = require('./encapsule-lib-javascript');

  Namespace = require('./ONMjs-core-namespace');

  module.exports = StoreReifier = (function() {
    function StoreReifier(objectStore_) {
      var exception,
        _this = this;
      try {
        this.store = objectStore_;
        this.dispatchCallback = function(address_, callbackName_, observerId_) {
          var callbackFunction, callbackInterface, exception, exceptionMessage, observerId, _ref, _results;
          try {
            if ((observerId_ != null) && observerId_) {
              callbackInterface = _this.store.implementation.observers[observerId_];
              if (!((callbackInterface != null) && callbackInterface)) {
                throw "Internal error: unable to resolve observer ID to obtain callback interface.";
              }
              callbackFunction = callbackInterface[callbackName_];
              if ((callbackFunction != null) && callbackFunction) {
                try {
                  return callbackFunction(_this.store, observerId_, address_);
                } catch (_error) {
                  exception = _error;
                  throw "An error occurred in the '" + callbackName_ + "' method of your observer interface: " + exception;
                }
              }
            } else {
              _ref = _this.store.implementation.observers;
              _results = [];
              for (observerId in _ref) {
                callbackInterface = _ref[observerId];
                callbackFunction = callbackInterface[callbackName_];
                if ((callbackFunction != null) && callbackFunction) {
                  try {
                    _results.push(callbackFunction(_this.store, observerId, address_));
                  } catch (_error) {
                    exception = _error;
                    throw "An error occurred in the '" + callbackName_ + "' method of your observer interface: " + exception;
                  }
                } else {
                  _results.push(void 0);
                }
              }
              return _results;
            }
          } catch (_error) {
            exception = _error;
            exceptionMessage = "dispatchCallback failure while processing " + ("address='" + (address_.getHumanReadableString()) + "', callback='" + callbackName_ + "', observer='" + ((observerId_ != null) && observerId_ || "[broadcast all]") + "': " + exception);
            throw exceptionMessage;
          }
        };
        this.reifyStoreComponent = function(address_, observerId_) {
          var dispatchCallback, exception;
          try {
            if (!((address_ != null) && address_)) {
              throw "Internal error: Missing address input parameter.";
            }
            if (!jslib.dictionaryLength(_this.store.implementation.observers)) {
              return;
            }
            dispatchCallback = _this.dispatchCallback;
            dispatchCallback(address_, "onComponentCreated", observerId_);
            address_.visitSubaddressesAscending(function(addressSubnamespace_) {
              return dispatchCallback(addressSubnamespace_, "onNamespaceCreated", observerId_);
            });
            return true;
          } catch (_error) {
            exception = _error;
            throw "reifyStoreComponent failure: " + exception;
          }
        };
        this.unreifyStoreComponent = function(address_, observerId_) {
          var dispatchCallback, exception;
          try {
            if (!((address_ != null) && address_)) {
              throw "Internal error: Missing address input parameter.";
            }
            if (!jslib.dictionaryLength(_this.store.implementation.observers)) {
              return;
            }
            dispatchCallback = _this.dispatchCallback;
            address_.visitSubaddressesDescending(function(addressSubnamespace_) {
              return dispatchCallback(addressSubnamespace_, "onNamespaceRemoved", observerId_);
            });
            dispatchCallback(address_, "onComponentRemoved", observerId_);
            return true;
          } catch (_error) {
            exception = _error;
            throw "unreifyStoreComponent failure: " + exception;
          }
        };
        this.reifyStoreExtensions = function(address_, observerId_, undoFlag_) {
          var dispatchCallback, exception;
          try {
            if (!((address_ != null) && address_)) {
              throw "Internal error: Missing address input parameter.";
            }
            if (!jslib.dictionaryLength(_this.store.implementation.observers)) {
              return;
            }
            dispatchCallback = _this.dispatchCallback;
            return address_.visitExtensionPointAddresses(function(addressExtensionPoint_) {
              var extensionPointNamespace;
              extensionPointNamespace = new Namespace(_this.store, addressExtensionPoint_);
              extensionPointNamespace.visitExtensionPointSubcomponents(function(addressSubcomponent_) {
                if (!undoFlag_) {
                  _this.reifyStoreComponent(addressSubcomponent_, observerId_);
                  _this.reifyStoreExtensions(addressSubcomponent_, observerId_, false);
                } else {
                  _this.reifyStoreExtensions(addressSubcomponent_, observerId_, true);
                  _this.unreifyStoreComponent(addressSubcomponent_, observerId_);
                }
                return true;
              });
              return true;
            });
          } catch (_error) {
            exception = _error;
            throw "reifyStoreExtensions failure: " + exception;
          }
        };
      } catch (_error) {
        exception = _error;
        throw "StoreReifier constructor failed: " + exception;
      }
    }

    return StoreReifier;

  })();

}).call(this);

},{"./ONMjs-core-namespace":6,"./encapsule-lib-javascript":10}],8:[function(require,module,exports){
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

},{"./ONMjs-core-address-binder":1,"./ONMjs-core-address-token":3,"./ONMjs-core-namespace":6,"./ONMjs-core-store-reifier":7,"./encapsule-lib-javascript":10,"node-uuid":22}],9:[function(require,module,exports){
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
  var BackChannel;

  module.exports = BackChannel = (function() {
    function BackChannel(logHandler_, errorHandler_) {
      var exception,
        _this = this;
      try {
        this.logHandler = logHandler_;
        this.errorHandler = errorHandler_;
        this.log = function(html_) {
          var exception;
          try {
            if ((_this.logHandler != null) && _this.logHandler) {
              try {
                _this.logHandler(html_);
              } catch (_error) {
                exception = _error;
                throw "Error executing log handler function callback: " + exception;
              }
              return true;
            }
            return false;
          } catch (_error) {
            exception = _error;
            throw "BackChannel.log failure: " + exception;
          }
        };
        this.error = function(error_) {
          var exception;
          try {
            if ((_this.errorHandler != null) && _this.errorHandler) {
              try {
                _this.errorHandler(error_);
              } catch (_error) {
                exception = _error;
                throw "Error executing error handler function callback: " + exception;
              }
              return true;
            }
            throw error_;
          } catch (_error) {
            exception = _error;
            throw "BackChannel.error failure: " + exception;
          }
        };
      } catch (_error) {
        exception = _error;
        throw "BackChannel failure: " + exception;
      }
    }

    return BackChannel;

  })();

}).call(this);

},{}],10:[function(require,module,exports){
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
Low-level library routines inspired by (and often copied) from http://coffeescriptcookbook.com
------------------------------------------------------------------------------
*/


(function() {
  var clone;

  clone = function(object_) {
    var exception, flags, key, newInstance;
    try {
      if ((object_ == null) || typeof object_ !== 'object') {
        return object_;
      }
      if (object_ instanceof Date) {
        return new Date(object_.getTime());
      }
      if (object_ instanceof RegExp) {
        flags = '';
        if (object_.global != null) {
          flags += 'g';
        }
        if (object_.ignoreCase != null) {
          flags += 'i';
        }
        if (object_.multiline != null) {
          flags += 'm';
        }
        if (object_.sticky != null) {
          flags += 'y';
        }
        return new RegExp(object_.source, flags);
      }
      newInstance = new object_.constructor();
      for (key in object_) {
        newInstance[key] = clone(object_[key]);
      }
      return newInstance;
    } catch (_error) {
      exception = _error;
      throw "clone: " + exception;
    }
  };

  module.exports.clone = clone;

  module.exports.dictionaryLength = function(dictionary_) {
    var exception;
    try {
      return Object.keys(dictionary_).length;
    } catch (_error) {
      exception = _error;
      throw "dictionaryLength: " + exception;
    }
  };

  module.exports.uuidNull = "00000000-0000-0000-0000-000000000000";

  module.exports.getEpochTime = function() {
    return Math.round(new Date().getTime() / 1000.0);
  };

}).call(this);

},{}],11:[function(require,module,exports){
module.exports.Model = require('./dist/node/ONMjs-core-model');
module.exports.Store = require('./dist/node/ONMjs-core-store');
module.exports.AddressStore = require('./dist/node/ONMjs-core-address-store');
module.exports.BackChannel = require('./dist/node/encapsule-lib-backchannel');


},{"./dist/node/ONMjs-core-address-store":2,"./dist/node/ONMjs-core-model":5,"./dist/node/ONMjs-core-store":8,"./dist/node/encapsule-lib-backchannel":9}],12:[function(require,module,exports){
var Buffer = require('buffer').Buffer;
var intSize = 4;
var zeroBuffer = new Buffer(intSize); zeroBuffer.fill(0);
var chrsz = 8;

function toArray(buf, bigEndian) {
  if ((buf.length % intSize) !== 0) {
    var len = buf.length + (intSize - (buf.length % intSize));
    buf = Buffer.concat([buf, zeroBuffer], len);
  }

  var arr = [];
  var fn = bigEndian ? buf.readInt32BE : buf.readInt32LE;
  for (var i = 0; i < buf.length; i += intSize) {
    arr.push(fn.call(buf, i));
  }
  return arr;
}

function toBuffer(arr, size, bigEndian) {
  var buf = new Buffer(size);
  var fn = bigEndian ? buf.writeInt32BE : buf.writeInt32LE;
  for (var i = 0; i < arr.length; i++) {
    fn.call(buf, arr[i], i * 4, true);
  }
  return buf;
}

function hash(buf, fn, hashSize, bigEndian) {
  if (!Buffer.isBuffer(buf)) buf = new Buffer(buf);
  var arr = fn(toArray(buf, bigEndian), buf.length * chrsz);
  return toBuffer(arr, hashSize, bigEndian);
}

module.exports = { hash: hash };

},{"buffer":19}],13:[function(require,module,exports){
var Buffer = require('buffer').Buffer
var sha = require('./sha')
var sha256 = require('./sha256')
var rng = require('./rng')
var md5 = require('./md5')

var algorithms = {
  sha1: sha,
  sha256: sha256,
  md5: md5
}

var blocksize = 64
var zeroBuffer = new Buffer(blocksize); zeroBuffer.fill(0)
function hmac(fn, key, data) {
  if(!Buffer.isBuffer(key)) key = new Buffer(key)
  if(!Buffer.isBuffer(data)) data = new Buffer(data)

  if(key.length > blocksize) {
    key = fn(key)
  } else if(key.length < blocksize) {
    key = Buffer.concat([key, zeroBuffer], blocksize)
  }

  var ipad = new Buffer(blocksize), opad = new Buffer(blocksize)
  for(var i = 0; i < blocksize; i++) {
    ipad[i] = key[i] ^ 0x36
    opad[i] = key[i] ^ 0x5C
  }

  var hash = fn(Buffer.concat([ipad, data]))
  return fn(Buffer.concat([opad, hash]))
}

function hash(alg, key) {
  alg = alg || 'sha1'
  var fn = algorithms[alg]
  var bufs = []
  var length = 0
  if(!fn) error('algorithm:', alg, 'is not yet supported')
  return {
    update: function (data) {
      if(!Buffer.isBuffer(data)) data = new Buffer(data)
        
      bufs.push(data)
      length += data.length
      return this
    },
    digest: function (enc) {
      var buf = Buffer.concat(bufs)
      var r = key ? hmac(fn, key, buf) : fn(buf)
      bufs = null
      return enc ? r.toString(enc) : r
    }
  }
}

function error () {
  var m = [].slice.call(arguments).join(' ')
  throw new Error([
    m,
    'we accept pull requests',
    'http://github.com/dominictarr/crypto-browserify'
    ].join('\n'))
}

exports.createHash = function (alg) { return hash(alg) }
exports.createHmac = function (alg, key) { return hash(alg, key) }
exports.randomBytes = function(size, callback) {
  if (callback && callback.call) {
    try {
      callback.call(this, undefined, new Buffer(rng(size)))
    } catch (err) { callback(err) }
  } else {
    return new Buffer(rng(size))
  }
}

function each(a, f) {
  for(var i in a)
    f(a[i], i)
}

// the least I can do is make error messages for the rest of the node.js/crypto api.
each(['createCredentials'
, 'createCipher'
, 'createCipheriv'
, 'createDecipher'
, 'createDecipheriv'
, 'createSign'
, 'createVerify'
, 'createDiffieHellman'
, 'pbkdf2'], function (name) {
  exports[name] = function () {
    error('sorry,', name, 'is not implemented yet')
  }
})

},{"./md5":14,"./rng":15,"./sha":16,"./sha256":17,"buffer":19}],14:[function(require,module,exports){
/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.1 Copyright (C) Paul Johnston 1999 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */

var helpers = require('./helpers');

/*
 * Perform a simple self-test to see if the VM is working
 */
function md5_vm_test()
{
  return hex_md5("abc") == "900150983cd24fb0d6963f7d28e17f72";
}

/*
 * Calculate the MD5 of an array of little-endian words, and a bit length
 */
function core_md5(x, len)
{
  /* append padding */
  x[len >> 5] |= 0x80 << ((len) % 32);
  x[(((len + 64) >>> 9) << 4) + 14] = len;

  var a =  1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d =  271733878;

  for(var i = 0; i < x.length; i += 16)
  {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;

    a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
    d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
    c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
    b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
    a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
    d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
    c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
    b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
    a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
    d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
    c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
    b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
    a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
    d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
    c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
    b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);

    a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
    d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
    c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
    b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
    a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
    d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
    c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
    b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
    a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
    d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
    c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
    b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
    a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
    d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
    c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
    b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);

    a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
    d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
    c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
    b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
    a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
    d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
    c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
    b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
    a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
    d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
    c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
    b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
    a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
    d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
    c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
    b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);

    a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
    d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
    c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
    b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
    a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
    d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
    c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
    b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
    a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
    d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
    c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
    b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
    a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
    d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
    c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
    b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);

    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
  }
  return Array(a, b, c, d);

}

/*
 * These functions implement the four basic operations the algorithm uses.
 */
function md5_cmn(q, a, b, x, s, t)
{
  return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
}
function md5_ff(a, b, c, d, x, s, t)
{
  return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
}
function md5_gg(a, b, c, d, x, s, t)
{
  return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
}
function md5_hh(a, b, c, d, x, s, t)
{
  return md5_cmn(b ^ c ^ d, a, b, x, s, t);
}
function md5_ii(a, b, c, d, x, s, t)
{
  return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function bit_rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}

module.exports = function md5(buf) {
  return helpers.hash(buf, core_md5, 16);
};

},{"./helpers":12}],15:[function(require,module,exports){
// Original code adapted from Robert Kieffer.
// details at https://github.com/broofa/node-uuid
(function() {
  var _global = this;

  var mathRNG, whatwgRNG;

  // NOTE: Math.random() does not guarantee "cryptographic quality"
  mathRNG = function(size) {
    var bytes = new Array(size);
    var r;

    for (var i = 0, r; i < size; i++) {
      if ((i & 0x03) == 0) r = Math.random() * 0x100000000;
      bytes[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return bytes;
  }

  if (_global.crypto && crypto.getRandomValues) {
    whatwgRNG = function(size) {
      var bytes = new Uint8Array(size);
      crypto.getRandomValues(bytes);
      return bytes;
    }
  }

  module.exports = whatwgRNG || mathRNG;

}())

},{}],16:[function(require,module,exports){
/*
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
 * in FIPS PUB 180-1
 * Version 2.1a Copyright Paul Johnston 2000 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for details.
 */

var helpers = require('./helpers');

/*
 * Calculate the SHA-1 of an array of big-endian words, and a bit length
 */
function core_sha1(x, len)
{
  /* append padding */
  x[len >> 5] |= 0x80 << (24 - len % 32);
  x[((len + 64 >> 9) << 4) + 15] = len;

  var w = Array(80);
  var a =  1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d =  271733878;
  var e = -1009589776;

  for(var i = 0; i < x.length; i += 16)
  {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;
    var olde = e;

    for(var j = 0; j < 80; j++)
    {
      if(j < 16) w[j] = x[i + j];
      else w[j] = rol(w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16], 1);
      var t = safe_add(safe_add(rol(a, 5), sha1_ft(j, b, c, d)),
                       safe_add(safe_add(e, w[j]), sha1_kt(j)));
      e = d;
      d = c;
      c = rol(b, 30);
      b = a;
      a = t;
    }

    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
    e = safe_add(e, olde);
  }
  return Array(a, b, c, d, e);

}

/*
 * Perform the appropriate triplet combination function for the current
 * iteration
 */
function sha1_ft(t, b, c, d)
{
  if(t < 20) return (b & c) | ((~b) & d);
  if(t < 40) return b ^ c ^ d;
  if(t < 60) return (b & c) | (b & d) | (c & d);
  return b ^ c ^ d;
}

/*
 * Determine the appropriate additive constant for the current iteration
 */
function sha1_kt(t)
{
  return (t < 20) ?  1518500249 : (t < 40) ?  1859775393 :
         (t < 60) ? -1894007588 : -899497514;
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}

module.exports = function sha1(buf) {
  return helpers.hash(buf, core_sha1, 20, true);
};

},{"./helpers":12}],17:[function(require,module,exports){

/**
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-256, as defined
 * in FIPS 180-2
 * Version 2.2-beta Copyright Angel Marin, Paul Johnston 2000 - 2009.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 *
 */

var helpers = require('./helpers');

var safe_add = function(x, y) {
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
};

var S = function(X, n) {
  return (X >>> n) | (X << (32 - n));
};

var R = function(X, n) {
  return (X >>> n);
};

var Ch = function(x, y, z) {
  return ((x & y) ^ ((~x) & z));
};

var Maj = function(x, y, z) {
  return ((x & y) ^ (x & z) ^ (y & z));
};

var Sigma0256 = function(x) {
  return (S(x, 2) ^ S(x, 13) ^ S(x, 22));
};

var Sigma1256 = function(x) {
  return (S(x, 6) ^ S(x, 11) ^ S(x, 25));
};

var Gamma0256 = function(x) {
  return (S(x, 7) ^ S(x, 18) ^ R(x, 3));
};

var Gamma1256 = function(x) {
  return (S(x, 17) ^ S(x, 19) ^ R(x, 10));
};

var core_sha256 = function(m, l) {
  var K = new Array(0x428A2F98,0x71374491,0xB5C0FBCF,0xE9B5DBA5,0x3956C25B,0x59F111F1,0x923F82A4,0xAB1C5ED5,0xD807AA98,0x12835B01,0x243185BE,0x550C7DC3,0x72BE5D74,0x80DEB1FE,0x9BDC06A7,0xC19BF174,0xE49B69C1,0xEFBE4786,0xFC19DC6,0x240CA1CC,0x2DE92C6F,0x4A7484AA,0x5CB0A9DC,0x76F988DA,0x983E5152,0xA831C66D,0xB00327C8,0xBF597FC7,0xC6E00BF3,0xD5A79147,0x6CA6351,0x14292967,0x27B70A85,0x2E1B2138,0x4D2C6DFC,0x53380D13,0x650A7354,0x766A0ABB,0x81C2C92E,0x92722C85,0xA2BFE8A1,0xA81A664B,0xC24B8B70,0xC76C51A3,0xD192E819,0xD6990624,0xF40E3585,0x106AA070,0x19A4C116,0x1E376C08,0x2748774C,0x34B0BCB5,0x391C0CB3,0x4ED8AA4A,0x5B9CCA4F,0x682E6FF3,0x748F82EE,0x78A5636F,0x84C87814,0x8CC70208,0x90BEFFFA,0xA4506CEB,0xBEF9A3F7,0xC67178F2);
  var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);
    var W = new Array(64);
    var a, b, c, d, e, f, g, h, i, j;
    var T1, T2;
  /* append padding */
  m[l >> 5] |= 0x80 << (24 - l % 32);
  m[((l + 64 >> 9) << 4) + 15] = l;
  for (var i = 0; i < m.length; i += 16) {
    a = HASH[0]; b = HASH[1]; c = HASH[2]; d = HASH[3]; e = HASH[4]; f = HASH[5]; g = HASH[6]; h = HASH[7];
    for (var j = 0; j < 64; j++) {
      if (j < 16) {
        W[j] = m[j + i];
      } else {
        W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);
      }
      T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
      T2 = safe_add(Sigma0256(a), Maj(a, b, c));
      h = g; g = f; f = e; e = safe_add(d, T1); d = c; c = b; b = a; a = safe_add(T1, T2);
    }
    HASH[0] = safe_add(a, HASH[0]); HASH[1] = safe_add(b, HASH[1]); HASH[2] = safe_add(c, HASH[2]); HASH[3] = safe_add(d, HASH[3]);
    HASH[4] = safe_add(e, HASH[4]); HASH[5] = safe_add(f, HASH[5]); HASH[6] = safe_add(g, HASH[6]); HASH[7] = safe_add(h, HASH[7]);
  }
  return HASH;
};

module.exports = function sha256(buf) {
  return helpers.hash(buf, core_sha256, 32, true);
};

},{"./helpers":12}],18:[function(require,module,exports){
require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"PcZj9L":[function(require,module,exports){
var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = Buffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192

/**
 * If `browserSupport`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (compatible down to IE6)
 */
var browserSupport = (function () {
   // Detect if browser supports Typed Arrays. Supported browsers are IE 10+,
   // Firefox 4+, Chrome 7+, Safari 5.1+, Opera 11.6+, iOS 4.2+.
   if (typeof Uint8Array === 'undefined' || typeof ArrayBuffer === 'undefined' ||
        typeof DataView === 'undefined')
      return false

  // Does the browser support adding properties to `Uint8Array` instances? If
  // not, then that's the same as no `Uint8Array` support. We need to be able to
  // add all the node Buffer API methods.
  // Relevant Firefox bug: https://bugzilla.mozilla.org/show_bug.cgi?id=695438
  try {
    var arr = new Uint8Array(0)
    arr.foo = function () { return 42 }
    return 42 === arr.foo()
  } catch (e) {
    return false
  }
})()


/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer (subject, encoding, noZero) {
  if (!(this instanceof Buffer))
    return new Buffer(subject, encoding, noZero)

  var type = typeof subject

  // Workaround: node's base64 implementation allows for non-padded strings
  // while base64-js does not.
  if (encoding === 'base64' && type === 'string') {
    subject = stringtrim(subject)
    while (subject.length % 4 !== 0) {
      subject = subject + '='
    }
  }

  // Find the length
  var length
  if (type === 'number')
    length = coerce(subject)
  else if (type === 'string')
    length = Buffer.byteLength(subject, encoding)
  else if (type === 'object')
    length = coerce(subject.length) // Assume object is an array
  else
    throw new Error('First argument needs to be a number, array or string.')

  var buf
  if (browserSupport) {
    // Preferred: Return an augmented `Uint8Array` instance for best performance
    buf = augment(new Uint8Array(length))
  } else {
    // Fallback: Return this instance of Buffer
    buf = this
    buf.length = length
  }

  var i
  if (Buffer.isBuffer(subject)) {
    // Speed optimization -- use set if we're copying from a Uint8Array
    buf.set(subject)
  } else if (isArrayish(subject)) {
    // Treat array-ish objects as a byte array
    for (i = 0; i < length; i++) {
      if (Buffer.isBuffer(subject))
        buf[i] = subject.readUInt8(i)
      else
        buf[i] = subject[i]
    }
  } else if (type === 'string') {
    buf.write(subject, 0, encoding)
  } else if (type === 'number' && !browserSupport && !noZero) {
    for (i = 0; i < length; i++) {
      buf[i] = 0
    }
  }

  return buf
}

// STATIC METHODS
// ==============

Buffer.isEncoding = function (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
      return true

    default:
      return false
  }
}

Buffer.isBuffer = function (b) {
  return b && b._isBuffer
}

Buffer.byteLength = function (str, encoding) {
  switch (encoding || 'utf8') {
    case 'hex':
      return str.length / 2

    case 'utf8':
    case 'utf-8':
      return utf8ToBytes(str).length

    case 'ascii':
    case 'binary':
      return str.length

    case 'base64':
      return base64ToBytes(str).length

    default:
      throw new Error('Unknown encoding')
  }
}

Buffer.concat = function (list, totalLength) {
  if (!isArray(list)) {
    throw new Error('Usage: Buffer.concat(list, [totalLength])\n' +
        'list should be an Array.')
  }

  if (list.length === 0) {
    return new Buffer(0)
  } else if (list.length === 1) {
    return list[0]
  }

  var i
  if (typeof totalLength !== 'number') {
    totalLength = 0
    for (i = 0; i < list.length; i++) {
      totalLength += list[i].length
    }
  }

  var buf = new Buffer(totalLength)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

// BUFFER INSTANCE METHODS
// =======================

function _hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) {
    throw new Error('Invalid hex string')
  }
  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var byte = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(byte)) throw new Error('Invalid hex string')
    buf[offset + i] = byte
  }
  Buffer._charsWritten = i * 2
  return i
}

function _utf8Write (buf, string, offset, length) {
  var bytes, pos
  return Buffer._charsWritten = blitBuffer(utf8ToBytes(string), buf, offset, length)
}

function _asciiWrite (buf, string, offset, length) {
  var bytes, pos
  return Buffer._charsWritten = blitBuffer(asciiToBytes(string), buf, offset, length)
}

function _binaryWrite (buf, string, offset, length) {
  return _asciiWrite(buf, string, offset, length)
}

function _base64Write (buf, string, offset, length) {
  var bytes, pos
  return Buffer._charsWritten = blitBuffer(base64ToBytes(string), buf, offset, length)
}

Buffer.prototype.write = function (string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length
      length = undefined
    }
  } else {  // legacy
    var swap = encoding
    encoding = offset
    offset = length
    length = swap
  }

  offset = Number(offset) || 0
  var remaining = this.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase()

  switch (encoding) {
    case 'hex':
      return _hexWrite(this, string, offset, length)

    case 'utf8':
    case 'utf-8':
      return _utf8Write(this, string, offset, length)

    case 'ascii':
      return _asciiWrite(this, string, offset, length)

    case 'binary':
      return _binaryWrite(this, string, offset, length)

    case 'base64':
      return _base64Write(this, string, offset, length)

    default:
      throw new Error('Unknown encoding')
  }
}

Buffer.prototype.toString = function (encoding, start, end) {
  var self = this

  encoding = String(encoding || 'utf8').toLowerCase()
  start = Number(start) || 0
  end = (end !== undefined)
    ? Number(end)
    : end = self.length

  // Fastpath empty strings
  if (end === start)
    return ''

  switch (encoding) {
    case 'hex':
      return _hexSlice(self, start, end)

    case 'utf8':
    case 'utf-8':
      return _utf8Slice(self, start, end)

    case 'ascii':
      return _asciiSlice(self, start, end)

    case 'binary':
      return _binarySlice(self, start, end)

    case 'base64':
      return _base64Slice(self, start, end)

    default:
      throw new Error('Unknown encoding')
  }
}

Buffer.prototype.toJSON = function () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function (target, target_start, start, end) {
  var source = this

  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (!target_start) target_start = 0

  // Copy 0 bytes; we're done
  if (end === start) return
  if (target.length === 0 || source.length === 0) return

  // Fatal error conditions
  if (end < start)
    throw new Error('sourceEnd < sourceStart')
  if (target_start < 0 || target_start >= target.length)
    throw new Error('targetStart out of bounds')
  if (start < 0 || start >= source.length)
    throw new Error('sourceStart out of bounds')
  if (end < 0 || end > source.length)
    throw new Error('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length)
    end = this.length
  if (target.length - target_start < end - start)
    end = target.length - target_start + start

  // copy!
  for (var i = 0; i < end - start; i++)
    target[i + target_start] = this[i + start]
}

function _base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function _utf8Slice (buf, start, end) {
  var res = ''
  var tmp = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    if (buf[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i])
      tmp = ''
    } else {
      tmp += '%' + buf[i].toString(16)
    }
  }

  return res + decodeUtf8Char(tmp)
}

function _asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++)
    ret += String.fromCharCode(buf[i])
  return ret
}

function _binarySlice (buf, start, end) {
  return _asciiSlice(buf, start, end)
}

function _hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

// TODO: add test that modifying the new buffer slice will modify memory in the
// original buffer! Use code from:
// http://nodejs.org/api/buffer.html#buffer_buf_slice_start_end
Buffer.prototype.slice = function (start, end) {
  var len = this.length
  start = clamp(start, len, 0)
  end = clamp(end, len, len)

  if (browserSupport) {
    return augment(this.subarray(start, end))
  } else {
    // TODO: slicing works, with limitations (no parent tracking/update)
    // https://github.com/feross/native-buffer-browserify/issues/9
    var sliceLen = end - start
    var newBuf = new Buffer(sliceLen, undefined, true)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
    return newBuf
  }
}

Buffer.prototype.readUInt8 = function (offset, noAssert) {
  var buf = this
  if (!noAssert) {
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < buf.length, 'Trying to read beyond buffer length')
  }

  if (offset >= buf.length)
    return

  return buf[offset]
}

function _readUInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  if (browserSupport) {
    if (offset + 1 < len) {
      return buf._dataview.getUint16(offset, littleEndian)
    } else {
      var dv = new DataView(new ArrayBuffer(2))
      dv.setUint8(0, buf[len - 1])
      return dv.getUint16(0, littleEndian)
    }
  } else {
    var val
    if (littleEndian) {
      val = buf[offset]
      if (offset + 1 < len)
        val |= buf[offset + 1] << 8
    } else {
      val = buf[offset] << 8
      if (offset + 1 < len)
        val |= buf[offset + 1]
    }
    return val
  }
}

Buffer.prototype.readUInt16LE = function (offset, noAssert) {
  return _readUInt16(this, offset, true, noAssert)
}

Buffer.prototype.readUInt16BE = function (offset, noAssert) {
  return _readUInt16(this, offset, false, noAssert)
}

function _readUInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  if (browserSupport) {
    if (offset + 3 < len) {
      return buf._dataview.getUint32(offset, littleEndian)
    } else {
      var dv = new DataView(new ArrayBuffer(4))
      for (var i = 0; i + offset < len; i++) {
        dv.setUint8(i, buf[i + offset])
      }
      return dv.getUint32(0, littleEndian)
    }
  } else {
    var val
    if (littleEndian) {
      if (offset + 2 < len)
        val = buf[offset + 2] << 16
      if (offset + 1 < len)
        val |= buf[offset + 1] << 8
      val |= buf[offset]
      if (offset + 3 < len)
        val = val + (buf[offset + 3] << 24 >>> 0)
    } else {
      if (offset + 1 < len)
        val = buf[offset + 1] << 16
      if (offset + 2 < len)
        val |= buf[offset + 2] << 8
      if (offset + 3 < len)
        val |= buf[offset + 3]
      val = val + (buf[offset] << 24 >>> 0)
    }
    return val
  }
}

Buffer.prototype.readUInt32LE = function (offset, noAssert) {
  return _readUInt32(this, offset, true, noAssert)
}

Buffer.prototype.readUInt32BE = function (offset, noAssert) {
  return _readUInt32(this, offset, false, noAssert)
}

Buffer.prototype.readInt8 = function (offset, noAssert) {
  var buf = this
  if (!noAssert) {
    assert(offset !== undefined && offset !== null,
        'missing offset')
    assert(offset < buf.length, 'Trying to read beyond buffer length')
  }

  if (offset >= buf.length)
    return

  if (browserSupport) {
    return buf._dataview.getInt8(offset)
  } else {
    var neg = buf[offset] & 0x80
    if (neg)
      return (0xff - buf[offset] + 1) * -1
    else
      return buf[offset]
  }
}

function _readInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  if (browserSupport) {
    if (offset + 1 === len) {
      var dv = new DataView(new ArrayBuffer(2))
      dv.setUint8(0, buf[len - 1])
      return dv.getInt16(0, littleEndian)
    } else {
      return buf._dataview.getInt16(offset, littleEndian)
    }
  } else {
    var val = _readUInt16(buf, offset, littleEndian, true)
    var neg = val & 0x8000
    if (neg)
      return (0xffff - val + 1) * -1
    else
      return val
  }
}

Buffer.prototype.readInt16LE = function (offset, noAssert) {
  return _readInt16(this, offset, true, noAssert)
}

Buffer.prototype.readInt16BE = function (offset, noAssert) {
  return _readInt16(this, offset, false, noAssert)
}

function _readInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  if (browserSupport) {
    if (offset + 3 >= len) {
      var dv = new DataView(new ArrayBuffer(4))
      for (var i = 0; i + offset < len; i++) {
        dv.setUint8(i, buf[i + offset])
      }
      return dv.getInt32(0, littleEndian)
    } else {
      return buf._dataview.getInt32(offset, littleEndian)
    }
  } else {
    var val = _readUInt32(buf, offset, littleEndian, true)
    var neg = val & 0x80000000
    if (neg)
      return (0xffffffff - val + 1) * -1
    else
      return val
  }
}

Buffer.prototype.readInt32LE = function (offset, noAssert) {
  return _readInt32(this, offset, true, noAssert)
}

Buffer.prototype.readInt32BE = function (offset, noAssert) {
  return _readInt32(this, offset, false, noAssert)
}

function _readFloat (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  if (browserSupport) {
    return buf._dataview.getFloat32(offset, littleEndian)
  } else {
    return ieee754.read(buf, offset, littleEndian, 23, 4)
  }
}

Buffer.prototype.readFloatLE = function (offset, noAssert) {
  return _readFloat(this, offset, true, noAssert)
}

Buffer.prototype.readFloatBE = function (offset, noAssert) {
  return _readFloat(this, offset, false, noAssert)
}

function _readDouble (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 7 < buf.length, 'Trying to read beyond buffer length')
  }

  if (browserSupport) {
    return buf._dataview.getFloat64(offset, littleEndian)
  } else {
    return ieee754.read(buf, offset, littleEndian, 52, 8)
  }
}

Buffer.prototype.readDoubleLE = function (offset, noAssert) {
  return _readDouble(this, offset, true, noAssert)
}

Buffer.prototype.readDoubleBE = function (offset, noAssert) {
  return _readDouble(this, offset, false, noAssert)
}

Buffer.prototype.writeUInt8 = function (value, offset, noAssert) {
  var buf = this
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xff)
  }

  if (offset >= buf.length) return

  buf[offset] = value
}

function _writeUInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (browserSupport) {
    if (offset + 1 === len) {
      var dv = new DataView(new ArrayBuffer(2))
      dv.setUint16(0, value, littleEndian)
      buf[offset] = dv.getUint8(0)
    } else {
      buf._dataview.setUint16(offset, value, littleEndian)
    }
  } else {
    for (var i = 0, j = Math.min(len - offset, 2); i < j; i++) {
      buf[offset + i] =
          (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
              (littleEndian ? i : 1 - i) * 8
    }
  }
}

Buffer.prototype.writeUInt16LE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt16BE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, false, noAssert)
}

function _writeUInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffffffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  var i
  if (browserSupport) {
    if (offset + 3 >= len) {
      var dv = new DataView(new ArrayBuffer(4))
      dv.setUint32(0, value, littleEndian)
      for (i = 0; i + offset < len; i++) {
        buf[i + offset] = dv.getUint8(i)
      }
    } else {
      buf._dataview.setUint32(offset, value, littleEndian)
    }
  } else {
    for (i = 0, j = Math.min(len - offset, 4); i < j; i++) {
      buf[offset + i] =
          (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
    }
  }
}

Buffer.prototype.writeUInt32LE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt32BE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, false, noAssert)
}

Buffer.prototype.writeInt8 = function (value, offset, noAssert) {
  var buf = this
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7f, -0x80)
  }

  if (offset >= buf.length)
    return

  if (browserSupport) {
    buf._dataview.setInt8(offset, value)
  } else {
    if (value >= 0)
      buf.writeUInt8(value, offset, noAssert)
    else
      buf.writeUInt8(0xff + value + 1, offset, noAssert)
  }
}

function _writeInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fff, -0x8000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (browserSupport) {
    if (offset + 1 === len) {
      var dv = new DataView(new ArrayBuffer(2))
      dv.setInt16(0, value, littleEndian)
      buf[offset] = dv.getUint8(0)
    } else {
      buf._dataview.setInt16(offset, value, littleEndian)
    }
  } else {
    if (value >= 0)
      _writeUInt16(buf, value, offset, littleEndian, noAssert)
    else
      _writeUInt16(buf, 0xffff + value + 1, offset, littleEndian, noAssert)
  }
}

Buffer.prototype.writeInt16LE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt16BE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, false, noAssert)
}

function _writeInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fffffff, -0x80000000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (browserSupport) {
    if (offset + 3 >= len) {
      var dv = new DataView(new ArrayBuffer(4))
      dv.setInt32(0, value, littleEndian)
      for (var i = 0; i + offset < len; i++) {
        buf[i + offset] = dv.getUint8(i)
      }
    } else {
      buf._dataview.setInt32(offset, value, littleEndian)
    }
  } else {
    if (value >= 0)
      _writeUInt32(buf, value, offset, littleEndian, noAssert)
    else
      _writeUInt32(buf, 0xffffffff + value + 1, offset, littleEndian, noAssert)
  }
}

Buffer.prototype.writeInt32LE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt32BE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, false, noAssert)
}

function _writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifIEEE754(value, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (browserSupport) {
    if (offset + 3 >= len) {
      var dv = new DataView(new ArrayBuffer(4))
      dv.setFloat32(0, value, littleEndian)
      for (var i = 0; i + offset < len; i++) {
        buf[i + offset] = dv.getUint8(i)
      }
    } else {
      buf._dataview.setFloat32(offset, value, littleEndian)
    }
  } else {
    ieee754.write(buf, value, offset, littleEndian, 23, 4)
  }
}

Buffer.prototype.writeFloatLE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, false, noAssert)
}

function _writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 7 < buf.length,
        'Trying to write beyond buffer length')
    verifIEEE754(value, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (browserSupport) {
    if (offset + 7 >= len) {
      var dv = new DataView(new ArrayBuffer(8))
      dv.setFloat64(0, value, littleEndian)
      for (var i = 0; i + offset < len; i++) {
        buf[i + offset] = dv.getUint8(i)
      }
    } else {
      buf._dataview.setFloat64(offset, value, littleEndian)
    }
  } else {
    ieee754.write(buf, value, offset, littleEndian, 52, 8)
  }
}

Buffer.prototype.writeDoubleLE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, false, noAssert)
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (typeof value === 'string') {
    value = value.charCodeAt(0)
  }

  if (typeof value !== 'number' || isNaN(value)) {
    throw new Error('value is not a number')
  }

  if (end < start) throw new Error('end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  if (start < 0 || start >= this.length) {
    throw new Error('start out of bounds')
  }

  if (end < 0 || end > this.length) {
    throw new Error('end out of bounds')
  }

  for (var i = start; i < end; i++) {
    this[i] = value
  }
}

Buffer.prototype.inspect = function () {
  var out = []
  var len = this.length
  for (var i = 0; i < len; i++) {
    out[i] = toHex(this[i])
    if (i === exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...'
      break
    }
  }
  return '<Buffer ' + out.join(' ') + '>'
}

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Not added to Buffer.prototype since it should only
 * be available in browsers that support ArrayBuffer.
 */
function BufferToArrayBuffer () {
  return (new Buffer(this)).buffer
}

// HELPER FUNCTIONS
// ================

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

var BP = Buffer.prototype

function augment (arr) {
  arr._isBuffer = true

  // Augment the Uint8Array *instance* (not the class!) with Buffer methods
  arr.write = BP.write
  arr.toString = BP.toString
  arr.toLocaleString = BP.toString
  arr.toJSON = BP.toJSON
  arr.copy = BP.copy
  arr.slice = BP.slice
  arr.readUInt8 = BP.readUInt8
  arr.readUInt16LE = BP.readUInt16LE
  arr.readUInt16BE = BP.readUInt16BE
  arr.readUInt32LE = BP.readUInt32LE
  arr.readUInt32BE = BP.readUInt32BE
  arr.readInt8 = BP.readInt8
  arr.readInt16LE = BP.readInt16LE
  arr.readInt16BE = BP.readInt16BE
  arr.readInt32LE = BP.readInt32LE
  arr.readInt32BE = BP.readInt32BE
  arr.readFloatLE = BP.readFloatLE
  arr.readFloatBE = BP.readFloatBE
  arr.readDoubleLE = BP.readDoubleLE
  arr.readDoubleBE = BP.readDoubleBE
  arr.writeUInt8 = BP.writeUInt8
  arr.writeUInt16LE = BP.writeUInt16LE
  arr.writeUInt16BE = BP.writeUInt16BE
  arr.writeUInt32LE = BP.writeUInt32LE
  arr.writeUInt32BE = BP.writeUInt32BE
  arr.writeInt8 = BP.writeInt8
  arr.writeInt16LE = BP.writeInt16LE
  arr.writeInt16BE = BP.writeInt16BE
  arr.writeInt32LE = BP.writeInt32LE
  arr.writeInt32BE = BP.writeInt32BE
  arr.writeFloatLE = BP.writeFloatLE
  arr.writeFloatBE = BP.writeFloatBE
  arr.writeDoubleLE = BP.writeDoubleLE
  arr.writeDoubleBE = BP.writeDoubleBE
  arr.fill = BP.fill
  arr.inspect = BP.inspect
  arr.toArrayBuffer = BufferToArrayBuffer

  if (arr.byteLength !== 0)
    arr._dataview = new DataView(arr.buffer, arr.byteOffset, arr.byteLength)

  return arr
}

// slice(start, end)
function clamp (index, len, defaultValue) {
  if (typeof index !== 'number') return defaultValue
  index = ~~index;  // Coerce to integer.
  if (index >= len) return len
  if (index >= 0) return index
  index += len
  if (index >= 0) return index
  return 0
}

function coerce (length) {
  // Coerce length to a number (possibly NaN), round up
  // in case it's fractional (e.g. 123.456) then do a
  // double negate to coerce a NaN to 0. Easy, right?
  length = ~~Math.ceil(+length)
  return length < 0 ? 0 : length
}

function isArray (subject) {
  return (Array.isArray || function (subject) {
    return Object.prototype.toString.call(subject) === '[object Array]'
  })(subject)
}

function isArrayish (subject) {
  return isArray(subject) || Buffer.isBuffer(subject) ||
      subject && typeof subject === 'object' &&
      typeof subject.length === 'number'
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++)
    if (str.charCodeAt(i) <= 0x7F)
      byteArray.push(str.charCodeAt(i))
    else {
      var h = encodeURIComponent(str.charAt(i)).substr(1).split('%')
      for (var j = 0; j < h.length; j++)
        byteArray.push(parseInt(h[j], 16))
    }
  return byteArray
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(str)
}

function blitBuffer (src, dst, offset, length) {
  var pos
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length))
      break
    dst[i + offset] = src[i]
  }
  return i
}

function decodeUtf8Char (str) {
  try {
    return decodeURIComponent(str)
  } catch (err) {
    return String.fromCharCode(0xFFFD) // UTF 8 invalid char
  }
}

/*
 * We have to make sure that the value is a valid integer. This means that it
 * is non-negative. It has no fractional component and that it does not
 * exceed the maximum allowed value.
 */
function verifuint (value, max) {
  assert(typeof value == 'number', 'cannot write a non-number as a number')
  assert(value >= 0,
      'specified a negative value for writing an unsigned value')
  assert(value <= max, 'value is larger than maximum value for type')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifsint(value, max, min) {
  assert(typeof value == 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifIEEE754(value, max, min) {
  assert(typeof value == 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
}

function assert (test, message) {
  if (!test) throw new Error(message || 'Failed assertion')
}

},{"base64-js":3,"ieee754":4}],"native-buffer-browserify":[function(require,module,exports){
module.exports=require('PcZj9L');
},{}],3:[function(require,module,exports){
(function (exports) {
	'use strict';

	var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

	function b64ToByteArray(b64) {
		var i, j, l, tmp, placeHolders, arr;
	
		if (b64.length % 4 > 0) {
			throw 'Invalid string. Length must be a multiple of 4';
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		placeHolders = indexOf(b64, '=');
		placeHolders = placeHolders > 0 ? b64.length - placeHolders : 0;

		// base64 is 4/3 + up to two characters of the original data
		arr = [];//new Uint8Array(b64.length * 3 / 4 - placeHolders);

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length;

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (indexOf(lookup, b64.charAt(i)) << 18) | (indexOf(lookup, b64.charAt(i + 1)) << 12) | (indexOf(lookup, b64.charAt(i + 2)) << 6) | indexOf(lookup, b64.charAt(i + 3));
			arr.push((tmp & 0xFF0000) >> 16);
			arr.push((tmp & 0xFF00) >> 8);
			arr.push(tmp & 0xFF);
		}

		if (placeHolders === 2) {
			tmp = (indexOf(lookup, b64.charAt(i)) << 2) | (indexOf(lookup, b64.charAt(i + 1)) >> 4);
			arr.push(tmp & 0xFF);
		} else if (placeHolders === 1) {
			tmp = (indexOf(lookup, b64.charAt(i)) << 10) | (indexOf(lookup, b64.charAt(i + 1)) << 4) | (indexOf(lookup, b64.charAt(i + 2)) >> 2);
			arr.push((tmp >> 8) & 0xFF);
			arr.push(tmp & 0xFF);
		}

		return arr;
	}

	function uint8ToBase64(uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length;

		function tripletToBase64 (num) {
			return lookup.charAt(num >> 18 & 0x3F) + lookup.charAt(num >> 12 & 0x3F) + lookup.charAt(num >> 6 & 0x3F) + lookup.charAt(num & 0x3F);
		};

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2]);
			output += tripletToBase64(temp);
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1];
				output += lookup.charAt(temp >> 2);
				output += lookup.charAt((temp << 4) & 0x3F);
				output += '==';
				break;
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1]);
				output += lookup.charAt(temp >> 10);
				output += lookup.charAt((temp >> 4) & 0x3F);
				output += lookup.charAt((temp << 2) & 0x3F);
				output += '=';
				break;
		}

		return output;
	}

	module.exports.toByteArray = b64ToByteArray;
	module.exports.fromByteArray = uint8ToBase64;
}());

function indexOf (arr, elt /*, from*/) {
	var len = arr.length;

	var from = Number(arguments[1]) || 0;
	from = (from < 0)
		? Math.ceil(from)
		: Math.floor(from);
	if (from < 0)
		from += len;

	for (; from < len; from++) {
		if ((typeof arr === 'string' && arr.charAt(from) === elt) ||
				(typeof arr !== 'string' && arr[from] === elt)) {
			return from;
		}
	}
	return -1;
}

},{}],4:[function(require,module,exports){
exports.read = function(buffer, offset, isLE, mLen, nBytes) {
  var e, m,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      nBits = -7,
      i = isLE ? (nBytes - 1) : 0,
      d = isLE ? -1 : 1,
      s = buffer[offset + i];

  i += d;

  e = s & ((1 << (-nBits)) - 1);
  s >>= (-nBits);
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8);

  m = e & ((1 << (-nBits)) - 1);
  e >>= (-nBits);
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8);

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity);
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};

exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0),
      i = isLE ? 0 : (nBytes - 1),
      d = isLE ? 1 : -1,
      s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8);

  e = (e << mLen) | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8);

  buffer[offset + i - d] |= s * 128;
};

},{}]},{},[])
;;module.exports=require("native-buffer-browserify").Buffer

},{}],19:[function(require,module,exports){
var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = Buffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192

/**
 * If `browserSupport`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (compatible down to IE6)
 */
var browserSupport = (function () {
   // Detect if browser supports Typed Arrays. Supported browsers are IE 10+,
   // Firefox 4+, Chrome 7+, Safari 5.1+, Opera 11.6+, iOS 4.2+.
   if (typeof Uint8Array === 'undefined' || typeof ArrayBuffer === 'undefined' ||
        typeof DataView === 'undefined')
      return false

  // Does the browser support adding properties to `Uint8Array` instances? If
  // not, then that's the same as no `Uint8Array` support. We need to be able to
  // add all the node Buffer API methods.
  // Relevant Firefox bug: https://bugzilla.mozilla.org/show_bug.cgi?id=695438
  try {
    var arr = new Uint8Array(0)
    arr.foo = function () { return 42 }
    return 42 === arr.foo()
  } catch (e) {
    return false
  }
})()


/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer (subject, encoding, noZero) {
  if (!(this instanceof Buffer))
    return new Buffer(subject, encoding, noZero)

  var type = typeof subject

  // Workaround: node's base64 implementation allows for non-padded strings
  // while base64-js does not.
  if (encoding === 'base64' && type === 'string') {
    subject = stringtrim(subject)
    while (subject.length % 4 !== 0) {
      subject = subject + '='
    }
  }

  // Find the length
  var length
  if (type === 'number')
    length = coerce(subject)
  else if (type === 'string')
    length = Buffer.byteLength(subject, encoding)
  else if (type === 'object')
    length = coerce(subject.length) // Assume object is an array
  else
    throw new Error('First argument needs to be a number, array or string.')

  var buf
  if (browserSupport) {
    // Preferred: Return an augmented `Uint8Array` instance for best performance
    buf = augment(new Uint8Array(length))
  } else {
    // Fallback: Return this instance of Buffer
    buf = this
    buf.length = length
  }

  var i
  if (Buffer.isBuffer(subject)) {
    // Speed optimization -- use set if we're copying from a Uint8Array
    buf.set(subject)
  } else if (isArrayish(subject)) {
    // Treat array-ish objects as a byte array
    for (i = 0; i < length; i++) {
      if (Buffer.isBuffer(subject))
        buf[i] = subject.readUInt8(i)
      else
        buf[i] = subject[i]
    }
  } else if (type === 'string') {
    buf.write(subject, 0, encoding)
  } else if (type === 'number' && !browserSupport && !noZero) {
    for (i = 0; i < length; i++) {
      buf[i] = 0
    }
  }

  return buf
}

// STATIC METHODS
// ==============

Buffer.isEncoding = function (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
      return true

    default:
      return false
  }
}

Buffer.isBuffer = function (b) {
  return b && b._isBuffer
}

Buffer.byteLength = function (str, encoding) {
  switch (encoding || 'utf8') {
    case 'hex':
      return str.length / 2

    case 'utf8':
    case 'utf-8':
      return utf8ToBytes(str).length

    case 'ascii':
    case 'binary':
      return str.length

    case 'base64':
      return base64ToBytes(str).length

    default:
      throw new Error('Unknown encoding')
  }
}

Buffer.concat = function (list, totalLength) {
  if (!isArray(list)) {
    throw new Error('Usage: Buffer.concat(list, [totalLength])\n' +
        'list should be an Array.')
  }

  if (list.length === 0) {
    return new Buffer(0)
  } else if (list.length === 1) {
    return list[0]
  }

  var i
  if (typeof totalLength !== 'number') {
    totalLength = 0
    for (i = 0; i < list.length; i++) {
      totalLength += list[i].length
    }
  }

  var buf = new Buffer(totalLength)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

// BUFFER INSTANCE METHODS
// =======================

function _hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) {
    throw new Error('Invalid hex string')
  }
  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var byte = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(byte)) throw new Error('Invalid hex string')
    buf[offset + i] = byte
  }
  Buffer._charsWritten = i * 2
  return i
}

function _utf8Write (buf, string, offset, length) {
  var bytes, pos
  return Buffer._charsWritten = blitBuffer(utf8ToBytes(string), buf, offset, length)
}

function _asciiWrite (buf, string, offset, length) {
  var bytes, pos
  return Buffer._charsWritten = blitBuffer(asciiToBytes(string), buf, offset, length)
}

function _binaryWrite (buf, string, offset, length) {
  return _asciiWrite(buf, string, offset, length)
}

function _base64Write (buf, string, offset, length) {
  var bytes, pos
  return Buffer._charsWritten = blitBuffer(base64ToBytes(string), buf, offset, length)
}

Buffer.prototype.write = function (string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length
      length = undefined
    }
  } else {  // legacy
    var swap = encoding
    encoding = offset
    offset = length
    length = swap
  }

  offset = Number(offset) || 0
  var remaining = this.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase()

  switch (encoding) {
    case 'hex':
      return _hexWrite(this, string, offset, length)

    case 'utf8':
    case 'utf-8':
      return _utf8Write(this, string, offset, length)

    case 'ascii':
      return _asciiWrite(this, string, offset, length)

    case 'binary':
      return _binaryWrite(this, string, offset, length)

    case 'base64':
      return _base64Write(this, string, offset, length)

    default:
      throw new Error('Unknown encoding')
  }
}

Buffer.prototype.toString = function (encoding, start, end) {
  var self = this

  encoding = String(encoding || 'utf8').toLowerCase()
  start = Number(start) || 0
  end = (end !== undefined)
    ? Number(end)
    : end = self.length

  // Fastpath empty strings
  if (end === start)
    return ''

  switch (encoding) {
    case 'hex':
      return _hexSlice(self, start, end)

    case 'utf8':
    case 'utf-8':
      return _utf8Slice(self, start, end)

    case 'ascii':
      return _asciiSlice(self, start, end)

    case 'binary':
      return _binarySlice(self, start, end)

    case 'base64':
      return _base64Slice(self, start, end)

    default:
      throw new Error('Unknown encoding')
  }
}

Buffer.prototype.toJSON = function () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function (target, target_start, start, end) {
  var source = this

  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (!target_start) target_start = 0

  // Copy 0 bytes; we're done
  if (end === start) return
  if (target.length === 0 || source.length === 0) return

  // Fatal error conditions
  if (end < start)
    throw new Error('sourceEnd < sourceStart')
  if (target_start < 0 || target_start >= target.length)
    throw new Error('targetStart out of bounds')
  if (start < 0 || start >= source.length)
    throw new Error('sourceStart out of bounds')
  if (end < 0 || end > source.length)
    throw new Error('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length)
    end = this.length
  if (target.length - target_start < end - start)
    end = target.length - target_start + start

  // copy!
  for (var i = 0; i < end - start; i++)
    target[i + target_start] = this[i + start]
}

function _base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function _utf8Slice (buf, start, end) {
  var res = ''
  var tmp = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    if (buf[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i])
      tmp = ''
    } else {
      tmp += '%' + buf[i].toString(16)
    }
  }

  return res + decodeUtf8Char(tmp)
}

function _asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++)
    ret += String.fromCharCode(buf[i])
  return ret
}

function _binarySlice (buf, start, end) {
  return _asciiSlice(buf, start, end)
}

function _hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

// TODO: add test that modifying the new buffer slice will modify memory in the
// original buffer! Use code from:
// http://nodejs.org/api/buffer.html#buffer_buf_slice_start_end
Buffer.prototype.slice = function (start, end) {
  var len = this.length
  start = clamp(start, len, 0)
  end = clamp(end, len, len)

  if (browserSupport) {
    return augment(this.subarray(start, end))
  } else {
    // TODO: slicing works, with limitations (no parent tracking/update)
    // https://github.com/feross/native-buffer-browserify/issues/9
    var sliceLen = end - start
    var newBuf = new Buffer(sliceLen, undefined, true)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
    return newBuf
  }
}

Buffer.prototype.readUInt8 = function (offset, noAssert) {
  var buf = this
  if (!noAssert) {
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < buf.length, 'Trying to read beyond buffer length')
  }

  if (offset >= buf.length)
    return

  return buf[offset]
}

function _readUInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  if (browserSupport) {
    if (offset + 1 < len) {
      return buf._dataview.getUint16(offset, littleEndian)
    } else {
      var dv = new DataView(new ArrayBuffer(2))
      dv.setUint8(0, buf[len - 1])
      return dv.getUint16(0, littleEndian)
    }
  } else {
    var val
    if (littleEndian) {
      val = buf[offset]
      if (offset + 1 < len)
        val |= buf[offset + 1] << 8
    } else {
      val = buf[offset] << 8
      if (offset + 1 < len)
        val |= buf[offset + 1]
    }
    return val
  }
}

Buffer.prototype.readUInt16LE = function (offset, noAssert) {
  return _readUInt16(this, offset, true, noAssert)
}

Buffer.prototype.readUInt16BE = function (offset, noAssert) {
  return _readUInt16(this, offset, false, noAssert)
}

function _readUInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  if (browserSupport) {
    if (offset + 3 < len) {
      return buf._dataview.getUint32(offset, littleEndian)
    } else {
      var dv = new DataView(new ArrayBuffer(4))
      for (var i = 0; i + offset < len; i++) {
        dv.setUint8(i, buf[i + offset])
      }
      return dv.getUint32(0, littleEndian)
    }
  } else {
    var val
    if (littleEndian) {
      if (offset + 2 < len)
        val = buf[offset + 2] << 16
      if (offset + 1 < len)
        val |= buf[offset + 1] << 8
      val |= buf[offset]
      if (offset + 3 < len)
        val = val + (buf[offset + 3] << 24 >>> 0)
    } else {
      if (offset + 1 < len)
        val = buf[offset + 1] << 16
      if (offset + 2 < len)
        val |= buf[offset + 2] << 8
      if (offset + 3 < len)
        val |= buf[offset + 3]
      val = val + (buf[offset] << 24 >>> 0)
    }
    return val
  }
}

Buffer.prototype.readUInt32LE = function (offset, noAssert) {
  return _readUInt32(this, offset, true, noAssert)
}

Buffer.prototype.readUInt32BE = function (offset, noAssert) {
  return _readUInt32(this, offset, false, noAssert)
}

Buffer.prototype.readInt8 = function (offset, noAssert) {
  var buf = this
  if (!noAssert) {
    assert(offset !== undefined && offset !== null,
        'missing offset')
    assert(offset < buf.length, 'Trying to read beyond buffer length')
  }

  if (offset >= buf.length)
    return

  if (browserSupport) {
    return buf._dataview.getInt8(offset)
  } else {
    var neg = buf[offset] & 0x80
    if (neg)
      return (0xff - buf[offset] + 1) * -1
    else
      return buf[offset]
  }
}

function _readInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  if (browserSupport) {
    if (offset + 1 === len) {
      var dv = new DataView(new ArrayBuffer(2))
      dv.setUint8(0, buf[len - 1])
      return dv.getInt16(0, littleEndian)
    } else {
      return buf._dataview.getInt16(offset, littleEndian)
    }
  } else {
    var val = _readUInt16(buf, offset, littleEndian, true)
    var neg = val & 0x8000
    if (neg)
      return (0xffff - val + 1) * -1
    else
      return val
  }
}

Buffer.prototype.readInt16LE = function (offset, noAssert) {
  return _readInt16(this, offset, true, noAssert)
}

Buffer.prototype.readInt16BE = function (offset, noAssert) {
  return _readInt16(this, offset, false, noAssert)
}

function _readInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  if (browserSupport) {
    if (offset + 3 >= len) {
      var dv = new DataView(new ArrayBuffer(4))
      for (var i = 0; i + offset < len; i++) {
        dv.setUint8(i, buf[i + offset])
      }
      return dv.getInt32(0, littleEndian)
    } else {
      return buf._dataview.getInt32(offset, littleEndian)
    }
  } else {
    var val = _readUInt32(buf, offset, littleEndian, true)
    var neg = val & 0x80000000
    if (neg)
      return (0xffffffff - val + 1) * -1
    else
      return val
  }
}

Buffer.prototype.readInt32LE = function (offset, noAssert) {
  return _readInt32(this, offset, true, noAssert)
}

Buffer.prototype.readInt32BE = function (offset, noAssert) {
  return _readInt32(this, offset, false, noAssert)
}

function _readFloat (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  if (browserSupport) {
    return buf._dataview.getFloat32(offset, littleEndian)
  } else {
    return ieee754.read(buf, offset, littleEndian, 23, 4)
  }
}

Buffer.prototype.readFloatLE = function (offset, noAssert) {
  return _readFloat(this, offset, true, noAssert)
}

Buffer.prototype.readFloatBE = function (offset, noAssert) {
  return _readFloat(this, offset, false, noAssert)
}

function _readDouble (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 7 < buf.length, 'Trying to read beyond buffer length')
  }

  if (browserSupport) {
    return buf._dataview.getFloat64(offset, littleEndian)
  } else {
    return ieee754.read(buf, offset, littleEndian, 52, 8)
  }
}

Buffer.prototype.readDoubleLE = function (offset, noAssert) {
  return _readDouble(this, offset, true, noAssert)
}

Buffer.prototype.readDoubleBE = function (offset, noAssert) {
  return _readDouble(this, offset, false, noAssert)
}

Buffer.prototype.writeUInt8 = function (value, offset, noAssert) {
  var buf = this
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xff)
  }

  if (offset >= buf.length) return

  buf[offset] = value
}

function _writeUInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (browserSupport) {
    if (offset + 1 === len) {
      var dv = new DataView(new ArrayBuffer(2))
      dv.setUint16(0, value, littleEndian)
      buf[offset] = dv.getUint8(0)
    } else {
      buf._dataview.setUint16(offset, value, littleEndian)
    }
  } else {
    for (var i = 0, j = Math.min(len - offset, 2); i < j; i++) {
      buf[offset + i] =
          (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
              (littleEndian ? i : 1 - i) * 8
    }
  }
}

Buffer.prototype.writeUInt16LE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt16BE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, false, noAssert)
}

function _writeUInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffffffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  var i
  if (browserSupport) {
    if (offset + 3 >= len) {
      var dv = new DataView(new ArrayBuffer(4))
      dv.setUint32(0, value, littleEndian)
      for (i = 0; i + offset < len; i++) {
        buf[i + offset] = dv.getUint8(i)
      }
    } else {
      buf._dataview.setUint32(offset, value, littleEndian)
    }
  } else {
    for (i = 0, j = Math.min(len - offset, 4); i < j; i++) {
      buf[offset + i] =
          (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
    }
  }
}

Buffer.prototype.writeUInt32LE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt32BE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, false, noAssert)
}

Buffer.prototype.writeInt8 = function (value, offset, noAssert) {
  var buf = this
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7f, -0x80)
  }

  if (offset >= buf.length)
    return

  if (browserSupport) {
    buf._dataview.setInt8(offset, value)
  } else {
    if (value >= 0)
      buf.writeUInt8(value, offset, noAssert)
    else
      buf.writeUInt8(0xff + value + 1, offset, noAssert)
  }
}

function _writeInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fff, -0x8000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (browserSupport) {
    if (offset + 1 === len) {
      var dv = new DataView(new ArrayBuffer(2))
      dv.setInt16(0, value, littleEndian)
      buf[offset] = dv.getUint8(0)
    } else {
      buf._dataview.setInt16(offset, value, littleEndian)
    }
  } else {
    if (value >= 0)
      _writeUInt16(buf, value, offset, littleEndian, noAssert)
    else
      _writeUInt16(buf, 0xffff + value + 1, offset, littleEndian, noAssert)
  }
}

Buffer.prototype.writeInt16LE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt16BE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, false, noAssert)
}

function _writeInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fffffff, -0x80000000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (browserSupport) {
    if (offset + 3 >= len) {
      var dv = new DataView(new ArrayBuffer(4))
      dv.setInt32(0, value, littleEndian)
      for (var i = 0; i + offset < len; i++) {
        buf[i + offset] = dv.getUint8(i)
      }
    } else {
      buf._dataview.setInt32(offset, value, littleEndian)
    }
  } else {
    if (value >= 0)
      _writeUInt32(buf, value, offset, littleEndian, noAssert)
    else
      _writeUInt32(buf, 0xffffffff + value + 1, offset, littleEndian, noAssert)
  }
}

Buffer.prototype.writeInt32LE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt32BE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, false, noAssert)
}

function _writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifIEEE754(value, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (browserSupport) {
    if (offset + 3 >= len) {
      var dv = new DataView(new ArrayBuffer(4))
      dv.setFloat32(0, value, littleEndian)
      for (var i = 0; i + offset < len; i++) {
        buf[i + offset] = dv.getUint8(i)
      }
    } else {
      buf._dataview.setFloat32(offset, value, littleEndian)
    }
  } else {
    ieee754.write(buf, value, offset, littleEndian, 23, 4)
  }
}

Buffer.prototype.writeFloatLE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, false, noAssert)
}

function _writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 7 < buf.length,
        'Trying to write beyond buffer length')
    verifIEEE754(value, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (browserSupport) {
    if (offset + 7 >= len) {
      var dv = new DataView(new ArrayBuffer(8))
      dv.setFloat64(0, value, littleEndian)
      for (var i = 0; i + offset < len; i++) {
        buf[i + offset] = dv.getUint8(i)
      }
    } else {
      buf._dataview.setFloat64(offset, value, littleEndian)
    }
  } else {
    ieee754.write(buf, value, offset, littleEndian, 52, 8)
  }
}

Buffer.prototype.writeDoubleLE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, false, noAssert)
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (typeof value === 'string') {
    value = value.charCodeAt(0)
  }

  if (typeof value !== 'number' || isNaN(value)) {
    throw new Error('value is not a number')
  }

  if (end < start) throw new Error('end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  if (start < 0 || start >= this.length) {
    throw new Error('start out of bounds')
  }

  if (end < 0 || end > this.length) {
    throw new Error('end out of bounds')
  }

  for (var i = start; i < end; i++) {
    this[i] = value
  }
}

Buffer.prototype.inspect = function () {
  var out = []
  var len = this.length
  for (var i = 0; i < len; i++) {
    out[i] = toHex(this[i])
    if (i === exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...'
      break
    }
  }
  return '<Buffer ' + out.join(' ') + '>'
}

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Not added to Buffer.prototype since it should only
 * be available in browsers that support ArrayBuffer.
 */
function BufferToArrayBuffer () {
  return (new Buffer(this)).buffer
}

// HELPER FUNCTIONS
// ================

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

var BP = Buffer.prototype

function augment (arr) {
  arr._isBuffer = true

  // Augment the Uint8Array *instance* (not the class!) with Buffer methods
  arr.write = BP.write
  arr.toString = BP.toString
  arr.toLocaleString = BP.toString
  arr.toJSON = BP.toJSON
  arr.copy = BP.copy
  arr.slice = BP.slice
  arr.readUInt8 = BP.readUInt8
  arr.readUInt16LE = BP.readUInt16LE
  arr.readUInt16BE = BP.readUInt16BE
  arr.readUInt32LE = BP.readUInt32LE
  arr.readUInt32BE = BP.readUInt32BE
  arr.readInt8 = BP.readInt8
  arr.readInt16LE = BP.readInt16LE
  arr.readInt16BE = BP.readInt16BE
  arr.readInt32LE = BP.readInt32LE
  arr.readInt32BE = BP.readInt32BE
  arr.readFloatLE = BP.readFloatLE
  arr.readFloatBE = BP.readFloatBE
  arr.readDoubleLE = BP.readDoubleLE
  arr.readDoubleBE = BP.readDoubleBE
  arr.writeUInt8 = BP.writeUInt8
  arr.writeUInt16LE = BP.writeUInt16LE
  arr.writeUInt16BE = BP.writeUInt16BE
  arr.writeUInt32LE = BP.writeUInt32LE
  arr.writeUInt32BE = BP.writeUInt32BE
  arr.writeInt8 = BP.writeInt8
  arr.writeInt16LE = BP.writeInt16LE
  arr.writeInt16BE = BP.writeInt16BE
  arr.writeInt32LE = BP.writeInt32LE
  arr.writeInt32BE = BP.writeInt32BE
  arr.writeFloatLE = BP.writeFloatLE
  arr.writeFloatBE = BP.writeFloatBE
  arr.writeDoubleLE = BP.writeDoubleLE
  arr.writeDoubleBE = BP.writeDoubleBE
  arr.fill = BP.fill
  arr.inspect = BP.inspect
  arr.toArrayBuffer = BufferToArrayBuffer

  if (arr.byteLength !== 0)
    arr._dataview = new DataView(arr.buffer, arr.byteOffset, arr.byteLength)

  return arr
}

// slice(start, end)
function clamp (index, len, defaultValue) {
  if (typeof index !== 'number') return defaultValue
  index = ~~index;  // Coerce to integer.
  if (index >= len) return len
  if (index >= 0) return index
  index += len
  if (index >= 0) return index
  return 0
}

function coerce (length) {
  // Coerce length to a number (possibly NaN), round up
  // in case it's fractional (e.g. 123.456) then do a
  // double negate to coerce a NaN to 0. Easy, right?
  length = ~~Math.ceil(+length)
  return length < 0 ? 0 : length
}

function isArray (subject) {
  return (Array.isArray || function (subject) {
    return Object.prototype.toString.call(subject) === '[object Array]'
  })(subject)
}

function isArrayish (subject) {
  return isArray(subject) || Buffer.isBuffer(subject) ||
      subject && typeof subject === 'object' &&
      typeof subject.length === 'number'
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++)
    if (str.charCodeAt(i) <= 0x7F)
      byteArray.push(str.charCodeAt(i))
    else {
      var h = encodeURIComponent(str.charAt(i)).substr(1).split('%')
      for (var j = 0; j < h.length; j++)
        byteArray.push(parseInt(h[j], 16))
    }
  return byteArray
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(str)
}

function blitBuffer (src, dst, offset, length) {
  var pos
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length))
      break
    dst[i + offset] = src[i]
  }
  return i
}

function decodeUtf8Char (str) {
  try {
    return decodeURIComponent(str)
  } catch (err) {
    return String.fromCharCode(0xFFFD) // UTF 8 invalid char
  }
}

/*
 * We have to make sure that the value is a valid integer. This means that it
 * is non-negative. It has no fractional component and that it does not
 * exceed the maximum allowed value.
 */
function verifuint (value, max) {
  assert(typeof value == 'number', 'cannot write a non-number as a number')
  assert(value >= 0,
      'specified a negative value for writing an unsigned value')
  assert(value <= max, 'value is larger than maximum value for type')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifsint(value, max, min) {
  assert(typeof value == 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifIEEE754(value, max, min) {
  assert(typeof value == 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
}

function assert (test, message) {
  if (!test) throw new Error(message || 'Failed assertion')
}

},{"base64-js":20,"ieee754":21}],20:[function(require,module,exports){
(function (exports) {
	'use strict';

	var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

	function b64ToByteArray(b64) {
		var i, j, l, tmp, placeHolders, arr;
	
		if (b64.length % 4 > 0) {
			throw 'Invalid string. Length must be a multiple of 4';
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		placeHolders = indexOf(b64, '=');
		placeHolders = placeHolders > 0 ? b64.length - placeHolders : 0;

		// base64 is 4/3 + up to two characters of the original data
		arr = [];//new Uint8Array(b64.length * 3 / 4 - placeHolders);

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length;

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (indexOf(lookup, b64.charAt(i)) << 18) | (indexOf(lookup, b64.charAt(i + 1)) << 12) | (indexOf(lookup, b64.charAt(i + 2)) << 6) | indexOf(lookup, b64.charAt(i + 3));
			arr.push((tmp & 0xFF0000) >> 16);
			arr.push((tmp & 0xFF00) >> 8);
			arr.push(tmp & 0xFF);
		}

		if (placeHolders === 2) {
			tmp = (indexOf(lookup, b64.charAt(i)) << 2) | (indexOf(lookup, b64.charAt(i + 1)) >> 4);
			arr.push(tmp & 0xFF);
		} else if (placeHolders === 1) {
			tmp = (indexOf(lookup, b64.charAt(i)) << 10) | (indexOf(lookup, b64.charAt(i + 1)) << 4) | (indexOf(lookup, b64.charAt(i + 2)) >> 2);
			arr.push((tmp >> 8) & 0xFF);
			arr.push(tmp & 0xFF);
		}

		return arr;
	}

	function uint8ToBase64(uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length;

		function tripletToBase64 (num) {
			return lookup.charAt(num >> 18 & 0x3F) + lookup.charAt(num >> 12 & 0x3F) + lookup.charAt(num >> 6 & 0x3F) + lookup.charAt(num & 0x3F);
		};

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2]);
			output += tripletToBase64(temp);
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1];
				output += lookup.charAt(temp >> 2);
				output += lookup.charAt((temp << 4) & 0x3F);
				output += '==';
				break;
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1]);
				output += lookup.charAt(temp >> 10);
				output += lookup.charAt((temp >> 4) & 0x3F);
				output += lookup.charAt((temp << 2) & 0x3F);
				output += '=';
				break;
		}

		return output;
	}

	module.exports.toByteArray = b64ToByteArray;
	module.exports.fromByteArray = uint8ToBase64;
}());

function indexOf (arr, elt /*, from*/) {
	var len = arr.length;

	var from = Number(arguments[1]) || 0;
	from = (from < 0)
		? Math.ceil(from)
		: Math.floor(from);
	if (from < 0)
		from += len;

	for (; from < len; from++) {
		if ((typeof arr === 'string' && arr.charAt(from) === elt) ||
				(typeof arr !== 'string' && arr[from] === elt)) {
			return from;
		}
	}
	return -1;
}

},{}],21:[function(require,module,exports){
exports.read = function(buffer, offset, isLE, mLen, nBytes) {
  var e, m,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      nBits = -7,
      i = isLE ? (nBytes - 1) : 0,
      d = isLE ? -1 : 1,
      s = buffer[offset + i];

  i += d;

  e = s & ((1 << (-nBits)) - 1);
  s >>= (-nBits);
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8);

  m = e & ((1 << (-nBits)) - 1);
  e >>= (-nBits);
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8);

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity);
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};

exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0),
      i = isLE ? 0 : (nBytes - 1),
      d = isLE ? 1 : -1,
      s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8);

  e = (e << mLen) | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8);

  buffer[offset + i - d] |= s * 128;
};

},{}],22:[function(require,module,exports){
var Buffer=require("__browserify_Buffer");//     uuid.js
//
//     Copyright (c) 2010-2012 Robert Kieffer
//     MIT License - http://opensource.org/licenses/mit-license.php

(function() {
  var _global = this;

  // Unique ID creation requires a high quality random # generator.  We feature
  // detect to determine the best RNG source, normalizing to a function that
  // returns 128-bits of randomness, since that's what's usually required
  var _rng;

  // Node.js crypto-based RNG - http://nodejs.org/docs/v0.6.2/api/crypto.html
  //
  // Moderately fast, high quality
  if (typeof(require) == 'function') {
    try {
      var _rb = require('crypto').randomBytes;
      _rng = _rb && function() {return _rb(16);};
    } catch(e) {}
  }

  if (!_rng && _global.crypto && crypto.getRandomValues) {
    // WHATWG crypto-based RNG - http://wiki.whatwg.org/wiki/Crypto
    //
    // Moderately fast, high quality
    var _rnds8 = new Uint8Array(16);
    _rng = function whatwgRNG() {
      crypto.getRandomValues(_rnds8);
      return _rnds8;
    };
  }

  if (!_rng) {
    // Math.random()-based (RNG)
    //
    // If all else fails, use Math.random().  It's fast, but is of unspecified
    // quality.
    var  _rnds = new Array(16);
    _rng = function() {
      for (var i = 0, r; i < 16; i++) {
        if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
        _rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
      }

      return _rnds;
    };
  }

  // Buffer class to use
  var BufferClass = typeof(Buffer) == 'function' ? Buffer : Array;

  // Maps for number <-> hex string conversion
  var _byteToHex = [];
  var _hexToByte = {};
  for (var i = 0; i < 256; i++) {
    _byteToHex[i] = (i + 0x100).toString(16).substr(1);
    _hexToByte[_byteToHex[i]] = i;
  }

  // **`parse()` - Parse a UUID into it's component bytes**
  function parse(s, buf, offset) {
    var i = (buf && offset) || 0, ii = 0;

    buf = buf || [];
    s.toLowerCase().replace(/[0-9a-f]{2}/g, function(oct) {
      if (ii < 16) { // Don't overflow!
        buf[i + ii++] = _hexToByte[oct];
      }
    });

    // Zero out remaining bytes if string was short
    while (ii < 16) {
      buf[i + ii++] = 0;
    }

    return buf;
  }

  // **`unparse()` - Convert UUID byte array (ala parse()) into a string**
  function unparse(buf, offset) {
    var i = offset || 0, bth = _byteToHex;
    return  bth[buf[i++]] + bth[buf[i++]] +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] +
            bth[buf[i++]] + bth[buf[i++]] +
            bth[buf[i++]] + bth[buf[i++]];
  }

  // **`v1()` - Generate time-based UUID**
  //
  // Inspired by https://github.com/LiosK/UUID.js
  // and http://docs.python.org/library/uuid.html

  // random #'s we need to init node and clockseq
  var _seedBytes = _rng();

  // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
  var _nodeId = [
    _seedBytes[0] | 0x01,
    _seedBytes[1], _seedBytes[2], _seedBytes[3], _seedBytes[4], _seedBytes[5]
  ];

  // Per 4.2.2, randomize (14 bit) clockseq
  var _clockseq = (_seedBytes[6] << 8 | _seedBytes[7]) & 0x3fff;

  // Previous uuid creation time
  var _lastMSecs = 0, _lastNSecs = 0;

  // See https://github.com/broofa/node-uuid for API details
  function v1(options, buf, offset) {
    var i = buf && offset || 0;
    var b = buf || [];

    options = options || {};

    var clockseq = options.clockseq != null ? options.clockseq : _clockseq;

    // UUID timestamps are 100 nano-second units since the Gregorian epoch,
    // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
    // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
    // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
    var msecs = options.msecs != null ? options.msecs : new Date().getTime();

    // Per 4.2.1.2, use count of uuid's generated during the current clock
    // cycle to simulate higher resolution clock
    var nsecs = options.nsecs != null ? options.nsecs : _lastNSecs + 1;

    // Time since last uuid creation (in msecs)
    var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

    // Per 4.2.1.2, Bump clockseq on clock regression
    if (dt < 0 && options.clockseq == null) {
      clockseq = clockseq + 1 & 0x3fff;
    }

    // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
    // time interval
    if ((dt < 0 || msecs > _lastMSecs) && options.nsecs == null) {
      nsecs = 0;
    }

    // Per 4.2.1.2 Throw error if too many uuids are requested
    if (nsecs >= 10000) {
      throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
    }

    _lastMSecs = msecs;
    _lastNSecs = nsecs;
    _clockseq = clockseq;

    // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
    msecs += 12219292800000;

    // `time_low`
    var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
    b[i++] = tl >>> 24 & 0xff;
    b[i++] = tl >>> 16 & 0xff;
    b[i++] = tl >>> 8 & 0xff;
    b[i++] = tl & 0xff;

    // `time_mid`
    var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
    b[i++] = tmh >>> 8 & 0xff;
    b[i++] = tmh & 0xff;

    // `time_high_and_version`
    b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
    b[i++] = tmh >>> 16 & 0xff;

    // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
    b[i++] = clockseq >>> 8 | 0x80;

    // `clock_seq_low`
    b[i++] = clockseq & 0xff;

    // `node`
    var node = options.node || _nodeId;
    for (var n = 0; n < 6; n++) {
      b[i + n] = node[n];
    }

    return buf ? buf : unparse(b);
  }

  // **`v4()` - Generate random UUID**

  // See https://github.com/broofa/node-uuid for API details
  function v4(options, buf, offset) {
    // Deprecated - 'format' argument, as supported in v1.2
    var i = buf && offset || 0;

    if (typeof(options) == 'string') {
      buf = options == 'binary' ? new BufferClass(16) : null;
      options = null;
    }
    options = options || {};

    var rnds = options.random || (options.rng || _rng)();

    // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
    rnds[6] = (rnds[6] & 0x0f) | 0x40;
    rnds[8] = (rnds[8] & 0x3f) | 0x80;

    // Copy bytes to buffer, if provided
    if (buf) {
      for (var ii = 0; ii < 16; ii++) {
        buf[i + ii] = rnds[ii];
      }
    }

    return buf || unparse(rnds);
  }

  // Export public API
  var uuid = v4;
  uuid.v1 = v1;
  uuid.v4 = v4;
  uuid.parse = parse;
  uuid.unparse = unparse;
  uuid.BufferClass = BufferClass;

  if (typeof define === 'function' && define.amd) {
    // Publish as AMD module
    define(function() {return uuid;});
  } else if (typeof(module) != 'undefined' && module.exports) {
    // Publish as node.js module
    module.exports = uuid;
  } else {
    // Publish as global (in browsers)
    var _previousRoot = _global.uuid;

    // **`noConflict()` - (browser only) to reset global 'uuid' var**
    uuid.noConflict = function() {
      _global.uuid = _previousRoot;
      return uuid;
    };

    _global.uuid = uuid;
  }
}).call(this);

},{"__browserify_Buffer":18,"crypto":13}]},{},[11])