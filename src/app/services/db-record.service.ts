import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { take } from 'rxjs/operators/take';
import { DocumentReference } from '@firebase/firestore-types';
@Injectable()
export class DbRecordService {
  constructor(private db: AngularFirestore) {}

  saveRecord(record, collectionName): Promise<any> {
    const key = record.Key;
    delete record.Key;

    if (key === 'New') {
      return this.db.collection(collectionName).add(record);
    } else {
      return this.db.doc(collectionName + '/' + key).update(record);
    }
  }

  getFilteredRecordList(
    collectionName,
    FilterField,
    FilterValue
  ): Observable<any> {
    return this.db
      .collection(collectionName, ref =>
        ref.where(FilterField, '==', FilterValue)
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

  getRecordList(collectionName): Observable<any> {
    return this.db
      .collection(collectionName)
      .snapshotChanges()
      .map(data => {
        return data.map(record => {
          const payload = record.payload.doc.data();
          const Key = record.payload.doc.id;
          return { Key, ...payload };
        });
      });
  }

  getRecord(Key, collectionName): Observable<any> {
    return this.db
      .doc(collectionName + '/' + Key)
      .snapshotChanges()
      .map(record => {
        const payload = record.payload.data();
        // tslint:disable-next-line:no-shadowed-variable
        const Key = record.payload.id;
        return { Key, ...payload };
      });
  }
}
