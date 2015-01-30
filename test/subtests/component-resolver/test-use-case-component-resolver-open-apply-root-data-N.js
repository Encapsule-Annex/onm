// test-use-case-component-resolver-open-apply-root-data-N.js

var onm = require('../../../index');
var testComponentResolverUseCase = require('./test-core-component-resolver');
var dataModelDeclaration = require('../../fixture/named-object-resolve-test-data-model');
var dataModel = new onm.Model(dataModelDeclaration).implementation.resetKeyGenerator();
var rootToken = dataModel.createRootAddress().implementation.getLastToken();

var testComponentResolverUseCase = require('./test-core-component-resolver');

testComponentResolverUseCase({
    strategyName: "open",
    operationName: "apply data-2",
    targetNamespace: "root",
    inputOptions: {
        strategy: 'open',
        addressToken: rootToken,
        parentDataReference: {
            namespaceRoot: { 
                cairn: true,
                namespaceChildA: {
                    namespaceExtensionPointB: {},
                    namespaceChildB: {
                        namespaceChildC: {
                            namespaceChildD: {
                                namespaceChildE: {
                                },
                                namespaceExtensionPointE: {
                                }
                            }
                        }
                    }
                },
                namespaceExtensionPointA: {
                }
            }
        },
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
        dataChangeEventJournalCount: 24,
        JSON: {
            namespace: '{"cairn":true,"namespaceChildA":{"namespaceExtensionPointB":{},"namespaceChildB":{"namespaceChildC":{"namespaceChildD":{"namespaceChildE":{"a":"data-5","b":"data-5","d":"data-5","e":"data-5 override 1f051e70-a779-11e4-93f2-080027d17300"},"namespaceExtensionPointE":{},"a":"data-4","b":"data-4 override 1413be0e-a779-11e4-962e-080027d17300","d":"data-4","e":"data-4"},"a":"data-3","b":"data-3","d":"data-3 override 08c6c492-a779-11e4-a168-080027d17300","e":"data-3"},"a":"data-2","b":"data-2 override fdbb72b4-a778-11e4-8af2-080027d17300","d":"data-2","e":"data-2"},"a":"data-1 override 9c7f8bb8-a776-11e4-a60b-080027d17300","b":"data-1 override a26f2f6a-a776-11e4-a846-080027d17300","d":"data-1 override b0a933c8-a776-11e4-9bf9-080027d17300","e":"data-1 override fdfc3f08-a776-11e4-ae9c-080027d17300"},"namespaceExtensionPointA":{},"a":"data-0 override fdc09080-a775-11e4-9b26-080027d17300","b":"data-0 override 0d2423b6-a776-11e4-8481-080027d17300","d":"data-0 override 1fe36a16-a776-11e4-bc20-080027d17300","e":"data-0 override 28ce4808-a776-11e4-82fd-080027d17300"}',
            parent: '{"namespaceRoot":{"cairn":true,"namespaceChildA":{"namespaceExtensionPointB":{},"namespaceChildB":{"namespaceChildC":{"namespaceChildD":{"namespaceChildE":{"a":"data-5","b":"data-5","d":"data-5","e":"data-5 override 1f051e70-a779-11e4-93f2-080027d17300"},"namespaceExtensionPointE":{},"a":"data-4","b":"data-4 override 1413be0e-a779-11e4-962e-080027d17300","d":"data-4","e":"data-4"},"a":"data-3","b":"data-3","d":"data-3 override 08c6c492-a779-11e4-a168-080027d17300","e":"data-3"},"a":"data-2","b":"data-2 override fdbb72b4-a778-11e4-8af2-080027d17300","d":"data-2","e":"data-2"},"a":"data-1 override 9c7f8bb8-a776-11e4-a60b-080027d17300","b":"data-1 override a26f2f6a-a776-11e4-a846-080027d17300","d":"data-1 override b0a933c8-a776-11e4-9bf9-080027d17300","e":"data-1 override fdfc3f08-a776-11e4-ae9c-080027d17300"},"namespaceExtensionPointA":{},"a":"data-0 override fdc09080-a775-11e4-9b26-080027d17300","b":"data-0 override 0d2423b6-a776-11e4-8481-080027d17300","d":"data-0 override 1fe36a16-a776-11e4-bc20-080027d17300","e":"data-0 override 28ce4808-a776-11e4-82fd-080027d17300"}}',
            journal: '[{"layer":"namedObject","event":"propertyUpdated","eventData":{"name":"a","model":true,"value":"\\"data-0 override fdc09080-a775-11e4-9b26-080027d17300\\"","source":"data"}},{"layer":"namedObject","event":"propertyUpdated","eventData":{"name":"b","model":true,"value":"\\"data-0 override 0d2423b6-a776-11e4-8481-080027d17300\\"","source":"data"}},{"layer":"namedObject","event":"propertyUpdated","eventData":{"name":"d","model":true,"value":"\\"data-0 override 1fe36a16-a776-11e4-bc20-080027d17300\\"","source":"data"}},{"layer":"namedObject","event":"propertyUpdated","eventData":{"name":"e","model":true,"value":"\\"data-0 override 28ce4808-a776-11e4-82fd-080027d17300\\"","source":"data"}},{"layer":"namedObject","event":"propertyUpdated","eventData":{"name":"a","model":true,"value":"\\"data-1 override 9c7f8bb8-a776-11e4-a60b-080027d17300\\"","source":"data"}},{"layer":"namedObject","event":"propertyUpdated","eventData":{"name":"b","model":true,"value":"\\"data-1 override a26f2f6a-a776-11e4-a846-080027d17300\\"","source":"data"}},{"layer":"namedObject","event":"propertyUpdated","eventData":{"name":"d","model":true,"value":"\\"data-1 override b0a933c8-a776-11e4-9bf9-080027d17300\\"","source":"data"}},{"layer":"namedObject","event":"propertyUpdated","eventData":{"name":"e","model":true,"value":"\\"data-1 override fdfc3f08-a776-11e4-ae9c-080027d17300\\"","source":"data"}},{"layer":"namedObject","event":"propertyUpdated","eventData":{"name":"a","model":true,"value":"\\"data-2\\"","source":"data"}},{"layer":"namedObject","event":"propertyUpdated","eventData":{"name":"b","model":true,"value":"\\"data-2 override fdbb72b4-a778-11e4-8af2-080027d17300\\"","source":"data"}},{"layer":"namedObject","event":"propertyUpdated","eventData":{"name":"d","model":true,"value":"\\"data-2\\"","source":"data"}},{"layer":"namedObject","event":"propertyUpdated","eventData":{"name":"e","model":true,"value":"\\"data-2\\"","source":"data"}},{"layer":"namedObject","event":"propertyUpdated","eventData":{"name":"a","model":true,"value":"\\"data-3\\"","source":"data"}},{"layer":"namedObject","event":"propertyUpdated","eventData":{"name":"b","model":true,"value":"\\"data-3\\"","source":"data"}},{"layer":"namedObject","event":"propertyUpdated","eventData":{"name":"d","model":true,"value":"\\"data-3 override 08c6c492-a779-11e4-a168-080027d17300\\"","source":"data"}},{"layer":"namedObject","event":"propertyUpdated","eventData":{"name":"e","model":true,"value":"\\"data-3\\"","source":"data"}},{"layer":"namedObject","event":"propertyUpdated","eventData":{"name":"a","model":true,"value":"\\"data-4\\"","source":"data"}},{"layer":"namedObject","event":"propertyUpdated","eventData":{"name":"b","model":true,"value":"\\"data-4 override 1413be0e-a779-11e4-962e-080027d17300\\"","source":"data"}},{"layer":"namedObject","event":"propertyUpdated","eventData":{"name":"d","model":true,"value":"\\"data-4\\"","source":"data"}},{"layer":"namedObject","event":"propertyUpdated","eventData":{"name":"e","model":true,"value":"\\"data-4\\"","source":"data"}},{"layer":"namedObject","event":"propertyUpdated","eventData":{"name":"a","model":true,"value":"\\"data-5\\"","source":"data"}},{"layer":"namedObject","event":"propertyUpdated","eventData":{"name":"b","model":true,"value":"\\"data-5\\"","source":"data"}},{"layer":"namedObject","event":"propertyUpdated","eventData":{"name":"d","model":true,"value":"\\"data-5\\"","source":"data"}},{"layer":"namedObject","event":"propertyUpdated","eventData":{"name":"e","model":true,"value":"\\"data-5 override 1f051e70-a779-11e4-93f2-080027d17300\\"","source":"data"}}]'
        }
    }
});

