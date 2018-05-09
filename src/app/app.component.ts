import { Component, OnInit } from '@angular/core';
import { FirebaseAuthService } from './services/security/firebase-auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { GmailService } from './services/email/gmail.service';
import { User } from '@firebase/auth-types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['../sass/_variables.scss']
})
export class AppComponent implements OnInit {
  isLoggedIn = false;

  identity: string;
  photoURL: string;

  constructor(
    private authService: FirebaseAuthService,
    private http: HttpClient,
    private email: GmailService
  ) {}

  logout() {
    // console.log('logging out the user...');
    this.authService.logout();
  }

  ngOnInit() {
    this.authService.initAuthListener();
    this.authService.isAuthenticated$.subscribe(isAuth => {
      this.isLoggedIn = isAuth;
    });
    this.authService.user$.subscribe((identity: User) => {
      console.log('identity:', identity);
      this.identity = identity.displayName || identity.email;
      this.photoURL = identity.photoURL;
    });
  }

  testgmail() {
    this.email.sendGmail(
      'ockkqiuj@sharklasers.com',
      'noreply@tonic.com',
      'test subject',
      'test e-mail through service'
    );
  }

  testMail() {
    const emailAddress = 'ykvhveij@sharklasers.com';
    // const url = 'https://us-central1-makertonic321.cloudfunctions.net/httpEmail';

    const url = 'http://localhost:5000/makertonic321/us-central1/sendgridEmail';
    // const params: URLSearchParams = new URLSearchParams();

    // params.set('to', emailAddress);
    // params.set('from', 'hello@tonic.com');
    // params.set('subject', 'test-email');
    // params.set('content', 'this is some test content from a firebase function');

    const body = {
      to: emailAddress,
      from: 'hello@tonic.com',
      subject: 'test-email at 917',
      content: 'some content here'
    };

    const postHeaders = new HttpHeaders().set(
      'Content-Type',
      'application/json'
    ); // create header object
    // postHeaders = postHeaders.append('Access-Control-Allow-Origin', '*'); // add a new header, creating a new object

    return this.http.post(url, JSON.stringify(body)).subscribe(
      res => {
        console.log(res);
      },
      err => console.log(err)
    );
  }
}
