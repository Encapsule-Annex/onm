// test-data-store.js
//
// shared test fixture routines leveraged by onm mocha tests
//

var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should;

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
                }
            },
            subNamespaces: [
                {
                    namespaceType: "child",
                    jsonTag: "subproperties",
                    subNamespaces: [
                        {
                            namespaceType: "extensionPoint",
                            jsonTag: "collection",
                            componentArchetype: {
                                namespaceType: "component",
                                jsonTag: "someObject"
                            }
                        }
                    ]
                }
            ]
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
                },
                subNamespaces: [
                    {
                        namespaceType: "extensionPoint",
                        jsonTag: "emails",
                        componentArchetype: {
                            namespaceType: "component",
                            jsonTag: "email",
                        }
                    },
                    {
                        namespaceType: "extensionPoint",
                        jsonTag: "addresses",
                        componentArchetype: {
                            namespaceType: "component",
                            jsonTag: "address",
                            subNamespaces: [
                                {
                                    namespaceType: "extensionPoint",
                                    jsonTag: "notes",
                                    componentArchetype: {
                                        namespaceType: "component",
                                        jsonTag: "note"
                                    }
                                }
                            ]
                        }
                    }
                ]
            } // contact
        } // contacts
    ]
};

var createModel = module.exports.createModel = function() {
    try {
        var model = new onm.Model(modelDeclaration);
        return model;
    } catch (exception_) {
        throw new Error("onm test data fixture failure in 'createModel': " + exception_.message);
    }
};

var createStore = module.exports.createStore = function() {
    try {
        var store = new onm.Store(createModel());
        return store;
    } catch (exception_) {
        throw new Error("onm test data fixture failure in 'createStore': " + exception_.message);
    }
};




