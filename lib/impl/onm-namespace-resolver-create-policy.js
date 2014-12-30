
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
  var policyCommon;

  policyCommon = require('./onm-namespace-resolver-policy-common');

  module.exports = {

    /* create new namespace policy implementation
    - create new namespace
    - throw if namespace already exists
    - initialize all declared namespace properties to value (first):
      1. caller-provided value
      2. declared default value
    - visit declared subnamespaces and queue deferred resolves based on data model and caller-supplied data
    - overlay namespace data with remaining, caller-provided properties
     */
    policyName: 'create new namespace',
    initializeContext: function(context_, options_) {
      policyCommon.initializeContextInput(context_, options_);
      policyCommon.initializeContextOutput(context_);
      return true;
    },
    dereferenceNamedObject: function(context_) {
      var descriptor, effectiveKey, message, resolveResults;
      descriptor = context_.input.targetNamespaceDescriptor;
      resolveResults = context_.output;
      resolveResults.namespaceEffectiveKey = effectiveKey = (descriptor.namespaceType !== 'component') && descriptor.jsonTag || context_.input.targetNamespaceKey;
      resolveResults.namespaceDataReference = context_.input.parentDataReference[effectiveKey];
      if ((resolveResults.namespaceDataReference != null) && resolveResults.namespaceDataReference) {
        message = "Cannot re-create named object '" + effectiveKey + "' for data model path '" + descriptor.path + "'.";
        throw new Error(message);
      }
      if (!((effectiveKey != null) && effectiveKey && effectiveKey.length > 0)) {
        resolveResults.namespaceEffectiveKey = effectiveKey = context_.input.semanticBindingsReference.setUniqueKey({});
      }
      resolveResults.namespaceDataReference = context_.input.parentDataReference[effectiveKey] = {};
      return true;
    },
    processNamespaceProperty: function(name_, declaration_, context_) {
      var value;
      value = context_.input.propertyAssignmentObject[name_];
      if ((value != null) && value) {
        delete context_.input.propertyAssignmentObject[name_];
      } else {
        value = declaration_.defaultValue;
        if (!((value != null) && value)) {
          value = (declaration_.fnCreate != null) && declaration_.fnCreate && declaration_.fnCreate();
          if (!((value != null) && value)) {
            throw new Error("Cannot deduce property value for assignment for name '" + name_ + "'");
          }
        }
      }
      context_.output.namespaceDataReference[name_] = value;
      return true;
    },
    processSubnamespace: function(descriptor_, context_) {
      var deleteKeyNames, keyName, propertyAssignmentObject, subcomponentPropertyAssignmentObject;
      propertyAssignmentObject = context_.input.propertyAssignmentObject;
      switch (descriptor_.namespaceType) {
        case 'component':
          deleteKeyNames = [];
          for (keyName in propertyAssignmentObject) {
            subcomponentPropertyAssignmentObject = propertyAssignmentObject[keyName];
            deleteKeyNames.push(keyName);
            context_.output.pendingNamespaceDescriptors.push({
              parentDataReference: context_.output.namespaceDataReference,
              targetNamespaceDescriptor: descriptor_,
              targetNamespaceKey: keyName,
              semanticBindingsReference: context_.input.semanticBindingsReference,
              propertyAssignmentObject: (subcomponentPropertyAssignmentObject != null) && subcomponentPropertyAssignmentObject || {}
            });
          }
          while (deleteKeyNames.length) {
            delete context_.input.propertyAssignmentObject[deleteKeyNames.pop()];
          }
          break;
        default:
          subcomponentPropertyAssignmentObject = propertyAssignmentObject[descriptor_.jsonTag];
          if ((subcomponentPropertyAssignmentObject != null) && subcomponentPropertyAssignmentObject) {
            delete context_.input.propertyAssignmentObject[childNamespaceDescriptor.jsonTag];
          } else {
            subcomponentPropertyAssignmentObject = {};
          }
          context_.output.pendingNamespaceDescriptors.push({
            parentDataReference: context_.output.namespaceDataReference,
            targetNamespaceDescriptor: descriptor_,
            targetNamespaceKey: '',
            semanticBindingsReference: context_.input.semanticBindingsReference,
            propertyAssignmentObject: subcomponentPropertyAssignmentObject
          });
          break;
      }
      return true;
    },
    processPropertyOptions: function(context_) {
      var deleteKeyNames, propertyName, subObject, _ref;
      deleteKeyNames = [];
      _ref = context_.input.propertyAssignmentObject;
      for (propertyName in _ref) {
        subObject = _ref[propertyName];
        context_.output.namespaceDataReference[propertyName] = subObject;
        deleteKeyNames.push(propertyName);
      }
      while (deleteKeyNames.length) {
        delete context_.input.propertyAssignmentObject[deleteKeyNames.pop()];
      }
      return true;
    },
    finalizeContext: function(context_) {
      return true;
    }
  };

}).call(this);
