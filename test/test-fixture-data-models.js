// test-onmd-fixtures.js
//

// Dynamic test suite for generically testing onm data model declarations.
var testOnmdX = require('./fixture/test-shared-onmd-generic-suite'); // returns a function

// Data models used by onm's internal module tests.
var addressBookDataModelDeclaration = require('./fixture/address-book-data-model').modelDeclaration;
var semanticBindingsDataModelDeclaration = require('./fixture/semantic-bindings-test-data-model');

// Test the internal test fixture data model declarations using the onmd generic suite.
module.exports = (function() {
    testOnmdX(addressBookDataModelDeclaration);
    testOnmdX(semanticBindingsDataModelDeclaration);
})();



