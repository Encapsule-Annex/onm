// test-use-case-component-resolver-open-apply-subnamespace-2-data-0.js

var onm = require('../../../index');
var testComponentResolverUseCase = require('./test-core-component-resolver');
var dataModelDeclaration = require('../../fixture/named-object-resolve-test-data-model');
var dataModel = new onm.Model(dataModelDeclaration).implementation.resetKeyGenerator();
var childToken = dataModel.createPathAddress("namespaceRoot.namespaceChildA.namespaceChildB").implementation.getLastToken();

var testComponentResolverUseCase = require('./test-core-component-resolver');

testComponentResolverUseCase({
    strategyName: "open",
    operationName: "apply data-0",
    targetNamespace: "subnamespace-2",
    inputOptions: {
        strategy: 'open',
        addressToken: childToken,
        parentDataReference: {
            namespaceRoot: { 
                cairn: true,
                namespaceChildA: {
                    namespaceChildB: {
                    }
                }
            }
        },
        propertyAssignmentObject: {
            a: "b84ba62136e1a338acd4fc3554cb27cd",
            _a: "d79d32857528d326f7933aa654cb27fa",
            cairn: "This should land in namespaceChildB!"
        },
        semanticBindingsReference: dataModel.getSemanticBindings()
    },
    expectCallToThrow: false,
    resultExpectations: {
        resolvedNamedObjectCount: 3,
        pendingSubcomponentCount: 0,
        dataChangeEventJournalCount: 3,
        JSON: {
            namespace: '{"a":"b84ba62136e1a338acd4fc3554cb27cd","_a":"d79d32857528d326f7933aa654cb27fa","cairn":"This should land in namespaceChildB!"}',
            parent: '{"namespaceRoot":{"cairn":true,"namespaceChildA":{"namespaceChildB":{"a":"b84ba62136e1a338acd4fc3554cb27cd","_a":"d79d32857528d326f7933aa654cb27fa","cairn":"This should land in namespaceChildB!"}}}}',
            journal: '[{"layer":"namedObject","event":"propertyUpdated","eventData":{"name":"a","model":true,"value":"\\"b84ba62136e1a338acd4fc3554cb27cd\\"","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"_a","model":false,"value":"\\"d79d32857528d326f7933aa654cb27fa\\"","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"cairn","model":false,"value":"\\"This should land in namespaceChildB!\\"","source":"data"}}]'
        }
    }
});

