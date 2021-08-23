<script>
window.dataLayer = window.dataLayer || [];
dataLayer.push({
  event': 'transaction',
  ecommerce: {
    purchase: {
      actionField: {
        userId: 'U12345',         // User ID if it is available. Map with Account ID
        id: 'T12345',       // Transaction ID. Required for purchases and refunds. Currently we will use random number
        affiliation: '',    // Name if it is available
        revenue: '0.00',    // Required. Total of products prices below.
        coupon: ''          // Coupon Name or ID if it is available
      },
      products: [{
        brand: 'PostScan Mail',   // Required.
        name: 'Mailbox',          // Required. Use "Mailbox" as a name.
        category: 'Starter',      // Required. Selected Plan Name. Insert one of the following: Free, Pay-As-You-Go, Basic, Starter, Standard, Premium
        id: '25',                 // Required. Selected Plan ID
        plan: 'Starter',          // Required. dimmnesion1. Selected Plan Name. Insert one of the following: Free, Pay-As-You-Go, Basic, Starter, Standard, Premium
        price: '15.00',           // Required. Selected Plan Amount
        storeId: '6',             // Required. dimmnesion2. Selected Sub- Store ID
        address: 'Anaheim CA',    // Required. dimmnesion3. Selected Store City and State
        quantity: 1               // Required.
       }],
      
      customer: {
                  email: '{{yourEmailVariable}}', //Change yourEmailVariable to the actual Javascript variable name where you are storing the user’s email data. Do the same for the other variables below. Make sure the values are not hashed
                  phone_number: '{{yourPhoneVariable}}',
                  first_name: '{{yourFirstNameVariable}}',
                  last_name: '{{yourLastNameVariable}}',
                  home_address: {
                                  street: '{{yourStreetAddressVariable}}',
                                  city:'{{yourCityVariable}}',
                                  region: '{{yourRegionVariable}},
                                  postal_code: '{{yourPostalCodeVariable}}',
                                  country: '{{yourCountryVariable}}'
                                }
                } 

    }
  }
});
</script>
