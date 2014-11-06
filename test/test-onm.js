// test-onm.js
//

var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should;

var packageMeta = require('../package.json');

describe("Object Namespace Manager v" + packageMeta.version + " (onm) module test suite.", function() {

    // Validate data models used by these tests.
    require('./test-fixture-data-models');

    // Base level onm export object API test suites.
    require('./test-onm.Model');
    require('./test-onm.Address');
    require('./test-onm.Store');
    require('./test-onm.Namespace');

    // Advanced white box, and functional test suites.
    require('./test-onm.Model-intrinsic-semantic-bindings');
});



