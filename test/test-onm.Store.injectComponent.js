// test-onm.Store.injectComponent.js
//

var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should;

var onm = require('../onm');

var testData = require('./fixture/test-data');

module.exports = describe("onm.Store.injectComponent method tests.", function() {

    var model = null;
    var store1 = null, store2 = null;
    var namespaceContact = null;
    var addressContacts = null;
    before(function() {
        testData.resetLuid();
        model = testData.createModel();
        store1 = testData.createStore();
        store2 = testData.createStore();
        addressContacts = model.createPathAddress("addressBook.contacts");
        var addressNewContact = addressContacts.createSubpathAddress("contact");
        namespaceContact = store1.createComponent(addressNewContact);
        assert.instanceOf(model, onm.Model);
        assert.instanceOf(store1, onm.Store);
        assert.instanceOf(store2, onm.Store);
        assert.instanceOf(namespaceContact, onm.Namespace);
    });

    it("We should not be able to inject a copy of the component over itself.", function() {
        assert.throws(function() { store1.injectComponent(addressContacts, namespaceContact); }, Error);
    });

    it("We should be able to inject a copy of the contact from store1 into store2.", function() {
        assert.instanceOf(store2.injectComponent(addressContacts, namespaceContact), onm.Namespace);
    });

    it("We should not be able to re-inject the contact from store1 into store2.", function() {
        assert.throws(function() { store2.injectComponent(addressContacts, namespaceContact); }, Error);
    });

});

