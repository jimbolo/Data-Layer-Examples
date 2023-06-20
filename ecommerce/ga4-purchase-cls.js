// GA4 Purchase Reference:
// https://developers.google.com/analytics/devguides/collection/ga4/ecommerce?client_type=gtm#purchase-gtm
// https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtm#purchase

dataLayer.push({ ecommerce: null });  // Clear the previous ecommerce object.
//window.dataLayer = window.dataLayer || [];
dataLayer.push({
event: 'purchase',
    ecommerce:{
        user_id: 'Uid12345',    // User ID if it is available. Specifies a known identifier for a user provided by the site owner/library user. 
                                // It must not itself be PII (personally identifiable information). The value should never be persisted in Google Analytics cookies or other Analytics provided storage.
                                // (Character Limit 256 and Type String)
        transaction_id: '1fdcbea7-6358-4865-a8c4-fab1eee51ed2', // Required. Unique ID for the transaction.
        affiliation: '', // Name if it is available
        value: 40.00, // Required. Total of products prices below.
        tax: 0.00,  // Tax amount if it is available
        shipping: 0.00, // Shipping amount if it is available
        currency: 'USD', // Required. Currency of the transaction.
        coupon: '', // Coupon Name or ID if it is available
            items: [{   item_id: 'inkcard_national', // Required. exp "FDLE Fingerprinting" or "FBI Fingerprinting"
            item_brand: 'UPS Store 125', // Required.
            item_name: 'Certifix Booking', // Required.
            item_category: 'Sterling', // Required.
            item_category2: 'Ink Card',
            item_category3: '',
            item_variant: '',
            item_list_id: '', //related_products
            item_list_name: '', //Related Products
            affiliation: '',
            coupon: '',
            discount: 0.00,
            price: 40.00, // Required.
            quantity: 1, // Required.
            store_id: 'UPSSTORE125', // Required.
            store_address: 'Anaheim CA' // Required. Store City and State
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
