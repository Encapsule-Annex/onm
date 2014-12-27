
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
  var createPolicyBinding, implementation, namespaceResolverCore, oldImplementation, openPolicyBinding, resolveOpenNamespaceDescriptor, util;

  namespaceResolverCore = require('./onm-namespace-resolver-core');

  openPolicyBinding = require('./onm-namespace-resolver-open-policy');

  createPolicyBinding = require('./onm-namespace-resolver-create-policy');

  module.exports = {
    resolveNamespaceDescriptorOpen: function(options_) {
      var context;
      context = {
        options: options_
      };
      namespaceResolverCore.resolve(openPolicyBinding, context);
      return context.resolveResults;
    },
    resolveNamespaceDescriptorCreate: function(options_) {
      var context;
      context = {
        options: options_
      };
      namespaceResolverCore.resolve(createPolicyBinding, context);
      return context.resolveResults;
    }
  };

  implementation = require('./onm-namespace-resolver-impl');

  util = require('../../index').util;

  resolveOpenNamespaceDescriptor = require('./onm-namespace-resolver.open').resolveOpenNamespaceDescriptor;

  oldImplementation = {
    resolveNamespaceDescriptorOpen: function(options_) {
      var exception_, resolveResults, resourceString;
      try {
        if (!implementation.checkValidDescriptorResolveOptions(options_, true)) {
          throw new Error("Invalid descriptor resolve options.");
        }
        resolveResults = resolveOpenNamespaceDescriptor(options_);
        if (!((resolveResults.namespaceDataReference != null) && resolveResults.namespaceDataReference)) {
          resourceString = this.createResourceString(options_, resolveResults);
          throw new Error("Cannot open expected child object in data: " + resourceString);
        }
        return resolveResults;
      } catch (_error) {
        exception_ = _error;
        throw new Error("resolveNamespaceDescriptorOpen failure: " + exception_.message);
      }
    },
    resolveNamespaceDescriptorCreate: function(options_) {
      var childNamespaceDescriptor, deleteKeyNames, deleteKeys, effectiveKeyValue, effectiveValue, exception_, functions, keyName, memberName, pendingDescriptorResolveOptions, propertiesDeclaration, propertyAssignmentObject, propertyName, resolveResults, resourceString, subObject, subcomponentPropertyAssignmentObject, _i, _len, _ref, _ref1, _ref2;
      try {
        if (!implementation.checkValidDescriptorResolveOptions(options_)) {
          throw new Error("Invalid descriptor resolve options.");
        }
        resolveResults = resolveOpenNamespaceDescriptor(options_);
        if ((resolveResults.namespaceDataReference != null) && resolveResults.namespaceDataReference) {
          resourceString = this.createResourceString(options_, resolveResults);
          throw new Error("Child object already exists in data: " + resourceString);
        }
        effectiveKeyValue = ((options_.targetNamespaceDescriptor.namespaceType !== 'component') && options_.targetNamespaceDescriptor.jsonTag) || void 0;
        if (!((effectiveKeyValue != null) && effectiveKeyValue)) {
          effectiveKeyValue = options_.propertyAssignmentObject[options_.semanticBindingsReference.keyPropertyName];
          if ((effectiveKeyValue != null) && effectiveKeyValue) {
            if ((options_.targetNamespaceKey != null) && options_.targetNamespaceKey && options_.targetNamespaceKey.length && (effectiveKeyValue !== options_.targetNamespaceKey)) {
              throw new Error("Contradictory onm component key values '" + effectiveKeyValue + "' !== '" + options_.targetNamespaceKey + "'.");
            }
          } else {
            effectiveKeyValue = options_.targetNamespaceKey;
            if (!((effectiveKeyValue != null) && effectiveKeyValue && (effectiveKeyValue.length > 0))) {
              effectiveKeyValue = options_.semanticBindingsReference.setUniqueKey({});
            }
          }
        }
        resolveResults.namespaceEffectiveKey = (effectiveKeyValue != null) && effectiveKeyValue && effectiveKeyValue.length && effectiveKeyValue || (function() {
          throw new Error("INTERNAL ERROR deriving namespace effective key value.");
        })();
        resolveResults.namespaceDataReference = options_.parentDataReference[effectiveKeyValue] = {};
        if ((options_.targetNamespaceDescriptor.namespaceType === 'component') || (options_.targetNamespaceDescriptor.namespaceType === 'root')) {
          resolveResults.namespaceDataReference[options_.semanticBindingsReference.keyPropertyName] = effectiveKeyValue;
        }
        propertiesDeclaration = options_.targetNamespaceDescriptor.namespaceModelPropertiesDeclaration;
        propertyAssignmentObject = util.clone(options_.propertyAssignmentObject);
        if ((propertiesDeclaration.userImmutable != null) && propertiesDeclaration.userImmutable) {
          _ref = propertiesDeclaration.userImmutable;
          for (memberName in _ref) {
            functions = _ref[memberName];
            if (resolveResults.namespaceDataReference[memberName]) {
              continue;
            }
            effectiveValue = propertyAssignmentObject[memberName];
            if ((effectiveValue != null) && effectiveValue) {
              delete propertyAssignmentObject[memberName];
            } else {
              effectiveValue = ((functions.defaultValue != null) && functions.defaultValue) || ((functions.fnCreate != null) && functions.fnCreate && functions.fnCreate()) || (function() {
                throw new Error("Internal error: Unable to deduce initialization method from data model for property '" + memberName + "'.");
              })();
            }
            resolveResults.namespaceDataReference[memberName] = effectiveValue;
          }
        }
        if ((propertiesDeclaration.userMutable != null) && propertiesDeclaration.userMutable) {
          _ref1 = propertiesDeclaration.userMutable;
          for (memberName in _ref1) {
            functions = _ref1[memberName];
            if (resolveResults.namespaceDataReference[memberName]) {
              continue;
            }
            effectiveValue = propertyAssignmentObject[memberName];
            if ((effectiveValue != null) && effectiveValue) {
              delete propertyAssignmentObject[memberName];
            } else {
              if ((functions.fnCreate != null) && functions.fnCreate) {
                effectiveValue = functions.fnCreate();
              } else {
                effectiveValue = functions.defaultValue;
              }
            }
            resolveResults.namespaceDataReference[memberName] = effectiveValue;
          }
        }
        _ref2 = options_.targetNamespaceDescriptor.children;
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          childNamespaceDescriptor = _ref2[_i];
          switch (childNamespaceDescriptor.namespaceType) {
            case 'component':
              deleteKeyNames = [];
              for (keyName in propertyAssignmentObject) {
                subcomponentPropertyAssignmentObject = propertyAssignmentObject[keyName];
                pendingDescriptorResolveOptions = {
                  parentDataReference: resolveResults.namespaceDataReference,
                  targetNamespaceDescriptor: childNamespaceDescriptor,
                  targetNamespaceKey: keyName,
                  semanticBindingsReference: options_.semanticBindingsReference,
                  propertyAssignmentObject: (subcomponentPropertyAssignmentObject != null) && subcomponentPropertyAssignmentObject || {}
                };
                resolveResults.pendingNamespaceDescriptors.push(pendingDescriptorResolveOptions);
                deleteKeyNames.push(keyName);
              }
              while (deleteKeyNames.length) {
                delete propertyAssignmentObject[deleteKeyNames.pop()];
              }
              break;
            default:
              subcomponentPropertyAssignmentObject = (propertyAssignmentObject[childNamespaceDescriptor.jsonTag] != null) && propertyAssignmentObject[childNamespaceDescriptor.jsonTag] || {};
              pendingDescriptorResolveOptions = {
                parentDataReference: resolveResults.namespaceDataReference,
                targetNamespaceDescriptor: childNamespaceDescriptor,
                targetNamespaceKey: '',
                semanticBindingsReference: options_.semanticBindingsReference,
                propertyAssignmentObject: propertyAssignmentObject[childNamespaceDescriptor.jsonTag]
              };
              resolveResults.pendingNamespaceDescriptors.push(pendingDescriptorResolveOptions);
              delete propertyAssignmentObject[childNamespaceDescriptor.jsonTag];
              break;
          }
        }
        deleteKeys = [];
        for (propertyName in propertyAssignmentObject) {
          subObject = propertyAssignmentObject[propertyName];
          resolveResults.namespaceDataReference[propertyName] = subObject;
          deleteKeys.push(propertyName);
        }
        while (deleteKeys.length) {
          delete propertyAssignmentObject[deleteKeys.pop()];
        }
        return resolveResults;
      } catch (_error) {
        exception_ = _error;
        throw new Error("resolveNamespaceDescriptorCreate failure on decriptor '" + options_.targetNamespaceDescriptor.jsonTag + "': " + exception_.message);
      }
    }
  };

}).call(this);
