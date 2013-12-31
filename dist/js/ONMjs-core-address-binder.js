/*
------------------------------------------------------------------------------

The MIT License (MIT)

Copyright (c) 2013 Encapsule Project
  
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
  var AddressTokenBinder, InitializeComponentNamespaces, InitializeNamespaceProperties, ResolveNamespaceDescriptor, VerifyComponentNamespaces, VerifyNamespaceProperties;

  InitializeNamespaceProperties = function(data_, descriptor_) {
    var exception, functions, memberName, _ref, _ref1;
    try {
      if (!((data_ != null) && data_)) {
        throw "Missing data reference input parameter.";
      }
      if (!((descriptor_ != null) && descriptor_)) {
        throw "Missing descriptor input parameter.";
      }
      if ((descriptor_.userImmutable != null) && descriptor_.userImmutable) {
        _ref = descriptor_.userImmutable;
        for (memberName in _ref) {
          functions = _ref[memberName];
          if ((functions.fnCreate != null) && functions.fnCreate) {
            data_[memberName] = functions.fnCreate();
          } else {
            data_[memberName] = functions.defaultValue;
          }
        }
      }
      if ((descriptor_.userMutable != null) && descriptor_.userMutable) {
        _ref1 = descriptor_.userMutable;
        for (memberName in _ref1) {
          functions = _ref1[memberName];
          if ((functions.fnCreate != null) && functions.fnCreate) {
            data_[memberName] = functions.fnCreate();
          } else {
            data_[memberName] = functions.defaultValue;
          }
        }
      }
      return true;
    } catch (_error) {
      exception = _error;
      throw "InitializeNamespaceProperties failure " + exception + ".";
    }
  };

  VerifyNamespaceProperties = function(data_, descriptor_) {
    var exception, functions, memberName, memberReference, _ref, _ref1;
    try {
      if (!((data_ != null) && data_)) {
        throw "Missing data reference input parameter.";
      }
      if (!((descriptor_ != null) && descriptor_)) {
        throw "Missing descriptor input parameter.";
      }
      if ((descriptor_.userImmutable != null) && descriptor_.userImmutable) {
        _ref = descriptor_.userImmutable;
        for (memberName in _ref) {
          functions = _ref[memberName];
          memberReference = data_[memberName];
          if (memberReference == null) {
            throw "Expected immutable member '" + memberName + "' not found.";
          }
        }
      }
      if ((descriptor_.userMutable != null) && descriptor_.userMutable) {
        _ref1 = descriptor_.userMutable;
        for (memberName in _ref1) {
          functions = _ref1[memberName];
          memberReference = data_[memberName];
          if (memberReference == null) {
            throw "Expected mutable member '" + memberName + "' not found.";
          }
        }
      }
      return true;
    } catch (_error) {
      exception = _error;
      throw "VerifyNamespaceMembers failure " + exception + ".";
    }
  };

  InitializeComponentNamespaces = function(store_, data_, descriptor_, extensionPointId_, key_) {
    var childDescriptor, exception, resolveResults, _i, _len, _ref;
    try {
      if (!((data_ != null) && data_)) {
        throw "Missing data reference input parameter.";
      }
      if (!((descriptor_ != null) && descriptor_)) {
        throw "Missing descriptor input parameter.";
      }
      if (!((extensionPointId_ != null) && extensionPointId_)) {
        throw "Missing extension point ID input parameter.";
      }
      _ref = descriptor_.children;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        childDescriptor = _ref[_i];
        if (childDescriptor.namespaceType !== "component") {
          resolveResults = ResolveNamespaceDescriptor({}, store_, data_, childDescriptor, key_, "new");
          InitializeComponentNamespaces(store_, resolveResults.dataReference, childDescriptor, extensionPointId_, key_);
        }
      }
      return true;
    } catch (_error) {
      exception = _error;
      throw "InitializeComponentNamespaces failure: " + exception + ".";
    }
  };

  VerifyComponentNamespaces = function(store_, data_, descriptor_, extensionPointId_) {
    var exception;
    try {
      if (!((data_ != null) && data_)) {
        throw "Missing data reference input parameter.";
      }
      if (!((descriptor_ != null) && descriptor_)) {
        throw "Missing descriptor input parameter.";
      }
      return true;
    } catch (_error) {
      exception = _error;
      throw "VerifyComponentNamespaces failure: " + exception + ".";
    }
  };

  ResolveNamespaceDescriptor = function(resolveActions_, store_, data_, descriptor_, key_, mode_) {
    var exception, jsonTag, newData, resolveResults;
    try {
      if (!((resolveActions_ != null) && resolveActions_)) {
        throw "Internal error: missing resolve actions structure input parameter.";
      }
      if (!((data_ != null) && data_)) {
        throw "Internal error: missing parent data reference input parameter.";
      }
      if (!((descriptor_ != null) && descriptor_)) {
        throw "Internal error: missing object model descriptor input parameter.";
      }
      if (!((mode_ != null) && mode_)) {
        throw "Internal error: missing mode input parameter.";
      }
      jsonTag = ((descriptor_.namespaceType !== "component") && descriptor_.jsonTag) || key_ || void 0;
      resolveResults = {
        jsonTag: jsonTag,
        dataReference: (jsonTag != null) && jsonTag && data_[jsonTag] || void 0,
        dataParentReference: data_,
        key: key_,
        mode: mode_,
        descriptor: descriptor_,
        store: store_,
        created: false
      };
      switch (mode_) {
        case "bypass":
          if (!((resolveResults.dataReference != null) && resolveResults.dataReference)) {
            throw "Internal error: Unable to resolve " + descriptor_.namespaceType + " namespace descriptor in bypass mode.";
          }
          break;
        case "new":
          if ((resolveResults.dataReference != null) && resolveResults.dataReference) {
            break;
          }
          newData = {};
          InitializeNamespaceProperties(newData, descriptor_.namespaceModelPropertiesDeclaration);
          if (descriptor_.namespaceType === "component") {
            if (!((resolveActions_.setUniqueKey != null) && resolveActions_.setUniqueKey)) {
              throw "You must define semanticBindings.setUniqueKey function in your data model declaration.";
            }
            resolveActions_.setUniqueKey(newData);
            if (!((resolveActions_.getUniqueKey != null) && resolveActions_.getUniqueKey)) {
              throw "You must define semanticBindings.getUniqueKey function in your data model declaration.";
            }
            resolveResults.key = resolveResults.jsonTag = resolveActions_.getUniqueKey(newData);
            if (!((resolveResults.key != null) && resolveResults.key)) {
              throw "Your data model's semanticBindings.getUniqueKey function returned an invalid key. Key cannot be zero or zero-length.";
            }
          }
          resolveResults.dataReference = resolveResults.dataParentReference[resolveResults.jsonTag] = newData;
          resolveResults.created = true;
          break;
        case "strict":
          if (!((resolveResult.dataReference != null) && resolveResult.dataReference)) {
            throw "Internal error: Unable to resolve  " + descriptor_.namespaceType + " namespace descriptor in strict mode.";
          }
          VerifyNamespaceProperties(result.dataReference, descriptor_.namespaceModelPropertiesDeclaration);
          break;
        default:
          throw "Unrecognized mode parameter value.";
      }
      return resolveResults;
    } catch (_error) {
      exception = _error;
      throw "ResolveNamespaceDescriptor failure: " + exception;
    }
  };

  module.exports = AddressTokenBinder = (function() {
    function AddressTokenBinder(store_, parentDataReference_, token_, mode_) {
      var descriptor, exception, extensionPointId, generations, getUniqueKeyFunction, model, parentPathIds, pathId, resolveActions, resolveResults, semanticBindings, setUniqueKeyFunction, targetComponentDescriptor, targetNamespaceDescriptor, _i, _len;
      try {
        this.store = (store_ != null) && store_ || (function() {
          throw "Missing object store input parameter.";
        })();
        model = store_.model;
        this.parentDataReference = (parentDataReference_ != null) && parentDataReference_ || (function() {
          throw "Missing parent data reference input parameter.";
        })();
        if (!((token_ != null) && token_)) {
          throw "Missing object model address token object input parameter.";
        }
        if (!((mode_ != null) && mode_)) {
          throw "Missing mode input parameter.";
        }
        this.dataReference = void 0;
        this.resolvedToken = token_.clone();
        targetNamespaceDescriptor = token_.namespaceDescriptor;
        targetComponentDescriptor = token_.componentDescriptor;
        semanticBindings = model.getSemanticBindings();
        setUniqueKeyFunction = (semanticBindings != null) && semanticBindings && (semanticBindings.setUniqueKey != null) && semanticBindings.setUniqueKey || void 0;
        getUniqueKeyFunction = (semanticBindings != null) && semanticBindings && (semanticBindings.getUniqueKey != null) && semanticBindings.getUniqueKey || void 0;
        resolveActions = {
          setUniqueKey: setUniqueKeyFunction,
          getUniqueKey: getUniqueKeyFunction
        };
        resolveResults = ResolveNamespaceDescriptor(resolveActions, store_, this.parentDataReference, token_.componentDescriptor, token_.key, mode_);
        this.dataReference = resolveResults.dataReference;
        if (resolveResults.created) {
          this.resolvedToken.key = resolveResults.key;
        }
        extensionPointId = (token_.extensionPointDescriptor != null) && token_.extensionPointDescriptor && token_.extensionPointDescriptor.id || -1;
        if (mode_ === "new" && resolveResults.created) {
          InitializeComponentNamespaces(store_, this.dataReference, targetComponentDescriptor, extensionPointId, this.resolvedToken.key);
        }
        if (mode_ === "strict") {
          VerifyComponentNamespaces(store_, resolveResult.dataReference, targetComponentDescriptor, extensionPointId);
        }
        if (targetNamespaceDescriptor.isComponent) {
          return;
        }
        generations = targetNamespaceDescriptor.parentPathIdVector.length - targetComponentDescriptor.parentPathIdVector.length - 1;
        parentPathIds = generations && targetNamespaceDescriptor.parentPathIdVector.slice(-generations) || [];
        for (_i = 0, _len = parentPathIds.length; _i < _len; _i++) {
          pathId = parentPathIds[_i];
          descriptor = model.implementation.getNamespaceDescriptorFromPathId(pathId);
          resolveResults = ResolveNamespaceDescriptor(resolveActions, store_, resolveResults.dataReference, descriptor, resolveResults.key, mode_);
        }
        resolveResults = ResolveNamespaceDescriptor(resolveActions, store_, resolveResults.dataReference, targetNamespaceDescriptor, resolveResults.key, mode_);
        this.dataReference = resolveResults.dataReference;
        return;
      } catch (_error) {
        exception = _error;
        throw "AddressTokenBinder failure: " + exception;
      }
    }

    return AddressTokenBinder;

  })();

}).call(this);
