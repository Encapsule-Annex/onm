// test-onm.AddressTokenResolver.js
//

var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should;
var withData = require('leche').withData;

var uuid = require('node-uuid');
var onm = require('../index');
var testData = require('./fixture/address-book-data-model');

var testDataModel = testData.createModel();
var testDataRootAddress = testDataModel.createRootAddress();
var testDataRootToken = testDataRootAddress.implementation.getLastToken();



var testSpecifications = {

    "Missing constructor options": [
        {
            constructorOptions: null,
            validConfig: false
        }
    ],

    "Malformed constructor options (missing everything)": [
        {
            constructorOptions: {
            },
            validConfig: false
        }
    ],

    "Malformed constructor options (bad mode)": [
        {
            constructorOptions: {
                model: testDataModel,
                parentDataReference: {},
                token: testDataRootToken,
                mode: "no-such-mode",
                propertyAssignmentObject: {}
            },
            validConfig: false
        }
    ],

};



var AddressTokenResolver2 = require('../lib/implementation/onm-address-token-resolver2');

module.exports = describe("onm.AddressTokenResolver implementation object whitebox tests.", function() {

    var tokenResolverOptions = {};
    var tokenResolver = null;

    before(function(done_) {

        withData(testSpecifications, function(testSpecification_) {

            var addressTokenResolver = null;

            var functionUnderTest = function() {
                addressTokenResolver = new AddressTokenResolver2(testSpecification_.constructorOptions);
            };

            if (testSpecification_.validConfig) {
                it("Attempt to construct AddressTokenResolver object should not throw.", function() {
                    assert.doesNotThrow(functionUnderTest);
                });
            } else {
                it("Attempt to construct AddressTokenResolver object is expected to throw.", function() {
                    assert.throws(functionUnderTest);
                });
            }

        });

        done_();
    });

    it("Execute the test suite.", function() {
        assert.isTrue(true);
    });

});

