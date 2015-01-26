// test-core-component-resolver.js

var Mocha = require('mocha');
var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should;

var testDataFixture = require('../../fixture/address-book-data-model');
var componentResolver = require('../../../lib/impl/onm-component-resolver');

/*
  testOptions: {
      strategyName: ''
      operationName: ''
      targetNamespace: ''
      inputOptions: {}
      validOptions: true
      resultExpectations: {
          resolvedNamedObjectCount: 1
          pendingSubcomponentCount: 0
          dataChangeEventJournalCount: 0
          JSON: {
              namespace: ''
              parent: ''
              journal: ''
          }
      }
  }
*/



module.exports = function (testOptions_) {

    var testName = "Component resolver use case: strategy=" + 
        testOptions_.strategyName + " operation=" + testOptions_.operationName +
        " on " + testOptions_.targetNamespace + " namespace.";

    describe(testName, function() {

        var outputResults = null;

        var functionUnderTestWrapper = function() {
            outputResults = componentResolver.resolve(testOptions_.inputOptions);
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

        it("namedObjectResolutionVector is expected to contain " + testOptions_.resultExpectations.resolvedNamedObjectCount + " resoved named object(s).", function() {
            assert.equal(outputResults.namedObjectResolutionVector.length, testOptions_.resultExpectations.resolvedNamedObjectCount);
        });

        it("pendingSubcomponentStack is expected to contain " + testOptions_.resultExpectations.pendingSubcomponentResolutionCount + " pending component resolution requests.", function() {
            assert.equal(outputResults.pendingSubcomponentStack.length, testOptions_.resultExpectations.pendingSubcomponentCount);
        });

        it("dataChangeEventJournal is expected to contain " + testOptions_.resultExpectations.dataChangeEventJournalCount + " change event descriptors.", function() {
            assert.equal(outputResults.dataChangeEventJournal.length, testOptions_.resultExpectations.dataChangeEventJournalCount);
        });

        it("Resolved component data JSON should match verification data.", function() {
            var rnoi = outputResults.namedObjectResolutionVector.length - 1;
            var actualResult = JSON.stringify(outputResults.namedObjectResolutionVector[rnoi].output.namespaceDataReference);
            assert.equal(actualResult, testOptions_.resultExpectations.JSON.namespace);
        });

        it("Reference parent namespace data JSON should match verifcation data.", function() {
            var actualResult = JSON.stringify(testOptions_.inputOptions.parentDataReference);
            assert.equal(actualResult,testOptions_.resultExpectations.JSON.parent);
        });

        it("The resolved component's change journal should match verification data.", function() {
            var actualResult = JSON.stringify(outputResults.dataChangeEventJournal);
            assert.equal(actualResult, testOptions_.resultExpectations.JSON.journal);
        });

    });

};

