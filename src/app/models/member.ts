import { KeyedRecord } from "./keyedRecord";

export class Member extends KeyedRecord {
  FirstName: string;
  LastName: string;
  email: string;
  phone: string;
  status: string;
}
