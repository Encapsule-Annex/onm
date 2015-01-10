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

resolveNamedObject = require('./onm-named-object-resolver')

# ==============================================================================
class AddressTokenResolver

    constructor: (tokenResolveOptions_) ->
        try
            if not (tokenResolveOptions_? and tokenResolveOptions_ and 
                tokenResolveOptions_.model? and tokenResolveOptions_.model and
                tokenResolveOptions_.parentDataReference? and tokenResolveOptions_.parentDataReference and
                tokenResolveOptions_.token? and tokenResolveOptions_.token and
                tokenResolveOptions_.mode? and tokenResolveOptions_.mode and
                tokenResolveOptions_.propertyAssignmentObject? and tokenResolveOptions_.propertyAssignmentObject)
                    throw new Error("Invalid resolve options object.")
            switch (tokenResolveOptions_.mode)
                when 'open'
                    break
                when 'create'
                    break
                else
                    throw new Error("Unrecognized mode value '#{tokenResolveOptions_.mode}'")
        catch exception_
            throw new Error("AddressTokenResolver2 construction failure: #{exception_.message}")


# ==============================================================================
openTokenNamespace = (tokenResolveOptions_) ->
    try

    catch exception_
        throw new Error("openTokenNamespace failure: #{exception_.message}")


# ==============================================================================
createTokenNamespace = (tokenResolveOptions_) ->
    try

    catch exception_
        throw new Error("createTokenNamespace failure: #{exception_.message}")

# ==============================================================================


module.exports = {
    # exports for client(s)
    AddressTokenResolver: AddressTokenResolver,
    # exports for tests
    openTokenNamespace: openTokenNamespace,
    createTokenNamespace: createTokenNamespace
}
