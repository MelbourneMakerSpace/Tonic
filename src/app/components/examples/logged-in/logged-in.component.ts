import { Component, OnInit } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { FirebaseAuthService } from '../../../services/security/firebase-auth.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-logged-in',
  templateUrl: './logged-in.component.html',
  styles: []
})
export class LoggedInComponent implements OnInit {
  itemsFromSnapshot: Observable<Item[]>;
  displayedColumns = ['Key', 'Item', 'Updated', 'Actions'];

  constructor(
    private db: AngularFirestore,
    private authService: FirebaseAuthService,
    private router: Router
  ) {
    // must map to get full data (Id, etc)
    this.itemsFromSnapshot = db
      .collection<Item>('ProtectedItems')
      .snapshotChanges()
      .pipe(
        map(data => {
          return data.map(record => {
            const payload = record.payload.doc.data() as Item;
            const Key = record.payload.doc.id;
            return { Key, ...payload };
          });
        })
      );
  }

  ngOnInit() {}

  addItem() {
    const itemsCollection = this.db.collection('ProtectedItems');
    const newItem: Item = new Item();
    newItem.item = 'newItem';
    itemsCollection.add({ Item: Date(), updated: Date() });
  }

  delete(Key: string) {
    console.log('deleting item', `ProtectedItems/${Key}`);
    this.db.doc<Item>(`ProtectedItems/${Key}`).delete();
  }

  update(Key: string) {
    this.db.doc<Item>(`ProtectedItems/${Key}`).update({ updated: Date() });
  }
}

class Item {
  Key: string;
  item: string;
  updated: string;
}
