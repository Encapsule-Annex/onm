
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
    var addressToken, componentResolutionContext, componentResolutionContextInner, componentResolveOptions, componentsEvaluated, exception_, lastSourceTokenResolved, norv, onResultVector, parentDataReference, pendingSubcomponent, resolvedComponentVector, resolvedComponentWorkQueue, sourceTokenQueue, token, _i, _len, _ref;
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
      resolvedComponentWorkQueue = [];
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
      resolvedComponentWorkQueue.push(componentResolutionContext);
      componentsEvaluated = 0;
      while (resolvedComponentWorkQueue.length) {
        console.log("----------------------------------------------------------------------------");
        console.log("ADDRESS RESOLVE COMPONENT " + (++componentsEvaluated) + ":");
        console.log(JSON.stringify(options_.parentDataReference, void 0, 4));
        componentResolutionContext = resolvedComponentWorkQueue.shift();
        onResultVector = (componentResolutionContext.input.onVector != null) && componentResolutionContext.input.onVector || false;
        if (onResultVector) {
          resolvedComponentVector.push(componentResolutionContext);
        }
        if ((!onResultVector) || (sourceTokenQueue.length === 0)) {
          while (componentResolutionContext.output.pendingSubcomponentStack.length) {
            pendingSubcomponent = componentResolutionContext.output.pendingSubcomponentStack.pop();
            pendingSubcomponent.onVector = false;
            componentResolutionContext = {
              input: pendingSubcomponent,
              output: resolveComponent(pendingSubcomponent)
            };
            resolvedComponentWorkQueue.push(componentResolutionContext);
          }
          continue;
        }
        console.log("Hit the case I'm interested in.");
        if (componentResolutionContext.input.addressToken.namespaceDescriptor.namespaceType !== 'extensionPoint') {
          throw new Error("Internal consistency check error: expected the most-recently resolved component namespace type to be an extension point.");
        }
        if (componentResolutionContext.input.addressToken.idNamespace !== sourceTokenQueue[0].idExtensionPoint) {
          throw new Error("Internal consistency check error: unexpected component found at the head of the source token queue.");
        }
        if (componentResolutionContext.output.pendingSubcomponentStack.length && (sourceTokenQueue.length !== 1)) {
          throw new Error("Internal consistency check error: unexpected pending subcomponent stack size. should be empty.");
        }
        addressToken = sourceTokenQueue.shift();
        norv = componentResolutionContext.output.namedObjectResolutionVector;
        parentDataReference = norv[norv.length - 1].output.namespaceDataReference;
        if (!componentResolutionContext.output.pendingSubcomponentStack.length) {
          componentResolveOptions = {
            strategy: options_.strategy,
            parentDataReference: parentDataReference,
            addressToken: addressToken,
            semanticBindingsReference: options_.address.model.getSemanticBindings(),
            propertyAssignmentObject: {},
            onVector: true
          };
          componentResolutionContextInner = {
            input: componentResolveOptions,
            output: resolveComponent(componentResolveOptions)
          };
          resolvedComponentWorkQueue.push(componentResolutionContextInner);
        } else {
          console.log("Hit the case I'm interested in.");
        }
      }
      console.log("----------------------------------------------------------------------------");
      if (sourceTokenQueue.length) {
        throw new Error("Internal consistency check error: unexpected address resolver exit with non-empty source token queue.");
      }
      if (resolvedComponentVector.length !== options_.address.implementation.tokenVector.length) {
        throw new Error("Internal consistency check error: unexpected address resolver exit with too few resolved components.");
      }
      console.log("----------------------------------------------------------------------------");
      console.log("FINAL:");
      console.log(JSON.stringify(options_.parentDataReference, void 0, 4));
      console.log("----------------------------------------------------------------------------");
      return true;
    } catch (_error) {
      exception_ = _error;
      throw new Error("resolveAddress failed: " + exception_.message);
    }
  };

}).call(this);
