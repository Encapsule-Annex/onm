// example-v0.3-data-model-decl.js
// ============================================================================

/*

  - onm v0.3 data model declarations must be valid JSON to support transfer over the wire

  - data-model-specific invariant properties and attributes should be added to your data model
    using onm's qunderscore meta-data annotation syntax convention.


    NTYPE           JTYPE            COMPOSISION

    descriptor      object           static heterogeneous hashtable of namespaces

    uvalue          *                unconstrained JSON value [ string | number | object | array | true | false | null ]
    svalue          string           constrained JSON value [ string | null ]
    nvalue          number           constrained JSON value [ number | null ]
    ovalue          object           constrained JSON value [ object | null ]
    avalue          array            constrained JSON value [ array | null ]
    bvalue          true | false     JSON [ true | false | null ]

    map             object           extensible homogeneous associative array collection
    vector          array            extensible homogeneous ordered array collection (aspirational at this point)

*/


var dataModelDescriptor = {

    // 'uuid'
    // required v4 UUID
    // invariant property of this data model that is used to identify a set of backwards-compatible
    // onm URI address spaces (i.e. newer set members extend previous address space(s)).
    uuid: 'f0c69af2-c382-4b4a-a3c9-4ca772e4b2e8',

    // 'uuidVersion'
    // required v4 UUID
    // unique identifier of a specific data model used to identify its associated onm LRI address space.
    // Note: onm LRI's are compressed onm URI's that may be used to address resources bound to a specific
    // onm data model version. LRI's are shorter and less expensive to parse than their URI counterparts.
    // But onm LRI's are extremely volatile. In general any model namespace add, remove, or rename will
    // change the model's LRI space encoding. As a rule of thumb, ensure that you never deploy different
    // data models with the same 'uuidVersion'.
    uuidVersion: '8f1e2643-6044-4713-b25b-0f5ab6f88487'

    // 'name'
    // required string property
    // short human-readable name that identifies your data model.
    label: 'onm v0.3 Address Book Data Model',

    // 'description'
    // required string property
    // short explanation of the purpose of the data model, the type(s) of data it models.
    description: 'Demonstrates new features and syntax of onm v0.3 data model descriptor object format.',

    author: {},
    copyright: {},
    licenses: []


    // 'addressSpaceScope'
    // optional string 'global' | 'local' (defaults to global)
    // If 'global' then onm-generated URI's may be used to distinguish between different addressed resources across onm.Store instances.
    // If 'local' then onm-generated URI's may be used only to distinguish between different addressed resources in a single onm.Store instance.
    // 'local' is more space/time efficient but must be used with great caution in distributed deployments.
    addressSpaceScope: 'global'
    
    // 'namespaceDescriptor'
    // required sub-object property
    // A single-rooted tree of namespace descriptor objects.

    namespaceDescriptor: {
        name: 'addressBook'
        label: 'Address Book',
        description: 'An example onm v0.3 data model for a hypothetical address book data set.',
        type: 'descriptor',
        uuid: '386750d4-d200-4530-b61d-c2e42bf0e6e0',
        uuidVersion: 'd0804c46-6dca-4bad-9368-bff0dd01c835',
        subnamespaces: [
            {
                name: 'contacts',
                label: 'Contacts',
                description: 'A map of contact descriptors.',
                type: 'map',
                uuid: '08f761cc-d843-43d4-bb2b-71ad2afd9b25',
                uuidVersion: 'b92d7dd3-f6f7-4f65-83d7-8a801124d852',
                subnamespaces: [
                    {
                        name: 'contact',
                        label: "Contact Descriptor",
                        description: "A contact descriptor record.",
                        type: 'descriptor'
                        uuid: '6e18dc67-016d-4f1b-9295-b984afeb29e8',
                        uuidVersion: 'e58a648d-6e49-4c5b-bd78-efd2b704eb57',
                        subnamespaces: [
                            {
                                name: 'firstName',
                                label: "First Name",
                                description: "The contact's first name.",
                                type: 'svalue',
                                dvalue: null,
                                // dgen: 'uuid' | 'epoch' | 'date'
                                uuid: '173cc304-146f-45c3-a6fd-554403ee1d01',
                                uuidVersion: '35e2ae23-b6d8-46ff-8562-dc8ba04ddd25'
                            },
                            {
                                name: 'lastName',
                                label: "Last Name",
                                description: "The contact's last name.",
                                type: 'svalue',
                                dvalue: null,
                                uuid: 'c2eae11a-883e-4c21-aba0-c2624e94e8af',
                                uuidVersion: '775e8b19-dc17-4c7d-b657-e5eab48de8bd',
                            },
                            {
                                name: 'addresses',
                                label: 'Addresses',
                                description: 'This contact\'s address information.',
                                type: 'vector',
                                uuid: '34c3e8b1-14c1-4d08-afda-b377930db07a',
                                uuidVersion: 'c0c22323-153f-44fa-b3f1-cd4c56e8e516'
                                subnamespaces: [
                                    {
                                        name: 'address',
                                        label: 'Address',
                                        description: 'An address descriptor record.',
                                        type: 'descriptor',
                                        uuid: '459040ac-af16-404e-84f5-69cb1fb5728a',
                                        uuidVersion: 'f7b7347f-252d-402c-9437-f9f4ce221b3b',
                                        subnamespaces: [
                                            {
                                                name: 'address1',
                                                label: 'Address Line 1',
                                                description: 'First line of street address.',
                                                type: 'svalue',
                                                dvalue: null,
                                                uuid: '4e56f5d3-67fb-462e-96f7-b04ccea7d141',
                                                uuidVersion: '18ae9179-0f25-4509-b60e-31145666884c'
                                            },
                                            {
                                                name: 'address2',
                                                label: 'Address Line 2',
                                                description: 'Second line of street address.',
                                                type: 'svalue',
                                                dvalue: null,
                                                uuid: '8fe7bea5-2544-42cb-b538-e2b646f52a81',
                                                uuidVersion: 'cf39ec70-1ac6-47b3-b71a-8f72295e1d98'
                                            }
                                        ]
                                    }
                                ]
                            }
                        }
                    }
                }
            }
        }
    }
};
