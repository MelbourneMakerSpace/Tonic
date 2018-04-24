import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { take } from 'rxjs/operators/take';

@Injectable()
export class MemberService {
  constructor(private db: AngularFirestore) {}

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

  getMember(key): Observable<any> {
    console.log('getting: ', `Members/${key}`);
    return this.db
      .doc<Member>('Members/' + key)
      .snapshotChanges()
      .map(record => {
        const payload = record.payload.data();
        const Key = record.payload.id;
        return { Key, ...payload };
      });
  }
}
