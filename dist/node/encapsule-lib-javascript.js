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
      throw new Error("clone: " + exception.message);
    }
  };

  module.exports.clone = clone;

  module.exports.dictionaryLength = function(dictionary_) {
    var exception;
    try {
      return Object.keys(dictionary_).length;
    } catch (_error) {
      exception = _error;
      throw new Error("dictionaryLength: " + exception.message);
    }
  };

  module.exports.uuidNull = "00000000-0000-0000-0000-000000000000";

  module.exports.getEpochTime = function() {
    return Math.round(new Date().getTime() / 1000.0);
  };

}).call(this);
