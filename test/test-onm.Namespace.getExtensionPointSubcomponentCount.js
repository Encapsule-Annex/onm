// test-onm.Namespace.getExtensionPointSubcomponentCount.js
//

var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should;

var uuid = require('node-uuid');
var onm = require('../index');

var testData = require('./fixture/address-book-data-model');

module.exports = describe("onm.Namespace.getExtensionPointSubcomponentCount method tests", function() {
    var store, address, namespaceExtensionPoint;
    before(function() {
        store = testData.createStore();
    });

    describe("get subcomponent count of empty extension point", function() {
        var count;
        before(function() {
            address = store.model.createPathAddress("addressBook.contacts");
            namespaceExtensionPoint = store.nsOpen(address);
        });
        it("subcomponent count should be zero", function() {
            assert.equal(0, namespaceExtensionPoint.getExtensionPointSubcomponentCount());
        });

        describe("insert a component and get the subcomponent count of non-empty extension point", function() {
            var namespaceContact;
            var namespaceExtensionPoint2 = null;

            before(function() {
                var addressNewContact = store.model.createPathAddress("addressBook.contacts.contact");
                namespaceContact = store.nsCreate(addressNewContact);
                namespaceExtensionPoint2 = store.nsOpen(address);
            });
            it("subcomponent count obtained against the original onm.Namepace instance should be one.", function() {
                // NOTE: This seemingly trivial test requires that a lot of onm functions flawlessly.
                // If this test fails then there's a deep dark problem with this build of onm that you must fix.
                // Let's talk about what _should_ happen:
                // We create an onm.Store bound to our 'addressBook' data model
                // We create an onm.Namespace bound to the 'addressBook.contacts' extension point namespace
                // We create an onm.Namespace bound to a new 'addressBook.contacts.contact' component namespace
                // We obtain the count of components in the namespace bound to 'addressBook.contacts' extension point
                // We expect that there's a single (one) data component in the extension point
                // If the count is not one (i.e. it's zero) then it's likely that the problem lies in the
                // onm.Store.createComponent code path used to set up the test. Further, it is likely that
                // a bug in implementation/onm-address-token-resolver has resulted in the test namespace's
                // underlying data reference getting detached (i.e. the token resolver has overwritten the
                // onm.Store's internal data object _below_ the extension point).
                assert.equal(1, namespaceExtensionPoint.getExtensionPointSubcomponentCount());
            });
            it("subcomponent count obtained against a new onm.Namepace instance should also be one.", function() {
                assert.equal(1, namespaceExtensionPoint2.getExtensionPointSubcomponentCount());
            });
            it("subcomponent count of the new object should be zero (because it's not an extension point).", function() {
                assert.equal(0, namespaceContact.getExtensionPointSubcomponentCount());
            });
        });

    });

});

