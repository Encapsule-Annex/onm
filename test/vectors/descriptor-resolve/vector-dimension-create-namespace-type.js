// vector-dimension-create-namespace-type.js
//

var onm = require('../../../index');
var testDataModelDeclaration = require('../../fixture/descriptor-resolve-test-data-model');
var testDataModel = new onm.Model(testDataModelDeclaration);

var rootAddress = testDataModel.createRootAddress();

module.exports = {
    testDimension: 'declared namespace type',
    testValues: [
        {
            label: 'root descriptor',
            data: rootAddress.implementation.getDescriptor(),
            validConfig: true
        },
        {
            label: 'child descriptor',
            data: rootAddress.implementation.getModelDescriptorFromSubpath('namespaceChildA'),
            validConfig: true
        },
        {
            label: 'component descriptor',
            data: rootAddress.implementation.getModelDescriptorFromSubpath('namespaceExtensionPointA'),
            validConfig: true
        },
        {
            label: 'extension point descriptor',
            data: rootAddress.implementation.getModelDescriptorFromSubpath('namespaceExtensionPointA.namespaceComponentA'),
            validConfig: true
        }
    ]
};


