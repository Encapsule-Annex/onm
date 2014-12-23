// test-impl-onm-descriptor-resolve.js
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

module.exports = describe("onm.NamespaceDescriptorResolver white box tests.", function() {

    var moduleUnderTest = null;
    var moduleUnderTestImpl = null;

    before(function(done_) {
        testData.resetLuid();
        var loadModuleUnderTest = function() {
            moduleUnderTest = require('../lib/impl/onm-namespace-resolver');
            moduleUnderTestImpl = require('../lib/impl/onm-namespace-resolver-impl');
        };
        assert.doesNotThrow(loadModuleUnderTest);
        done_();
    });

    it("The 'onm-namespace-resolver' module should have loaded.", function() {
        assert.isDefined(moduleUnderTest);
        assert.isNotNull(moduleUnderTest);
        assert.isObject(moduleUnderTest);
    });

    it("Module should export function 'resolveNamespaceDescriptorOpen'.", function() {
        assert.property(moduleUnderTest, 'resolveNamespaceDescriptorOpen');
        assert.isFunction(moduleUnderTest.resolveNamespaceDescriptorOpen);
    });

    it("Module should export function 'resolveNamespaceDescriptorCreate'.", function() {
        assert.property(moduleUnderTest, 'resolveNamespaceDescriptorCreate');
        assert.isFunction(moduleUnderTest.resolveNamespaceDescriptorCreate);
    });

    it("Module impl should export function 'checkValidDescriptorResolveOptions'.", function() {
        assert.property(moduleUnderTestImpl, 'checkValidDescriptorResolveOptions');
        assert.isFunction(moduleUnderTestImpl.checkValidDescriptorResolveOptions);
    });

    it("Module should export function 'checkValidDescriptorResolveResults.", function() {
        assert.property(moduleUnderTestImpl, 'checkValidDescriptorResolveResults');
        assert.isFunction(moduleUnderTestImpl.checkValidDescriptorResolveResults);
    });

    require('./test-onm-namespace-resolver.options');
    require('./test-onm-namespace-resolver.results');
    require('./test-onm-namespace-resolver.open');
    require('./test-onm-namespace-resolver.create');

});
