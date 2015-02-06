// test-data-store.js
//
// shared test fixture routines leveraged by onm mocha tests
//

var onm = require('../../index');

(function() {

    var modelDeclaration = module.exports.modelDeclaration = {
        jsonTag: "addressBook",
        semanticBindings: {
            componentKeyGenerator: 'internalLuid'
        },
        namespaceProperties: {
            userImmutable: {
            },
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
                                    jsonTag: "someObject",
                                    namespaceProperties: {
                                        userImmutable: {
                                        }
                                    }
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
                        userImmutable: {
                        },
                        userMutable: {
                            firstName: {
                                defaultValue: ''
                            },
                            lastName: {
                                defaultValue: ''
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
                                namespaceProperties: {
                                    userImmutable: {
                                    },
                                    userImmutable: {
                                        emailAddress: {
                                            defaultValue: ""
                                        }
                                    }
                                }
                            }
                        },
                        {
                            namespaceType: "extensionPoint",
                            jsonTag: "addresses",
                            componentArchetype: {
                                namespaceType: "component",
                                jsonTag: "address",
                                namespaceProperties: {
                                    userImmutable: {
                                    },
                                    userMutable: {
                                        streetAddress: {
                                            defaultValue: ""
                                        }
                                    }
                                },
                                subNamespaces: [
                                    {
                                        namespaceType: "extensionPoint",
                                        jsonTag: "notes",
                                        componentArchetype: {
                                            namespaceType: "component",
                                            jsonTag: "note",
                                            namespaceProperties: {
                                                userImmutable: {
                                                },
                                                userMutable: {
                                                    text: {
                                                        defaultValue: ""
                                                    }
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            namespaceType: "extensionPoint",
                            jsonTag: "phoneNumbers",
                            componentArchetype: {
                                namespaceType: "component",
                                jsonTag: "phoneNumber",
                                namespaceProperties: {
                                    userImmutable: {
                                    },
                                    userMutable: {
                                        areaCode: {
                                            defaultValue: ''
                                        },
                                        number: {
                                            defaultValue: ''
                                        }
                                    }
                                },
                                subNamespaces: [
                                    {
                                        namespaceType: "child",
                                        jsonTag: "notes",
                                        namespaceProperties: {
                                            userMutable: {
                                                text: {
                                                    defaultValue: ''
                                                }
                                            }
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
            var model = new onm.Model(modelDeclaration).implementation.resetKeyGenerator();
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

})();

