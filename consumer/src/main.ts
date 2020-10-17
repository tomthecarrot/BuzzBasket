// BuzzBasket //
// Sam Roquitte, Cameron Bennett, Thomas Suarez, Noah Weinstein
// HackGT 7 //

import express from 'express';
import twilio from 'twilio';
import { PORT, defaultRecipient, merchantName, twilioAccountSid, twilioAuthToken } from './config/constants';

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
    res.send("Welcome to BuzzBasket!");
});

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