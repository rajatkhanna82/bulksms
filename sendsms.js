// Twilio Credentials
var accountSid = 'AC31f6bfdf11b93a2c32dc6f63455a92ab';
var authToken = 'd163406b0ba3d3ff977cc4a2bba4d82f';

//require the Twilio module and create a REST client
var client = require('twilio')(accountSid, authToken);
var phone = require('phone');
var csv = require('csv-array');
var args = require('minimist')(process.argv.slice(2));
var contacts = [];
var fromList = [];
var timeInterval = args.t || 2000; // 2 seconds
var i = 0;

var message = function (name) {
   return "This is a trial message from Rajat to "+ name +" tell me if it worked";
}


function sendSMS(from, to, name) {
   client.messages.create({
      to: to,
      from: from,
      body: message(name),
   }, function(err, message) {
      console.log(message.sid);
   });
}

function sendSMStoContacts (i) {
   fromList.forEach(function(from) {
      if(i < contacts.length) {
         sendSMS(from, contacts[i].phone, contacts[i].fname);
      }
      i++;
  })
  if(i < contacts.length) {setTimeout(sendSMStoContacts, timeInterval, i);}
};

csv.parseCSV('from.csv', (data)=> {
   data.forEach((val)=> {
      fromList.push(phone(val)[0]);
   })
});

csv.parseCSV('contacts.csv', (data)=> {
   data.forEach((val)=>{
      let pNo = phone(val.phone)[0];
      console.log(pNo);
      if(pNo) {
         contacts.push({
            fname: val.fname,
            phone: pNo
         });
      }
   })

   sendSMStoContacts(0)
});

