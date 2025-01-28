/*
Support Documents:
https://support.google.com/google-ads/answer/13262500?#zippy=%2Cenable-enhanced-conversions-in-google-tag-manager-and-create-custom-javascript-variable%2Cidentify-and-define-your-enhanced-conversions-variables

To persist data layer variables between web pages,
call dataLayer.push() after the data layer has been instantiated on each page load,
and push the variables to the data layer.
If you want these data layer variables to be available to Tag Manager
when the container is loaded, add a dataLayer.push() call above the Tag Manager container code as shown below.

As a reminder, at least one of the following fields must be provided:
Email (preferred)
A phone number can also be provided as a standalone match key but is recommended to be sent along with an email.
Note that if your site doesn't collect one of those fields, remove the field entirely rather than leaving it blank. 

 If you decide to normalize and hash the data, follow the below instructions.
For normalization: Remove leading or trailing whitespaces. Convert the text to lowercase.

The phone number must be in E.164 format,
which means it must be 11 to 15 digits including a plus sign (+) prefix
and country code with no dashes, brackets or spaces. exp: +14155552671

For hash: Use hex SHA256. https://support.google.com/google-ads/answer/9004655

Validate your implementation using Chrome Developer Tools
https://support.google.com/google-ads/answer/13262500?#zippy=%2Cenable-enhanced-conversions-in-google-tag-manager-and-create-custom-javascript-variable%2Cidentify-and-define-your-enhanced-conversions-variables%2Cvalidate-your-implementation-using-chrome-developer-tools
*/
window.dataLayer = window.dataLayer || [];
dataLayer.push({
  'event': 'login',
  'customer_id': '1234567890',
  'visitor_type': 'customer', // or 'prospect'
  'email': 'yourEmailVariable ', 
  'phone_number': 'yourPhoneVariable ',
  // or use hashed values
  'sha256_email_address': 'yourNormalizedandHashedEmailVariable',
  'sha256_phone_number': 'yourNormalizedandHashedPhoneVariable'
});



(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXX');

