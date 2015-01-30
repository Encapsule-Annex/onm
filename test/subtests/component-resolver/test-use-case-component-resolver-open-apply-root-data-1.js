// test-use-case-component-resolver-open-apply-root-data-1.js

var onm = require('../../../index');
var testComponentResolverUseCase = require('./test-core-component-resolver');
var dataModelDeclaration = require('../../fixture/named-object-resolve-test-data-model');
var dataModel = new onm.Model(dataModelDeclaration).implementation.resetKeyGenerator();
var rootToken = dataModel.createRootAddress().implementation.getLastToken();

var testComponentResolverUseCase = require('./test-core-component-resolver');

testComponentResolverUseCase({
    strategyName: "open",
    operationName: "apply data-1",
    targetNamespace: "root",
    inputOptions: {
        strategy: 'open',
        addressToken: rootToken,
        parentDataReference: { namespaceRoot: { cairn: true, namespaceChildA: { } } },
        propertyAssignmentObject: {
            a: "level 0 modeled property value override",
            _a: "level 0unmodeled property value override",
            namespaceChildA: {
                a: "level 1 modeled property value override",
                _a: "level 1 unmodeled property override"
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
            namespace: '{"cairn":true,"namespaceChildA":{"a":"level 1 modeled property value override","_a":"level 1 unmodeled property override"},"a":"level 0 modeled property value override","_a":"level 0unmodeled property value override"}',
            parent: '{"namespaceRoot":{"cairn":true,"namespaceChildA":{"a":"level 1 modeled property value override","_a":"level 1 unmodeled property override"},"a":"level 0 modeled property value override","_a":"level 0unmodeled property value override"}}',
            journal: '[{"layer":"namedObject","event":"propertyUpdated","eventData":{"name":"a","model":true,"value":"\\"level 0 modeled property value override\\"","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"_a","model":false,"value":"\\"level 0unmodeled property value override\\"","source":"data"}},{"layer":"namedObject","event":"propertyUpdated","eventData":{"name":"a","model":true,"value":"\\"level 1 modeled property value override\\"","source":"data"}},{"layer":"namedObject","event":"propertyInitialized","eventData":{"name":"_a","model":false,"value":"\\"level 1 unmodeled property override\\"","source":"data"}}]'
        }
    }
});

testComponentResolverUseCase({
    strategyName: "open",
    operationName: "apply data-1",
    targetNamespace: "root (data-1 target child missing)",
    inputOptions: {
        strategy: 'open',
        addressToken: rootToken,
        parentDataReference: { namespaceRoot: { cairn: true } },
        propertyAssignmentObject: {
            a: "level 0 modeled property value override",
            _a: "level 0unmodeled property value override",
            namespaceChildA: {
                a: "level 1 modeled property value override",
                _a: "level 1 unmodeled property override"
            }
        },
        semanticBindingsReference: dataModel.getSemanticBindings()
    },
    expectCallToThrow: true
});

