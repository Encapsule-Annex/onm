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

module.exports = describe("onm.Model intrinsic semantic bindings white box tests", function() {

    withData(testInputDataVector, function (testInputDataModelDeclaration_) {

        var model = null;
        var address = null;
        var store = null;
        var namespace = null;

        before(function(done_) {

            model = new onm.Model(testInputDataModelDeclaration_);
            assert.isNotNull(model);
            assert.instanceOf(model, onm.Model);

            store = new onm.Store(model);
            assert.isNotNull(store);
            assert.instanceOf(store, onm.Store);

            address = model.createRootAddress().createSubpathAddress("collectionA.componentA");
            assert.isNotNull(address);
            assert.instanceOf(address, onm.Address);

            namespace = store.createComponent(address);
            assert.isNotNull(namespace);
            assert.instanceOf(namespace, onm.Namespace);

            namespace = store.createComponent(address, [ testKeys.key1 ]);
            assert.isNotNull(namespace);
            assert.instanceOf(namespace, onm.Namespace);

            namespace = store.createComponent(address, [ testKeys.key2 ], { key: testKeys.key2 } );
            assert.isNotNull(namespace);
            assert.instanceOf(namespace, onm.Namespace);

            namespace = store.createComponent(address, undefined, { key: testKeys.key3 } );
            assert.isNotNull(namespace);
            assert.instanceOf(namespace, onm.Namespace);

            console.log(store.toJSON());
            done_();

        });

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
                            console.log("In test: " + componentAddress.getHumanReadableString());
                            console.log("In test: " + JSON.stringify(namespace.data()));
                            assert.equal(namespace.getComponentKey(), namespace.data()['key']);
                        }));
                    })();
                }
                done_();
            });

            it("Run the dynamically generated test suite.", function() {
                assert.isTrue(true);
            });

        });

    });

});



