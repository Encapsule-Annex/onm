// test-use-case-component-resolver-open-noop-subnamespace-1.js

var testComponentResolverUseCase = require('./test-core-component-resolver');

var testDataFixture = require('../../fixture/address-book-data-model');

var dataModel = testDataFixture.createModel();
var rootAddress = dataModel.createRootAddress();
var childAddress = rootAddress.createSubpathAddress("properties");
var extensionPointAddress = rootAddress.createSubpathAddress("contacts");

var childToken = childAddress.implementation.getLastToken();
var extensionPointToken = extensionPointAddress.implementation.getLastToken();


testComponentResolverUseCase({
    strategyName: "open",
    operationName: "noop",
    targetNamespace: "subnamespace child",
    inputOptions: {
        strategy: 'open',
        addressToken: childToken,
        parentDataReference: { addressBook: { properties: { cairn: true } } },
        propertyOptionsObject: {},
        semanticBindingsReference: dataModel.getSemanticBindings()
    },
    expectCallToThrow: false,
    resultExpectations: {
        resolvedNamedObjectCount: 2,
        pendingSubcomponentCount: 0,
        dataChangeEventJournalCount: 0,
        JSON: {
            namespace: '{"cairn":true}',
            parent: '{"addressBook":{"properties":{"cairn":true}}}',
            journal: '[]'
        }
    }
});

testComponentResolverUseCase({
    strategyName: "open",
    operationName: "noop",
    targetNamespace: "subnamespace child (missing)",
    inputOptions: {
        strategy: 'open',
        addressToken: childToken,
        parentDataReference: {},
        propertyOptionsObject: {},
        semanticBindingsReference: dataModel.getSemanticBindings()
    },
    expectCallToThrow: true
});

testComponentResolverUseCase({
    strategyName: "open",
    operationName: "noop",
    targetNamespace: "subnamespace extension point",
    inputOptions: {
        strategy: 'open',
        addressToken: extensionPointToken,
        parentDataReference: { addressBook: { contacts: { cairn: true } } },
        propertyOptionsObject: {},
        semanticBindingsReference: dataModel.getSemanticBindings()
    },
    expectCallToThrow: false,
    resultExpectations: {
        resolvedNamedObjectCount: 2,
        pendingSubcomponentCount: 0,
        dataChangeEventJournalCount: 0,
        JSON: {
            namespace: '{"cairn":true}',
            parent: '{"addressBook":{"contacts":{"cairn":true}}}',
            journal: '[]'
        }
    }
});

testComponentResolverUseCase({
    strategyName: "open",
    operationName: "noop",
    targetNamespace: "subnamespace extension point (missing)",
    inputOptions: {
        strategy: 'open',
        addressToken: extensionPointToken,
        parentDataReference: {},
        propertyOptionsObject: {},
        semanticBindingsReference: dataModel.getSemanticBindings()
    },
    expectCallToThrow: true
});

