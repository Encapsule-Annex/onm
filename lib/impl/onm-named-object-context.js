
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
  var helperFunctions, namedObjectResolverContext;

  helperFunctions = require('./onm-util-functions');

  module.exports = namedObjectResolverContext = {};

  namedObjectResolverContext.initializeContextObject = function(options_) {
    var context;
    return context = {
      input: {
        strategy: (options_.strategy != null) && options_.strategy || 'error',
        parentDataReference: options_.parentDataReference,
        targetNamespaceDescriptor: options_.targetNamespaceDescriptor,
        targetNamespaceKey: options_.targetNamespaceKey,
        semanticBindingsReference: options_.semanticBindingsReference,
        propertyAssignmentObject: (options_.propertyAssignmentObject != null) && options_.propertyAssignmentObject && helperFunctions.clone(options_.propertyAssignmentObject) || {}
      },
      output: {
        strategyFollowed: 'error',
        namespaceEffectiveKey: null,
        namespaceDataReference: null,
        dataChangeEventJournal: [],
        pendingResolutionStack: [],
        resolvedId: -1
      }
    };
  };

  namedObjectResolverContext.checkValidContextInput = function(options_) {
    var results, setInvalid, strategyValid;
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
      if (!((options_.targetNamespaceDescriptor != null) && options_.targetNamespaceDescriptor)) {
        setInvalid("Missing target namespace descriptor object reference.");
        break;
      }
      if (!((options_.targetNamespaceDescriptor.jsonTag != null) && options_.targetNamespaceDescriptor.jsonTag)) {
        setInvalid("Specified target namespace descriptor object appears invalid.");
        break;
      }
      if (!((options_.strategy != null) && options_.strategy && (options_.strategy.length != null) && options_.strategy.length)) {
        setInvalid("Missing resolution strategy specification.");
        break;
      }
      strategyValid = true;
      switch (options_.strategy) {
        case 'open':
          break;
        case 'create':
          break;
        case 'negotiate':
          break;
        default:
          strategyValid = false;
          break;
      }
      if (!strategyValid) {
        setInvalid("Unrecognized resolution strategy specified.");
        break;
      }
      if ((options_.targetNamespaceKey != null) && options_.targetNamespaceKey) {
        if (!((options_.targetNamespaceKey.length != null) && options_.targetNamespaceKey.length)) {
          setInvalid("Invalid target namespace key specified.");
        }
      }
      if (!((options_.semanticBindingsReference != null) && options_.semanticBindingsReference)) {
        setInvalid("Missing semantic bindings reference.");
        break;
      }
      if (!((options_.propertyAssignmentObject != null) && options_.propertyAssignmentObject)) {
        setInvalid("Missing property assignment object.");
        break;
      }
      break;
    }
    if (!results.valid) {
      console.warn("Invalid named object input context object: '" + results.reason + "'.");
    }
    return results.valid;
  };

  namedObjectResolverContext.checkValidContextOutput = function(results_) {
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
      if (!((results_ != null) && results_)) {
        setInvalid("Missing results");
        break;
      }
      if (!((results_.resolvedId != null) && (results_.resolvedId >= 0))) {
        setInvalid("Invalid resolved namespace model ID.");
        break;
      }
      if (!((results_.namespaceEffectiveKey != null) && results_.namespaceEffectiveKey && (results_.namespaceEffectiveKey.length != null) && results_.namespaceEffectiveKey.length)) {
        setInvalid("Invalid namespaceEffectiveKey");
        break;
      }
      if (!((results_.namespaceDataReference != null) && results_.namespaceDataReference)) {
        setInvalid("Invalid namespaceDataReference");
        break;
      }
      if (!((results_.pendingResolutionStack != null) && results_.pendingResolutionStack && Array.isArray(results_.pendingResolutionStack))) {
        setInvalid("Invalid pendingResolutionStack");
        break;
      }
      if (!((results_.strategyFollowed != null) && results_.strategyFollowed)) {
        setInvalid("Invalid strategyFollowed");
        break;
      }
      switch (results_.strategyFollowed) {
        case 'open':
          break;
        case 'create':
          break;
        default:
          setInvalid("Invalid strategyFollowed value '" + results_.strategyFollowed + "'.");
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
