// test-onm.Model.createAddressFromHumanReadableString.js
//

var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should;

var uuid = require('node-uuid');
var onm = require('../onm');

var testData = require('./fixture/test-data');

module.exports = describe("onm.Model.createAddressFromHumanReadableString tests", function() {

    var model;
    before(function() {
        model = testData.createModel();
    });

    describe("convert the root address string back to an onm.Address", function() {
        var addressString, address;
        before(function() {
            addressString = model.createRootAddress().getHumanReadableString();
            address = model.createAddressFromHumanReadableString(addressString);
        });
        it("the reconstituted onm.Address should be the root address", function() {
            assert.isTrue(address.isRoot());
        });
    });

    describe("serialize/deserialize child namespace address to/from onm.Address", function() {
        var addressA, addressB, addressString;
        before(function() {
            addressA = model.createPathAddress("addressBook.properties");
            addressString = addressA.getHumanReadableString();
            addressB = model.createAddressFromHumanReadableString(addressString);
        });
        it("the reconsituted onm.Address should be equal to the original child namespace address", function() {
            assert.isNotNull(addressString);
            assert.instanceOf(addressB, onm.Address);
            assert.isTrue(addressA.isEqual(addressB));
        });
    });

    describe("serialize/deserialize extension point address to/from onm.Address", function() {
        var addressA, addressB, addressString;
        before(function() {
            addressA = model.createPathAddress("addressBook.contacts");
            addressString = addressA.getHumanReadableString();
            addressB = model.createAddressFromHumanReadableString(addressString);
        });
        it("the reconstituted onm.Address should be equal to the origin child namespace address", function() {
            assert.isNotNull(addressString);
            assert.instanceOf(addressB, onm.Address);
            assert.isTrue(addressA.isEqual(addressB));
        });
    });

    describe("serialize/deserialize an unresolved component namespace onm.Address", function() {
        var addressA, addressB, addressString;
        before(function() {
            addressA = model.createPathAddress("addressBook.contacts.contact");
            addressString = addressA.getHumanReadableString();
            addressB = model.createAddressFromHumanReadableString(addressString);
        });
        it("the reconstituted onm.Address should be equal to the origin child namespace address", function() {
            assert.isNotNull(addressString);
            assert.instanceOf(addressB, onm.Address);
            assert.isTrue(addressA.isEqual(addressB));
        });
    });

    describe("serialize/deserialize a resolved component namespace onm.Address", function() {
        var store;
        var addressA, addressB, addressString;

        before(function() {
            store = testData.createStore();
            addressA = store.createComponent(model.createPathAddress("addressBook.contacts.contact")).getResolvedAddress();
            addressString = addressA.getHumanReadableString();
            addressB = model.createAddressFromHumanReadableString(addressString);
        });
        it("the reconstituted onm.Address should be equal to the origin child namespace address", function() {
            assert.isNotNull(addressString);
            assert.instanceOf(addressB, onm.Address);
            assert.isTrue(addressA.isEqual(addressB));
        });
    });

    

});

