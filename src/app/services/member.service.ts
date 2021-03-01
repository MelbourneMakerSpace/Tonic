import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { DocumentReference } from '@firebase/firestore-types';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { GmailService } from './email/gmail.service';
import { Member } from '../entities/member';
import { MemberPlan } from '../entities/memberPlan';

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
      environment.firebaseFunctionURL + 'getBalance?memberKey=' + memberKey;
    return this.http.get<number>(url);
  }

  getMemberPlans(memberKey): Observable<MemberPlan[]> {
    return this.http.get<MemberPlan[]>(
      environment.TonicAPIURL + 'member/plans/' + memberKey
    );
  }

  getPlan(Id): Observable<MemberPlan> {
    return this.http.get<MemberPlan>(environment.TonicAPIURL + 'plan/' + Id);
  }

  savePlan(plan: MemberPlan): Promise<any> {
    console.log('saving plan', plan);
    return this.http
      .post(environment.TonicAPIURL + 'plan/memberplan', plan)
      .toPromise();
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

  getMember(id): Observable<Member> {
    console.log('getting: ', `Members/${id}`);
    return this.http.get<Member>(environment.TonicAPIURL + `member/` + id);
  }

  saveMember(member: Member): Observable<any> {
    console.dir('saving', member);

    if (member.id == 'New') {
      return this.http.post<Member>(environment.TonicAPIURL + 'member', member);
      //      this.sendNotificationOfNewMember(member, snapshot.ref.id);
    } else {
      return this.http.put<Member>(environment.TonicAPIURL + 'member', member);
    }
  }

  async sendNotificationOfNewMember(member: Member, id: string) {}
}
