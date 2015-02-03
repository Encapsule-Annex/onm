// test-use-case-address-resolver-create-apply-2-N.js
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
            object2: { cairn: "should land in object 2",
                       hashtable: {
                           object0: { cairn: "should land in subobject 0" },
                           object1: { cairn: "should land in subobject 1" },
                           object2: { cairn: "should land in subobject 2" }
                       }
                     }
        }
    },
    expectCallToThrow: false,
    resultExpectations: {
        resolvedComponentCount: 2,
        dataChangeEventJournalCount: 7,
        JSON: {
            namespace: '{"object0":{"cairn":"should land in object 0"},"object1":{"cairn":"should land in object 1"},"object2":{"cairn":"should land in object 2","hashtable":{"object0":{"cairn":"should land in subobject 0"},"object1":{"cairn":"should land in subobject 1"},"object2":{"cairn":"should land in subobject 2"}}}}',
            parent: '{"testData":{"hashtable":{"test":{"hashtable":{"object0":{"cairn":"should land in object 0"},"object1":{"cairn":"should land in object 1"},"object2":{"cairn":"should land in object 2","hashtable":{"object0":{"cairn":"should land in subobject 0"},"object1":{"cairn":"should land in subobject 1"},"object2":{"cairn":"should land in subobject 2"}}}}}}}}',
            journal: '[{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"root","namespaceModelPath":"testData","namespaceModelId":0,"key":"testData"}},{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"extensionPoint","namespaceModelPath":"testData.hashtable","namespaceModelId":1,"key":"hashtable"}},{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"component","namespaceModelPath":"testData.hashtable.testRecord","namespaceModelId":2,"key":"test"}},{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"extensionPoint","namespaceModelPath":"testData.hashtable.testRecord.hashtable","namespaceModelId":3,"key":"hashtable"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"object0","model":false,"value":"{\\"cairn\\":\\"should land in object 0\\"}","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"object1","model":false,"value":"{\\"cairn\\":\\"should land in object 1\\"}","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"object2","model":false,"value":"{\\"cairn\\":\\"should land in object 2\\",\\"hashtable\\":{\\"object0\\":{\\"cairn\\":\\"should land in subobject 0\\"},\\"object1\\":{\\"cairn\\":\\"should land in subobject 1\\"},\\"object2\\":{\\"cairn\\":\\"should land in subobject 2\\"}}}","source":"data"}}]'
        }
    }
});



