// semantic-binding-variants.js
//
// Each semantic binding variant is grafted into the 'SemanticBindingTest'
// data model declaration object to create a test vector of onm data model
// declaration objects.
//

var semanticBindingVariants = {

    { "Null component key generator.", [
        {
        }
    ] },

    { "With 'keyPropertyName' declaration set to some random value.", [
        {
        }
    ] },

    { "Internal LUID component key generator. 'keyPropertyName' === undefined.", [
        {
        }
    ] },

    { "Internal LUID component key generator. 'keyPropertyName' === 'key'.", [
        {
        }
    ] },

    { "Internal LUID component key generator. 'keyPropertyName' === 'error'.", [
        {
        }
    ] },

    { "Internal UUID component key generator. 'keyPropertyName' === undefined.", [
        {
        }
    ] },

    { "Internal UUID component key generator. 'keyPropertyName' === 'key'.", [
        {
        }
    ] },

    { "Internal UUID component key generator. 'keyPropertyName' === 'error'.", [
        {
        }
    ] },


    // External key generator coverage.

    // keyPropertyName setUniqueKey keyUniqueKey


    { "External key generator. 'keyPropertyName' === undefined.", [
        {
        }
    ] },

    { "Internal UUID component key generator. 'keyPropertyName' === undefined.", [
        {
        }
    ] },


    



    { "External developer-defined component key generator test.", [
        {
        }
    ] }

};

