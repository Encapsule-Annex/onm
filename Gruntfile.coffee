# Yea, baby.
#

module.exports = (grunt) ->

    configObject =
        pkg: grunt.file.readJSON("package.json")

        coffee:
            debug:
                files:
                    'dist/js/encapsule-lib-backchannel.js': 'src/coffee/encapsule-lib-backchannel.coffee'
                    'dist/js/encapsule-lib-javascript.js': 'src/coffee/encapsule-lib-javascript.coffee'
                    'dist/js/ONMjs-core-address-binder.js': 'src/coffee/ONMjs-core-address-binder.coffee'
                    'dist/js/ONMjs-core-address.js': 'src/coffee/ONMjs-core-address.coffee'
                    'dist/js/ONMjs-core-address-store.js': 'src/coffee/ONMjs-core-address-store.coffee'
                    'dist/js/ONMjs-core-address-token.js': 'src/coffee/ONMjs-core-address-token.coffee'
                    'dist/js/ONMjs-core-model.js': 'src/coffee/ONMjs-core-model.coffee'
                    'dist/js/ONMjs-core-namespace.js': 'src/coffee/ONMjs-core-namespace.coffee'
                    'dist/js/ONMjs-core-store.js': 'src/coffee/ONMjs-core-store.coffee'
                    'dist/js/ONMjs-core-store-reifier.js': 'src/coffee/ONMjs-core-store-reifier.coffee'
            release:
                files:
                    'dist/js/onm.js': 'src/coffee/*.coffee'

        clean: [ 'dist' ]



    grunt.initConfig configObject

    grunt.loadNpmTasks "grunt-contrib-coffee"
    grunt.loadNpmTasks "grunt-contrib-clean"

    #grunt.loadNpmTasks "grunt-contrib-jshint"
    grunt.loadNpmTasks "grunt-contrib-uglify"
    #grunt.loadNpmTasks "grunt-contrib-nodeunit"

    grunt.registerTask "default", [ "clean", "coffee" ]
