// test-use-case-component-resolver-open-noop-subnamespace-1.js

var onm = require('../../../index');
var testComponentResolverUseCase = require('./test-core-component-resolver');
var dataModelDeclaration = require('../../fixture/named-object-resolve-test-data-model');
var dataModel = new onm.Model(dataModelDeclaration).implementation.resetKeyGenerator();
var rootAddress = dataModel.createRootAddress();
var testToken1 = rootAddress.createSubpathAddress("namespaceChildA").implementation.getLastToken();
var testToken2 = rootAddress.createSubpathAddress("namespaceExtensionPointA").implementation.getLastToken();

testComponentResolverUseCase({
    strategyName: "open",
    operationName: "noop",
    targetNamespace: "subnamespace child",
    inputOptions: {
        strategy: 'open',
        addressToken: testToken1,
        parentDataReference: { namespaceRoot: { namespaceChildA: { cairn: true } } },
        propertyOptionsObject: {},
        semanticBindingsReference: dataModel.getSemanticBindings()
    },
    expectCallToThrow: false,
    resultExpectations: {
        resolvedNamedObjectCount: 2,
        pendingSubcomponentCount: 0,
        dataChangeEventJournalCount: 0,
        JSON: {
            namespace: '{"cairn":true}',
            parent: '{"namespaceRoot":{"namespaceChildA":{"cairn":true}}}',
            journal: '[]'
        }
    }
});

testComponentResolverUseCase({
    strategyName: "open",
    operationName: "noop",
    targetNamespace: "subnamespace child (missing)",
    inputOptions: {
        strategy: 'open',
        addressToken: testToken1,
        parentDataReference: {},
        propertyOptionsObject: {},
        semanticBindingsReference: dataModel.getSemanticBindings()
    },
    expectCallToThrow: true
});

testComponentResolverUseCase({
    strategyName: "open",
    operationName: "noop",
    targetNamespace: "subnamespace extension point",
    inputOptions: {
        strategy: 'open',
        addressToken: testToken2,
        parentDataReference: { namespaceRoot: { namespaceExtensionPointA: { cairn: true } } },
        propertyOptionsObject: {},
        semanticBindingsReference: dataModel.getSemanticBindings()
    },
    expectCallToThrow: false,
    resultExpectations: {
        resolvedNamedObjectCount: 2,
        pendingSubcomponentCount: 0,
        dataChangeEventJournalCount: 0,
        JSON: {
            namespace: '{"cairn":true}',
            parent: '{"namespaceRoot":{"namespaceExtensionPointA":{"cairn":true}}}',
            journal: '[]'
        }
    }
});

testComponentResolverUseCase({
    strategyName: "open",
    operationName: "noop",
    targetNamespace: "subnamespace extension point (missing)",
    inputOptions: {
        strategy: 'open',
        addressToken: testToken2,
        parentDataReference: {},
        propertyOptionsObject: {},
        semanticBindingsReference: dataModel.getSemanticBindings()
    },
    expectCallToThrow: true
});

