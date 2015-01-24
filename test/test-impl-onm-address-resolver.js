// test-impl-onm-address-resolver.js
//

var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should;
var withData = require('leche').withData;

var uuid = require('node-uuid');
var onm = require('../index');
var testData = require('./fixture/address-book-data-model');

var testDataModel = testData.createModel();
var rootAddress = testDataModel.createRootAddress();
var testObjectAddress = rootAddress.createSubpathAddress("properties.subproperties.collection.someObject");

describe("Validate the behavior of the onm address resolver.", function() {

    var functionUnderTest = null;
    before(function() {
        var loadModule = function() {
            functionUnderTest = require('../lib/impl/onm-address-resolver');
        };
        assert.doesNotThrow(loadModule);
    });
    it("The onm-address-resolver module should have loaded.", function() {
        assert.isDefined(functionUnderTest);
        assert.isNotNull(functionUnderTest);
        assert.isFunction(functionUnderTest);
    });

    describe("Attempt to resolve the root address of an onm.Store using the 'create' strategy.", function() {

        var addressResolveOptions = null;
        var resolvedAddress = null;

        before(function() {

            addressResolveOptions = {
                strategy: 'create',
                parentDataReference: {},
                address: rootAddress,
                semanticBindingsReference: testDataModel.getSemanticBindings(),
                propertyAssignmentObject: { fuckyea: true, contacts: { joesmith: { firstName: 'Joe', lastName: 'Smith' } } }
            };
            var resolveAddress = function() {
                resolvedAddress = functionUnderTest(addressResolveOptions);
            };
            assert.doesNotThrow(resolveAddress);
        });

        it("Execute the test suite.", function() {
            assert.isTrue(true);
            console.log(JSON.stringify(resolvedAddress));
        });

    });


});
