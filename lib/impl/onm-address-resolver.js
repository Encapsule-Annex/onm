
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
  var Address, addressResolver, componentResolver, helperFunctions;

  helperFunctions = require('./onm-util-functions');

  componentResolver = require('./onm-component-resolver');

  Address = require('../onm-address');

  module.exports = addressResolver = {};

  addressResolver.resolve = function(options_) {
    var changeEvent, componentResolutionContext, componentResolveOptions, componentsEvaluated, currentToken, dataChangeEventJournal, evaluatedTokenQueue, exception_, inputOptionsValid, message, norv, onResultVector, parentDataReference, pendingComponentResolutionOptions, pendingSubcomponent, resolvedAddressString, resolvedComponentVector, resolvedComponentWorkQueue, sourceTokenQueue, targetAddressString, token, unresolvedAddressString, _i, _j, _len, _len1, _ref, _ref1;
    inputOptionsValid = false;
    try {
      if (!((options_ != null) && options_)) {
        throw new Error("Missing options input parameter.");
      }
      if (!((options_.parentDataReference != null) && options_.parentDataReference)) {
        throw new Error("Missing options.parentDataReference parameter.");
      }
      if (!((options_.address != null) && options_.address)) {
        throw new Error("Missing options.address parameter.");
      }
      if (!((options_.strategy != null) && options_.strategy)) {
        throw new Error("Missing options.strategy parameter.");
      }
      if (!((options_.strategy === 'open') || (options_.strategy === 'create') || (options_.strategy === 'negotiate'))) {
        throw new Error("Unrecognized options.strategy value.");
      }
      inputOptionsValid = true;
      resolvedComponentVector = [];
      dataChangeEventJournal = [];
      sourceTokenQueue = [];
      evaluatedTokenQueue = [];
      _ref = options_.address.implementation.tokenVector;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        token = _ref[_i];
        sourceTokenQueue.push(token.clone());
      }
      resolvedComponentWorkQueue = [];
      currentToken = sourceTokenQueue.shift();
      componentResolveOptions = {
        strategy: (sourceTokenQueue.length === 0) && options_.strategy || 'negotiate',
        parentDataReference: options_.parentDataReference,
        addressToken: currentToken,
        semanticBindingsReference: options_.address.model.getSemanticBindings(),
        propertyAssignmentObject: (sourceTokenQueue.length === 0) && options_.propertyAssignmentObject || {},
        onVector: true
      };
      componentResolutionContext = {
        input: componentResolveOptions,
        output: componentResolver.resolve(componentResolveOptions)
      };
      resolvedComponentWorkQueue.push(componentResolutionContext);
      componentsEvaluated = 0;
      while (resolvedComponentWorkQueue.length) {
        componentResolutionContext = resolvedComponentWorkQueue.shift();
        _ref1 = componentResolutionContext.output.dataChangeEventJournal;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          changeEvent = _ref1[_j];
          dataChangeEventJournal.push(changeEvent);
        }
        onResultVector = (componentResolutionContext.input.onVector != null) && componentResolutionContext.input.onVector || false;
        if (onResultVector) {
          resolvedComponentVector.push(componentResolutionContext);
          evaluatedTokenQueue.push(componentResolutionContext.input.addressToken);
        }
        if ((!onResultVector) || (sourceTokenQueue.length === 0)) {
          while (componentResolutionContext.output.pendingSubcomponentStack.length) {
            pendingSubcomponent = componentResolutionContext.output.pendingSubcomponentStack.pop();
            pendingSubcomponent.onVector = false;
            resolvedComponentWorkQueue.push({
              input: pendingSubcomponent,
              output: componentResolver.resolve(pendingSubcomponent)
            });
          }
          continue;
        }
        if (componentResolutionContext.input.addressToken.namespaceDescriptor.namespaceType !== 'extensionPoint') {
          throw new Error("Internal consistency check error: expected the most-recently resolved component namespace type to be an extension point.");
        }
        if (componentResolutionContext.input.addressToken.idNamespace !== sourceTokenQueue[0].idExtensionPoint) {
          throw new Error("Internal consistency check error: unexpected component found at the head of the source token queue.");
        }
        if (componentResolutionContext.output.pendingSubcomponentStack.length && (sourceTokenQueue.length !== 1)) {
          throw new Error("Internal consistency check error: unexpected pending subcomponent stack size. should be empty.");
        }
        norv = componentResolutionContext.output.namedObjectResolutionVector;
        parentDataReference = norv[norv.length - 1].output.namespaceDataReference;
        if (!componentResolutionContext.output.pendingSubcomponentStack.length) {
          currentToken = sourceTokenQueue.shift();
          componentResolveOptions = {
            strategy: (sourceTokenQueue.length === 0) && options_.strategy || 'negotiate',
            parentDataReference: parentDataReference,
            addressToken: currentToken,
            semanticBindingsReference: options_.address.model.getSemanticBindings(),
            propertyAssignmentObject: (sourceTokenQueue.length === 0) && options_.propertyAssignmentObject || {},
            onVector: true
          };
          resolvedComponentWorkQueue.push({
            input: componentResolveOptions,
            output: componentResolver.resolve(componentResolveOptions)
          });
        } else {
          while (componentResolutionContext.output.pendingSubcomponentStack.length) {
            pendingComponentResolutionOptions = componentResolutionContext.output.pendingSubcomponentStack.pop();
            pendingComponentResolutionOptions.onVector = true;
            pendingComponentResolutionOptions.propertyAssignmentObject = (sourceTokenQueue.length === 0) && options_.propertyAssignmentObject || {};
            resolvedComponentWorkQueue.push({
              input: pendingComponentResolutionOptions,
              output: componentResolver.resolve(pendingComponentResolutionOptions)
            });
          }
        }
      }
      if (sourceTokenQueue.length) {
        throw new Error("Internal consistency check error: unexpected address resolver exit with non-empty source token queue.");
      }
      if (resolvedComponentVector.length !== options_.address.implementation.tokenVector.length) {
        throw new Error("Internal consistency check error: unexpected address resolver exit with too few resolved components.");
      }
      return {
        resolvedComponentVector: resolvedComponentVector,
        dataChangeEventJournal: dataChangeEventJournal
      };
    } catch (_error) {
      exception_ = _error;
      if (!inputOptionsValid) {
        message = "addressResolver failed in function prologue: " + exception_.message;
      } else {
        targetAddressString = options_.address.getHumanReadableString();
        resolvedAddressString = evaluatedTokenQueue.length && (new Address(options_.address.model, evaluatedTokenQueue).getHumanReadableString()) || '';
        unresolvedAddressString = targetAddressString.substring(resolvedAddressString.length, targetAddressString.length);
        message = "addressResolver.resolve failed to resolve '" + resolvedAddressString + ">>" + unresolvedAddressString + "<<' via strategy '" + options_.strategy + "':: " + exception_.message;
      }
      throw new Error(message);
    }
  };

  addressResolver.getResolvedNamedObjectReference = function(resolvedAddressObject_) {
    var exception_, resolvedComponentContext, resolvedComponentCount;
    try {
      if (!((resolvedAddressObject_ != null) && resolvedAddressObject_)) {
        throw new Error("Missing resolved address context object in-parameter.");
      }
      resolvedComponentCount = resolvedAddressObject_.resolvedComponentVector.length;
      if (!resolvedComponentCount) {
        throw new Error("Cannot extract a named object reference from resolved address context object because it contains no resolved components.");
      }
      resolvedComponentContext = resolvedAddressObject_.resolvedComponentVector[resolvedComponentCount - 1];
      return componentResolver.getResolvedNamedObjectReference(resolvedComponentContext);
    } catch (_error) {
      exception_ = _error;
      throw new Error("addressResolver.getResolvedNamedObjectReference failed: " + exception_.message);
    }
  };

  addressResolver.getResolvedTokenVector = function(resolvedAddressObject_) {
    var exception_, resolvedComponentContext, resolvedTokenVector, _i, _len, _ref;
    try {
      resolvedTokenVector = [];
      if (!((resolvedAddressObject_ != null) && resolvedAddressObject_)) {
        throw new Error("Missing resolved address context object in-parameter.");
      }
      _ref = resolvedAddressObject_.resolvedComponentVector;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        resolvedComponentContext = _ref[_i];
        resolvedTokenVector.push(componentResolver.getResolvedToken(resolvedComponentContext));
      }
      return resolvedTokenVector;
    } catch (_error) {
      exception_ = _error;
      throw new Error("addressResolver.getResolvedTokenVector failed: " + exception_.message);
    }
  };

}).call(this);
