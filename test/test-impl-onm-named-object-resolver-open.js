// test-impl-onm-descriptor-resolver.resolveOpen.js
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

var functionUnderTest = require('../lib/impl/onm-named-object-resolver');
var moduleUnderTestImpl = require('../lib/impl/onm-named-object-context')

module.exports = describe("'resolveNamespaceDescriptorOpen' function export tests.", function() {

    var resolveResults = null;
    var descriptorResolveOptions = {
        strategy: 'open',
        parentDataReference: { 'addressBook': {} },
        targetNamespaceDescriptor: testDataRootDescriptor,
        semanticBindingsReference: testDataModel.getSemanticBindings(),
        propertyAssignmentObject: {}
    };

    before(function(done_) {
        testData.resetLuid();
        var functionUnderTestWrapper = function() {
            resolveResults = functionUnderTest(descriptorResolveOptions);
        };
        assert.doesNotThrow(functionUnderTestWrapper);
        done_();
    });

    it("Function call should have returned an object.", function() {
        assert.isDefined(resolveResults);
        assert.isNotNull(resolveResults);
        assert.isObject(resolveResults);
    });

    it("The returned object should be a valid descriptor resolve results object.", function() {
        assert.isTrue(moduleUnderTestImpl.checkValidContextOutput(resolveResults));
    });

});


