// test-impl-onm-descriptor-resolver.checkOptions.js
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
var testDataRootDescriptor = testDataRootToken.namespaceDescriptor;

var testVector = {

    'Bad params: missing parameters': [{
        testData: {},
        validConfig: false
    }],
    'Bad params: malformed open 1': [{
        testData: { options: {} },
        validConfig: false
    }],
    'Bad params: malformed open 2': [{
        testData: { options: { }, isOpenResolve: true },
        validConfig: false
    }],
    'Bad params: malformed open 3': [{
        testData: { options: { parentDataReference: {} }, isOpenResovle: true },
        validConfig: false
    }],
    'Bad params: malformed open 4': [{
        testData: { options: { parentDataReference: {}, targetNamespaceDescriptor: {} } },
        validConfig: false
    }],
    'Valid params: open options test 1': [{
        testData: { options: { parentDataReference: {}, targetNamespaceDescriptor: {} }, isOpenResolve: true },
        validConfig: true
    }]
};

var moduleUnderTest = require('../lib/implementation/onm-descriptor-resolve-impl');

module.exports = describe("'checkValidDescriptorResolveOptions' function export test suite.", function() {
    var testVector = {

        'Bad params: missing parameters': [{
            testData: {},
            validConfig: false
        }],
        'Bad params: malformed open 1': [{
            testData: { options: {} },
            validConfig: false
        }],
        'Bad params: malformed open 2': [{
            testData: { options: { }, isOpenResolve: true },
            validConfig: false
        }],
        'Bad params: malformed open 3': [{
            testData: { options: { parentDataReference: {} }, isOpenResovle: true },
            validConfig: false
        }],
        'Bad params: malformed open 4': [{
            testData: { options: { parentDataReference: {}, targetNamespaceDescriptor: {} } },
            validConfig: false
        }],
        'Valid params: open options test 1': [{
            testData: { options: { parentDataReference: {}, targetNamespaceDescriptor: {} }, isOpenResolve: true },
            validConfig: true
        }]
    };
    before(function(done_) {
        withData(testVector, function(inputData_) {
            var result = null;
            before(function(done_) {
                var functionUnderTest = function() {
                    result = moduleUnderTest.checkValidDescriptorResolveOptions(inputData_.testData.options, inputData_.testData.isOpenResolve);
                };
                assert.doesNotThrow(functionUnderTest);
                done_();
            });
            it("Result value should be '" + inputData_.validConfig + "'.", function() {
                assert.equal(result, inputData_.validConfig);
            });
        });
        done_();
    });
    it("Execute the test suite.", function() {
        assert.isTrue(true);
    });
});
