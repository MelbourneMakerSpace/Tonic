import { Member } from "./member";

export class AccessLog {
  id: string;

  //see https://typeorm.io/#/entities/column-types-for-mysql--mariadb for type options
  member: Member;

  message: string;

  timestamp: Date;
}
