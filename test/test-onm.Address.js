// address-tests.js

var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should;

var uuid = require('node-uuid');
var onm = require('../onm');

var testData = require('./fixture/test-data');

module.exports = describe("onm.Address.visit* method tests", function() {

    require('./test-onm.Address.isParent');
    require('./test-onm.Address.visitChildAddresses');
    require('./test-onm.Address.visitSubaddressesAscending');

});
