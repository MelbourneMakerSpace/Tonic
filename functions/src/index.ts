import * as functions from 'firebase-functions';
import * as sendgrid from 'sendgrid';
import * as admin from 'firebase-admin';
import * as cors from 'cors';

let fbInstance: admin.app.App;

if (!fbInstance) {
  fbInstance = admin.initializeApp(functions.config().firebase);
}

exports.updatePaypal = functions.https.onRequest((req, res) => {
  const corsHandler = cors({ origin: true });
  return corsHandler(req, res, () => {
    const funct = require('./pay-pal.service');
    return funct.updatePaypal(req, res);
  });
});

exports.checkIfActiveByKeySerial = functions.https.onRequest((req, res) => {
  const corsHandler = cors({ origin: true });
  return corsHandler(req, res, () => {
    const funct = require('./userMetaData');
    return funct.checkIfActiveByKeySerial(req, res);
  });
});

exports.getBalance = functions.https.onRequest((req, res) => {
  const corsHandler = cors({ origin: true });
  return corsHandler(req, res, () => {
    const funct = require('./userMetaData');
    return funct.getBalance(req, res);
  });
});

exports.setMemberImage = functions.https.onRequest((req, res) => {
  const corsHandler = cors({ origin: true });
  return corsHandler(req, res, () => {
    const funct = require('./userMetaData');
    return funct.setMemberImage(req, res);
  });
});

exports.gmailEmail = functions.https.onRequest((req, res) => {
  const corsHandler = cors({ origin: true });
  return corsHandler(req, res, () => {
    const gm = require('./gmail');
    return gm.gmailEmail(req, res);
  });
});

exports.getUserMetadata = functions.https.onRequest(
  (req: functions.Request, res: functions.Response) => {
    const funct = require('./userMetadata');
    return funct.getUserMetadata(req, res);
  }
);

exports.checkVariables = functions.https.onRequest((req, res) => {
  console.log(functions.config().gmail.email);
  console.log(functions.config().gmail.password);
  res.send('ok');
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

// exports.createNewUser = functions.auth
// .user()
// .onCreate((userRecord, context) => {
// // Get an object representing the current document
// // const newValue = snap.data;

// console.log('Data');
// console.dir(userRecord);
// const data = { userID: `${userRecord.uid}`, email: `${userRecord.email}` };
// console.dir(data);
// return admin
// .firestore()
// .collection(`UserProfiles`)
// .doc(`${userRecord.uid}`)
// .set(data);

// // return await admin.firestore().collection(`userProfile`).get().then(snapshot => {
// // console.log('snapshot');
// // console.dir(snapshot);
// // docRef.set(`{userID: ${userRecord.uid}, email:${userRecord.email}}`);
// // });
// // // .ref(`/userProfile/${newValue.uid}`)
// // // .set({ email: newValue.email });
// });
