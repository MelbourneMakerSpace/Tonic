export interface TonicTransaction {
  amount: number;
  date: string;
  description?: string;
  PaypalTransactionId: string;
  PaypalMemberId: string;
  PaypalEmail: string;
  PaypalName: string;
  memberKey: string;
}
