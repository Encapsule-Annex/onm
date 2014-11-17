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
        validConfig: false,
        semanticBindings: {
        }
    },

    {
        testName: "With 'keyPropertyName' declaration set to some random value.",
        validConfig: false,
        semanticBindings: {
            keyPropertyName: 'error'
        }
    },

    {
        testName: "Internal LUID component key generator. 'keyPropertyName' === undefined.",
        validConfig: true,
        semanticBindings: {
            componentKeyGenerator: 'internalLuid'
        }
    },

    {
        testName: "Internal LUID component key generator. 'keyPropertyName' === 'key'.",
        validConfig: true,
        semanticBindings: {
            keyPropertyName: 'key',
            componentKeyGenerator: 'internalLuid'
        }
    },

    {
        testName: "Internal LUID component key generator. 'keyPropertyName' === 'error'.",
        validConfig: true,
        semanticBindings: {
            keyPropertyName: 'error',
            componentKeyGenerator: 'internalLuid'
        }
    },

    {
        testName: "Internal UUID component key generator. 'keyPropertyName' === undefined.",
        validConfig: true,
        semanticBindings: {
            componentKeyGenerator: 'internalUuid'
        }
    },

    {
        testName: "Internal UUID component key generator. 'keyPropertyName' === 'key'.",
        validConfig: true,
        semanticBindings: {
            keyPropertyName: 'key',
            componentKeyGenerator: 'internalUuid'
        }
    },

    {
        testName: "Internal UUID component key generator. 'keyPropertyName' === 'error'.",
        validConfig: true,
        semanticBindings: {
            keyPropertyName: 'error',
            componentKeyGenerator: 'internalUuid'
        }
    },

    // External key generator coverage.

    /*

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


    */

]; // 'semanticBindings' object variants array

// We have data model module in the fixture's directory that's used by the semantic
// bindings tests that's used here as a template: each of the 'semanticBindings'
// object variants above is splice into this base data model declaration to produce
// a vector of data model declarations.
var dataModelDeclarationTemplate = require('./semantic-bindings-test-data-model');

// This is what we're exporting.
var withDataInputVector = {};

// Build a vector of onm data model declarations.
testDataVector.forEach( function (testDescriptor_) {
    var testPayload = onm.util.clone(testDescriptor_);
    testPayload.dataModelDeclaration = onm.util.clone(dataModelDeclarationTemplate);
    testPayload.dataModelDeclaration.semanticBindings = testDescriptor_.semanticBindings;
    withDataInputVector[testDescriptor_.testName] = [ testPayload ];
});

// Return a vector of onm data model declarations.
module.exports = withDataInputVector;







