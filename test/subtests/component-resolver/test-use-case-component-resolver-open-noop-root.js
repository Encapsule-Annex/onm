// test-use-case-component-resolver-open-noop-root.js

var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should;

var componentResolver = require('../../../lib/impl/onm-component-resolver');

var testDataFixture = require('../../fixture/address-book-data-model');

var dataModel = testDataFixture.createModel();


var rootAddress = dataModel.createRootAddress();
var rootToken = rootAddress.implementation.getLastToken();


describe("Component resolver use case: open strategy/no operation on root namespace.", function() {

    var outputResults = null;

    var functionUnderTestWrapper = function() {
        outputResults = componentResolver.resolve({
            strategy: 'open',
            addressToken: rootToken,
            parentDataReference: { addressBook: { cairn: true } },
            propertyOptionsObject: {},
            semanticBindingsReference: dataModel.getSemanticBindings()
        });
    };

    before(function() {
        assert.doesNotThrow(functionUnderTestWrapper);
    });

    it("resolveComponent call should have returned an results object.", function() {
        assert.isNotNull(outputResults, "outputResults should not be null.");
        assert.isDefined(outputResults, "outputResults should be defined.");
        assert.isObject(outputResults, "outputResults should be an object.");
    });

    it("resolveComponent call results should define property 'namedObjectResolutionVector' of type array.", function() {
        assert.property(outputResults, 'namedObjectResolutionVector');
        assert.isArray(outputResults.namedObjectResolutionVector);
    });

    it("resolveComponent call results should define property 'pendingSubcomponentStack' of type array.", function() {
        assert.property(outputResults, 'pendingSubcomponentStack');
        assert.isArray(outputResults.pendingSubcomponentStack);
    });

    it("resolveComponent call results should define property 'dataChangeEventJournal' of type array.", function() {
        assert.property(outputResults, 'dataChangeEventJournal');
        assert.isArray(outputResults.dataChangeEventJournal);
    });





});



