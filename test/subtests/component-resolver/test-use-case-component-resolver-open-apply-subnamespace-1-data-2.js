// test-use-case-component-resolver-open-apply-subnamespace-1-data-1.js

var onm = require('../../../index');
var testComponentResolverUseCase = require('./test-core-component-resolver');
var dataModelDeclaration = require('../../fixture/named-object-resolve-test-data-model');
var dataModel = new onm.Model(dataModelDeclaration).implementation.resetKeyGenerator();
var childToken = dataModel.createPathAddress("namespaceRoot.namespaceChildA").implementation.getLastToken();

var testComponentResolverUseCase = require('./test-core-component-resolver');

testComponentResolverUseCase({
    strategyName: "open",
    operationName: "apply data-1",
    targetNamespace: "subnamespace-1",
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
            cairn: "This should land in namespaceChildA!",
            namespaceChildB: {
                a: "634f7bff1c0d1feb26d38b3d54cbdb0f",
                _a: "5859a26a932c791fcd2a69a954cbdb28",
                cairn: "This should land in namespaceChildB!",
                namespaceChildC: {
                    a: "bd2fa15f6aae8ea5fc937f9454cbdcca",
                    _a: "7da64d04c0e261e7cac10e7f54cbdcd9",
                    cairn: "This should land in namespaceChildC!"
                }
            }
        },
        semanticBindingsReference: dataModel.getSemanticBindings()
    },
    expectCallToThrow: false,
    resultExpectations: {
        resolvedNamedObjectCount: 2,
        pendingSubcomponentCount: 0,
        dataChangeEventJournalCount: 9,
        JSON: {
            namespace: '{"namespaceChildB":{"namespaceChildC":{"a":"bd2fa15f6aae8ea5fc937f9454cbdcca","_a":"7da64d04c0e261e7cac10e7f54cbdcd9","cairn":"This should land in namespaceChildC!"},"a":"634f7bff1c0d1feb26d38b3d54cbdb0f","_a":"5859a26a932c791fcd2a69a954cbdb28","cairn":"This should land in namespaceChildB!"},"a":"b84ba62136e1a338acd4fc3554cb27cd","_a":"d79d32857528d326f7933aa654cb27fa","cairn":"This should land in namespaceChildA!"}',
            parent: '{"namespaceRoot":{"cairn":true,"namespaceChildA":{"namespaceChildB":{"namespaceChildC":{"a":"bd2fa15f6aae8ea5fc937f9454cbdcca","_a":"7da64d04c0e261e7cac10e7f54cbdcd9","cairn":"This should land in namespaceChildC!"},"a":"634f7bff1c0d1feb26d38b3d54cbdb0f","_a":"5859a26a932c791fcd2a69a954cbdb28","cairn":"This should land in namespaceChildB!"},"a":"b84ba62136e1a338acd4fc3554cb27cd","_a":"d79d32857528d326f7933aa654cb27fa","cairn":"This should land in namespaceChildA!"}}}',
            journal: '[{"layer":"namedObject","event":"propertyUpdated","eventData":{"name":"a","model":true,"value":"\\"b84ba62136e1a338acd4fc3554cb27cd\\"","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"_a","model":false,"value":"\\"d79d32857528d326f7933aa654cb27fa\\"","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"cairn","model":false,"value":"\\"This should land in namespaceChildA!\\"","source":"data"}},{"layer":"namedObject","event":"propertyUpdated","eventData":{"name":"a","model":true,"value":"\\"634f7bff1c0d1feb26d38b3d54cbdb0f\\"","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"_a","model":false,"value":"\\"5859a26a932c791fcd2a69a954cbdb28\\"","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"cairn","model":false,"value":"\\"This should land in namespaceChildB!\\"","source":"data"}},{"layer":"namedObject","event":"propertyUpdated","eventData":{"name":"a","model":true,"value":"\\"bd2fa15f6aae8ea5fc937f9454cbdcca\\"","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"_a","model":false,"value":"\\"7da64d04c0e261e7cac10e7f54cbdcd9\\"","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"cairn","model":false,"value":"\\"This should land in namespaceChildC!\\"","source":"data"}}]'
        }
    }
});

