import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { AuthService } from './services/security/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [
    '.mainContainer{ max-width:1000px; margin-left: auto; margin-right:auto;}',
  ],
})
export class AppComponent implements OnInit {
  isAuthenticated = false;
  userRole: string;
  identity: string;
  photoURL: string;

  constructor(private auth: AuthService) {}

  logout() {
    this.auth.logout();
  }

  ngOnInit() {
    this.auth.isAuthenticated$.subscribe((res) => (this.isAuthenticated = res));
  }

  testgmail() {}

  testMail() {}
}
