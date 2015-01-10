// test-impl-onm-descriptor-resolver.checkOptions.js
//

var assert = require('chai').assert;
var withData = require('leche').withData;

var uuid = require('node-uuid');
var onm = require('../index');
var testData = require('./fixture/address-book-data-model');

var testDataModel = testData.createModel();
var testDataRootAddress = testDataModel.createRootAddress();
var testDataRootToken = testDataRootAddress.implementation.getLastToken();
var testDataRootDescriptor = testDataRootToken.namespaceDescriptor;

var moduleUnderTest = require('../lib/impl/onm-named-object-context')

var testVector = {

    'Bad descriptor resolve options: missing parameters': [{
        testData: {},
        validConfig: false
    }],
    'Bad descriptor resolve options: malformed open 1': [{
        testData: { options: {} },
        validConfig: false
    }],
    'Bad descriptor resolve options: malformed open 2': [{
        testData: { options: { }, isOpenResolve: true },
        validConfig: false
    }],
    'Bad descriptor resolve options: malformed open 3': [{
        testData: { options: { parentDataReference: {} }, isOpenResovle: true },
        validConfig: false
    }],
    'Bad descriptor resolve options: malformed open 4': [{
        testData: { options: { parentDataReference: {}, targetNamespaceDescriptor: {} } },
        validConfig: false
    }],
    'Bad descriptor resolve options: malformed open 5': [{
        // This fails because the descriptor object is not valid.
        testData: { options: { parentDataReference: {}, targetNamespaceDescriptor: {} }, isOpenResolve: true },
        validConfig: false
    }],
    'Good descriptor resolve options: valid open options': [{
        testData: { options: { parentDataReference: {}, targetNamespaceDescriptor: testDataRootDescriptor }, isOpenResolve: true },
        validConfig: true
    }],
    'Good descriptor resolve options: valid create options': [{
        testData: {
            options: {
                parentDataReference: {},
                targetNamespaceDescriptor: testDataRootDescriptor,
                targetNamespaceKey: '',
                semanticBindingsReference: testDataModel.getSemanticBindings(),
                propertyAssignmentObject: {}
            }
        },
        validConfig: true
    }]
};

module.exports = describe("'checkValidDescriptorResolveOptions' function export test suite.", function() {
 
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
