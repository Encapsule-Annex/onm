// test-use-case-component-resolver-create-apply-root-data-N.js

var onm = require('../../../index');
var testComponentResolverUseCase = require('./test-core-component-resolver');
var dataModelDeclaration = require('../../fixture/named-object-resolve-test-data-model');
var dataModel = new onm.Model(dataModelDeclaration).implementation.resetKeyGenerator();
var rootToken = dataModel.createRootAddress().implementation.getLastToken();

var testComponentResolverUseCase = require('./test-core-component-resolver');

testComponentResolverUseCase({
    strategyName: "create",
    operationName: "apply",
    targetNamespace: "root data-N",
    inputOptions: {
        strategy: 'create',
        addressToken: rootToken,
        parentDataReference: {},
        propertyAssignmentObject: {
            a: 'data-0 override fdc09080-a775-11e4-9b26-080027d17300',
            b: 'data-0 override 0d2423b6-a776-11e4-8481-080027d17300',
            d: 'data-0 override 1fe36a16-a776-11e4-bc20-080027d17300',
            e: 'data-0 override 28ce4808-a776-11e4-82fd-080027d17300',
            namespaceExtensionPointA: {
                key0: {}, key1: {}, key2: {}, key3: {}, key4: {}
            },
            namespaceChildA: {
                a: 'data-1 override 9c7f8bb8-a776-11e4-a60b-080027d17300',
                b: 'data-1 override a26f2f6a-a776-11e4-a846-080027d17300',
                d: 'data-1 override b0a933c8-a776-11e4-9bf9-080027d17300',
                e: 'data-1 override fdfc3f08-a776-11e4-ae9c-080027d17300',
                namespaceExtensionPointB: {
                    key0: {}, key1: {}, key2: {}, key3: {}, key4: {}
                },
                namespaceChildB: {
                    a: 'data-2',
                    b: 'data-2 override fdbb72b4-a778-11e4-8af2-080027d17300',
                    d: 'data-2',
                    e: 'data-2',
                    namespaceChildC: {
                        a: 'data-3',
                        b: 'data-3',
                        d: 'data-3 override 08c6c492-a779-11e4-a168-080027d17300',
                        e: 'data-3',
                        namespaceChildD: {
                            a: 'data-4',
                            b: 'data-4 override 1413be0e-a779-11e4-962e-080027d17300',
                            d: 'data-4',
                            e: 'data-4',
                            namespaceChildE: {
                                a: 'data-5',
                                b: 'data-5',
                                d: 'data-5',
                                e: 'data-5 override 1f051e70-a779-11e4-93f2-080027d17300'
                            },
                            namespaceExtensionPointE: {
                                key0: {}, key1: {}, key2: {}, key3: {}, key4: {}
                            }
                        },
                    }
                }
            }
        },
        semanticBindingsReference: dataModel.getSemanticBindings()
    },
    expectCallToThrow: false,
    resultExpectations: {
        resolvedNamedObjectCount: 1,
        pendingSubcomponentCount: 15,
        dataChangeEventJournalCount: 45,
        JSON: {
            namespace: '{"a":"data-0 override fdc09080-a775-11e4-9b26-080027d17300","b":"data-0 override 0d2423b6-a776-11e4-8481-080027d17300","c":"default c","d":"data-0 override 1fe36a16-a776-11e4-bc20-080027d17300","e":"data-0 override 28ce4808-a776-11e4-82fd-080027d17300","f":"default f","namespaceExtensionPointA":{},"namespaceChildA":{"a":"data-1 override 9c7f8bb8-a776-11e4-a60b-080027d17300","b":"data-1 override a26f2f6a-a776-11e4-a846-080027d17300","c":"default c","d":"data-1 override b0a933c8-a776-11e4-9bf9-080027d17300","e":"data-1 override fdfc3f08-a776-11e4-ae9c-080027d17300","f":"default f","namespaceExtensionPointB":{},"namespaceChildB":{"a":"data-2","b":"data-2 override fdbb72b4-a778-11e4-8af2-080027d17300","c":"default c","d":"data-2","e":"data-2","f":"default f","namespaceChildC":{"a":"data-3","b":"data-3","c":"default c","d":"data-3 override 08c6c492-a779-11e4-a168-080027d17300","e":"data-3","f":"default f","namespaceChildD":{"a":"data-4","b":"data-4 override 1413be0e-a779-11e4-962e-080027d17300","c":"default c","d":"data-4","e":"data-4","f":"default f","namespaceExtensionPointE":{},"namespaceChildE":{"a":"data-5","b":"data-5","c":"default c","d":"data-5","e":"data-5 override 1f051e70-a779-11e4-93f2-080027d17300","f":"default f"}}}}}}',
            parent: '{"namespaceRoot":{"a":"data-0 override fdc09080-a775-11e4-9b26-080027d17300","b":"data-0 override 0d2423b6-a776-11e4-8481-080027d17300","c":"default c","d":"data-0 override 1fe36a16-a776-11e4-bc20-080027d17300","e":"data-0 override 28ce4808-a776-11e4-82fd-080027d17300","f":"default f","namespaceExtensionPointA":{},"namespaceChildA":{"a":"data-1 override 9c7f8bb8-a776-11e4-a60b-080027d17300","b":"data-1 override a26f2f6a-a776-11e4-a846-080027d17300","c":"default c","d":"data-1 override b0a933c8-a776-11e4-9bf9-080027d17300","e":"data-1 override fdfc3f08-a776-11e4-ae9c-080027d17300","f":"default f","namespaceExtensionPointB":{},"namespaceChildB":{"a":"data-2","b":"data-2 override fdbb72b4-a778-11e4-8af2-080027d17300","c":"default c","d":"data-2","e":"data-2","f":"default f","namespaceChildC":{"a":"data-3","b":"data-3","c":"default c","d":"data-3 override 08c6c492-a779-11e4-a168-080027d17300","e":"data-3","f":"default f","namespaceChildD":{"a":"data-4","b":"data-4 override 1413be0e-a779-11e4-962e-080027d17300","c":"default c","d":"data-4","e":"data-4","f":"default f","namespaceExtensionPointE":{},"namespaceChildE":{"a":"data-5","b":"data-5","c":"default c","d":"data-5","e":"data-5 override 1f051e70-a779-11e4-93f2-080027d17300","f":"default f"}}}}}}}',
            journal: '[{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"root","namespaceModelPath":"namespaceRoot","namespaceModelId":0,"key":"namespaceRoot"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"a","model":true,"value":"\\"data-0 override fdc09080-a775-11e4-9b26-080027d17300\\"","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"b","model":true,"value":"\\"data-0 override 0d2423b6-a776-11e4-8481-080027d17300\\"","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"c","model":true,"value":"\\"default c\\"","source":"model"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"d","model":true,"value":"\\"data-0 override 1fe36a16-a776-11e4-bc20-080027d17300\\"","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"e","model":true,"value":"\\"data-0 override 28ce4808-a776-11e4-82fd-080027d17300\\"","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"f","model":true,"value":"\\"default f\\"","source":"model"}},{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"child","namespaceModelPath":"namespaceRoot.namespaceChildA","namespaceModelId":1,"key":"namespaceChildA"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"a","model":true,"value":"\\"data-1 override 9c7f8bb8-a776-11e4-a60b-080027d17300\\"","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"b","model":true,"value":"\\"data-1 override a26f2f6a-a776-11e4-a846-080027d17300\\"","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"c","model":true,"value":"\\"default c\\"","source":"model"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"d","model":true,"value":"\\"data-1 override b0a933c8-a776-11e4-9bf9-080027d17300\\"","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"e","model":true,"value":"\\"data-1 override fdfc3f08-a776-11e4-ae9c-080027d17300\\"","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"f","model":true,"value":"\\"default f\\"","source":"model"}},{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"child","namespaceModelPath":"namespaceRoot.namespaceChildA.namespaceChildB","namespaceModelId":2,"key":"namespaceChildB"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"a","model":true,"value":"\\"data-2\\"","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"b","model":true,"value":"\\"data-2 override fdbb72b4-a778-11e4-8af2-080027d17300\\"","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"c","model":true,"value":"\\"default c\\"","source":"model"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"d","model":true,"value":"\\"data-2\\"","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"e","model":true,"value":"\\"data-2\\"","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"f","model":true,"value":"\\"default f\\"","source":"model"}},{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"child","namespaceModelPath":"namespaceRoot.namespaceChildA.namespaceChildB.namespaceChildC","namespaceModelId":3,"key":"namespaceChildC"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"a","model":true,"value":"\\"data-3\\"","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"b","model":true,"value":"\\"data-3\\"","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"c","model":true,"value":"\\"default c\\"","source":"model"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"d","model":true,"value":"\\"data-3 override 08c6c492-a779-11e4-a168-080027d17300\\"","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"e","model":true,"value":"\\"data-3\\"","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"f","model":true,"value":"\\"default f\\"","source":"model"}},{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"child","namespaceModelPath":"namespaceRoot.namespaceChildA.namespaceChildB.namespaceChildC.namespaceChildD","namespaceModelId":4,"key":"namespaceChildD"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"a","model":true,"value":"\\"data-4\\"","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"b","model":true,"value":"\\"data-4 override 1413be0e-a779-11e4-962e-080027d17300\\"","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"c","model":true,"value":"\\"default c\\"","source":"model"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"d","model":true,"value":"\\"data-4\\"","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"e","model":true,"value":"\\"data-4\\"","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"f","model":true,"value":"\\"default f\\"","source":"model"}},{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"child","namespaceModelPath":"namespaceRoot.namespaceChildA.namespaceChildB.namespaceChildC.namespaceChildD.namespaceChildE","namespaceModelId":5,"key":"namespaceChildE"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"a","model":true,"value":"\\"data-5\\"","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"b","model":true,"value":"\\"data-5\\"","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"c","model":true,"value":"\\"default c\\"","source":"model"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"d","model":true,"value":"\\"data-5\\"","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"e","model":true,"value":"\\"data-5 override 1f051e70-a779-11e4-93f2-080027d17300\\"","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"f","model":true,"value":"\\"default f\\"","source":"model"}},{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"extensionPoint","namespaceModelPath":"namespaceRoot.namespaceChildA.namespaceChildB.namespaceChildC.namespaceChildD.namespaceExtensionPointE","namespaceModelId":6,"key":"namespaceExtensionPointE"}},{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"extensionPoint","namespaceModelPath":"namespaceRoot.namespaceChildA.namespaceExtensionPointB","namespaceModelId":8,"key":"namespaceExtensionPointB"}},{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"extensionPoint","namespaceModelPath":"namespaceRoot.namespaceExtensionPointA","namespaceModelId":11,"key":"namespaceExtensionPointA"}}]'
        }
    }
});

