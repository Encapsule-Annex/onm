// test-use-case-component-resolver-negotiate-apply-root-notexist.js

var onm = require('../../../index');
var testComponentResolverUseCase = require('./test-core-component-resolver');
var dataModelDeclaration = require('../../fixture/named-object-resolve-test-data-model');
var dataModel = new onm.Model(dataModelDeclaration).implementation.resetKeyGenerator();
var rootToken = dataModel.createRootAddress().implementation.getLastToken();

var assert = require('chai').assert;
var testComponentResolverUseCase = require('./test-core-component-resolver');

var testResults = testComponentResolverUseCase({
    strategy: "negotiate (w/non-existent component)",
    operation: "apply data over extension point",
    targetNamespace: "component root",
    inputOptions: {
        strategy: 'negotiate',
        addressToken: rootToken,
        parentDataReference: {},
        propertyAssignmentObject: {
            namespaceChildA: {
                namespaceChildB: {
                    namespaceChildC: {
                        namespaceChildD:{
                            namespaceExtensionPointE: {
                                test: {
                                    cairn: "test"
                                }
                            }
                        }
                    }
                }
            }
        },
        semanticBindingsReference: dataModel.getSemanticBindings()
    },
    expectCallToThrow: false,
    resultExpectations: {
        resolvedNamedObjectCount: 1,
        pendingSubcomponentCount: 1,
        dataChangeEventJournalCount: 45,
        JSON: {
            namespace: '{"a":"default a","b":"default b","c":"default c","d":"default d","e":"default e","f":"default f","namespaceExtensionPointA":{},"namespaceChildA":{"a":"default a","b":"default b","c":"default c","d":"default d","e":"default e","f":"default f","namespaceExtensionPointB":{},"namespaceChildB":{"a":"default a","b":"default b","c":"default c","d":"default d","e":"default e","f":"default f","namespaceChildC":{"a":"default a","b":"default b","c":"default c","d":"default d","e":"default e","f":"default f","namespaceChildD":{"a":"default a","b":"default b","c":"default c","d":"default d","e":"default e","f":"default f","namespaceExtensionPointE":{},"namespaceChildE":{"a":"default a","b":"default b","c":"default c","d":"default d","e":"default e","f":"default f"}}}}}}',
            parent: '{"namespaceRoot":{"a":"default a","b":"default b","c":"default c","d":"default d","e":"default e","f":"default f","namespaceExtensionPointA":{},"namespaceChildA":{"a":"default a","b":"default b","c":"default c","d":"default d","e":"default e","f":"default f","namespaceExtensionPointB":{},"namespaceChildB":{"a":"default a","b":"default b","c":"default c","d":"default d","e":"default e","f":"default f","namespaceChildC":{"a":"default a","b":"default b","c":"default c","d":"default d","e":"default e","f":"default f","namespaceChildD":{"a":"default a","b":"default b","c":"default c","d":"default d","e":"default e","f":"default f","namespaceExtensionPointE":{},"namespaceChildE":{"a":"default a","b":"default b","c":"default c","d":"default d","e":"default e","f":"default f"}}}}}}}',
            journal: '[{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"root","namespaceModelPath":"namespaceRoot","namespaceModelId":0,"key":"namespaceRoot"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"a","model":true,"value":"\\"default a\\"","source":"model"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"b","model":true,"value":"\\"default b\\"","source":"model"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"c","model":true,"value":"\\"default c\\"","source":"model"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"d","model":true,"value":"\\"default d\\"","source":"model"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"e","model":true,"value":"\\"default e\\"","source":"model"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"f","model":true,"value":"\\"default f\\"","source":"model"}},{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"child","namespaceModelPath":"namespaceRoot.namespaceChildA","namespaceModelId":1,"key":"namespaceChildA"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"a","model":true,"value":"\\"default a\\"","source":"model"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"b","model":true,"value":"\\"default b\\"","source":"model"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"c","model":true,"value":"\\"default c\\"","source":"model"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"d","model":true,"value":"\\"default d\\"","source":"model"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"e","model":true,"value":"\\"default e\\"","source":"model"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"f","model":true,"value":"\\"default f\\"","source":"model"}},{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"child","namespaceModelPath":"namespaceRoot.namespaceChildA.namespaceChildB","namespaceModelId":2,"key":"namespaceChildB"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"a","model":true,"value":"\\"default a\\"","source":"model"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"b","model":true,"value":"\\"default b\\"","source":"model"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"c","model":true,"value":"\\"default c\\"","source":"model"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"d","model":true,"value":"\\"default d\\"","source":"model"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"e","model":true,"value":"\\"default e\\"","source":"model"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"f","model":true,"value":"\\"default f\\"","source":"model"}},{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"child","namespaceModelPath":"namespaceRoot.namespaceChildA.namespaceChildB.namespaceChildC","namespaceModelId":3,"key":"namespaceChildC"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"a","model":true,"value":"\\"default a\\"","source":"model"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"b","model":true,"value":"\\"default b\\"","source":"model"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"c","model":true,"value":"\\"default c\\"","source":"model"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"d","model":true,"value":"\\"default d\\"","source":"model"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"e","model":true,"value":"\\"default e\\"","source":"model"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"f","model":true,"value":"\\"default f\\"","source":"model"}},{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"child","namespaceModelPath":"namespaceRoot.namespaceChildA.namespaceChildB.namespaceChildC.namespaceChildD","namespaceModelId":4,"key":"namespaceChildD"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"a","model":true,"value":"\\"default a\\"","source":"model"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"b","model":true,"value":"\\"default b\\"","source":"model"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"c","model":true,"value":"\\"default c\\"","source":"model"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"d","model":true,"value":"\\"default d\\"","source":"model"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"e","model":true,"value":"\\"default e\\"","source":"model"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"f","model":true,"value":"\\"default f\\"","source":"model"}},{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"child","namespaceModelPath":"namespaceRoot.namespaceChildA.namespaceChildB.namespaceChildC.namespaceChildD.namespaceChildE","namespaceModelId":5,"key":"namespaceChildE"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"a","model":true,"value":"\\"default a\\"","source":"model"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"b","model":true,"value":"\\"default b\\"","source":"model"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"c","model":true,"value":"\\"default c\\"","source":"model"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"d","model":true,"value":"\\"default d\\"","source":"model"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"e","model":true,"value":"\\"default e\\"","source":"model"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"f","model":true,"value":"\\"default f\\"","source":"model"}},{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"extensionPoint","namespaceModelPath":"namespaceRoot.namespaceChildA.namespaceChildB.namespaceChildC.namespaceChildD.namespaceExtensionPointE","namespaceModelId":6,"key":"namespaceExtensionPointE"}},{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"extensionPoint","namespaceModelPath":"namespaceRoot.namespaceChildA.namespaceExtensionPointB","namespaceModelId":8,"key":"namespaceExtensionPointB"}},{"layer":"namedObject","event":"namedObjectCreated","eventData":{"namespaceType":"extensionPoint","namespaceModelPath":"namespaceRoot.namespaceExtensionPointA","namespaceModelId":11,"key":"namespaceExtensionPointA"}}]'
        }
    }
});

describe("Perform additional deep validation of call results to verify the strategy followed by the component resolver.", function() {
    it("The single resolved named object resolution result should indicate 'create' as the strategy followed.", function() {
        assert.equal('create', testResults.outputResults.namedObjectResolutionVector[0].output.strategyFollowed, "resolved named object strategy is expected to be 'create'");
    });
    it("Component resolve results pending stack should contain a single unresolved component.", function() {
        assert.equal(1, testResults.outputResults.pendingSubcomponentStack.length);
    });
    it("The pending component resolution options strategy is expected to be set to 'create'.", function() {
        assert.equal('create', testResults.outputResults.pendingSubcomponentStack[0].strategy);
    });
});





