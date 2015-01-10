
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
  var AddressTokenResolver, createTokenNamespace, openTokenNamespace, resolveNamedObject;

  resolveNamedObject = require('./onm-named-object-resolver');

  AddressTokenResolver = (function() {
    function AddressTokenResolver(tokenResolveOptions_) {
      var exception_;
      try {
        if (!((tokenResolveOptions_ != null) && tokenResolveOptions_ && (tokenResolveOptions_.model != null) && tokenResolveOptions_.model && (tokenResolveOptions_.parentDataReference != null) && tokenResolveOptions_.parentDataReference && (tokenResolveOptions_.token != null) && tokenResolveOptions_.token && (tokenResolveOptions_.mode != null) && tokenResolveOptions_.mode && (tokenResolveOptions_.propertyAssignmentObject != null) && tokenResolveOptions_.propertyAssignmentObject)) {
          throw new Error("Invalid resolve options object.");
        }
        switch (tokenResolveOptions_.mode) {
          case 'open':
            break;
          case 'create':
            break;
          default:
            throw new Error("Unrecognized mode value '" + tokenResolveOptions_.mode + "'");
        }
      } catch (_error) {
        exception_ = _error;
        throw new Error("AddressTokenResolver2 construction failure: " + exception_.message);
      }
    }

    return AddressTokenResolver;

  })();

  openTokenNamespace = function(tokenResolveOptions_) {
    var exception_;
    try {

    } catch (_error) {
      exception_ = _error;
      throw new Error("openTokenNamespace failure: " + exception_.message);
    }
  };

  createTokenNamespace = function(tokenResolveOptions_) {
    var exception_;
    try {

    } catch (_error) {
      exception_ = _error;
      throw new Error("createTokenNamespace failure: " + exception_.message);
    }
  };

  module.exports = {
    AddressTokenResolver: AddressTokenResolver,
    openTokenNamespace: openTokenNamespace,
    createTokenNamespace: createTokenNamespace
  };

}).call(this);
