"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendGmail = void 0;
const functions = require("firebase-functions");
const nodemailer = require("nodemailer");
// gmail note:
// Set the gmail.emamail and gmail.password Google Cloud environment variables to match the email and password
// of the Gmail account used to send emails (or the app password if your account has 2-step verification enabled).
// For this use:
// firebase functions:config:set gmail.email="myusername@gmail.com" gmail.password="secretpassword"
exports.gmailEmail = functions.https.onRequest((req, res) => {
    return Promise.resolve()
        .then(() => {
        // if (req.method !== 'POST') {
        //   const error = new Error('Only POST requests are accepted');
        //   // error.code = 405;
        //   throw error;
        // }
        // get parameters from body
        const mailProperties = JSON.parse(req.body);
        console.dir(mailProperties);
        const response = sendGmail(mailProperties);
        console.log("done");
        res.send("done");
    })
        .then(response => {
        return response;
    })
        .catch(err => {
        console.error(err);
        return Promise.reject(err);
    });
});
function sendGmail(envelope) {
    // Configure the email transport using the default SMTP transport and a GMail account.
    // For Gmail, enable these:
    // 1. https://www.google.com/settings/security/lesssecureapps
    // 2. https://accounts.google.com/DisplayUnlockCaptcha
    // For other types of transports such as Sendgrid see https://nodemailer.com/transports/
    // TODO: Configure the `gmail.email` and `gmail.password` Google Cloud environment variables.
    //expects the following envelope
    // const envelope = {
    //   to: to,
    //   from: from,
    //   subject: subject,
    //   content: body,
    //   isHTML: isHTML
    // };
    const mailOptions = {
        from: `${envelope.from} <noreply@firebase.com>`,
        to: envelope.to,
        subject: envelope.subject
    };
    if (envelope.isHTML) {
        mailOptions["html"] = envelope.content;
    }
    else {
        mailOptions["text"] = envelope.content;
    }
    console.log("envelope:");
    console.dir(envelope);
    const gmailEmail = functions.config().gmail.email;
    const gmailPassword = functions.config().gmail.password;
    const mailTransport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: gmailEmail,
            pass: gmailPassword
        }
    });
    console.log("sending...");
    console.dir(mailOptions);
    const response = mailTransport.sendMail(mailOptions).then(result => {
        console.log(result);
        console.log("sent successfully!!");
    });
    return response;
}
exports.sendGmail = sendGmail;
//# sourceMappingURL=gmail.js.map