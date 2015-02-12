
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
  var Address, AddressToken, Namespace, NamespaceDetails, addressResolver,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  AddressToken = require('./impl/onm-address-token');

  Address = require('./onm-address');

  addressResolver = require('./impl/onm-address-resolver');

  NamespaceDetails = (function() {
    function NamespaceDetails(namespace_, store_, resolvedAddressContext_) {
      var exception;
      try {
        this.dataReference = addressResolver.getResolvedNamedObjectReference(resolvedAddressContext_);
        this.resolvedTokenArray = addressResolver.getResolvedTokenVector(resolvedAddressContext_);
        this.getResolvedToken = (function(_this) {
          return function() {
            return _this.resolvedTokenArray.length && _this.resolvedTokenArray[_this.resolvedTokenArray.length - 1] || void 0;
          };
        })(this);
        this.resolvedAddress = void 0;
      } catch (_error) {
        exception = _error;
        throw new Error("NamespaceDetails failure: " + exception.message);
      }
    }

    return NamespaceDetails;

  })();

  module.exports = Namespace = (function() {
    function Namespace(store_, resolvedAddressContext_) {
      this.visitExtensionPointSubcomponents = __bind(this.visitExtensionPointSubcomponents, this);
      this.getExtensionPointSubcomponentCount = __bind(this.getExtensionPointSubcomponentCount, this);
      this.update = __bind(this.update, this);
      this.toJSON = __bind(this.toJSON, this);
      this.nsComponent = __bind(this.nsComponent, this);
      this.nsOpen = __bind(this.nsOpen, this);
      this.nsCreate = __bind(this.nsCreate, this);
      this.nsAccess = __bind(this.nsAccess, this);
      this.namespace = __bind(this.namespace, this);
      this.address = __bind(this.address, this);
      this.getResolvedAddress = __bind(this.getResolvedAddress, this);
      this.getComponentKey = __bind(this.getComponentKey, this);
      this.raddress = __bind(this.raddress, this);
      this.caddress = __bind(this.caddress, this);
      this.ckey = __bind(this.ckey, this);
      this.model = __bind(this.model, this);
      this.data = __bind(this.data, this);
      this.name = __bind(this.name, this);
      var exception;
      try {
        if (!((store_ != null) && store_)) {
          throw new Error("Missing object store input parameter.");
        }
        this.store = store_;
        this.implementation = new NamespaceDetails(this, store_, resolvedAddressContext_);
      } catch (_error) {
        exception = _error;
        throw new Error("onm.Namespace constructor failed: " + exception.message);
      }
    }

    Namespace.prototype.name = function() {
      var exception;
      try {
        return this.implementation.getResolvedToken().namespaceDescriptor.jsonTag;
      } catch (_error) {
        exception = _error;
        throw new Error("onm.Namespace.name failed: " + exception.message);
      }
    };

    Namespace.prototype.data = function() {
      return this.implementation.dataReference;
    };

    Namespace.prototype.model = function() {
      var exception_;
      try {
        return this.adress().getModel();
      } catch (_error) {
        exception_ = _error;
        throw new Error("onm.Namespace.model failed: " + exception_.message);
      }
    };

    Namespace.prototype.ckey = function() {
      var exception_;
      try {
        return this.implementation.getResolvedToken().key;
      } catch (_error) {
        exception_ = _error;
        throw new Error("onm.Namespace.ckey failed: " + exception_.message);
      }
    };

    Namespace.prototype.caddress = function() {
      var exception_;
      try {
        return this.address().createComponentAddress();
      } catch (_error) {
        exception_ = _error;
        throw new Error("onm.Namespace.caddress failed: " + exception_.message);
      }
    };

    Namespace.prototype.raddress = function() {
      var exception_;
      try {
        return this.store.address();
      } catch (_error) {
        exception_ = _error;
        throw new Error("onm.Namespace.raddress faled: " + exception_.message);
      }
    };

    Namespace.prototype.getComponentKey = function() {
      console.log("onm v0.3: onm.Namespace.getComponentKey is deprecated. Use v0.3 onm.Namespace.ckey API.");
      return this.key();
    };

    Namespace.prototype.getResolvedAddress = function() {
      console.log("onm v0.3: onm.Namespace.getResolvedAddress has been deprecated. Use v0.3 onm.Namespace.address API.");
      return this.address();
    };

    Namespace.prototype.address = function(rprls_) {
      var exception_, generations, prlsToken, rprlsAscend, rprlsTokens, rprlsType, targetAddress, _i, _len;
      try {
        targetAddress = this.implementation.resolvedAddress;
        if (!((targetAddress != null) && targetAddress)) {
          targetAddress = this.implementation.resolvedAddress = new Address(this.store.model, this.implementation.resolvedTokenArray);
        }
        if (!((rprls_ != null) && rprls_)) {
          return targetAddress;
        }
        rprlsType = Object.prototype.toString.call(rprls_);
        if (rprlsType !== '[object String]') {
          throw new Error("Invalid type '" + rprsType + "'. Expected '[object String]'.");
        }
        rprlsTokens = rprls_.split('.');
        generations = 0;
        for (_i = 0, _len = rprlsTokens.length; _i < _len; _i++) {
          prlsToken = rprlsTokens[_i];
          if (prlsToken === '//') {
            generations++;
          } else {
            break;
          }
        }
        rprlsAscend = rprlsTokens.join(generations, rprplsTokens.length, '.');
        if (generations) {
          targetAddress = targetAddress.createParentAddress(descendCount);
        }
        return targetAddress.createSubpathAddress(rprlsAscend);
      } catch (_error) {
        exception_ = _error;
        throw new Error("onm.Namespace.address failed: " + exception_.message);
      }
    };

    Namespace.prototype.namespace = function(request_) {
      var exception_, message, request, rlType;
      try {
        if (!((request_ != null) && request_)) {
          return this;
        }
        request = {
          operation: (request_.operation != null) && request_.operation || 'access',
          address: void 0,
          data: (request_.data != null) && request_.data
        };
        if (!((request_.rl != null) && request_.rl)) {
          request.address = this.address();
        } else {
          if (request_.rl(instance in Address)) {
            request.address = request_.rl;
          } else {
            try {
              request.address = this.address(request_.rl);
            } catch (_error) {
              exception_ = _error;
              try {
                request.address = this.store.address(request_.rl);
              } catch (_error) {
                exception_ = _error;
                rlType = Object.prototype.toString.call(request_.rl);
                switch (rlType) {
                  case '[object String]':
                    message = "Invalid resource locator '" + request_.rl + "'. Not in model address space.";
                    break;
                  default:
                    message = "Unrecognized resource locator type '" + (typeof request_.rl) + "'.";
                    break;
                }
                throw new Error(message);
              }
            }
          }
        }
        return this.store.namespace({
          operation: request.operation,
          rl: request.rl,
          data: request.data
        });
      } catch (_error) {
        exception_ = _error;
        throw new Error("onm.Namespace.namespace failed: " + exception_.message);
      }
    };

    Namespace.prototype.nsAccess = function(rl_, data_) {
      var exception_;
      try {
        return this.namespace({
          operaton: 'access',
          rl: rl_,
          data: data_
        });
      } catch (_error) {
        exception_ = _error;
        throw new Error("onm.Namespace.nsAccess failed: " + exception_.message);
      }
    };

    Namespace.prototype.nsCreate = function(rl_, data_) {
      var exception_;
      try {
        return this.namespace({
          operation: 'create',
          rl: rl_,
          data: data_
        });
      } catch (_error) {
        exception_ = _error;
        throw new Error("onm.Namespace.nsCreate failed: " + exception_.message);
      }
    };

    Namespace.prototype.nsOpen = function(rl_, data_) {
      try {
        return this.namespace({
          operation: 'open',
          rl: rl_,
          data: data_
        });
      } catch (_error) {
        throw new Error("onm.Namespace.nsOpen failed: " + exception_.message);
      }
    };

    Namespace.prototype.nsComponent = function(data_) {
      var exception_;
      try {
        return this.namespace({
          operation: 'open',
          rl: this.caddress(),
          data: data_
        });
      } catch (_error) {
        exception_ = _error;
        throw new Error("onm.Namespace.nsComponent failed: " + exception_.message);
      }
    };

    Namespace.prototype.toJSON = function(replacer_, space_) {
      var exception_, resultJSON, space;
      try {
        space = (space_ != null) && space_ || 0;
        resultJSON = JSON.stringify(this.implementation.dataReference, replacer_, space);
        if (!((resultJSON != null) && resultJSON)) {
          throw new Error("Namespace data is corrupt. Unable to serialize to JSON.");
        }
        return resultJSON;
      } catch (_error) {
        exception_ = _error;
        throw new Error("onm.Namespace.toJSON serialization failed on address '" + (this.address().uri()) + "' with detail: " + exception_.message);
      }
    };

    Namespace.prototype.update = function() {
      var address, containingComponentNotified, count, descriptor, exception, semanticBindings, updateAction, _results;
      try {
        address = this.address();
        semanticBindings = this.store.model.getSemanticBindings();
        updateAction = (semanticBindings != null) && semanticBindings && (semanticBindings.update != null) && semanticBindings.update || void 0;
        if ((updateAction != null) && updateAction) {
          updateAction(this.implementation.dataReference);
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
        throw new Error("onm.Namespace.update failed: " + exception.message);
      }
    };

    Namespace.prototype.getExtensionPointSubcomponentCount = function() {
      var componentCount, exception_, resolvedToken;
      try {
        resolvedToken = this.implementation.getResolvedToken();
        if (!((resolvedToken != null) && resolvedToken)) {
          throw new Error("Internal error: unable to resolve token.");
        }
        componentCount = 0;
        if (resolvedToken.namespaceDescriptor.namespaceType === "extensionPoint") {
          componentCount = Object.keys(this.implementation.dataReference).length;
        }
        return componentCount;
      } catch (_error) {
        exception_ = _error;
        throw new Error("onm.Namespace.getExtensionPointSubcomponentCount failed: " + exception_.message);
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
        _ref = this.implementation.dataReference;
        for (key in _ref) {
          object = _ref[key];
          address = this.address().clone();
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
        throw new Error("onm.Namespace.visitExtensionPointSubcomponents failed: " + exception.message);
      }
    };

    return Namespace;

  })();

}).call(this);
