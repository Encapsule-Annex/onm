
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

    /* open existing namespace policy implementation
    - open existing namespace
    - throw if namespace does not exist
    - write declared property values specified in caller-provided data
    - visit declared child namespaces and queue deferred resolves based on caller-provided data only
    - overlay namespace data with remaining, caller-provided properties
     */
    policyName: 'open existing namespace',
    initializeContext: function(context_, options_) {
      policyCommon.initializeContextInput(context_, options_);
      policyCommon.initializeContextOutput(context_);
      return true;
    },
    dereferenceNamedObject: function(context_) {
      var descriptor, effectiveKey, message;
      descriptor = context_.input.targetNamespaceDescriptor;
      context_.output.namespaceEffectiveKey = effectiveKey = (descriptor.namespaceType !== 'component') && descriptor.jsonTag || context_.input.targetNamespaceKey;
      context_.output.namespaceDataReference = context_.input.parentDataReference[effectiveKey];
      if (!((context_.output.namespaceDataReference != null) && context_.output.namespaceDataReference)) {
        message = "Failed to open existing named object '" + effectiveKey + "' for data model path '" + descriptor.path + "'.";
        throw new Error(message);
      }
      return true;
    },
    processNamespaceProperty: function(name_, declaration_, context_) {
      return true;
    },
    processSubnamespace: function(descriptor_, context_) {
      return true;
    },
    processPropertyOptions: function(context_) {
      return true;
    },
    finalizeContext: function(context_) {
      return true;
    }
  };

}).call(this);
