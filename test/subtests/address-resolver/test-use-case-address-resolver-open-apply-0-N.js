// test-use-case-address-resolver-open-apply-0-N.js
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
var testAddress = rootAddress.createSubpathAddress('hashtable.testRecord.hashtable.testRecord.hashtable.testRecord.hashtable.testRecord.hashtable.testRecord.hashtable.testRecord.hashtable.testRecord.hashtable.testRecord');
for (var token in testAddress.implementation.tokenVector) {
    testAddress.implementation.tokenVector[token].key = 'test';
}

testResult = testAddressResolverUseCase({
    strategyName: "create",
    operationName: "apply data-N",
    targetNamespace: "root",
    inputOptions: {
        strategy: "create",
        address: rootAddress,
        parentDataReference: {},
        semanticBindingsReference: dataModel.getSemanticBindings(),
        propertyAssignmentObject: {
            cairn: "a4abfc1c9985a8ab503ad0c354cdc28d",
            namespaceChildA: {
                cairn: "e11132db80e57b34b7176efb54cdc284",
                hashtable: {
                    "1839ab9a132979d5373bd24954cdc275": {
                        hashtable: {
                            "0f7a35978f6953a5ff711ebb54cdc26e": {
                                hashtable: {
                                    "f9dfa630103cb21ed81ee60454cdc2a4": {
                                        cairn: "2323b10f971bf2538cc8ceab54cdc2b3"
                                    }
                                }
                            }
                        }
                    }
                }
            },
            bolton: {
                cairn: "101e28e0be798667599be16e54cdc21"
            },
            bolton: {
                cairn: "22c7ab61c5c1d923fee20a9054cdc22e"
            }
        }
    },
    expectCallToThrow: false,
    resultExpectations: {
        resolvedComponentCount: 1,
        dataChangeEventJournalCount: 5,
        JSON: {
            namespace: '{"cairn":"a4abfc1c9985a8ab503ad0c354cdc28d","namespaceChildA":{"cairn":"e11132db80e57b34b7176efb54cdc284","hashtable":{"1839ab9a132979d5373bd24954cdc275":{"hashtable":{"0f7a35978f6953a5ff711ebb54cdc26e":{"hashtable":{"f9dfa630103cb21ed81ee60454cdc2a4":{"cairn":"2323b10f971bf2538cc8ceab54cdc2b3"}}}}}}},"bolton":{"cairn":"22c7ab61c5c1d923fee20a9054cdc22e"},"hashtable":{}}',
            parent: '{"testData":{"cairn":"a4abfc1c9985a8ab503ad0c354cdc28d","namespaceChildA":{"cairn":"e11132db80e57b34b7176efb54cdc284","hashtable":{"1839ab9a132979d5373bd24954cdc275":{"hashtable":{"0f7a35978f6953a5ff711ebb54cdc26e":{"hashtable":{"f9dfa630103cb21ed81ee60454cdc2a4":{"cairn":"2323b10f971bf2538cc8ceab54cdc2b3"}}}}}}},"bolton":{"cairn":"22c7ab61c5c1d923fee20a9054cdc22e"},"hashtable":{}}}',
            journal: '[{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"root","namespaceModelPath":"testData","namespaceModelId":0,"key":"testData"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"cairn","model":false,"value":"\\"a4abfc1c9985a8ab503ad0c354cdc28d\\"","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"namespaceChildA","model":false,"value":"{\\"cairn\\":\\"e11132db80e57b34b7176efb54cdc284\\",\\"hashtable\\":{\\"1839ab9a132979d5373bd24954cdc275\\":{\\"hashtable\\":{\\"0f7a35978f6953a5ff711ebb54cdc26e\\":{\\"hashtable\\":{\\"f9dfa630103cb21ed81ee60454cdc2a4\\":{\\"cairn\\":\\"2323b10f971bf2538cc8ceab54cdc2b3\\"}}}}}}}","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"bolton","model":false,"value":"{\\"cairn\\":\\"22c7ab61c5c1d923fee20a9054cdc22e\\"}","source":"data"}},{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"extensionPoint","namespaceModelPath":"testData.hashtable","namespaceModelId":1,"key":"hashtable"}}]'
        }
    }
});



