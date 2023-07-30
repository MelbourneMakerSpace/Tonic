import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/security/auth.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [],
})
export class LoginComponent implements OnInit {
  form: UntypedFormGroup;
  loginError: string;

  constructor(
    private fb: UntypedFormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    //this.auth.logout();

    this.form = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {}

  login() {
    const formValues = this.form.value;

    this.auth
      .login(formValues.email, formValues.password)
      .pipe(take(1))
      .subscribe(
        (result) => {
          if (result.member.name != 'EntityNotFound') {
            this.router.navigate(['memberlist']);
          } else {
            this.loginError = 'Invalid username or password';
          }
        },
        (err) => {
          console.log(err);
          this.loginError = err.message;
        }
      );
  }
}
