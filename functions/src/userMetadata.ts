import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

exports.getUserMetadata = functions.https.onRequest((req, res) => {
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

      admin.initializeApp(functions.config().firebase);

      const user = await lookupUser(body.uid);

      console.log('user:', user.size);
      console.dir(user);

      //console.log('id:', role);
      console.log(body.uid);
      res.status(200).send(body);
    })
    .catch(err => {
      res.status(500).send('there was an error processing the request');
    });
});

async function lookupUser(uid) {
  return await admin
    .firestore()
    .collection('Users')
    .where('ProviderUserId', '==', uid)
    .get()
    .then(snapshot => {
      console.log('snapshot');
      console.dir(snapshot);
      return snapshot;
    })
    .catch(err => {
      console.log('Error getting documents', err);
      throw err;
    });
}
