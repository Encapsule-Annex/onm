// test-onm.Store.openNamespace.js
//

var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should;

var uuid = require('node-uuid');
var onm = require('../onm');

var testData = require('./fixture/test-data');

module.exports = describe("onm.Store.openNamespace method tests", function() {
    var store, addressRoot, addressNewContact;

    before(function() {
        store = testData.createStore();
        addressRoot = store.model.createRootAddress();
        addressNewContact = addressRoot.createSubpathAddress("contacts.contact");
    });

    it("we should be able to open the root namespace", function() {
        var namespace = store.openNamespace(addressRoot);
        assert.isNotNull(namespace);
        assert.instanceOf(namespace, onm.Namespace);
    });

    it("we should not be able to open the unresolved contact address", function() {
        assert.throws(function() { store.openNamespace(addressNewContact); }, Error);
    });

    describe("create a contact component, get its resolved address", function() {
        var namespaceContact, addressContact, namespaceTest;
        before(function() {
            namespaceContact = store.createComponent(addressNewContact);
            addressContact = namespaceContact.getResolvedAddress();
            namespaceTest = store.openNamespace(addressContact);
        });

        it("we should be able to call openNamespace on the resolved address", function() {
            assert.isNotNull(namespaceTest);
            assert.instanceOf(namespaceTest, onm.Namespace);
        });

        describe("now remove the contact component and try to call openNamespace on the resovlved address", function() {
            var errorMessage;
            before(function() {
                store.removeComponent(addressContact);
                try {
                    store.openNamespace(addressContact);
                } catch (exception_) {
                    errorMessage = exception_.message;
                    console.log(errorMessage);
                }
            });
            it("attempt to re-open the now-removed component should fail", function() {
                assert.throws(function () { store.openNamespace(addressContact); }, Error);
            });
        });
    });
});
