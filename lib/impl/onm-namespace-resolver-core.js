
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
  var namespaceResolver, util;

  util = require('../lib-javascript');

  module.exports = namespaceResolver = {};

  namespaceResolver.helpers = {};

  namespaceResolver.visitor = {};

  namespaceResolver.resolve = function(visitorInterface_, context_) {
    var exception_, message, result, state;
    state = '0:0::start';
    try {
      result = true;
      state = '0:5::prepareContext';
      result = result && namespaceResolver.visitor.initializeContext(visitorInterface_, context_);
      state = '1:5::dereferenceNamedObject';
      result = result && namespaceResolver.visitor.dereferenceNamedObject(visitorInterface_, context_);
      state = '2:5::visitNamespaceProperties';
      result = result && namespaceResolver.visitor.visitNamespaceProperties(visitorInterface_, context_);
      state = '3:5::visitNamespaceChildren';
      result = result && namespaceResolver.visitor.visitNamespaceChildren(visitorInterface_, context_);
      state = '4:5::processPropertyOptions';
      result = result && namespaceResolver.visitor.processPropertyOptions(visitorInterface_, context_);
      state = '5:5::finalizeContext';
      result = result && namespaceResolver.visitor.finalizeContext(visitorInterface_, context_);
      return context_.output;
    } catch (_error) {
      exception_ = _error;
      message = "resolveNamespaceDescriptor failed in state '" + state + "' while executing policy '" + visitorInterface_.policyName + "': " + exception_.message;
      throw new Error(message);
    }
  };

  namespaceResolver.visitor.initializeContext = function(visitorInterface_, context_) {
    namespaceResolver.helpers.initializeContextObject(context_);
    return visitorInterface_.initializeContext(context_);
  };

  namespaceResolver.visitor.dereferenceNamedObject = function(visitorInterface_, context_) {
    return visitorInterface_.dereferenceNamedObject(context_);
  };

  namespaceResolver.visitor.visitNamespaceProperties = function(visitorInterface_, context_) {
    var namespaceDescriptor, propertiesDeclaration, propertyDeclaration, propertyName, result, _ref, _ref1;
    if (!((visitorInterface_.processNamespaceProperty != null) && visitorInterface_.processNamespaceProperty)) {
      return true;
    }
    namespaceDescriptor = namespaceResolver.helpers.getNamespaceDescriptorFromContext(context_);
    if (namespaceDescriptor.namespaceType === 'extensionPoint') {
      return true;
    }
    result = true;
    propertiesDeclaration = namespaceDescriptor.namespaceModelPropertiesDeclaration;
    if ((propertiesDeclaration.userImmutable != null) && propertiesDeclaration.userImmutable) {
      _ref = propertiesDeclaration.userImmutable;
      for (propertyName in _ref) {
        propertyDeclaration = _ref[propertyName];
        if (!result) {
          break;
        }
        result = visitorInterface_.processNamespaceProperty(context_, propertyName, propertyDeclaration);
      }
    }
    if ((propertiesDeclaration.userMutable != null) && propertiesDeclaration.userMutable) {
      _ref1 = propertiesDeclaration.userMutable;
      for (propertyName in _ref1) {
        propertyDeclaration = _ref1[propertyName];
        if (!result) {
          break;
        }
        result = visitorInterface_.processNamespaceProperty(context_, propertyName, propertyDeclaration);
      }
    }
    return result;
  };

  namespaceResolver.visitor.visitNamespaceChildren = function(visitorInterface_, context_) {
    var childNamespaceDescriptor, namespaceDescriptor, result, _i, _len, _ref;
    if (!((visitorInterface_.processSubnamespace != null) && visitorInterface_.processSubnamespace)) {
      return true;
    }
    result = true;
    namespaceDescriptor = namespaceResolver.helpers.getNamespaceDescriptorFromContext(context_);
    _ref = namespaceDescriptor.children;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      childNamespaceDescriptor = _ref[_i];
      if (!result) {
        break;
      }
      result = visitorInterface_.processSubnamespace(context_, childNamespaceDescriptor);
    }
    return result;
  };

  namespaceResolver.visitor.processPropertyOptions = function(visitorInterface_, context_) {
    return (visitorInterface_.processPropertyOptions != null) && visitorInterface_.processPropertyOptions && visitorInterface_.processPropertyOptions(context_) || true;
  };

  namespaceResolver.visitor.finalizeContext = function(visitorInterface_, context_) {
    return (visitorInterface_.finalizeContext != null) && visitorInterface_.finalizeContext && visitorInterface_.finalizeContext(context_) || true;
  };

  namespaceResolver.helpers.initializeContextObject = function(context_) {
    context_.input = {
      parentDataReference: context_.input.parentDataReference,
      targetNamespaceDescriptor: context_.input.targetNamespaceDescriptor,
      targetNamespaceKey: context_.input.targetNamespaceKey,
      semanticBindingsReference: context_.input.semanticBindingsReference,
      propertyAssignmentObject: (context_.input.propertyAssignmentObject != null) && context_.input.propertyAssignmentObject && util.clone(context_.input.propertyAssignmentObject) || {}
    };
    context_.output = {
      namespaceEffectiveKey: null,
      namespaceDataReference: null,
      dataChangeEventJournal: [],
      pendingNamespaceDescriptors: []
    };
    return context_;
  };

  namespaceResolver.helpers.getNamespaceDescriptorFromContext = function(context_) {
    return context_.input.targetNamespaceDescriptor;
  };

  namespaceResolver.helpers.checkValidDescriptorResolveOptions = function(options_, isOpenResolve_) {
    var keyValid;
    if (!((options_ != null) && options_)) {
      console.log("Missing options.");
      return false;
    }
    if (!((options_.parentDataReference != null) && options_.parentDataReference)) {
      console.log("Invalid parentDataReference.");
      return false;
    }
    if (!((options_.targetNamespaceDescriptor != null) && options_.targetNamespaceDescriptor)) {
      console.log("Invalid targetNamespaceDescriptor.");
      return false;
    }
    if (!((options_.targetNamespaceDescriptor.jsonTag != null) && options_.targetNamespaceDescriptor.jsonTag)) {
      console.log("Invalid targetNamespaceDescriptor.");
      return false;
    }
    if ((isOpenResolve_ != null) && isOpenResolve_) {
      return true;
    }
    keyValid = true;
    if ((options_.targetNamespaceKey != null) && options_.targetNamespaceKey) {
      keyValid = options_.targetNamespaceKey.length > 0 || false;
    }
    if (!keyValid) {
      console.log("Invalid targetNamespaceKey.");
      return false;
    }
    if (!((options_.semanticBindingsReference != null) && options_.semanticBindingsReference)) {
      console.log("Invalid semanticBindingsReference.");
      return false;
    }
    if (!((options_.propertyAssignmentObject != null) && options_.propertyAssignmentObject)) {
      console.log("Invalid propertyAsssignmentObject.");
      return false;
    }
    return true;
  };

  namespaceResolver.helpers.checkValidDescriptorResolveResults = function(results_) {
    return (results_ != null) && results_ && (results_.namespaceEffectiveKey != null) && results_.namespaceEffectiveKey && (results_.namespaceDataReference != null) && results_.namespaceDataReference && (results_.pendingNamespaceDescriptors != null) && results_.pendingNamespaceDescriptors && Array.isArray(results_.pendingNamespaceDescriptors) && true || false;
  };

}).call(this);
