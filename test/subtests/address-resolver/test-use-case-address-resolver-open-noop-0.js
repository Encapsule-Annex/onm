// test-use-case-address-resolver-open-root-noop.js
//

var onm = require('../../../index');
var testAddressResolverUseCase = require('./test-core-address-resolver');
var dataModelDeclaration = require('../../fixture/named-object-resolve-test-data-model');
var dataModel = new onm.Model(dataModelDeclaration).implementation.resetKeyGenerator();
var rootAddress = dataModel.createRootAddress();

testResult = testAddressResolverUseCase({
    strategyName: "open",
    operationName: "noop",
    targetNamespace: "root",
    inputOptions: {
        strategy: "open",
        address: rootAddress,
        parentDataReference: { namespaceRoot: { cairn:"test marker in parent data."}},
        semanticBindingsReference: dataModel.getSemanticBindings(),
        propertyAssignmentObject: {}
    },
    expectCallToThrow: false,
    resultExpectations: {
        resolvedComponentCount: 1,
        dataChangeEventJournalCount: 0,
        JSON: {
            namespace: '{"cairn":"test marker in parent data."}',
            parent: '{"namespaceRoot":{"cairn":"test marker in parent data."}}',
            journal: '[]'
        }
    }
});



