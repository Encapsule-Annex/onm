
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
  module.exports = {
    createResourceString: function(options_, results_) {
      return ("[object name='" + results_.namespaceEffectiveKey + "' ") + ("for descriptor path='" + options_.targetNamespaceDescriptor.path + "' ") + ("of declared namespace type='" + options_.targetNamespaceDescriptor.namespaceType + "']");
    },
    checkValidDescriptorResolveOptions: function(options_, isOpenResolve_) {
      var keyValid, openResult;
      if (!((options_ != null) && options_)) {
        return false;
      }
      openResult = (options_.parentDataReference != null) && options_.parentDataReference && (options_.targetNamespaceDescriptor != null) && options_.targetNamespaceDescriptor && (options_.targetNamespaceDescriptor.archetypePathId != null) && options_.targetNamespaceDescriptor.archetypePathId && true || false;
      if (!((isOpenResolve_ != null) && isOpenResolve_)) {
        keyValid = true;
        if ((options_.targetNamespaceKey != null) && options_.targetNamespaceKey) {
          keyValid = options_.targetNamespaceKey.length > 0 || false;
        }
        return openResult && keyValid && (options_.semanticBindingsReference != null) && options_.semanticBindingsReference && (options_.propertyAssignmentObject != null) && options_.propertyAssignmentObject && true || false;
      }
      return openResult;
    },
    checkValidDescriptorResolveResults: function(results_) {
      return (results_ != null) && results_ && (results_.namespaceEffectiveKey != null) && results_.namespaceEffectiveKey && (results_.namespaceDataReference != null) && results_.namespaceDataReference && (results_.pendingNamespaceDescriptors != null) && results_.pendingNamespaceDescriptors && Array.isArray(results_.pendingNamespaceDescriptors) && true || false;
    }
  };

}).call(this);
