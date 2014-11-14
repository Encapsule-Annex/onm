// semantic-binding-variants.js
//
// Each semantic binding variant is grafted into the 'SemanticBindingTest'
// data model declaration object to create a test vector of onm data model
// declaration objects.
//

var onm = require('../../onm');

var testDataVector = [

    {
        testName: "Null component key generator.",
        semanticBindings: {
        }
    },

    {
        testName: "With 'keyPropertyName' declaration set to some random value.",
        semanticBindings: {
        }
    },

    {
        testName: "Internal LUID component key generator. 'keyPropertyName' === undefined.",
        semanticBindings: {
        }
    },

    {
        testName: "Internal LUID component key generator. 'keyPropertyName' === 'key'.",
        semanticBindings: {
        }
    },

    {
        testName: "Internal LUID component key generator. 'keyPropertyName' === 'error'.",
        semanticBindings: {
        }
    },

    {
        testName: "Internal UUID component key generator. 'keyPropertyName' === undefined.",
        semanticBindings: {
        }
    },

    {
        testName: "Internal UUID component key generator. 'keyPropertyName' === 'key'.",
        semanticBindings: {
        }
    },

    {
        testName: "Internal UUID component key generator. 'keyPropertyName' === 'error'.",
        semanticBindings: {
        }
    },

    // External key generator coverage.

    {
        testName: "External key generator. 'keyPropertyName' === undefined.",
        semanticBindings: {
        }
    },

    {
        testName: "External key generator. 'keyPropertyName' set, missing 'setUniqueKey'.",
        semanticBindings: {
        }
    },

    {
        testName: "External key generator. 'keyPropertyName' set, missing 'getUniqueKey'.",
        semanticBindings: {
        }
    },

    {
        testName: "External key generator. 'keyPropertyName' set, missing 'getUniqueKey'.",
        semanticBindings: {
        }
    },

    {
        testName: "External key generator. 'keyPropertyName' set, missing 'getUniqueKey'.",
        semanticBindings: {
        }
    },

    {
        testName: "External key generator. 'keyPropertyName' set, missing 'getUniqueKey'.",
        semanticBindings: {
        }
    }
];

var dataModelDeclarationTemplate = require('./semantic-bindings-test-data-model');

var withDataInputVector = {};

testDataVector.forEach( function (testDescriptor_) {

    var dataModelDeclaration = onm.util.clone(dataModelDeclarationTemplate);
    dataModelDeclaration.semanticBindings = testDescriptor_.semanticBindings;
    withDataInputVector[testDescriptor_.testName] = [ dataModelDeclaration ];
});

module.exports = withDataInputVector;

console.log(JSON.stringify(withDataInputVector));






