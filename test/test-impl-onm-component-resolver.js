// test-impl-onm-component-resolver.js
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

var testExtensionPointAddress = testDataRootAddress.createSubpathAddress("properties.subproperties.collection");
var testExtensionPointToken = testExtensionPointAddress.implementation.getLastToken();

var embeddedComponentAddress = testDataRootAddress.createSubpathAddress("properties.subproperties.collection.someObject");
var embeddedComponentToken = embeddedComponentAddress.implementation.getLastToken();


module.exports = describe("Component resolver module test suite.", function() {

    componentResolver = null;

    before(function(done_) {
        var loadModuleUnderTest = function() {
            componentResolver = require('../lib/impl/onm-component-resolver');
        };
        assert.doesNotThrow(loadModuleUnderTest);
        done_();
    });

    it("componentResolver module should export an object.", function() {
        assert.isNotNull(componentResolver);
        assert.isDefined(componentResolver);
        assert.isObject(componentResolver);
    });

    describe("Verify the export signature of the component resolver module.", function() {
        it("componentResolver module export object should define property 'resolve' of type function.", function() {
            assert.property(componentResolver, 'resolve');
            assert.isFunction(componentResolver.resolve);
        });
    });

    describe("Component resolver implementation tests.", function() {

        describe("Open strategy with no data operation tests.", function() {
            require('./subtests/component-resolver/test-use-case-component-resolver-open-noop-root.js');
            require('./subtests/component-resolver/test-use-case-component-resolver-open-noop-subnamespace-1.js');
            require('./subtests/component-resolver/test-use-case-component-resolver-open-noop-subnamespace-2.js');
            require('./subtests/component-resolver/test-use-case-component-resolver-open-noop-subnamespace-N.js');
        });

        describe("Open strategy with data-over operation tests.", function() {
            require('./subtests/component-resolver/test-use-case-component-resolver-open-apply-root-data-0.js');
            require('./subtests/component-resolver/test-use-case-component-resolver-open-apply-root-data-1.js');
            require('./subtests/component-resolver/test-use-case-component-resolver-open-apply-root-data-2.js');
            require('./subtests/component-resolver/test-use-case-component-resolver-open-apply-root-data-N.js');
            require('./subtests/component-resolver/test-use-case-component-resolver-open-apply-subnamespace-1-data-0.js');
            require('./subtests/component-resolver/test-use-case-component-resolver-open-apply-subnamespace-1-data-1.js');
            require('./subtests/component-resolver/test-use-case-component-resolver-open-apply-subnamespace-1-data-2.js');
            require('./subtests/component-resolver/test-use-case-component-resolver-open-apply-subnamespace-2-data-0.js');
            require('./subtests/component-resolver/test-use-case-component-resolver-open-apply-subnamespace-2-data-1.js');
            require('./subtests/component-resolver/test-use-case-component-resolver-open-apply-subnamespace-2-data-2.js');
            require('./subtests/component-resolver/test-use-case-component-resolver-open-apply-subnamespace-N-data-0.js');
        });

        describe("Create strategy with no data operation tests.", function() {
            require('./subtests/component-resolver/test-use-case-component-resolver-create-noop-root.js');
            require('./subtests/component-resolver/test-use-case-component-resolver-create-noop-subnamespace-1.js');
            require('./subtests/component-resolver/test-use-case-component-resolver-create-noop-subnamespace-2.js');
            require('./subtests/component-resolver/test-use-case-component-resolver-create-noop-subnamespace-N.js');
        });

        describe("Create strategy with data-over operation tests.", function() {
            require('./subtests/component-resolver/test-use-case-component-resolver-create-apply-root-data-0.js');
            require('./subtests/component-resolver/test-use-case-component-resolver-create-apply-root-data-1.js');
            require('./subtests/component-resolver/test-use-case-component-resolver-create-apply-root-data-2.js');
            require('./subtests/component-resolver/test-use-case-component-resolver-create-apply-root-data-N.js');
            require('./subtests/component-resolver/test-use-case-component-resolver-create-apply-subnamespace-1-data-0.js');
            require('./subtests/component-resolver/test-use-case-component-resolver-create-apply-subnamespace-1-data-1.js');
            require('./subtests/component-resolver/test-use-case-component-resolver-create-apply-subnamespace-1-data-2.js');
            require('./subtests/component-resolver/test-use-case-component-resolver-create-apply-subnamespace-2-data-0.js');
            require('./subtests/component-resolver/test-use-case-component-resolver-create-apply-subnamespace-2-data-1.js');
        });

    });

});

