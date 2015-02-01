// test-use-case-address-resolver-open-noop-1.js
//

var onm = require('../../../index');
var testAddressResolverUseCase = require('./test-core-address-resolver');
var dataModelDeclaration = require('../../fixture/named-object-resolve-test-data-model');
var dataModel = new onm.Model(dataModelDeclaration).implementation.resetKeyGenerator();
var rootAddress = dataModel.createRootAddress();

var levelAComponentAddress = rootAddress.createSubpathAddress("namespaceExtensionPointA.namespaceComponentA");
levelAComponentAddress.implementation.tokenVector[1].key = "test";

testResult = testAddressResolverUseCase({
    strategyName: "open",
    operationName: "noop",
    targetNamespace: "root",
    inputOptions: {
        strategy: "open",
        address: levelAComponentAddress,
        parentDataReference: { namespaceRoot: { namespaceExtensionPointA: { test: { cairn: "test marker in namespaceComponentA" } } } },
        semanticBindingsReference: dataModel.getSemanticBindings(),
        propertyAssignmentObject: {}
    },
    expectCallToThrow: false,
    resultExpectations: {
        resolvedComponentCount: 2,
        dataChangeEventJournalCount: 0,
        JSON: {
            namespace: '{"cairn":"test marker in namespaceComponentA"}',
            parent: '{"namespaceRoot":{"namespaceExtensionPointA":{"test":{"cairn":"test marker in namespaceComponentA"}}}}',
            journal: '[]'
        }
    }
});



