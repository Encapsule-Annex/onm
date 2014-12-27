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

policyCommon = require('./onm-namespace-resolver-policy-common')

module.exports =

    ### open existing namespace policy implementation
    - open existing namespace
    - throw if namespace does not exist
    - write declared property values specified in caller-provided data
    - visit declared child namespaces and queue deferred resolves based on caller-provided data only
    - overlay namespace data with remaining, caller-provided properties
    ###

    policyName: 'open existing namespace'

    initializeContext: (context_) ->
        policyCommon.initializeResolveResults context_
        true

    dereferenceNamedObject: (context_) ->
        descriptor = context_.options.targetNamespaceDescriptor
        context_.resolveResults.namespaceEffectiveKey = effectiveKey = (descriptor.namespaceType != 'component') and descriptor.jsonTag or context_.options.targetNamespaceKey
        context_.resolveResults.namespaceDataReference = context_.options.parentDataReference[effectiveKey]
        if not (context_.resolveResults.namespaceDataReference? and context_.resolveResults.namespaceDataReference)
            message = "Failed to open existing named object '#{effectiveKey}' for data model path '#{descriptor.path}'."
            throw new Error message
        true

    processNamespaceProperty: (name_, declaration_, context_) ->
        true

    processSubnamespace: (descriptor_, context_) ->
        true

    processPropertyOptions: (context_) ->
        true

    finalizeContext: (context_) ->
        true



