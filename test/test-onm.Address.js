// test-onm.Address.js

var assert = require('chai').assert;

module.exports = describe("onm.Address object method tests", function() {

    before(function(done_) {
        // Public API level functional tests.
        require('./test-onm.Address.createSubpathAddress');
        require('./test-onm.Address.isParent');
        require('./test-onm.Address.visitChildAddresses');
        require('./test-onm.Address.visitSubaddressesAscending');
        require('./test-onm.Address.visitExtensionPointAddresses');
        done_();
    });
    it("Execute the onm.Address test suite.", function() {
        assert.isTrue(true);
    });

});


