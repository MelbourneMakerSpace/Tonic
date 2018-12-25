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
const fbauth = require("./fbauth");
const gmail = require("./gmail");
const logging = require("./logging");
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
                .send("there was an error processing the request " + JSON.stringify(err));
        });
    }));
});
exports.setMemberImage = functions.https.onRequest((req, res) => {
    const corsHandler = cors({ origin: true });
    corsHandler(req, res, () => __awaiter(this, void 0, void 0, function* () {
        //const uid = await fbauth.checkFirebaseToken(req, res);
        //console.log('Member Key', req.body.MemberKey);
        //save to user record (< 1mb)
        admin
            .firestore()
            .doc("Members/" + req.body.MemberKey)
            .set({ picture: req.body.fileData }, { merge: true })
            .then(result => {
            return res.status(200).send(JSON.stringify("OK"));
        })
            .catch(err => {
            return res.status(500).send(err);
        });
    }));
});
function getSumOfPayments(memberKey) {
    return __awaiter(this, void 0, void 0, function* () {
        let sumOfPayments = 0;
        yield admin
            .firestore()
            .collection("Transactions")
            .where("memberKey", "==", memberKey)
            .get()
            .then((snapshot) => __awaiter(this, void 0, void 0, function* () {
            const test = yield snapshot.forEach(record => {
                sumOfPayments += Number(record.data().amount);
            });
        }));
        return sumOfPayments;
    });
}
exports.getBalance = functions.https.onRequest((req, res) => __awaiter(this, void 0, void 0, function* () {
    const corsHandler = cors({ origin: true });
    const memberKey = req.query.memberKey;
    const result1 = yield corsHandler(req, res, () => __awaiter(this, void 0, void 0, function* () {
        res.send(yield getMemberBalance(memberKey));
    }));
}));
function getMemberBalance(memberKey) {
    return __awaiter(this, void 0, void 0, function* () {
        let charges = 0;
        charges = yield getSumOfCharges(memberKey);
        const balance = charges - (yield getSumOfPayments(memberKey));
        updateMemberBalanceDetails(memberKey, balance);
        return balance.toString();
    });
}
exports.getMemberBalance = getMemberBalance;
function updateMemberBalanceDetails(memberKey, balance) {
    return __awaiter(this, void 0, void 0, function* () {
        const rate = yield getMemberRate(memberKey);
        const balanceUpToDate = balance <= rate.plan * 2;
        admin
            .firestore()
            .doc("Members/" + memberKey)
            .update({
            balance: balance,
            balanceUpdated: Date.now(),
            balanceMaxAllowed: rate.plan * 2,
            balanceUpToDate: balanceUpToDate
        });
    });
}
function getSumOfCharges(memberKey) {
    return __awaiter(this, void 0, void 0, function* () {
        let charges = 0;
        const result = yield admin
            .firestore()
            .collection("MemberPlans")
            .where("memberKey", "==", memberKey)
            .get()
            .then((snapshot) => __awaiter(this, void 0, void 0, function* () {
            const test = yield snapshot.forEach((plan) => __awaiter(this, void 0, void 0, function* () {
                const trackingDate = new Date(plan.data().startDate);
                const endDate = new Date(plan.data().endDate || Date.now());
                //console.log("end date:", endDate);
                let counter = 0;
                while (trackingDate <= endDate &&
                    counter < 1000 //pretect against endless loop because dates are funky sometimes...
                ) {
                    charges += plan.data().plan;
                    //console.log(trackingDate, " " + plan.data().plan);
                    trackingDate.setMonth(trackingDate.getMonth() + 1);
                    counter++;
                }
            }));
        }));
        return charges;
    });
}
exports.checkIfActiveByKeySerial = functions.https.onRequest((req, res) => __awaiter(this, void 0, void 0, function* () {
    const corsHandler = cors({ origin: true });
    const keySerial = req.query.keySerial;
    const keyData = admin
        .firestore()
        .collection("MemberKeys")
        .where("keySerial", "==", keySerial)
        .where("status", "==", "Active")
        .limit(1)
        .get()
        .then(snapshot => {
        if (snapshot.size === 1) {
            return snapshot.docs[0].data();
        }
        else {
            const envelope = {
                to: functions.config().settings.admin_email,
                from: functions.config().settings.from_email,
                subject: "Invalid key serial",
                content: "did not find an active key for key serial number " + keySerial,
                isHTML: true
            };
            logging.logKeyAccess(keySerial, "did not find an active key for key serial number " + keySerial);
            gmail.sendGmail(envelope);
            throw Error("did not find an active key for key serial number " + keySerial);
        }
    })
        .catch(ex => {
        throw Error(ex);
    });
    keyData
        .then(key => {
        checkIfActiveByMemberKey(key["memberKey"])
            .then(isActive => {
            logging.logKeyAccess(keySerial, "Success");
            res.send(isActive);
        })
            .catch(ex => {
            const envelope = {
                to: functions.config().settings.admin_email,
                from: functions.config().settings.from_email,
                subject: "Key failure due to member balance",
                content: ex,
                isHTML: true
            };
            logging.logKeyAccess(keySerial, ex);
            gmail.sendGmail(envelope);
            res.status(200).json(false);
        });
    })
        .catch(ex => {
        console.error("ex:" + ex);
        res.status(200).json(false);
    });
}));
function checkIfActiveByMemberKey(memberKey) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("checking active status for member:", memberKey);
        let maxBalance;
        try {
            const rate = yield getMemberRate(memberKey);
            if (rate.plan === -1) {
                //they do not have a current rate plan
                throw new Error("member does not have a current rate plan");
            }
            else if (rate.plan === 0) {
                //automatic entry if they have a current rate plan that is $0 (free membership)
                return true;
            }
            //res.json(rate);
            maxBalance = rate.plan * 2; //we turn off a user if they are > 2 months overdue, so calculate 2 months.
            console.log("maxbalance:", maxBalance);
        }
        catch (ex) {
            console.error(ex);
            throw ex;
        }
        const totalCharges = yield getSumOfCharges(memberKey);
        console.log("totalCharges:", totalCharges);
        const totalPayments = yield getSumOfPayments(memberKey);
        console.log("totalPayments:", totalPayments);
        if (totalCharges - totalPayments <= maxBalance) {
            return true;
        }
        else {
            // tslint:disable-next-line:no-string-throw
            const error = `total charges: $${totalCharges} - total payments: $${totalPayments} = 
    $${totalCharges -
                totalPayments} <br> This is greater than the member's maximum 
    allowed balance of $${maxBalance}.`;
            throw error;
        }
    });
}
function getMemberRate(memberKey) {
    return __awaiter(this, void 0, void 0, function* () {
        let rate;
        yield admin
            .firestore()
            .collection("MemberPlans")
            .where("memberKey", "==", memberKey)
            .orderBy("endDate", "desc")
            .limit(1)
            .get()
            .then((snapshot) => __awaiter(this, void 0, void 0, function* () {
            snapshot.forEach(function (doc) {
                return __awaiter(this, void 0, void 0, function* () {
                    console.log("data:", JSON.stringify(doc.data()));
                    rate = doc.data();
                    //short circuit if endDate in the past
                    //console.log("endDate: ", rate.endDate, "now: ", Date.now());
                    if (rate.endDate !== "" && rate.endDate < Date.now()) {
                        console.log("end date is in the past!");
                        rate.plan = -1;
                    }
                });
            });
        }));
        console.log("rate:", rate);
        return rate;
    });
}
exports.boilerplate = functions.https.onRequest((req, res) => __awaiter(this, void 0, void 0, function* () {
    const corsHandler = cors({ origin: true });
    const memberKey = req.query.memberKey;
    const result1 = yield corsHandler(req, res, () => __awaiter(this, void 0, void 0, function* () {
        res.send("boilerplate");
    }));
    res.send("boilerplate");
}));
function lookupUser(uid) {
    return __awaiter(this, void 0, void 0, function* () {
        // if (!fbInstance) {
        //   fbInstance = admin.initializeApp(functions.config().firebase);
        // }
        return yield admin
            .firestore()
            .collection("Users")
            .where("ProviderUserId", "==", uid)
            .get()
            .then(snapshot => {
            //   console.dir(snapshot);
            if (snapshot.size === 1) {
                //send the metadata object
                return snapshot.docs[0].data();
            }
            else {
                //create the metadata object
                const newMetaData = { ProviderUserId: uid, Role: "Pending" };
                admin
                    .firestore()
                    .collection("Users")
                    .add(newMetaData);
                return newMetaData;
            }
        })
            .catch(err => {
            console.log("Error getting documents", err);
            throw err;
        });
    });
}
//# sourceMappingURL=userMetadata.js.map