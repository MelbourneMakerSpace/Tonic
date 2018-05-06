"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const sendgrid = require("sendgrid");
exports.checkVariables = functions.https.onRequest((req, res) => {
    console.log(functions.config().gmail.email);
    console.log(functions.config().gmail.password);
    res.send('ok');
});
const nodemailer = require('nodemailer');
// gmail note:
// Set the gmail.email and gmail.password Google Cloud environment variables to match the email and password
// of the Gmail account used to send emails (or the app password if your account has 2-step verification enabled).
// For this use:
// firebase functions:config:set gmail.email="myusername@gmail.com" gmail.password="secretpassword"
exports.gm = functions.https.onRequest((req, res) => {
    return Promise.resolve()
        .then(() => {
        if (req.method !== 'POST') {
            const error = new Error('Only POST requests are accepted');
            // error.code = 405;
            throw error;
        }
        // Configure the email transport using the default SMTP transport and a GMail account.
        // For Gmail, enable these:
        // 1. https://www.google.com/settings/security/lesssecureapps
        // 2. https://accounts.google.com/DisplayUnlockCaptcha
        // For other types of transports such as Sendgrid see https://nodemailer.com/transports/
        // TODO: Configure the `gmail.email` and `gmail.password` Google Cloud environment variables.
        // const gmailEmail = functions.config().gmail.email;
        // const gmailPassword = functions.config().gmail.password;
        const gmailEmail = 'tony.bellomo@gmail.com';
        const gmailPassword = 'lwsqbwvoxtsqkoyu';
        const mailTransport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: gmailEmail,
                pass: gmailPassword
            }
        });
        console.log('sending...');
        const email = 'ykvhveij@sharklasers.com';
        // Your company name to include in the emails
        // TODO: Change this to your app or company name to customize the email sent.
        const APP_NAME = 'Melbourne Makerspace';
        const mailOptions = {
            from: `${APP_NAME} <noreply@firebase.com>`,
            to: email,
            subject: `Welcome to ${APP_NAME}!`,
            text: `Hey! Welcome to ${APP_NAME}. this is a test from tonic.`
        };
        const response = mailTransport.sendMail(mailOptions).then(result => {
            console.log(result);
            console.log('sent successfully');
        });
        console.log('done');
        res.send('done');
    })
        .then(response => {
        return response;
    })
        .catch(err => {
        console.error(err);
        return Promise.reject(err);
    });
});
function parseBody(body) {
    const helper = sendgrid.mail;
    const fromEmail = new helper.Email(body.from);
    const toEmail = new helper.Email(body.to);
    const subject = body.subject;
    const content = new helper.Content('text/html', body.content);
    const mail = new helper.Mail(fromEmail, subject, toEmail, content);
    return mail.toJSON();
}
exports.sendgridEmail = functions.https.onRequest((req, res) => {
    const client = sendgrid(functions.config().sendgridemail.apikey);
    console.log('method:' + req.method);
    return Promise.resolve()
        .then(() => {
        if (req.method !== 'POST') {
            const error = new Error('Only POST requests are accepted');
            // error.code = 405;
            throw error;
        }
        const request = client.emptyRequest({
            method: 'POST',
            path: '/v3/mail/send',
            body: parseBody(JSON.parse(req.body))
        });
        return client.API(request);
    })
        .then(response => {
        if (response.body) {
            res.send(response.body);
        }
        else {
            res.end();
        }
    })
        .catch(err => {
        console.error(err);
        return Promise.reject(err);
    });
});
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
//# sourceMappingURL=index.js.map