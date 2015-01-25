// test-use-case-component-resolver-open-noop-root.js

var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should;

// Function under test.
var resolveComponent = require('../../../lib/impl/onm-component-resolver');

var testDataFixture = require('../../fixture/address-book-data-model');

var dataModel = testDataFixture.createModel();


var rootAddress = dataModel.createRootAddress();
var rootToken = rootAddress.implementation.getLastToken();


describe("Component resolver use case: open strategy/no operation on root namespace.", function() {

    var outputResults = null;

    var functionUnderTestWrapper = function() {
        outputResults = resolveComponent({
            strategy: 'open',
            addressToken: rootToken,
            parentDataReference: { addressBook: {} },
            propertyOptionsObject: {},
            semanticBindingsReference: dataModel.getSemanticBindings()
        });
    };

    before(function() {
        assert.doesNotThrow(functionUnderTestWrapper);
    });

    it("Execute the test suite.", function() {
        assert.isTrue(true);
    });

});



