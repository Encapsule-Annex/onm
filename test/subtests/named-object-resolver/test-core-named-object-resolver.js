// test-core-named-object-resolver.js
//

var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should;

var namedObjectResolver = require('../../../lib/impl/onm-named-object-resolver');

module.exports = function (testOptions_) {

    if (!testOptions_.expectCallToThrow && !testOptions_.resultExpectations) {
        throw new Error("Test options are invalid. If the function call is expected to succeed, you must define the expected results object.");
    }

    var testName = "Named object resolver use case: strategy=" + 
        testOptions_.strategyName + " operation=" + testOptions_.operationName +
        " on " + testOptions_.targetNamespace + " namespace.";

    describe(testName, function() {

        resolveResult = null;

        var resolveNamedObjectWrapper = function() {
            resolveResults = namedObjectResolver.resolve(testOptions_.inputOptions);
        };

        before(function() {
            if (!testOptions_.expectCallToThrow) {
                assert.doesNotThrow(resolveNamedObjectWrapper);
            } else {
                assert.throws(resolveNamedObjectWrapper);
            }
        });

        if (testOptions_.expectCallToThrow) {
            // never get here if assert in before
            it("Call to namedObjectResolver.resolve function is expected to throw an exception.", function() {
                assert.isTrue(true);
            });
            it("The resolve result object is exepcted to be null.", function() {
                assert.isNull(resolveResult);
            });
        } else {
            it("Call to namedObjectResolver.resolve function is expected not to throw an exception.", function() {
                assert.isTrue(true);
            });

            it("Call is expected to have returned a non-null result of type object.", function() {
                assert.isNotNull(resolveResult);
                assert.isObject(resolveResult);
            });

            describe("Verify the named object resolver results object against control values for this use case.", function() {

                it("Strategy followed by the resolver is expected to be '" + testOptions_.resultExpectations.strategyFollowed + "'.", function() {
                    assert.equal(resolveResult.strategyFollowed, testOptions_.resultExpectations.strategyFollowed);
                });

                it("The resolved named object is expected to be named '" + testOptions_.resultExpectations.namespaceEffectiveKey + "'.", function() {
                    assert.equal(resolveResults.namespaceEffectiveKey, testOptions_.resultExpectations.namespaceEffectiveKey);
                });

                it("The resolved named object data reference JSON is expected to match verification data.", function() {
                    assert.equal(JSON.stringify(resolveResults.namespaceDataReference), testOptions_.resultExpectations.JSON.namespace);
                });

                it("The resolved named object's pending resolution stack is expected to contain " + testOptions_.resultExpectations.pendingSubobjectCount + ".", function() {
                    assert.equal(resolveResults.pendingResolutionStack.length, testOptions_.resultExpectations.pendingSubobjectCount);
                });

                it("the resolved named object's change journal should match verification data.", function() {
                    assert.equal(JSON.stringify(resolveResults.dataChangeEventJournal), testOptions_.resultExpectations.JSON.events);
                });

            });
        }

    });

};

