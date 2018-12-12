import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class GmailService {
  constructor(private http: HttpClient) {}

  sendGmail(to, from = 'noreply@tonic.org', subject, body, isHTML = false) {
    const url = environment.firebaseFunctionURL + 'gmailEmail';

    const envelope = {
      to: to,
      from: from,
      subject: subject,
      content: body,
      isHTML: isHTML
    };

    return this.http.post(url, JSON.stringify(envelope)).subscribe(
      res => {
        console.log(res);
      },
      err => console.log(err)
    );
  }
}
