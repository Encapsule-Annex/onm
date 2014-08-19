// test-onm.Model.createAddressFromHumanReadableString.js
//

var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should;

var uuid = require('node-uuid');
var onm = require('../onm');

var testData = require('./fixture/test-data');

module.exports = describe("onm.Model.createAddressFromHumanReadableString tests", function() {

    var model;
    before(function() {
        model = testData.createModel();
    });

    describe("convert the root address string back to an onm.Address", function() {

        var addressString, address;
        before(function() {
            addressString = model.createRootAddress().getHumanReadableString();
            address = model.createAddressFromHumanReadableString(addressString);
        });

        it("the reconstituted onm.Address should be the root address", function() {
            assert.isTrue(address.isRoot());
        });
    });

});

