// test-use-case-component-resolver-open-apply-subnamespace-1-data-0.js

var onm = require('../../../index');
var testComponentResolverUseCase = require('./test-core-component-resolver');
var dataModelDeclaration = require('../../fixture/named-object-resolve-test-data-model');
var dataModel = new onm.Model(dataModelDeclaration).implementation.resetKeyGenerator();
var childToken = dataModel.createPathAddress("namespaceRoot.namespaceChildA").implementation.getLastToken();

var testComponentResolverUseCase = require('./test-core-component-resolver');

testComponentResolverUseCase({
    strategyName: "open",
    operationName: "apply data-0",
    targetNamespace: "subnamespace-1",
    inputOptions: {
        strategy: 'open',
        addressToken: childToken,
        parentDataReference: {
            namespaceRoot: { 
                cairn: true,
                namespaceChildA: {
                }
            }
        },
        propertyAssignmentObject: {
            a: "b84ba62136e1a338acd4fc3554cb27cd",
            _a: "d79d32857528d326f7933aa654cb27fa",
            cairn: "This should land in namespaceChildA!"
        },
        semanticBindingsReference: dataModel.getSemanticBindings()
    },
    expectCallToThrow: false,
    resultExpectations: {
        resolvedNamedObjectCount: 2,
        pendingSubcomponentCount: 0,
        dataChangeEventJournalCount: 3,
        JSON: {
            namespace: '{"a":"b84ba62136e1a338acd4fc3554cb27cd","_a":"d79d32857528d326f7933aa654cb27fa","cairn":"This should land in namespaceChildA!"}',
            parent: '{"namespaceRoot":{"cairn":true,"namespaceChildA":{"a":"b84ba62136e1a338acd4fc3554cb27cd","_a":"d79d32857528d326f7933aa654cb27fa","cairn":"This should land in namespaceChildA!"}}}',
            journal: '[{"layer":"namedObject","event":"propertyUpdated","eventData":{"name":"a","model":true,"value":"\\"b84ba62136e1a338acd4fc3554cb27cd\\"","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"_a","model":false,"value":"\\"d79d32857528d326f7933aa654cb27fa\\"","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"cairn","model":false,"value":"\\"This should land in namespaceChildA!\\"","source":"data"}}]'
        }
    }
});

