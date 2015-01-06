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
------------------------------------------------------------------------------

###
#
#
#

jslib = require('../lib-javascript')

module.exports = namespaceResolverContext = {}


# ==============================================================================
namespaceResolverContext.initializeContextObject = (context_) ->

    context_.input =
        strategy: context_.input.strategy? and context_.input.strategy or 'error'
        parentDataReference: context_.input.parentDataReference
        targetNamespaceDescriptor: context_.input.targetNamespaceDescriptor
        targetNamespaceKey: context_.input.targetNamespaceKey
        semanticBindingsReference: context_.input.semanticBindingsReference
        propertyAssignmentObject: context_.input.propertyAssignmentObject? and context_.input.propertyAssignmentObject and
            jslib.clone(context_.input.propertyAssignmentObject) or {}

    context_.output =
        resolutionStrategy: 'error'
        namespaceEffectiveKey: null
        namespaceDataReference: null
        dataChangeEventJournal: []
        pendingNamespaceDescriptors: [] # TODO: pick a better name for this

    context_

# ==============================================================================
namespaceResolverContext.getNamespaceDescriptorFromContext = (context_) ->
    context_.input.targetNamespaceDescriptor

# ==============================================================================
namespaceResolverContext.checkValidDescriptorResolveOptions = (options_, isOpenResolve_) ->

    if not (options_? and options_)
        console.log("Missing options.")
        return false

    if not (options_.parentDataReference? and options_.parentDataReference)
        console.log("Invalid parentDataReference.")
        return false

    if not (options_.targetNamespaceDescriptor? and options_.targetNamespaceDescriptor)
        console.log("Invalid targetNamespaceDescriptor.")
        return false

    if not (options_.targetNamespaceDescriptor.jsonTag? and options_.targetNamespaceDescriptor.jsonTag)
        console.log("Invalid targetNamespaceDescriptor.")
        return false

    if isOpenResolve_? and isOpenResolve_
        return true

    keyValid = true
    if options_.targetNamespaceKey? and options_.targetNamespaceKey
        keyValid = options_.targetNamespaceKey.length > 0 or false

    if not keyValid
        console.log("Invalid targetNamespaceKey.")
        return false

    if not (options_.semanticBindingsReference? and options_.semanticBindingsReference)
        console.log("Invalid semanticBindingsReference.")
        return false

    if not (options_.propertyAssignmentObject? and options_.propertyAssignmentObject)
        console.log("Invalid propertyAsssignmentObject.")
        return false

    true

# ==============================================================================
namespaceResolverContext.checkValidDescriptorResolveResults = (results_) ->
    if not (results_? and results_)
        console.log "Missing results"
        return false
    if not (results_.namespaceEffectiveKey? and results_.namespaceEffectiveKey)
        console.log "Invalid namespaceEffectiveKey"
        return false
    if not (results_.namespaceDataReference? and results_.namespaceDataReference)
        console.log "Invalid namespaceDataReference"
        return false
    if not (results_.pendingNamespaceDescriptors? and results_.pendingNamespaceDescriptors and Array.isArray(results_.pendingNamespaceDescriptors))
        console.log "Invalid pendingNamespaceDescriptors"
        return false
    return true

