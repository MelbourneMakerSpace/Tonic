import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as cors from 'cors';
const fbauth = require('./fbauth');

//let fbInstance: admin.app.App;

exports.getUserMetadata = functions.https.onRequest((req, res) => {
  // if (!fbInstance) {
  //   fbInstance = admin.initializeApp(functions.config().firebase);
  // }

  const corsHandler = cors({ origin: true });
  // let token = '';
  // token = <string>req.headers.firebasetoken;

  // console.log('token:', token);

  corsHandler(req, res, async () => {
    const uid = await fbauth.checkFirebaseToken(req, res);

    //console.log('userData:', uid);
    return Promise.resolve()
      .then(async () => {
        // if (req.method !== 'POST') {
        //   const error = new Error('Only POST requests are accepted');
        //   // error.code = 405;
        //   throw error;
        // }
        //const body = JSON.parse(req.body);
        const user = await lookupUser(uid)
          .then(metadata => {
            return metadata;
          })
          .catch(err => {
            console.log(err);
            res.status(500).send(err);
          });

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
  // if (!fbInstance) {
  //   fbInstance = admin.initializeApp(functions.config().firebase);
  // }
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
