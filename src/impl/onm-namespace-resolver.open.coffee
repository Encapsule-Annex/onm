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

module.exports =


    # Attempt to open the parent-scoped, named subobject indicated by the options_
    # parameter. This function does not implement policy; if the named object does not
    # exist then resoveResults.namespaceDataReference will be undefined. Otherwise the
    # function returns with resolveResults.namespaceDataReference set to a reference to
    # to the named object. 
    # ==============================================================================
    resolveOpenNamespaceDescriptor: (options_) ->

        # checkValidDescriptorResolveOptions(options_) == true assumed
        resolveResults =
            namespaceEffectiveKey: null
            namespaceDataReference: null
            pendingNamespaceDescriptors: []

        descriptor = options_.targetNamespaceDescriptor
        key = options_.targetNamespaceKey
        resolveResults.namespaceEffectiveKey = effectiveKey = (descriptor.namespaceType != 'component') and descriptor.jsonTag or key
        resolveResults.namespaceDataReference = options_.parentDataReference[effectiveKey]

        resolveResults

