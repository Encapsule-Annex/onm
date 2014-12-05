
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
  var AddressTokenResolver2;

  module.exports = AddressTokenResolver2 = (function() {
    function AddressTokenResolver2(constructorOptions_) {
      var exception_;
      try {
        if (!((constructorOptions_ != null) && constructorOptions_)) {
          throw new Error("Missing required constructor options object parameter.");
        }
        if (!((contructorOptions_.store != null) && constructorOptions_.store && (constructorOptions_.parentDataReference != null) && constructorOptions_.parentDataReference && (constructorOptions_.token != null) && constructorOptions_.token && (constructorOptions_.mode != null) && constructorOptions_.mode && (constructorOptions_.propertyAssignmentObject != null) && constructorOptions_.propertyAssignmentObject)) {
          throw new Error("Constructor options object is malformed.");
        }
        switch (constructorOptions_.mode) {
          case 'open':
            break;
          case 'create':
            break;
          default:
            throw new Error("Unrecognized mode value '" + constructorOptions_.mode + "'");
        }
      } catch (_error) {
        exception_ = _error;
        throw new Error("AddressTokenResolver2 construction failure: " + exception_.message);
      }
    }

    return AddressTokenResolver2;

  })();

}).call(this);
