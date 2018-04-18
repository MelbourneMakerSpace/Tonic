import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class FirebaseAuthService {
  isAuthenticated: boolean;
  isAuthenticated$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  constructor(private fbAuth: AngularFireAuth, private router: Router) {}

  login(email, password): Promise<any> {
    return this.fbAuth.auth.signInWithEmailAndPassword(email, password);
  }

  initAuthListener() {
    console.log('fb listener init');
    this.fbAuth.authState.subscribe(user => {
      if (user) {
        console.log('auth listener: authenticated');
        this.isAuthenticated = true;
        this.isAuthenticated$.next(true);
        this.router.navigate(['loggedIn']);
      } else {
        this.isAuthenticated = false;
        this.isAuthenticated$.next(false);
        console.log('auth listener: NOT authenticated');
        this.router.navigate(['firestoreauth']);
      }
    });
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

  loginWithGoogle(email, password): Promise<any> {
    return this.fbAuth.auth.signInWithPopup(
      new firebase.auth.GoogleAuthProvider()
    );
  }
}
