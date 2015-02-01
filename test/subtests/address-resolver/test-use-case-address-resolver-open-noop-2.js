// test-use-case-address-resolver-open-noop-2.js
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
testAddress.implementation.tokenVector[1].key = testAddress.implementation.tokenVector[2].key = 'test';

testResult = testAddressResolverUseCase({
    strategyName: "open",
    operationName: "noop",
    targetNamespace: "root",
    inputOptions: {
        strategy: "open",
        address: testAddress,
        parentDataReference: { testData: { hashtable: { test: { hashtable: { test: { cairn: "test marker in level 2 subcomponent" } } } } } },
        semanticBindingsReference: dataModel.getSemanticBindings(),
        propertyAssignmentObject: {}
    },
    expectCallToThrow: false,
    resultExpectations: {
        resolvedComponentCount: 3,
        dataChangeEventJournalCount: 0,
        JSON: {
            namespace: '{"cairn":"test marker in level 2 subcomponent"}',
            parent: '{"testData":{"hashtable":{"test":{"hashtable":{"test":{"cairn":"test marker in level 2 subcomponent"}}}}}}',
            journal: '[]'
        }
    }
});



