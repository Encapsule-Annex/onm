// test-impl-onm-descriptor-resolver.checkResults.js
//

var assert = require('chai').assert;
var withData = require('leche').withData;

var moduleUnderTest = require('../../../lib/impl/onm-named-object-context')

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
            pendingResolutionStack: 'should be an array, not a string'
        } },
        validConfig: false
    }],

    'Bad descriptor resolve results: Malformed result object 5': [{
        testData: { results: {
            strategyFollowed: 'error',
            namespaceEffectiveKey: 'test',
            namespaceDataReference: {},
            pendingResolutionStack: 'should be an array, not a string'
        } },
        validConfig: false
    }],

    'Bad descriptor resolve results: Malformed result object 6': [{
        testData: { results: {
            strategyFollowed: 'error',
            namespaceEffectiveKey: 'test',
            namespaceDataReference: {},
            pendingResolutionStack: 'should be an array, not a string',
            resolvedId: -1

        } },
        validConfig: false
    }],

    'Good descriptor resolve results: Correct result object 1': [{
        testData: { results: {
            strategyFollowed: 'open',
            namespaceEffectiveKey: 'test',
            namespaceDataReference: {},
            pendingResolutionStack: [],
            dataChangeEventJournal: [],
            resolvedId: 0
        } },
        validConfig: true
    }],
    'Good descriptor resolve results: Correct result object 2': [{
        testData: { results: {
            strategyFollowed: 'create',
            namespaceEffectiveKey: 'test',
            namespaceDataReference: {},
            pendingResolutionStack: [],
            dataChangeEventJournal: [],
            resolvedId: 1
        } },
        validConfig: true
    }]
};

module.exports = describe("'checkValidContextOutput' function export test suite.", function() {
 
    before(function(done_) {
        withData(testVector, function(inputData_) {
            var result = null;
            before(function(done_) {
                var functionUnderTest = function() {
                    result = moduleUnderTest.checkValidContextOutput(inputData_.testData.results);
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

