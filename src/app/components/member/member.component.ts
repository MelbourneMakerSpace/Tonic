import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MemberService } from '../../services/member.service';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styles: []
})
export class MemberComponent implements OnInit {
  form: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private memberService: MemberService
  ) {
    this.form = this.fb.group({
      Key: [''],
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      email: [''],
      phone: [''],
      paypalEmail: [''],
      emergencyName: [''],
      emergencyEmail: ['', Validators.email],
      emergencyPhone: ['']
    });

    this.activatedRoute.params.subscribe(params => {
      this.form.controls['Key'].setValue(params.Key);
      if (this.form.controls['Key'].value !== 'New') {
        this.loadValuesIfExisting(this.form.controls['Key'].value);
      }
    });
  }

  loadValuesIfExisting(Key) {
    this.memberService.getMember(Key).subscribe(data => {
      Object.keys(data).forEach(KeyName => {
        if (this.form.controls[KeyName]) {
          this.form.controls[KeyName].setValue(data[KeyName]);
        }
      });
    });
  }

  ngOnInit() {}

  back() {
    this.router.navigateByUrl('/memberlist');
  }

  save() {
    // console.dir(this.form);

    this.memberService
      .saveMember(this.form.value)
      .then(() => {
        console.dir('saved');
      })
      .catch(error => {
        console.log(error);
      });
    // this.memberService.blah(this.form.value);
  }
}
