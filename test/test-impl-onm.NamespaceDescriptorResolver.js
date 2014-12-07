// test-impl-onm.NamespaceDescriptorResolver.js
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


module.exports = describe("onm.NamespaceDescriptorResolver whitebox tests.", function() {

    var moduleUnderTest = null;

    before(function(done_) {

        var loadModuleUnderTest = function() {
            moduleUnderTest = require('../lib/implementation/onm-descriptor-resolve');
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

    it("Module should export function 'checkValidDescriptorResolveOptions'.", function() {
        assert.property(moduleUnderTest, 'checkValidDescriptorResolveOptions');
        assert.isFunction(moduleUnderTest.checkValidDescriptorResolveOptions);
    });

    it("Module should export function 'checkValidDescriptorResolveResults.", function() {
        assert.property(moduleUnderTest, 'checkValidDescriptorResolveResults');
        assert.isFunction(moduleUnderTest.checkValidDescriptorResolveResults);
    });

});

