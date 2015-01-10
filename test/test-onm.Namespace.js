// test-onm.Namespace.js
//

module.exports = describe("onm.Namespace object method tests", function() {
    // Internal white box tests.
    require('./test-impl-onm-named-object-resolver');
    require('./test-impl-onm-token-resolve');
    // API tests
    require('./test-onm.Namespace.getExtensionPointSubcomponentCount');
});