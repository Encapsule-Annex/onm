// test-use-case-address-resolver-open-apply-0-N.js
//

var onm = require('../../../index');
var testAddressResolverUseCase = require('./test-core-address-resolver');

var dataModelDeclaration = {
    uuid: "f704213fcea52c033d36831354d58c70",
    uuidVersion: "0ca21119213ceb664aec67de54d58c82",
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

testResult = testAddressResolverUseCase({
    strategyName: "open",
    operationName: "apply data-N",
    targetNamespace: "root",
    inputOptions: {
        strategy: "open",
        address: rootAddress,
        parentDataReference: {
            testData: {
                hashtable: {}
            }
        },
        semanticBindingsReference: dataModel.getSemanticBindings(),
        propertyAssignmentObject: {
            hashtable: {
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
        dataChangeEventJournalCount: 4,
        JSON: {
            namespace: '{"hashtable":{"hashtable":{"1839ab9a132979d5373bd24954cdc275":{"hashtable":{"0f7a35978f6953a5ff711ebb54cdc26e":{"hashtable":{"f9dfa630103cb21ed81ee60454cdc2a4":{"cairn":"2323b10f971bf2538cc8ceab54cdc2b3"}}}}},"hashtable":{}}},"bolton":{"cairn":"22c7ab61c5c1d923fee20a9054cdc22e"}}',
            parent: '{"testData":{"hashtable":{"hashtable":{"1839ab9a132979d5373bd24954cdc275":{"hashtable":{"0f7a35978f6953a5ff711ebb54cdc26e":{"hashtable":{"f9dfa630103cb21ed81ee60454cdc2a4":{"cairn":"2323b10f971bf2538cc8ceab54cdc2b3"}}}}},"hashtable":{}}},"bolton":{"cairn":"22c7ab61c5c1d923fee20a9054cdc22e"}}}',
            journal: '[{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"bolton","model":false,"value":"{\\"cairn\\":\\"22c7ab61c5c1d923fee20a9054cdc22e\\"}","source":"data"}},{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"component","namespaceModelPath":"testData.hashtable.testRecord","namespaceModelId":2,"key":"hashtable"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"1839ab9a132979d5373bd24954cdc275","model":false,"value":"{\\"hashtable\\":{\\"0f7a35978f6953a5ff711ebb54cdc26e\\":{\\"hashtable\\":{\\"f9dfa630103cb21ed81ee60454cdc2a4\\":{\\"cairn\\":\\"2323b10f971bf2538cc8ceab54cdc2b3\\"}}}}}","source":"data"}},{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"extensionPoint","namespaceModelPath":"testData.hashtable.testRecord.hashtable","namespaceModelId":3,"key":"hashtable"}}]'
        }
    }
});

testResult = testAddressResolverUseCase({
    strategyName: "open",
    operationName: "apply data-N (w/framing error)",
    targetNamespace: "root",
    inputOptions: {
        strategy: "open",
        address: rootAddress,
        parentDataReference: {
            testData: {
                hashtable: {}
            }
        },
        semanticBindingsReference: dataModel.getSemanticBindings(),
        propertyAssignmentObject: {
            hashtable: {
                cairn: "CALLER DATA FRAMING ERROR BECAUSE STRING, NOT NAMED OBJECT::e11132db80e57b34b7176efb54cdc284",
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
    expectCallToThrow: true
});



