import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

import { Router } from '@angular/router';
import { TimerObservable } from 'rxjs/observable/TimerObservable';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { take, tap } from 'rxjs/operators';
import { Member } from '../../entities/member';

@Injectable()
export class AuthService {
  isAuthenticated: boolean;
  private _authToken = '';
  public get authToken() {
    if (this._authToken == '') {
      this._authToken = localStorage.getItem('token');
    }
    return this._authToken;
  }

  public set authToken(v: string) {
    this._authToken = v;
  }

  // displayName$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  isAuthenticated$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  public member: Member;

  constructor(private router: Router, private http: HttpClient) {}

  public logout() {
    this.isAuthenticated$.next(false);
    localStorage.removeItem('token');
    this.router.navigateByUrl('/');
  }

  public login(email: string, password: string): Observable<any> {
    const postData = { email, password };
    return this.http
      .post<any>(environment.TonicAPIURL + 'login', postData)
      .pipe(
        tap((result) => {
          if (result.member.name != 'EntityNotFound') {
            this.isAuthenticated$.next(true);
            this.authToken = result.token;
            this.member = result.member;
            localStorage.setItem('token', result.token);
          }
        })
      );
  }
}
