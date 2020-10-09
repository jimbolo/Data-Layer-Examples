<script>
window.dataLayer = window.dataLayer || [];
dataLayer.push({
  'event': 'transaction',
  'ecommerce': {
    'purchase': {
      'actionField': {
        'userId': '',         // User ID if it is available.
        'id': 'T12345',       // Transaction ID. Required for purchases and refunds.
        'affiliation': '',    // Name if it is available
        'revenue': '0.00',    // Required. Total of products prices below.
        'coupon': ''          // Coupon Name or ID if it is available
      },
      'products': [{
        'brand': 'PostScan Mail',   // Required.
        'name': 'Mailbox',          // Required.
        'category': 'Free',         // Required. Selected Plan Name. Insert one of the following: Free, Pay-As-You-Go, Basic, Starter, Standard, Premium
        'id': '25',                 // Required. Selected Plan ID
        'plan': 'Free',             // Required. dimmnesion1. Selected Plan Name. Insert one of the following: Free, Pay-As-You-Go, Basic, Starter, Standard, Premium
        'price': '0.00',            // Required. Selected Plan Amount
        'storeId': '6',             // Required. dimmnesion2. Selected Store ID
        'address': 'Anaheim CA',    // Required. dimmnesion3. Selected Store City and State
        'quantity': 1               // Required.
       }]
    }
  }
});
</script>
