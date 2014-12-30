
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
  var util;

  util = require('../lib-javascript');

  module.exports = {
    initializeContextInput: function(context_, options_) {
      return context_.input = {
        parentDataReference: options_.parentDataReference,
        targetNamespaceDescriptor: options_.targetNamespaceDescriptor,
        targetNamespaceKey: options_.targetNamespaceKey,
        semanticBindingsReference: options_.semanticBindingsReference,
        propertyAssignmentObject: (options_.propertyAssignmentObject != null) && options_.propertyAssignmentObject && util.clone(options_.propertyAssignmentObject) || {}
      };
    },
    initializeContextOutput: function(context_) {
      return context_.output = {
        namespaceEffectiveKey: null,
        namespaceDataReference: null,
        pendingNamespaceDescriptors: []
      };
    }
  };

}).call(this);
