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
        .then(() => __awaiter(this, void 0, void 0, function* () {
        // if (req.method !== 'POST') {
        //   const error = new Error('Only POST requests are accepted');
        //   // error.code = 405;
        //   throw error;
        // }
        const body = JSON.parse(req.body);
        admin.initializeApp(functions.config().firebase);
        const user = yield lookupUser(body.uid);
        console.log('user:', user.size);
        console.dir(user);
        //console.log('id:', role);
        console.log(body.uid);
        res.status(200).send(body);
    }))
        .catch(err => {
        res.status(500).send('there was an error processing the request');
    });
});
function lookupUser(uid) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield admin
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
    });
}
//# sourceMappingURL=userMetadata.js.map