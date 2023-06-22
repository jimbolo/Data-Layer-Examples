// GA4 reference:
// https://developers.google.com/analytics/devguides/collection/ga4/ecommerce?client_type=gtm#purchase-gtm
// https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtm#purchase

dataLayer.push({ ecommerce: null });  // Clear the previous ecommerce object.
//window.dataLayer = window.dataLayer || [];
dataLayer.push({
event: 'purchase',
    ecommerce:{
        user_id: 'uid12345', // User ID if it is available. Specifies a known identifier for a user provided by the site owner/library user. 
    // It must not itself be PII (personally identifiable information). The value should never be persisted in Google Analytics cookies or other Analytics provided storage.
    // (Character Limit 256 and Type String)
        transaction_id: '1fdcbea7-6358-4865-a8c4-fab1eee51ed2', // Required. Unique ID for the transaction.
        affiliation: '',    // Name if it is available
        value: 80.00,    // Required. Total of products prices below.
        tax: 0.00,       // Tax amount if it is available
        shipping: 0.00,  // Shipping amount if it is available
        currency: 'USD',   // Required. Currency of the transaction.
        coupon: '',          // Coupon Name or ID if it is available
            items: [{   
            item_id: 'inkcard_national', // Required. exp "FDLE Fingerprinting" or "FBI Fingerprinting"
            item_brand: 'UPS Store 125', // Required. Store Location Name
            item_name: 'Booking', // Required. Static value "Booking".
            item_category: 'Sterling', // Required. "Sterling" or "Certifix"
            // item_list_id: '', // Optional. related_products
            // item_list_name: '', // Optional Related Products
            affiliation: '', // Optional (Name of the store or affiliation)
            coupon: '', // Optional
            discount: '0.00', // Optional (Number)
            price: 80.00, // Required. (Number)
            quantity: 2, // Required. (Number)
            store_id: 'UPSSTORE125', // Required. Manually created GA4 dimension.
            store_address: 'Anaheim CA 00000' // Required. Store City and State. Manually created GA4 dimmnesion.
            }],

            customer: [{
            email: '{{yourEmailVariable}}', //Change yourEmailVariable to the actual Javascript variable name where you are storing the user’s email data. Do the same for the other variables below. Make sure the values are not hashed
            phone_number: '{{yourPhoneVariable}}',
            first_name: '{{yourFirstNameVariable}}',
            last_name: '{{yourLastNameVariable}}',
                home_address: {
                    street: '{{yourStreetAddressVariable}}',
                    city:'{{yourCityVariable}}',
                    region: '{{yourRegionVariable}}', // State or Province
                    postal_code: '{{yourPostalCodeVariable}}',
                    country: '{{yourCountryVariable}}'
                }
            }]
}});
