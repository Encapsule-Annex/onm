// test-impl-onm.NamespaceDescriptorResolver.js
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


module.exports = describe("onm.NamespaceDescriptorResolver whitebox tests.", function() {

    var moduleUnderTest = null;

    before(function(done_) {

        var loadModuleUnderTest = function() {
            moduleUnderTest = require('../lib/implementation/onm-descriptor-resolve');
        };

        assert.doesNotThrow(loadModuleUnderTest);
        done_();

    });

    it("The 'onm-namespace-resolver' module should have loaded.", function() {
        assert.isDefined(moduleUnderTest);
        assert.isNotNull(moduleUnderTest);
        assert.isObject(moduleUnderTest);
    });

    it("Module should export function 'resolveNamespaceDescriptorOpen'.", function() {
        assert.property(moduleUnderTest, 'resolveNamespaceDescriptorOpen');
        assert.isFunction(moduleUnderTest.resolveNamespaceDescriptorOpen);
    });

    it("Module should export function 'resolveNamespaceDescriptorCreate'.", function() {
        assert.property(moduleUnderTest, 'resolveNamespaceDescriptorCreate');
        assert.isFunction(moduleUnderTest.resolveNamespaceDescriptorCreate);
    });

    it("Module should export function 'checkValidDescriptorResolveOptions'.", function() {
        assert.property(moduleUnderTest, 'checkValidDescriptorResolveOptions');
        assert.isFunction(moduleUnderTest.checkValidDescriptorResolveOptions);
    });

    it("Module should export function 'checkValidDescriptorResolveResults.", function() {
        assert.property(moduleUnderTest, 'checkValidDescriptorResolveResults');
        assert.isFunction(moduleUnderTest.checkValidDescriptorResolveResults);
    });

    describe("'checkValidDescriptorResolveOptions' function export test suite.", function() {
        var testVector = {

            'Bad params: missing parameters': [{
                testData: {},
                validConfig: false
            }],
            'Bad params: malformed open 1': [{
                testData: { options: {} },
                validConfig: false
            }],
            'Bad params: malformed open 2': [{
                testData: { options: { }, isOpenResolve: true },
                validConfig: false
            }],
            'Bad params: malformed open 3': [{
                testData: { options: { parentDataReference: {} }, isOpenResovle: true },
                validConfig: false
            }],
            'Bad params: malformed open 4': [{
                testData: { options: { parentDataReference: {}, targetNamespaceDescriptor: {} } },
                validConfig: false
            }],
            'Valid params: open options test 1': [{
                testData: { options: { parentDataReference: {}, targetNamespaceDescriptor: {} }, isOpenResolve: true },
                validConfig: true
            }]
        };
        before(function(done_) {
            withData(testVector, function(inputData_) {
                var result = null;
                before(function(done_) {
                    var functionUnderTest = function() {
                        result = moduleUnderTest.checkValidDescriptorResolveOptions(inputData_.testData.options, inputData_.testData.isOpenResolve);
                    };
                    assert.doesNotThrow(functionUnderTest);
                    done_();
                });
                it("Result value should be '" + inputData_.validConfig + "'.", function() {
                    assert.equal(result, inputData_.validConfig);
                });
            });
            done_();
        });
        it("Execute the test suite.", function() {
            assert.isTrue(true);
        });
    });

    describe("'resolveNamespaceDescriptorOpen' function export tests.", function() {

        var resolveResults = null;
        var descriptorResolveOptions = {
            parentDataReference: { 'addressBook': {} },
            targetNamespaceDescriptor: testDataRootDescriptor,
            targetNamespaceKey: undefined,
            propertyAssignmentObject: undefined
        };

        before(function(done_) {
            var functionUnderTest = function() {

                resolveResults = moduleUnderTest.resolveNamespaceDescriptorOpen(descriptorResolveOptions);
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


    });


});

