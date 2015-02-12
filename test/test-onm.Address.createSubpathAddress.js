// test-onm.Address.createSubpathAddress.js
//

var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should;

var uuid = require('node-uuid');
var onm = require('../index');

module.exports = describe("onm.Address.createSubpathAddress tests.", function() {

    var testData = require('./fixture/address-book-data-model');
    var model, addressRoot;

    before(function() {
        model = testData.createModel();
        addressRoot = model.createRootAddress();
    });

    it("Verify test setup", function() {
        assert.isNotNull(model);
        assert.isNotNull(addressRoot);
    });

    describe("Create a subpath address one level above the root namespace.", function() {
        var addressActual, addressExpected;
        before(function() {
            addressActual = addressRoot.createSubpathAddress("contacts");
            addressExpected = model.createPathAddress("addressBook.contacts");
        });
        it("createPath/SubpathAddress paths should be equal", function() {
            if (!addressActual.isEqual(addressExpected)) {
                console.log("actual .... " + addressActual.uri());
                console.log("expected .. " + addressExpected.uri());
            }
            assert.isTrue(addressActual.isEqual(addressExpected));
        });
    });

    describe("Create a subpath address two levels above the root namespace.", function() {
        var addressActual, addressExpected;
        before(function() {
            addressActual = addressRoot.createSubpathAddress("contacts.contact");
            addressExpected = model.createPathAddress("addressBook.contacts.contact");
        });
        it("createPath/SubpathAddress paths should be equal", function() {
            if (!addressActual.isEqual(addressExpected)) {
                console.log("actual .... " + addressActual.uri());
                console.log("expected .. " + addressExpected.uri());
            }
            assert.isTrue(addressActual.isEqual(addressExpected));
        });

    });

    describe("Create a component and use it as the base to create a subpath address.", function() {

        var store;
        var actualResult, expectedResult;
        var addressContact, addressContactAddresses;

        before(function() {
            store = testData.createStore();
            var addressNewContact = addressRoot.createSubpathAddress("contacts.contact");
            var namespace = store.nsCreate(addressNewContact);
            addressContact = namespace.address();
            addressContactAddresses = addressContact.createSubpathAddress("addresses");
            actualResult = addressContactAddresses.uri();
            expectedResult = 'onm-uri:431c97059a0240f9312f1b8854d58bfa:contacts.1.addresses';
        });

        it("The actual result should match the expected result", function() {
            assert.equal(actualResult, expectedResult);
            assert.isTrue(addressContactAddresses.isResolvable());
        });



        describe("Go another level deeper.", function() {

            before(function() {
                var addressTest = addressContactAddresses.createSubpathAddress('address');
                actualResult = addressTest.uri();
                expectedResult = 'onm-uri:431c97059a0240f9312f1b8854d58bfa:contacts.1.addresses.-';
            });

            it("The actual result should match the expected result", function() {
                assert.equal(actualResult, expectedResult);
            });

        });

    });

});