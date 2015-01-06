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

# Resolve a reference to an onm named object.

module.exports = namedObjectResolver = {}

# ==============================================================================
namedObjectResolver.resolve = (context_) ->
    try
        input = context_.input
        output = context_.output
        descriptor = input.targetNamespaceDescriptor

        # Deduce and cache the named object's effective object name, or key.
        output.namespaceEffectiveKey = effectiveKey = (descriptor.namespaceType != 'component') and descriptor.jsonTag or input.targetNamespaceKey
        # Attempt to dereference an existing object of the same name in the context of the parent object.
        output.namespaceDataReference = input.parentDataReference[effectiveKey]
        # Policy implementation based on existence and resolution strategy.
        switch input.strategy
            when 'open'
                if not (output.namespaceDataReference? and output.namespaceDataReference)
                    switch descriptor.namespaceType
                        when 'component'
                            message = "Cannot open named object '#{effectiveKey}' for component namespace '#{descriptor.jsonTag}'. Object does not exist."
                            break
                        else
                            message = "Cannot open named object for #{descriptor.namespaceType} namespace '#{descriptor.jsonTag}'. Object does not exist."
                            break
                    throw new Error message
                output.resolutionStrategy = 'open'
                break
            when 'create'
                if output.namespaceDataReference? and output.namespaceDataReference
                    switch descriptor.namespaceType
                        when 'component'
                            message = "Cannot create named object '#{effectiveKey}' for component namespace '#{descriptor.jsonTag}'. Object already exists."
                            break
                        else
                            message = "Cannot create named object for #{descriptor.namespaceType} namespace '#{descriptor.jsonTag}'. Object already exists."
                            break
                    throw new Error message
                output.resolutionStrategy = 'create'
                break
            when 'negotiate'
                output.resolutionStrategy = output.namespaceDataReference? and output.namespaceDataReference and 'open' or 'create'
                break
            else
                throw new Error "Unrecognized named object dereference strategy '#{input.strategy}'."

        if output.resolutionStrategy == 'create'
            if not (effectiveKey? and effectiveKey and effectiveKey.length > 0)
                # FIX THIS (function call semantic should be simplified to 'create key' only)
                output.namespaceEffectiveKey = effectiveKey = input.semanticBindingsReference.setUniqueKey({}); 
            output.namespaceDataReference = input.parentDataReference[effectiveKey] = {}
            output.dataChangeEventJournal.push
                layer: 'namespace'
                event: 'namespaceCreated'
                eventData:
                    namespaceType: descriptor.namespaceType
                    jsonTag: descriptor.jsonTag
                    key: effectiveKey
        true

    catch exception_
        message = "Failed to resolve named object."
        throw new Error message


