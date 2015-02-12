// test-onm.Address.visitSubaddressesAscending.js
//

var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should;

var uuid = require('node-uuid');
var onm = require('../index');

var testData = require('./fixture/address-book-data-model');

module.exports = describe("onm.Address.visitSubaddressesAscending tests", function() {
    describe("enumerate subaddresses of the root namespace", function() {
        var store, address;
        var subAddresses = [];
        var actualResult = null;
        var expectedResult = '["onm-uri:431c97059a0240f9312f1b8854d58bfa:properties","onm-uri:431c97059a0240f9312f1b8854d58bfa:contacts","onm-uri:431c97059a0240f9312f1b8854d58bfa:properties.subproperties","onm-uri:431c97059a0240f9312f1b8854d58bfa:properties.subproperties.collection"]';
        before(function() {
            store = testData.createStore();
            address = store.model.createRootAddress();
            address.visitSubaddressesAscending( function(subAddress_) {
                subAddresses.push(subAddress_.uri());
            });
            actualResult = JSON.stringify(subAddresses);
        });
        it("expecting two result address strings", function() {
            assert.equal(actualResult, expectedResult);
        });
    });


    describe("enumerate subaddresses of 'addressBook.properties'", function() {
        var store, address;
        var subAddresses = [];
        var actualResult = null;
        var expectedResult = '["onm-uri:431c97059a0240f9312f1b8854d58bfa:properties.subproperties","onm-uri:431c97059a0240f9312f1b8854d58bfa:properties.subproperties.collection"]';
        before(function() {
            store = testData.createStore();
            address = store.model.createPathAddress("addressBook.properties");
            address.visitSubaddressesAscending( function(subAddress_) {
                subAddresses.push(subAddress_.uri());
            });
            actualResult = JSON.stringify(subAddresses);
        });
        it("expecting two result addresses hashs strings", function() {
            assert.equal(actualResult, expectedResult);
        });
    });


    describe("enumerate subaddresses of 'addressBook.contacts'", function() {
        var store, address;
        var subAddresses = [];
        var actualResult;
        var expectedResult = '[]';
        before( function() {
            store = testData.createStore();
            address = store.model.createPathAddress("addressBook.contacts");
            address.visitSubaddressesAscending( function(subAddress_) {
                subAddresses.push(subAddress_.uri());
            });
            actualResult = JSON.stringify(subAddresses);
        });
        it("expecting no result addresses hashs strings", function() {
            assert.equal(actualResult, expectedResult);
        });
    });


});