import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseAuthService } from '../../../services/security/firebase-auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fire-store-auth',
  templateUrl: './fire-store-auth.component.html',
  styles: []
})
export class FireStoreAuthComponent implements OnInit {
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

  login() {
    const formValues = this.form.value;

    // this.authService
    //   .loginWithGoogle(formValues.email, formValues.password)
    //   .then(result => {
    //     console.dir(result);
    //   });

    this.authService
      .login(formValues.email, formValues.password)
      .then(result => {
        // this.router.navigate(['loggedIn']);
        // console.dir(result);
      })
      .catch(error => {
        this.loginError = error.message;
      });
  }
}
