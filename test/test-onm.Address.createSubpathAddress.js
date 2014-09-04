// test-onm.Address.createSubpathAddress.js
//

var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should;

var uuid = require('node-uuid');
var onm = require('../onm');

var testData = require('./fixture/test-data');

module.exports = describe("onm.Address.createSubpathAddress tests", function() {

    var model;

    before(function() {
        model = testData.createModel();
    });

    describe("Create a child address of the root namespace", function() {

        var addressActual, addressExpected;

        before(function() {
            var addressRoot = model.getRootAddress();
            addressActual = addressRoot.createSubpathAddress("contacts");
            addressExpected = model.createPathAddress("addressBook.contacts");
        });

    });

});