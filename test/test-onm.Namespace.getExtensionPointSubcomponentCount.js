// test-onm.Namespace.getExtensionPointSubcomponentCount.js
//

var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should;

var uuid = require('node-uuid');
var onm = require('../index');

var testData = require('./fixture/address-book-data-model');

module.exports = describe("onm.Namespace.getExtensionPointSubcomponentCount method tests", function() {
    var store, address, namespaceExtensionPoint;
    before(function() {
        testData.resetLuid();
        store = testData.createStore();
    });

    describe("get subcomponent count of empty extension point", function() {
        var count;
        before(function() {
            address = store.model.createPathAddress("addressBook.contacts");
            namespaceExtensionPoint = store.openNamespace(address);
        });
        it("subcomponent count should be zero", function() {
            assert.equal(0, namespaceExtensionPoint.getExtensionPointSubcomponentCount());
        });
    });

    describe("insert a component and get the subcomponent count of non-empty extension point", function() {
        var namespaceContact;
        before(function() {
            var addressNewContact = store.model.createPathAddress("addressBook.contacts.contact");
            namespaceContact = store.createComponent(addressNewContact);
        });
        it("subcomponent count should be one", function() {
            assert.equal(1, namespaceExtensionPoint.getExtensionPointSubcomponentCount());
        });
        it("subcomponent count of the new object should be zero", function() {
            assert.equal(0, namespaceContact.getExtensionPointSubcomponentCount());
        });
    });
});

