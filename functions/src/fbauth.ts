import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

exports.checkFirebaseToken = async (
  req: functions.Request,
  res: functions.Response
) => {
  let uid = '';

  await admin
    .auth()
    .verifyIdToken(<string>req.headers.firebasetoken)
    .then(async userToken => {
      //console.log('decoded token:', userToken);
      uid = userToken.uid;
      return uid;
    })
    .catch(err => {
      return res.status(401).send('Unauthorized');
    });

  return uid;
};
