import * as functions from 'firebase-functions';
import { PaypalTransaction } from './models/PaypalTransaction';

exports.updatePaypal = functions.https.onRequest((req, res) => {
  const data: PaypalTransaction = JSON.parse(`{
    "transaction_details": [
        {
            "transaction_info": {
                "transaction_id": "9FK2436779680132L",
                "transaction_event_code": "T1900",
                "transaction_initiation_date": "2018-06-19T23:44:20+0000",
                "transaction_updated_date": "2018-06-19T23:44:20+0000",
                "transaction_amount": {
                    "currency_code": "USD",
                    "value": "2399.00"
                },
                "transaction_status": "S",
                "transaction_subject": "Populate paypal balance through developer portal",
                "ending_balance": {
                    "currency_code": "USD",
                    "value": "2399.00"
                },
                "available_balance": {
                    "currency_code": "USD",
                    "value": "2399.00"
                },
                "protection_eligibility": "02"
            },
            "payer_info": {
                "address_status": "N",
                "payer_name": {}
            },
            "shipping_info": {},
            "cart_info": {},
            "store_info": {},
            "auction_info": {},
            "incentive_info": {}
        },
        {
            "transaction_info": {
                "paypal_account_id": "HMSAVBWZ7SVCJ",
                "transaction_id": "8JJ65698M91909129",
                "transaction_event_code": "T0000",
                "transaction_initiation_date": "2018-06-20T00:17:18+0000",
                "transaction_updated_date": "2018-06-20T00:17:18+0000",
                "transaction_amount": {
                    "currency_code": "USD",
                    "value": "25.00"
                },
                "fee_amount": {
                    "currency_code": "USD",
                    "value": "-1.03"
                },
                "transaction_status": "S",
                "ending_balance": {
                    "currency_code": "USD",
                    "value": "2422.97"
                },
                "available_balance": {
                    "currency_code": "USD",
                    "value": "2422.97"
                },
                "protection_eligibility": "01"
            },
            "payer_info": {
                "account_id": "HMSAVBWZ7SVCJ",
                "email_address": "admin@melbournemakerspace.org",
                "address_status": "N",
                "payer_status": "Y",
                "payer_name": {}
            },
            "shipping_info": {
                "address": {
                    "line1": "1 Main St",
                    "city": "San Jose",
                    "country_code": "US",
                    "postal_code": "95131"
                }
            },
            "cart_info": {},
            "store_info": {},
            "auction_info": {},
            "incentive_info": {}
        }
    ],
    "account_number": "WV3944EFADS8J",
    "start_date": "2018-06-01T07:00:00+0000",
    "end_date": "2018-06-30T08:59:59+0000",
    "last_refreshed_datetime": "2018-06-30T08:59:59+0000",
    "page": 1,
    "total_items": 2,
    "total_pages": 1,
    "links": [
        {
            "href": "https://api.sandbox.paypal.com/v1/reporting/transactions?start_date=2018-06-01T00%3A00%3A00-0700&end_date=2018-07-01T00%3A00%3A00-0700&fields=all&page_size=500&page=1",
            "rel": "self",
            "method": "GET"
        }
    ]
}`);

  let output: string;

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
