// test-onm.Store-construction.js
//

var Mocha = require('mocha');
var Chai = require('chai');
var assert = Chai.assert;
var Leche = require('leche');
var withData = Leche.withData;

var onm = require('../index');
var testData = require('./fixture/address-book-data-model');
var addressBookDataModel = testData.createModel();

var inputTestDataVector = {

    'JSON parameter undefined.': [
        {
            inputObject: undefined,
            expectedJSON: '{"addressBook":{"name":"","description":"","properties":{"name":"","description":"","subproperties":{"collection":{}}},"contacts":{}}}'
        }
    ],

    'JSON parameter empty object.': [ 
        {
            inputObject: {},
            expectedJSON: '{"addressBook":{"name":"","description":"","properties":{"name":"","description":"","subproperties":{"collection":{}}},"contacts":{}}}'
        }
    ],

    'JSON parameter contains subset of address book root component properties.': [
        {
            inputObject: {
                addressBook: {
                    name: "Test Address Book",
                    description: "This is some address book-bound onm.Store that we're constructing."
                }
            },
            expectedJSON: '{"addressBook":{"name":"Test Address Book","description":"This is some address book-bound onm.Store that we\'re constructing.","properties":{"name":"","description":"","subproperties":{"collection":{}}},"contacts":{}}}'
        }
    ],

    'JSON parameter contains a superset of the address book root component properties.': [
        {
            inputObject: {
                addressBook: {
                    name: "Another Address Book Test",
                    somePropertyNotInTheModel: "This property is not in the address book data."
                }
            },
            expectedJSON: '{"addressBook":{"name":"Another Address Book Test","somePropertyNotInTheModel":"This property is not in the address book data.","description":"","properties":{"name":"","description":"","subproperties":{"collection":{}}},"contacts":{}}}'
        }
    ]
    
};

describe("onm.Store construction tests.", function() {

    describe("Basic default construction test.", function() {

        var store = null;

        before(function(done_) {
            var functionUnderTest = function() {
                store = new onm.Store(addressBookDataModel);
            };
            assert.doesNotThrow(functionUnderTest);
            done_();
        });

        it("A default constructed address book onm.Store object should have been constructed.", function() {
            assert.isNotNull(store);
            assert.instanceOf(store, onm.Store);
        });

        describe("Ensure that the default constructed onm.Store can be serialized to JSON.", function() {

            var json = null;

            before(function(done_) {
                var functionUnderTest = function() {
                    json = store.toJSON();
                };
                assert.doesNotThrow(functionUnderTest);
                done_();
            });

            it("The call to onm.Store.toJSON should have succeeded and produced a string.", function() {
                assert.isNotNull(json);
                assert.isString(json);
            });

            describe("Ensure that we can reconstruct another onm.Store object using the JSON obtained in the last test.", function() {

                var store2 = null;

                before(function(done_) {
                    var functionUnderTest = function() {
                        store2 = new onm.Store(addressBookDataModel, json);
                    };
                    assert.doesNotThrow(functionUnderTest);
                    done_();
                });

                it("The call to construct another onm.Store from JSON should have succeeded.", function() {
                    assert.isNotNull(store2);
                    assert.instanceOf(store2, onm.Store);
                });

                it("Serializing the second onm.Store should produce identical JSON.", function() {
                    var json1 = store.toJSON();
                    console.log("json1 === '" + json1 + "'.");
                    var json2 = store2.toJSON();
                    console.log("json2 === '" + json2 + "'.");
                    assert.equal(json1, json2);
                });

                describe("Execute the construction JSON variant tests.", function() {

                    before(function(done_) {
                        withData(inputTestDataVector, function(inputTestData_) {

                            console.log(JSON.stringify(inputTestData_));

                            var store = null;

                            before(function(beforeDone_) {
                                var json = JSON.stringify(inputTestData_.inputObject);
                                store = new onm.Store(addressBookDataModel, json);
                                beforeDone_();
                            });

                            it("A new onm.Store instance should have been constructed.", function() {
                                assert.isNotNull(store);
                                assert.instanceOf(store, onm.Store);
                                console.log("CREATED STORE JSON: " + store.toJSON());
                            });

                            describe("Serialize the newly-created onm.Store to JSON test.", function() {

                                var json = null;

                                before(function(done_) {
                                    var functionUnderTest = function () {
                                        json = store.toJSON();
                                    };
                                    assert.doesNotThrow(functionUnderTest);
                                    done_();
                                });

                                it("The call to onm.Store.toJSON should have succeeded and returned a string.", function() {
                                    assert.isNotNull(json);
                                    assert.isString(json);
                                });

                                it("The return JSON string should match the expected result specified in the input test vector.", function() {
                                    assert.strictEqual(json, inputTestData_.expectedJSON);
                                });

                            });

                        });
                        done_();
                    });

                    it("Execute the dynamic portion of the test.", function() {
                        assert.isTrue(true);
                    });

                });

            });

        });



    });


});



