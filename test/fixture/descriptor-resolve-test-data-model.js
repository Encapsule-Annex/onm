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

var descriptorResolveModelDeclaration = module.exports = {
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
                    namespaceProperties: testProperties
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


