// trest-impl-onm-descriptor-resovler.resolveCreate.js
//

var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should;
var withData = require('leche').withData;

var uuid = require('node-uuid');
var onm = require('../index');
var testDataModule = require('./fixture/address-book-data-model');

var testDataModel = testDataModule.createModel();
var semanticBindingsObject = testDataModel.getSemanticBindings();

var rootAddress = testDataModel.createRootAddress();
var rootDescriptor = rootAddress.implementation.getDescriptor();
var childDescriptor = rootAddress.implementation.getModelDescriptorFromSubpath("properties");
var extensionPointDescriptor = rootAddress.implementation.getModelDescriptorFromSubpath("contacts");
var componentDescriptor = rootAddress.implementation.getModelDescriptorFromSubpath("contacts.contact");

var moduleUnderTest = require('../lib/implementation/onm-descriptor-resolve');

// Test dimensions for resolve descriptor create
// - namespace type: root, child, extension point, component
// - target namespace key: undefined, defined, mismatch
// - property assignment: undefined, prop subset, prop superset, prop disjoint set simple, prop disjoint set compount
// - subobject assignment: undefined, child, extension point, component

var testDataVector = {

    'Valid input options, root namespace descriptor': [{
        options: {
            parentDataReference: {},
            targetNamespaceDescriptor: rootDescriptor,
            targetNamespaceKey: '',
            propertyAssignmentObject: {},
            semanticBindingsReference: semanticBindingsObject
        },
        validConfig: true
    }],
    'Valid input options, child namespace descriptor': [{
        options: {
            parentDataReference: {},
            targetNamespaceDescriptor: childDescriptor,
            targetNamespaceKey: '',
            propertyAssignmentObject: {},
            semanticBindingsReference: semanticBindingsObject
        },
        validConfig: true
    }],
    'Valid input options, extension point namespace descriptor': [{
        options: {
            parentDataReference: {},
            targetNamespaceDescriptor: extensionPointDescriptor,
            targetNamespaceKey: '',
            propertyAssignmentObject: {},
            semanticBindingsReference: semanticBindingsObject
        },
        validConfig: true
    }],
    'Valid input options, component namespace descriptor': [{
        options: {
            parentDataReference: {},
            targetNamespaceDescriptor: componentDescriptor,
            targetNamespaceKey: '',
            propertyAssignmentObject: {},
            semanticBindingsReference: semanticBindingsObject
        },
        validConfig: true
    }],

};



module.exports = describe("'resolveNamespaceDescriptorCreate' function export tests.", function() {

    before(function(done_) {

        withData(testDataVector, function(testData) {

            var testName = "Attempt to resolve the namespace descriptor '" +
                testData.options.targetNamespaceDescriptor.jsonTag + "' of type '" +
                testData.options.targetNamespaceDescriptor.namespaceType + "'.";

            describe(testName, function() {

                var resolveResults = null;

                before(function(done_) {

                    testDataModule.resetLuid();

                    var functionUnderTest = function() {
                        resolveResults = moduleUnderTest.resolveNamespaceDescriptorCreate(testData.options);
                    };
                    if (testData.validConfig) {
                        assert.doesNotThrow(functionUnderTest);
                    } else {
                        assert.throws(functionUnderTest);
                    }
                    done_();
                });

                if (!testData.validConfig) {
                    it("Execute the test setup which is expected to throw (concluding this test suite).", function() {
                        assert.isTrue(true);
                    });
                } else {

                    it("Function call should have returned an object.", function() {
                        assert.isDefined(resolveResults);
                        assert.isNotNull(resolveResults);
                        assert.isObject(resolveResults);
                    });

                    it("The returned object should be a valid descriptor resolve results object.", function() {
                        assert.isTrue(moduleUnderTest.checkValidDescriptorResolveResults(resolveResults));
                    });

                    switch (testData.options.targetNamespaceDescriptor.namespaceType) {
                    case 'root':
                    case 'child':
                    case 'extensionPoint':
                        it("Resolve results effective namespace key should be '" + testData.options.targetNamespaceDescriptor.jsonTag + "'.", function() {
                            assert.equal(testData.options.targetNamespaceDescriptor.jsonTag, resolveResults.namespaceEffectiveKey);
                        });
                        break;
                    case 'component':
                        it("Resolve results effective namespace key should not be '" + testData.options.targetNamespaceDescriptor.jsonTag + "'.", function() {
                            assert.notEqual(testData.options.targetNamespaceDescriptor.jsonTag, resolveResults.namespaceEffectiveKey);
                        });
                        break;
                    default:
                        break;
                    }

                    it("Verify that named child object '" + testData.options.targetNamespaceDescriptor.jsonTag + "' was created in the parent store object.", function() {
                        assert.property(testData.options.parentDataReference, resolveResults.namespaceEffectiveKey);
                        assert.isObject(testData.options.parentDataReference[resolveResults.namespaceEffectiveKey]);
                    });

                    it("Verify the integrity of the resolved child object '" + testData.options.targetNamespaceDescriptor.jsonTag + "' data reference.", function() {
                        assert.doesNotThrow(function() {
                            resolveResults.namespaceDataReference.test = "test property touched";
                        });
                        assert.property(testData.options.parentDataReference[resolveResults.namespaceEffectiveKey], 'test');
                        assert.equal(testData.options.parentDataReference[resolveResults.namespaceEffectiveKey].test, "test property touched");
                    });

                }

            });
        });
        done_();
    });
    it("Execute the test.", function() {
        assert.isTrue(true);
    });
});


