// test-use-case-address-resolver-open-apply-1-N.js
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
var testAddress = rootAddress.createSubpathAddress('hashtable.testRecord.hashtable.testRecord.hashtable.testRecord.hashtable.testRecord.hashtable.testRecord.hashtable.testRecord.hashtable.testRecord.hashtable.testRecord.hashtable.testRecord.hashtable.testRecord.hashtable.testRecord.hashtable.testRecord.hashtable.testRecord.hashtable.testRecord.hashtable.testRecord.hashtable.testRecord.hashtable.testRecord.hashtable.testRecord.hashtable.testRecord.hashtable.testRecord.hashtable.testRecord.hashtable.testRecord.hashtable.testRecord.hashtable.testRecord.hashtable.testRecord.hashtable.testRecord');
for (var token in testAddress.implementation.tokenVector) {
    testAddress.implementation.tokenVector[token].key = 'test';
}

testResult = testAddressResolverUseCase({
    strategyName: "create",
    operationName: "apply data-N",
    targetNamespace: "subcomponent-1",
    inputOptions: {
        strategy: "create",
        address: testAddress,
        parentDataReference: {},
        semanticBindingsReference: dataModel.getSemanticBindings(),
        propertyAssignmentObject: {
            testKeyValue: { test: "test data value in root namespace" }
        }
    },
    expectCallToThrow: false,
    resultExpectations: {
        resolvedComponentCount: 2,
        dataChangeEventJournalCount: 5,
        JSON: {
            namespace: '',
            parent: '',
            journal: ''
        }
    }
});



