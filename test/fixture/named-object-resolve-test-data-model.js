// descriptor-resolve-test-data-model.js
//
//

var testProperties = {
    userImmutable: {
        a: {
            defaultValue: 'default a'
        },
        b: {
            defaultValue: 'default b'
        },
        c: {
            defaultValue: 'default c'
        }
    },
    userMutable: {
        d: {
            defaultValue: 'default d'
        },
        e: {
            defaultValue: 'default e'
        },
        f: {
            defaultValue: 'default f'
        }
    }
};

var resolverTestDataModel = module.exports = {
    uuid: "52bb76e1197577937629c20b54d58c37",
    uuidVersion: "a0313ef4b0ec449cad5dd13454d58c46",
    semanticBindings: {
        componentKeyGenerator: 'internalLuid'
    },

    jsonTag: 'namespaceRoot',
    namespaceProperties: testProperties,
    subNamespaces: [
        {
            namespaceType: 'child',
            jsonTag: 'namespaceChildA',
            namespaceProperties: testProperties,
            subNamespaces: [
                {
                    namespaceType: 'child',
                    jsonTag: 'namespaceChildB',
                    namespaceProperties: testProperties,
                    subNamespaces: [
                        {
                            namespaceType: "child",
                            jsonTag: "namespaceChildC",
                            namespaceProperties: testProperties,
                            subNamespaces: [
                                {
                                    namespaceType: "child",
                                    jsonTag: "namespaceChildD",
                                    namespaceProperties: testProperties,
                                    subNamespaces: [
                                        {
                                            namespaceType: "child",
                                            jsonTag: "namespaceChildE",
                                            namespaceProperties: testProperties
                                        },
                                        {
                                            namespaceType: "extensionPoint",
                                            jsonTag: "namespaceExtensionPointE",
                                            componentArchetype: {
                                                namespaceType: "component",
                                                jsonTag: "namespaceChildF",
                                                namespaceProperties: testProperties
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    namespaceType: 'extensionPoint',
                    jsonTag: 'namespaceExtensionPointB',
                    componentArchetype: {
                        namespaceType: 'component',
                        jsonTag: 'namespaceComponentB',
                        namespaceProperties: testProperties,
                        subNamespaces: [
                            {
                                namespaceType: 'child',
                                jsonTag: 'namespaceChildC',
                                namespaceProperties: testProperties
                            }
                        ]
                    }
                }
            ]
        },
        {
            namespaceType: 'extensionPoint',
            jsonTag: 'namespaceExtensionPointA',
            componentArchetype: {
                namespaceType: 'component',
                jsonTag: 'namespaceComponentA',
                namespaceProperties: testProperties
            }
        }
    ]
};


