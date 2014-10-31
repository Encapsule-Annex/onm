// test-onm.Model-intrinsic-semantic-bindings.js
//
// White box test of onm's built-in semantics binding functions.
// This is high-order test intended to be executed late in the overall onm test suite.
// In order for these tests to even stand a chance of passing, it is necessary that all
// the prerequisite onm base object method tests pass cleanly.
//

var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should;

var uuid = require('node-uuid');
var onm = require('../onm');
var async = require('async');

var semanticBindingTestDataModelDeclaration = require('./fixture/sem-bind-test-data-model-decl');

module.exports = describe("onm.Model intrinsic semantic bindings white box tests", function() {

    var model = null;
    var address = null;
    var store = null;
    var namespace = null;

    before(function() {

        model = new onm.Model(semanticBindingTestDataModelDeclaration);
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

        namespace = store.createComponent(address, [ "7f7c1925-48a1-4e98-a2d5-095db94aea29" ]);
        namespace = store.createComponent(address, [ "2dcbd5e2-98d9-4215-9c22-3e35ec5231f1" ], { key: "2dcbd5e2-98d9-4215-9c22-3e35ec5231f1" } );
        namespace = store.createComponent(address, undefined, { key: "a2645c25-9122-49ae-92b5-5bc5813ed4a5" } );

        console.log(store.toJSON());

    });

    describe("Confirm the correctness of component keys.", function() {

        var addressCollectionA, namespaceCollectionA;
        var subcomponentAddresses = [];

        before(function() {
            addressCollectionA = model.createRootAddress().createSubpathAddress("collectionA");
            namespaceCollectionA = store.openNamespace(addressCollectionA);
            namespaceCollectionA.visitExtensionPointSubcomponents(function(addressSubcomponent_) {
                subcomponentAddresses.push(addressSubcomponent_.clone());
            });
        });

        it("Verify component keys.", function() {
            while (subcomponentAddresses.length) {
                var addressSubcomponent = subcomponentAddresses.pop();
                var namespaceSubcomponent = store.openNamespace(addressSubcomponent);
                var componentKey = namespaceSubcomponent.getComponentKey();
                var keyPropertyValue = namespaceSubcomponent.data()['key'];
                console.log(addressSubcomponent.getHumanReadableString() + ": " + componentKey + " " + keyPropertyValue);
                assert.equal(componentKey, keyPropertyValue);
            }
        });

    });

});



