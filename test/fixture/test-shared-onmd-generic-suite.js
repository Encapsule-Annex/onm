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
var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should;

// MODULE API
// This module exports a function that accepts a reference to the onm data model declaration.
// e.g. var testOnmdX = require('test-onmd-X')(dataModelDeclarationObject_)
//
module.exports = function (dataModelDeclaration_) {

    var dataModelDeclaration = dataModelDeclaration_;

    describe("Object Namespace Manager (onm) data model declaration validator.", function() {

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

            var dynamicDataModelDeclSuite = describe("In-depth data model validation tests.", function() {

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

                        for (var index = 0 ; index < onmModel.implementation.countDescriptors ; index++) {
                            var objectModelDescriptor = onmModel.implementation.getNamespaceDescriptorFromPathId(index);
                            if (objectModelDescriptor.namespaceType === "component") {
                                (function() {
                                    var objectModelDescriptor_ = objectModelDescriptor;
                                    suiteB.addTest(new Test("'" + onmModel.jsonTag + "' component namespace path '" + objectModelDescriptor_.path + "' key property declaration test.", function() {

                                        var propertiesDecl = objectModelDescriptor_.namespaceModelPropertiesDeclaration;
                                        assert.isDefined(propertiesDecl);
                                        assert.isNotNull(propertiesDecl);
                                        assert.isObject(propertiesDecl);

                                        var immutableDecl = propertiesDecl.userImmutable;
                                        assert.isDefined(immutableDecl);
                                        assert.isNotNull(immutableDecl);
                                        assert.isObject(immutableDecl);

                                        var keyPropDecl = immutableDecl[whiteBoxSemanticBindings.keyPropertyName];
                                        assert.isDefined(keyPropDecl);
                                        assert.isNotNull(keyPropDecl);
                                        assert.isObject(keyPropDecl);

                                        // I think data component keys should _always_ be generated by the global,
                                        // data model-declaration-specified key generator get/set functions. However,
                                        // It's convenient however to have the key property prominantly part of each
                                        // namespace data model declaration. So scale back to requirement that the 
                                        // key property descriptor object must be included in the user immutable section
                                        // of each component's root namespace declaration? I think so. But, we'll see.
                                        //
                                        // So... for now
                                        // make clear what's going on, disallow specification of any component-specific
                                        // key set scheme. It just doesn't make any sense to allow this at all without a
                                        // a whole lot more thought and a bunch more tests. Metadata annotations, okay.

                                        assert.notProperty(keyPropDecl, 'defaultValue');
                                        assert.notProperty(keyPropDecl, 'fnCreate');

                                    }));
                                })();
                            }
                        }
                    }

                    dynamicDataModelDeclSuiteDone_();

                });

                it("Execute the dynamic onm data model declaration test suite.", function() {
                    assert.isTrue(true);
                });

            });


            describe("Construct an onm.Store instance bound to the newly constructed onm.Model instance.", function() {
                var onmStore = null;
                before(function() {
                    onmStore = new onm.Store(onmModel);
                });

                it("Result should be defined.", function() {
                    assert.isDefined(onmStore);
                });
                it("Result should not be null.", function() {
                    assert.isNotNull(onmStore);
                });
                it("Result should be an instance of onm.Store.", function() {
                    assert.instanceOf(onmStore, onm.Store);
                });

            });


        });
    });
};
