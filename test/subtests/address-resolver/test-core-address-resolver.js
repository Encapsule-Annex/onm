// test-core-address-resolver.js
//

var onm = require('../../../index');
var addressResolver = require('../../../lib/impl/onm-address-resolver');
var assert = require('chai').assert;

module.exports = function (testOptions_) {

    var outputResults = null;
    var callError = null;

    if (!testOptions_.expectCallToThrow && !testOptions_.resultExpectations) {
        throw new Error("Test options are invalid. If the function call is expected to succeed, you must define the expected results object.");
    }

    try {
        outputResults = addressResolver.resolve(testOptions_.inputOptions);
    } catch (exception_) {
        callError = exception_
    }

    var testName = "Address resolver use case: strategy=" + 
        testOptions_.strategyName + " operation=" + testOptions_.operationName +
        " on " + testOptions_.targetNamespace + " namespace.";

    describe(testName, function() {

        if (testOptions_.expectCallToThrow) {
            it("Call to addressResolver.resolve threw an exception as expected.", function() {
                assert.isNotNull(callError);
                assert.instanceOf(callError, Error);
            });

            it("The results object is expected to be null.", function() {
                assert.isNull(outputResults);
            });
        } else {

            it("Call to addressResolver.resolve is expected not to throw an exception.", function() {
                assert.isNull(callError);
            });

            describe("Verify the outer signature of the addressResolver.resolve function call result.", function() {

                it("Call should have returned an results object.", function() {
                    assert.isNotNull(outputResults, "outputResults should not be null.");
                    assert.isDefined(outputResults, "outputResults should be defined.");
                    assert.isObject(outputResults, "outputResults should be an object.");
                });


                it("Call results should define property 'resolvedComponentVector' of type array.", function() {
                    assert.property(outputResults, 'resolvedComponentVector');
                    assert.isArray(outputResults.resolvedComponentVector);
                });

                it("Call results should define property 'dataChangeEventJournal' of type array.", function() {
                    assert.property(outputResults, 'dataChangeEventJournal');
                    assert.isArray(outputResults.dataChangeEventJournal);
                });

                describe("Verify the function call result object against control values for this use case.", function() {

                    it("resolvedComponentVector is execpted to contain " + testOptions_.resultExpectations.resolvedComponentCount + " resoved component object(s).", function() {
                        assert.equal(outputResults.resolvedComponentVector.length, testOptions_.resultExpectations.resolvedComponentCount);
                    });

                    it("dataChangeEventJournal is expected to contain " + testOptions_.resultExpectations.dataChangeEventJournalCount + " change event descriptor(s).", function() {
                        assert.equal(outputResults.dataChangeEventJournal.length, testOptions_.resultExpectations.dataChangeEventJournalCount);
                    });

                    it("Resolved address data JSON should match verification data.", function() {
                        var dataReference = addressResolver.getResolvedNamedObjectReference(outputResults);
                        var actualResult = JSON.stringify(dataReference);
                        console.log(JSON.stringify(dataReference, undefined, 4));
                        assert.equal(actualResult, testOptions_.resultExpectations.JSON.namespace);
                    });

                    it("Reference parent namespace data JSON should match verifcation data.", function() {
                        var actualResult = JSON.stringify(testOptions_.inputOptions.parentDataReference);
                        console.log(JSON.stringify(testOptions_.inputOptions.parentDataReference, undefined, 4));
                        assert.equal(actualResult,testOptions_.resultExpectations.JSON.parent);
                    });

                    it("The resolved component's change journal should match verification data.", function() {
                        var actualResult = JSON.stringify(outputResults.dataChangeEventJournal);
                        console.log(JSON.stringify(outputResults.dataChangeEventJournal, undefined, 4));
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

