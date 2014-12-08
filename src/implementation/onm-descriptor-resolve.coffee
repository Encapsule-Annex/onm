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


module.exports =

    # ==============================================================================
    resolveNamespaceDescriptorOpen: (options_) ->
        try
            if not @checkValidDescriptorResolveOptions options_, true
                throw new Error("Invalid descriptor resolve options.")

            resolveResults =
                namespaceDataReference: null
                pendingNamespaceDescriptors: []

            descriptor = options_.targetNamespaceDescriptor
            key = options_.targetNamespaceKey
            jsonTag = (descriptor.namespaceType != 'extensionPoint') and descriptor.jsonTag or key
            resolveResults.namespaceDataReference = options_.parentDataReference[jsonTag]
            # As a matter of policy, onm currently throws a new Error object iff the requested namespace cannot be resolved in the onm.Store data.
            if not (resolveResults.namespaceDataReference? and resolveResults.namespaceDataReference)
                message = "Cannot open expected child object '#{jsonTag}' in data for namespace descriptor 'path'='#{descriptor.path}' 'namespaceType'='#{descriptor.namespaceType}'"
                throw new Error(message)
                
            resolveResults

        catch exception_
            throw new Error("resolveNamespaceDescriptorOpen failure: #{exception_.message}")


    # ==============================================================================
    resolveNamespaceDescriptorCreate: (options_) ->
        try
            if not @checkValidDescriptorResolveOptions options_
                throw new Error("Invalid descriptor resolve options.")

            resolveResults =
                namespaceDataReference: null
                pendingNamespaceDescriptors: []

            resolveResults

        catch exception_
            throw new Error("resolveNamespaceDescirptorCreate failure: #{exception_.message}")



    # ==============================================================================
    checkValidDescriptorResolveOptions: (options_, isOpenResolve_) ->
        if not (options_? and options_)
            return false

        openResult = 
            options_.parentDataReference? and options_.parentDataReference and
            options_.targetNamespaceDescriptor? and options_.targetNamespaceDescriptor and
            true or false

        if not (isOpenResolve_? and isOpenResolve_)
            return openResult and
                options_.targetNamespaceKey? and options_.targetNamespaceKey and
                options_.propertyAsssignmentObject? and options_.propertyAssignmentObject and
                true or false

        openResult



    # ==============================================================================
    checkValidDescriptorResolveResults: (results_) ->
        results_? and results_ and
            results_.namespaceDataReference? and results_.namespaceDataReference and
            results_.pendingNamespaceDescriptors? and results_.pendingNamespaceDescriptors and
            Array.isArray(results_.pendingNamespaceDescriptors) and
            true or false




