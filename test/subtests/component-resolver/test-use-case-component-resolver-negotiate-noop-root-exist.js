// test-use-case-component-resolver-negotiate-root-exists.js

var onm = require('../../../index');
var testComponentResolverUseCase = require('./test-core-component-resolver');
var dataModelDeclaration = require('../../fixture/named-object-resolve-test-data-model');
var dataModel = new onm.Model(dataModelDeclaration).implementation.resetKeyGenerator();
var rootToken = dataModel.createRootAddress().implementation.getLastToken();

var assert = require('chai').assert;
var testComponentResolverUseCase = require('./test-core-component-resolver');

var testResults = testComponentResolverUseCase({
    strategy: "negotiate (component exists)",
    operation: "noop",
    targetNamespace: "component root",
    inputOptions: {
        strategy: 'negotiate',
        addressToken: rootToken,
        parentDataReference: { namespaceRoot:{ cairn: "marker in the parent data." }},
        propertyAssignmentObject: {},
        semanticBindingsReference: dataModel.getSemanticBindings()
    },
    expectCallToThrow: false,
    resultExpectations: {
        resolvedNamedObjectCount: 1,
        pendingSubcomponentCount: 0,
        dataChangeEventJournalCount: 0,
        JSON: {
            namespace: '{"cairn":"marker in the parent data."}',
            parent: '{"namespaceRoot":{"cairn":"marker in the parent data."}}',
            journal: '[]'
        }
    }
});

describe("Verify that the component resolver correctly negotiates to open strategy when asked to resolve a non-existent data component in the store.", function() {
    it("The single resolved named object resolution result should indicate 'create' as the strategy followed.", function() {
        assert.equal('open', testResults.outputResults.namedObjectResolutionVector[0].output.strategyFollowed);
    });
});






