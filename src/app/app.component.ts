import { Component, OnInit } from '@angular/core';
import { FirebaseAuthService } from './services/security/firebase-auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['../sass/_variables.scss']
})
export class AppComponent implements OnInit {
  isLoggedIn = false;
  identity: string;

  constructor(
    private authService: FirebaseAuthService,
    private http: HttpClient
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
    this.authService.displayName$.subscribe(
      identity => (this.identity = identity)
    );
  }

  testgmail() {
    const emailAddress = 'ykvhveij@sharklasers.com';
    // const url = 'https://us-central1-makertonic321.cloudfunctions.net/httpEmail';

    const url = 'http://localhost:5000/makertonic321/us-central1/gmailEmail';
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
