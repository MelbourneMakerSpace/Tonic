import { Component, OnInit } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
@Component({
  selector: 'app-firestore',
  templateUrl: './firestore.component.html',
  styleUrls: ['./firestore.scss']
})
export class FirestoreComponent implements OnInit {
  itemsFromSnapshot: Observable<Item[]>;
  items: Observable<Item[]>;

  constructor(private db: AngularFirestore) {
    // no typing, no metadata because of using .valuechanges
    // but can strongly type
    this.items = db.collection<Item>('SampleItems').valueChanges();

    // must map to get full data (Id, etc)
    this.itemsFromSnapshot = db
      .collection<Item>('SampleItems')
      .snapshotChanges()
      .map(data => {
        return data.map(record => {
          const payload = record.payload.doc.data() as Item;
          const Key = record.payload.doc.id;
          return { Key, ...payload };
        });
      });
  }

  ngOnInit() {}

  addItem() {
    const itemsCollection = this.db.collection('SampleItems');
    const newItem: Item = new Item();
    newItem.item = 'newItem';
    itemsCollection.add({ Item: Date(), updated: Date() });
  }

  delete(Key: string) {
    console.log('deleting item', `SampleItems/${Key}`);
    this.db.doc<Item>(`SampleItems/${Key}`).delete();
  }

  update(Key: string) {
    this.db.doc<Item>(`SampleItems/${Key}`).update({ updated: Date() });
  }
}

class Item {
  Key: string;
  item: string;
  updated: string;
}
