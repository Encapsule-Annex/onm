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

var moduleUnderTest = require('../lib/impl/onm-namespace-resolver');

module.exports = describe("'resolveNamespaceDescriptorOpen' function export tests.", function() {

    var resolveResults = null;
    var descriptorResolveOptions = {
        parentDataReference: { 'addressBook': {} },
        targetNamespaceDescriptor: testDataRootDescriptor
    };

    before(function(done_) {
        testData.resetLuid();
        var functionUnderTest = function() {
            resolveResults = moduleUnderTest.resolveNamespaceDescriptorOpen(descriptorResolveOptions);
        };
        assert.doesNotThrow(functionUnderTest);
        done_();
    });

    it("Function call should have returned an object.", function() {
        assert.isDefined(resolveResults);
        assert.isNotNull(resolveResults);
        assert.isObject(resolveResults);
    });

    it("The returned object should be a valid descriptor resolve results object.", function() {
        assert.isTrue(moduleUnderTest.checkValidDescriptorResolveResults(resolveResults));
    });

});


