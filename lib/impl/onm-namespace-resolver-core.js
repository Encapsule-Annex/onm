
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
  var namespaceResolver, util, visitorInterfaces;

  util = require('../lib-javascript');

  module.exports = namespaceResolver = {};

  namespaceResolver.helpers = {};

  namespaceResolver.visitor = {};

  visitorInterfaces = {
    open: require('./onm-namespace-resolver-policy-open'),
    create: require('./onm-namespace-resolver-policy-create')
  };

  namespaceResolver.resolve = function(context_) {
    var exception_, message, result, selectedVisitorInterface, state;
    state = 'start';
    try {
      result = true;
      state = 'prepareContext';
      namespaceResolver.helpers.initializeContextObject(context_);
      state = 'dereferenceNamedObject';
      result = result && namespaceResolver.visitor.dereferenceNamedObject(context_);
      selectedVisitorInterface = visitorInterfaces[context_.output.resolutionStrategy];
      if (!((selectedVisitorInterface != null) && selectedVisitorInterface)) {
        throw new Error("Internal error determining named object property initialization strategy.");
      }
      state = 'visitNamespaceProperties';
      result = result && namespaceResolver.visitor.visitNamespaceProperties(selectedVisitorInterface, context_);
      state = 'visitNamespaceChildren';
      result = result && namespaceResolver.visitor.visitNamespaceChildren(selectedVisitorInterface, context_);
      state = 'processPropertyOptions';
      result = result && namespaceResolver.visitor.processPropertyOptions(selectedVisitorInterface, context_);
      state = 'finalizeContext';
      result = result && namespaceResolver.visitor.finalizeContext(selectedVisitorInterface, context_);
      return context_.output;
    } catch (_error) {
      exception_ = _error;
      message = "resolveNamespaceDescriptor failed in state '" + state + "' while executing policy '" + selectedVisitorInterface.policyName + "': " + exception_.message;
      throw new Error(message);
    }
  };

  namespaceResolver.visitor.dereferenceNamedObject = function(context_) {
    var descriptor, effectiveKey, input, message, output;
    input = context_.input;
    output = context_.output;
    output.resolutionStrategy = 'error';
    descriptor = input.targetNamespaceDescriptor;
    output.namespaceEffectiveKey = effectiveKey = (descriptor.namespaceType !== 'component') && descriptor.jsonTag || input.targetNamespaceKey;
    output.namespaceDataReference = input.parentDataReference[effectiveKey];
    switch (input.strategy) {
      case 'open':
        if (!((output.namespaceDataReference != null) && output.namespaceDataReference)) {
          switch (descriptor.namespaceType) {
            case 'component':
              message = "Cannot open named object '" + effectiveKey + "' for component namespace '" + descriptor.jsonTag + "'. Object does not exist.";
              break;
            default:
              message = "Cannot open named object for " + descriptor.namespaceType + " namespace '" + descriptor.jsonTag + "'. Object does not exist.";
              break;
          }
          throw new Error(message);
        }
        output.resolutionStrategy = 'open';
        break;
      case 'create':
        if ((output.namespaceDataReference != null) && output.namespaceDataReference) {
          switch (descriptor.namespaceType) {
            case 'component':
              message = "Cannot create named object '" + effectiveKey + "' for component namespace '" + descriptor.jsonTag + "'. Object already exists.";
              break;
            default:
              message = "Cannot create named object for " + descriptor.namespaceType + " namespace '" + descriptor.jsonTag + "'. Object already exists.";
              break;
          }
          throw new Error(message);
        }
        output.resolutionStrategy = 'create';
        break;
      case 'negotiate':
        output.resolutionStrategy = (output.namespaceDataReference != null) && output.namespaceDataReference && 'open' || 'create';
        break;
      default:
        throw new Error("Unrecognized named object dereference strategy '" + input.strategy + "'.");
    }
    if (output.resolutionStrategy === 'create') {
      if (!((effectiveKey != null) && effectiveKey && effectiveKey.length > 0)) {
        output.namespaceEffectiveKey = effectiveKey = input.semanticBindingsReference.setUniqueKey({});
      }
      output.namespaceDataReference = input.parentDataReference[effectiveKey] = {};
      output.dataChangeEventJournal.push({
        layer: 'namespace',
        event: 'namespaceCreated',
        eventData: {
          namespaceType: descriptor.namespaceType,
          jsonTag: descriptor.jsonTag,
          key: effectiveKey
        }
      });
    }
    return true;
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
      strategy: (context_.input.strategy != null) && context_.input.strategy || 'error',
      parentDataReference: context_.input.parentDataReference,
      targetNamespaceDescriptor: context_.input.targetNamespaceDescriptor,
      targetNamespaceKey: context_.input.targetNamespaceKey,
      semanticBindingsReference: context_.input.semanticBindingsReference,
      propertyAssignmentObject: (context_.input.propertyAssignmentObject != null) && context_.input.propertyAssignmentObject && util.clone(context_.input.propertyAssignmentObject) || {}
    };
    context_.output = {
      resolutionStrategy: 'error',
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
    if (!((results_ != null) && results_)) {
      console.log("Missing results");
      return false;
    }
    if (!((results_.namespaceEffectiveKey != null) && results_.namespaceEffectiveKey)) {
      console.log("Invalid namespaceEffectiveKey");
      return false;
    }
    if (!((results_.namespaceDataReference != null) && results_.namespaceDataReference)) {
      console.log("Invalid namespaceDataReference");
      return false;
    }
    if (!((results_.pendingNamespaceDescriptors != null) && results_.pendingNamespaceDescriptors && Array.isArray(results_.pendingNamespaceDescriptors))) {
      console.log("Invalid pendingNamespaceDescriptors");
      return false;
    }
    return true;
  };

}).call(this);
