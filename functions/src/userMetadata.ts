import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as cors from "cors";
import * as moment from "moment";
import * as gcs from "@google-cloud/storage";
const fbauth = require("./fbauth");

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
            "there was an error processing the request " + JSON.stringify(err)
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
      .doc("Members/" + req.body.MemberKey)
      .set({ picture: req.body.fileData }, { merge: true })
      .then(result => {
        return res.status(200).send(JSON.stringify("OK"));
      })
      .catch(err => {
        return res.status(500).send(err);
      });
  });
});

async function getSumOfPayments(memberKey: string): Promise<number> {
  let sumOfPayments = 0;

  await admin
    .firestore()
    .collection("Transactions")
    .where("memberKey", "==", memberKey)
    .get()
    .then(async snapshot => {
      const test = await snapshot.forEach(record => {
        sumOfPayments += Number(record.data().amount);
      });
    });

  return sumOfPayments;
}

exports.getBalance = functions.https.onRequest(async (req, res) => {
  const corsHandler = cors({ origin: true });
  const memberKey = req.query.memberKey;
  let charges: number = 0;

  const result1 = await corsHandler(req, res, async () => {
    charges = await getSumOfCharges(memberKey);

    const balance = charges - (await getSumOfPayments(memberKey));
    res.send(balance.toString());
  });
  //res.send(balance.toString());
});

async function getSumOfCharges(memberKey) {
  let charges = 0;
  const result = await admin
    .firestore()
    .collection("MemberPlans")
    .where("memberKey", "==", memberKey)
    .get()
    .then(async snapshot => {
      const test = await snapshot.forEach(async plan => {
        const trackingDate = new Date(plan.data().startDate);

        const endDate = new Date(plan.data().endDate || Date.now());

        //console.log("end date:", endDate);

        let counter = 0;

        while (
          trackingDate <= endDate &&
          counter < 1000 //pretect against endless loop because dates are funky sometimes...
        ) {
          charges += plan.data().plan;
          //console.log(trackingDate, " " + plan.data().plan);
          trackingDate.setMonth(trackingDate.getMonth() + 1);
          counter++;
        }
      });
    });
  return charges;
}

exports.checkIfActiveByKeySerial = functions.https.onRequest(
  async (req, res) => {
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
        } else {
          res.status(500).json({
            error: "did not find exactly one key for key " + keySerial
          });
          throw Error("key serial number did not find exactly one key");
        }
      })
      .catch(ex => {
        res.status(500).json({ error: ex });
      });

    keyData.then(key => {
      checkIfActiveByMemberKey(key["memberKey"])
        .then(isActive => {
          res.send(isActive);
        })
        .catch(ex => {
          res.status(500).json(ex);
        });
    });
  }
);

async function checkIfActiveByMemberKey(memberKey): Promise<boolean> {
  console.log("checking active status for member:", memberKey);
  let maxBalance;

  try {
    const rate = await getMemberRate(memberKey);

    if (rate.plan === -1) {
      //they do not have a current rate plan
      return false;
    } else if (rate.plan === 0) {
      //automatic entry if they have a current rate plan that is $0 (free membership)
      return true;
    }

    //res.json(rate);
    maxBalance = rate.plan * 2; //we turn off a user if they are > 2 months overdue, so calculate 2 months.
    console.log("maxbalance:", maxBalance);
  } catch (ex) {
    console.error(ex);
    throw ex;
  }
  const totalCharges = await getSumOfCharges(memberKey);
  console.log("totalCharges:", totalCharges);
  const totalPayments = await getSumOfPayments(memberKey);
  console.log("totalPayments:", totalPayments);
  return totalCharges - totalPayments <= maxBalance;
}

async function getMemberRate(memberKey) {
  let rate;
  await admin
    .firestore()
    .collection("MemberPlans")
    .where("memberKey", "==", memberKey)
    .orderBy("endDate", "desc")
    .limit(1)
    .get()
    .then(async snapshot => {
      snapshot.forEach(async function(doc) {
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
  console.log("rate:", rate);
  return rate;
}

exports.boilerplate = functions.https.onRequest(async (req, res) => {
  const corsHandler = cors({ origin: true });
  const memberKey = req.query.memberKey;

  const result1 = await corsHandler(req, res, async () => {
    res.send("boilerplate");
  });
  res.send("boilerplate");
});

async function lookupUser(uid) {
  // if (!fbInstance) {
  //   fbInstance = admin.initializeApp(functions.config().firebase);
  // }
  return await admin
    .firestore()
    .collection("Users")
    .where("ProviderUserId", "==", uid)
    .get()
    .then(snapshot => {
      //   console.dir(snapshot);
      if (snapshot.size === 1) {
        //send the metadata object
        return snapshot.docs[0].data();
      } else {
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
}
