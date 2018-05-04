import * as functions from 'firebase-functions';
import * as sendgrid from 'sendgrid';

const Gmail = require('./gmail');
exports.Gmail = functions.https.onRequest((req, res) => {
  Gmail.Gmail(req, res);
});

const client = sendgrid('YourKey');

function parseBody(body) {
  const helper = sendgrid.mail;

  const fromEmail = new helper.Email(body.from);
  const toEmail = new helper.Email(body.to);
  const subject = body.subject;
  const content = new helper.Content('text/html', body.content);
  const mail = new helper.Mail(fromEmail, subject, toEmail, content);
  return mail.toJSON();
}

exports.httpEmail = functions.https.onRequest((req, res) => {
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
      } else {
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
