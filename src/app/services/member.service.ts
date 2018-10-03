import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { take } from 'rxjs/operators/take';
import { DocumentReference } from '@firebase/firestore-types';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class MemberService {
  constructor(private db: AngularFirestore, private http: HttpClient) {}

  getMemberList(): Observable<any> {
    return this.db
      .collection<Member>('Members')
      .snapshotChanges()
      .map(data => {
        return data.map(record => {
          const payload = record.payload.doc.data();
          const Key = record.payload.doc.id;
          return { Key, ...payload };
        });
      });
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
      .map(data => {
        return data.map(record => {
          const payload = record.payload.doc.data();
          const Key = record.payload.doc.id;
          return <MemberPlan>{ Key, ...payload };
        });
      });
  }

  getPlan(key): Observable<MemberPlan> {
    return this.db
      .doc<MemberPlan>('MemberPlans/' + key)
      .snapshotChanges()
      .map(record => {
        const payload = record.payload.data();
        const Key = record.payload.id;
        return <MemberPlan>{ Key, ...payload };
      });
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
      .map(data => {
        return data.map(record => {
          const payload = record.payload.doc.data();
          const Key = record.payload.doc.id;
          return { Key, ...payload };
        });
      });
  }

  getMember(Key): Observable<any> {
    console.log('getting: ', `Members/${Key}`);
    return this.db
      .doc<Member>('Members/' + Key)
      .snapshotChanges()
      .map(record => {
        const payload = record.payload.data();
        // tslint:disable-next-line:no-shadowed-variable
        const Key = record.payload.id;
        return { Key, ...payload };
      });
  }

  saveMember(member: Member): Promise<any> {
    console.log('Save Key', member.Key);
    const key = member.Key;
    delete member.Key;

    console.dir(member);
    if (key === 'New') {
      return this.db.collection('Members').add(member);
    } else {
      return this.db.doc<Member>('Members/' + key).update(member);
    }
  }
}
