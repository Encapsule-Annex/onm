
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
  var namedObjectResolver;

  module.exports = namedObjectResolver = {};

  namedObjectResolver.resolve = function(context_) {
    var descriptor, effectiveKey, exception_, input, message, output;
    try {
      input = context_.input;
      output = context_.output;
      descriptor = input.targetNamespaceDescriptor;
      output.namespaceEffectiveKey = effectiveKey = (descriptor.namespaceType !== 'component') && descriptor.jsonTag || input.targetNamespaceKey;
      output.namespaceDataReference = input.parentDataReference[effectiveKey];
      switch (input.strategy) {
        case 'open':
          if (!((output.namespaceDataReference != null) && output.namespaceDataReference)) {
            switch (descriptor.namespaceType) {
              case 'component':
                message = "Cannot open named object '" + effectiveKey + "' for component namespace '" + descriptor.jsonTag + "'. Object does not exist.";
                break;
              default:
                message = "Cannot open named object for " + descriptor.namespaceType + " namespace '" + descriptor.jsonTag + "'. Object does not exist.";
                break;
            }
            throw new Error(message);
          }
          output.resolutionStrategy = 'open';
          break;
        case 'create':
          if ((output.namespaceDataReference != null) && output.namespaceDataReference) {
            switch (descriptor.namespaceType) {
              case 'component':
                message = "Cannot create named object '" + effectiveKey + "' for component namespace '" + descriptor.jsonTag + "'. Object already exists.";
                break;
              default:
                message = "Cannot create named object for " + descriptor.namespaceType + " namespace '" + descriptor.jsonTag + "'. Object already exists.";
                break;
            }
            throw new Error(message);
          }
          output.resolutionStrategy = 'create';
          break;
        case 'negotiate':
          output.resolutionStrategy = (output.namespaceDataReference != null) && output.namespaceDataReference && 'open' || 'create';
          break;
        default:
          throw new Error("Unrecognized named object dereference strategy '" + input.strategy + "'.");
      }
      if (output.resolutionStrategy === 'create') {
        if (!((effectiveKey != null) && effectiveKey && effectiveKey.length > 0)) {
          output.namespaceEffectiveKey = effectiveKey = input.semanticBindingsReference.setUniqueKey({});
        }
        output.namespaceDataReference = input.parentDataReference[effectiveKey] = {};
        output.dataChangeEventJournal.push({
          layer: 'namespace',
          event: 'namespaceCreated',
          eventData: {
            namespaceType: descriptor.namespaceType,
            jsonTag: descriptor.jsonTag,
            key: effectiveKey
          }
        });
      }
      return true;
    } catch (_error) {
      exception_ = _error;
      message = "Failed to resolve named object.";
      throw new Error(message);
    }
  };

}).call(this);
