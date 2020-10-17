// BuzzBasket //
// Sam Roquitte, Cameron Bennett, Thomas Suarez, Noah Weinstein
// HackGT 7 //

import express from 'express';
import twilio from 'twilio';
import { PORT, defaultRecipient, merchantName, twilioAccountSid, twilioAuthToken } from './config/constants';

// Firebase
var firebase = require("firebase");

var firebaseConfig = {
    apiKey: "AIzaSyCUTUfJqRu_1LzZM56Tko5yha1SgwICIT8",
    authDomain: "buzzbotstore.firebaseapp.com",
    databaseURL: "https://buzzbotstore.firebaseio.com",
    projectId: "buzzbotstore",
    storageBucket: "buzzbotstore.appspot.com",
    messagingSenderId: "46608851551",
    appId: "1:46608851551:web:d6e73c14546acada8271ea",
    measurementId: "G-WLL541SSP0"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database();

// Twilio
const tw = twilio(twilioAccountSid, twilioAuthToken);
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser = require('body-parser');

// Express
const exp = express();
// exp.use(express.json());
exp.use(bodyParser.urlencoded({ extended: false }));

exp.listen(PORT, '0.0.0.0', 0, () => {
    console.log(`Server is listening on port ${PORT}`);
});

exp.get('/', (req, res) => {
    res.send("Welcome to BuzzBasket! Tell us what baskets you're looking for?");
});

exp.post('/checkOptions',(req,res) => {
    var consumable = "Coffee";// req.url.split('/order/')[1]
    var options = [];
    database.ref('/' + consumable).once('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var childData = childSnapshot.val();
            options.push(childData.place);
            console.log(childData);
        })
    })
    var option1 = shuffle(options)[0];
    var option2 = shuffle(options)[0];
    res.send("This month, we have coffee baskets from " +  option1 + " or " + option2 + ".");
})

exp.post('/sms', (req, res) => {
    const inbound = req.body.Body;
    const outbound = buzzParse(inbound);
    const twiml = new MessagingResponse();
    twiml.message(outbound);
    res.send(twiml.toString());
});

exp.post('/voice', (req, res) => {
    console.log(req);
    res.send("TODO");
});

exp.get('/order*', (req, res) => {
    const itemName: string|undefined = req.url.split('/order/')[1];
    if (itemName == undefined || itemName.length == 0) {
        res.send("Please add an item name to order.");
        return;
    }
    res.send(`Ordered ${itemName}! Sending a confirmation text message...`);

    buzzSendConf(itemName);
});

function buzzSendConf(itemName: string): void {
    let message: string = `Thanks for ordering ${itemName}! We appreciate your business. - ${merchantName}`;
    console.log(message);
    tw.messages.create({
        body: message,
        from: '+16086802899',
        to: defaultRecipient
    }).then(message => {
        console.log(message.sid);
    });
}

function buzzParse(inbound: string): string {
    return `You said ${inbound}`;
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
}