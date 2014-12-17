
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
  var Address, AddressToken, LUID, Model, ModelDetails, jslib, uuid;

  jslib = require('./lib-javascript');

  Address = require('./onm-address');

  AddressToken = require('./impl/onm-address-token');

  uuid = require('node-uuid');

  LUID = 1;

  ModelDetails = (function() {
    function ModelDetails(model_, objectModelDeclaration_) {
      var buildOMDescriptorFromLayout, defaultSemanticBindings, exception;
      try {
        this.model = ((model_ != null) && model_) || (function() {
          throw new Error("Internal error missing model input parameter.");
        })();
        buildOMDescriptorFromLayout = (function(_this) {
          return function(ONMD_, path_, parentDescriptor_, componentDescriptor_, parentPathIdVector_, parentPathExtensionPointIdVector_) {
            var archetypeDescriptor, componentDescriptor, description, exception, id, label, namespaceProperties, namespaceType, objectModelDescriptorReference, parentPathExtensionPoints, path, pathReference, processArchetypeDeclaration, subNamespace, tag, thisDescriptor, updatedParentPathExtensionPointIdVector, _i, _len, _ref;
            try {
              if (!((ONMD_ != null) && ONMD_)) {
                throw new Error("Missing object model layout object input parameter! If you specified the namespace declaration via object reference, check the validity of the reference.");
              }
              if (!((ONMD_.jsonTag != null) && ONMD_.jsonTag)) {
                throw new Error("Missing required namespace declaration property 'jsonTag'.");
              }
              tag = (ONMD_.jsonTag != null) && ONMD_.jsonTag || (function() {
                throw new Error("Namespace declaration missing required `jsonTag` property.");
              })();
              path = (path_ != null) && path_ && ("" + path_ + "." + tag) || tag;
              label = (ONMD_.____label != null) && ONMD_.____label || ONMD_.jsonTag;
              description = (ONMD_.____description != null) && ONMD_.____description || "no description provided";
              id = _this.countDescriptors++;
              namespaceType = ((ONMD_.namespaceType != null) && ONMD_.namespaceType) || (!id && (ONMD_.namespaceType = "root")) || (function() {
                throw new Error("Internal error unable to determine namespace type.");
              })();
              parentPathExtensionPoints = void 0;
              if ((parentPathExtensionPointIdVector_ != null) && parentPathExtensionPointIdVector_) {
                parentPathExtensionPoints = jslib.clone(parentPathExtensionPointIdVector_);
              } else {
                parentPathExtensionPoints = [];
              }
              namespaceProperties = (ONMD_.namespaceProperties != null) && ONMD_.namespaceProperties || {};
              thisDescriptor = _this.objectModelDescriptorById[id] = {
                "archetypePathId": -1,
                "children": [],
                "componentNamespaceIds": [],
                "description": description,
                "extensionPointReferenceIds": [],
                "id": id,
                "idComponent": id,
                "isComponent": false,
                "jsonTag": tag,
                "label": label,
                "namespaceType": namespaceType,
                "namespaceModelDeclaration": ONMD_,
                "namespaceModelPropertiesDeclaration": namespaceProperties,
                "parent": parentDescriptor_,
                "parentPathExtensionPoints": parentPathExtensionPoints,
                "parentPathIdVector": [],
                "path": path
              };
              _this.objectModelPathMap[path] = thisDescriptor;
              if ((parentDescriptor_ != null) && parentDescriptor_) {
                parentDescriptor_.children.push(thisDescriptor);
                thisDescriptor.parentPathIdVector = jslib.clone(parentDescriptor_.parentPathIdVector);
                thisDescriptor.parentPathIdVector.push(parentDescriptor_.id);
              }
              if (_this.rankMax < thisDescriptor.parentPathIdVector.length) {
                _this.rankMax = thisDescriptor.parentPathIdVector.length;
              }
              componentDescriptor = void 0;
              switch (namespaceType) {
                case "extensionPoint":
                  if (!((componentDescriptor_ != null) && componentDescriptor_)) {
                    throw new Error("Internal error: componentDescriptor_ should be defined.");
                  }
                  thisDescriptor.idComponent = componentDescriptor_.id;
                  componentDescriptor = componentDescriptor_;
                  componentDescriptor.extensionPoints[path] = thisDescriptor;
                  processArchetypeDeclaration = void 0;
                  archetypeDescriptor = void 0;
                  if ((ONMD_.componentArchetype != null) && ONMD_.componentArchetype) {
                    processArchetypeDeclaration = true;
                    archetypeDescriptor = ONMD_.componentArchetype;
                  } else if ((ONMD_.componentArchetypePath != null) && ONMD_.componentArchetypePath) {
                    processArchetypeDeclaration = false;
                    pathReference = ONMD_.componentArchetypePath;
                    objectModelDescriptorReference = _this.objectModelPathMap[pathReference];
                    if (!((objectModelDescriptorReference != null) && objectModelDescriptorReference)) {
                      throw new Error("Extension point namespace '" + path + "' component archetype '" + pathReference + "' was not found and is invalid.");
                    }
                    if (objectModelDescriptorReference.namespaceType !== "component") {
                      throw new Error("Extension point namespace '" + path + "' declares component archetype '" + pathReference + "' which is not a 'component' namespace type.");
                    }
                    objectModelDescriptorReference.extensionPointReferenceIds.push(thisDescriptor.id);
                    thisDescriptor.archetypePathId = objectModelDescriptorReference.id;
                    _this.countExtensionReferences++;
                  } else {
                    throw new Error("Cannot process extension point declaration because its corresponding extension archetype is missing from the object model declaration.");
                  }
                  updatedParentPathExtensionPointIdVector = jslib.clone(parentPathExtensionPoints);
                  updatedParentPathExtensionPointIdVector.push(id);
                  _this.countExtensionPoints++;
                  if (processArchetypeDeclaration) {
                    buildOMDescriptorFromLayout(archetypeDescriptor, path, thisDescriptor, componentDescriptor, thisDescriptor.parentPathIdVector, updatedParentPathExtensionPointIdVector);
                  }
                  break;
                case "component":
                  thisDescriptor.isComponent = true;
                  thisDescriptor.extensionPoints = {};
                  parentDescriptor_.archetypePathId = id;
                  componentDescriptor = thisDescriptor;
                  _this.countExtensions++;
                  _this.countComponents++;
                  break;
                case "root":
                  if ((componentDescriptor_ != null) || componentDescriptor) {
                    throw new Error("Internal error: componentDescriptor_ should be undefined.");
                  }
                  thisDescriptor.isComponent = true;
                  thisDescriptor.extensionPoints = {};
                  componentDescriptor = thisDescriptor;
                  _this.countComponents++;
                  break;
                case "child":
                  if (!((componentDescriptor_ != null) && componentDescriptor_)) {
                    throw new Error("Internal error: componentDescriptor_ should be defined.");
                  }
                  thisDescriptor.idComponent = componentDescriptor_.id;
                  componentDescriptor = componentDescriptor_;
                  _this.countChildren++;
                  break;
                default:
                  throw new Error("Unrecognized namespace type '" + namespaceType + "' in object model namespace declaration.");
              }
              _this.objectModelDescriptorById[thisDescriptor.idComponent].componentNamespaceIds.push(thisDescriptor.id);
              if (!((ONMD_.subNamespaces != null) && ONMD_.subNamespaces)) {
                return true;
              }
              _ref = ONMD_.subNamespaces;
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                subNamespace = _ref[_i];
                buildOMDescriptorFromLayout(subNamespace, path, thisDescriptor, componentDescriptor, thisDescriptor.parentPathIdVector, parentPathExtensionPoints);
              }
              return true;
            } catch (_error) {
              exception = _error;
              throw new Error("buildOMDescriptorFromLayout failure on path '" + path_ + "'. Details: " + exception.message);
            }
          };
        })(this);
        this.getNamespaceDescriptorFromPathId = (function(_this) {
          return function(pathId_) {
            var exception, objectModelDescriptor;
            try {
              if (!(pathId_ != null)) {
                throw new Error("Missing path ID parameter!");
              }
              if ((pathId_ < 0) || (pathId_ >= _this.objectModelDescriptorById.length)) {
                throw new Error("Out of range path ID '" + pathId_ + " cannot be resolved.");
              }
              objectModelDescriptor = _this.objectModelDescriptorById[pathId_];
              if (!((objectModelDescriptor != null) && objectModelDescriptor)) {
                throw new Error("Cannot resolve path ID `" + pathId_ + "` in data model '" + _this.objectModelDescriptorById[0].jsonTag + "'.");
              }
              return objectModelDescriptor;
            } catch (_error) {
              exception = _error;
              throw new Error("getNamespaceDescriptorFromPathId failure: " + exception.message);
            }
          };
        })(this);
        this.getNamespaceDescriptorFromPath = (function(_this) {
          return function(path_) {
            var exception;
            try {
              return _this.getNamespaceDescriptorFromPathId(_this.getPathIdFromPath(path_));
            } catch (_error) {
              exception = _error;
              throw new Error("getNamespaceDescriptorFromPath failure: " + exception.message);
            }
          };
        })(this);
        this.getPathIdFromPath = (function(_this) {
          return function(path_) {
            var exception, objectModelDescriptor, objectModelPathId;
            try {
              if (!((path_ != null) && path_)) {
                throw new Error("Missing object model path parameter!");
              }
              objectModelDescriptor = _this.objectModelPathMap[path_];
              if (!((objectModelDescriptor != null) && objectModelDescriptor)) {
                throw new Error("Path '" + path_ + "' is not in the '" + _this.model.jsonTag + "' model's address space.");
              }
              objectModelPathId = objectModelDescriptor.id;
              if (objectModelPathId == null) {
                throw new Error("Internal error: Invalid object model descriptor doesn't support id property for path '" + objectModelPath_ + "'.");
              }
              return objectModelPathId;
            } catch (_error) {
              exception = _error;
              throw new Error("getPathIdFromPath fail: " + exception.message);
            }
          };
        })(this);
        this.getPathFromPathId = (function(_this) {
          return function(pathId_) {
            var exception, objectModelDescriptor, path;
            try {
              objectModelDescriptor = _this.getNamespaceDescriptorFromPathId(pathId_);
              if (!((objectModelDescriptor != null) && objectModelDescriptor)) {
                throw new Error("Internal error: Can't find object descriptor for valid path ID '" + pathId_ + ".");
              }
              path = objectModelDescriptor.path;
              if (!((path != null) && path)) {
                throw new Error("Internal error: Invalid object model descriptor doesn't support path property for path '" + objectModelPath_ + "'.");
              }
              return path;
            } catch (_error) {
              exception = _error;
              throw new Error("getPathFromPathId fail: " + exception.message);
            }
          };
        })(this);
        this.createAddressFromPathId = function(pathId_) {
          var descriptor, exception, newAddress, parentPathId, pathIds, targetDescriptor, token, _i, _len;
          try {
            if (pathId_ == null) {
              throw new Error("Missing path input parameter.");
            }
            targetDescriptor = this.getNamespaceDescriptorFromPathId(pathId_);
            newAddress = new Address(this.model);
            token = void 0;
            pathIds = jslib.clone(targetDescriptor.parentPathIdVector);
            pathIds.push(targetDescriptor.id);
            for (_i = 0, _len = pathIds.length; _i < _len; _i++) {
              parentPathId = pathIds[_i];
              descriptor = this.getNamespaceDescriptorFromPathId(parentPathId);
              if (descriptor.namespaceType === "component") {
                newAddress.implementation.pushToken(token);
              }
              token = new AddressToken(this.model, descriptor.idExtensionPoint, void 0, descriptor.id);
            }
            newAddress.implementation.pushToken(token);
            return newAddress;
          } catch (_error) {
            exception = _error;
            throw new Error("getAddressFromPathId failure: " + exception.message);
          }
        };
        this.parseAddressHashString = function(addressHashString_) {
          var addressToken, addressTokenVector, exception, key, newAddress, processNewComponent, stringToken, stringTokenCount, stringTokens, _i, _len;
          try {
            addressTokenVector = [];
            addressToken = void 0;
            key = void 0;
            processNewComponent = false;
            stringTokens = addressHashString_.split(".");
            stringTokenCount = 0;
            for (_i = 0, _len = stringTokens.length; _i < _len; _i++) {
              stringToken = stringTokens[_i];
              if (!stringTokenCount) {
                if (stringToken !== this.model.jsonTag) {
                  throw new Error("Invalid data model name '" + stringToken + "' in hash string.");
                }
                addressToken = new AddressToken(this.model, void 0, void 0, 0);
              } else {
                if (addressToken.namespaceDescriptor.namespaceType !== "extensionPoint") {
                  addressToken = new AddressToken(this.model, addressToken.idExtenstionPoint, addressToken.key, stringToken);
                } else {
                  if (!processNewComponent) {
                    addressTokenVector.push(addressToken);
                    addressToken = addressToken.clone();
                    if (stringToken !== "-") {
                      key = stringToken;
                    }
                    processNewComponent = true;
                  } else {
                    addressToken = new AddressToken(this.model, addressToken.namespaceDescriptor.id, key, stringToken);
                    key = void 0;
                    processNewComponent = false;
                  }
                }
              }
              stringTokenCount++;
            }
            addressTokenVector.push(addressToken);
            newAddress = new Address(this.model, addressTokenVector);
            return newAddress;
          } catch (_error) {
            exception = _error;
            throw new Error("parseAddressHashString failure: " + exception.message);
          }
        };
        this.parseAddressHumanReadableString = function(addressHumanReadableString_) {
          var addressToken, addressTokenVector, childDescriptor, descriptorFound, exception, key, newAddress, processNewComponent, stringToken, stringTokens, _i, _j, _k, _len, _len1, _len2, _ref, _ref1;
          try {
            addressTokenVector = [];
            addressToken = void 0;
            stringTokens = addressHumanReadableString_.split(".");
            for (_i = 0, _len = stringTokens.length; _i < _len; _i++) {
              stringToken = stringTokens[_i];
              if (!addressToken) {
                if (stringToken !== this.model.jsonTag) {
                  throw new Error("Invalid data model name '" + stringToken + "' in hash string.");
                }
                addressToken = new AddressToken(this.model, void 0, void 0, 0);
              } else {
                if (addressToken.namespaceDescriptor.namespaceType !== "extensionPoint") {
                  descriptorFound = false;
                  _ref = addressToken.namespaceDescriptor.children;
                  for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
                    childDescriptor = _ref[_j];
                    if (childDescriptor.jsonTag === stringToken) {
                      descriptorFound = true;
                      addressToken = new AddressToken(this.model, addressToken.idExtensionPoint, addressToken.key, childDescriptor.id);
                      break;
                    }
                  }
                  if (!descriptorFound) {
                    throw new Error("Cannot resolve '" + stringToken + "' token of human-readable onm.Address string '" + addressHumanReadableString_ + "'.");
                  }
                } else {
                  if (!processNewComponent) {
                    addressTokenVector.push(addressToken);
                    addressToken = addressToken.clone();
                    if (stringToken !== "-") {
                      key = stringToken;
                    }
                    processNewComponent = true;
                  } else {
                    descriptorFound = false;
                    _ref1 = addressToken.namespaceDescriptor.children;
                    for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
                      childDescriptor = _ref1[_k];
                      if (childDescriptor.jsonTag === stringToken) {
                        descriptorFound = true;
                        break;
                      }
                    }
                    if (!descriptorFound) {
                      throw new Error("Cannot resolve '" + stringToken + "' token of human-readable onm.Address string '" + addressHumanReadableString_ + "'.");
                    }
                    addressToken = new AddressToken(this.model, addressToken.idNamespace, key, childDescriptor.id);
                    key = void 0;
                    processNewComponent = false;
                  }
                }
              }
            }
            if (processNewComponent) {
              throw new Error("Cannot deserialize incomplete human-readable onm.Address string '" + addressHumanReadableString_ + "'.");
            }
            addressTokenVector.push(addressToken);
            newAddress = new Address(this.model, addressTokenVector);
            return newAddress;
          } catch (_error) {
            exception = _error;
            throw new Error("parseAddressHumanReadableString failure: " + exception.message);
          }
        };
        if (!((objectModelDeclaration_ != null) && objectModelDeclaration_)) {
          throw new Error("Missing object model delcaration input parameter!");
        }
        if (!((objectModelDeclaration_.jsonTag != null) && objectModelDeclaration_.jsonTag)) {
          throw new Error("Missing required root namespace property 'jsonTag'.");
        }
        this.model.jsonTag = objectModelDeclaration_.jsonTag;
        this.model.label = (objectModelDeclaration_.____label != null) && objectModelDeclaration_.____label || objectModelDeclaration_.jsonTag;
        this.model.description = (objectModelDeclaration_.____description != null) && objectModelDeclaration_.____description || "<no description provided>";
        this.objectModelDeclaration = jslib.clone(objectModelDeclaration_);
        Object.freeze(this.objectModelDeclaration);
        if (!((this.objectModelDeclaration != null) && this.objectModelDeclaration)) {
          throw new Error("Failed to deep copy (clone) source object model declaration.");
        }
        this.objectModelPathMap = {};
        this.objectModelDescriptorById = [];
        this.countDescriptors = 0;
        this.countComponents = 0;
        this.countExtensionPoints = 0;
        this.countExtensions = 0;
        this.countExtensionReferences = 0;
        this.countChildren = 0;
        this.rankMax = 0;
        buildOMDescriptorFromLayout(objectModelDeclaration_);
        if (this.countExtensionPoints !== this.countExtensions + this.countExtensionReferences) {
          throw new Error("Layout declaration error: extension point and extension descriptor counts do not match. countExtensionPoints=" + this.countExtensionPoints + " countExtensions=" + this.countExtensions);
        }
        if (this.countComponents !== this.countExtensionPoints + 1 - this.countExtensionReferences) {
          throw new Error("Layout declaration error: component count should be " + ("extension count + 1 - extension references. componentCount=" + this.countComponents + " ") + (" countExtensions=" + this.countExtensions + " extensionReferences=" + this.countExtensionReferences));
        }
        Object.freeze(this.objectModelPathMap);
        Object.freeze(this.objectModelDescriptorById);
        defaultSemanticBindings = {
          keyPropertyName: '_cid',
          componentKeyGenerator: 'disabled',
          namespaceVersion: 'disabled'
        };
        this.semanticBindings = (this.objectModelDeclaration.semanticBindings != null) && this.objectModelDeclaration.semanticBindings || defaultSemanticBindings;
        this.componentKeyGenerator = (this.semanticBindings.componentKeyGenerator != null) && this.semanticBindings.componentKeyGenerator || "external";
        this.namespaceVersioning = ((this.semanticBindings.update != null) && this.semanticBindings.update && "external") || ((this.semanticBindings.namespaceVersioning != null) && this.semanticBindings.namespaceVersioning || "disabled");
        switch (this.componentKeyGenerator) {
          case "disabled":
            if ((this.semanticBindings.keyPropertyName != null) && this.semanticBindings.keyPropertyName) {
              delete this.semanticBindings.keyPropertyName;
            }
            if ((this.semanticBindings.getUniqueKey != null) && this.semanticBindings.getUniqueKey) {
              delete this.semanticBindings.getUniqueKey;
            }
            if ((this.semanticBindings.setUniqueKey != null) && this.semanticBindings.setUniqueKey) {
              delete this.semanticBindings.setUniqueKey;
            }
            break;
          case "internalLuid":
            this.semanticBindings.keyPropertyName = (this.semanticBindings.keyPropertyName != null) && this.semanticBindings.keyPropertyName || defaultSemanticBindings.keyPropertyName;
            this.semanticBindings.getUniqueKey = (function(_this) {
              return function(data_) {
                return data_[_this.semanticBindings.keyPropertyName];
              };
            })(this);
            this.semanticBindings.setUniqueKey = (function(_this) {
              return function(data_, key_) {
                data_[_this.semanticBindings.keyPropertyName] = (key_ != null) && key_ || ("" + (LUID++));
                return data_[_this.semanticBindings.keyPropertyName];
              };
            })(this);
            break;
          case "internalUuid":
            this.semanticBindings.keyPropertyName = (this.semanticBindings.keyPropertyName != null) && this.semanticBindings.keyPropertyName || defaultSemanticBindings.keyPropertyName;
            this.semanticBindings.getUniqueKey = (function(_this) {
              return function(data_) {
                return data_[_this.semanticBindings.keyPropertyName];
              };
            })(this);
            this.semanticBindings.setUniqueKey = (function(_this) {
              return function(data_, key_) {
                data_[_this.semanticBindings.keyPropertyName] = (key_ != null) && key_ || uuid.v4();
                return data_[_this.semanticBindings.keyPropertyName];
              };
            })(this);
            break;
          case "external":
            if (this.countExtensionPoints) {
              if (!((this.semanticBindings.keyPropertyName != null) && this.semanticBindings.keyPropertyName)) {
                this.semanticBindings.keyPropertyName = defaultSemanticBindings.keyPropertyName;
              }
              if (!((this.semanticBindings.getUniqueKey != null) && this.semanticBindings.getUniqueKey && (this.semanticBindings.setUniqueKey != null) && this.semanticBindings.setUniqueKey)) {
                throw new Error("Data model declares extension point(s) and an external component key generator but is missing get/setUniqueKey functions?");
              }
            }
            break;
          default:
            throw new Error("Unrecognized componentKeyGenerator='" + this.componentKeyGenerator + "'");
        }
        switch (this.namespaceVersioning) {
          case "disabled":
            if ((this.semanticBindings.update != null) && this.semanticBindings.update) {
              delete this.semanticBindings.update;
            }
            break;
          case "internalSimple":
            this.semanticBindings.update = function(data_) {
              if (data_.revision != null) {
                return data_.revision++;
              }
            };
            break;
          case "internalAdvanced":
            this.semanticBindings.update = function(data_) {
              if (data_.revision != null) {
                data_.revision++;
              }
              if (data_.uuidRevision != null) {
                data_.uuidRevision = uuid.v4();
              }
              if (data_.revisionTime != null) {
                return data_.revisionTime = jslib.getEpochTime();
              }
            };
            break;
          case "external":
            break;
          default:
            throw new Error("Unrecognized namespaceVersionion=`" + this.namespaceUpdateRevision + "'");
        }
      } catch (_error) {
        exception = _error;
        throw new Error("ModelDetails failure: " + exception.message);
      }
    }

    return ModelDetails;

  })();

  module.exports = Model = (function() {
    function Model(objectModelDeclaration_) {
      var exception;
      try {
        this.implementation = new ModelDetails(this, objectModelDeclaration_);
        this.createRootAddress = (function(_this) {
          return function() {
            var exception;
            try {
              return new Address(_this, [new AddressToken(_this, void 0, void 0, 0)]);
            } catch (_error) {
              exception = _error;
              throw new Error("createRootAddress failure: " + exception.message);
            }
          };
        })(this);
        this.createPathAddress = (function(_this) {
          return function(path_) {
            var exception, newAddress, pathId;
            try {
              pathId = _this.implementation.getPathIdFromPath(path_);
              newAddress = _this.implementation.createAddressFromPathId(pathId);
              return newAddress;
            } catch (_error) {
              exception = _error;
              throw new Error("createPathAddress failure: " + exception.message);
            }
          };
        })(this);
        this.createAddressFromHumanReadableString = (function(_this) {
          return function(humanReadableString_) {
            var exception, newAddress;
            try {
              if (!((humanReadableString_ != null) && humanReadableString_)) {
                throw new Error("Missing human-readbale string input parameter.");
              }
              newAddress = _this.implementation.parseAddressHumanReadableString(humanReadableString_);
              return newAddress;
            } catch (_error) {
              exception = _error;
              throw new Error("createAddressFromHumanReadableString address space failure: " + exception.message);
            }
          };
        })(this);
        this.createAddressFromHashString = (function(_this) {
          return function(hash_) {
            var exception, newAddress;
            try {
              if (!((hash_ != null) && hash_)) {
                throw new Error("Missing hash string input parameter.");
              }
              newAddress = _this.implementation.parseAddressHashString(hash_);
              return newAddress;
            } catch (_error) {
              exception = _error;
              throw new Error("createAddressFromHashString address space failure: " + exception.message);
            }
          };
        })(this);
        this.getSemanticBindings = (function(_this) {
          return function() {
            var exception;
            try {
              return _this.implementation.semanticBindings;
            } catch (_error) {
              exception = _error;
              throw new Error("getSemanticBindings failure: " + exception.message);
            }
          };
        })(this);
        this.isEqual = (function(_this) {
          return function(model_) {
            var exception;
            try {
              if (!((model_.jsonTag != null) && model_.jsonTag)) {
                throw new Error("Invalid model object passed as input parameter. Missing expectected property 'jsonTag'.");
              }
              return _this.jsonTag === model_.jsonTag;
            } catch (_error) {
              exception = _error;
              throw new Error("isEqual failure: " + exception.message);
            }
          };
        })(this);
      } catch (_error) {
        exception = _error;
        throw new Error("Model construction fail: " + exception.message);
      }
    }

    return Model;

  })();

}).call(this);
