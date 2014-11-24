
module.exports = (grunt) ->

    configObject =
        pkg: grunt.file.readJSON("package.json")

        coffee:
            compile:
                files:
                    'dist/onm-model.js': 'src/onm-model.coffee'
                    'dist/onm-address.js': 'src/onm-address.coffee'
                    'dist/onm-store.js': 'src/onm-store.coffee'
                    'dist/onm-namespace.js': 'src/onm-namespace.coffee'
                    'dist/onm-address-store.js': 'src/onm-address-store.coffee'
                    'dist/implementation/onm-address-token.js': 'src/implementation/onm-address-token.coffee'
                    'dist/implementation/onm-address-token-resolver.js': 'src/implementation/onm-address-token-resolver.coffee'
                    'dist/implementation/onm-store-reifier.js': 'src/implementation/onm-store-reifier.coffee'
                    'dist/lib-backchannel.js': 'src/lib-backchannel.coffee'
                    'dist/lib-javascript.js': 'src/lib-javascript.coffee'

        jshint:
            options: {}
            files: [ 'onm.js', './dist/*.js', './dist/**/*.js' ]


        mochaTest:
            options:
                reporter: 'spec'
                checkLeaks: true
 
            src: [ 'test/test-onm.js' ]

        clean: [ 'dist' ]

    grunt.initConfig configObject

    grunt.loadNpmTasks "grunt-contrib-coffee"
    grunt.loadNpmTasks "grunt-contrib-clean"
    grunt.loadNpmTasks "grunt-mocha-test"
    grunt.loadNpmTasks "grunt-contrib-jshint"

    grunt.registerTask "test", [ "mochaTest" ]
    grunt.registerTask "default", [ "clean", "coffee:compile", "test" ]
