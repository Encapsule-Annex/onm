// test-impl-onm-descriptor-resolver.checkResults.js
//

var assert = require('chai').assert;
var withData = require('leche').withData;

var moduleUnderTest = require('../lib/impl/onm-namespace-resolver-context')

var testVector = {

    'Bad descriptor resolve results: Malformed result object 1': [{
        testData: { results: {} },
        validConfig: false
    }],

    'Bad descriptor resolve results: Malformed result object 2': [{
        testData: { results: {
            namespaceEffectiveKey: 'test'
        } },
        validConfig: false
    }],

    'Bad descriptor resolve results: Malformed result object 3': [{
        testData: { results: {
            namespaceEffectiveKey: 'test',
            namespaceDataReference: {}
        } },
        validConfig: false
    }],

    'Bad descriptor resolve results: Malformed result object 4': [{
        testData: { results: {
            namespaceEffectiveKey: 'test',
            namespaceDataReference: {},
            pendingNamespaceDescriptors: 'should be an array, not a string'
        } },
        validConfig: false
    }],

    'Good descriptor resolve results: Correct result object 1': [{
        testData: { results: {
            namespaceEffectiveKey: 'test',
            namespaceDataReference: {},
            pendingNamespaceDescriptors: []
        } },
        validConfig: true
    }]
};

module.exports = describe("'checkValidDescriptorResolveResults' function export test suite.", function() {
 
    before(function(done_) {
        withData(testVector, function(inputData_) {
            var result = null;
            before(function(done_) {
                var functionUnderTest = function() {
                    result = moduleUnderTest.checkValidDescriptorResolveResults(inputData_.testData.results);
                };
                assert.doesNotThrow(functionUnderTest);
                done_();
            });
            it("Check valid function call result value should be '" + inputData_.validConfig + "'.", function() {
                assert.equal(result, inputData_.validConfig);
            });
        });
        done_();
    });
    it("Execute the test suite.", function() {
        assert.isTrue(true);
    });
});

