// vector-dimension-create-namespace-key.js
//

module.exports = {

    testDimension: 'override component key specification',
    testValues: [
        {
            label: 'undefined override key',
            data: undefined,
            validConfig: true
        },
        {
            label: 'null override key',
            data: null,
            validConfig: true
        },
        {
            label: 'zero-length override key',
            data: '',
            validConfig: true
        },
        {
            label: 'specified override key alone',
            data: 'alone',
            validConfig: true
        },
        {
            label: 'specified override key match prop val',
            data: 'match',
            validConfig: true
        },
        {
            label: 'specified ovveride key mismatch prop val',
            data: 'mismatch',
            validConfig: true
        }
    ]
};

