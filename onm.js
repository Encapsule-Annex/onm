// onm library CommonJS-format package public exports

module.exports.Model = require('./dist/onm-model');
module.exports.Store = require('./dist/onm-store');
module.exports.Address = require('./dist/onm-address');
module.exports.AddressStore = require('./dist/onm-address-store');
module.exports.Namespace = require('./dist/onm-namespace');
module.exports.BackChannel = require('./dist/lib-backchannel');
module.exports.util = require('./dist/lib-javascript');

// highly questionable to bundle this test suite w/onm like this...
// but for now...

module.exports.tests = {};
module.exports.tests.verifyDataModel = require('./test/fixture/test-shared-onmd-generic-suite');



