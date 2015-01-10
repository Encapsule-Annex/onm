
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
  var namedObjectPropertyResolver, namedObjectResolver, namespaceResolverContext, propertyResolutionPolicyInterfaces, resolveNamespaceDescriptor;

  module.exports = {
    resolveNamespaceDescriptorOpen: function(options_) {
      if ((options_ != null) && options_) {
        options_.strategy = 'open';
      }
      return resolveNamespaceDescriptor(options_);
    },
    resolveNamespaceDescriptorCreate: function(options_) {
      if ((options_ != null) && options_) {
        options_.strategy = 'create';
      }
      return resolveNamespaceDescriptor(options_);
    }
  };

  namedObjectResolver = require('./onm-named-object-resolver');

  namedObjectPropertyResolver = require('./onm-named-object-property-resolver');

  namespaceResolverContext = require('./onm-namespace-resolver-context');

  propertyResolutionPolicyInterfaces = {
    open: require('./onm-named-object-property-policy-update'),
    create: require('./onm-named-object-property-policy-initialize')
  };

  resolveNamespaceDescriptor = function(options_) {
    var context, exception_, message, policyName, propertyResolutionPolicyInterface, result, state;
    try {
      context = {
        input: options_,
        output: {}
      };
      result = true;
      state = 'prepareContext';
      namespaceResolverContext.initializeContextObject(context);
      state = 'resolveNamedObject';
      result = namedObjectResolver.resolve(context);
      propertyResolutionPolicyInterface = propertyResolutionPolicyInterfaces[context.output.strategyFollowed];
      state = 'visitNamespaceProperties';
      result = result && namedObjectPropertyResolver.visitNamespaceProperties(propertyResolutionPolicyInterface, context);
      state = 'visitNamespaceChildren';
      result = result && namedObjectPropertyResolver.visitNamespaceChildren(propertyResolutionPolicyInterface, context);
      state = 'processPropertyOptions';
      result = result && namedObjectPropertyResolver.processPropertyOptions(propertyResolutionPolicyInterface, context);
      state = 'finalizeContext';
      result = result && namedObjectPropertyResolver.finalizeContext(propertyResolutionPolicyInterface, context);
      return context.output;
    } catch (_error) {
      exception_ = _error;
      policyName = (propertyResolutionPolicyInterface != null) && propertyResolutionPolicyInterface && propertyResolutionPropertyInterface.policyName || 'not yet determined';
      message = "resolveNamespaceDescriptor failed in state '" + state + "' while executing policy '" + policyName + "': " + exception_.message;
      throw new Error(message);
    }
  };

}).call(this);
