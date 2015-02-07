// test-use-case-address-resolver-create-apply-2-1.js
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
var testAddress = rootAddress.createSubpathAddress('hashtable.testRecord.hashtable');
for (var token in testAddress.implementation.tokenVector) {
    testAddress.implementation.tokenVector[token].key = 'test';
}

testResult = testAddressResolverUseCase({
    strategyName: "create",
    operationName: "apply data-1",
    targetNamespace: "subcomponent-1",
    inputOptions: {
        strategy: "create",
        address: testAddress,
        parentDataReference: {},
        semanticBindingsReference: dataModel.getSemanticBindings(),
        propertyAssignmentObject: {
            object0: { cairn: "should land in object 0" },
            object1: { cairn: "should land in object 1" },
            object2: { cairn: "should land in object 2" }
        }
    },
    expectCallToThrow: false,
    resultExpectations: {
        resolvedComponentCount: 2,
        dataChangeEventJournalCount: 13,
        JSON: {
            namespace: '{"object0":{"cairn":"should land in object 0","hashtable":{}},"object1":{"cairn":"should land in object 1","hashtable":{}},"object2":{"cairn":"should land in object 2","hashtable":{}}}',
            parent: '{"testData":{"hashtable":{"test":{"hashtable":{"object0":{"cairn":"should land in object 0","hashtable":{}},"object1":{"cairn":"should land in object 1","hashtable":{}},"object2":{"cairn":"should land in object 2","hashtable":{}}}}}}}',
            journal: '[{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"root","namespaceModelPath":"testData","namespaceModelId":0,"key":"testData"}},{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"extensionPoint","namespaceModelPath":"testData.hashtable","namespaceModelId":1,"key":"hashtable"}},{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"component","namespaceModelPath":"testData.hashtable.testRecord","namespaceModelId":2,"key":"test"}},{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"extensionPoint","namespaceModelPath":"testData.hashtable.testRecord.hashtable","namespaceModelId":3,"key":"hashtable"}},{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"component","namespaceModelPath":"testData.hashtable.testRecord","namespaceModelId":2,"key":"object0"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"cairn","model":false,"value":"\\"should land in object 0\\"","source":"data"}},{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"extensionPoint","namespaceModelPath":"testData.hashtable.testRecord.hashtable","namespaceModelId":3,"key":"hashtable"}},{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"component","namespaceModelPath":"testData.hashtable.testRecord","namespaceModelId":2,"key":"object1"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"cairn","model":false,"value":"\\"should land in object 1\\"","source":"data"}},{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"extensionPoint","namespaceModelPath":"testData.hashtable.testRecord.hashtable","namespaceModelId":3,"key":"hashtable"}},{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"component","namespaceModelPath":"testData.hashtable.testRecord","namespaceModelId":2,"key":"object2"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"cairn","model":false,"value":"\\"should land in object 2\\"","source":"data"}},{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"extensionPoint","namespaceModelPath":"testData.hashtable.testRecord.hashtable","namespaceModelId":3,"key":"hashtable"}}]'
        }
    }
});



