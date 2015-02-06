// test-onm.Address.visitExtensionPointAddresses.js
//

var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should;

var uuid = require('node-uuid');
var onm = require('../index');

var testData = require('./fixture/address-book-data-model');

module.exports = describe("onm.Address.visitExtensionPointAddresses tests", function() {
    var store, address;
    before(function() {
        store = testData.createStore();
    });
    
    describe("enumerate extension point addresses of address 'addressBook'", function() {
        var extensionPointAddresses = [];
        var actualResult = [];
        var expectedResult = '["addressBook.properties.subproperties.collection","addressBook.contacts"]';
        before(function() {
            address = store.model.createRootAddress();
            address.visitExtensionPointAddresses(function(addressExtensionPoint_) {
                extensionPointAddresses.push(addressExtensionPoint_.getHumanReadableString());
            });
            actualResult = JSON.stringify(extensionPointAddresses);
            console.log(actualResult);
        });
        it("expecting two result addreses strings", function() {
            assert.equal(actualResult, expectedResult);
        });
    });

    describe("enumerate extension point addreses of address 'addressBook.properties'", function() {
        var address;
        var extensionPointAddresses = [];
        var actualResult = [];
        var expectedResult = '["addressBook.properties.subproperties.collection"]';
        before(function() {
            address = store.model.createPathAddress("addressBook.properties");
            address.visitExtensionPointAddresses(function(addressExtensionPoint_) {
                extensionPointAddresses.push(addressExtensionPoint_.getHumanReadableString());
            });
            actualResult = JSON.stringify(extensionPointAddresses);
            console.log(actualResult);
        });
        it("expecting one result address string", function() {
            assert.equal(actualResult, expectedResult);
        });
    });


    describe("enumerate extension point addreses of address 'addressBook.contacts'", function() {
        var address;
        var extensionPointAddresses = [];
        var actualResult = "";
        var expectedResult = '[]';
        before(function() {
            address = store.model.createPathAddress("addressBook.contacts");
            address.visitExtensionPointAddresses(function(addressExtensionPoint_) {
                extensionPointAddresses.push(addressExtensionPoint_.getHumanReadableString());
            });
            actualResult = JSON.stringify(extensionPointAddresses);
            console.log(actualResult);
        });
        it("expecting no result address string", function() {
            assert.equal(actualResult, expectedResult);
        });
    });

    describe("enumerate extension point addresses of address 'addressBook.contacts.contact'", function() {
        var address;
        var extensionPointAddresses = [];
        var actualResult = "";
        var expectedResult = '["addressBook.contacts.-.contact.emails","addressBook.contacts.-.contact.addresses","addressBook.contacts.-.contact.phoneNumbers"]';
        before(function() {
            address = store.model.createPathAddress("addressBook.contacts.contact");
            address.visitExtensionPointAddresses(function(addressExtensionPoint_) {
                assert.isFalse(addressExtensionPoint_.isResolvable());
                extensionPointAddresses.push(addressExtensionPoint_.getHumanReadableString());
            });
            actualResult = JSON.stringify(extensionPointAddresses);
            console.log(actualResult);
        });
        it("expecting a single address string", function() {
            assert.equal(actualResult, expectedResult);
        });

        describe("enumerate extension point addresses of address 'addressBook.contacts.contact.addresses.address'", function() {

            before(function() {
                while (extensionPointAddresses.length) {
                    extensionPointAddresses.pop();
                }
                actualResult = '';
                expectedResult = '["addressBook.contacts.-.contact.addresses.-.address.notes"]';
                address = store.model.createPathAddress("addressBook.contacts.contact.addresses.address");
                address.visitExtensionPointAddresses(function(addressExtensionPoint_) {
                    assert.isFalse(addressExtensionPoint_.isResolvable());
                    extensionPointAddresses.push(addressExtensionPoint_.getHumanReadableString());
                });
                actualResult = JSON.stringify(extensionPointAddresses);
                console.log(actualResult);
            });

            it("expecting a single address string", function() {
                assert.equal(actualResult, expectedResult);
            });

        });

    });

});

