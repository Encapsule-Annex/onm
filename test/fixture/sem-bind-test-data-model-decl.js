// sem-bind-test-data-model-decl.js
//
// Test onm data model declaration to support testing of onm.Model's
// built-in semantic binding functions.
//

var uuid = require('node-uuid');

module.exports = {
    namespaceType: "root",
    jsonTag: "semanticBindingTest",
    semanticBindings: {
        // disabled | internalLuid | internalUuid | external (default)
        componentKeyGenerator: "internalUuid",
        // disabled | internalSimple | internalAdvanced | external (default)
        namespaceVersioning: "internalAdvanced"
    },

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
                        fnCreate: function() { return uuid.v4(); }
                    }
                }
            }
        }
    ]
};



