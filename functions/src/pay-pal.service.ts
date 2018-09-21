import * as functions from 'firebase-functions';
import { PaypalTransaction } from './models/PaypalTransaction';

import * as WebRequest from 'web-request';

exports.updatePaypal = functions.https.onRequest(async (req, res) => {
  let output: string = '';

  const token = await getPaypalToken();

  console.log('New Token:', token);

  const data: PaypalTransaction = await getPaypalData(token);

  data.transaction_details.forEach(transaction => {
    output += '\n---------------------------------------';
    output += '\nId:' + transaction.transaction_info.transaction_id;
    output +=
      '\ndate:' + transaction.transaction_info.transaction_initiation_date;
    output +=
      '\nAmount:' + transaction.transaction_info.transaction_amount.value;
    output += '\nemail:' + transaction.payer_info.email_address;
    output += '\nname:' + JSON.stringify(transaction.payer_info.payer_name);
  });

  res.send(output);
});

async function getPaypalData(token: string) {
  const endDate: Date = new Date(Date.now());
  const startDate: Date = new Date();
  startDate.setDate(endDate.getDate() - 31);

  const payPalStartDate =
    startDate.getFullYear() +
    '-' +
    (startDate.getMonth() + 1) +
    '-' +
    startDate.getDate();

  const payPalEndDate =
    endDate.getFullYear() +
    '-' +
    (endDate.getMonth() + 1) +
    '-' +
    endDate.getDate();

  console.log(payPalStartDate, '-', payPalEndDate);

  return await WebRequest.get(
    `https://api.sandbox.paypal.com/v1/reporting/transactions?start_date=${payPalStartDate}T00:00:00-0500&end_date=${payPalEndDate}T00:00:00-0500&fields=all&page_size=500`,
    {
      headers: {
        Authorization: 'Bearer  ' + token,
        'Content-Type': 'application/json'
      },
      json: true
    }
  )
    .then(res => {
      return res.message['body'];
    })
    .catch(error => error);
}

async function getPaypalToken() {
  const btoa = require('btoa');

  const result: string = await WebRequest.post(
    'https://api.sandbox.paypal.com/v1/oauth2/token',
    {
      // auth: {
      //     user: 'AfC5vSBIzlgl1p58W8TgOUKVEtdaE5CrSsOUZPAVt05Ij15WIbF8U1xxPBdd4oxX0E3iimcZgZiglB-I',
      //     password: 'EPe7fHtR5PsCDotwXbROerhHmMxCKgGReESV7Kh6hMUD7dgpWbDOEbU4IaGPxk91E4-xQWxNaS8NkExH',
      //     sendImmediately: false
      // }
      headers: {
        Authorization:
          'Basic ' +
          btoa(
            'AfC5vSBIzlgl1p58W8TgOUKVEtdaE5CrSsOUZPAVt05Ij15WIbF8U1xxPBdd4oxX0E3iimcZgZiglB-I:EPe7fHtR5PsCDotwXbROerhHmMxCKgGReESV7Kh6hMUD7dgpWbDOEbU4IaGPxk91E4-xQWxNaS8NkExH'
          )
        //,'Content-Type': 'application/x-www-form-urlencoded'
      },
      form: {
        grant_type: 'client_credentials'
      },
      json: true
    }
  )
    .then(res => {
      return res.content['access_token'] || res.content['error_description'];
    })
    .catch(error => error);

  return result;
}
