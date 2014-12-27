
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
  var namespaceResolver;

  module.exports = namespaceResolver = {};

  namespaceResolver.helpers = {};

  namespaceResolver.visitor = {};

  namespaceResolver.resolve = function(visitorInterface_, context_) {
    var exception_, message, result, state;
    state = '0:0::start';
    try {
      result = true;
      state = '0:5::prepareContext';
      result = result && namespaceResolver.visitor.initializeContext(visitorInterface_, context_);
      state = '1:5::dereferenceNamedObject';
      result = result && namespaceResolver.visitor.dereferenceNamedObject(visitorInterface_, context_);
      state = '2:5::visitNamespaceProperties';
      result = result && namespaceResolver.visitor.visitNamespaceProperties(visitorInterface_, context_);
      state = '3:5::visitNamespaceChildren';
      result = result && namespaceResolver.visitor.visitNamespaceChildren(visitorInterface_, context_);
      state = '4:5::processPropertyOptions';
      result = result && namespaceResolver.visitor.processPropertyOptions(visitorInterface_, context_);
      state = '5:5::finalizeContext';
      result = result && namespaceResolver.visitor.finalizeContext(visitorInterface_, context_);
      return result;
    } catch (_error) {
      exception_ = _error;
      message = "resolveNamespaceDescriptor failed in state '" + state + "' while executing policy '" + visitorInterface_.policyName + "': " + exception_.message;
      throw new Error(message);
    }
  };

  namespaceResolver.helpers.getNamespaceDescriptorFromContext = function(context_) {
    return context_.options.targetNamespaceDescriptor;
  };

  namespaceResolver.visitor.initializeContext = function(visitorInterface_, context_) {
    return visitorInterface_.initializeContext(context_);
  };

  namespaceResolver.visitor.dereferenceNamedObject = function(visitorInterface_, context_) {
    return visitorInterface_.dereferenceNamedObject(context_);
  };

  namespaceResolver.visitor.visitNamespaceProperties = function(visitorInterface_, context_) {
    var namespaceDescriptor, propertiesDeclaration, propertyDeclaration, propertyName, result, _ref, _ref1;
    if (!((visitorInterface_.processNamespaceProperty != null) && visitorInterface_.processNamespaceProperty)) {
      return true;
    }
    namespaceDescriptor = namespaceResolver.helpers.getNamespaceDescriptorFromContext(context_);
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
        result = visitorInterface_.processNamespaceProperty(propertyName, propertyDeclaration, context_);
      }
    }
    if ((propertiesDeclaration.userMutable != null) && propertiesDeclaration.userMutable) {
      _ref1 = propertiesDeclaration.userMutable;
      for (propertyName in _ref1) {
        propertyDeclaration = _ref1[propertyName];
        if (!result) {
          break;
        }
        result = visitorInterface_.processNamespaceProperty(propertyName, propertyDeclaration, context_);
      }
    }
    return result;
  };

  namespaceResolver.visitor.visitNamespaceChildren = function(visitorInterface_, context_) {
    var childNamespaceDescriptor, namespaceDescriptor, result, _i, _len, _ref;
    if (!((visitorInterface_.processSubnamespace != null) && visitorInterface_.processSubnamespace)) {
      return true;
    }
    result = true;
    namespaceDescriptor = namespaceResolver.helpers.getNamespaceDescriptorFromContext(context_);
    _ref = namespaceDescriptor.children;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      childNamespaceDescriptor = _ref[_i];
      if (!result) {
        break;
      }
      result = visitorInterface_.processSubnamespace(childNamespaceDescriptor, context_);
    }
    return result;
  };

  namespaceResolver.visitor.processPropertyOptions = function(visitorInterface_, context_) {
    return (visitorInterface_.processPropertyOptions != null) && visitorInterface_.processPropertyOptions && visitorInterface_.processPropertyOptions(context_) || true;
  };

  namespaceResolver.visitor.finalizeContext = function(visitorInterface_, context_) {
    return (visitorInterface_.finalizeContext != null) && visitorInterface_.finalizeContext && visitorInterface_.finalizeContext(context_) || true;
  };

}).call(this);
