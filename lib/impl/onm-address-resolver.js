
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
    var componentResolutionQueue, componentResolutionStack, componentResolveOptions, currentComponentResolution, evaluatingComponentId, exception_, lookingForComponentId, sourceTokenQueue, token, _i, _len, _ref, _results;
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
      sourceTokenQueue = [];
      componentResolutionStack = [];
      componentResolutionQueue = [];
      _ref = options_.address.implementation.tokenVector;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        token = _ref[_i];
        sourceTokenQueue.push(token.clone());
      }
      componentResolveOptions = {
        strategy: options_.strategy,
        parentDataReference: options_.parentDataReference,
        addressToken: sourceTokenQueue[0],
        semanticBindingsReference: options_.address.model,
        propertyAssignmentObject: options_.propertyAssignmentObject
      };
      componentResolutionStack.push(resolveComponent(componentResolveOptions));
      _results = [];
      while (componentResolutionStack.length) {
        currentComponentResolution = componentResolutionStack.pop();
        lookingForComponentId = sourceTokenQueue[0].idComponent;
        evaluatingComponentId = currentComponentResolution.output.namedObjectResolutionVector[0].resolvedId;
        if (currentComponentResolution.output.namedObjectResolutionVector[0].resolvedId === lookingForComponentId) {
          sourceTokenQueue.shift();
          _results.push(componentResolutionQueue.push(currentComponentResolution));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    } catch (_error) {
      exception_ = _error;
      throw new Error("resolveAddress failed: " + exception_.message);
    }
  };

}).call(this);
