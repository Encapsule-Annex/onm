// test-use-case-component-resolver-open-apply-root-data-0.js

var onm = require('../../../index');
var testComponentResolverUseCase = require('./test-core-component-resolver');
var dataModelDeclaration = require('../../fixture/named-object-resolve-test-data-model');
var dataModel = new onm.Model(dataModelDeclaration).implementation.resetKeyGenerator();
var rootToken = dataModel.createRootAddress().implementation.getLastToken();

var testComponentResolverUseCase = require('./test-core-component-resolver');

testComponentResolverUseCase({
    strategyName: "open",
    operationName: "apply data-0",
    targetNamespace: "root",
    inputOptions: {
        strategy: 'open',
        addressToken: rootToken,
        parentDataReference: { namespaceRoot: { cairn: true } },
        propertyAssignmentObject: {
            a: "override default value from model",
            _a: "set value of unmodeled property"
        },
        semanticBindingsReference: dataModel.getSemanticBindings()
    },
    expectCallToThrow: false,
    resultExpectations: {
        resolvedNamedObjectCount: 1,
        pendingSubcomponentCount: 0,
        dataChangeEventJournalCount: 2,
        JSON: {
            namespace: '{"cairn":true,"a":"override default value from model","_a":"set value of unmodeled property"}',
            parent: '{"namespaceRoot":{"cairn":true,"a":"override default value from model","_a":"set value of unmodeled property"}}',
            journal: '[{"layer":"namedObject","event":"propertyUpdated","eventData":{"name":"a","model":true,"value":"\\"override default value from model\\"","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"_a","model":false,"value":"\\"set value of unmodeled property\\"","source":"data"}}]'
        }
    }
});

testComponentResolverUseCase({
    strategyName: "open",
    operationName: "apply data-0",
    targetNamespace: "root (missing)",
    inputOptions: {
        strategy: 'open',
        addressToken: rootToken,
        parentDataReference: {},
        propertyAssignmentObject: {
            a: "override default value from model",
            _a: "set value of unmodeled property"
        },
        semanticBindingsReference: dataModel.getSemanticBindings()
    },
    expectCallToThrow: true
});
