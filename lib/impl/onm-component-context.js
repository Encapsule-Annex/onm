
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
  var componentResolverContext;

  module.exports = componentResolverContext = {};

  componentResolverContext.initializeContextObject = function(options_) {
    var context;
    return context = {
      input: options_,
      output: {
        resolvedNamedObject: null
      }
    };
  };

  componentResolverContext.checkValidContextInput = function(options_) {
    var results, setInvalid;
    results = {
      valid: true,
      reason: 'okay'
    };
    setInvalid = function(reason_) {
      results.valid = false;
      results.reason = reason_;
      return results;
    };
    while (true) {
      if (!((options_ != null) && options_)) {
        setInvalid("Missing options in-parameter.");
        break;
      }
      if (!((options_.parentDataReference != null) && options_.parentDataReference)) {
        setInvalid("Missing parent data object reference.");
        break;
      }
      if (!((options_.addressToken != null) && options_.addressToken)) {
        setInvalid("Missing address token object reference.");
        break;
      }
      if (!((options_.strategy != null) && options_.strategy && (options_.strategy.length != null) && options_.strategy.length)) {
        setInvalid("Missing resolution strategy specification.");
        break;
      }
      if (!((options_.semanticBindingsReference != null) && options_.semanticBindingsReference)) {
        setInvalid("Missing semantic bindings reference.");
        break;
      }
      break;
    }
    if (!results.valid) {
      console.warn("Invalid named object input context object: '" + results.reason + "'.");
    }
    return results.valid;
  };

  componentResolverContext.checkValidContextOutput = function(results_) {
    var results, setInvalid;
    results = {
      valid: true,
      reason: 'okay'
    };
    setInvalid = function(reason_) {
      results.valid = false;
      results.reason = reason_;
      return results;
    };
    while (true) {
      if (!((results_ != null) && results)) {
        setInvalid("Missing results in-parameter.");
        break;
      }
      if (!((results_.resolvedNamedObject != null) && results_.resolvedNamedObject)) {
        setInvalid("Missing resolved named object resolution results structure.");
        break;
      }
      break;
    }
    if (!results.valid) {
      console.warn("Invalid named object input context object: '" + results.reason + "'.");
    }
    return results.valid;
  };

}).call(this);
