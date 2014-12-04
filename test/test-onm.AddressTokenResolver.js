// test-onm.AddressTokenResolver.js
//

var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should;
var uuid = require('node-uuid');
var onm = require('../index');
var testData = require('./fixture/address-book-data-model');

// onm.AddressTokenResolver is an internal implementation object of onm that is deliberately
// not exposed via onm's public API surface. 
var AddressTokenResolver = require('../lib/implementation/onm-address-token-resolver');


module.exports = describe("onm.AddressTokenResolver implementation object whitebox tests.", function() {

    var parentDataObject = {};
    var testStore = null;
    var addressRoot = null;
    var addressToken = null;
    var addressTokenResolver = null;

    before(function() {
        
        testStore = testData.createStore();
        addressRoot = testStore.model.createRootAddress();
        addressToken = addressRoot.implementation.getLastToken();
        addressTokenResolver = new AddressTokenResolver(testStore, parentDataObject, addressToken, "new");
    });

    it("An instance of AddressTokenResolver object should have been constructed.", function() {
        assert.isNotNull(addressTokenResolver);
        assert.instanceOf(addressTokenResolver, AddressTokenResolver);
        console.log(JSON.stringify(addressTokenResolver.dataReference));
    });

    it("Execute the test suite.", function() {
        assert.isTrue(true);
    });

});

