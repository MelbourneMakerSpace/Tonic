"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors");
const fbauth = require('./fbauth');
exports.getUserMetadata = functions.https.onRequest((req, res) => {
    const corsHandler = cors({ origin: true });
    corsHandler(req, res, () => __awaiter(this, void 0, void 0, function* () {
        const uid = yield fbauth.checkFirebaseToken(req, res);
        //console.log('userData:', uid);
        return Promise.resolve()
            .then(() => __awaiter(this, void 0, void 0, function* () {
            const user = yield lookupUser(uid)
                .then(metadata => {
                return metadata;
            })
                .catch(err => {
                console.log(err);
                res.status(500).send(err);
            });
            res.status(200).send(user);
        }))
            .catch(err => {
            res
                .status(500)
                .send('there was an error processing the request ' + JSON.stringify(err));
        });
    }));
});
exports.setMemberImage = functions.https.onRequest((req, res) => {
    const corsHandler = cors({ origin: true });
    corsHandler(req, res, () => __awaiter(this, void 0, void 0, function* () {
        //const uid = await fbauth.checkFirebaseToken(req, res);
        //console.log('Member Key', req.body.MemberKey);
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
    }));
});
function lookupUser(uid) {
    return __awaiter(this, void 0, void 0, function* () {
        // if (!fbInstance) {
        //   fbInstance = admin.initializeApp(functions.config().firebase);
        // }
        return yield admin
            .firestore()
            .collection('Users')
            .where('ProviderUserId', '==', uid)
            .get()
            .then(snapshot => {
            //   console.dir(snapshot);
            if (snapshot.size === 1) {
                //send the metadata object
                return snapshot.docs[0].data();
            }
            else {
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
    });
}
//# sourceMappingURL=userMetadata.js.map