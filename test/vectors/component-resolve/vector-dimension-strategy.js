// vector-dimension-strategy.js
//

module.exports = {
    testDimension: 'resolution strategy',

    testValues: [
        {
            label: 'strategy undefined',
            data: undefined,
            validConfig: false
        },
        {
            label: 'strategy null',
            data: undefined,
            validConfig: false
        },
        {
            label: 'strategy is not a string',
            data: {}
            validConfig: false
        },
        {
            label: 'bogus resolution strategy',
            data: 'badvalue',
            validConfig: false
        }
        {
            label: 'open resolution strategy',
            data: 'open',
            validConfig: true
        },
        {
            label: 'create resolution strategy',
            data: 'create',
            validConfig: true
        },
        {
            label: 'negotiate resolution strategy',
            data: 'negotiate',
            validConfig: true
        }
    ]
};

