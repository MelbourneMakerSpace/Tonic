import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseAuthService } from '../../../services/security/firebase-auth.service';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  loginError: string;

  constructor(
    private fb: FormBuilder,
    private authService: FirebaseAuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {}

  loginWithGoogle() {
    this.authService.loginWithGoogle();
  }

  login() {
    const formValues = this.form.value;

    this.authService
      .login(formValues.email, formValues.password)
      .then((user: firebase.auth.UserCredential) => {
        console.log(user.user.displayName);
        // this.router.navigate(['loggedIn']);
        // console.dir(result);
      })
      .catch(error => {
        this.loginError = error.message;
      });
  }
}
