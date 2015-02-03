// vector-dimension-create-subcomponent-assignment.js
//

var onm = require('../../../index');
var testDataModelDeclaration = require('../../fixture/named-object-resolve-test-data-model');
var testDataModel = new onm.Model(testDataModelDeclaration);
var rootAddress = testDataModel.createRootAddress();
var extensionPointDescriptor = rootAddress.implementation.getModelDescriptorFromSubpath('namespaceExtensionPointA');
var childlessComponentDescriptor = rootAddress.implementation.getModelDescriptorFromSubpath('namespaceExtensionPointA.namespaceComponentA');

var testDimensionDescriptor = {

    testDimension: 'subcomponent creation via property assignment object',
    testValues: [
        {
            label: 'Extension point namespace descriptor | empty assignment object',
            namespaceDescriptor: extensionPointDescriptor,
            propertyAssignmentObject: {}
        },
        /*
          THESE ARE ALL CALLER DATA FRAMING ERRORS AS THEY ARE NOT NAMED OBJECTS AS EXPECTED.
        {
            label: 'Extension point namespace descriptor | single property x w/undefined value',
            namespaceDescriptor: extensionPointDescriptor,
            propertyAssignmentObject: {
                x: undefined
            }
        },
        {
            label: 'Extension point namespace descriptor | single property x w/null value',
            namespaceDescriptor: extensionPointDescriptor,
            propertyAssignmentObject: {
                x: null
            }
        },
        {
            label: 'Extension point namespace descriptor | single property x w/empty array value',
            namespaceDescriptor: extensionPointDescriptor,
            propertyAssignmentObject: {
                x: []
            }
        },
        */
        {
            label: 'Extension point namespace descriptor | single property x w/empty object value',
            namespaceDescriptor: extensionPointDescriptor,
            propertyAssignmentObject: {
                x: {}
            }
        },
        {
            label: 'Extension point namespace descriptor | multiple properties on property assignment object',
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
        testVectors[testName] = [ { 
            options: {
                strategy: 'create',
                parentDataReference: {},
                targetNamespaceDescriptor: dimensionValue_.namespaceDescriptor,
                targetNamespaceKey: "",
                propertyAssignmentObject: dimensionValue_.propertyAssignmentObject,
                semanticBindingsReference: testDataModel.getSemanticBindings()
            }
        }];
    });
    return testVectors;
};




