// test-use-case-component-resolver-open-noop-root.js

var onm = require('../../../index');
var testComponentResolverUseCase = require('./test-core-component-resolver');
var dataModelDeclaration = require('../../fixture/named-object-resolve-test-data-model');
var dataModel = new onm.Model(dataModelDeclaration).implementation.resetKeyGenerator();
var rootToken = dataModel.createRootAddress().implementation.getLastToken();

var testComponentResolverUseCase = require('./test-core-component-resolver');

testComponentResolverUseCase({
    strategyName: "open",
    operationName: "noop",
    targetNamespace: "root",
    inputOptions: {
        strategy: 'open',
        addressToken: rootToken,
        parentDataReference: { namespaceRoot: { cairn: true } },
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
            parent: '{"namespaceRoot":{"cairn":true}}',
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
