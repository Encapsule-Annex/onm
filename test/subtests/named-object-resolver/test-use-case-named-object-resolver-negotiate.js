// test-use-case-named-object-resolver-negotiate.js
//

var onm = require('../../../index');
var dataModelDeclaration = require('../../fixture/named-object-resolve-test-data-model');
var dataModel = new onm.Model(dataModelDeclaration).implementation.resetKeyGenerator();
var rootAddress = dataModel.createRootAddress();
var rootDescriptor = rootAddress.implementation.getDescriptor();

var testNamedObjectResolverUseCase = require('./test-core-named-object-resolver');



testNamedObjectResolverUseCase({
    inputOptions: {
        strategy: 'negotiate',
        parentDataReference: {},
        targetNamespaceDescriptor: rootDescriptor,
        semanticBindingsReference: dataModel.getSemanticBindings(),
        propertyAssignmentObject: {}
    },
    expectCallToThrow: false,
    resultExpectations: {
        strategyFollowed: 'create',
        namespaceEffectiveKey: 'namespaceRoot',
        pendingSubobjectCount: 0,
        JSON: {
            namespace: '',
            events: '',
        }
    }
});

