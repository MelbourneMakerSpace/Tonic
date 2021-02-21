import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { take, map } from "rxjs/operators";
import { DocumentReference } from "@firebase/firestore-types";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { GmailService } from "./email/gmail.service";
import { Member } from "../entities/member";
import { MemberPlan } from "../entities/memberPlan";

@Injectable()
export class MemberService {
  constructor(
    private db: AngularFirestore,
    private http: HttpClient,
    private gmail: GmailService
  ) {}

  getMemberList(): Observable<Member[]> {
    return this.http.get<Member[]>(environment.TonicAPIURL + `member`);
  }

  getBalance(memberKey): Observable<number> {
    const url =
      environment.firebaseFunctionURL + "getBalance?memberKey=" + memberKey;
    return this.http.get<number>(url);
  }

  getMemberPlans(memberKey): Observable<MemberPlan[]> {
    return new Observable<MemberPlan[]>();
  }

  getPlan(key): Observable<MemberPlan> {
    return new Observable<MemberPlan>();
  }

  savePlan(plan: MemberPlan): Promise<any> {
    return Promise.resolve(null);

    // console.log("Save Key", plan.Key);
    // const key = plan.Key;
    // delete plan.Key;
    // if (key === "New") {
    //   return this.db.collection("MemberPlans").add(plan);
    // } else {
    //   return this.db.doc<MemberPlan>("MemberPlans/" + key).update(plan);
    // }
  }

  // gets a filtered list, but is case sensative
  getFilteredMemberList(filter: string): Observable<Member[]> {
    return new Observable<Member[]>();

    // return this.db
    //   .collection<Member>("Members", (ref) =>
    //     ref.where("FirstName", ">=", filter)
    //   )
    //   .snapshotChanges()
    //   .pipe(
    //     map((data) => {
    //       return data.map((record) => {
    //         const payload = record.payload.doc.data();
    //         const Key = record.payload.doc.id;
    //         return { Key, ...payload };
    //       });
    //     })
    //   );
  }

  getMember(Key): Observable<Member> {
    console.log("getting: ", `Members/${Key}`);
    return new Observable<Member>();

    // return this.db
    //   .doc<Member>("Members/" + Key)
    //   .snapshotChanges()
    //   .pipe(
    //     map((record) => {
    //       const payload = record.payload.data();
    //       // tslint:disable-next-line:no-shadowed-variable
    //       const Key = record.payload.id;
    //       return { Key, ...payload };
    //     })
    //   );
  }

  saveMember(member: Member): Promise<any> {
    console.log("Save Key", member.id);
    return Promise.resolve();

    // const key = member.Key;
    // delete member.Key;

    // console.dir(member);
    // if (key === "New") {
    //   return this.db
    //     .collection("Members")
    //     .add(member)
    //     .then((result) => {
    //       result.get().then((snapshot) => {
    //         this.sendNotificationOfNewMember(member, snapshot.ref.id);
    //       });
    //     });
    // } else {
    //   return this.db.doc<Member>("Members/" + key).update(member);
    // }
  }

  async sendNotificationOfNewMember(member: Member, id: string) {}
}
