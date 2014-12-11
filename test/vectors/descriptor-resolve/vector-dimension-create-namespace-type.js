// vector-dimension-create-namespace-type.js
//

var testDataModule = require('../../fixture/address-book-data-model');
var testDataModel = testDataModule.createModel();

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
            data: rootAddress.implementation.getModelDescriptorFromSubpath('properties'),
            validConfig: true
        },
        {
            label: 'component descriptor',
            data: rootAddress.implementation.getModelDescriptorFromSubpath('contacts'),
            validConfig: true
        },
        {
            label: 'extension point descriptor',
            data: rootAddress.implementation.getModelDescriptorFromSubpath('contacts.contact'),
            validConfig: true
        }
    ]
};


