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
var testDataRootAddress = testDataModel.createRootAddress();
var testDataRootToken = testDataRootAddress.implementation.getLastToken();
var testDataRootDescriptor = testDataRootToken.namespaceDescriptor;

var moduleUnderTest = require('../lib/implementation/onm-descriptor-resolve');

module.exports = describe("'resolveNamespaceDescriptorCreate' function export tests.", function() {

    var resolveResults = null;
    var descriptorResolveOptions = {
        parentDataReference: {},
        targetNamespaceDescriptor: testDataRootDescriptor,
        targetNamespaceKey: '',
        propertyAssignmentObject: {
            key: 'testkey', 
            name: "Does he look like a bitch?",
            properties: {
                name: 'What does Marsellus Wallace look like?'
            },
            someRandomObject: {
                someProperty: 'this is a test',
                subobject: {
                    someProperty: 'this is another test'
                }
            }
        },
        semanticBindingsReference: testDataModel.getSemanticBindings()
    };

    before(function(done_) {
        var functionUnderTest = function() {
            resolveResults = moduleUnderTest.resolveNamespaceDescriptorCreate(descriptorResolveOptions);
        };
        assert.doesNotThrow(functionUnderTest);
        done_();
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
        assert.property(descriptorResolveOptions.parentDataReference, 'addressBook');
        assert.isObject(descriptorResolveOptions.parentDataReference.addressBook);
    });

    it("Verify the integrity of the resolved child object 'addressBook' data reference.", function() {
        assert.doesNotThrow(function() {
            resolveResults.namespaceDataReference.test = "test property touched";
        });
        assert.property(descriptorResolveOptions.parentDataReference.addressBook, 'test');
        assert.equal(descriptorResolveOptions.parentDataReference.addressBook.test, "test property touched");
    });

});


