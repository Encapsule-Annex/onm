
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
  var AddressStore, Model, Namespace, Store,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Store = require('./onm-store');

  Model = require('./onm-model');

  Namespace = require('./onm-namespace');

  module.exports = AddressStore = (function(_super) {
    __extends(AddressStore, _super);

    function AddressStore(referenceStore_, address_) {
      this.setAddress = __bind(this.setAddress, this);
      this.getAddress = __bind(this.getAddress, this);
      var exception, selectorAddress, selectorModel;
      try {
        if (!((referenceStore_ != null) && referenceStore_)) {
          throw new Error("Missing object store input parameter. Unable to determine external selector type.");
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
          onNamespaceUpdated: (function(_this) {
            return function(objectStore_, observerId_, address_) {
              var cachedAddress, exception;
              try {
                cachedAddress = _this.getAddress();
                if ((cachedAddress != null) && cachedAddress && cachedAddress.isEqual(address_)) {
                  return _this.setAddress(address_);
                }
              } catch (_error) {
                exception = _error;
                throw new Error("onNamespaceUpdated failure: " + exception.message);
              }
            };
          })(this),
          onNamespaceRemoved: (function(_this) {
            return function(objectStore_, observerId_, address_) {
              var cachedAddress, exception, parentAddress;
              try {
                cachedAddress = _this.getAddress();
                if ((cachedAddress != null) && cachedAddress && cachedAddress.isEqual(address_)) {
                  parentAddress = cachedAddress.createParentAddress();
                  _this.setAddress(parentAddress);
                }
              } catch (_error) {
                exception = _error;
                throw new Error("onNamespaceRemoved failure: " + exception.message);
              }
            };
          })(this)
        };
      } catch (_error) {
        exception = _error;
        throw new Error("AddressStore failure: " + exception.message);
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
        throw new Error("getSelector failure: " + exception.message);
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
        throw new Error("setAddress failure: " + exception.message);
      }
    };

    return AddressStore;

  })(Store);

}).call(this);
