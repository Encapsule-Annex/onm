// test-onm.Store.openNamespace.js
//

var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should;

var uuid = require('node-uuid');
var onm = require('../index');

var testData = require('./fixture/address-book-data-model');

module.exports = describe("onm.Store.openNamespace method tests", function() {
    var store, addressRoot, namespaceRoot, addressNewContact, addressContact, namespaceContact = null

    before(function() {

        var testSetupWrapper = function() {
            store = testData.createStore();
            addressRoot = store.model.createRootAddress();
            namespaceRoot = store.openNamespace(addressRoot);
            addressNewContact = addressRoot.createSubpathAddress("contacts.contact");
            namespaceContact = store.createComponent(addressNewContact);
            addressContact = namespaceContact.getResolvedAddress();
        };

        assert.doesNotThrow(testSetupWrapper);

        assert.isDefined(store);
        assert.isNotNull(store);
        assert.instanceOf(store, onm.Store);

        assert.isDefined(addressRoot);
        assert.isNotNull(addressRoot);
        assert.instanceOf(addressRoot, onm.Address);

        assert.isDefined(addressNewContact);
        assert.isNotNull(addressNewContact);
        assert.instanceOf(addressNewContact, onm.Address);

        assert.isDefined(namespaceContact);
        assert.isNotNull(namespaceContact);
        assert.instanceOf(namespaceContact, onm.Namespace);

        assert.isDefined(addressContact);
        assert.isNotNull(addressContact);
        assert.instanceOf(addressContact, onm.Address);

        var expectedStoreJSON = '{"name":"","description":"","contacts":{"1":{"firstName":"","lastName":"","phoneNumbers":{},"addresses":{},"emails":{}}},"properties":{"name":"","description":"","subproperties":{"collection":{}}}}';
        var actualStoreJSON = store.toJSON();
        assert.equal(actualStoreJSON, expectedStoreJSON);

    });

    it("We should not be able to open the unresolved contact address", function() {
        assert.throws(function() { store.openNamespace(addressNewContact); }, Error);
    });

    it("We should be able to open the new contact descriptor's resolved address.", function() {
        var namespace = null;
        var functionWrapper = function() {
            namespace = store.openNamespace(addressContact);
        };
        assert.doesNotThrow(functionWrapper);
        var expectedJSON = '{"firstName":"","lastName":"","phoneNumbers":{},"addresses":{},"emails":{}}';
        var actualJSON = namespace.toJSON();
        assert.equal(actualJSON, expectedJSON);

    });


    describe("Remove the contact descriptor component and attempt to re-open the address.", function() {
        before(function() {
            var functionWrapper = function() {
                store.removeComponent(addressContact);
            };
            assert.doesNotThrow(functionWrapper);
        });
        it("Attempt to open the address of the removed contact component should throw.", function() {
            var functionWrapper = function() {
                store.openNamespace(addressContact);
            };
            assert.throws(functionWrapper);
        });
    });

    describe("Exercise the data-over functionality of onm.Store.openNamespace.", function() {

        var addressContacts, namespaceContacts = null;

        before(function() {
            addressContacts = addressRoot.createSubpathAddress("contacts");
            namespaceContacts = store.openNamespace(
                addressContacts,
                {
                    "5e98bb28-b0cf-11e4-919b-080027d17300": {
                        firstName: "Sarah",
                        lastName: "Tonin"
                    }
                }
            );
        });

        it("We should have been able to open the 'contacts' extension point namespace.", function() {
            assert.isDefined(namespaceContacts);
            assert.isNotNull(namespaceContacts);
            assert.instanceOf(namespaceContacts, onm.Namespace);
        });

        it("The JSON serializaton of the 'contacts' namespace should contain a new contact descriptor.", function() {
            var expectedJSON = '{"5e98bb28-b0cf-11e4-919b-080027d17300":{"firstName":"Sarah","lastName":"Tonin","phoneNumbers":{},"addresses":{},"emails":{}}}';
            var actualJSON = namespaceContacts.toJSON();
            assert.equal(actualJSON, expectedJSON);
        });

    });



});
