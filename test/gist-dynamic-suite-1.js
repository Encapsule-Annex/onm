// test-dynamic-suite.js
//
// This is a sample Mocha test to experiment with techniques for generating dynamic test cases
//
// - https://stackoverflow.com/questions/22465431/how-can-i-dynamically-generate-test-cases-in-javascript-node <- not so much luck
// - https://gist.github.com/mupat/8466879eef1d1e89db64 <- yup

var Mocha = require('mocha');
var Test = Mocha.Test;
var Suite = Mocha.Suite;

var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should;

// This is bullshit; generate whatever input vector you want. Or,
// accept the test declaration vector as in-parameter to the module...
var testDeclarationVector = [
    {
        foo: "test1"
    },
    {
        foo: "test2"
    }
];

var suite = describe("I am a dynamic test suite.", function() {
    before(function(done_) {
        for (var vectorIndex in testDeclarationVector) {
            var testDeclaration = testDeclarationVector[vectorIndex];
            console.log("Adding test for " + JSON.stringify(testDeclaration));
            suite.addTest(new Test("Dynamic test for object '" + JSON.stringify(testDeclaration) + "'.", function() {
                assert.property(testDeclaration, 'foo');
            }));
        }
        done_();
    })
    it("make it so", function() {
        assert.isTrue(true);
    });
});


/*

// Not so much luck w/this. I can't get the test to execute.
// Researching this, I came to the example above (or close to it).
// The pertinent detail I think is the stage that test is actually
// added. I believe the pattern below is quite old w/respect to current
// Mocha. And, the above seems much more like the syntax we're using
// currently.

var mocha = new Mocha();

var suite = Suite.create(mocha.suite, 'I am a dynamic test suite.');

suite.addTest(new Test('I am a dynamic test.', function() {
    console.log("THE TEST RAN!");
    assert.isNotNull(suite);
}));

mocha.run(function(failures) {
    process.on('exit', function() {
        process.exit(failures);
    })
});


*/