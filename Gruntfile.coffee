
module.exports = (grunt) ->

    configObject =
        pkg: grunt.file.readJSON("package.json")

        coffee:
            compile:
                files:
                    # onm API modules
                    'lib/onm-model.js': 'src/onm-model.coffee'
                    'lib/onm-address.js': 'src/onm-address.coffee'
                    'lib/onm-store.js': 'src/onm-store.coffee'
                    'lib/onm-namespace.js': 'src/onm-namespace.coffee'
                    'lib/onm-address-store.js': 'src/onm-address-store.coffee'

                    # onm implementation modules
                    'lib/impl/onm-address-token.js': 'src/impl/onm-address-token.coffee'

                    # legacy
                    'lib/impl/onm-address-token-resolver-legacy.js': 'src/impl/onm-address-token-resolver-legacy.coffee'

                    # v0.3 implementation
                    'lib/impl/onm-address-resolver.js': 'src/impl/onm-address-resolver.coffee'


                    'lib/impl/onm-component-resolver.js': 'src/impl/onm-component-resolver.coffee'
                    'lib/impl/onm-component-context.js': 'src/impl/onm-component-context.coffee'

                    'lib/impl/onm-named-object-resolver.js': 'src/impl/onm-named-object-resolver.coffee'
                    'lib/impl/onm-named-object-context.js': 'src/impl/onm-named-object-context.coffee'
                    'lib/impl/onm-named-object-property-visitor.js': 'src/impl/onm-named-object-property-visitor.coffee'
                    'lib/impl/onm-named-object-property-policy-common.js': 'src/impl/onm-named-object-property-policy-common.coffee'
                    'lib/impl/onm-named-object-property-policy-initialize.js': 'src/impl/onm-named-object-property-policy-initialize.coffee'
                    'lib/impl/onm-named-object-property-policy-update.js': 'src/impl/onm-named-object-property-policy-update.coffee'

                    'lib/impl/onm-store-reifier.js': 'src/impl/onm-store-reifier.coffee'
                    'lib/impl/onm-util-functions.js': 'src/impl/onm-util-functions.coffee'

        jshint:
            options: {}
            files: [ '*.js', './lib/*.js', './lib/**/*.js' ]


        mochaTest:
            options:
                reporter: 'spec'
                checkLeaks: true
 
            src: [ 'test/test-onm.js' ]

        clean: [ 'lib' ]

    grunt.initConfig configObject

    grunt.loadNpmTasks "grunt-contrib-coffee"
    grunt.loadNpmTasks "grunt-contrib-clean"
    grunt.loadNpmTasks "grunt-mocha-test"
    grunt.loadNpmTasks "grunt-contrib-jshint"

    grunt.registerTask "test", [ "mochaTest" ]
    grunt.registerTask "default", [ "clean", "coffee:compile", "test" ]
