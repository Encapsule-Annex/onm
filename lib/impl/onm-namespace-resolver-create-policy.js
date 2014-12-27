
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
    prepareInputContext: function(context_) {
      policyCommon.initializeResolveResults(context_);
      return true;
    },
    dereferenceNamedObject: function(context_) {
      var descriptor, effectiveKey, message, resolveResults;
      descriptor = context_.options.targetNamespaceDescriptor;
      resolveResults = context_.resolveResults;
      resolveResults.namespaceEffectiveKey = effectiveKey = (descriptor.namespaceType !== 'component') && descriptor.jsonTag || context_.options.targetNamespaceKey;
      resolveResults.namespaceDataReference = context_.options.parentDataReference[effectiveKey];
      if ((resolveResults.namespaceDataReference != null) && resolveResults.namespaceDataReference) {
        message = "Cannot re-create named object '" + effectiveKey + "' for data model path '" + descriptor.path + "'.";
        throw new Error(message);
      }
      if (!((effectiveKey != null) && effectiveKey && effectiveKey.length > 0)) {
        resolveResults.namespaceEffectiveKey = effectiveKey = context_.options.semanticBindingsReference.setUniqueKey({});
      }
      resolveResults.namespaceDataReference = context_.options.parentDataReference[effectiveKey] = {};
      return true;
    },
    processNamespaceProperty: function(name_, declaration_, context_) {
      var value;
      value = context_.options.propertyAssignmentObject[name_];
      if ((value != null) && value) {
        delete context_.options.propertyAssignmentObject[name_];
      } else {
        value = declaration_.defaultValue;
        if (!((value != null) && value)) {
          value = (declaration_.fnCreate != null) && declaration_.fnCreate && declaration_.fnCreate();
          if (!((value != null) && value)) {
            throw new Error("Cannot deduce property value for assignment for name '" + name_ + "'");
          }
        }
      }
      context_.resolveResults.namespaceDataReference[name_] = value;
      return true;
    },
    processSubnamespace: function(descriptor_, context_) {
      return true;
    },
    finalizeOutputContext: function(context_) {
      return true;
    }
  };

}).call(this);
