// test-use-case-component-resolver-create-noop-root.js

var onm = require('../../../index');
var testComponentResolverUseCase = require('./test-core-component-resolver');
var dataModelDeclaration = require('../../fixture/named-object-resolve-test-data-model');
var dataModel = new onm.Model(dataModelDeclaration).implementation.resetKeyGenerator();
var rootToken = dataModel.createRootAddress().implementation.getLastToken();

var testComponentResolverUseCase = require('./test-core-component-resolver');

var expectedResults = {
    rootNamespaceDefaultConstructionData:   require('./expected-results/expected-results-root-component-default-construction-data'),
    rootNamespaceDefaultConstructionEvents: require('./expected-results/expected-results-root-component-default-construction-events')
};

testComponentResolverUseCase({
    strategyName: "create",
    operationName: "noop",
    targetNamespace: "root",
    inputOptions: {
        strategy: 'create',
        addressToken: rootToken,
        parentDataReference: {},
        propertyOptionsObject: {},
        semanticBindingsReference: dataModel.getSemanticBindings()
    },
    expectCallToThrow: false,
    resultExpectations: {
        resolvedNamedObjectCount: 1,
        pendingSubcomponentCount: 0,
        dataChangeEventJournalCount: 45,
        JSON: {
            namespace: '{"a":"default a","b":"default b","c":"default c","d":"default d","e":"default e","f":"default f","namespaceExtensionPointA":{},"namespaceChildA":{"a":"default a","b":"default b","c":"default c","d":"default d","e":"default e","f":"default f","namespaceExtensionPointB":{},"namespaceChildB":{"a":"default a","b":"default b","c":"default c","d":"default d","e":"default e","f":"default f","namespaceChildC":{"a":"default a","b":"default b","c":"default c","d":"default d","e":"default e","f":"default f","namespaceChildD":{"a":"default a","b":"default b","c":"default c","d":"default d","e":"default e","f":"default f","namespaceExtensionPointE":{},"namespaceChildE":{"a":"default a","b":"default b","c":"default c","d":"default d","e":"default e","f":"default f"}}}}}}',
            parent: expectedResults.rootNamespaceDefaultConstructionData,
            journal: expectedResults.rootNamespaceDefaultConstructionEvents
        }
    }
});

testComponentResolverUseCase({
    strategyName: "create",
    operationName: "noop",
    targetNamespace: "root (root already exists)",
    inputOptions: {
        strategy: 'create',
        addressToken: rootToken,
        parentDataReference: { namespaceRoot: { cairn: true } },
        propertyOptionsObject: {},
        semanticBindingsReference: dataModel.getSemanticBindings()
    },
    expectCallToThrow: true
});

testComponentResolverUseCase({
    strategyName: "create",
    operationName: "noop",
    targetNamespace: "root (child 1 already exists)",
    inputOptions: {
        strategy: 'create',
        addressToken: rootToken,
        parentDataReference: { namespaceRoot: { namespaceChildA: { cairn: true } } },
        propertyOptionsObject: {},
        semanticBindingsReference: dataModel.getSemanticBindings()
    },
    expectCallToThrow: true
});


