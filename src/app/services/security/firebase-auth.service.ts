import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import 'rxjs/add/operator/first';
import { FirebaseAuth, User } from '@firebase/auth-types';
import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection,
  DocumentChangeAction
} from 'angularfire2/firestore';
import { DbRecordService } from '../db-record.service';

@Injectable()
export class FirebaseAuthService {
  isAuthenticated: boolean;
  user$: BehaviorSubject<any | User> = new BehaviorSubject<any | User>('');
  picture$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  userMetaData;
  // displayName$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  isAuthenticated$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  constructor(
    private fbAuth: AngularFireAuth,
    private router: Router,
    private db: DbRecordService
  ) {}

  login(email, password): Promise<any> {
    return this.fbAuth.auth.signInWithEmailAndPassword(email, password);
  }

  initAuthListener() {
    console.log('fb listener init');
    this.fbAuth.authState.subscribe(async user => {
      if (user) {
        console.log('auth listener: authenticated');
        this.isAuthenticated = true;
        this.isAuthenticated$.next(true);
        this.user$.next(user);

        this.userMetaData = await this.getUserMetadata(user.uid);
        console.dir(this.userMetaData);

        this.picture$.next(user.photoURL);
        // this.displayName$.next(user.displayName || user.email);
      } else {
        this.isAuthenticated = false;
        this.isAuthenticated$.next(false);
        console.log('auth listener: NOT authenticated');
        this.router.navigate(['app-login']);
      }
    });
  }

  async getUserMetadata(uid): Promise<any> {
    const val = await this.db
      .getFilteredRecordList('Users', 'ProviderUserId', uid)
      .first()
      .toPromise()
      .then(metadata => metadata);

    return val;
  }

  createUserWithEmailAndPassword(email, password) {
    this.fbAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then(result => {
        console.dir(result);
      })
      .catch(error => {
        console.error(error.message);
      });
  }

  logout() {
    this.fbAuth.auth.signOut();
  }

  loginWithGoogle() {
    this.fbAuth.auth
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then((user: FirebaseAuth) => {
        console.log(user);
        this.router.navigate(['memberlist']);
      });
  }
}
