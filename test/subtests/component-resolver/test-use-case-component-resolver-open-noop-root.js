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

    var inputOptions = {
        strategy: 'open',
        addressToken: rootToken,
        parentDataReference: { addressBook: { cairn: true } },
        propertyOptionsObject: {},
        semanticBindingsReference: dataModel.getSemanticBindings()
    };

    var functionUnderTestWrapper = function() {
        outputResults = componentResolver.resolve(inputOptions);
    };

    before(function() {
        testDataFixture.resetLuid();
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

    it("namedObjectResolutionVector is expected to contain 1 resoved named object.", function() {
        assert.equal(outputResults.namedObjectResolutionVector.length, 1);
    });

    it("pendingSubcomponentStack is expected to contain 0 pending component resolution requests.", function() {
        assert.equal(outputResults.pendingSubcomponentStack.length, 0);
    });

    it("dataChangeEventJournal is expected to contain 0 change event descriptors.", function() {
        assert.equal(outputResults.dataChangeEventJournal.length, 0);
    });

    it("Resolved component data JSON should match verification data.", function() {
        var rnoi = outputResults.namedObjectResolutionVector.length - 1;
        var actualResult = JSON.stringify(outputResults.namedObjectResolutionVector[rnoi].output.namespaceDataReference);
        assert.equal(actualResult, '{"cairn":true}' );
    });

    it("Reference parent namespace data JSON should match verifcation data.", function() {
        var actualResult = JSON.stringify(inputOptions.parentDataReference);
        assert.equal(actualResult, '{"addressBook":{"cairn":true}}');
    });

    it("The resolved component's change journal should match verification data.", function() {
        var actualResult = JSON.stringify(outputResults.dataChangeEventJournal);
        assert.equal(actualResult, '[]');
    });

});



