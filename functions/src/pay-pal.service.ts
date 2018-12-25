import * as functions from "firebase-functions";
import { PaypalTransaction } from "./models/PaypalTransaction";
import { TonicTransaction } from "./models/TonicTransaction";
import * as admin from "firebase-admin";
import * as WebRequest from "web-request";
import * as userMetadata from "./userMetadata";

exports.updatePaypal = functions.https.onRequest(async (req, res) => {
  const output: string = "";

  const token = await getPaypalToken();

  const data: PaypalTransaction = await getPaypalData(token);

  data.transaction_details.forEach(async transaction => {
    if (
      +transaction.transaction_info.transaction_amount.value > 0 &&
      transaction.payer_info.account_id
      //only get transactions > 0 and we get an account ID
    ) {
      const memberKey = await getMemberKey(
        transaction.payer_info.email_address
      );

      const trans: TonicTransaction = {
        date: transaction.transaction_info.transaction_initiation_date,
        PaypalName: JSON.stringify(transaction.payer_info.payer_name),
        PaypalEmail: transaction.payer_info.email_address,
        amount: +transaction.transaction_info.transaction_amount.value,
        PaypalMemberId: JSON.stringify(
          transaction.payer_info.account_id || "no id"
        ),
        PaypalTransactionId: transaction.transaction_info.transaction_id,
        memberKey: memberKey
      };

      writeTransaction(trans);
      // output += '\n---------------------------------------';
      // output += '\nId:' + transaction.transaction_info.transaction_id;
      // output +=
      //   '\ndate:' + transaction.transaction_info.transaction_initiation_date;
      // output +=
      //   '\nAmount:' + transaction.transaction_info.transaction_amount.value;
      // output += '\nemail:' + transaction.payer_info.email_address;
      // output += '\nname:' + JSON.stringify(transaction.payer_info.payer_name);
      // output +=
      //   '\nId:' + JSON.stringify(transaction.payer_info.account_id || 'no id');
    }
  });

  res.send("completed: " + Date.now().toString());
});

async function getMemberKey(paypalEmail: string): Promise<string> {
  const db = admin.firestore();

  const key = db
    .collection("Members")
    .where("paypalEmail", "==", paypalEmail)
    .get()
    .then(member => {
      if (member.size === 1) {
        return member.docs[0].id.toString();
      } else {
        return "orphan";
      }
    })
    .catch(exception => {
      console.error("exception:", exception);
      return "orphan exception:" + exception;
    });

  return key;
}

async function writeTransaction(trans: TonicTransaction) {
  const db = admin.firestore();

  const docref = await db
    .collection("Transactions")
    .doc(trans.PaypalTransactionId);

  docref
    .set({
      date: new Date(trans.date),
      paypalName: trans.PaypalName,
      paypalEmail: trans.PaypalEmail,
      description: "Paypal Transaction",
      method: "Paypal",
      amount: trans.amount,
      paypalMemberId: trans.PaypalMemberId,
      confirmation: trans.PaypalTransactionId,
      memberKey: trans.memberKey
    })
    .then(() => {
      userMetadata.getMemberBalance(trans.memberKey); //find and update the member's balance
    });
}

async function getPaypalData(token: string): Promise<PaypalTransaction> {
  const endDate: Date = new Date(Date.now());
  const startDate: Date = new Date();
  startDate.setDate(endDate.getDate() - 31);

  const payPalStartDate =
    startDate.getFullYear() +
    "-" +
    (startDate.getMonth() + 1) +
    "-" +
    startDate.getDate();

  const payPalEndDate =
    endDate.getFullYear() +
    "-" +
    (endDate.getMonth() + 1) +
    "-" +
    endDate.getDate();

  return await WebRequest.get(
    //    `https://api.sandbox.paypal.com/v1/reporting/transactions?start_date=${payPalStartDate}T00:00:00-0500&end_date=${payPalEndDate}T00:00:00-0500&fields=all&page_size=500`,
    `https://api.paypal.com/v1/reporting/transactions?start_date=${payPalStartDate}T00:00:00-0500&end_date=${payPalEndDate}T00:00:00-0500&fields=all&page_size=500`,
    {
      headers: {
        Authorization: "Bearer  " + token,
        "Content-Type": "application/json"
      },
      json: true
    }
  )
    .then(res => {
      return res.message["body"];
    })
    .catch(error => error);
}

async function getPaypalToken() {
  const btoa = require("btoa");

  const result: string = await WebRequest.post(
    "https://api.paypal.com/v1/oauth2/token",
    {
      // auth: {
      //     user: 'AfC5vSBIzlgl1p58W8TgOUKVEtdaE5CrSsOUZPAVt05Ij15WIbF8U1xxPBdd4oxX0E3iimcZgZiglB-I',
      //     password: 'EPe7fHtR5PsCDotwXbROerhHmMxCKgGReESV7Kh6hMUD7dgpWbDOEbU4IaGPxk91E4-xQWxNaS8NkExH',
      //     sendImmediately: false
      // }

      //'AfC5vSBIzlgl1p58W8TgOUKVEtdaE5CrSsOUZPAVt05Ij15WIbF8U1xxPBdd4oxX0E3iimcZgZiglB-I:EPe7fHtR5PsCDotwXbROerhHmMxCKgGReESV7Kh6hMUD7dgpWbDOEbU4IaGPxk91E4-xQWxNaS8NkExH'

      headers: {
        Authorization:
          "Basic " +
          btoa(
            //'AfC5vSBIzlgl1p58W8TgOUKVEtdaE5CrSsOUZPAVt05Ij15WIbF8U1xxPBdd4oxX0E3iimcZgZiglB-I:EPe7fHtR5PsCDotwXbROerhHmMxCKgGReESV7Kh6hMUD7dgpWbDOEbU4IaGPxk91E4-xQWxNaS8NkExH'
            "AT1aT31gPmd4naH1g9GQjZc61tAT5NxlZMH_UEY9JoZ1DArnNDzflOSfSucdPbw8iTpcc6JtcBWZib2z:EDYwfk4DydTv_g_n0VZgOn_MFtxOut7hVgwg1g47LuRL7aMjbt6nmqcxGNx49d2ILdYm6A9-w58qLnmP"
          )
        //,'Content-Type': 'application/x-www-form-urlencoded'
      },
      form: {
        grant_type: "client_credentials"
      },
      json: true
    }
  )
    .then(res => {
      return res.content["access_token"] || res.content["error_description"];
    })
    .catch(error => error);

  return result;
}
