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
    var resolveComponent  = null;
    before(function(done_) {
        var loadModuleUnderTest = function() {
            resolveComponent = require('../lib/impl/onm-component-resolver');
        };
        assert.doesNotThrow(loadModuleUnderTest);
        done_();
    });
    it("The 'onm-token-resolver' module should have loaded.", function() {
        assert.isDefined(resolveComponent);
        assert.isNotNull(resolveComponent);
    });
    it("Module should export function (resolveComponent).", function() {
        assert.isFunction(resolveComponent);
    });

    describe("Component open test #1.", function() {

        input = {
            strategy: 'open',
            semanticBindingsReference: testDataModel.getSemanticBindings(),
            addressToken: testDataRootToken,
            parentDataReference: { addressBook: {} },
            propertyOptionsObject: {}
        };
        output = null;
        before(function() {
            var functionUnderTest = function() {
                outout = resolveComponent(input);
            };
            assert.doesNotThrow(functionUnderTest);
        });

        it("Execute the test suite.", function() {
            assert.isTrue(true);
        });
    });

    describe("Component open test #2.", function() {
    });

    describe("Component open test #3.", function() {
    });

});

