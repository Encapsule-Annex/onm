// vector-dimension-create-subcomponent-assignment.js
//

var onm = require('../../../index');
var testDataModelDeclaration = require('../../fixture/descriptor-resolve-test-data-model');
var testDataModel = new onm.Model(testDataModelDeclaration);
var rootAddress = testDataModel.createRootAddress();
var extensionPointDescriptor = rootAddress.implementation.getModelDescriptorFromSubpath('namespaceExtensionPointA');
var childlessComponentDescriptor = rootAddress.implementation.getModelDescriptorFromSubpath('namespaceExtensionPointA.namespaceComponentA');

var testDimensionDescriptor = {

    testDimension: 'subcomponent creation via property assignment object',
    testValues: [
        {
            label: 'test 1',
            namespaceDescriptor: extensionPointDescriptor,
            propertyAssignmentObject: {}
        },
        {
            label: 'test 2',
            namespaceDescriptor: extensionPointDescriptor,
            propertyAssignmentObject: {
                x: undefined
            }
        },
        {
            label: 'test 3',
            namespaceDescriptor: extensionPointDescriptor,
            propertyAssignmentObject: {
                x: null
            }
        },
        {
            label: 'test 5',
            namespaceDescriptor: extensionPointDescriptor,
            propertyAssignmentObject: {
                x: []
            }
        },
        {
            label: 'test 4',
            namespaceDescriptor: extensionPointDescriptor,
            propertyAssignmentObject: {
                x: {}
            }
        },
        {
            label: 'test 7',
            namespaceDescriptor: extensionPointDescriptor,
            propertyAssignmentObject: {
                x: {
                    a: 'orange',
                    b: 'blue',
                    c: 'green',
                    d: 'turquoise',
                    _a: {
                        _a: 'test value'
                    }
                }
            }
        }
    ]
};

var generateTestVectors = module.exports = function() {

    var testVectors = {};

    testDimensionDescriptor.testValues.forEach(function(dimensionValue_) {
        var testName = testDimensionDescriptor.testDimension + " " + dimensionValue_.label;
        testVectors[testName] = [ { options: {
            parentDataReference: {},
            targetNamespaceDescriptor: dimensionValue_.namespaceDescriptor,
            targetNamespaceKey: "",
            propertyAssignmentObject: dimensionValue_.propertyAssignmentObject,
            semanticBindingsReference: testDataModel.getSemanticBindings()
        }}];
    });

    return testVectors;

};




