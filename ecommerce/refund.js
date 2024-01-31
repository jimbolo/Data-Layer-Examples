// GA4 Refund Using Google Tag Manager
// https://developers.google.com/analytics/devguides/collection/ga4/ecommerce?client_type=gtm#purchase-gtm
// https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtm#purchase

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
            item_id: 'inkcard_national', //  exp "FDLE Fingerprinting" or "FBI Fingerprinting"
            item_brand: 'UPS Store 125', 
            item_name: 'Certifix Booking', 
            item_category: 'Sterling',
            item_category2: 'Ink Card',
            item_category3: '',
            item_variant: '',
            item_list_id: '', // related_products
            item_list_name: '', // Related Products
            affiliation: '',
            coupon: '',
            discount: 0.00,
            price: 40.00,
            quantity: 1,
            store_id: 'UPSSTORE125',
            store_address: 'Anaheim CA' // Store City and State
            }]


}});
