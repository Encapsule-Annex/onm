////
// Object Namespace Manager (onm) 
// MIT License // Copyright (C) 2014 Encapsule Project
// https://github.com/Encapsule/onm/blob/master/LICENSE

//
// A 'data model' represents the schema of a class of JSON documents
// in terms of addressable, dot-delimited, namespace hierarchy.
// Typically:
// var onm = require('onm');
// var exampleDataModelDeclaration = { jsonTag: 'exampleDataComponent' };
// var exampleDataModel = new onm(exampleDataModelDeclaration);
module.exports.Model = require('./lib/onm-model');

//
// A 'data store' represents a specific instance of a JSON document that
// conforms to the schema defined by an onm.Model object instance.
// Typically:
// var exampleDataStore = new onm.Store(exampleDataModel);
// console.log(exampleDataStore.toJSON());
// -> '{ "exampleDataComponent": {} }'
module.exports.Store = require('./lib/onm-store');

//
// A 'data address' represents the data model declaration of a specific
// namespace node in an onm.Model object, and is used to access the specific
// details of that namespace declaration at runtime. Note, that this is the
// basis of onm's support for data introsepction.
// Typically:
// var rootAddress = exampleDataModel.createRootAddress();
// console.log(JSON.stringify(rootAddress.getModel());
// -> "{ 'jsonTag': 'exampleDataComponent' }"
module.exports.Address = require('./lib/onm-address');

//
// A 'data namespace' is a proxy object that is used to access JSON document
// data inside an onm.Store object.
// Typically:
// var rootNamespace = exampleDataStore.openNamespace(rootAddress);
// rootNamespace.data().testProperty = "test";
// console.log(exampleDataStore.toJSON());
// -> '{ "exampleDataComponent": { "testProperty": "test" } }'
module.exports.Namespace = require('./lib/onm-namespace');

////
// UTILITY EXPORTS
module.exports.util = require('./lib/lib-javascript');

////
// DEPRECATED in onm v0.3+
module.exports.AddressStore = require('./lib/onm-address-store');
module.exports.BackChannel = require('./lib/lib-backchannel');
