// test-impl-onm-named-object-resolver.js
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

module.exports = describe("onm.Namespace implementation named object resolution white box tests.", function() {

    var moduleUnderTest = null;
    var moduleUnderTestImpl = null;

    before(function(done_) {
        testData.resetLuid();
        var loadModuleUnderTest = function() {
            moduleUnderTest = require('../lib/impl/onm-named-object-resolver');
        };
        assert.doesNotThrow(loadModuleUnderTest);
        done_();
    });

    it("The 'onm-named-object-resolver' module should have loaded.", function() {
        assert.isDefined(moduleUnderTest);
        assert.isNotNull(moduleUnderTest);
    });

    it("Module should export a function.", function() {
        assert.isFunction(moduleUnderTest);
    });

    require('./test-impl-onm-named-object-resolver-context-input');
    require('./test-impl-onm-named-object-resolver-context-output');
    require('./test-impl-onm-named-object-resolver-open');
    require('./test-impl-onm-named-object-resolver-create');

});

