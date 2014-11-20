// test-onm.Model-intrinsic-semantic-bindings.js
//
// White box test of onm's built-in semantics binding functions.
// This is high-order test intended to be executed late in the overall onm test suite.
// In order for these tests to even stand a chance of passing, it is necessary that all
// the prerequisite onm base object method tests pass cleanly.
//

var Mocha = require('mocha');
var Suite = Mocha.Suite;
var Test = Mocha.Test;
var withData = require('leche').withData;

var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should;

var uuid = require('node-uuid');
var onm = require('../onm');

// remove this
var semanticBindingTestDataModelDeclaration = require('./fixture/semantic-bindings-test-data-model');

// returns a leche.withData-style test input data vector
var testInputDataVector = require('./fixture/semantic-binding-variants');

var testKeys = {
    key1: '7f7c1925-48a1-4e98-a2d5-095db94aea29',
    key2: '2dcbd5e2-98d9-4215-9c22-3e35ec5231f1',
    key3: 'a2645c25-9122-49ae-92b5-5bc5813ed4a5'
};

var validateDataModelDeclaration = require('onm-data-model-tests')(onm).validateDataModelDeclaration


module.exports = describe("onm.Model intrinsic semantic bindings white box tests", function() {

    withData(testInputDataVector, function (testDescriptor_) {

        var model = null;
        var address = null;
        var store = null;
        var namespace = null;

        var keyPropertyName = null;


        before(function(done_) {

            if (testDescriptor_.validConfig) {

                assert.doesNotThrow(function() {
                    model = new onm.Model(testDescriptor_.dataModelDeclaration);
                    assert.isNotNull(model);
                    assert.instanceOf(model, onm.Model);
                    keyPropertyName = model.getSemanticBindings().keyPropertyName;
                });

                assert.doesNotThrow(function() {
                    store = new onm.Store(model);
                    assert.isNotNull(store);
                    assert.instanceOf(store, onm.Store);
                });

                assert.doesNotThrow(function() {
                    address = model.createRootAddress().createSubpathAddress("collectionA.componentA");
                    assert.isNotNull(address);
                    assert.instanceOf(address, onm.Address);
                });

                assert.doesNotThrow(function() {
                    namespace = store.createComponent(address);
                    assert.isNotNull(namespace);
                    assert.instanceOf(namespace, onm.Namespace);
                });

                assert.doesNotThrow(function() {
                    namespace = store.createComponent(address, [ testKeys.key1 ]);
                    assert.isNotNull(namespace);
                    assert.instanceOf(namespace, onm.Namespace);
                });

                assert.doesNotThrow(function() {
                    namespace = store.createComponent(address, [ testKeys.key2 ], { key: testKeys.key2 } );
                    assert.isNotNull(namespace);
                    assert.instanceOf(namespace, onm.Namespace);
                });

                assert.doesNotThrow(function() {
                    namespace = store.createComponent(address, undefined, { key: testKeys.key3 } );
                    assert.isNotNull(namespace);
                    assert.instanceOf(namespace, onm.Namespace);
                });

                validateDataModelDeclaration(testDescriptor_.dataModelDeclaration);

                var suite = describe("Validate component key integrity.", function(done_) {

                    var addressCollectionA, namespaceCollectionA;
                    var subcomponentAddresses = [];
                    var completeTestSuite = done_;

                    before(function(done_) {
                        addressCollectionA = model.createRootAddress().createSubpathAddress("collectionA");
                        namespaceCollectionA = store.openNamespace(addressCollectionA);
                        var componentAddresses = [];
                        // This could be collapsed but is left expanded to make it simpler to copy and extend the pattern.
                        // Cache the addresses of the extesion point's subcomponents. 
                        namespaceCollectionA.visitExtensionPointSubcomponents(function(addressSubcomponent_) {
                            componentAddresses.push(addressSubcomponent_.clone());
                        });
                        // Dynamically add a test for each subcomponent address to the parent test suite.
                        for (var addressIndex in componentAddresses) {
                            (function() {
                                var componentAddress = componentAddresses[addressIndex];
                                suite.addTest(new Test("Component '" + componentAddress.getHumanReadableString() + "' key integrity check.", function() {
                                    var namespace = store.openNamespace(componentAddress);
                                    // console.log("In test: " + componentAddress.getHumanReadableString());
                                    // console.log("In test: " + JSON.stringify(namespace.data()));
                                    assert.equal(namespace.getComponentKey(), namespace.data()[keyPropertyName]);
                                }));
                            })();
                        }
                        done_();
                    });

                    it("Run the dynamically generated test suite.", function() {
                        assert.isTrue(true);
                    });

                });

            } else {

                assert.throws(function() {
                    model = new onm.Model(testDescriptor_.dataModelDeclaration);
                    // assert.isNotNull(model);
                    // assert.instanceOf(model, onm.Model);
                    // keyPropertyName = model.getSemanticBindings().keyPropertyName;
                }, Error);

            }

            // console.log(store.toJSON());
            done_();

        });

        it("Execute the test suite.", function() {
            assert.isTrue(true);
        });

    });

});
