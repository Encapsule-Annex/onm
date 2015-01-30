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
        parentDataReference: { namespaceRoot: { cairn: true, namespaceChildA: { } } },
        propertyAssignmentObject: {
            a: "modeled property value override",
            _a: "unmodeled property value override",
            namespaceChildA: {
                a: "modeled property value override",
                _a: "unmodeled property value override"
            }
        },
        semanticBindingsReference: dataModel.getSemanticBindings()
    },
    expectCallToThrow: false,
    resultExpectations: {
        resolvedNamedObjectCount: 1,
        pendingSubcomponentCount: 0,
        dataChangeEventJournalCount: 4,
        JSON: {
            namespace: '{"cairn":true,"namespaceChildA":{"a":"modeled property value override","_a":"unmodeled property value override"},"a":"modeled property value override","_a":"unmodeled property value override"}',
            parent: '{"namespaceRoot":{"cairn":true,"namespaceChildA":{"a":"modeled property value override","_a":"unmodeled property value override"},"a":"modeled property value override","_a":"unmodeled property value override"}}',
            journal: '[{"layer":"namedObject","event":"propertyUpdated","eventData":{"name":"a","model":true,"value":"\\"modeled property value override\\"","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"_a","model":false,"value":"\\"unmodeled property value override\\"","source":"data"}},{"layer":"namedObject","event":"propertyUpdated","eventData":{"name":"a","model":true,"value":"\\"modeled property value override\\"","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"_a","model":false,"value":"\\"unmodeled property value override\\"","source":"data"}}]'
        }
    }
});
