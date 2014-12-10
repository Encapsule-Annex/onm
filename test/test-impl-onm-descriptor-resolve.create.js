// trest-impl-onm-descriptor-resovler.resolveCreate.js
//

var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should;
var withData = require('leche').withData;

var uuid = require('node-uuid');
var onm = require('../index');
var testData = require('./fixture/address-book-data-model');

var testDataModel = testData.createModel();
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

    'test': [{
        options: {
            parentDataReference: {},
            targetNamespaceDescriptor: rootDescriptor,
            targetNamespaceKey: '',
            propertyAssignmentObject: {},
            semanticBindingsReference: semanticBindingsObject
        },
        validConfig: true
    }]
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
                    var functionUnderTest = function() {
                        resolveResults = moduleUnderTest.resolveNamespaceDescriptorCreate(testData.options);
                    };
                    assert.doesNotThrow(functionUnderTest);
                });
                it("Function call should have returned an object.", function() {
                    assert.isDefined(resolveResults);
                    assert.isNotNull(resolveResults);
                    assert.isObject(resolveResults);
                });
                it("The returned object should be a valid descriptor resolve results object.", function() {
                    assert.isTrue(moduleUnderTest.checkValidDescriptorResolveResults(resolveResults));
                });
                it("Verify that named child object 'addressBook' was created in the parent store object.", function() {
                    assert.property(testData.options.parentDataReference, 'addressBook');
                    assert.isObject(testData.options.parentDataReference.addressBook);
                });
                it("Verify the integrity of the resolved child object 'addressBook' data reference.", function() {
                    assert.doesNotThrow(function() {
                        resolveResults.namespaceDataReference.test = "test property touched";
                    });
                    assert.property(testData.options.parentDataReference.addressBook, 'test');
                    assert.equal(testData.options.parentDataReference.addressBook.test, "test property touched");
                });
                it("Execute the test.", function() {
                    assert.isTrue(true);
                });                    
            });
        });
        done_();
    });
});


