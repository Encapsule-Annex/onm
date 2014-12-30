// test-impl-onm-descriptor-resolve.js
//

var assert = require('chai').assert;
var withData = require('leche').withData;

var uuid = require('node-uuid');
var onm = require('../index');
var testData = require('./fixture/address-book-data-model');

var testDataModel = testData.createModel();
var testDataRootAddress = testDataModel.createRootAddress();
var testDataRootToken = testDataRootAddress.implementation.getLastToken();
var testDataRootDescriptor = testDataRootToken.namespaceDescriptor;

module.exports = describe("onm.NamespaceDescriptorResolver white box tests.", function() {

    var moduleUnderTest = null;
    var moduleUnderTestImpl = null;

    before(function(done_) {
        testData.resetLuid();
        var loadModuleUnderTest = function() {
            moduleUnderTest = require('../lib/impl/onm-namespace-resolver');
            moduleUnderTestImpl = require('../lib/impl/onm-namespace-resolver-core');
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

    describe("Verify the export signature of onm-namespace-resolver-core module.", function() {
        it("Module implementation should export an object.", function() {
            assert.isNotNull(moduleUnderTestImpl);
            assert.isDefined(moduleUnderTestImpl);
            assert.isObject(moduleUnderTestImpl);
        });
        it("Module implementation should export generic function 'resolve'.", function() {
            assert.property(moduleUnderTestImpl, 'resolve');
            assert.isFunction(moduleUnderTestImpl.resolve);
        });
        it("Module implementation should export namespace 'visitor'.", function() {
            assert.property(moduleUnderTestImpl, 'visitor');
            assert.isObject(moduleUnderTestImpl.visitor);
        });
        describe("Verify the 'visitor' namespace exports.", function() {
            it("'visitor' should export function 'initializeContext'.", function() {
                assert.property(moduleUnderTestImpl.visitor, 'initializeContext');
                assert.isFunction(moduleUnderTestImpl.visitor.initializeContext);
            });
            it("'visitor' should export function 'dereferenceNamedObject'.", function() {
                assert.property(moduleUnderTestImpl.visitor, 'dereferenceNamedObject');
                assert.isFunction(moduleUnderTestImpl.visitor.dereferenceNamedObject);
            });
            it("'visitor' should export function 'visitNamespaceProperties'.", function() {
                assert.property(moduleUnderTestImpl.visitor, 'visitNamespaceProperties');
                assert.isFunction(moduleUnderTestImpl.visitor.visitNamespaceProperties);
            });
            it("'visitor' should export function 'visitNamespaceChildren'.", function() {
                assert.property(moduleUnderTestImpl.visitor, 'visitNamespaceChildren');
                assert.isFunction(moduleUnderTestImpl.visitor.visitNamespaceChildren);
            });
            it("'visitor' should export function 'processPropertyOptions'.", function() {
                assert.property(moduleUnderTestImpl.visitor, 'processPropertyOptions');
                assert.isFunction(moduleUnderTestImpl.visitor.processPropertyOptions);
            });
            it("'visitor' should export function 'finalizeContext'.", function() {
                assert.property(moduleUnderTestImpl.visitor, 'finalizeContext');
                assert.isFunction(moduleUnderTestImpl.visitor.finalizeContext);
            });
        });
        it("Module implementation should export namespace 'helpers'.", function() {
            assert.property(moduleUnderTestImpl, 'helpers');
            assert.isObject(moduleUnderTestImpl.helpers);
        });
        describe("Verify the 'helpers' namespace exports.", function() {
            it("'helpers' should export function 'checkValidDescriptorResolveOptions'.", function() {
                assert.property(moduleUnderTestImpl.helpers, 'checkValidDescriptorResolveOptions');
                assert.isFunction(moduleUnderTestImpl.helpers.checkValidDescriptorResolveOptions);
            });
            it("'helpers' should export function 'checkValidDescriptorResolveResults.", function() {
                assert.property(moduleUnderTestImpl.helpers, 'checkValidDescriptorResolveResults');
                assert.isFunction(moduleUnderTestImpl.helpers.checkValidDescriptorResolveResults);
            });
        });
    });

    require('./test-onm-namespace-resolver.options');
    require('./test-onm-namespace-resolver.results');
    require('./test-onm-namespace-resolver.open');
    require('./test-onm-namespace-resolver.create');

});

