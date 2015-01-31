// test-use-case-component-resolver-bogus-strategy.js

var onm = require('../../../index');
var testComponentResolverUseCase = require('./test-core-component-resolver');
var dataModelDeclaration = require('../../fixture/named-object-resolve-test-data-model');
var dataModel = new onm.Model(dataModelDeclaration).implementation.resetKeyGenerator();
var rootToken = dataModel.createRootAddress().implementation.getLastToken();

var assert = require('chai').assert;
var testComponentResolverUseCase = require('./test-core-component-resolver');

testComponentResolverUseCase({
    strategy: "bogus strategy",
    operation: "apply data-N",
    targetNamespace: "component root",
    inputOptions: {
        strategy: 'bogus',
        addressToken: rootToken,
        parentDataReference: {},
        propertyAssignmentObject: {},
        semanticBindingsReference: dataModel.getSemanticBindings()
    },
    expectCallToThrow: true
});
