// test-onm.Store.createComponent.js
//

var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should;
var uuid = require('node-uuid');
var onm = require('../onm');
var testData = require('./fixture/test-data');

module.exports = describe("onm.Store.createComponent method tests", function() {

    var store = null;
    var addressRoot = null;
    var badDataModel = null;
    var badAddress = null;

    before(function() {
        store = testData.createStore();
        assert.isNotNull(store);
        assert.instanceOf(store, onm.Store);
        addressRoot = store.model.createRootAddress();
        assert.isNotNull(addressRoot);
        assert.instanceOf(addressRoot, onm.Address);
        badDataModel = new onm.Model({ jsonTag: 'bogus' });
        badAddress = badDataModel.createRootAddress();
    });

    it("Attempt to call onm.Store.createComponent with a null onm.Address parameter should throw.", function() {
        assert.throws(function () { store.createComponent(); }, Error);
    });

    it("Attempt to call onm.Store.createComponent with an address of a non 'addressBook' data model should throw.", function() {
        assert.throws(function () { store.createComponent(badAddress); }, Error);
    });

    it("Attempt to call onm.Store.createComponent with a qualified address should throw.", function() {
        assert.throws(function() { store.createComponent(addressRoot); }, Error);
    });

    it("Attempt to call onm.Store.createComponent with a non-component address should throw.", function() {
        var address = addressRoot.createSubpathAddress('properties.subproperties');
        assert.throws(function() { store.createComponent(address); }, Error);
    });

    describe("Call onm.Store.createComponent to create a new 'contact'.", function() {

        var addressNewContact = null;
        var namespaceContact = null;

        before(function() {
            addressNewContact = addressRoot.createSubpathAddress("contacts.contact");
            namespaceContact  = store.createComponent(addressNewContact);
        });

        it("We should be able to create a contact component.", function() {
            assert.isDefined(namespaceContact);
            assert.isNotNull(namespaceContact);
            assert.instanceOf(namespaceContact, onm.Namespace);
        });

        describe("Call onm.Store.createComponent with a single-key key array parameter.", function() {
            var keyArray = [ 'test' ];
            before(function() {
                namespaceContact = store.createComponent(addressNewContact, keyArray);
            });
            it("We should be able to create a contact component.", function() {
                assert.isDefined(namespaceContact);
                assert.isNotNull(namespaceContact);
                assert.instanceOf(namespaceContact, onm.Namespace);
            });
            it("The component key of the newly-created component should be 'test'.", function() {
                assert.equal(namespaceContact.getComponentKey(), "test");
            });
        });

        describe("Call onm.Store.createComponent with too many optional component override keys.", function() {
            var keyArray = [ 'test', 'error' ];
            it("The key array should be rejected because it is too long.", function() {
                assert.throws(function() { store.createComponent(addressNewContact, keyArray); }, Error);
            });
        });

        describe("Call onm.Store.createComponent with two optional override component keys.", function() {
            var keyArray = [ 'JoeSmith', 'primary' ];
            var addressNewEmail = null;
            before(function() {
                addressNewEmail = addressRoot.createSubpathAddress("contacts.contact.emails.email");
                namespaceContact = store.createComponent(addressNewEmail, keyArray);
            });
            it("A contact component should have been created.", function() {
                assert.isDefined(namespaceContact);
                assert.isNotNull(namespaceContact);
                assert.instanceOf(namespaceContact, onm.Namespace);
            });
            it("The component key of the newly-created component should be 'primary'.", function() {
                assert.equal(namespaceContact.getComponentKey(), "primary");
            });
        });

        describe("Call onm.Store.createComponent with an optional construction options object.", function() {
            var constructionOptions = {
                firstName: "Joe",
                lastName: "Smith"
            };
            var namespace = null;
            before(function() {
                namespace = store.createComponent(addressNewContact, null, constructionOptions);
            });
            it("A contact component should have been created.", function() {
                assert.isDefined(namespaceContact);
                assert.isNotNull(namespaceContact);
                assert.instanceOf(namespaceContact, onm.Namespace);
            });
        });

        describe("Serialize the test data store to JSON and compare the results against a known good snapshot.", function() {
            var expectedJSON = '{"addressBook":{"properties":{"name":"","description":"","subproperties":{"collection":{}}},"contacts":{"5":{"firstName":"","lastName":"","key":"5","emails":{},"addresses":{}},"test":{"firstName":"","lastName":"","key":"test","emails":{},"addresses":{}},"JoeSmith":{"firstName":"","lastName":"","key":"JoeSmith","emails":{"primary":{"key":"primary"}},"addresses":{}}}}}';
            var actualJSON = null;
            before(function() {
                actualJSON = store.toJSON();
            });
            it("The data store's JSON data should match the test's control JSON.", function() {
                assert.equal(actualJSON, expectedJSON);
            });
        });

    });
});

