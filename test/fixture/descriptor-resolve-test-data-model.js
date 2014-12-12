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
        keyGenerator: 'internalUuidAdvanced'
    },

    jsonTag: 'namespaceRoot',
    namespaceProperties: testProperties,
    subnamespaces: [
        {
            jsonTag: 'namespaceChildA',
            namespaceType: 'child',
            namespaceProperties: testProperties
        },
        {
            jsonTag: 'namespaceExtensionPointA',
            namespaceType: 'extensionPoint',
            componentArchetype: {
                jsonTag: 'namespaceComponentA',
                namespaceType: 'component',
                namespaceProperties: testProperties
            }
        }
    ]
};


