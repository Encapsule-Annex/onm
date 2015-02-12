// test-onm.Address.isParent
//

var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should;

var uuid = require('node-uuid');
var onm = require('../index');

var testData = require('./fixture/address-book-data-model');

module.exports = describe("onm.Address.isParent tests", function() {
    var store, address1, address2;
    before(function() {
        store = testData.createStore();
    });        
    describe("determine if the root address is a parent of the root address", function() {
        before(function() {
            address1 = address2 = store.model.createRootAddress();
        });
        it("address1.isParent(address2) === false", function() {
            assert.isFalse(address1.isParent(address2));
        });
        it("address2.isParent(address1) === false", function() {
            assert.isFalse(address2.isParent(address1));
        });
    });

    describe("determine if 'addressBook' is a parent of 'addressBook.contacts'", function() {
        before(function() {
            address1 = store.model.createRootAddress();
            address2 = address1.createSubpathAddress("contacts");
        });
        it("address1.isParent(address2) === true", function() {
            assert.isTrue(address1.isParent(address2));
        });
        it("address2.isParent(address1) === false", function() {
            assert.isFalse(address2.isParent(address1));
        });
    });

    describe("determine if 'addressBook.properties' is a parent of 'addressBook.contacts.key.contact'", function() {
        var newContactAddress;
        before(function() {
            address1 = store.model.createPathAddress("addressBook.properties");
            newContactAddress = store.model.createPathAddress("addressBook.contacts.contact");
            address2 = store.nsCreate(newContactAddress).address();
        });
        it("address1.isParent(address2) === false", function() {
            assert.isFalse(address1.isParent(address2));
        });
        it("address2.isParent(address1) === false", function() {
            assert.isFalse(address2.isParent(address1));
        });
        it("newContactAddress.isParent(address2) === false", function() {
            // newContactAddress is not resolvable (because it's unqualified)
            assert.isFalse(newContactAddress.isParent(address2));
        });
        it("determine if the root address is a parent of the newly-created contact", function() {
            assert.isTrue(store.model.createRootAddress().isParent(address2));
        });
        it("determine if the root address is a parent of 'addressBook.properties'", function() {
            assert.isTrue(store.model.createRootAddress().isParent(address1));
        });
        it("determine if the root address is a parent of newContactAddress", function() {
            assert.isTrue(store.model.createRootAddress().isParent(newContactAddress));
        });
        it("determine if the newContactAddress is a parent of the root", function() {
            assert.isFalse(newContactAddress.isParent(store.model.createRootAddress()));
        });
    });
});

