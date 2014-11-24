// test-onm.Model.createAddressFromHumanReadableString.js
//

var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should;

var uuid = require('node-uuid');
var onm = require('../index');

var testData = require('./fixture/address-book-data-model');

module.exports = describe("onm.Model.createAddressFromHumanReadableString tests", function() {

    var model;
    before(function() {
        testData.resetLuid();
        model = testData.createModel();
    });

    describe("Serialize/deserialize onm.Address 'addressBook' (root namespace)", function() {
        var addressString, address;
        before(function() {
            addressString = model.createRootAddress().getHumanReadableString();
            address = model.createAddressFromHumanReadableString(addressString);
        });
        it("the deserialized result should be an onm.Address object", function() {
            assert.isNotNull(address);
            assert.instanceOf(address, onm.Address);
        });
        it("the deserialized onm.Address should be the root address", function() {
            assert.isTrue(address.isRoot());
        });
    });

    describe("serialize/deserialize onm.Address 'addressBook.properties' (child namespace)", function() {
        var addressA, addressB, addressString;
        before(function() {
            addressA = model.createPathAddress("addressBook.properties");
            addressString = addressA.getHumanReadableString();
            addressB = model.createAddressFromHumanReadableString(addressString);
        });
        it("the deserialized onm.Address should be the same as the source address", function() {
            assert.isNotNull(addressString);
            assert.instanceOf(addressB, onm.Address);
            assert.isTrue(addressA.isEqual(addressB));
        });
    });

    describe("serialize/deserialize onm.Address 'addressBook.contacts' (extension extension namespace", function() {
        var addressA, addressB, addressString;
        before(function() {
            addressA = model.createPathAddress("addressBook.contacts");
            addressString = addressA.getHumanReadableString();
            addressB = model.createAddressFromHumanReadableString(addressString);
        });
        it("the deserialized onm.Address should be the same as the source address", function() {
            assert.isNotNull(addressString);
            assert.instanceOf(addressB, onm.Address);
            assert.isTrue(addressA.isEqual(addressB));
        });
    });

    describe("serialize/deserialize unresolved onm.Address 'addressBook.contacts.contact'", function() {
        var addressA, addressB, addressString;
        before(function() {
            addressA = model.createPathAddress("addressBook.contacts.contact");
            addressString = addressA.getHumanReadableString();
            addressB = model.createAddressFromHumanReadableString(addressString);
        });
        it("the deserialized onm.Address should be the same as the source address", function() {
            assert.isNotNull(addressString);
            assert.instanceOf(addressB, onm.Address);
            assert.isTrue(addressA.isEqual(addressB));
        });
    });

    describe("serialize/deserialize resolved onm.Address 'addressBook.contacts.UUID.contact'", function() {
        var store;
        var addressA, addressB, addressString;

        before(function() {
            store = testData.createStore();
            addressA = store.createComponent(model.createPathAddress("addressBook.contacts.contact")).getResolvedAddress();
            addressString = addressA.getHumanReadableString();
            addressB = model.createAddressFromHumanReadableString(addressString);
        });
        it("the deserialized onm.Address should be the same as the source address", function() {
            assert.isNotNull(addressString);
            assert.instanceOf(addressB, onm.Address);
            assert.isTrue(addressA.isEqual(addressB));
        });
    });

    describe("serialize/deserialize unresolved onm.Address 'addressBook.properties.subproperties.collection.someObject'", function() {
        var addressA, addressB, addressString;
        before(function() {
            addressA = model.createPathAddress("addressBook.properties.subproperties.collection.someObject");
            addressString = addressA.getHumanReadableString();
            addressB = model.createAddressFromHumanReadableString(addressString);
        });
        it("the deserialized onm.Address should be the same as the source address", function() {
            assert.isNotNull(addressString);
            assert.instanceOf(addressB, onm.Address);
            assert.isTrue(addressA.isEqual(addressB));
        });
    });

    describe("serialize/deserialize resolved onm.Address 'addressBook.properties.subproperties.collection.UUID.somObject'", function() {
        var store;
        var addressA, addressB, addressString;

        before(function() {
            store = testData.createStore();
            addressA = store.createComponent(model.createPathAddress("addressBook.properties.subproperties.collection.someObject")).getResolvedAddress();
            addressString = addressA.getHumanReadableString();
            addressB = model.createAddressFromHumanReadableString(addressString);
        });
        it("the deserialized onm.Address should be the same as the source address", function() {
            assert.isNotNull(addressString);
            assert.instanceOf(addressB, onm.Address);
            assert.isTrue(addressA.isEqual(addressB));
        });
    });

    

});

