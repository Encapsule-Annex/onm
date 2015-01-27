// test-use-case-component-resolver-open-noop-namespace-2.js

var onm = require('../../../index');
var testComponentResolverUseCase = require('./test-core-component-resolver');
var dataModelDeclaration = require('../../fixture/named-object-resolve-test-data-model');
var dataModel = new onm.Model(dataModelDeclaration).implementation.resetKeyGenerator();
var rootAddress = dataModel.createRootAddress();
var testToken1 = rootAddress.createSubpathAddress("namespaceChildA.namespaceChildB").implementation.getLastToken();
var testToken2 = rootAddress.createSubpathAddress("namespaceChildA.namespaceExtensionPointB").implementation.getLastToken();

testComponentResolverUseCase({
    strategyName: "open",
    operationName: "noop",
    targetNamespace: "subnamespace 2 child on child",
    inputOptions: {
        strategy: 'open',
        addressToken: testToken1,
        parentDataReference: { namespaceRoot: { namespaceChildA: { namespaceChildB: { cairn: true } } } },
        propertyOptionsObject: {},
        semanticBindingsReference: dataModel.getSemanticBindings()
    },
    expectCallToThrow: false,
    resultExpectations: {
        resolvedNamedObjectCount: 3,
        pendingSubcomponentCount: 0,
        dataChangeEventJournalCount: 0,
        JSON: {
            namespace: '{"cairn":true}',
            parent: '{"namespaceRoot":{"namespaceChildA":{"namespaceChildB":{"cairn":true}}}}',
            journal: '[]'
        }
    }
});

testComponentResolverUseCase({
    strategyName: "open",
    operationName: "noop",
    targetNamespace: "subnamespace 2 child on child (missing)",
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
    targetNamespace: "subnamespace 2 extension point on child",
    inputOptions: {
        strategy: 'open',
        addressToken: testToken2,
        parentDataReference: { namespaceRoot: { namespaceChildA: { namespaceExtensionPointB: { cairn: true } } } },
        propertyOptionsObject: {},
        semanticBindingsReference: dataModel.getSemanticBindings()
    },
    expectCallToThrow: false,
    resultExpectations: {
        resolvedNamedObjectCount: 3,
        pendingSubcomponentCount: 0,
        dataChangeEventJournalCount: 0,
        JSON: {
            namespace: '{"cairn":true}',
            parent: '{"namespaceRoot":{"namespaceChildA":{"namespaceExtensionPointB":{"cairn":true}}}}',
            journal: '[]'
        }
    }
});

testComponentResolverUseCase({
    strategyName: "open",
    operationName: "noop",
    targetNamespace: "subnamespace 2 extension point on child (missing)",
    inputOptions: {
        strategy: 'open',
        addressToken: testToken2,
        parentDataReference: {},
        propertyOptionsObject: {},
        semanticBindingsReference: dataModel.getSemanticBindings()
    },
    expectCallToThrow: true
});


