function transaction_id_generator( len ) {
    var length = (len)?(len):(38);
    var string = "abcdefghijklmnopqrstuvwxyz"; //to upper 
    var numeric = '0123456789';
    var punctuation = '!@#$%';
    var transactionid = "";
    var character = "";
    var crunch = true;
    while( transactionid.length<length ) {
        entity1 = Math.ceil(string.length * Math.random()*Math.random());
        entity2 = Math.ceil(numeric.length * Math.random()*Math.random());
        entity3 = Math.ceil(punctuation.length * Math.random()*Math.random());
        hold = string.charAt( entity1 );
        hold = (transactionid.length%2==0)?(hold.toUpperCase()):(hold);
        character += hold;
        character += numeric.charAt( entity2 );
        character += punctuation.charAt( entity3 );
        transactionid = character;
    }
    transactionid=transactionid.split('').sort(function(){return 0.5-Math.random()}).join('');
    return transactionid.substring(0,len);
}

console.log( transaction_id_generator() );
var count1 = transaction_id_generator().length;
console.log( count1 );

// now plit transaction_id_generator() into 4 parts
// every 9 characters insert a dash
// example: 1fdcbea7-6358-4865-a8c4
 function regenerateWithDashes() {
    var newString = transaction_id_generator();
    var newStringWithDashes = '';
    for (var i = 0; i < newString.length; i++) {
        if (i % 9 == 0 && i != 0) {
            newStringWithDashes += '-';
        }
        newStringWithDashes += newString[i];
    }
    return newStringWithDashes;
}
console.log( regenerateWithDashes() );
// count the number of characters in the string of regenerateWithDashes()
var count2 = regenerateWithDashes().length;
console.log( count2 );