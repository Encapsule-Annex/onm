
module.exports = (grunt) ->

    configObject =
        pkg: grunt.file.readJSON("package.json")

        coffee:
            compile:
                files:
                    'lib/onm-model.js': 'src/onm-model.coffee'
                    'lib/onm-address.js': 'src/onm-address.coffee'
                    'lib/onm-store.js': 'src/onm-store.coffee'
                    'lib/onm-namespace.js': 'src/onm-namespace.coffee'
                    'lib/onm-address-store.js': 'src/onm-address-store.coffee'
                    'lib/implementation/onm-address-token.js': 'src/implementation/onm-address-token.coffee'
                    'lib/implementation/onm-address-token-resolver.js': 'src/implementation/onm-address-token-resolver.coffee'

                    'lib/implementation/onm-token-resolve.js': 'src/implementation/onm-token-resolve.coffee'
                    'lib/implementation/onm-descriptor-resolve.js': 'src/implementation/onm-descriptor-resolve.coffee'
                    'lib/implementation/onm-descriptor-resolve-impl.js': 'src/implementation/onm-descriptor-resolve-impl.coffee'

                    'lib/implementation/onm-store-reifier.js': 'src/implementation/onm-store-reifier.coffee'
                    'lib/lib-backchannel.js': 'src/lib-backchannel.coffee'
                    'lib/lib-javascript.js': 'src/lib-javascript.coffee'

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
