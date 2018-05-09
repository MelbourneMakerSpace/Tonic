import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
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
      content: body
    };

    return this.http.post(url, JSON.stringify(envelope)).subscribe(
      res => {
        console.log(res);
      },
      err => console.log(err)
    );
  }
}
