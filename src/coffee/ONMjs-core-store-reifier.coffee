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

jslib = require('./encapsule-lib-javascript')
Namespace = require('./ONMjs-core-namespace')

#
# ****************************************************************************

module.exports = class StoreReifier
    constructor: (objectStore_) ->
        try

            @store = objectStore_

            # 
            # ============================================================================
            @dispatchCallback = (address_, callbackName_, observerId_) =>
                try
                    if observerId_? and observerId_
                        # Use the specified observer ID to obtain the callback interface  registered with the
                        # store and then dispatch the specified callback on that interface only.
                        callbackInterface = @store.implementation.observers[observerId_]
                        if not (callbackInterface? and callbackInterface)
                            throw new Error("Internal error: unable to resolve observer ID to obtain callback interface.");
                        callbackFunction = callbackInterface[callbackName_]
                        if callbackFunction? and callbackFunction
                            try
                                callbackFunction(@store, observerId_, address_)
                            catch exception
                                throw new Error("An error occurred in the '#{callbackName_}' method of your observer interface: #{exception.message}");
                    else
                        for observerId, callbackInterface of @store.implementation.observers
                            callbackFunction = callbackInterface[callbackName_]
                            if callbackFunction? and callbackFunction
                                try
                                    callbackFunction(@store, observerId, address_)
                                catch exception
                                    throw new Error("An error occurred in the '#{callbackName_}' method of your observer interface: #{exception.message}");

                catch exception
                    exceptionMessage = "dispatchCallback failure while processing " +
                        "address='#{address_.getHumanReadableString()}', callback='#{callbackName_}', observer='#{observerId_? and observerId_ or "[broadcast all]"}': #{exception.message}"
                    throw new Error(exceptionMessage);


            # 
            # ============================================================================
            @reifyStoreComponent = (address_, observerId_) =>
                try
                    if not (address_? and address_) then throw new Error("Internal error: Missing address input parameter.");

                    # Return immediately if there are no observers registered.
                    if not jslib.dictionaryLength(@store.implementation.observers) then return

                    dispatchCallback = @dispatchCallback
                    dispatchCallback(address_, "onComponentCreated", observerId_)
                    address_.visitSubaddressesAscending( (addressSubnamespace_) -> dispatchCallback(addressSubnamespace_, "onNamespaceCreated", observerId_) )

                    true # that

                catch exception
                    throw new Error("reifyStoreComponent failure: #{exception.message}");


            # 
            # ============================================================================
            @unreifyStoreComponent = (address_, observerId_) =>
                try

                    if not (address_? and address_) then throw new Error("Internal error: Missing address input parameter.");

                    # Return immediately if there are no observers registered.
                    if not jslib.dictionaryLength(@store.implementation.observers) then return

                    dispatchCallback = @dispatchCallback
                    address_.visitSubaddressesDescending( (addressSubnamespace_) -> dispatchCallback(addressSubnamespace_, "onNamespaceRemoved", observerId_) )
                    dispatchCallback(address_, "onComponentRemoved", observerId_)

                    true # that

                catch exception
                    throw new Error("unreifyStoreComponent failure: #{exception.message}");

            # 
            # ============================================================================
            @reifyStoreExtensions = (address_, observerId_, undoFlag_) =>
                try
                    if not (address_? and address_) then throw new Error("Internal error: Missing address input parameter.");

                    # Return immediately if there are no observers registered.
                    if not jslib.dictionaryLength(@store.implementation.observers) then return

                    dispatchCallback = @dispatchCallback

                    address_.visitExtensionPointAddresses( (addressExtensionPoint_) =>
                        extensionPointNamespace = new Namespace(@store, addressExtensionPoint_)
                        extensionPointNamespace.visitExtensionPointSubcomponents( (addressSubcomponent_) =>
                            if not undoFlag_
                                @reifyStoreComponent(addressSubcomponent_, observerId_)
                                @reifyStoreExtensions(addressSubcomponent_, observerId_, false)
                            else
                                @reifyStoreExtensions(addressSubcomponent_, observerId_, true)
                                @unreifyStoreComponent(addressSubcomponent_, observerId_)
                            true
                        )
                        true
                    )

                catch exception
                    throw new Error("reifyStoreExtensions failure: #{exception.message}");

        catch exception
            throw new Error("StoreReifier constructor failed: #{exception.message}");

