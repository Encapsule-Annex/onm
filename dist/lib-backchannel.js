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
  var BackChannel;

  module.exports = BackChannel = (function() {
    function BackChannel(logHandler_, errorHandler_) {
      var exception,
        _this = this;
      try {
        /*
        callback: function(html_) { ... }
        where html_ is an HTML string
        */

        this.logHandler = logHandler_;
        /*
        callback: function(error_) { ... }
        where error_ is an Error object
        */

        this.errorHandler = errorHandler_;
        this.log = function(html_) {
          var exception;
          try {
            if ((_this.logHandler != null) && _this.logHandler) {
              try {
                _this.logHandler(html_);
              } catch (_error) {
                exception = _error;
                throw new Error("Error executing log handler function callback: " + exception.message);
              }
              return true;
            }
            return false;
          } catch (_error) {
            exception = _error;
            throw new Error("BackChannel.log failure: " + exception.message);
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
                throw new Error("Error executing error handler function callback: " + exception.message);
              }
              return true;
            }
            console.warn("BackChannel.error: Unhandled exception w/no registered error handler!");
            throw error_;
          } catch (_error) {
            exception = _error;
            console.warn("BackChannel.error rethrowing unhandled exception!");
            throw new Error("BackChannel.error failure: " + exception.message);
          }
        };
      } catch (_error) {
        exception = _error;
        throw new Error("BackChannel failure in constructor: " + exception.message);
      }
    }

    return BackChannel;

  })();

}).call(this);
