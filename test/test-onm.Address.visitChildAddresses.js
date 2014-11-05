// test-onm.Address.visitChildAddresses.js
//

var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should;

var uuid = require('node-uuid');
var onm = require('../onm');

var testData = require('./fixture/address-book-data-model');

module.exports = describe("onm.Address.visitChildAddresses tests", function() {
    describe("enumerate children of 'addressBook'", function() {
        var store, address;
        var childAddresses = [];
        var actualResult;
        var expectedResult;
        before( function() {
            testData.resetLuid();
            expectedResult = '["addressBook.properties","addressBook.contacts"]';
            store = testData.createStore();
            address = store.model.createRootAddress();
            address.visitChildAddresses( function(childAddress_) {
                childAddresses.push(childAddress_.getHumanReadableString());
            });
            actualResult = JSON.stringify(childAddresses);
            console.log(actualResult);
        });
        it("expecting the actual result to match the expected result", function() {
            assert.equal(actualResult, expectedResult);
        });
    });
    describe("enumerate children of 'addressBook.properties'", function() {
        var store, address;
        var childAddresses = [];
        var actualResult;
        var expectedResult;
        before( function() {
            expectedResult = '["addressBook.properties.subproperties"]';
            store = testData.createStore();
            address = store.model.createPathAddress("addressBook.properties");
            address.visitChildAddresses( function(childAddress_) {
                childAddresses.push(childAddress_.getHumanReadableString());
            });
            actualResult = JSON.stringify(childAddresses);
            console.log(actualResult);
        });
        it("expecting the actual result to match the expected result", function() {
            assert.equal(actualResult, expectedResult);
        });
    });
    describe("enumerate children of 'addressBook.contacts'", function() {
        var store, address;
        var childAddresses = [];
        var actualResult;
        var expectedResult;
        before( function() {
            expectedResult = '[]';
            store = testData.createStore();
            address = store.model.createPathAddress("addressBook.contacts");
            address.visitChildAddresses( function(addressChild_) {
                childAddresses.push(addressChild_.getHumanReadableString());
            });
            actualResult = JSON.stringify(childAddresses);
            console.log(actualResult);
        });
        it("expecting actual result to matach expected result", function() {
            assert.equal(actualResult, expectedResult);
        });
    });


    describe("enumerate child namespaces of a completely unresolved component address", function() {

        var store, model, address;
        var childAddresses = [];
        var actualResult = null;
        var expectedResult;
        before(function() {
            expectedResult = '["addressBook.contacts.-.contact.emails","addressBook.contacts.-.contact.addresses","addressBook.contacts.-.contact.phoneNumbers"]';
            model = testData.createModel();
            address = model.createPathAddress("addressBook.contacts.contact");
            address.visitChildAddresses( function (addressChild_) {
                childAddresses.push(addressChild_.getHumanReadableString());
            });
            actualResult = JSON.stringify(childAddresses);
            console.log(actualResult);
        });
        it("expecting actual result to match the expected result", function() {
            assert.equal(actualResult, expectedResult);
        });

        describe("now create a component, and repeat the test using a partially-resolved address", function() {

            var addressContact;
            var childAddresses = [];
            var actualResult = null;
            var expectedResult;

            before(function() {
                expectedResult = '["addressBook.contacts.1.contact.addresses.-.address.notes"]';
                store = testData.createStore();
                var namespace = store.createComponent(address);
                addressContact = namespace.getResolvedAddress();
                console.log(addressContact.getHumanReadableString());
                addressContact.visitChildAddresses( function (addressChild_) {
                    childAddresses.push(addressChild_.getHumanReadableString());
                });
                actualResult = JSON.stringify(childAddresses);
                console.log(actualResult);
            });

            it("expecting actual result to match the expected result", function() {
                assert.notEqual(actualResult, expectedResult);
            });

            it("expecting 'addressContact' to be resolvable", function() {
                assert.isTrue(addressContact.isResolvable());
            });


            describe("further extend the resovled address and repeat the test", function() {

                var childAddresses = [];
                var actualResult = null;
                var expectedResult = '["addressBook.contacts.1.contact.addresses.-.address.notes"]';

                before(function() {
                    var address = addressContact.createSubpathAddress("addresses.address");
                    console.log("target address " + address.getHumanReadableString());
                    address.visitChildAddresses( function (addressChild_) {
                        childAddresses.push(addressChild_.getHumanReadableString());
                    })
                    actualResult = JSON.stringify(childAddresses);
                    console.log(actualResult);

                });

                it("expecting actual result to match the expected result", function() {
                    assert.equal(actualResult, expectedResult);
                });

            });
            
        });

    });


});
