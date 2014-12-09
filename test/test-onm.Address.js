// test-onm.Address.js

module.exports = describe("onm.Address object method tests", function() {

    // Internal white box tests.
    require('./test-impl-onm-descriptor-resolve');
    require('./test-impl-onm-token-resolve');

    // Public API level functional tests.
    require('./test-onm.Address.createSubpathAddress');
    require('./test-onm.Address.isParent');
    require('./test-onm.Address.visitChildAddresses');
    require('./test-onm.Address.visitSubaddressesAscending');
    require('./test-onm.Address.visitExtensionPointAddresses');
});


