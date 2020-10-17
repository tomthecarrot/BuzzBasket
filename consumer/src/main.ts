// BuzzBasket //
// Sam Roquitte, Cameron Bennett, Thomas Suarez, Noah Weinstein
// HackGT 7 //

import express from 'express';
import twilio from 'twilio';
import {
    PORT, defaultRecipient, merchantName,
    twilioAccountSid, twilioAuthToken,
    phraseInputs, phraseOutputs
} from './config/constants';

var currentItemName: string = "nothing";

// Twilio
const tw = twilio(twilioAccountSid, twilioAuthToken);
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const VoiceResponse = require('twilio').twiml.VoiceResponse;
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
    const twiml = new VoiceResponse();
    twiml.say({ voice: 'alice' }, `Thanks for calling BuzzBasket! Please text us to order something new from ${merchantName}. We're also working on your order for ${currentItemName}. Have a great day.`);
    
    // res.type('text/xml');
    res.send(twiml.toString());
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
    var name: string[] = [];
    var naming: boolean = false;
    var mainDirective: string|undefined = undefined;
    const tokens: string[] = inbound.split(' ');
    for (var i = 0; i < tokens.length; i++) {
        const phraseDirective: string | undefined = phraseInputs.get(tokens[i]);
        if (naming && phraseDirective == undefined && (mainDirective == "order" || mainDirective == "recommend")) {
            name.push(tokens[i]);
        } else {
            naming = false;
        }
        if (phraseDirective == "hello") {
            if (mainDirective == undefined) {
                mainDirective = phraseDirective;
            }
        } else if (phraseDirective == "order") {
            naming = true;
            mainDirective = phraseDirective;
        } else if (phraseDirective == "recommend") {
            naming = true;
            mainDirective = phraseDirective;
        }
    }

    if (mainDirective == "order") {
        const nameStr: string = name.join(' ');
        currentItemName = nameStr;
        return `Ordering ${nameStr}.`;
    }

    if (mainDirective != null) {
        const phraseOutput: string|undefined = phraseOutputs.get(mainDirective);
        if (phraseOutput != undefined) {
            return phraseOutput;
        }
    }
    
    return `You said ${inbound}`; // echo
}