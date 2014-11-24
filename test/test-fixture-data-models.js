// test-onmd-fixtures.js
//

var Mocha = require('mocha');
var Chai = require('chai');
var assert = Chai.assert;
var withData = require('leche').withData;

var packageMeta = require('../package.json');
var onm = require('../index');

// Dynamic test suite for generically testing onm data model declarations.
var validateDataModelDeclaration = require('onm-data-model-tests').validateDataModelDeclaration


describe("onm v" + packageMeta.version + " test fixture regression test suite.", function() {
    it("The onm module should be defined.", function() {
        assert.isDefined(onm);
    });
    it("The onm module should not be null.", function() {
        assert.isNotNull(onm);
    });
    it("The onm module should be an object.", function() {
        assert.isObject(onm);
    });
    describe("Verify onm data model declarations used by onm's internal test suite.", function() {
        var inputTestDataVector = {};
        var addDataModelToTestSuite = function(testName_, dataModelDeclaration_) {
            var testDescriptor = inputTestDataVector[testName_] = [];
            testDescriptor.push({
                testName: testName_,
                dataModelDeclaration: dataModelDeclaration_
            });
            return testDescriptor;
        };
        before(function(done_) {

            var loadAddressBookDataModelDeclaration = function() {
                var addressBookDataModelDeclaration = require('./fixture/address-book-data-model').modelDeclaration;
                addDataModelToTestSuite("Data model declaration '" + addressBookDataModelDeclaration.jsonTag + "'.", addressBookDataModelDeclaration);
            };

            var loadSemanticBindingsDataModelDeclaration = function() {
                var semanticBindingsDataModelDeclaration = require('./fixture/semantic-bindings-test-data-model');
                addDataModelToTestSuite("Data model declaration '" + semanticBindingsDataModelDeclaration.jsonTag + "'.", semanticBindingsDataModelDeclaration);
            };

            var loadSemanticBindingsDataModelDeclarationVariants = function() {
                var dataModelDeclarationVariants = require('./fixture/semantic-binding-variants');
                for (var testName in dataModelDeclarationVariants) {
                    var testDescriptor = dataModelDeclarationVariants[testName][0];
                    addDataModelToTestSuite(testDescriptor.testName, testDescriptor.dataModelDeclaration);
                }
            };

            assert.doesNotThrow(loadAddressBookDataModelDeclaration);
            assert.doesNotThrow(loadSemanticBindingsDataModelDeclaration);
            // We pick up coverage for the variants in the test-onm.Model-intrinsic-semantic-bindings.js module.
            // assert.doesNotThrow(loadSemanticBindingsDataModelDeclarationVariants);

            // EXECUTE DYNAMIC SUB-SUITES

            describe("Wrap it up mother fucker.", function() {
                before(function(done_) {
                    withData(inputTestDataVector, function(dataModelTestDescriptor_) {
                        validateDataModelDeclaration(dataModelTestDescriptor_.dataModelDeclaration, onm);
                    });
                    done_();
                });
                it("Wrap it.", function() { assert.isTrue(true); } );
            });

            done_();
        });

        it("Execute the test suite.", function() {
            assert.isTrue(true);
        });

    });
});


