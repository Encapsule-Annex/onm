# Encapsule Project onm


Encapsule Project Object Namespace Manager (onm) library is a data-model-driven JavaScript data object/JSON factory and in-memory subsystem communication bus for building complex data-driven Node.js/HTML 5 client applications in JavaScript based on the the Model-Store-Observe-Feedback-Signal design pattern.

#### Package

The latest onm package is available via npm:

        npm install onm

See also: [https://www.npmjs.org/package/onm](https://www.npmjs.org/package/onm)

onm is distributed in [CommonJS ](http://en.wikipedia.org/wiki/CommonJS) format for easiy use in node:

        var onm = requrie('onm');
        // onm blah blah blah...

onm is extremely useful in the client as well and is fully compatible. However, you will have to transform onm's CommonJS source for use in the browser using a build tool such as [browserify](http://browserify.org/).

I've been writing _everything_ in CommonJS and using the [grunt-browserify](https://www.npmjs.org/package/grunt-browserify) plug-in for [Grunt](http://gruntjs.com/) to pack up everything I need for my HTML5 SPA (including onm), and it's been working well so far.

There are few related packages you might be interested in as well: [onm-server-rest-routes](https://www.npmjs.org/package/onm-server-rest-routes), [onm-client-rest-api](https://www.npmjs.org/package/onm-client-rest-api), [onmd-scdl](https://www.npmjs.org/package/onmd-scdl)...

#### Sources

Sources are available under [MIT license](http://opensource.org/licenses/MIT) on GitHub: [Encapsule/onm](https://github.com/Encapsule/onm)

#### Documentation

onm's small API surface belies its power: [Encapsule/onm/wiki](https://github.com/Encapsule/onm/wiki)



