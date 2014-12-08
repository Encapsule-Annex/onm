
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

A namespace descriptor is a low-level, should-be-viewed-as-frozen object
maintained by onm.Model used to cache details about a specific namespace
declaration in an onm data model.

Namespace descriptor objects are the basis of AddressToken object implementation,
and are ultimately the source of truth when it comes to opening or creating
specifc JavaScript object references within the scope of an onm.Store object.

Recall that a "namespace" in the parlance of onm is a generic moniker for a
named JavaScript object that has one of several onm-defined possible object roles
assigned via its 'namespaceType' property value declaration.

Generically, this module implements the low-level policy over the opening
(i.e. the resolution of onm.Address resource locators against a specific
onm.Store addressable, in-memory data store), and the creation (i.e. allocation
and initialization via multi-way priority merge algorithm) of data namespaces
within the scope of an onm.Store.

onm.Store -> delegates to...
onm.Namespace -> delegates to ...
omm.AddressTokenResolver -> delegates to...
onm.NamespaceDescriptorResolver -> this module gets it done

------------------------------------------------------------------------------
 */

(function() {
  module.exports = {
    resolveNamespaceDescriptorOpen: function(options_) {
      var descriptor, exception_, jsonTag, key, message, resolveResults;
      try {
        if (!this.checkValidDescriptorResolveOptions(options_, true)) {
          throw new Error("Invalid descriptor resolve options.");
        }
        resolveResults = {
          namespaceDataReference: null,
          pendingNamespaceDescriptors: []
        };
        descriptor = options_.targetNamespaceDescriptor;
        key = options_.targetNamespaceKey;
        jsonTag = (descriptor.namespaceType !== 'extensionPoint') && descriptor.jsonTag || key;
        resolveResults.namespaceDataReference = options_.parentDataReference[jsonTag];
        if (!((resolveResults.namespaceDataReference != null) && resolveResults.namespaceDataReference)) {
          message = "Cannot open expected child object '" + jsonTag + "' in data for namespace descriptor 'path'='" + descriptor.path + "' 'namespaceType'='" + descriptor.namespaceType + "'";
          throw new Error(message);
        }
        return resolveResults;
      } catch (_error) {
        exception_ = _error;
        throw new Error("resolveNamespaceDescriptorOpen failure: " + exception_.message);
      }
    },
    resolveNamespaceDescriptorCreate: function(options_) {
      var exception_, resolveResults;
      try {
        if (!this.checkValidDescriptorResolveOptions(options_)) {
          throw new Error("Invalid descriptor resolve options.");
        }
        resolveResults = {
          namespaceDataReference: null,
          pendingNamespaceDescriptors: []
        };
        return resolveResults;
      } catch (_error) {
        exception_ = _error;
        throw new Error("resolveNamespaceDescirptorCreate failure: " + exception_.message);
      }
    },
    checkValidDescriptorResolveOptions: function(options_, isOpenResolve_) {
      var openResult;
      if (!((options_ != null) && options_)) {
        return false;
      }
      openResult = (options_.parentDataReference != null) && options_.parentDataReference && (options_.targetNamespaceDescriptor != null) && options_.targetNamespaceDescriptor && true || false;
      if (!((isOpenResolve_ != null) && isOpenResolve_)) {
        return openResult && (options_.targetNamespaceKey != null) && options_.targetNamespaceKey && (options_.propertyAsssignmentObject != null) && options_.propertyAssignmentObject && true || false;
      }
      return openResult;
    },
    checkValidDescriptorResolveResults: function(results_) {
      return (results_ != null) && results_ && (results_.namespaceDataReference != null) && results_.namespaceDataReference && (results_.pendingNamespaceDescriptors != null) && results_.pendingNamespaceDescriptors && Array.isArray(results_.pendingNamespaceDescriptors) && true || false;
    }
  };

}).call(this);
