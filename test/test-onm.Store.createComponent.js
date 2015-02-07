// test-onm.Store.createComponent.js
//

var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should;
var uuid = require('node-uuid');
var onm = require('../index');
var testData = require('./fixture/address-book-data-model');

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
        badDataModel = new onm.Model({ jsonTag: 'bogus', uuid: 'bogus', uuidVersion: 'bogus' });
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

        it("Verify the property values of the newly-created contact data component.", function() {
            var dataContact = namespaceContact.data();
            expect(dataContact).to.have.property('firstName').equal('');
            expect(dataContact).to.have.property('lastName').equal('');
            expect(dataContact).to.have.property('emails');
            expect(dataContact.emails).to.be.an('object');
            expect(dataContact).to.have.property('addresses');
            expect(dataContact.addresses).to.be.an('object');
            expect(dataContact).to.have.property('phoneNumbers');
            expect(dataContact.phoneNumbers).to.be.an('object');
        });

        describe("Call onm.Store.createComponent with a simple construction options object.", function() {
            var constructionOptions = {
                firstName: "Joe",
                lastName: "Smith"
            };
            var namespace = null;
            before(function() {
                namespace = store.createComponent(addressNewContact, constructionOptions);
            });
            it("A contact component should have been created.", function() {
                assert.isDefined(namespace);
                assert.isNotNull(namespace);
                assert.instanceOf(namespace, onm.Namespace);
            });
            it("Verify the property values of the newly-created contact data component.", function() {
                var dataContact = namespace.data();
                expect(dataContact).to.have.property('firstName').equal('Joe');
                expect(dataContact).to.have.property('lastName').equal('Smith');
                expect(dataContact).to.have.property('emails');
                expect(dataContact.emails).to.be.an('object');
                expect(dataContact).to.have.property('addresses');
                expect(dataContact.addresses).to.be.an('object');
                expect(dataContact).to.have.property('phoneNumbers');
                expect(dataContact.phoneNumbers).to.be.an('object');
            });

            describe("Call onm.Store.createComponent with a hierarchical construction options object.", function() {
                var addressNewPhoneNumber, namespacePhoneNumber;

                var constructionOptions = {
                    areaCode: '000',
                    number: '123-4567',
                    notes: {
                        text: "This is a note assigned via a hierarchical component construction options object."
                    }
                };
                before(function() {
                    addressNewPhoneNumber = namespace.getResolvedAddress().createSubpathAddress("phoneNumbers.phoneNumber");
                    namespacePhoneNumber = store.createComponent(addressNewPhoneNumber, constructionOptions);
                });
                it("A contact component should have been created.", function() {
                    assert.isDefined(namespacePhoneNumber);
                    assert.isNotNull(namespacePhoneNumber);
                    assert.instanceOf(namespacePhoneNumber, onm.Namespace);
                });
                it("Verify the property values of the newly-created contact data component.", function() {
                    var dataContact = namespacePhoneNumber.data();
                    expect(dataContact).to.have.property('areaCode').equal('000');
                    expect(dataContact).to.have.property('number').equal('123-4567');
                });
            });

            describe("Call onm.Store.createComponent with a hierarchical construction options object that includes subcomponents.", function() {

                var contactConstructionData = {
                    firstName: 'Marsellus',
                    lastName: 'Wallace',
                    emails: {
                        'marsellus@pulp.net': { 
                            emailAddress: 'marsellus@pulp.net'
                        }
                    },
                    addresses: {
                        'wallace': {
                            streetAddress: 'Vincent & Jules Blvd',
                            notes: {
                                'question': {
                                    text: "What does Marsellus Wallace look like?"
                                },
                                'answer': {
                                    text: "He does not look like a bitch."
                                }
                            }
                        }
                    },
                    notInTheDataModel: {
                        someProperty: "This is some property of a data namespace that is not declared in the data model.",
                        someOtherProperty: "This is yet another property of the undeclared namespace.",
                        subnamespaceOfUndeclared: {
                            becauseWeCan: "define a child namespace and and see that onm does with the construct."
                        }
                    }
                };

                var namespaceContact = null;

                before(function() {
                    namespaceContact = store.createComponent(addressNewContact, contactConstructionData);
                });

                it("A new contact component should have been created.", function() {
                    assert.instanceOf(namespaceContact, onm.Namespace);
                });

                describe("Inspect the property values and subnamespaces of the newly created component.", function() {

                    var dataContact = null;

                    before(function() {
                        dataContact = namespaceContact.data();
                    });

                    it("'contact' data component should define string value for property 'firstName'.", function() {
                        assert.property(dataContact, 'firstName');
                        assert.isString(dataContact.firstName);
                    });

                    it("'contact.firstName' property value should be 'Marsellus'.", function() {
                        assert.equal(dataContact.firstName, 'Marsellus');
                    });

                    it("'contact' data component should define string value for property 'lastName'.", function() {
                        assert.property(dataContact, 'lastName');
                        assert.isString(dataContact.lastName);
                    });

                    it("'contact.lastName' property value should be 'Wallace'.", function() {
                        assert.equal(dataContact.lastName, 'Wallace');
                    });

                    it("'contact.emails' should be an object.", function() {
                        assert.property(dataContact, 'emails');
                        assert.isObject(dataContact.emails);
                    });

                    it("'contact.emails' should contain a single object.", function() {
                        assert.equal(Object.keys(dataContact.emails).length, 1);
                    });

                    it("'contact.emails' should contain object named 'marsellus@pulp.net'.", function() {
                        assert.property(dataContact.emails, 'marsellus@pulp.net');
                        assert.isObject(dataContact.emails['marsellus@pulp.net']);
                    });

                    it("'contact.emails.marsellus@pulp.net' object should have property 'emailAddress'.", function() {
                        assert.property(dataContact.emails['marsellus@pulp.net'], 'emailAddress');
                        assert.isString(dataContact.emails['marsellus@pulp.net'].emailAddress);
                    });

                    it("'contact' should define sub-object 'addresses'.", function() {
                        assert.property(dataContact, 'addresses');
                        assert.isObject(dataContact.addresses);
                    });

                    it("'contact.addresses' object should contain one key.", function() {
                        assert.equal(Object.keys(dataContact.addresses).length, 1);
                    });

                    it("'contact.addresses' sub-object should be named 'wallace'.", function() {
                        assert.property(dataContact.addresses, 'wallace');
                        assert.isObject(dataContact.addresses.wallace);
                    });

                    describe("Examine the data component 'wallace' of type 'address'.", function() {
                        var dataWallace = null;
                        before(function() {
                            dataWallace = dataContact.addresses.wallace;
                        });
                        it("'wallace' component should define property 'streetAddress'.", function() {
                            assert.property(dataWallace, 'streetAddress');
                            assert.isString(dataWallace.streetAddress);
                        });
                        it("'wallace.streetAddress' property value should equal 'Vincent & Jules Blvd'.", function() {
                            assert.equal(dataWallace.streetAddress, 'Vincent & Jules Blvd');
                        });

                    });
                });
            });
        });

        describe("Serialize the test data store to JSON and compare the results against a known good snapshot.", function() {

            var expectedJSON = '{"name":"","description":"","contacts":{"1":{"firstName":"","lastName":"","phoneNumbers":{},"addresses":{},"emails":{}},"2":{"firstName":"Joe","lastName":"Smith","phoneNumbers":{"3":{"areaCode":"000","number":"123-4567","notes":{"text":"This is a note assigned via a hierarchical component construction options object."}}},"addresses":{},"emails":{}},"4":{"firstName":"Marsellus","lastName":"Wallace","notInTheDataModel":{"someProperty":"This is some property of a data namespace that is not declared in the data model.","someOtherProperty":"This is yet another property of the undeclared namespace.","subnamespaceOfUndeclared":{"becauseWeCan":"define a child namespace and and see that onm does with the construct."}},"phoneNumbers":{},"addresses":{"wallace":{"streetAddress":"Vincent & Jules Blvd","notes":{"question":{"text":"What does Marsellus Wallace look like?"},"answer":{"text":"He does not look like a bitch."}}}},"emails":{"marsellus@pulp.net":{"emailAddress":"marsellus@pulp.net"}}}},"properties":{"name":"","description":"","subproperties":{"collection":{}}}}'

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

