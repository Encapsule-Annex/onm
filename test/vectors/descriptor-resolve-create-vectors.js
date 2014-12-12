// descriptor-resolve-create-vectors.js
//

var onm = require('../../index')
var testDataModelDeclaration = require('../fixture/descriptor-resolve-test-data-model');
var testDataModel = new onm.Model(testDataModelDeclaration);

var dimensionNamespaceType = require('./descriptor-resolve/vector-dimension-create-namespace-type');
var dimensionNamespaceKey = require('./descriptor-resolve/vector-dimension-create-namespace-key');
var dimensionPropertyAssignment = require('./descriptor-resolve/vector-dimension-create-property-assignment');

var generateTestVectors = module.exports = function() {
    var testVectors = {};
    dimensionNamespaceType.testValues.forEach(function(namespaceDescriptor_) {
        dimensionNamespaceKey.testValues.forEach(function(namespaceKey_) {
            dimensionPropertyAssignment.testValues.forEach(function(propertyAssignmentObject_) {
                var testName = namespaceDescriptor_.label + " | " + namespaceKey_.label + " | " + propertyAssignmentObject_.label;
                var propertyAssignmentObject = (namespaceDescriptor_.data.namespaceType !== 'extensionPoint') && onm.util.clone(propertyAssignmentObject_.data) || {};
                var options = {
                    parentDataReference: {},
                    targetNamespaceDescriptor: namespaceDescriptor_.data,
                    targetNamespaceKey: namespaceKey_.data,
                    propertyAssignmentObject: propertyAssignmentObject,
                    semanticBindingsReference: testDataModel.getSemanticBindings()
                };
                // Create the vector
                testVectors[testName] = [{
                    options: options,
                    validConfig: namespaceDescriptor_.validConfig && namespaceKey_.validConfig && propertyAssignmentObject_.validConfig
                }];
            });
        });
    });
    return testVectors;
};

