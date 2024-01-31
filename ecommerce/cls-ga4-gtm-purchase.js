// GA4 Purchase Using Google Tag Manager:
// Convert all child values of the items to uppercase.

// https://developers.google.com/analytics/devguides/collection/ga4/ecommerce?client_type=gtm#purchase-gtm
// https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtm#purchase

dataLayer.push({ ecommerce: null });  // Clear the previous ecommerce object.
//window.dataLayer = window.dataLayer || [];
dataLayer.push({
event: 'purchase',
    ecommerce:{
        user_id: 'uid12345',    // User ID if it is available. Specifies a known identifier for a user provided by the site owner/library user. 
                                // It must not itself be PII (personally identifiable information). The value should never be persisted in Google Analytics cookies or other Analytics provided storage.
                                // (Character Limit 256 and Type String)
        transaction_id: '1fdcbea7-6358-4865-a8c4-fab1eee51ed2', // Required. Unique ID for the transaction.
        value: 40.00, // Required. Total of products prices below.
        tax: 0.00,  // Tax amount if it is available
        shipping: 0.00, // Shipping amount if it is available
        currency: 'USD', // Required. Currency of the transaction.
        coupon: '', // Coupon Name or ID if it is available
            items: [{
            item_id: 'PRINTTOCARD', // no space, data from source code: SX = new Map([[gX.FDLE, "Florida Fingerprint Service"], [gX.PRINTTOCARD, "Finger print Service"], [gX.FBI, "FBI Fingerprint Service"], [gX.CA, "California Fingerprint Service"]])
            item_brand: 'UPS STORE 125', 
            item_name: 'BOOKING', 
            item_category: 'STERLING', // ???
            item_category2: 'ANAHEIM', // Store City
            item_category3: 'CA', // Store State
            item_variant: '',
            item_list_id: '', // related_products
            item_list_name: '', // Related Products
            affiliation: '',
            coupon: '',
            discount: 0.00,
            price: 40.00,
            quantity: 1,
            store_id: 'UPSSTORE125', // not required
            store_address: 'ANAHEIM CA' // not required Store City and State
            }],

            customer: [{
            email: '{{yourEmailVariable}}', //Change yourEmailVariable to the actual Javascript variable name where you are storing the user’s email data. Do the same for the other variables below. Make sure the values are not hashed
            phone_number: '{{yourPhoneVariable}}',
            first_name: '{{yourFirstNameVariable}}',
            last_name: '{{yourLastNameVariable}}',
                home_address: {
                    street: '{{yourStreetAddressVariable}}',
                    city:'{{yourCityVariable}}',
                    region: '{{yourRegionVariable}}',
                    postal_code: '{{yourPostalCodeVariable}}',
                    country: '{{yourCountryVariable}}'
                }
            }]
}});
