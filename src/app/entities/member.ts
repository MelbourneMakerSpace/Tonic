import { AccessLog } from './accessLog';
import { MemberPlan } from './memberPlan';
import { Plan } from './plan';
import { Transaction } from './transaction';

export enum ROLES {
  MEMBER = 'member',
  ADMIN = 'admin',
}

export class Member {
  id: string;

  firstName: string;

  lastName: string;

  email: string;

  emergencyContact: string;

  emergencyEmail: string;

  emergencyPhone: string;

  password: string;

  phone: string;

  picture: string;

  status: string;

  statusReason: string;

  balance: number;

  role: ROLES;

  accessLog: AccessLog[];

  plans: Plan[];

  transactions: Transaction[];
}
