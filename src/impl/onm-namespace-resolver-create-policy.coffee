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

    ### create new namespace policy implementation
    - create new namespace
    - throw if namespace already exists
    - initialize all declared namespace properties to value (first):
      1. caller-provided value
      2. declared default value
    - visit declared subnamespaces and queue deferred resolves based on data model and caller-supplied data
    - overlay namespace data with remaining, caller-provided properties
    ###

    # ----------------------------------------------------------------------------
    policyName: 'create new namespace'

    # ----------------------------------------------------------------------------
    initializeContext: (context_) ->
        policyCommon.initializeResolveResults context_
        true

    # ----------------------------------------------------------------------------
    dereferenceNamedObject: (context_) ->
        descriptor = context_.options.targetNamespaceDescriptor
        resolveResults = context_.resolveResults
        resolveResults.namespaceEffectiveKey = effectiveKey = (descriptor.namespaceType != 'component') and descriptor.jsonTag or context_.options.targetNamespaceKey
        resolveResults.namespaceDataReference = context_.options.parentDataReference[effectiveKey]
        if resolveResults.namespaceDataReference? and resolveResults.namespaceDataReference
            message = "Cannot re-create named object '#{effectiveKey}' for data model path '#{descriptor.path}'."
            throw new Error message
        if not (effectiveKey? and effectiveKey and effectiveKey.length > 0)
            resolveResults.namespaceEffectiveKey = effectiveKey = context_.options.semanticBindingsReference.setUniqueKey({});
        resolveResults.namespaceDataReference = context_.options.parentDataReference[effectiveKey] = {}
        true

    # ----------------------------------------------------------------------------
    processNamespaceProperty: (name_, declaration_, context_) ->
        value = context_.options.propertyAssignmentObject[name_]
        if value? and value
            delete context_.options.propertyAssignmentObject[name_]
        else
            value = declaration_.defaultValue
            if not (value? and value)
                value = declaration_.fnCreate? and declaration_.fnCreate and declaration_.fnCreate()
                if not (value? and value)
                    throw new Error "Cannot deduce property value for assignment for name '#{name_}'"
        context_.resolveResults.namespaceDataReference[name_] = value
        true

    # ----------------------------------------------------------------------------
    processSubnamespace: (descriptor_, context_) ->
        true

    # ----------------------------------------------------------------------------
    processPropertyOptions: (context_) ->
        true

    # ----------------------------------------------------------------------------
    finalizeContext: (context_) ->
        true

