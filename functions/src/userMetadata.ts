import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as cors from 'cors';
import * as gcs from '@google-cloud/storage';
const fbauth = require('./fbauth');

exports.getUserMetadata = functions.https.onRequest((req, res) => {
  const corsHandler = cors({ origin: true });

  corsHandler(req, res, async () => {
    const uid = await fbauth.checkFirebaseToken(req, res);

    //console.log('userData:', uid);
    return Promise.resolve()
      .then(async () => {
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

exports.setMemberImage = functions.https.onRequest((req, res) => {
  const corsHandler = cors({ origin: true });

  corsHandler(req, res, async () => {
    //const uid = await fbauth.checkFirebaseToken(req, res);
    //console.log('Member Key', req.body.MemberKey);

    //save to user record (< 1mb)
    admin
      .firestore()
      .doc('Members/' + req.body.MemberKey)
      .set({ picture: req.body.fileData }, { merge: true })
      .then(result => {
        return res.status(200).send(JSON.stringify('OK'));
      })
      .catch(err => {
        return res.status(500).send(err);
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
        const newMetaData = { ProviderUserId: uid, Role: 'Pending' };
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
