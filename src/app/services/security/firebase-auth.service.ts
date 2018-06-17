import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import 'rxjs/add/operator/first';
import { FirebaseAuth, User } from '@firebase/auth-types';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
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
  userMetaData$: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public userToken = '';
  // displayName$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  isAuthenticated$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  constructor(
    public fbAuth: AngularFireAuth,
    private router: Router,
    private db: DbRecordService,
    private http: HttpClient
  ) {}

  login(email, password): Promise<any> {
    return this.fbAuth.auth.signInWithEmailAndPassword(email, password);
  }

  initAuthListener() {
    this.fbAuth.authState.subscribe(async user => {
      if (user) {
        console.log('auth listener: authenticated');
        this.isAuthenticated = true;
        this.isAuthenticated$.next(true);
        this.user$.next(user);
        // user.getIdToken().then(token => (this.userToken = token));
        this.fbAuth.idToken.subscribe(async token => {
          this.userToken = token;
          await this.getUserMetadata().then(meta => {
            this.userMetaData$.next(meta);
            // console.dir(this.userMetaData$);
          });
          this.router.navigateByUrl('/memberlist');
        });

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

  async getUserMetadata(): Promise<any> {
    const url = environment.firebaseFunctionURL + 'getUserMetadata';

    return this.http
      .post(url, null)
      .toPromise()
      .then(
        res => res,
        err => {
          console.log(err);
        }
      );
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
