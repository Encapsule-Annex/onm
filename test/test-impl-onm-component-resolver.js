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

    var functionUnderTest  = null;

    before(function(done_) {

        var loadModuleUnderTest = function() {
            functionUnderTest = require('../lib/impl/onm-component-resolver');
        };

        assert.doesNotThrow(loadModuleUnderTest);
        done_();

    });

    it("The 'onm-token-resolver' module should have loaded.", function() {
        assert.isDefined(functionUnderTest);
        assert.isNotNull(functionUnderTest);
    });

    it("Module should export function (resolveComponent).", function() {
        assert.isFunction(functionUnderTest);
    });

});

