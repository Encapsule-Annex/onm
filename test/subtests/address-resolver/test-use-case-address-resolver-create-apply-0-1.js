// test-use-case-address-resolver-create-apply-0-1.js
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

testResult = testAddressResolverUseCase({
    strategyName: "create",
    operationName: "apply data-1",
    targetNamespace: "root",
    inputOptions: {
        strategy: "create",
        address: rootAddress,
        parentDataReference: {},
        semanticBindingsReference: dataModel.getSemanticBindings(),
        propertyAssignmentObject: {
            cairn: "test data value in root namespace"
        }
    },
    expectCallToThrow: false,
    resultExpectations: {
        resolvedComponentCount: 1,
        dataChangeEventJournalCount: 3,
        JSON: {
            namespace: '{"cairn":"test data value in root namespace","hashtable":{}}',
            parent: '{"testData":{"cairn":"test data value in root namespace","hashtable":{}}}',
            journal: '[{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"root","namespaceModelPath":"testData","namespaceModelId":0,"key":"testData"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"cairn","model":false,"value":"\\"test data value in root namespace\\"","source":"data"}},{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"extensionPoint","namespaceModelPath":"testData.hashtable","namespaceModelId":1,"key":"hashtable"}}]'
        }
    }
});



