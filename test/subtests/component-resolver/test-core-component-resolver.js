// test-core-component-resolver.js
//

var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should;

var componentResolver = require('../../../lib/impl/onm-component-resolver');

/*
  testOptions: {
      strategyName: ''
      operationName: ''
      targetNamespace: ''
      inputOptions: {}
      expectCallToThrow: false
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

var countSparseArray = function(array_) {
    var index = array_.length;
    var count = 0
    while (--index >= -0) {
        if (array_[index] !== undefined) {
            count++;
        }
    }
    return count;
};

module.exports = function (testOptions_) {

    var outputResults = null;
    var callError = null;

    if (!testOptions_.expectCallToThrow && !testOptions_.resultExpectations) {
        throw new Error("Test options are invalid. If the function call is expected to succeed, you must define the expected results object.");
    }

    try {
        outputResults = componentResolver.resolve(testOptions_.inputOptions);
    } catch (exception_) {
        callError = exception_
    }

    var testName = "Component resolver use case: strategy=" + 
        testOptions_.strategyName + " operation=" + testOptions_.operationName +
        " on " + testOptions_.targetNamespace + " namespace.";

    describe(testName, function() {

        if (testOptions_.expectCallToThrow) {
            it("Call to componentResolver.resolve threw an exception as expected.", function() {
                assert.isNotNull(callError);
                assert.instanceOf(callError, Error);
            });

            it("The results object is expected to be null.", function() {
                assert.isNull(outputResults);
            });
        } else {

            it("Call to componentResolver.resolve is expected not to throw an exception.", function() {
                assert.isNull(callError);
            });

            describe("Verify the outer signature of the componentResolver.resolve function call result.", function() {

                it("Call should have returned an results object.", function() {
                    assert.isNotNull(outputResults, "outputResults should not be null.");
                    assert.isDefined(outputResults, "outputResults should be defined.");
                    assert.isObject(outputResults, "outputResults should be an object.");
                });

                it("Call results should define property 'namedObjectResolutionVector' of type array.", function() {
                    assert.property(outputResults, 'namedObjectResolutionVector');
                    assert.isArray(outputResults.namedObjectResolutionVector);
                });

                it("Call results should define property 'pendingSubcomponentStack' of type array.", function() {
                    assert.property(outputResults, 'pendingSubcomponentStack');
                    assert.isArray(outputResults.pendingSubcomponentStack);
                });

                it("Call results should define property 'dataChangeEventJournal' of type array.", function() {
                    assert.property(outputResults, 'dataChangeEventJournal');
                    assert.isArray(outputResults.dataChangeEventJournal);
                });

                describe("Verify the resoveComponent function call result object against control values for this use case.", function() {

                    it("namedObjectResolutionVector is expected to contain " + testOptions_.resultExpectations.resolvedNamedObjectCount + " resoved named object(s).", function() {
                        assert.equal(countSparseArray(outputResults.namedObjectResolutionVector), testOptions_.resultExpectations.resolvedNamedObjectCount);
                    });

                    it("pendingSubcomponentStack is expected to contain " + testOptions_.resultExpectations.pendingSubcomponentCount + " pending component resolution request(s).", function() {
                        assert.equal(outputResults.pendingSubcomponentStack.length, testOptions_.resultExpectations.pendingSubcomponentCount);
                    });

                    it("dataChangeEventJournal is expected to contain " + testOptions_.resultExpectations.dataChangeEventJournalCount + " change event descriptor(s).", function() {
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

            });

        }

    });

    return {
        outputResults: outputResults,
        callError: callError
    };

};

