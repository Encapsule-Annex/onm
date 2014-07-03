// test-data-store.js
//
// shared test fixture routines leveraged by onm mocha tests
//

var onm = require('../../onm.js');

var modelDeclaration = module.exports.modelDeclaration = {
    semanticBindings: {
        componentKeyGenerator: "internalUuid",
        namespaceVersioning: "disabled"
    },
    jsonTag: "addressBook",
    subNamespaces: [
        {
            namespaceType: "child",
            jsonTag: "properties",
            namespaceProperties: {
                userMutable: {
                    name: {
                        defaultValue: ""
                    },
                    description: {
                        defaultValue: ""
                    }
                },
                subNamespaces: [
                    {
                        namespaceType: "child",
                        jsonTag: "subproperties",
                        subNamespaces: [
                            {
                                namespaceType: "extenstionPoint",
                                jsonTag: "collection",
                                componentArchetype: {
                                    namespaceType: "component",
                                    jsonTag: "someObject"
                                }
                            }
                        ]
                    }
                ]
            }
        }, // properties
        {
            namespaceType: "extensionPoint",
            jsonTag: "contacts",
            componentArchetype: {
                namespaceType: "component",
                jsonTag: "contact",
                namespaceProperties: {
                    userMutable: {
                        firstName: {
                            defaultValue: ""
                        },
                        lastName: {
                            defaultValue: ""
                        }
                    }
                }
            } // contact
        } // contacts
    ]
};

var createModel = module.exports.createModel = function() {
    return new onm.Model(modelDeclaration);
};

var createStore = module.exports.createStore = function() {
    return new onm.Store(createModel());
};




