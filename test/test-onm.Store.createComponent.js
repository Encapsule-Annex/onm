// test-onm.Store.createComponent.js
//

var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should;
var uuid = require('node-uuid');
var onm = require('../onm');
var testData = require('./fixture/test-data');

module.exports = describe("onm.Store.createComponent method tests", function() {

    var store = null;
    var addressRoot = null;
    var badDataModel = null;
    var badAddress = null;

    before(function() {
        store = testData.createStore();
        assert.isNotNull(store);
        assert.instanceOf(store, onm.Store);
        addressRoot = store.model.createRootAddress();
        assert.isNotNull(addressRoot);
        assert.instanceOf(addressRoot, onm.Address);
        badDataModel = new onm.Model({ jsonTag: 'bogus' });
        badAddress = badDataModel.createRootAddress();
    });

    it("Attempt to call onm.Store.createComponent with a null onm.Address parameter should throw.", function() {
        assert.throws(function () { store.createComponent(); }, Error);
    });

    it("Attempt to call onm.Store.createComponent with an address of a non 'addressBook' data model should throw.", function() {
        assert.throws(function () { store.createComponent(badAddress); }, Error);
    });

    it("Attempt to call onm.Store.createComponent with a qualified address should throw.", function() {
        assert.throws(function() { store.createComponent(addressRoot); }, Error);
    });

    it("Attempt to call onm.Store.createComponent with a non-component address should throw.", function() {
        var address = addressRoot.createSubpathAddress('properties.subproperties');
        assert.throws(function() { store.createComponent(address); }, Error);
    });

    describe("Call onm.Store.createComponent to create a new 'contact'.", function() {

        var addressNewContact = null;
        var namespaceContact = null;

        before(function() {
            addressNewContact = addressRoot.createSubpathAddress("contacts.contact");
            namespaceContact  = store.createComponent(addressNewContact);
        });

        it("We should be able to create a contact component.", function() {
            assert.isDefined(namespaceContact);
            assert.isNotNull(namespaceContact);
            assert.instanceOf(namespaceContact, onm.Namespace);
        });

        describe("Call onm.Store.createComponent with a single-key key array parameter.", function() {
            var keyArray = [ 'test' ];
            before(function() {
                namespaceContact = store.createComponent(addressNewContact, keyArray);
            });
            it("We should be able to create a contact component.", function() {
                assert.isDefined(namespaceContact);
                assert.isNotNull(namespaceContact);
                assert.instanceOf(namespaceContact, onm.Namespace);
            });
        });

    });
});

