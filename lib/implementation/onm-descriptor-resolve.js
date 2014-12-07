
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
    resolveNamespaceDescriptorOpen: function(descriptorResolveOptions_) {
      var exception_, resolveResults;
      try {
        if (!checkValidDescriptorResolveOptions(descriptorResolveOptions_)) {
          throw new Error("Invalid descriptor resolve options.");
        }
        return resolveResults = {};
      } catch (_error) {
        exception_ = _error;
        throw new Error("resolveNamespaceDescriptorOpen failure: " + exception_.message);
      }
    },
    resolveNamespaceDescriptorCreate: function(descriptorResolveOptions_) {
      var exception_, resolveResults;
      try {
        if (!checkValidDescriptorResolveOptions(descriptorResolveOptions_)) {
          throw new Error("Invalid descriptor resolve options.");
        }
        return resolveResults = {};
      } catch (_error) {
        exception_ = _error;
        throw new Error("resolveNamespaceDescirptorCreate failure: " + exception_.message);
      }
    },
    checkValidDescriptorResolveOptions: function(options_) {
      return (options_ != null) && options_ && (options_.parentDataReference != null) && options_.parentDataReference && (options_.targetNamespaceDescriptor != null) && options_.targetNamespaceDescriptor && (options_.targetNamespaceKey != null) && options_.targetNamespaceKey && (options_.propertyAsssignmentObject != null) && options_.propertyAssignmentObject;
    },
    checkValidDescriptorResolveResults: function(result_) {
      return (result_ != null) && result_ && (result_.namespaceDataReference != null) && result_.namespaceDataReference_ && (result_.pendingNamespaceDescriptors != null) && result_.pendingNamespaceDescriptors && Array.isArray(result_.pendingNamespaceDescriptors);
    }
  };

}).call(this);
