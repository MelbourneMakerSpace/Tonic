import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs";

import { Router } from "@angular/router";
import { TimerObservable } from "rxjs/observable/TimerObservable";

import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { take, tap } from "rxjs/operators";
import { Member } from "../../entities/member";

@Injectable()
export class AuthService {
  isAuthenticated: boolean;
  public authToken = "";
  // displayName$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  isAuthenticated$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  public member: Member;

  constructor(private router: Router, private http: HttpClient) {}

  public login(email: string, password: string): Observable<any> {
    const postData = { email, password };
    return this.http
      .post<any>(environment.TonicAPIURL + "login", postData)
      .pipe(
        tap((result) => {
          this.authToken = result.token;
          this.member = result.member;
        })
      );
  }
}
