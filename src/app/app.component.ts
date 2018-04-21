import { Component, OnInit } from '@angular/core';
import { FirebaseAuthService } from './services/security/firebase-auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['../sass/_variables.scss']
})
export class AppComponent implements OnInit {
  isLoggedIn = false;
  identity: string;

  constructor(private authService: FirebaseAuthService) {}

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
}
