// test-use-case-address-resolver-open-apply-0-1.js
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
    operationName: "apply data-1",
    targetNamespace: "root",
    inputOptions: {
        strategy: "open",
        address: rootAddress,
        parentDataReference: { testData: {} },
        semanticBindingsReference: dataModel.getSemanticBindings(),
        propertyAssignmentObject: {
            cairn: "test data value in root namespace"
        }
    },
    expectCallToThrow: false,
    resultExpectations: {
        resolvedComponentCount: 1,
        dataChangeEventJournalCount: 1,
        JSON: {
            namespace: '{"cairn":"test data value in root namespace"}',
            parent: '{"testData":{"cairn":"test data value in root namespace"}}',
            journal: '[{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"cairn","model":false,"value":"\\"test data value in root namespace\\"","source":"data"}}]'
        }
    }
});



