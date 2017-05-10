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

var message = function (time, venue, cityphone) {
   return "Reminder for Yoga For Success session at "+ venue +" is today at " + time +". For information contact Isha Foundation at "+ cityphone + ".";
}

function sendSMS(from, to, st_time, venue, cityphone) {
    console.log(to + ":" +  message(st_time, venue, cityphone));
    client.messages.create({
       to: to,
       from: from,
       body: message(st_time, venue, cityphone ),
    }, function(err, message) {
       console.log(message.sid);
    });
}

function sendSMStoContacts (i) {
   fromList.forEach(function(from) {
      i++;
      if(i <= contacts.length) {
         sendSMS(from, contacts[i-1].phone, contacts[i-1].st_time, contacts[i-1].venue, contacts[i-1].cityphone);
      }
  })
  if(i < contacts.length) {setTimeout(sendSMStoContacts, timeInterval, i);}
};

csv.parseCSV('from.csv', (data)=> {
   data.forEach((val)=> {
      fromList.push(phone(val.from)[0]);
   })
});

csv.parseCSV('contacts.csv', (data)=> {
   data.forEach((val)=>{
      let pNo = phone(val.phone, val.country)[0];
      if(pNo) {
         console.log(pNo);
         contacts.push({
            phone: pNo,
            st_time: val.event_start_time,
            venue:  val.venue, 
            cityphone: val.cityphone 
         });
      }
   })

   sendSMStoContacts(0)
});

