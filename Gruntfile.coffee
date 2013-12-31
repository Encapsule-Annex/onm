# Yea, baby.
#

module.exports = (grunt) ->

    configObject =
        pkg: grunt.file.readJSON("package.json")

        coffee:
            debug:
                files:
                    'dist/node/encapsule-lib-backchannel.js': 'src/coffee/encapsule-lib-backchannel.coffee'
                    'dist/node/encapsule-lib-javascript.js': 'src/coffee/encapsule-lib-javascript.coffee'
                    'dist/node/ONMjs-core-address-binder.js': 'src/coffee/ONMjs-core-address-binder.coffee'
                    'dist/node/ONMjs-core-address.js': 'src/coffee/ONMjs-core-address.coffee'
                    'dist/node/ONMjs-core-address-store.js': 'src/coffee/ONMjs-core-address-store.coffee'
                    'dist/node/ONMjs-core-address-token.js': 'src/coffee/ONMjs-core-address-token.coffee'
                    'dist/node/ONMjs-core-model.js': 'src/coffee/ONMjs-core-model.coffee'
                    'dist/node/ONMjs-core-namespace.js': 'src/coffee/ONMjs-core-namespace.coffee'
                    'dist/node/ONMjs-core-store.js': 'src/coffee/ONMjs-core-store.coffee'
                    'dist/node/ONMjs-core-store-reifier.js': 'src/coffee/ONMjs-core-store-reifier.coffee'
            release:
                files:
                    'dist/node/onm-node.js': 'src/coffee/*.coffee'

        clean: [ 'dist' ]

        browserify:
            'dist/client/onm-client.js': [ './index.js' ]



    grunt.initConfig configObject

    grunt.loadNpmTasks "grunt-contrib-coffee"
    grunt.loadNpmTasks "grunt-contrib-clean"
    grunt.loadNpmTasks "grunt-browserify"

    #grunt.loadNpmTasks "grunt-contrib-jshint"
    grunt.loadNpmTasks "grunt-contrib-uglify"
    #grunt.loadNpmTasks "grunt-contrib-nodeunit"

    grunt.registerTask "default", [ "clean", "coffee:debug", "browserify" ]
