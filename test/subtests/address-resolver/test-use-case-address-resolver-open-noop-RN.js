// test-use-case-address-resolver-open-noop-N.js
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
var testAddress = rootAddress.createSubpathAddress('hashtable.testRecord.hashtable.testRecord.hashtable.testRecord.hashtable.testRecord.hashtable.testRecord');
for (var token in testAddress.implementation.tokenVector) {
    testAddress.implementation.tokenVector[token].key = 'test';
}

testAddress.implementation.tokenVector[1].key = testAddress.implementation.tokenVector[2].key = 'test';

testResult = testAddressResolverUseCase({
    strategyName: "open",
    operationName: "noop",
    targetNamespace: "root",
    inputOptions: {
        strategy: "open",
        address: testAddress,
        parentDataReference: {
            testData: {
                hashtable: { 
                    test: {
                        hashtable: { 
                            test: {
                                hashtable: {
                                    test: {
                                        hashtable: {
                                            test: {
                                                hashtable: {
                                                    test: {
                                                        hashtable: {
                                                            test: {
                                                                hashtable: { cairn: "marker in level 6 subcomponent" }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        semanticBindingsReference: dataModel.getSemanticBindings(),
        propertyAssignmentObject: {}
    },
    expectCallToThrow: false,
    resultExpectations: {
        resolvedComponentCount: 6,
        dataChangeEventJournalCount: 0,
        JSON: {
            namespace: '{"hashtable":{"test":{"hashtable":{"cairn":"marker in level 6 subcomponent"}}}}',
            parent: '{"testData":{"hashtable":{"test":{"hashtable":{"test":{"hashtable":{"test":{"hashtable":{"test":{"hashtable":{"test":{"hashtable":{"test":{"hashtable":{"cairn":"marker in level 6 subcomponent"}}}}}}}}}}}}}}}',
            journal: '[]'
        }
    }
});



