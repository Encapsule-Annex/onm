
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
  var namedObjectPropertyResolver, namespaceResolverContext;

  namespaceResolverContext = require('./onm-named-object-context');

  module.exports = namedObjectPropertyResolver = {};

  namedObjectPropertyResolver.visitNamespaceProperties = function(resolutionPolicyInterface_, context_) {
    var namespaceDescriptor, propertiesDeclaration, propertyDeclaration, propertyName, result, _ref, _ref1;
    if (!((resolutionPolicyInterface_.processNamespaceProperty != null) && resolutionPolicyInterface_.processNamespaceProperty)) {
      return true;
    }
    namespaceDescriptor = namespaceResolverContext.getNamespaceDescriptorFromContext(context_);
    if (namespaceDescriptor.namespaceType === 'extensionPoint') {
      return true;
    }
    result = true;
    propertiesDeclaration = namespaceDescriptor.namespaceModelPropertiesDeclaration;
    if ((propertiesDeclaration.userImmutable != null) && propertiesDeclaration.userImmutable) {
      _ref = propertiesDeclaration.userImmutable;
      for (propertyName in _ref) {
        propertyDeclaration = _ref[propertyName];
        if (!result) {
          break;
        }
        result = resolutionPolicyInterface_.processNamespaceProperty(context_, propertyName, propertyDeclaration);
      }
    }
    if ((propertiesDeclaration.userMutable != null) && propertiesDeclaration.userMutable) {
      _ref1 = propertiesDeclaration.userMutable;
      for (propertyName in _ref1) {
        propertyDeclaration = _ref1[propertyName];
        if (!result) {
          break;
        }
        result = resolutionPolicyInterface_.processNamespaceProperty(context_, propertyName, propertyDeclaration);
      }
    }
    return result;
  };

  namedObjectPropertyResolver.visitNamespaceChildren = function(resolutionPolicyInterface_, context_) {
    var childNamespaceDescriptor, namespaceDescriptor, result, _i, _len, _ref;
    if (!((resolutionPolicyInterface_.processSubnamespace != null) && resolutionPolicyInterface_.processSubnamespace)) {
      return true;
    }
    result = true;
    namespaceDescriptor = namespaceResolverContext.getNamespaceDescriptorFromContext(context_);
    _ref = namespaceDescriptor.children;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      childNamespaceDescriptor = _ref[_i];
      if (!result) {
        break;
      }
      result = resolutionPolicyInterface_.processSubnamespace(context_, childNamespaceDescriptor);
    }
    return result;
  };

  namedObjectPropertyResolver.processPropertyOptions = function(resolutionPolicyInterface_, context_) {
    return (resolutionPolicyInterface_.processPropertyOptions != null) && resolutionPolicyInterface_.processPropertyOptions && resolutionPolicyInterface_.processPropertyOptions(context_) || true;
  };

  namedObjectPropertyResolver.finalizeContext = function(resolutionPolicyInterface_, context_) {
    return (resolutionPolicyInterface_.finalizeContext != null) && resolutionPolicyInterface_.finalizeContext && resolutionPolicyInterface_.finalizeContext(context_) || true;
  };

}).call(this);
