import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

export function logKeyAccess(memberKey, logMessage) {
  admin
    .firestore()
    .collection("AccessLog")
    .add({
      timeStamp: Date.now(),
      memberKey: memberKey,
      message: logMessage
    });
}
