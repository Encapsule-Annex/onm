
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
  var AddressTokenResolver, InitializeComponentNamespaces, InitializeNamespaceProperties, ResolveNamespaceDescriptor, VerifyComponentNamespaces, VerifyNamespaceProperties, jslib;

  jslib = require('../lib-javascript');

  InitializeNamespaceProperties = function(data_, descriptor_, propertyAssignmentObject_) {
    var exception, functions, memberName, propertyAssignmentObject, _ref, _ref1;
    try {
      if (!((data_ != null) && data_)) {
        throw new Error("Missing data reference input parameter.");
      }
      if (!((descriptor_ != null) && descriptor_)) {
        throw new Error("Missing descriptor input parameter.");
      }
      propertyAssignmentObject = (propertyAssignmentObject_ != null) && propertyAssignmentObject_ || {};
      if ((descriptor_.userImmutable != null) && descriptor_.userImmutable) {
        _ref = descriptor_.userImmutable;
        for (memberName in _ref) {
          functions = _ref[memberName];
          if ((data_[memberName] != null) && data_[memberName]) {
            continue;
          }
          if ((propertyAssignmentObject[memberName] != null) && propertyAssignmentObject[memberName]) {
            data_[memberName] = propertyAssignmentObject[memberName];
          } else if ((functions.fnCreate != null) && functions.fnCreate) {
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
          if ((data_[memberName] != null) && data_[memberName]) {
            continue;
          }
          if ((propertyAssignmentObject[memberName] != null) && propertyAssignmentObject[memberName]) {
            data_[memberName] = propertyAssignmentObject[memberName];
          } else if ((functions.fnCreate != null) && functions.fnCreate) {
            data_[memberName] = functions.fnCreate();
          } else {
            data_[memberName] = functions.defaultValue;
          }
        }
      }
      return true;
    } catch (_error) {
      exception = _error;
      throw new Error("InitializeNamespaceProperties failure " + exception.message + ".");
    }
  };

  VerifyNamespaceProperties = function(data_, descriptor_) {
    var exception, functions, memberName, memberReference, _ref, _ref1;
    try {
      if (!((data_ != null) && data_)) {
        throw new Error("Missing data reference input parameter.");
      }
      if (!((descriptor_ != null) && descriptor_)) {
        throw new Error("Missing descriptor input parameter.");
      }
      if ((descriptor_.userImmutable != null) && descriptor_.userImmutable) {
        _ref = descriptor_.userImmutable;
        for (memberName in _ref) {
          functions = _ref[memberName];
          memberReference = data_[memberName];
          if (memberReference == null) {
            throw new Error("Expected immutable member '" + memberName + "' not found.");
          }
        }
      }
      if ((descriptor_.userMutable != null) && descriptor_.userMutable) {
        _ref1 = descriptor_.userMutable;
        for (memberName in _ref1) {
          functions = _ref1[memberName];
          memberReference = data_[memberName];
          if (memberReference == null) {
            throw new Error("Expected mutable member '" + memberName + "' not found.");
          }
        }
      }
      return true;
    } catch (_error) {
      exception = _error;
      throw new Error("VerifyNamespaceMembers failure " + exception.message + ".");
    }
  };

  InitializeComponentNamespaces = function(store_, data_, descriptor_, extensionPointId_, key_, propertyAssignmentObject_) {
    var childDescriptor, exception, propertyAssignmentObject, resolveResults, subcomponentDescriptors, _i, _len, _ref;
    try {
      if (!((data_ != null) && data_)) {
        throw new Error("Missing data reference input parameter.");
      }
      if (!((descriptor_ != null) && descriptor_)) {
        throw new Error("Missing descriptor input parameter.");
      }
      if (!((extensionPointId_ != null) && extensionPointId_)) {
        throw new Error("Missing extension point ID input parameter.");
      }
      subcomponentDescriptors = [];
      console.log("InitializeComponentNamespaces for '" + descriptor_.jsonTag + "'.");
      _ref = descriptor_.children;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        childDescriptor = _ref[_i];
        console.log("... InitializeComponentNamespaces evaluating descriptor '" + childDescriptor.jsonTag + "' (" + childDescriptor.namespaceType + ").");
        propertyAssignmentObject = {};
        if ((propertyAssignmentObject_ != null) && propertyAssignmentObject_) {
          if (childDescriptor.namespaceType === "component") {
            if (Object.keys(propertyAssignmentObject_).length > 0) {
              console.log("... ... ... data-driven extension of the target component.");
              subcomponentDescriptors.push({
                parentExtensionPoint: {
                  namespaceDescriptor: descriptor_,
                  propertyAssignmentObject: propertyAssignmentObject_
                },
                subcomponent: {
                  namespaceDescriptor: childDescriptor
                }
              });
            }
          } else {
            console.log("... ... ... start normal initialization.");
            propertyAssignmentObject = (propertyAssignmentObject_ != null) && propertyAssignmentObject_ && (propertyAssignmentObject_[childDescriptor.jsonTag] != null) && propertyAssignmentObject_[childDescriptor.jsonTag] || {};
            resolveResults = ResolveNamespaceDescriptor({}, store_, data_, childDescriptor, key_, "new", propertyAssignmentObject);
            Array.prototype.push.apply(subcomponentDescriptors, InitializeComponentNamespaces(store_, resolveResults.dataReference, childDescriptor, extensionPointId_, key_, propertyAssignmentObject));
            console.log("... ... ... end normal initialization.");
          }
        }
      }
      console.log("InitializeComponentNamespaces exit with subcomponentDescriptors.length===" + subcomponentDescriptors.length);
      return subcomponentDescriptors;
    } catch (_error) {
      exception = _error;
      throw new Error("InitializeComponentNamespaces failure: " + exception.message + ".");
    }
  };

  VerifyComponentNamespaces = function(store_, data_, descriptor_, extensionPointId_) {
    var exception;
    try {
      if (!((data_ != null) && data_)) {
        throw new Error("Missing data reference input parameter.");
      }
      if (!((descriptor_ != null) && descriptor_)) {
        throw new Error("Missing descriptor input parameter.");
      }
      console.warn("VerifyComponentNamespaces is not implemented?");
      return true;
    } catch (_error) {
      exception = _error;
      throw new Error("VerifyComponentNamespaces failure: " + exception.message + ".");
    }
  };

  ResolveNamespaceDescriptor = function(resolveActions_, store_, data_, descriptor_, key_, mode_, propertyAssignmentObject_) {
    var cherryPickedKey, derivedKey, exception, newData, resolveResults, tokenString;
    try {
      if (!((resolveActions_ != null) && resolveActions_)) {
        throw new Error("Internal error: missing resolve actions structure input parameter.");
      }
      if (!((data_ != null) && data_)) {
        throw new Error("Internal error: missing parent data reference input parameter.");
      }
      if (!((descriptor_ != null) && descriptor_)) {
        throw new Error("Internal error: missing object model descriptor input parameter.");
      }
      if (!((mode_ != null) && mode_)) {
        throw new Error("Internal error: missing mode input parameter.");
      }
      console.log("ResolveNamespaceDescriptor enter: '" + descriptor_.jsonTag + "'.");
      tokenString = ((descriptor_.namespaceType !== "component") && descriptor_.jsonTag) || key_ || void 0;
      resolveResults = {
        jsonTag: tokenString,
        dataReference: (tokenString != null) && tokenString && data_[tokenString] || void 0,
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
            throw new Error("Unable to resolve expected namespace descriptor for namespace type '" + descriptor_.namespaceType + "' for token '" + tokenString + "'.");
          }
          break;
        case "new":

          /*
          if (resolveResults.dataReference? and resolveResults.dataReference)
              break
           */
          newData = (resolveResults.dataReference != null) && resolveResults.dataReference || {};
          if (descriptor_.namespaceType === "component") {
            if (!((resolveActions_.setUniqueKey != null) && resolveActions_.setUniqueKey)) {
              throw new Error("You must define semanticBindings.setUniqueKey function in your data model declaration.");
            }
            cherryPickedKey = resolveActions_.getUniqueKey(propertyAssignmentObject_);
            derivedKey = (key_ != null) && key_ || cherryPickedKey;
            resolveActions_.setUniqueKey(newData, derivedKey);
            if (!((resolveActions_.getUniqueKey != null) && resolveActions_.getUniqueKey)) {
              throw new Error("You must define semanticBindings.getUniqueKey function in your data model declaration.");
            }
            resolveResults.key = resolveResults.jsonTag = resolveActions_.getUniqueKey(newData);
            if (!((resolveResults.key != null) && resolveResults.key)) {
              throw new Error("Your data model's semanticBindings.getUniqueKey function returned an invalid key. Key cannot be zero or zero-length.");
            }
            if ((derivedKey != null) && derivedKey && (derivedKey !== resolveResults.key)) {
              throw new Error("Your data model's semanticBindings.setUniqueKey function seemingly ignores the second in-parameter.");
            }
          }
          InitializeNamespaceProperties(newData, descriptor_.namespaceModelPropertiesDeclaration, propertyAssignmentObject_);
          resolveResults.dataReference = resolveResults.dataParentReference[resolveResults.jsonTag] = newData;
          resolveResults.created = true;
          break;
        case "strict":
          if (!((resolveResult.dataReference != null) && resolveResult.dataReference)) {
            throw new Error("Internal error: Unable to resolve  " + descriptor_.namespaceType + " namespace descriptor in strict mode for token '" + tokenString + ".");
          }
          VerifyNamespaceProperties(result.dataReference, descriptor_.namespaceModelPropertiesDeclaration);
          break;
        default:
          throw new Error("Unrecognized mode parameter value.");
      }
      console.log("ResolveNamespaceDescriptor exit: '" + descriptor_.jsonTag + "'.");
      return resolveResults;
    } catch (_error) {
      exception = _error;
      throw new Error("ResolveNamespaceDescriptor failure: " + exception.message);
    }
  };


  /*
  
  The construction of an AddressTokenResolver object instance is a request to
  'resolve' (i.e. determine), primarily, a JavaScript object reference to the
  namespace resource indicated by the specified onm address token object.
  
  AddressTokenResolver constructor implements construction modes: 'open' and 'create'.
  
  'open' presumes the existence of the namespace specified by the token parameter as well as
  the existence of any containing parent namespace(s).
  
  If the addressed namespace (i.e. object
  in JSON parlance) does not exist, then AddressTokenResolver's constructor function will throw
  a new Error.
  
  When constructed in 'open' mode, AddressTokenResolver ignores the property assignment object
  in-parameter entirely as 'open' is simply a dereference, not an assignment.
  
  'create' presumes that the namespace addressed by the token parameter does not exist. In other
  words, no part of the data component into which the token parameter addresses exists.
  
  So, before resolving the specific namespace data reference indicated by the token parameter,
  AddressTokenResolver must create and initialize the entire data component in the store before
  ultimately returning the sought-after namespace data reference.
  
  Creating and initializing each namespace in a data component is a bit tricky as the
  set of properties in each namespace to be initialized derives from (a) reserved properties
  used by onm intrinsic semantic bindings (if enabled), (b) namespace properties and default values
  declared in the data model (c) the specifics of the property assignment object (iff defined).
  
  Additionally, it's the responsibility of AddressTokenResolver to prune any incoming
  property assignment object in order to correctly frame the construction of subcomponents
  encountered in property assignment object. It's not the responsibility of AddressTokenResolver
  to actually invoke itself (i.e. it's not recursive). Instead, this responsibility is relegated
  to the layer above: onm.Namespace.
   */

  module.exports = AddressTokenResolver = (function() {
    function AddressTokenResolver(store_, parentDataReference_, token_, mode_, propertyAssignmentObject_) {
      var descriptor, exception, extensionPointId, generations, getUniqueKeyFunction, model, parentPathIds, pathId, propertyAssignmentObject, resolveActions, resolveResults, semanticBindings, setUniqueKeyFunction, targetComponentDescriptor, targetNamespaceDescriptor, _i, _len;
      try {
        this.store = (store_ != null) && store_ || (function() {
          throw new Error("Missing object store input parameter.");
        })();
        this.parentDataReference = (parentDataReference_ != null) && parentDataReference_ || (function() {
          throw new Error("Missing parent data reference input parameter.");
        })();
        if (!((token_ != null) && token_)) {
          throw new Error("Missing object model address token object input parameter.");
        }
        if (!((mode_ != null) && mode_)) {
          throw new Error("Missing mode input parameter.");
        }
        this.dataReference = void 0;
        this.resolvedToken = token_.clone();
        this.subcomponentDescriptors = [];
        model = store_.model;
        targetNamespaceDescriptor = token_.namespaceDescriptor;
        targetComponentDescriptor = token_.componentDescriptor;
        semanticBindings = model.getSemanticBindings();
        setUniqueKeyFunction = (semanticBindings != null) && semanticBindings && (semanticBindings.setUniqueKey != null) && semanticBindings.setUniqueKey || void 0;
        getUniqueKeyFunction = (semanticBindings != null) && semanticBindings && (semanticBindings.getUniqueKey != null) && semanticBindings.getUniqueKey || void 0;
        resolveActions = {
          setUniqueKey: setUniqueKeyFunction,
          getUniqueKey: getUniqueKeyFunction
        };
        propertyAssignmentObject = (propertyAssignmentObject_ != null) && propertyAssignmentObject_ && jslib.clone(propertyAssignmentObject_) || {};
        console.log("AddressTokenResolver enter: '" + token_.namespaceDescriptor.jsonTag + "'.");
        resolveResults = ResolveNamespaceDescriptor(resolveActions, store_, this.parentDataReference, token_.componentDescriptor, token_.key, mode_, propertyAssignmentObject);
        this.dataReference = resolveResults.dataReference;
        if (resolveResults.created) {
          this.resolvedToken.key = resolveResults.key;
        }
        extensionPointId = (token_.extensionPointDescriptor != null) && token_.extensionPointDescriptor && token_.extensionPointDescriptor.id || -1;
        if (mode_ === "new" && resolveResults.created) {
          console.log("We appear to have just created the root namespace of a component. Proceeding to initialize its children and EP's");
          this.subcomponentDescriptors = InitializeComponentNamespaces(store_, this.dataReference, targetComponentDescriptor, extensionPointId, this.resolvedToken.key, propertyAssignmentObject);
        } else {
          console.log("No further resolution.");
        }
        if (mode_ === "strict") {
          VerifyComponentNamespaces(store_, resolveResult.dataReference, targetComponentDescriptor, extensionPointId);
        }
        if (targetNamespaceDescriptor.isComponent) {
          console.log("AddressTokenResolver enter: '" + token_.namespaceDescriptor.jsonTag + "'.");
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
        console.log("AddressTokenResolver enter: '" + token_.namespaceDescriptor.jsonTag + "'.");
        return;
      } catch (_error) {
        exception = _error;
        throw new Error("AddressTokenResolver failure: " + exception.message);
      }
    }

    return AddressTokenResolver;

  })();

}).call(this);
