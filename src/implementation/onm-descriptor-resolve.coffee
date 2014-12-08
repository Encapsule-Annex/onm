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

A namespace descriptor is a low-level, should-be-viewed-as-frozen object
maintained by onm.Model used to cache details about a specific namespace
declaration in an onm data model.

Namespace descriptor objects are the basis of AddressToken object implementation,
and are ultimately the source of truth when it comes to opening or creating
specifc JavaScript object references within the scope of an onm.Store object.

Recall that a "namespace" in the parlance of onm is a generic moniker for a
named JavaScript object that has one of several onm-defined possible object roles
assigned via its 'namespaceType' property value declaration.

Generically, this module implements the low-level policy over the opening
(i.e. the resolution of onm.Address resource locators against a specific
onm.Store addressable, in-memory data store), and the creation (i.e. allocation
and initialization via multi-way priority merge algorithm) of data namespaces
within the scope of an onm.Store.

onm.Store -> delegates to...
onm.Namespace -> delegates to ...
omm.AddressTokenResolver -> delegates to...
onm.NamespaceDescriptorResolver -> this module gets it done

------------------------------------------------------------------------------

###
#
#
#


implementation = require './onm-descriptor-resolve-impl'

module.exports =


    # ****************************************************************************
    # ****************************************************************************
    # ****************************************************************************
    # Main API
    #
    #

    # ==============================================================================
    resolveNamespaceDescriptorOpen: (options_) ->
        try
            if not implementation.checkValidDescriptorResolveOptions options_, true
                throw new Error("Invalid descriptor resolve options.")

            # resolveNamespaceDescriptorOpen is a policy wrapper around resolveNamespaceDescriptorOpenImpl.
            resolveResults = @resolveNamespaceDescriptorOpenImpl options_

            # Policy implementation: throw if object implied by namespace descriptor does not exist.
            if not (resolveResults.namespaceDataReference? and resolveResults.namespaceDataReference)
                resourceString = @createResourceString options_, resolveResults
                throw new Error "Cannot open expected child object in data: #{resourceString}"
                
            resolveResults

        catch exception_
            throw new Error("resolveNamespaceDescriptorOpen failure: #{exception_.message}")

    # ==============================================================================
    resolveNamespaceDescriptorOpenImpl: (options_) ->

        # checkValidDescriptorResolveOptions(options_) == true assumed

        resolveResults =
            namespaceEffectiveKey: null
            namespaceDataReference: null
            pendingNamespaceDescriptors: []

        descriptor = options_.targetNamespaceDescriptor
        key = options_.targetNamespaceKey
        resolveResults.namespaceEffectiveKey = effectiveKey = (descriptor.namespaceType != 'extensionPoint') and descriptor.jsonTag or key
        resolveResults.namespaceDataReference = options_.parentDataReference[effectiveKey]

        resolveResults


    # ==============================================================================
    resolveNamespaceDescriptorCreate: (options_) ->
        try
            if not implementation.checkValidDescriptorResolveOptions options_
                throw new Error("Invalid descriptor resolve options.")

            # Determine if an object of that name already exists in the store data.
            resolveResults = @resolveNamespaceDescriptorOpenImpl options_

            # Policy implementation: throw if object implied by namespace exists already.
            if resolveResults.namespaceDataReference? and resolveResults.namespaceDataReference
                resourceString = @createResourceString options_, resolveResults
                throw new Error "Child object already exists in data: #{resourceString}"

            resolveResults

        catch exception_
            throw new Error("resolveNamespaceDescriptorCreate failure: #{exception_.message}")


    # ****************************************************************************
    # ****************************************************************************
    # ****************************************************************************
    # White box test exports
    #
    #

    createResourceString: implementation.createResourceString
    checkValidDescriptorResolveOptions: implementation.checkValidDescriptorResolveOptions
    checkValidDescriptorResolveResults: implementation.checkValidDescriptorResolveResults
