// test-onmd-X.js
//
// Generic Object Namespace Manager (onm) data model declaration object test suite.
//
// This module implements a generic test suite for Object Namespace Manager (onm)
// data model declaration objects. If you're taking a dependency on the onm module,
// it is strongly recommended that you execute this test module against your own onm
// data model declaration objects to ensure that they are free from obvious error(s).
//

var onm = require('../../onm');

var Mocha = require('mocha');
var Suite = Mocha.Suite;
var Test = Mocha.Test;
var Hook = Mocha.Hook;

var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should;

var withData = require('leche').withData;

// MODULE API
// This module exports a function that accepts a reference to the onm data model declaration.
// e.g. var testOnmdX = require('test-onmd-X')(dataModelDeclarationObject_)
//
module.exports = function (dataModelDeclaration_) {

    var dataModelDeclaration = dataModelDeclaration_;

    describe("Object Namespace Manager (onm) data model declaration generic acceptance test suite.", function() {

        before(function(done_) {
            done_();
        });

        describe("Base level test input data acceptance tests.", function() {
            it("The input data model declaration should be defined.", function() {
                assert.isDefined(dataModelDeclaration);
            });
            it("The input data model declaration should not be null.", function() {
                assert.isNotNull(dataModelDeclaration);
            });
            it("The input data model declaration should be an object reference.", function() {
                assert.isObject(dataModelDeclaration);
            });
        });

        describe("Parse the data model declaration object and construct an onm.Model instance.", function() {

            var onmModel = null;

            before(function() {
                onmModel = new onm.Model(dataModelDeclaration);
            });
            it("Result should be defined.", function() {
                assert.isDefined(onmModel);
            });
            it("Result should not be null.", function() {
                assert.isNotNull(onmModel);
            });
            it("Result should be an instance of onm.Model.", function() {
                assert.instanceOf(onmModel, onm.Model);
            });

            var dynamicDataModelDeclSuite = describe("Data model declaration validation suite.", function() {

                before(function(dynamicDataModelDeclSuiteDone_) {

                    var addressRoot = onmModel.createRootAddress();

                    var suiteA = Suite.create(dynamicDataModelDeclSuite, "Check onm model '" + onmModel.jsonTag + "' extension point configuration.");

                    if (onmModel.implementation.countExtensionPoints) {

                        var whiteBoxSemanticBindings = onmModel.implementation.objectModelDeclaration.semanticBindings;

                        suiteA.addTest(new Test("'" + onmModel.jsonTag + "' semantic binding should define the 'keyPropertyName' property.", function() {
                            assert.property(whiteBoxSemanticBindings, 'keyPropertyName');
                            assert.isString(whiteBoxSemanticBindings.keyPropertyName);
                        }));

                        suiteA.addTest(new Test("'" + onmModel.jsonTag + "' data model should declare a 'semanticBinding' sub-object.", function() {
                            assert.isDefined(whiteBoxSemanticBindings);
                            assert.isObject(whiteBoxSemanticBindings);
                        }));

                        suiteA.addTest(new Test("'" + onmModel.jsonTag + "' semantic binding should define key setter function.", function() {
                            assert.property(whiteBoxSemanticBindings, 'setUniqueKey');
                            assert.isFunction(whiteBoxSemanticBindings.setUniqueKey);
                        }));

                        suiteA.addTest(new Test("'" + onmModel.jsonTag + "' semantic binding should define a key getter function.", function() {
                            assert.property(whiteBoxSemanticBindings, 'getUniqueKey');
                            assert.isFunction(whiteBoxSemanticBindings.getUniqueKey);
                        }));

                        suiteA.addTest(new Test("'" + onmModel.jsonTag + "' key setter basic test.", function() {
                            var data = {};
                            var keyValue = whiteBoxSemanticBindings.setUniqueKey(data);
                            assert.property(data, whiteBoxSemanticBindings.keyPropertyName);
                            assert.isString(data[whiteBoxSemanticBindings.keyPropertyName]);
                            assert.isDefined(keyValue);
                            assert.isNotNull(keyValue);
                            assert.isString(keyValue);
                            assert.equal(keyValue, data[whiteBoxSemanticBindings.keyPropertyName]);
                        }));

                        suiteA.addTest(new Test("'" + onmModel.jsonTag + "' key setter override key value on set test.", function() {
                            var data = {};
                            var testKey = "testkey1";
                            var keyValue = whiteBoxSemanticBindings.setUniqueKey(data, testKey);
                            assert.property(data, whiteBoxSemanticBindings.keyPropertyName);
                            assert.isString(data[whiteBoxSemanticBindings.keyPropertyName]);
                            assert.equal(data[whiteBoxSemanticBindings.keyPropertyName], testKey);
                            assert.isDefined(keyValue);
                            assert.isNotNull(keyValue);
                            assert.isString(keyValue);
                            assert.equal(keyValue, testKey);
                        }));

                        suiteA.addTest(new Test("'" + onmModel.jsonTag + "' key getter test.", function() {
                            var testKey = "testkey2";
                            var data = {};
                            data[whiteBoxSemanticBindings.keyPropertyName] = testKey;
                            var keyActual = whiteBoxSemanticBindings.getUniqueKey(data);
                            assert.equal(keyActual, testKey);
                        }));

                        var suiteB = Suite.create(suiteA, "Check onm model '" + onmModel.jsonTag + "' component namespace key property declaration(s).");

                        var componentDescriptorTestSuites = {};


                        for (var index = 0 ; index < onmModel.implementation.countDescriptors ; index++) {
                            var objectModelDescriptor = onmModel.implementation.getNamespaceDescriptorFromPathId(index);
                            if (objectModelDescriptor.namespaceType === "component") {
                                var testName = "'" + onmModel.jsonTag + "' component namespace path '" + objectModelDescriptor.path + "' key property declaration test.";
                                componentDescriptorTestSuites[testName] = [ {
                                    testName: testName,
                                    objectModelDescriptor: objectModelDescriptor
                                } ];
                            }
                        }

                        withData(componentDescriptorTestSuites, function (testDescriptor_) {

                            var objectModelDescriptor = testDescriptor_.objectModelDescriptor;

                            describe("Verify '" + objectModelDescriptor.path + "' property declaration object.", function() {
                                it("Component namespace descriptor should define 'namespaceModelPropertiesDeclaration' property.", function() {
                                    assert.property(objectModelDescriptor, 'namespaceModelPropertiesDeclaration');
                                });
                                it("Component namespace descriptor property declaration should be an object.", function() {
                                    assert.isObject(objectModelDescriptor.namespaceModelPropertiesDeclaration);
                                });
                                it("Component namespace descriptor property declaration should define 'userImmutable'.", function() {
                                    assert.property(objectModelDescriptor.namespaceModelPropertiesDeclaration, 'userImmutable');
                                });
                                it("Component namespace descriptor immutable property declaration should be an object.", function() {
                                    assert.isObject(objectModelDescriptor.namespaceModelPropertiesDeclaration.userImmutable);
                                });
                                describe("Verify '" + objectModelDescriptor.path + "' component key declaration.", function() {
                                    it("Execute property declaration object verification tests.", function() { assert.isTrue(true); });
                                });
                            });
                        });

                    }

                    dynamicDataModelDeclSuiteDone_();

                });

                it("Execute the dynamic onm data model declaration test suite.", function() {
                    assert.isTrue(true);
                });

            });

            describe("Data model binding validation test suite.", function() {

                var onmStore = null;

                before(function() {
                    onmStore = new onm.Store(onmModel);
                });

                it("onm.Store instance bound to onm.Model should be defined.", function() {
                    assert.isDefined(onmStore);
                });

                it("onm.Store instance bound to onm.Model should not be null.", function() {
                    assert.isNotNull(onmStore);
                });

                it("onm.Store instance reference should be a verified instance of onm.Store.", function() {
                    assert.instanceOf(onmStore, onm.Store);
                });

                var dynamicDataModelBindingSuite = describe("Data component construction tests.", function() {

                    before(function(dynamicDataModelBindingSuiteDone_) {

                        var extensionPointModelPathCoverageMap = {};

                        var componentAddresses = [];

                        if (onmModel.implementation.countExtensionPoints) {

                            var currentComponentAddress = onmModel.createRootAddress();

                            var generateSubcomponentCreateSuite = function (addressComponent_, parentTestSuite_) {

                                var unresolvedSubcomponentAddresses = [];
                                addressComponent_.visitExtensionPointAddresses(function (addressExtensionPoint_) {
                                    var modelPath = addressExtensionPoint_.implementation.getModelPath();
                                    if (extensionPointModelPathCoverageMap[modelPath] === undefined) {
                                        extensionPointModelPathCoverageMap[modelPath] = true;
                                        var unresolvedSubcomponentAddress = addressExtensionPoint_.createSubcomponentAddress();
                                        unresolvedSubcomponentAddresses.push(unresolvedSubcomponentAddress);
                                        // console.log("Discovered '" + unresolvedSubcomponentAddress.getHumanReadableString() + "'.");
                                    }
                                }); // end visit extension points

                                unresolvedSubcomponentAddresses.forEach(function(element, index, array) {

                                    // console.log("In foreach on index = " + index);

                                    var unresolvedComponentAddress = element;
                                    var componentNamespace = null;

                                    var dynamicComponentCreateSuite = Suite.create(parentTestSuite_, "Component '" + element.getHumanReadableString() + "' create test.");
                                    
                                    var title = '"before all" hook' + dynamicComponentCreateSuite.title;

                                    var fn = function(dynamicComponentCreateSuiteDone_) {
                                        componentNamespace = onmStore.createComponent(unresolvedComponentAddress);
                                        dynamicComponentCreateSuite.addTest(new Test("Component '" + componentNamespace.getResolvedAddress().getHumanReadableString() + "' was created.", function() {
                                            assert.isDefined(componentNamespace);
                                            assert.isNotNull(componentNamespace);
                                            assert.instanceOf(componentNamespace, onm.Namespace);
                                            // RECURSION (note that recursive data models are cycle-busted by this algorithm).
                                            generateSubcomponentCreateSuite(componentNamespace.getResolvedAddress(), dynamicComponentCreateSuite);
                                        }));
                                        // console.log("Finished executing 'beforeAll' for '" + unresolvedComponentAddress.getHumanReadableString() + "'.");
                                        dynamicComponentCreateSuiteDone_.call(dynamicComponentCreateSuite);
                                    };

                                    var hook = new Hook(title, fn);

                                    hook.parent = dynamicComponentCreateSuite
                                    hook.timeout(dynamicComponentCreateSuite.timeout());
                                    hook.enableTimeouts(dynamicComponentCreateSuite.enableTimeouts());
                                    hook.slow(dynamicComponentCreateSuite.slow());
                                    hook.ctx = dynamicComponentCreateSuite.ctx;
                                    dynamicComponentCreateSuite._beforeAll.push(hook);
                                    dynamicComponentCreateSuite.emit('beforeAll', hook);

                                    dynamicComponentCreateSuite.addTest(new Test("Execute the dynamic component create suite.", function() {
                                        assert.isTrue(true);
                                    }));

                                });

                            }; // generateSubcomponentCreateSuite

                            generateSubcomponentCreateSuite(currentComponentAddress, dynamicDataModelBindingSuite);

                        }

                        dynamicDataModelBindingSuiteDone_();
                    });

                    it("Execute the dynamic onm data model binding test suite.", function() {
                        assert.isTrue(true);
                    });

                });
            });
        });
    });
};
