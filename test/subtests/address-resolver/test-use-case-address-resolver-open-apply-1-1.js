// test-use-case-address-resolver-open-apply-1-1.js
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
var testAddress = rootAddress.createSubpathAddress('hashtable.testRecord');
for (var token in testAddress.implementation.tokenVector) {
    testAddress.implementation.tokenVector[token].key = 'test';
}

testResult = testAddressResolverUseCase({
    strategyName: "create",
    operationName: "apply data-1",
    targetNamespace: "subcomponent-1",
    inputOptions: {
        strategy: "open",
        address: testAddress,
        parentDataReference: { testData: { hashtable: { test: {} } } },
        semanticBindingsReference: dataModel.getSemanticBindings(),
        propertyAssignmentObject: {
            cairn: "This should land in the target namespace 1a46eb57185c8c308f9803d454d04ec5"
        }
    },
    expectCallToThrow: false,
    resultExpectations: {
        resolvedComponentCount: 2,
        dataChangeEventJournalCount: 1,
        JSON: {
            namespace: '{"cairn":"This should land in the target namespace 1a46eb57185c8c308f9803d454d04ec5"}',
            parent: '{"testData":{"hashtable":{"test":{"cairn":"This should land in the target namespace 1a46eb57185c8c308f9803d454d04ec5"}}}}',
            journal: '[{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"cairn","model":false,"value":"\\"This should land in the target namespace 1a46eb57185c8c308f9803d454d04ec5\\"","source":"data"}}]'
        }
    }
});



