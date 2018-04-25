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

  saveMember(member) {
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
