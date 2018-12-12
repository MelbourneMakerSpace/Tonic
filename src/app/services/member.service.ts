import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { DocumentReference } from '@firebase/firestore-types';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { GmailService } from './email/gmail.service';
import { FirebaseAuthService } from './security/firebase-auth.service';
import { FirebaseAuth, User } from '@firebase/auth-types';

@Injectable()
export class MemberService {
  constructor(
    private db: AngularFirestore,
    private http: HttpClient,
    private gmail: GmailService,
    private auth: FirebaseAuthService
  ) {}

  getMemberList(): Observable<any> {
    return this.db
      .collection<Member>('Members')
      .snapshotChanges()
      .pipe(
        map(data => {
          return data.map(record => {
            const payload = record.payload.doc.data();
            const Key = record.payload.doc.id;
            return { Key, ...payload };
          });
        })
      );
  }

  getBalance(memberKey): Observable<number> {
    const url =
      environment.firebaseFunctionURL + 'getBalance?memberKey=' + memberKey;
    return this.http.get<number>(url);
  }

  getMemberPlans(memberKey): Observable<MemberPlan[]> {
    return this.db
      .collection<MemberPlan>('MemberPlans', ref =>
        ref.where('memberKey', '==', memberKey)
      )
      .snapshotChanges()
      .pipe(
        map(data => {
          return data.map(record => {
            const payload = record.payload.doc.data();
            console.dir(payload);
            const Key = record.payload.doc.id;
            return <MemberPlan>{ Key, ...payload };
          });
        })
      );
  }

  getPlan(key): Observable<MemberPlan> {
    return this.db
      .doc<MemberPlan>('MemberPlans/' + key)
      .snapshotChanges()
      .pipe(
        map(record => {
          const payload = record.payload.data();
          const Key = record.payload.id;
          return <MemberPlan>{ Key, ...payload };
        })
      );
  }

  savePlan(plan: MemberPlan): Promise<any> {
    console.log('Save Key', plan.Key);
    const key = plan.Key;
    delete plan.Key;
    if (key === 'New') {
      return this.db.collection('MemberPlans').add(plan);
    } else {
      return this.db.doc<MemberPlan>('MemberPlans/' + key).update(plan);
    }
  }

  // gets a filtered list, but is case sensative
  getFilteredMemberList(filter: string): Observable<any> {
    return this.db
      .collection<Member>('Members', ref =>
        ref.where('FirstName', '>=', filter)
      )
      .snapshotChanges()
      .pipe(
        map(data => {
          return data.map(record => {
            const payload = record.payload.doc.data();
            const Key = record.payload.doc.id;
            return { Key, ...payload };
          });
        })
      );
  }

  getMember(Key): Observable<any> {
    console.log('getting: ', `Members/${Key}`);
    return this.db
      .doc<Member>('Members/' + Key)
      .snapshotChanges()
      .pipe(
        map(record => {
          const payload = record.payload.data();
          // tslint:disable-next-line:no-shadowed-variable
          const Key = record.payload.id;
          return { Key, ...payload };
        })
      );
  }

  saveMember(member: Member): Promise<any> {
    console.log('Save Key', member.Key);
    const key = member.Key;
    delete member.Key;

    console.dir(member);
    if (key === 'New') {
      return this.db
        .collection('Members')
        .add(member)
        .then(result => {
          result.get().then(snapshot => {
            this.sendNotificationOfNewMember(member, snapshot.ref.id);
          });
        });
    } else {
      return this.db.doc<Member>('Members/' + key).update(member);
    }
  }

  async sendNotificationOfNewMember(member: Member, id: string) {
    let loggedInUser;

    const user = await this.auth.user$
      .pipe(take(1))
      .toPromise()
      .then((usr: User) => {
        loggedInUser = usr.displayName;
      });

    const subject = `${member.FirstName} ${
      member.LastName
    } has joined Melbourne Makerspace!`;
    const content = `
    ${member.FirstName} ${member.LastName}&lt;${member.email}&gt;<br>
    View member at <a href="${
      environment.SiteURL
    }/member/${id}">Tonic</a><br>Entered by ${loggedInUser}`;

    this.gmail.sendGmail(
      environment.AdminEmail,
      environment.AdminEmail,
      subject,
      content,
      true
    );
  }
}
