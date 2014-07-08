###
------------------------------------------------------------------------------

The MIT License (MIT)

Copyright (c) 2013 Encapsule Project
  
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

# ****************************************************************************
# ****************************************************************************
#
#
module.exports = class AddressToken
    constructor: (model_, idExtensionPoint_, key_, idNamespace_) ->
        try
            # Save a reference to the specified model.
            @model = model_? and model_ or throw new Error("Missing object model input parameter.")

            # Now we work through the remaining parameters in reverse order.

            # Resolve the specified namespace's object model descriptor.
            if not idNamespace_? then throw new Error("Missing target namespace ID input parameter.")
            @idNamespace = idNamespace_
            @namespaceDescriptor = model_.implementation.getNamespaceDescriptorFromPathId(idNamespace_)

            # Resolve the specified namespace's component object model descriptor.
            @idComponent = @namespaceDescriptor.idComponent
            @componentDescriptor = model_.implementation.getNamespaceDescriptorFromPathId(@idComponent)

            @key =  (@componentDescriptor.id > 0) and key_? and key_ or undefined
            @keyRequired = false # may be overridden later in the constructor

            # If the token specifies the root component namespace, or any of the root component's subnamespaces
            # then @idExtensionPoint == -1 and @extensionPointDescriptor == undefined.
            @idExtensionPoint = idExtensionPoint_? and idExtensionPoint_ or -1
            @extensionPointDescriptor = undefined

            # If the AddressToken refers to the root component namespace, or any of its subnamespaces
            # it does not require a key to resolve because by definition it is unambiguously owned by
            # Store object.
            if @componentDescriptor.id == 0 then return

            # In all other cases the AddressToken refers to a namespace in an application component.
            # Application components are resolved via key lookup in the extension point collection specified
            # by @extensionPointId.
            @keyRequired = true

            # As a matter of policy we allow AddressToken to be constructed without explicit specification
            # of the containing application component's extension point ID iff it can be trivially deduced.
            if @idExtensionPoint == -1 and not @componentDescriptor.extensionPointReferenceIds.length
                # We can deduce the extension point ID because for this component there are no cyclic references
                # defined and thus the mapping of component to extension point ID's is 1:1 (child to parent respectively).
                @idExtensionPoint = @componentDescriptor.parent.id

            if not @idExtensionPoint
                # This component is a valid extension of more than one extension point.
                # Thus we must have the ID of the parent extension point in order to disambiguate.
                throw new Error("You must specify the ID of the parent extension point when creating a token addressing a '#{@componentDescriptor.path}' component namespace.")

            # Resolve the extension point's object model descriptor.
            @extensionPointDescriptor = @model.implementation.getNamespaceDescriptorFromPathId(@idExtensionPoint)

            # Exists.
            if not (@extensionPointDescriptor? and @extensionPointDescriptor)
                throw new Error("Internal error: unable to resolve extension point object model descriptor in request.")

            # Is an extension point.
            if @extensionPointDescriptor.namespaceType != "extensionPoint"
                throw new Error("Invalid selector key object specifies an invalid parent extension point ID. Not an extension point.")

            # Is an extension point that contains the correct application component type.
            if @extensionPointDescriptor.archetypePathId != @componentDescriptor.id
                throw new Error("Invalid selector key object specifies unsupported extension point / component ID pair.")

            return

        catch exception
            throw new Error("AddressToken failure: #{exception}")

    #
    # ============================================================================
    clone: =>
        new AddressToken(
            @model
            @extensionPointDescriptor? and @extensionPointDescriptor and @extensionPointDescriptor.id or -1
            @key
            @namespaceDescriptor.id
            )


    #
    # ============================================================================
    isEqual: (token_) =>
        try
            if not (token_? and token_) then throw new Error("Missing token input parameter.")
            result = (@idNamespace == token_.idNamespace) and (@key == token_.key) and (@idExtensionPoint == token_.idExtensionPoint)
            return result

        catch exception
            throw "isEqual failure: #{exception}"

    #
    # ============================================================================
    isQualified: => not @keyRequired or (@key? and @key) or false


    #
    # ============================================================================
    isRoot: => not @componentId

#
#
# ****************************************************************************
# ****************************************************************************