testComponentResolverUseCase({
    strategyName: "create",
    operationName: "apply",
    targetNamespace: "root data-N",
    inputOptions: {
        strategy: 'create',
        addressToken: rootToken,
        parentDataReference: {},
        propertyAssignmentObject: {
            a: 'data-0 override fdc09080-a775-11e4-9b26-080027d17300',
            b: 'data-0 override 0d2423b6-a776-11e4-8481-080027d17300',
            d: 'data-0 override 1fe36a16-a776-11e4-bc20-080027d17300',
            e: 'data-0 override 28ce4808-a776-11e4-82fd-080027d17300',
            extra: '+1 change event',
            namespaceExtensionPointA: {
                key0: {},
                key1: {},
                key2: {},
                key3: {},
                key4: {},
                key5: {}
            },
            namespaceChildA: {
                a: 'data-1 override 9c7f8bb8-a776-11e4-a60b-080027d17300',
                b: 'data-1 override a26f2f6a-a776-11e4-a846-080027d17300',
                d: 'data-1 override b0a933c8-a776-11e4-9bf9-080027d17300',
                e: 'data-1 override fdfc3f08-a776-11e4-ae9c-080027d17300',
                namespaceExtensionPointB: {
                    key0: {}, key1: {}, key2: {}, key3: {}, key4: {}
                },
                namespaceChildB: {
                    a: 'data-2',
                    b: 'data-2 override fdbb72b4-a778-11e4-8af2-080027d17300',
                    d: 'data-2',
                    e: 'data-2',
                    namespaceChildC: {
                        a: 'data-3',
                        b: 'data-3',
                        d: 'data-3 override 08c6c492-a779-11e4-a168-080027d17300',
                        e: 'data-3',
                        namespaceChildD: {
                            a: 'data-4',
                            b: 'data-4 override 1413be0e-a779-11e4-962e-080027d17300',
                            d: 'data-4',
                            e: 'data-4',
                            namespaceChildE: {
                                a: 'data-5',
                                b: 'data-5',
                                d: 'data-5',
                                e: 'data-5 override 1f051e70-a779-11e4-93f2-080027d17300'
                            },
                            namespaceExtensionPointE: {
                                key0: {}, key1: {}, key2: {}, key3: {}, key4: {}
                            }
                        },
                    }
                }
            }
        },
        semanticBindingsReference: dataModel.getSemanticBindings()
    },
    expectCallToThrow: false,
    resultExpectations: {
        resolvedNamedObjectCount: 1,
        pendingSubcomponentCount: 16,
        dataChangeEventJournalCount: 46,
        JSON: {
            namespace: '{"a":"data-0 override fdc09080-a775-11e4-9b26-080027d17300","b":"data-0 override 0d2423b6-a776-11e4-8481-080027d17300","c":"default c","d":"data-0 override 1fe36a16-a776-11e4-bc20-080027d17300","e":"data-0 override 28ce4808-a776-11e4-82fd-080027d17300","f":"default f","extra":"+1 change event","namespaceExtensionPointA":{},"namespaceChildA":{"a":"data-1 override 9c7f8bb8-a776-11e4-a60b-080027d17300","b":"data-1 override a26f2f6a-a776-11e4-a846-080027d17300","c":"default c","d":"data-1 override b0a933c8-a776-11e4-9bf9-080027d17300","e":"data-1 override fdfc3f08-a776-11e4-ae9c-080027d17300","f":"default f","namespaceExtensionPointB":{},"namespaceChildB":{"a":"data-2","b":"data-2 override fdbb72b4-a778-11e4-8af2-080027d17300","c":"default c","d":"data-2","e":"data-2","f":"default f","namespaceChildC":{"a":"data-3","b":"data-3","c":"default c","d":"data-3 override 08c6c492-a779-11e4-a168-080027d17300","e":"data-3","f":"default f","namespaceChildD":{"a":"data-4","b":"data-4 override 1413be0e-a779-11e4-962e-080027d17300","c":"default c","d":"data-4","e":"data-4","f":"default f","namespaceExtensionPointE":{},"namespaceChildE":{"a":"data-5","b":"data-5","c":"default c","d":"data-5","e":"data-5 override 1f051e70-a779-11e4-93f2-080027d17300","f":"default f"}}}}}}',
            parent: '{"namespaceRoot":{"a":"data-0 override fdc09080-a775-11e4-9b26-080027d17300","b":"data-0 override 0d2423b6-a776-11e4-8481-080027d17300","c":"default c","d":"data-0 override 1fe36a16-a776-11e4-bc20-080027d17300","e":"data-0 override 28ce4808-a776-11e4-82fd-080027d17300","f":"default f","extra":"+1 change event","namespaceExtensionPointA":{},"namespaceChildA":{"a":"data-1 override 9c7f8bb8-a776-11e4-a60b-080027d17300","b":"data-1 override a26f2f6a-a776-11e4-a846-080027d17300","c":"default c","d":"data-1 override b0a933c8-a776-11e4-9bf9-080027d17300","e":"data-1 override fdfc3f08-a776-11e4-ae9c-080027d17300","f":"default f","namespaceExtensionPointB":{},"namespaceChildB":{"a":"data-2","b":"data-2 override fdbb72b4-a778-11e4-8af2-080027d17300","c":"default c","d":"data-2","e":"data-2","f":"default f","namespaceChildC":{"a":"data-3","b":"data-3","c":"default c","d":"data-3 override 08c6c492-a779-11e4-a168-080027d17300","e":"data-3","f":"default f","namespaceChildD":{"a":"data-4","b":"data-4 override 1413be0e-a779-11e4-962e-080027d17300","c":"default c","d":"data-4","e":"data-4","f":"default f","namespaceExtensionPointE":{},"namespaceChildE":{"a":"data-5","b":"data-5","c":"default c","d":"data-5","e":"data-5 override 1f051e70-a779-11e4-93f2-080027d17300","f":"default f"}}}}}}}',
            journal: '[{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"root","namespaceModelPath":"namespaceRoot","namespaceModelId":0,"key":"namespaceRoot"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"a","model":true,"value":"\\"data-0 override fdc09080-a775-11e4-9b26-080027d17300\\"","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"b","model":true,"value":"\\"data-0 override 0d2423b6-a776-11e4-8481-080027d17300\\"","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"c","model":true,"value":"\\"default c\\"","source":"model"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"d","model":true,"value":"\\"data-0 override 1fe36a16-a776-11e4-bc20-080027d17300\\"","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"e","model":true,"value":"\\"data-0 override 28ce4808-a776-11e4-82fd-080027d17300\\"","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"f","model":true,"value":"\\"default f\\"","source":"model"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"extra","model":false,"value":"\\"+1 change event\\"","source":"data"}},{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"child","namespaceModelPath":"namespaceRoot.namespaceChildA","namespaceModelId":1,"key":"namespaceChildA"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"a","model":true,"value":"\\"data-1 override 9c7f8bb8-a776-11e4-a60b-080027d17300\\"","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"b","model":true,"value":"\\"data-1 override a26f2f6a-a776-11e4-a846-080027d17300\\"","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"c","model":true,"value":"\\"default c\\"","source":"model"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"d","model":true,"value":"\\"data-1 override b0a933c8-a776-11e4-9bf9-080027d17300\\"","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"e","model":true,"value":"\\"data-1 override fdfc3f08-a776-11e4-ae9c-080027d17300\\"","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"f","model":true,"value":"\\"default f\\"","source":"model"}},{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"child","namespaceModelPath":"namespaceRoot.namespaceChildA.namespaceChildB","namespaceModelId":2,"key":"namespaceChildB"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"a","model":true,"value":"\\"data-2\\"","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"b","model":true,"value":"\\"data-2 override fdbb72b4-a778-11e4-8af2-080027d17300\\"","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"c","model":true,"value":"\\"default c\\"","source":"model"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"d","model":true,"value":"\\"data-2\\"","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"e","model":true,"value":"\\"data-2\\"","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"f","model":true,"value":"\\"default f\\"","source":"model"}},{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"child","namespaceModelPath":"namespaceRoot.namespaceChildA.namespaceChildB.namespaceChildC","namespaceModelId":3,"key":"namespaceChildC"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"a","model":true,"value":"\\"data-3\\"","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"b","model":true,"value":"\\"data-3\\"","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"c","model":true,"value":"\\"default c\\"","source":"model"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"d","model":true,"value":"\\"data-3 override 08c6c492-a779-11e4-a168-080027d17300\\"","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"e","model":true,"value":"\\"data-3\\"","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"f","model":true,"value":"\\"default f\\"","source":"model"}},{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"child","namespaceModelPath":"namespaceRoot.namespaceChildA.namespaceChildB.namespaceChildC.namespaceChildD","namespaceModelId":4,"key":"namespaceChildD"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"a","model":true,"value":"\\"data-4\\"","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"b","model":true,"value":"\\"data-4 override 1413be0e-a779-11e4-962e-080027d17300\\"","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"c","model":true,"value":"\\"default c\\"","source":"model"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"d","model":true,"value":"\\"data-4\\"","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"e","model":true,"value":"\\"data-4\\"","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"f","model":true,"value":"\\"default f\\"","source":"model"}},{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"child","namespaceModelPath":"namespaceRoot.namespaceChildA.namespaceChildB.namespaceChildC.namespaceChildD.namespaceChildE","namespaceModelId":5,"key":"namespaceChildE"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"a","model":true,"value":"\\"data-5\\"","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"b","model":true,"value":"\\"data-5\\"","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"c","model":true,"value":"\\"default c\\"","source":"model"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"d","model":true,"value":"\\"data-5\\"","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"e","model":true,"value":"\\"data-5 override 1f051e70-a779-11e4-93f2-080027d17300\\"","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"f","model":true,"value":"\\"default f\\"","source":"model"}},{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"extensionPoint","namespaceModelPath":"namespaceRoot.namespaceChildA.namespaceChildB.namespaceChildC.namespaceChildD.namespaceExtensionPointE","namespaceModelId":6,"key":"namespaceExtensionPointE"}},{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"extensionPoint","namespaceModelPath":"namespaceRoot.namespaceChildA.namespaceExtensionPointB","namespaceModelId":8,"key":"namespaceExtensionPointB"}},{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"extensionPoint","namespaceModelPath":"namespaceRoot.namespaceExtensionPointA","namespaceModelId":11,"key":"namespaceExtensionPointA"}}]'
        }
    }
});

