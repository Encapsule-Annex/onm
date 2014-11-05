// test-dynamic-suite.js
//
// This is a sample Mocha test to experiment with techniques for generating
// dynamic test cases using ideas taken from:
//
// - https://stackoverflow.com/questions/22465431/how-can-i-dynamically-generate-test-cases-in-javascript-node
//

var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should;
var uuid = require('node-uuid');
var onm = require('../onm');
var testData = require('./fixture/test-data');
var async = require('async');

var asyncTestSuite = function(testData_, completionCallback_) {
    describe(testData_ + " test suite.", function() {
        it("Test data should not be null.", function(done_) {
            assert.isNotNull(testData_);
            done_();
            completionCallback_(null);
        });
    });
};


var testDataObjects = [ "red", "green", "blue", "yellow" ];

module.exports = async.eachSeries(testDataObjects, asyncTestSuite, function(error_) {
    console.log("async.each completed '" + error_ + "'.");
});

