/**
 * A function to handle a click on a checkout button. This function uses the eventCallback
 * data layer variable to handle navigation after the ecommerce data has been sent to Google Analytics.
 * https://developers.google.com/tag-manager/enhanced-ecommerce#checkoutstep
 */
function onCheckout1() {
window.dataLayer = window.dataLayer || [];
dataLayer.push({
'event':'checkout',
  'ecommerce': {
    'checkout': {
      'actionField': {'step': '1', 'option': 'account'},
      'products': [{
        'brand': 'PostScan Mail',   // Required.
        'name': 'Mailbox',          // Required.
        'category': 'Free',         // Required. Selected Plan Name. Insert one of the following: Free, Pay-As-You-Go, Basic, Starter, Standard, Premium
        'id': '25',                 // Required. Selected Plan ID
        'plan': 'Free',             // Required. Selected Plan Name. Insert one of the following: Free, Pay-As-You-Go, Basic, Starter, Standard, Premium
        'price': '0.00',            // Required. Selected Plan Amount
        'storeId': '6',             // Required. Selected Store ID
        'address': 'Anaheim CA',    // Required. Selected Store City and State
        'quantity': 1               // Required.
       }]
    }
  },
   'eventCallback': function() {
      document.location = '/registration?plan=25&store=6&address=1004';
   }
});
}

function onCheckout2() {
window.dataLayer = window.dataLayer || [];
dataLayer.push({
'event':'checkout',
  'ecommerce': {
    'checkout': {
      'actionField': {'step': '2', 'option': 'payment'},

    }
  },
   'eventCallback': function() {
  // We need to capture one of the following history variable and fire the function
  // event: 'gtm.historyChange-v2',
    // gtm.oldHistoryState: {navigationId: 1},
    // gtm.newHistoryState: {navigationId: 3},
    // gtm.oldUrl: 'https://app.postscanmail.com/registration?plan=25&store=6&address=1004',
    // gtm.newUrl: 'https://app.postscanmail.com/registration',

  //document.location = '/registration';
  //window.newHistoryState.navigationId = '3';
   }
});
}
