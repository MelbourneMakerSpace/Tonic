import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as cors from 'cors';

let fbInstance;

exports.getUserMetadata = functions.https.onRequest((req, res) => {
  const corsHandler = cors({ origin: true });
  corsHandler(req, res, () => {
    console.log('caller:', JSON.stringify(req.headers.authorization));
    //   if (
    //     (!req.headers.authorization ||
    //       !req.headers.authorization.startsWith('Bearer ')) &&
    //     !req.cookies.__session
    //   ) {
    //     console.error(
    //       'No Firebase ID token was passed as a Bearer token in the Authorization header.',
    //       'Make sure you authorize your request by providing the following HTTP header:',
    //       'Authorization: Bearer <Firebase ID Token>',
    //       'or by passing a "__session" cookie.'
    //     );
    //     res.status(403).send('Unauthorized');
    //     return;
    //   }

    return Promise.resolve()
      .then(async () => {
        // if (req.method !== 'POST') {
        //   const error = new Error('Only POST requests are accepted');
        //   // error.code = 405;
        //   throw error;
        // }
        const body = JSON.parse(req.body);

        const user = await lookupUser(body.uid);

        res.status(200).send(user);
      })
      .catch(err => {
        res
          .status(500)
          .send(
            'there was an error processing the request ' + JSON.stringify(err)
          );
      });
  });
});

async function lookupUser(uid) {
  if (!fbInstance) {
    fbInstance = admin.initializeApp(functions.config().firebase);
  }
  return await admin
    .firestore()
    .collection('Users')
    .where('ProviderUserId', '==', uid)
    .get()
    .then(snapshot => {
      //   console.dir(snapshot);
      if (snapshot.size === 1) {
        //send the metadata object
        return snapshot.docs[0].data();
      } else {
        //create the metadata object
        const newMetaData = { ProviderUserId: uid, Role: 'Disabled' };
        admin
          .firestore()
          .collection('Users')
          .add(newMetaData);
        return newMetaData;
      }
    })
    .catch(err => {
      console.log('Error getting documents', err);
      throw err;
    });
}
