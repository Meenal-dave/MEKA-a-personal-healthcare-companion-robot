'use strict';

const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
const sgMail=require('@sendgrid/mail');

 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
process.env.SENDGRID_API_KEY='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';
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }
 
  function sendEmail(agent){
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const emailParam=agent.parameters.email;
    const msg = {
      to: emailParam, // Change to your recipient
      from: 'meenal.dave1999@gmail.com', // Change to your verified sender
      subject: 'Just a quick note',
      text: 'Just saying Hi from Dialogflow...',
      html: 'Just saying<strong>Hi from Dialogflow</strong>...',
    };
    console.log(msg);
    sgMail.send(msg);
    agent.add('Mail sent');
  }

  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('GetEmail',sendEmail);
  agent.handleRequest(intentMap);
});
