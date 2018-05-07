import * as functions from 'firebase-functions';
import * as sendgrid from 'sendgrid';

const nodemailer = require('nodemailer');

// gmail note:
// Set the gmail.emamail and gmail.password Google Cloud environment variables to match the email and password
// of the Gmail account used to send emails (or the app password if your account has 2-step verification enabled).
// For this use:
// firebase functions:config:set gmail.email="myusername@gmail.com" gmail.password="secretpassword"
exports.gmailEmail = functions.https.onRequest((req, res) => {
  return Promise.resolve()
    .then(() => {
      if (req.method !== 'POST') {
        const error = new Error('Only POST requests are accepted');
        // error.code = 405;
        throw error;
      }

      // get parameters from body
      const mailProperties = JSON.parse(req.body);
      console.dir(mailProperties);

      // Configure the email transport using the default SMTP transport and a GMail account.
      // For Gmail, enable these:
      // 1. https://www.google.com/settings/security/lesssecureapps
      // 2. https://accounts.google.com/DisplayUnlockCaptcha
      // For other types of transports such as Sendgrid see https://nodemailer.com/transports/
      // TODO: Configure the `gmail.email` and `gmail.password` Google Cloud environment variables.
      const gmailEmail = functions.config().gmail.email;
      const gmailPassword = functions.config().gmail.password;

      console.log('gmail user;', gmailEmail);
      console.log(gmailPassword);

      const mailTransport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: gmailEmail,
          pass: gmailPassword
        }
      });
      console.log('sending...');

      const mailOptions = {
        from: `${mailProperties.from} <noreply@firebase.com>`,
        to: mailProperties.to,
        subject: mailProperties.subject,
        text: mailProperties.content
      };

      console.dir(mailOptions);

      const response = mailTransport.sendMail(mailOptions).then(result => {
        console.log(result);
        console.log('sent successfully!!');
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
