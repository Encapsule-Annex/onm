###
------------------------------------------------------------------------------

The MIT License (MIT)

Copyright (c) 2015 Encapsule Project
  
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

**** Encapsule Project :: Build better software with circuit models ****

OPEN SOURCES: http://github.com/Encapsule HOMEPAGE: http://Encapsule.org
BLOG: http://blog.encapsule.org TWITTER: https://twitter.com/Encapsule

------------------------------------------------------------------------------
Low-level library routines inspired by (and often copied) from http://coffeescriptcookbook.com
------------------------------------------------------------------------------
###
#
#
#
#

# Copied from http://coffeescriptcookbook.com/chapters/classes_and_objects/cloning

clone = (object_) ->


    # \ BEGIN: clone function
    try
        # \ BEGIN: try
        if not object_? or typeof object_ isnt 'object'
            return object_

        if object_ instanceof Date
            return new Date(object_.getTime()) 

        if object_ instanceof RegExp
            flags = ''
            flags += 'g' if object_.global?
            flags += 'i' if object_.ignoreCase?
            flags += 'm' if object_.multiline?
            flags += 'y' if object_.sticky?
            return new RegExp(object_.source, flags) 

        newInstance = new object_.constructor()

        for key of object_
            newInstance[key] = clone object_[key]

        return newInstance
        # / END: try

    catch exception
        throw new Error("clone: #{exception.message}");

    # / END: clone function

module.exports.clone = clone

module.exports.dictionaryLength = (dictionary_) ->
    try
        Object.keys(dictionary_).length
    catch exception
        throw new Error("dictionaryLength: #{exception.message}");

module.exports.uuidNull = "00000000-0000-0000-0000-000000000000"

module.exports.getEpochTime = -> Math.round new Date().getTime() / 1000.0
