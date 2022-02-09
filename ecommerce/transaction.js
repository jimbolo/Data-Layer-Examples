//Measuring Purchases
//Ecommerce Measurement: purchase
//Accepts Data: id (Transaction ID), array of productFieldObjects
//Push your transaction details into the Data Layer using the purchase action, along with an event that will fire an enhanced ecommerce-enabled tag.
//In this example, the transaction details are known at the time the page loads, and will be sent with a pageview when the gtm.js script returns:

// Send transaction data with a pageview if available
// when the page loads. Otherwise, use an event when the transaction
// data becomes available.


dataLayer.push({ ecommerce: null });  // Clear the previous ecommerce object.
//window.dataLayer = window.dataLayer || [];
dataLayer.push({
  'event': 'transaction',
  'ecommerce': {
    'purchase': {
      'actionField':  {
                      'userId': 'U12345',    // User ID if it is available. Map with Account ID
                      'id': 'a2f6be76',      // Transaction ID. Required for purchases and refunds. Currently we will use random number
                      'affiliation': '',    // Name if it is available
                      'revenue': '0.00',    // Required. Total of products prices below.
                      'coupon': ''          // Coupon Name or ID if it is available
                    },
      'products':     [{
                      'brand': 'PostScan Mail',   // Required.
                      'name': 'Mailbox',          // Required. Use "Mailbox" as a name.
                      'category': 'Starter',      // Required. Selected Plan Name. Insert one of the following: Free, Pay-As-You-Go, Basic, Starter, Standard, Premium
                      'id': '25',                 // Required. Selected Plan ID
                      'plan': 'Starter',          // Required. dimmnesion1. Selected Plan Name. Insert one of the following: Free, Pay-As-You-Go, Basic, Starter, Standard, Premium
                      'price': '15.00',           // Required. Selected Plan Amount
                      'storeId': '6',             // Required. dimmnesion2. Selected Sub- Store ID
                      'address': 'Anaheim CA',    // Required. dimmnesion3. Selected Store City and State
                      'quantity': 1               // Required.
                   }],
      
      'customer':     {
                      'email': '{{yourEmailVariable}}', //Change yourEmailVariable to the actual Javascript variable name where you are storing the user’s email data. Do the same for the other variables below. Make sure the values are not hashed
                      'phone_number': '{{yourPhoneVariable}}',
                      'first_name': '{{yourFirstNameVariable}}',
                      'last_name': '{{yourLastNameVariable}}',
                      'home_address': {
                                      'street': '{{yourStreetAddressVariable}}',
                                      'city':'{{yourCityVariable}}',
                                      'region': '{{yourRegionVariable}}',
                                      'postal_code': '{{yourPostalCodeVariable}}',
                                      'country': '{{yourCountryVariable}}'
                                    }
                    }
              }
             }
});

//<!-- Google Tag Manager -->

//<!-- End Google Tag Manager  -->
