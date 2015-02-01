// test-impl-onm-address-resolver.js
//

var assert = require('chai').assert;
var onm = require('../index');
var testData = require('./fixture/address-book-data-model');

var testDataModel = testData.createModel();
var rootAddress = testDataModel.createRootAddress();
var testObjectAddress = rootAddress.createSubpathAddress("properties.subproperties.collection.someObject");

describe("Validate the behavior of the onm address resolver.", function() {

    var addressResolver = null;

    before(function() {
        var loadModule = function() {
            addressResolver = require('../lib/impl/onm-address-resolver');
        };
        assert.doesNotThrow(loadModule);
    });

    it("addressResolver module should export an object.", function() {
        assert.isNotNull(addressResolver);
        assert.isDefined(addressResolver);
        assert.isObject(addressResolver);
    });

    describe("Verify the export signature of the address resolver module.", function() {
        it("addressResolver module export object should define property 'resolve' of type function.", function() {
            assert.property(addressResolver, 'resolve');
            assert.isFunction(addressResolver.resolve);
        });
    });

    describe("Address resolver implementation tests.", function() {

        describe("Open strategy with no data operation tests.", function() {
            require('./subtests/address-resolver/test-use-case-address-resolver-open-root.js');
            require('./subtests/address-resolver/test-use-case-address-resolver-open-subcomponent.js');
            require('./subtests/address-resolver/test-use-case-address-resolver-open-nested-subcomponent.js');
            require('./subtests/address-resolver/test-use-case-address-resolver-open-deep-nested-subcomponent.js');
        });

        describe("Open strategy with data-over operation tests.", function() {
            require('./subtests/address-resolver/test-use-case-address-resolver-open-root-apply-component.js');
            require('./subtests/address-resolver/test-use-case-address-resolver-open-root-apply-component-tree.js');
            require('./subtests/address-resolver/test-use-case-address-resolver-open-subcomponent-apply-component.js');
            require('./subtests/address-resolver/test-use-case-address-resolver-open-subcomponent-apply-component-tree.js');
            require('./subtests/address-resolver/test-use-case-address-resolver-open-nested-subcomponent-apply-component.js');
            require('./subtests/address-resolver/test-use-case-address-resolver-open-nested-subcomponent-apply-component-tree.js');
            require('./subtests/address-resolver/test-use-case-address-resolver-open-recursively-declared-subcomponent-apply-component.js');
            require('./subtests/address-resolver/test-use-case-address-resolver-open-recursively-declared-subcomponent-apply-component-tree.js');
            require('./subtests/address-resolver/test-use-case-address-resolver-open-recursively-declared-subcomponent.js');
        });

        describe("Create strategy with no data operation tests.", function() {
            require('./subtests/address-resolver/test-use-case-address-resolver-create-root.js');
            require('./subtests/address-resolver/test-use-case-address-resolver-create-subcomponent.js');
            require('./subtests/address-resolver/test-use-case-address-resolver-create-nested-subcomponent.js');
            require('./subtests/address-resolver/test-use-case-address-resolver-create-deep-nested-subcomponent.js');
        });

        describe("Create strategy with data-over operation tests.", function() {
            require('./subtests/address-resolver/test-use-case-address-resolver-create-root-apply-component.js');
            require('./subtests/address-resolver/test-use-case-address-resolver-create-root-apply-component-tree.js');
            require('./subtests/address-resolver/test-use-case-address-resolver-create-subcomponent-apply-component.js');
            require('./subtests/address-resolver/test-use-case-address-resolver-create-subcomponent-apply-compoonent-tree.js');
            require('./subtests/address-resolver/test-use-case-address-resolver-create-nested-subcomponent-apply-component.js');
            require('./subtests/address-resolver/test-use-case-address-resolver-create-nested-subcomponent-apply-component-tree.js');
            require('./subtests/address-resolver/test-use-case-address-resolver-create-recursively-declared-subcomponent-apply-component.js');
            require('./subtests/address-resolver/test-use-case-address-resolver-create-recursively-declared-subcomponent-apply-component-tree.js');
            require('./subtests/address-resolver/test-use-case-address-resolver-create-recursively-declared-subcomponent.js');
        });

    });

});
