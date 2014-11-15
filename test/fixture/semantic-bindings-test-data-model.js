// sem-bind-test-data-model-decl.js
//
// Test onm data model declaration to support testing of onm.Model's
// built-in semantic binding functions.
//

var uuid = require('node-uuid');

module.exports = {

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

                namespaceProperties: {
                    userImmutable: {
                        key: {}
                    }
                }
            }
        }
    ]
};



