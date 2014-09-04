// test-onm.Address.createSubpathAddress.js
//

var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should;

var uuid = require('node-uuid');
var onm = require('../onm');

var testData = require('./fixture/test-data');

module.exports = describe("onm.Address.createSubpathAddress tests", function() {

    var model, addressRoot;

    before(function() {
        model = testData.createModel();
        addressRoot = model.createRootAddress();
    });

    it("Verify test setup", function() {
        assert.isNotNull(model);
        assert.isNotNull(addressRoot);
    });

    describe("Create a subpath address one level above the root namespace", function() {
        var addressActual, addressExpected;
        before(function() {
            addressActual = addressRoot.createSubpathAddress("contacts");
            addressExpected = model.createPathAddress("addressBook.contacts");
        });
        it("createPath/SubpathAddress paths should be equal", function() {
            if (!addressActual.isEqual(addressExpected)) {
                console.log("actual .... " + addressActual.getHumanReadableString());
                console.log("expected .. " + addressExpected.getHumanReadableString());
            }
            assert.isTrue(addressActual.isEqual(addressExpected));
        });
    });

    describe("Create a subpath address two levels above the root namespace", function() {
        var addressActual, addressExpected;
        before(function() {
            addressActual = addressRoot.createSubpathAddress("contacts.contact");
            addressExpected = model.createPathAddress("addressBook.contacts.contact");
        });
        it("createPath/SubpathAddress paths should be equal", function() {
            if (!addressActual.isEqual(addressExpected)) {
                console.log("actual .... " + addressActual.getHumanReadableString());
                console.log("expected .. " + addressExpected.getHumanReadableString());
            }
            assert.isTrue(addressActual.isEqual(addressExpected));
        });


    });

    describe("Create a component and use it as the base to create a subpath address", function() {

        var store;
        var actualResult = null;
        var expectedResult = 'addressBook.contacts.3.contact.addresses';
        var addressContact, addressContactAddresses;

        before(function() {
            store = testData.createStore();
            var addressNewContact = addressRoot.createSubpathAddress("contacts.contact");
            var namespace = store.createComponent(addressNewContact);
            addressContact = namespace.getResolvedAddress();
            addressContactAddresses = addressContact.createSubpathAddress("addresses");
            actualResult = addressContactAddresses.getHumanReadableString();
        });

        it("The actual result should match the expected result", function() {
            assert.equal(actualResult, expectedResult);
        });

        describe("Go another level deeper", function() {

            actualResult;
            expectedResult = '';

            before(function() {
                var addressTest = addressContactAddresses.createSubpathAddress('address');
                actualResult = addressTest.getHumanReadableString();
            });

            it("The actual result should match the expected result", function() {
                assert.equal(actualResult, expectedResult);
            });

        });

    });

});