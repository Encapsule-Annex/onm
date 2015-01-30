// test-use-case-component-resolver-open-apply-subnamespace-2-data-1.js

var onm = require('../../../index');
var testComponentResolverUseCase = require('./test-core-component-resolver');
var dataModelDeclaration = require('../../fixture/named-object-resolve-test-data-model');
var dataModel = new onm.Model(dataModelDeclaration).implementation.resetKeyGenerator();
var childToken = dataModel.createPathAddress("namespaceRoot.namespaceChildA.namespaceChildB").implementation.getLastToken();

var testComponentResolverUseCase = require('./test-core-component-resolver');

testComponentResolverUseCase({
    strategyName: "open",
    operationName: "apply data-1",
    targetNamespace: "subnamespace-2",
    inputOptions: {
        strategy: 'open',
        addressToken: childToken,
        parentDataReference: {
            namespaceRoot: { 
                cairn: true,
                namespaceChildA: {
                    namespaceChildB: {
                        namespaceChildC: {
                        }
                    }
                }
            }
        },
        propertyAssignmentObject: {
            a: "b84ba62136e1a338acd4fc3554cb27cd",
            _a: "d79d32857528d326f7933aa654cb27fa",
            cairn: "This should land in namespaceChildB!",
            namespaceChildC: {
                a: "ef656cd88f7fe64b94d88c8e54cbfdba",
                _a: "87ee0b77352ff7441eafad9154cbfdc8",
                cairn: "This should land in in namespaceChildC!"
            }
        },
        semanticBindingsReference: dataModel.getSemanticBindings()
    },
    expectCallToThrow: false,
    resultExpectations: {
        resolvedNamedObjectCount: 3,
        pendingSubcomponentCount: 0,
        dataChangeEventJournalCount: 6,
        JSON: {
            namespace: '{"namespaceChildC":{"a":"ef656cd88f7fe64b94d88c8e54cbfdba","_a":"87ee0b77352ff7441eafad9154cbfdc8","cairn":"This should land in in namespaceChildC!"},"a":"b84ba62136e1a338acd4fc3554cb27cd","_a":"d79d32857528d326f7933aa654cb27fa","cairn":"This should land in namespaceChildB!"}',
            parent: '{"namespaceRoot":{"cairn":true,"namespaceChildA":{"namespaceChildB":{"namespaceChildC":{"a":"ef656cd88f7fe64b94d88c8e54cbfdba","_a":"87ee0b77352ff7441eafad9154cbfdc8","cairn":"This should land in in namespaceChildC!"},"a":"b84ba62136e1a338acd4fc3554cb27cd","_a":"d79d32857528d326f7933aa654cb27fa","cairn":"This should land in namespaceChildB!"}}}}',
            journal: '[{"layer":"namedObject","event":"propertyUpdated","eventData":{"name":"a","model":true,"value":"\\"b84ba62136e1a338acd4fc3554cb27cd\\"","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"_a","model":false,"value":"\\"d79d32857528d326f7933aa654cb27fa\\"","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"cairn","model":false,"value":"\\"This should land in namespaceChildB!\\"","source":"data"}},{"layer":"namedObject","event":"propertyUpdated","eventData":{"name":"a","model":true,"value":"\\"ef656cd88f7fe64b94d88c8e54cbfdba\\"","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"_a","model":false,"value":"\\"87ee0b77352ff7441eafad9154cbfdc8\\"","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"cairn","model":false,"value":"\\"This should land in in namespaceChildC!\\"","source":"data"}}]'
        }
    }
});

