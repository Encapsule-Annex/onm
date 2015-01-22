
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
  var helperFunctions, resolveAddress, resolveComponent, resolveNamedObject;

  helperFunctions = require('./onm-util-functions');

  resolveNamedObject = require('./onm-named-object-resolver');

  resolveComponent = require('./onm-component-resolver');

  module.exports = resolveAddress = function(options_) {
    var componentResolutionContext, componentResolveOptions, descriptorID, exception_, headExtensionPointId, lastSourceTokenResolved, nextOnVectorComponentUnderExtensionPointId, onResultVector, pendingSubcomponent, resolvedComponentVector, resolvedComponentWorkQueue, sourceTokenQueue, token, _i, _len, _ref;
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
      resolvedComponentVector = [];
      sourceTokenQueue = [];
      _ref = options_.address.implementation.tokenVector;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        token = _ref[_i];
        sourceTokenQueue.push(token.clone());
      }
      lastSourceTokenResolved = void 0;
      componentResolveOptions = {
        strategy: options_.strategy,
        parentDataReference: options_.parentDataReference,
        addressToken: sourceTokenQueue.shift(),
        semanticBindingsReference: options_.address.model.getSemanticBindings(),
        propertyAssignmentObject: options_.propertyAssignmentObject,
        onVector: true
      };
      componentResolutionContext = {
        input: componentResolveOptions,
        output: resolveComponent(componentResolveOptions)
      };
      resolvedComponentWorkQueue = [];
      resolvedComponentWorkQueue.push(componentResolutionContext);
      while (resolvedComponentWorkQueue.length) {
        componentResolutionContext = resolvedComponentWorkQueue.shift();
        onResultVector = (componentResolutionContext.input.onVector != null) && componentResolutionContext.input.onVector || false;
        if (onResultVector) {
          resolvedComponentVector.push(componentResolutionContext);
        }
        if ((!onResultVector) || (sourceTokenQueue.length === 0)) {
          while (componentResolutionContext.output.pendingSubcomponentStack.length) {
            pendingSubcomponent = componentResolutionContext.output.pendingSubcomponentStack.pop();
            componentResolutionContext = {
              input: pendingSubcomponent,
              output: resolveComponent(pendingSubcomponent)
            };
            resolvedComponentWorkQueue.push(componentResolutionContext);
          }
          continue;
        }
        console.log("Hit the case I'm interested in.");
        descriptorID = componentResolutionContext.input.addressToken.idNamespace;
        headExtensionPointId = componentResolutionContext.input.addressToken.idNamespace;
        nextOnVectorComponentUnderExtensionPointId = sourceTokenQueue[0].idExtensionPoint;
        if (headExtensionPointId !== nextOnVectorCompoenntUnderExtensionPointId) {
          while (componentResolutionContext.output.pendingSubcomponentStack.length) {
            pendingSubcomponent = componentResolutionContext.output.pendingSubcomponentStack.pop();
            componentResolutionContext = {
              input: pendingSubcomponent,
              output: resolveComponent(pendingSubcomponent)
            };
            resolvedComponentWorkQueue.push(componentResolutionContext);
          }
          continue;
        }
        while (componentResolutionContext.output.pendingSubcomponentStack.length) {
          pendingSubcomponent = componentResolutionContext.output.pendingSubcomponentStack.pop();
        }
      }
      return true;
    } catch (_error) {
      exception_ = _error;
      throw new Error("resolveAddress failed: " + exception_.message);
    }
  };

}).call(this);
