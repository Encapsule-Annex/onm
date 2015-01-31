// test-use-case-component-resolver-negotiate-apply-root-exist.js

var onm = require('../../../index');
var testComponentResolverUseCase = require('./test-core-component-resolver');
var dataModelDeclaration = require('../../fixture/named-object-resolve-test-data-model');
var dataModel = new onm.Model(dataModelDeclaration).implementation.resetKeyGenerator();
var rootToken = dataModel.createRootAddress().implementation.getLastToken();

var assert = require('chai').assert;
var testComponentResolverUseCase = require('./test-core-component-resolver');

var testResults = testComponentResolverUseCase({
    strategy: "negotiate (w/existent component root but missing branch(es))",
    operation: "apply data over extension point",
    targetNamespace: "component root",
    inputOptions: {
        strategy: 'negotiate',
        addressToken: rootToken,
        parentDataReference: JSON.parse('{"namespaceRoot":{"a":"default a","b":"default b","c":"default c","d":"default d","e":"default e","f":"default f","namespaceExtensionPointA":{},"namespaceChildA":{"a":"default a","b":"default b","c":"default c","d":"default d","e":"default e","f":"default f","namespaceExtensionPointB":{},"namespaceChildB":{"a":"default a","b":"default b","c":"default c","d":"default d","e":"default e","f":"default f","namespaceChildC":{"a":"default a","b":"default b","c":"default c","d":"default d","e":"default e","f":"default f","namespaceChildD":{"a":"default a","b":"default b","c":"default c","d":"default d","e":"default e","f":"default f","namespaceExtensionPointE":{},"namespaceChildE":{"a":"default a","b":"default b","c":"default c","d":"default d","e":"default e","f":"default f"}}}}}}}'),
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
        dataChangeEventJournalCount: 0,
        JSON: {
            namespace: '{"a":"default a","b":"default b","c":"default c","d":"default d","e":"default e","f":"default f","namespaceExtensionPointA":{},"namespaceChildA":{"a":"default a","b":"default b","c":"default c","d":"default d","e":"default e","f":"default f","namespaceExtensionPointB":{},"namespaceChildB":{"a":"default a","b":"default b","c":"default c","d":"default d","e":"default e","f":"default f","namespaceChildC":{"a":"default a","b":"default b","c":"default c","d":"default d","e":"default e","f":"default f","namespaceChildD":{"a":"default a","b":"default b","c":"default c","d":"default d","e":"default e","f":"default f","namespaceExtensionPointE":{},"namespaceChildE":{"a":"default a","b":"default b","c":"default c","d":"default d","e":"default e","f":"default f"}}}}}}',
            parent: '{"namespaceRoot":{"a":"default a","b":"default b","c":"default c","d":"default d","e":"default e","f":"default f","namespaceExtensionPointA":{},"namespaceChildA":{"a":"default a","b":"default b","c":"default c","d":"default d","e":"default e","f":"default f","namespaceExtensionPointB":{},"namespaceChildB":{"a":"default a","b":"default b","c":"default c","d":"default d","e":"default e","f":"default f","namespaceChildC":{"a":"default a","b":"default b","c":"default c","d":"default d","e":"default e","f":"default f","namespaceChildD":{"a":"default a","b":"default b","c":"default c","d":"default d","e":"default e","f":"default f","namespaceExtensionPointE":{},"namespaceChildE":{"a":"default a","b":"default b","c":"default c","d":"default d","e":"default e","f":"default f"}}}}}}}',
            journal: '[]'
        }
    }
});

describe("Perform additional deep validation of call results to verify the strategy followed by the component resolver.", function() {
    it("The single resolved named object resolution result should indicate 'create' as the strategy followed.", function() {
        assert.equal('open', testResults.outputResults.namedObjectResolutionVector[0].output.strategyFollowed, "resolved named object strategy expected to be 'open'");
    });
    it("Component resolve results pending stack should contain a single unresolved component.", function() {
        assert.equal(1, testResults.outputResults.pendingSubcomponentStack.length);
    });
    it("The pending component resolution options strategy is expected to be set to 'negotiate'.", function() {
        assert.equal('negotiate', testResults.outputResults.pendingSubcomponentStack[0].strategy);
    });
});





