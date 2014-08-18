// test-onm.Address.visitSubaddressesAscending.js
//

var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should;

var uuid = require('node-uuid');
var onm = require('../onm');

var testData = require('./fixture/test-data');

module.exports = describe("onm.Address.visitSubaddressesAscending tests", function() {
    describe("enumerate subaddresses of the root namespace", function() {
        var store, address;
        var subAddresses = [];
        var actualResult = null;
        var expectedResult = '["addressBook.properties","addressBook.contacts","addressBook.subproperties","addressBook.collection"]';
        before(function() {
            store = testData.createStore();
            address = store.model.createRootAddress();
            address.visitSubaddressesAscending( function(subAddress_) {
                subAddresses.push(subAddress_.getHumanReadableString());
            });
            actualResult = JSON.stringify(subAddresses);
            console.log(actualResult);
        });
        it("expecting two result address strings", function() {
            assert.equal(actualResult, expectedResult);
        });
    });


    describe("enumerate subaddresses of 'addressBook.properties'", function() {
        var store, address;
        var subAddresses = [];
        var actualResult = null;
        var expectedResult = '["addressBook.subproperties","addressBook.collection"]';
        before(function() {
            store = testData.createStore();
            address = store.model.createPathAddress("addressBook.properties");
            address.visitSubaddressesAscending( function(subAddress_) {
                subAddresses.push(subAddress_.getHumanReadableString());
            });
            actualResult = JSON.stringify(subAddresses);
            console.log(actualResult);
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
                subAddresses.push(subAddress_.getHumanReadableString());
            });
            actualResult = JSON.stringify(subAddresses);
            console.log(actualResult);
        });
        it("expecting no result addresses hashs strings", function() {
            assert.equal(actualResult, expectedResult);
        });
    });


});