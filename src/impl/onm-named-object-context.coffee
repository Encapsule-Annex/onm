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

helperFunctions = require('./onm-util-functions')

module.exports = namedObjectResolverContext = {}


# ==============================================================================
namedObjectResolverContext.initializeContextObject = (options_) ->
    context =
        input:
            strategy: options_.strategy? and options_.strategy or 'error'
            parentDataReference: options_.parentDataReference
            targetNamespaceDescriptor: options_.targetNamespaceDescriptor
            targetNamespaceKey: options_.targetNamespaceKey
            semanticBindingsReference: options_.semanticBindingsReference
            propertyAssignmentObject: options_.propertyAssignmentObject? and options_.propertyAssignmentObject and helperFunctions.clone(options_.propertyAssignmentObject) or {}
        output:
            strategyFollowed: 'error'
            namespaceEffectiveKey: null
            namespaceDataReference: null
            dataChangeEventJournal: []
            pendingResolutionStack: []
            resolvedId: -1


# ==============================================================================
namedObjectResolverContext.checkValidContextInput = (options_) ->

    results = { valid: true, reason: 'okay' }

    setInvalid = (reason_) ->
        results.valid = false
        results.reason = reason_
        results

    while true

        if not (options_? and options_)
            setInvalid "Missing options in-parameter."
            break

        if not (options_.parentDataReference? and options_.parentDataReference)
            setInvalid "Missing parent data object reference."
            break

        if not (options_.targetNamespaceDescriptor? and options_.targetNamespaceDescriptor)
            setInvalid "Missing target namespace descriptor object reference."
            break

        if not (options_.targetNamespaceDescriptor.jsonTag? and options_.targetNamespaceDescriptor.jsonTag)
            setInvalid "Specified target namespace descriptor object appears invalid."
            break

        if not (options_.strategy? and options_.strategy and options_.strategy.length? and options_.strategy.length)
            setInvalid "Missing resolution strategy specification."
            break

        strategyValid = true
        switch options_.strategy
            when 'open'
                break
            when 'create'
                break
            when 'negotiate'
                break
            else
                strategyValid = false
                break
      
        if not strategyValid
            setInvalid "Unrecognized resolution strategy specified."
            break

        # TODO: This needs a closer look. Now string. Later integer? There's a matrix in there that's not currently accounted for...

        if options_.targetNamespaceKey? and options_.targetNamespaceKey
            if not (options_.targetNamespaceKey.length? and options_.targetNamespaceKey.length)
                setInvalid "Invalid target namespace key specified."

        if not (options_.semanticBindingsReference? and options_.semanticBindingsReference)
            setInvalid "Missing semantic bindings reference."
            break

        # TODO: I don't think this makes sense. It should be okay to pass an undefined or null propertyAssignmentObject reference around no?
        if not (options_.propertyAssignmentObject? and options_.propertyAssignmentObject)
            setInvalid "Missing property assignment object."
            break

        break

    if not results.valid
        # TODO: remove console logging before releasing v0.3
        console.warn "Invalid named object input context object: '#{results.reason}'."

    results.valid

# ==============================================================================
namedObjectResolverContext.checkValidContextOutput = (results_) ->

    results = { valid: true, reason: 'okay' }

    setInvalid = (reason_) ->
        results.valid = false
        results.reason = reason_
        results

    while true

        if not (results_? and results_)
            setInvalid "Missing results"
            break

        if not (results_.resolvedId? and (results_.resolvedId >= 0))
            setInvalid "Invalid resolved namespace model ID."
            break

        if not (results_.namespaceEffectiveKey? and results_.namespaceEffectiveKey and results_.namespaceEffectiveKey.length? and results_.namespaceEffectiveKey.length)
            setInvalid "Invalid namespaceEffectiveKey"
            break

        if not (results_.namespaceDataReference? and results_.namespaceDataReference)
            setInvalid "Invalid namespaceDataReference"
            break

        if not (results_.pendingResolutionStack? and results_.pendingResolutionStack and Array.isArray(results_.pendingResolutionStack))
            setInvalid "Invalid pendingResolutionStack"
            break

        if not (results_.strategyFollowed? and results_.strategyFollowed)
            setInvalid "Invalid strategyFollowed"
            break

        if not (results_.dataChangeEventJournal? and results_.dataChangeEventJournal and Array.isArray(results_.dataChangeEventJournal))
            setInvalid "Invalid dataChangeEventJournal"
            break

        switch results_.strategyFollowed
            when 'open'
                break
            when 'create'
                break
            else
                setInvalid "Invalid strategyFollowed value '#{results_.strategyFollowed}'."
                break

        break

    if not results.valid
        # TODO: remove console logging before releasing v0.3
        console.warn "Invalid named object input context object: '#{results.reason}'."

    results.valid


