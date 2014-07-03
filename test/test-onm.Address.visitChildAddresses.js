// test-onm.Address.visitChildAddresses.js
//

var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should;

var uuid = require('node-uuid');
var onm = require('../onm');

var testData = require('./fixture/test-data');

module.exports = describe("onm.Address.visitChildAddresses tests", function() {
    describe("enumerate children of 'addressBook'", function() {
        var store, address;
        var childAddresses = [];
        var actualResult;
        var expectedResult = '["addressBook.properties","addressBook.contacts"]';
        before( function() {
            store = testData.createStore();
            address = store.model.createRootAddress();
            address.visitChildAddresses( function(childAddress_) {
                childAddresses.push(childAddress_.getHumanReadableString());
            });
            actualResult = JSON.stringify(childAddresses);
            console.log(actualResult);
        });
        it("expecting two result addresses hashs strings", function() {
            assert.equal(actualResult, expectedResult);
        });
    });
    describe("enumerate children of 'addressBook.properties'", function() {
        var store, address;
        var childAddresses = [];
        var actualResult;
        var expectedResult = '["addressBook.subproperties"]';
        before( function() {
            store = testData.createStore();
            address = store.model.createPathAddress("addressBook.properties");
            address.visitChildAddresses( function(childAddress_) {
                childAddresses.push(childAddress_.getHumanReadableString());
            });
            actualResult = JSON.stringify(childAddresses);
            console.log(actualResult);
        });
        it("expecting one result addresses hash string", function() {
            assert.equal(actualResult, expectedResult);
        });
    });
    describe("enumerate children of 'addressBook.contacts'", function() {
        var store, address;
        var childAddresses = [];
        var actualResult;
        var expectedResult = '[]';
        before( function() {
            store = testData.createStore();
            address = store.model.createPathAddress("addressBook.contacts");
            address.visitChildAddresses( function(childAddress_) {
                childAddresses.push(childAddress_.getHumanReadableString());
            });
            actualResult = JSON.stringify(childAddresses);
            console.log(actualResult);
        });
        it("expecting no result addresses hashs strings", function() {
            assert.equal(actualResult, expectedResult);
        });
    });
});
