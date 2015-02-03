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
var testAddress = rootAddress.createSubpathAddress('hashtable.testRecord');
for (var token in testAddress.implementation.tokenVector) {
    testAddress.implementation.tokenVector[token].key = 'test';
}

testResult = testAddressResolverUseCase({
    strategyName: "create",
    operationName: "apply data-N",
    targetNamespace: "subcomponent-1",
    inputOptions: {
        strategy: "open",
        address: testAddress,
        parentDataReference: { testData: { hashtable: { test: { hashtable: { } } } } },
        semanticBindingsReference: dataModel.getSemanticBindings(),
        propertyAssignmentObject: {
            cairn: "This should land in the target namespace 7a44e28a5b1deb19e0abe6e054d04ffc",
            hashtable: {
                "405b5b8200e4e2505a9f468d54d0500f": {
                    cairn: "Marker 8fe4a6646e5b356d5aa70de154d05023",
                    hashtable: {
                        "28015506d4904948434f02d254d05032": {
                            cairn: "Marker 212a90e3a52e9feee3e805b054d05070",
                            hashtable: {
                                "573e1d724c820c0c7b2d3cc154d05041": {
                                    cairn: "Marker e3d87166fdbf713b56bed4e054d05058"
                                },
                                "sdfsdf": {}
                            }
                        },
                        "4f58f6ebfbbcd804878eeab854d05093": {
                            cairn: "Marker c06f8f7f37267a56ef5496a054d0509f",
                            hashtable: {
                                "28d20e5fdc7ddeb1e26116dc54d050a9": {
                                    cairn: "Marker 969788d26592d836deedf15554d050b5"
                                }
                            }
                        }
                    }
                },
                "34ee3c51a7ac44e5db44653054d050d9": {
                    cairn: "Marker a29d2e0a060556f54532e4e354d050e6",
                    hashtable: {
                        "62520cebec8046d60822160d54d05101": {
                            cairn: "Marker 53bdf55f363e873bf5449c6e54d05114"
                        }
                    }
                }
            }
        }
    },
    expectCallToThrow: false,
    resultExpectations: {
        resolvedComponentCount: 2,
        dataChangeEventJournalCount: 8, // should be equal # of cairns
        JSON: {
            namespace: '{"hashtable":{"405b5b8200e4e2505a9f468d54d0500f":{"cairn":"Marker 8fe4a6646e5b356d5aa70de154d05023","hashtable":{"28015506d4904948434f02d254d05032":{"cairn":"Marker 212a90e3a52e9feee3e805b054d05070","hashtable":{"573e1d724c820c0c7b2d3cc154d05041":{"cairn":"Marker e3d87166fdbf713b56bed4e054d05058","hashtable":{}}}},"4f58f6ebfbbcd804878eeab854d05093":{"cairn":"Marker c06f8f7f37267a56ef5496a054d0509f","hashtable":{"28d20e5fdc7ddeb1e26116dc54d050a9":{"cairn":"Marker 969788d26592d836deedf15554d050b5","hashtable":{}}}}}}},"cairn":"This should land in the target namespace 7a44e28a5b1deb19e0abe6e054d04ffc"}',
            parent: '{"testData":{"hashtable":{"test":{"hashtable":{"405b5b8200e4e2505a9f468d54d0500f":{"cairn":"Marker 8fe4a6646e5b356d5aa70de154d05023","hashtable":{"28015506d4904948434f02d254d05032":{"cairn":"Marker 212a90e3a52e9feee3e805b054d05070","hashtable":{"573e1d724c820c0c7b2d3cc154d05041":{"cairn":"Marker e3d87166fdbf713b56bed4e054d05058","hashtable":{}}}},"4f58f6ebfbbcd804878eeab854d05093":{"cairn":"Marker c06f8f7f37267a56ef5496a054d0509f","hashtable":{"28d20e5fdc7ddeb1e26116dc54d050a9":{"cairn":"Marker 969788d26592d836deedf15554d050b5","hashtable":{}}}}}}},"cairn":"This should land in the target namespace 7a44e28a5b1deb19e0abe6e054d04ffc"}}}}',
            journal: '[{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"cairn","model":false,"value":"\\"This should land in the target namespace 7a44e28a5b1deb19e0abe6e054d04ffc\\"","source":"data"}},{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"component","namespaceModelPath":"testData.hashtable.testRecord","namespaceModelId":2,"key":"405b5b8200e4e2505a9f468d54d0500f"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"cairn","model":false,"value":"\\"Marker 8fe4a6646e5b356d5aa70de154d05023\\"","source":"data"}},{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"extensionPoint","namespaceModelPath":"testData.hashtable.testRecord.hashtable","namespaceModelId":3,"key":"hashtable"}},{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"component","namespaceModelPath":"testData.hashtable.testRecord","namespaceModelId":2,"key":"28015506d4904948434f02d254d05032"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"cairn","model":false,"value":"\\"Marker 212a90e3a52e9feee3e805b054d05070\\"","source":"data"}},{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"extensionPoint","namespaceModelPath":"testData.hashtable.testRecord.hashtable","namespaceModelId":3,"key":"hashtable"}},{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"component","namespaceModelPath":"testData.hashtable.testRecord","namespaceModelId":2,"key":"573e1d724c820c0c7b2d3cc154d05041"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"cairn","model":false,"value":"\\"Marker e3d87166fdbf713b56bed4e054d05058\\"","source":"data"}},{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"extensionPoint","namespaceModelPath":"testData.hashtable.testRecord.hashtable","namespaceModelId":3,"key":"hashtable"}},{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"component","namespaceModelPath":"testData.hashtable.testRecord","namespaceModelId":2,"key":"4f58f6ebfbbcd804878eeab854d05093"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"cairn","model":false,"value":"\\"Marker c06f8f7f37267a56ef5496a054d0509f\\"","source":"data"}},{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"extensionPoint","namespaceModelPath":"testData.hashtable.testRecord.hashtable","namespaceModelId":3,"key":"hashtable"}},{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"component","namespaceModelPath":"testData.hashtable.testRecord","namespaceModelId":2,"key":"28d20e5fdc7ddeb1e26116dc54d050a9"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"cairn","model":false,"value":"\\"Marker 969788d26592d836deedf15554d050b5\\"","source":"data"}},{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"extensionPoint","namespaceModelPath":"testData.hashtable.testRecord.hashtable","namespaceModelId":3,"key":"hashtable"}}]'
        }
    }
});



