// test-use-case-named-object-resolver-negotiate.js
//

var onm = require('../../../index');
var dataModelDeclaration = require('../../fixture/named-object-resolve-test-data-model');
var dataModel = new onm.Model(dataModelDeclaration).implementation.resetKeyGenerator();

var rootAddress = dataModel.createRootAddress();
var childAddress = rootAddress.createSubpathAddress('namespaceChildA');
var extensionPointAddress = rootAddress.createSubpathAddress('namespaceExtensionPointA');

var rootDescriptor = rootAddress.implementation.getDescriptor();
var childDescriptor = childAddress.implementation.getDescriptor();
var extensionPointDescriptor = extensionPointAddress.implementation.getDescriptor();

var testNamedObjectResolverUseCase = require('./test-core-named-object-resolver');

// ----------------------------------------------------------------------------

testNamedObjectResolverUseCase({
    strategyName: 'negotiate',
    operationName: 'noop',
    targetNamespace: 'root namespace (exists)',
    inputOptions: {
        strategy: 'negotiate',
        parentDataReference: { namespaceRoot: { cairn: true } },
        targetNamespaceDescriptor: rootDescriptor,
        semanticBindingsReference: dataModel.getSemanticBindings(),
        propertyAssignmentObject: {}
    },
    expectCallToThrow: false,
    resultExpectations: {
        strategyFollowed: 'open',
        namespaceEffectiveKey: 'namespaceRoot',
        pendingSubobjectCount: 0,
        JSON: {
            namespace: '{"cairn":true}',
            events: '[]'
        }
    }
});

testNamedObjectResolverUseCase({
    strategyName: 'negotiate',
    operationName: 'noop',
    targetNamespace: 'root namespace (!exists)',
    inputOptions: {
        strategy: 'negotiate',
        parentDataReference: {},
        targetNamespaceDescriptor: rootDescriptor,
        semanticBindingsReference: dataModel.getSemanticBindings(),
        propertyAssignmentObject: {}
    },
    expectCallToThrow: false,
    resultExpectations: {
        strategyFollowed: 'create',
        namespaceEffectiveKey: 'namespaceRoot',
        pendingSubobjectCount: 2,
        JSON: {
            namespace: '{"a":"default a","b":"default b","c":"default c","d":"default d","e":"default e","f":"default f"}',
            events: '[{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"root","namespaceModelPath":"namespaceRoot","namespaceModelId":0,"key":"namespaceRoot"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"a","model":true,"value":"\\"default a\\"","source":"model"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"b","model":true,"value":"\\"default b\\"","source":"model"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"c","model":true,"value":"\\"default c\\"","source":"model"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"d","model":true,"value":"\\"default d\\"","source":"model"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"e","model":true,"value":"\\"default e\\"","source":"model"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"f","model":true,"value":"\\"default f\\"","source":"model"}}]',
        }
    }
});

// ----------------------------------------------------------------------------

testNamedObjectResolverUseCase({
    strategyName: 'negotiate',
    operationName: 'noop',
    targetNamespace: 'child namespace (exists)',
    inputOptions: {
        strategy: 'negotiate',
        parentDataReference: { namespaceChildA: { cairn: true } },
        targetNamespaceDescriptor: childDescriptor,
        semanticBindingsReference: dataModel.getSemanticBindings(),
        propertyAssignmentObject: {}
    },
    expectCallToThrow: false,
    resultExpectations: {
        strategyFollowed: 'open',
        namespaceEffectiveKey: 'namespaceChildA',
        pendingSubobjectCount: 0,
        JSON: {
            namespace: '{"cairn":true}',
            events: '[]'
        }
    }
});

testNamedObjectResolverUseCase({
    strategyName: 'negotiate',
    operationName: 'noop',
    targetNamespace: 'child namespace (!exists)',
    inputOptions: {
        strategy: 'negotiate',
        parentDataReference: {},
        targetNamespaceDescriptor: childDescriptor,
        semanticBindingsReference: dataModel.getSemanticBindings(),
        propertyAssignmentObject: {}
    },
    expectCallToThrow: false,
    resultExpectations: {
        strategyFollowed: 'create',
        namespaceEffectiveKey: 'namespaceChildA',
        pendingSubobjectCount: 2,
        JSON: {
            namespace: '{"a":"default a","b":"default b","c":"default c","d":"default d","e":"default e","f":"default f"}',
            events: '[{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"child","namespaceModelPath":"namespaceRoot.namespaceChildA","namespaceModelId":1,"key":"namespaceChildA"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"a","model":true,"value":"\\"default a\\"","source":"model"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"b","model":true,"value":"\\"default b\\"","source":"model"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"c","model":true,"value":"\\"default c\\"","source":"model"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"d","model":true,"value":"\\"default d\\"","source":"model"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"e","model":true,"value":"\\"default e\\"","source":"model"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"f","model":true,"value":"\\"default f\\"","source":"model"}}]'
        }
    }
});

// ----------------------------------------------------------------------------

testNamedObjectResolverUseCase({
    strategyName: 'negotiate',
    operationName: 'noop',
    targetNamespace: 'extension point namespace (exists)',
    inputOptions: {
        strategy: 'negotiate',
        parentDataReference: { namespaceExtensionPointA: { cairn: true } },
        targetNamespaceDescriptor: extensionPointDescriptor,
        semanticBindingsReference: dataModel.getSemanticBindings(),
        propertyAssignmentObject: {}
    },
    expectCallToThrow: false,
    resultExpectations: {
        strategyFollowed: 'open',
        namespaceEffectiveKey: 'namespaceExtensionPointA',
        pendingSubobjectCount: 0,
        JSON: {
            namespace: '{"cairn":true}',
            events: '[]'
        }
    }
});

testNamedObjectResolverUseCase({
    strategyName: 'negotiate',
    operationName: 'noop',
    targetNamespace: 'extension point namespace (!exists)',
    inputOptions: {
        strategy: 'negotiate',
        parentDataReference: {},
        targetNamespaceDescriptor: extensionPointDescriptor,
        semanticBindingsReference: dataModel.getSemanticBindings(),
        propertyAssignmentObject: {}
    },
    expectCallToThrow: false,
    resultExpectations: {
        strategyFollowed: 'create',
        namespaceEffectiveKey: 'namespaceExtensionPointA',
        pendingSubobjectCount: 0,
        JSON: {
            namespace: '{}',
            events: '[{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"extensionPoint","namespaceModelPath":"namespaceRoot.namespaceExtensionPointA","namespaceModelId":11,"key":"namespaceExtensionPointA"}}]'
        }
    }
});

// ----------------------------------------------------------------------------


