
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
  var componentContextHelpers, initializeNamedObjectResolutionVectorFromToken, resolveComponent, resolveNamedObject;

  resolveNamedObject = require('./onm-named-object-resolver');

  componentContextHelpers = require('./onm-component-context');

  module.exports = resolveComponent = function(options_) {
    var context, dataChangeEventJournal, exception_, message, namedObjectPendingQueue, namedObjectResolution, namedObjectResolutionQueue, namedObjectResolutionVector, namedObjectResolveOptions, resolvedOnVector, targetNamedObjectResolutionResult;
    try {
      if (!componentContextHelpers.checkValidContextInput(options_)) {
        throw new Error("Invalid options in-parameter.");
      }
      context = componentContextHelpers.initializeContextObject(options_);
      namedObjectResolutionVector = initializeNamedObjectResolutionVectorFromToken(context.input.addressToken);
      namedObjectResolutionQueue = [];
      namedObjectPendingQueue = [];
      dataChangeEventJournal = [];
      targetNamedObjectResolutionResult = null;
      namedObjectResolveOptions = {
        strategy: context.input.strategy,
        parentDataReference: context.input.parentDataReference,
        targetNamespaceDescriptor: context.input.addressToken.componentDescriptor,
        targetNamespaceKey: context.input.addressToken.key,
        semanticBindingsReference: context.input.semanticBindingsReference,
        propertyAssignmentObject: (context.input.addressToken.idComponent === context.input.addressToken.idNamespace) && context.input.propertyAssignmentObject || {}
      };
      namedObjectResolutionQueue.push({
        input: namedObjectResolveOptions,
        output: resolveNamedObject(namedObjectResolveOptions)
      });
      while (namedObjectResolutionQueue.length) {
        namedObjectResolution = namedObjectResolutionQueue.pop();
        resolvedOnVector = namedObjectResolutionVector[namedObjectResolution.output.resolvedId];
        if ((resolvedOnVector != null) && resolvedOnVector) {
          namedObjectResolutionVector[namedObjectResolution.output.resolvedId] = namedObjectResolution;
        }
        dataChangeEventJournal.push(namedObjectResolution.output.dataChangeEventJournal);
        if (namedObjectResolution.output.pendingNamespaceDescriptors.length) {
          if (namedObjectResolution.input.targetNamespaceDescriptor.namespaceType !== 'extensionPoint') {
            while (namedObjectResolution.output.pendingNamespaceDescriptors.length) {
              namedObjectResolveOptions = namedObjectResolution.output.pendingNamespaceDescriptors.pop();
              namedObjectResolutionQueue.push({
                input: namedObjectResolveOptions,
                output: resolveNamedObject(namedObjectResolveOptions)
              });
            }
          } else {
            while (namedObjectResolution.output.pendingNamespaceDescriptors.length) {
              namedObjectPendingQueue.push(namedObjectResolution.output.pendingNamespaceDescriptors.pop());
            }
          }
        }
      }
      console.log(JSON.stringify(dataChangeEventJournal));
      if (!componentContextHelpers.checkValidContextOutput(context.output)) {
        throw new Error("Internal test case failure: context.output object validation failed.");
      }
      return context.output;
    } catch (_error) {
      exception_ = _error;
      message = "resolveComponent exception occurred during execution of strategy '" + options_.strategy + "': '" + exception_.message + "'.";
      throw new Error(message);
    }
  };

  initializeNamedObjectResolutionVectorFromToken = function(addressToken_) {
    var id, idVector, resolutionVector, targetDepth, _i, _len;
    targetDepth = addressToken_.namespaceDescriptor.parentPathIdVector.length - addressToken_.componentDescriptor.parentPathIdVector.length;
    idVector = addressToken_.namespaceDescriptor.parentPathIdVector.slice(-targetDepth);
    idVector.push(addressToken_.namespaceDescriptor.id);
    resolutionVector = [];
    for (_i = 0, _len = idVector.length; _i < _len; _i++) {
      id = idVector[_i];
      resolutionVector[id] = {};
    }
    return resolutionVector;
  };

}).call(this);
