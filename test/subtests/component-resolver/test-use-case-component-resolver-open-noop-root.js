// test-use-case-component-resolver-open-noop-root.js

var testComponentResolverUseCase = require('./test-core-component-resolver');

var testDataFixture = require('../../fixture/address-book-data-model');

var dataModel = testDataFixture.createModel();
var rootAddress = dataModel.createRootAddress();
var rootToken = rootAddress.implementation.getLastToken();

testComponentResolverUseCase({
    strategyName: "open",
    operationName: "noop",
    targetNamespace: "root",
    inputOptions: {
        strategy: 'open',
        addressToken: rootToken,
        parentDataReference: { addressBook: { cairn: true } },
        propertyOptionsObject: {},
        semanticBindingsReference: dataModel.getSemanticBindings()
    },
    expectCallToThrow: false,
    resultExpectations: {
        resolvedNamedObjectCount: 1,
        pendingSubcomponentCount: 0,
        dataChangeEventJournalCount: 0,
        JSON: {
            namespace: '{"cairn":true}',
            parent: '{"addressBook":{"cairn":true}}',
            journal: '[]'
        }
    }
});


testComponentResolverUseCase({
    strategyName: "open",
    operationName: "noop",
    targetNamespace: "root (missing)",
    inputOptions: {
        strategy: 'open',
        addressToken: rootToken,
        parentDataReference: {},
        propertyOptionsObject: {},
        semanticBindingsReference: dataModel.getSemanticBindings()
    },
    expectCallToThrow: true
});

