// semantic-bindings-test-data-model.js
//
// Test onm data model declaration to support testing of onm.Model's
// built-in semantic binding functions.
//

var uuid = require('node-uuid');

// This onm data model is used as a template to generate a number of test permutations.
// See module ./fixture/semantic-binding-variants.js.
//

module.exports = {

    uuid: "f704213fcea52c033d36831354d58c70",
    uuidVersion: "0ca21119213ceb664aec67de54d58c82",

    // see semantic-bindings-variants.js module
    semanticBindings: {
        componentKeyGenerator: "internalLuid"
    },

    namespaceType: "root",
    jsonTag: "semanticBindingTest",

    namespaceProperties: {
        userImmutable: {
            key: { fnCreate: function() { return uuid.v4(); } }
        },
        userMutable: {
            prop1: { defaultValue: "defaultValue" }
        }
    },

    subNamespaces: [
        {
            namespaceType: "child",
            jsonTag: "childA",
        },
        {
            namespaceType: "extensionPoint",
            jsonTag: "collectionA",
            componentArchetype: {
                namespaceType: "component",
                jsonTag: "componentA",
            }
        }
    ]
};



