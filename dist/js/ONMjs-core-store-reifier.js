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
  var StoreReifier;

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
            exceptionMessage = "ONMjs.implementation.StoreRefier.dispatchCallback failure while processing " + ("address='" + (address_.getHumanReadableString()) + "', callback='" + callbackName_ + "', observer='" + ((observerId_ != null) && observerId_ || "[broadcast all]") + "': " + exception);
            throw exceptionMessage;
          }
        };
        this.reifyStoreComponent = function(address_, observerId_) {
          var dispatchCallback, exception;
          try {
            if (!((address_ != null) && address_)) {
              throw "Internal error: Missing address input parameter.";
            }
            if (!Encapsule.code.lib.js.dictionaryLength(_this.store.implementation.observers)) {
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
            throw "ONMjs.implementation.StoreReifier failure: " + exception;
          }
        };
        this.unreifyStoreComponent = function(address_, observerId_) {
          var dispatchCallback, exception;
          try {
            if (!((address_ != null) && address_)) {
              throw "Internal error: Missing address input parameter.";
            }
            if (!Encapsule.code.lib.js.dictionaryLength(_this.store.implementation.observers)) {
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
            throw "ONMjs.implementation.StoreReifier failure: " + exception;
          }
        };
        this.reifyStoreExtensions = function(address_, observerId_, undoFlag_) {
          var dispatchCallback, exception;
          try {
            if (!((address_ != null) && address_)) {
              throw "Internal error: Missing address input parameter.";
            }
            if (!Encapsule.code.lib.js.dictionaryLength(_this.store.implementation.observers)) {
              return;
            }
            dispatchCallback = _this.dispatchCallback;
            return address_.visitExtensionPointAddresses(function(addressExtensionPoint_) {
              var extensionPointNamespace;
              extensionPointNamespace = new ONMjs.Namespace(_this.store, addressExtensionPoint_);
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
            throw "ONMjs.implementation.StoreReifier failure: " + exception;
          }
        };
      } catch (_error) {
        exception = _error;
        throw "ONMjs.implementation.StoreReifier constructor failed: " + exception;
      }
    }

    return StoreReifier;

  })();

}).call(this);
