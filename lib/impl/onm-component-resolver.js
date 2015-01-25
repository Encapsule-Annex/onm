
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
  var AddressToken, componentContextHelpers, componentResolver, createNamedObjectResolutionContext, namedObjectResolver;

  AddressToken = require('./onm-address-token');

  namedObjectResolver = require('./onm-named-object-resolver');

  componentContextHelpers = require('./onm-component-context');

  module.exports = componentResolver = {};

  componentResolver.resolve = function(options_) {
    var changeEvent, componentResolveOptions, context, dataChangeEventJournal, exception_, message, namedObjectResolution, namedObjectResolutionContext, namedObjectResolutionStack, namedObjectResolveOptions, pendingAddressToken, pendingSubcomponentStack, resolvedOnVector, _i, _len, _ref;
    try {
      if (!componentContextHelpers.checkValidContextInput(options_)) {
        throw new Error("Invalid options in-parameter.");
      }
      context = componentContextHelpers.initializeContextObject(options_);
      namedObjectResolutionContext = createNamedObjectResolutionContext(context.input.addressToken);
      namedObjectResolutionStack = [];
      pendingSubcomponentStack = [];
      dataChangeEventJournal = [];
      namedObjectResolveOptions = {
        strategy: context.input.strategy,
        parentDataReference: context.input.parentDataReference,
        targetNamespaceDescriptor: context.input.addressToken.componentDescriptor,
        targetNamespaceKey: context.input.addressToken.key,
        semanticBindingsReference: context.input.semanticBindingsReference,
        propertyAssignmentObject: (context.input.addressToken.idComponent === context.input.addressToken.idNamespace) && context.input.propertyAssignmentObject || {}
      };
      namedObjectResolutionStack.push({
        input: namedObjectResolveOptions,
        output: namedObjectResolver.resolve(namedObjectResolveOptions)
      });
      while (namedObjectResolutionStack.length) {
        namedObjectResolution = namedObjectResolutionStack.pop();
        resolvedOnVector = namedObjectResolutionContext.resultVector[namedObjectResolution.output.resolvedId];
        if (resolvedOnVector !== void 0) {
          namedObjectResolutionContext.resultVector[namedObjectResolution.output.resolvedId] = namedObjectResolutionContext.lastResolutionResult = namedObjectResolution;
          namedObjectResolutionContext.workQueue.shift();
        }
        _ref = namedObjectResolution.output.dataChangeEventJournal;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          changeEvent = _ref[_i];
          dataChangeEventJournal.push(changeEvent);
        }
        if (namedObjectResolution.output.pendingResolutionStack.length) {
          switch (namedObjectResolution.input.targetNamespaceDescriptor.namespaceType) {
            case 'extensionPoint':
              while (namedObjectResolution.output.pendingResolutionStack.length) {
                namedObjectResolveOptions = namedObjectResolution.output.pendingResolutionStack.pop();
                if ((namedObjectResolveOptions.strategy === 'open') && (context.input.strategy === 'negotiate')) {
                  namedObjectResolveOptions.strategy = 'negotiate';
                }
                pendingAddressToken = new AddressToken(context.input.addressToken.model, namedObjectResolution.output.resolvedId, namedObjectResolveOptions.targetNamespaceKey, namedObjectResolveOptions.targetNamespaceDescriptor.id);
                componentResolveOptions = {
                  strategy: namedObjectResolveOptions.strategy,
                  parentDataReference: namedObjectResolveOptions.parentDataReference,
                  addressToken: pendingAddressToken,
                  semanticBindingsReference: namedObjectResolveOptions.semanticBindingsReference,
                  propertyAssignmentObject: namedObjectResolveOptions.propertyAssignmentObject
                };
                pendingSubcomponentStack.push(componentResolveOptions);
              }
              break;
            default:
              while (namedObjectResolution.output.pendingResolutionStack.length) {
                namedObjectResolveOptions = namedObjectResolution.output.pendingResolutionStack.pop();
                if (namedObjectResolveOptions.targetNamespaceDescriptor.id === context.input.addressToken.idNamespace) {
                  if (Object.keys(namedObjectResolveOptions.propertyAssignmentObject).length > 0) {
                    throw new Error("Internal consistency check error: We do not expect property assignment data to be propogating below the target namespace during a component resolution.");
                  }
                  namedObjectResolveOptions.propertyAssignmentObject = context.input.propertyAssignmentObject;
                }
                namedObjectResolutionStack.push({
                  input: namedObjectResolveOptions,
                  output: namedObjectResolver.resolve(namedObjectResolveOptions)
                });
              }
              break;
          }
        }
        if ((!namedObjectResolutionStack.length) && namedObjectResolutionContext.workQueue.length) {
          namedObjectResolveOptions = {
            strategy: namedObjectResolutionContext.lastResolutionResult.output.strategyFollowed,
            parentDataReference: namedObjectResolutionContext.lastResolutionResult.output.namespaceDataReference,
            targetNamespaceDescriptor: namedObjectResolutionContext.workQueue[0],
            targetNamespaceKey: null,
            semanticBindingsReference: context.input.semanticBindingsReference,
            propertyAssignmentObject: {}
          };
          namedObjectResolutionStack.push({
            input: namedObjectResolveOptions,
            output: namedObjectResolver.resolve(namedObjectResolveOptions)
          });
        }
      }
      context.output.namedObjectResolutionVector = namedObjectResolutionContext.resultVector;
      context.output.pendingSubcomponentStack = pendingSubcomponentStack;
      context.output.dataChangeEventJournal = dataChangeEventJournal;
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

  createNamedObjectResolutionContext = function(addressToken_) {
    var id, idVector, namedObjectResolutionContext, targetDepth, _i, _len;
    targetDepth = addressToken_.namespaceDescriptor.parentPathIdVector.length - addressToken_.componentDescriptor.parentPathIdVector.length;
    idVector = addressToken_.namespaceDescriptor.parentPathIdVector.slice(addressToken_.componentDescriptor.parentPathIdVector.length, addressToken_.namespaceDescriptor.parentPathIdVector.length);
    idVector.push(addressToken_.namespaceDescriptor.id);
    namedObjectResolutionContext = {
      resultVector: [],
      workQueue: [],
      lastResolutionResult: null
    };
    for (_i = 0, _len = idVector.length; _i < _len; _i++) {
      id = idVector[_i];
      namedObjectResolutionContext.resultVector[id] = null;
      namedObjectResolutionContext.workQueue.push(addressToken_.model.implementation.getNamespaceDescriptorFromPathId(id));
    }
    return namedObjectResolutionContext;
  };

}).call(this);
