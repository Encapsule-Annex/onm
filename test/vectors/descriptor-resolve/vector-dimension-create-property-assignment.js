// vector-dimension-create-property-assignment.js
//

module.exports = {

    testDimension: 'property assignment object',
    testValues: [
        {
            label: 'empty property assignment',
            data: {},
            validConfig: true
        },

        {
            label: 'declared properties subset',
            data: {
                a: 'blue',
                b: 'blue'
            },
            validConfig: true
        },

        {
            label: 'undeclared properties set',
            data: {
                _a: 'red',
                _b: 'red'
            },
            validConfig: true
        },

        {
            label: 'declared properties superset',
            data: {
                a: 'blue',
                b: 'blue',
                c: 'blue',
                d: 'blue',
                e: 'blue',
                f: 'blue',
                _a: 'red',
                _b: 'red'
            },
            validConfig: true
        },

        {
            label: 'undeclared subobjects set',
            data: {
                _a: {
                    _b: {
                        c_: {
                            _d: 'red'
                        }
                    }
                }
            },
            validConfig: true
        }

    ]
};


