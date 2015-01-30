// test-use-case-component-resolver-open-apply-subnamespace-N-data-0.js

var onm = require('../../../index');
var testComponentResolverUseCase = require('./test-core-component-resolver');
var dataModelDeclaration = require('../../fixture/named-object-resolve-test-data-model');
var dataModel = new onm.Model(dataModelDeclaration).implementation.resetKeyGenerator();
var childToken = dataModel.createPathAddress("namespaceRoot.namespaceChildA.namespaceChildB.namespaceChildC.namespaceChildD").implementation.getLastToken();

var testComponentResolverUseCase = require('./test-core-component-resolver');

testComponentResolverUseCase({
    strategyName: "open",
    operationName: "apply data-0",
    targetNamespace: "subnamespace-N",
    inputOptions: {
        strategy: 'open',
        addressToken: childToken,
        parentDataReference: {
            namespaceRoot: { 
                namespaceChildA: {
                    namespaceChildB: {
                        namespaceChildC: {
                            // this is the namespace addressed by the token
                            namespaceChildD: {
                                namespaceChildE: {
                                },
                                namespaceExtensionPointE: {
                                }
                            }
                        }
                    }
                }
            }
        },
        propertyAssignmentObject: {
            a: "3a7e3bd70c832db932c7c34954cc0e1a",
            _a: "6ba0ba0cd002e7a66d54844354cc0e26",
            namespaceChildE: {
                a: "c0e3eb841ada0434eecf971154cc0ee6",
                _a: "c8cf39d1dc7d4a50932cb35e54cc0ef1"
            },
            namespaceExtensionPointE: {
                key0: {}, key1: {}, key2: {}, key3: {}, key4: {}
            }
        },
        semanticBindingsReference: dataModel.getSemanticBindings()
    },
    expectCallToThrow: false,
    resultExpectations: {
        resolvedNamedObjectCount: 5,
        pendingSubcomponentCount: 5,
        dataChangeEventJournalCount: 4,
        JSON: {
            namespace: '{"namespaceChildE":{"a":"c0e3eb841ada0434eecf971154cc0ee6","_a":"c8cf39d1dc7d4a50932cb35e54cc0ef1"},"namespaceExtensionPointE":{},"a":"3a7e3bd70c832db932c7c34954cc0e1a","_a":"6ba0ba0cd002e7a66d54844354cc0e26"}',
            parent: '{"namespaceRoot":{"namespaceChildA":{"namespaceChildB":{"namespaceChildC":{"namespaceChildD":{"namespaceChildE":{"a":"c0e3eb841ada0434eecf971154cc0ee6","_a":"c8cf39d1dc7d4a50932cb35e54cc0ef1"},"namespaceExtensionPointE":{},"a":"3a7e3bd70c832db932c7c34954cc0e1a","_a":"6ba0ba0cd002e7a66d54844354cc0e26"}}}}}}',
            journal: '[{"layer":"namedObject","event":"propertyUpdated","eventData":{"name":"a","model":true,"value":"\\"3a7e3bd70c832db932c7c34954cc0e1a\\"","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"_a","model":false,"value":"\\"6ba0ba0cd002e7a66d54844354cc0e26\\"","source":"data"}},{"layer":"namedObject","event":"propertyUpdated","eventData":{"name":"a","model":true,"value":"\\"c0e3eb841ada0434eecf971154cc0ee6\\"","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"_a","model":false,"value":"\\"c8cf39d1dc7d4a50932cb35e54cc0ef1\\"","source":"data"}}]'
        }
    }
});

