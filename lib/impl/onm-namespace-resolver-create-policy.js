(function() {
  module.exports = {

    /* create new namespace policy implementation
    - create new namespace
    - throw if namespace already exists
    - initialize all declared namespace properties to value (first):
      1. caller-provided value
      2. declared default value
    - visit all declared subnamespaces and queue deferred resolves
    - overlay namespace data with remaining, unmodeled, caller-provided properties
     */
    policyName: 'create new namespace',
    prepareInputContext: function(context_) {
      return true;
    },
    dereferenceNamedObject: function(context_) {
      return true;
    },
    processNamespaceProperty: function(name_, declaration_, context_) {
      return true;
    },
    processSubnamespace: function(descriptor_, context_) {
      return true;
    },
    finalizeOutputContext: function(context_) {
      return true;
    }
  };

}).call(this);
