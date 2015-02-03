// test-use-case-address-resolver-open-apply-2-N.js
//

var onm = require('../../../index');
var testAddressResolverUseCase = require('./test-core-address-resolver');

var dataModelDeclaration = {
    semanticBindings: {
        componentKeyGenerator: 'internalLuid'
    },
    jsonTag: 'testData',
    subNamespaces: [
        {
            namespaceType: 'extensionPoint',
            jsonTag: 'hashtable',
            componentArchetype: {
                namespaceType: 'component',
                jsonTag: 'testRecord',
                subNamespaces: [
                    {
                        namespaceType: 'extensionPoint',
                        jsonTag: 'hashtable',
                        componentArchetypePath: 'testData.hashtable.testRecord'
                    }
                ]
            }
        }
    ]
};

var dataModel = new onm.Model(dataModelDeclaration).implementation.resetKeyGenerator();
var rootAddress = dataModel.createRootAddress();
var testAddress = rootAddress.createSubpathAddress('hashtable.testRecord.hashtable.testRecord');
for (var token in testAddress.implementation.tokenVector) {
    testAddress.implementation.tokenVector[token].key = 'test';
}

testResult = testAddressResolverUseCase({
    strategyName: "open",
    operationName: "apply data-N",
    targetNamespace: "subcomponent-2",
    inputOptions: {
        strategy: "open",
        address: testAddress,
        parentDataReference: { testData: { hashtable: { test: { hashtable: { test: { hashtable: { /* caller data here*/ } } } } } } },
        semanticBindingsReference: dataModel.getSemanticBindings(),
        propertyAssignmentObject: {
            cairn: "This should land in the target namespace 1a46eb57185c8c308f9803d454d04ec5",
            hashtable: {
                "7eff9a60-ebb4-4b1a-904e-1e2d2c175491": {
                    cairn: "Marker eb990988-0025-4af0-abc6-753fba64d8f6",
                    hashtable: {
                        "540ad737-0b66-45ab-9c83-5ad5de985963": {
                            cairn: "Marker 46eee2d2-dde0-4e5f-a8fc-ed6f9f58d2ba"
                        }
                    }
                },
                "e43c3258-a374-467e-ae79-0d7a01ccfcad": {
                    cairn: "Marker b6bb9bab-b751-4acc-8305-0f758cfead67",
                    hashtable: {
                        "699cf96e-a8a8-4ed5-9351-47712c62493c": {
                            cairn: "Marker 996bbe09-562f-4f5a-a4b7-f861d1b8442b"
                        },
                        "dbb6c149-257f-4d14-94c9-2d28d2d3628b": {
                            cairn: "Marker 1d7c5213-35d4-43ab-8042-53cad665b050",
                            hashtable: {
                                "319cce8f-0ee6-4bcf-a57b-6b379c92209a": {
                                    cairn: "Marker bb6f8be0-a448-41c1-a2ca-8a261e4dbcbb"
                                },
                                "2d6b96af-5c9a-4f3a-b01f-c88b01d71629": {
                                    cairn: "Marker 2e77bf7d-e531-40ec-9c6b-33044b122641"
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    expectCallToThrow: false,
    resultExpectations: {
        resolvedComponentCount: 3,
        dataChangeEventJournalCount: 22,
        JSON: {
            namespace: '{"hashtable":{"7eff9a60-ebb4-4b1a-904e-1e2d2c175491":{"cairn":"Marker eb990988-0025-4af0-abc6-753fba64d8f6","hashtable":{"540ad737-0b66-45ab-9c83-5ad5de985963":{"cairn":"Marker 46eee2d2-dde0-4e5f-a8fc-ed6f9f58d2ba","hashtable":{}}}},"e43c3258-a374-467e-ae79-0d7a01ccfcad":{"cairn":"Marker b6bb9bab-b751-4acc-8305-0f758cfead67","hashtable":{"699cf96e-a8a8-4ed5-9351-47712c62493c":{"cairn":"Marker 996bbe09-562f-4f5a-a4b7-f861d1b8442b","hashtable":{}},"dbb6c149-257f-4d14-94c9-2d28d2d3628b":{"cairn":"Marker 1d7c5213-35d4-43ab-8042-53cad665b050","hashtable":{"319cce8f-0ee6-4bcf-a57b-6b379c92209a":{"cairn":"Marker bb6f8be0-a448-41c1-a2ca-8a261e4dbcbb","hashtable":{}},"2d6b96af-5c9a-4f3a-b01f-c88b01d71629":{"cairn":"Marker 2e77bf7d-e531-40ec-9c6b-33044b122641","hashtable":{}}}}}}},"cairn":"This should land in the target namespace 1a46eb57185c8c308f9803d454d04ec5"}',
            parent: '{"testData":{"hashtable":{"test":{"hashtable":{"test":{"hashtable":{"7eff9a60-ebb4-4b1a-904e-1e2d2c175491":{"cairn":"Marker eb990988-0025-4af0-abc6-753fba64d8f6","hashtable":{"540ad737-0b66-45ab-9c83-5ad5de985963":{"cairn":"Marker 46eee2d2-dde0-4e5f-a8fc-ed6f9f58d2ba","hashtable":{}}}},"e43c3258-a374-467e-ae79-0d7a01ccfcad":{"cairn":"Marker b6bb9bab-b751-4acc-8305-0f758cfead67","hashtable":{"699cf96e-a8a8-4ed5-9351-47712c62493c":{"cairn":"Marker 996bbe09-562f-4f5a-a4b7-f861d1b8442b","hashtable":{}},"dbb6c149-257f-4d14-94c9-2d28d2d3628b":{"cairn":"Marker 1d7c5213-35d4-43ab-8042-53cad665b050","hashtable":{"319cce8f-0ee6-4bcf-a57b-6b379c92209a":{"cairn":"Marker bb6f8be0-a448-41c1-a2ca-8a261e4dbcbb","hashtable":{}},"2d6b96af-5c9a-4f3a-b01f-c88b01d71629":{"cairn":"Marker 2e77bf7d-e531-40ec-9c6b-33044b122641","hashtable":{}}}}}}},"cairn":"This should land in the target namespace 1a46eb57185c8c308f9803d454d04ec5"}}}}}}',
            journal: '[{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"cairn","model":false,"value":"\\"This should land in the target namespace 1a46eb57185c8c308f9803d454d04ec5\\"","source":"data"}},{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"component","namespaceModelPath":"testData.hashtable.testRecord","namespaceModelId":2,"key":"7eff9a60-ebb4-4b1a-904e-1e2d2c175491"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"cairn","model":false,"value":"\\"Marker eb990988-0025-4af0-abc6-753fba64d8f6\\"","source":"data"}},{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"extensionPoint","namespaceModelPath":"testData.hashtable.testRecord.hashtable","namespaceModelId":3,"key":"hashtable"}},{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"component","namespaceModelPath":"testData.hashtable.testRecord","namespaceModelId":2,"key":"e43c3258-a374-467e-ae79-0d7a01ccfcad"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"cairn","model":false,"value":"\\"Marker b6bb9bab-b751-4acc-8305-0f758cfead67\\"","source":"data"}},{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"extensionPoint","namespaceModelPath":"testData.hashtable.testRecord.hashtable","namespaceModelId":3,"key":"hashtable"}},{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"component","namespaceModelPath":"testData.hashtable.testRecord","namespaceModelId":2,"key":"540ad737-0b66-45ab-9c83-5ad5de985963"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"cairn","model":false,"value":"\\"Marker 46eee2d2-dde0-4e5f-a8fc-ed6f9f58d2ba\\"","source":"data"}},{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"extensionPoint","namespaceModelPath":"testData.hashtable.testRecord.hashtable","namespaceModelId":3,"key":"hashtable"}},{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"component","namespaceModelPath":"testData.hashtable.testRecord","namespaceModelId":2,"key":"699cf96e-a8a8-4ed5-9351-47712c62493c"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"cairn","model":false,"value":"\\"Marker 996bbe09-562f-4f5a-a4b7-f861d1b8442b\\"","source":"data"}},{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"extensionPoint","namespaceModelPath":"testData.hashtable.testRecord.hashtable","namespaceModelId":3,"key":"hashtable"}},{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"component","namespaceModelPath":"testData.hashtable.testRecord","namespaceModelId":2,"key":"dbb6c149-257f-4d14-94c9-2d28d2d3628b"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"cairn","model":false,"value":"\\"Marker 1d7c5213-35d4-43ab-8042-53cad665b050\\"","source":"data"}},{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"extensionPoint","namespaceModelPath":"testData.hashtable.testRecord.hashtable","namespaceModelId":3,"key":"hashtable"}},{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"component","namespaceModelPath":"testData.hashtable.testRecord","namespaceModelId":2,"key":"319cce8f-0ee6-4bcf-a57b-6b379c92209a"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"cairn","model":false,"value":"\\"Marker bb6f8be0-a448-41c1-a2ca-8a261e4dbcbb\\"","source":"data"}},{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"extensionPoint","namespaceModelPath":"testData.hashtable.testRecord.hashtable","namespaceModelId":3,"key":"hashtable"}},{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"component","namespaceModelPath":"testData.hashtable.testRecord","namespaceModelId":2,"key":"2d6b96af-5c9a-4f3a-b01f-c88b01d71629"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"cairn","model":false,"value":"\\"Marker 2e77bf7d-e531-40ec-9c6b-33044b122641\\"","source":"data"}},{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"extensionPoint","namespaceModelPath":"testData.hashtable.testRecord.hashtable","namespaceModelId":3,"key":"hashtable"}}]'
        }
    }
});



