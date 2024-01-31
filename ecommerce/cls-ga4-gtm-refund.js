// GA4 Refund Using Google Tag Manager
// https://developers.google.com/analytics/devguides/collection/ga4/ecommerce?client_type=gtm#refund-gtm
// Convert all child values of the items to uppercase
dataLayer.push({ ecommerce: null });  // Clear the previous ecommerce object.
//window.dataLayer = window.dataLayer || [];
dataLayer.push({
event: 'refund',
    ecommerce:{
      currency: 'USD', // Required. Currency of the transaction.
      transaction_id: '1fdcbea7-6358-4865-a8c4-fab1eee51ed2', // Required. Unique ID for the refund transaction.
      value: 40.00, // Required. Total of products prices below.
      tax: 0.00,  // Tax amount if it is available
      shipping: 0.00, // Shipping amount if it is available
      coupon: '', // Coupon Name or ID if it is available
            items: [{
            item_id: 'PRINTTOCARD', // no space, data from source code: SX = new Map([[gX.FDLE, "Florida Fingerprint Service"], [gX.PRINTTOCARD, "Finger print Service"], [gX.FBI, "FBI Fingerprint Service"], [gX.CA, "California Fingerprint Service"]])
            item_brand: 'UPS STORE 125', 
            item_name: 'BOOKING', 
            item_category: 'STERLING',
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
            }]


}});
