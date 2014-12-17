// test-impl-onm.AddressTokenResolver.js
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


module.exports = describe("onm.AddressTokenResolver whitebox tests.", function() {

    var moduleUnderTest = null;

    before(function(done_) {

        var loadModuleUnderTest = function() {
            moduleUnderTest = require('../lib/impl/onm-component-resolver');
        };

        assert.doesNotThrow(loadModuleUnderTest);
        done_();

    });

    it("The 'onm-token-resolver' module should have loaded.", function() {
        assert.isDefined(moduleUnderTest);
        assert.isNotNull(moduleUnderTest);
        assert.isObject(moduleUnderTest);
    });

    it("Module should export function (constructor) 'AddressTokenResolver'.", function() {
        assert.property(moduleUnderTest, 'AddressTokenResolver');
        assert.isFunction(moduleUnderTest.AddressTokenResolver);
    });

    it("Module should export function 'openTokenNamespace'.", function() {
        assert.property(moduleUnderTest, 'openTokenNamespace');
        assert.isFunction(moduleUnderTest.openTokenNamespace);
    });

    it("Module should export function 'createTokenNamespace'.", function() {
        assert.property(moduleUnderTest, 'createTokenNamespace');
        assert.isFunction(moduleUnderTest.createTokenNamespace);
    });

});

