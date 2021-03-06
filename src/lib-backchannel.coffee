###
------------------------------------------------------------------------------

The MIT License (MIT)

Copyright (c) 2014 Encapsule Project
  
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

------------------------------------------------------------------------------

###
#
#
#


#
#
# ****************************************************************************
module.exports = class BackChannel
    constructor: (logHandler_, errorHandler_) ->
        try
            ###
            callback: function(html_) { ... }
            where html_ is an HTML string
            ###
            @logHandler = logHandler_

            ###
            callback: function(error_) { ... }
            where error_ is an Error object
            ###
            @errorHandler = errorHandler_

            @log = (html_) =>
                if @logHandler? and @logHandler
                    try
                        @logHandler(html_)
                        return true
                    catch exception_
                        exception = new Error("BackChannel exception occurred in log handler callback: #{exception_.message}")
                        @error(exception)
                        return false
                false

            @error = (error_) =>
                if @errorHandler? and @errorHandler
                    try
                        @errorHandler(error_)
                        return true
                    catch exception_
                        message = "BackChannel exception occurred in error handler callback: #{exception_.message}"
                        console.error(message);
                        false

                console.error("BackChannel.error reported w/no registered error handler!: #{error_.message}")

        catch exception_
            throw new Error("BackChannel failure in constructor: #{exception_.message}");

