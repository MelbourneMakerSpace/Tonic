// made by https://jvilk.com/MakeTypes/
export interface PaypalTransaction {
  transaction_details?: (TransactionDetailsEntity)[] | null;
  account_number: string;
  start_date: string;
  end_date: string;
  last_refreshed_datetime: string;
  page: number;
  total_items: number;
  total_pages: number;
  links?: (LinksEntity)[] | null;
}
export interface TransactionDetailsEntity {
  transaction_info: TransactionInfo;
  payer_info: PayerInfo;
  shipping_info: ShippingInfo;
  cart_info: PayerNameOrShippingInfoOrCartInfoOrStoreInfoOrAuctionInfoOrIncentiveInfo;
  store_info: PayerNameOrShippingInfoOrCartInfoOrStoreInfoOrAuctionInfoOrIncentiveInfo;
  auction_info: PayerNameOrShippingInfoOrCartInfoOrStoreInfoOrAuctionInfoOrIncentiveInfo;
  incentive_info: PayerNameOrShippingInfoOrCartInfoOrStoreInfoOrAuctionInfoOrIncentiveInfo;
}
export interface TransactionInfo {
  transaction_id: string;
  transaction_event_code: string;
  transaction_initiation_date: string;
  transaction_updated_date: string;
  transaction_amount: TransactionAmountOrEndingBalanceOrAvailableBalanceOrFeeAmount;
  transaction_status: string;
  transaction_subject?: string | null;
  ending_balance: TransactionAmountOrEndingBalanceOrAvailableBalanceOrFeeAmount;
  available_balance: TransactionAmountOrEndingBalanceOrAvailableBalanceOrFeeAmount;
  protection_eligibility: string;
  paypal_account_id?: string | null;
  fee_amount?: TransactionAmountOrEndingBalanceOrAvailableBalanceOrFeeAmount1 | null;
}
export interface TransactionAmountOrEndingBalanceOrAvailableBalanceOrFeeAmount {
  currency_code: string;
  value: string;
}
export interface TransactionAmountOrEndingBalanceOrAvailableBalanceOrFeeAmount1 {
  currency_code: string;
  value: string;
}
export interface PayerInfo {
  address_status: string;
  payer_name: PayerNameOrShippingInfoOrCartInfoOrStoreInfoOrAuctionInfoOrIncentiveInfo;
  account_id?: string | null;
  email_address?: string | null;
  payer_status?: string | null;
}
export interface PayerNameOrShippingInfoOrCartInfoOrStoreInfoOrAuctionInfoOrIncentiveInfo {}
export interface ShippingInfo {
  address?: Address | null;
}
export interface Address {
  line1: string;
  city: string;
  country_code: string;
  postal_code: string;
}
export interface LinksEntity {
  href: string;
  rel: string;
  method: string;
}
