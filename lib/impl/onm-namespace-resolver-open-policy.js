(function() {
  module.exports = {
    policyName: 'open existing namespace',
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
