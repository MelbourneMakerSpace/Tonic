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
      key: [''],
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required]
    });

    this.activatedRoute.params.subscribe(params => {
      this.form.controls['key'].setValue(params.key);
      if (this.form.controls['key'].value !== 'New') {
        this.loadValuesIfExisting(this.form.controls['key'].value);
      }
    });
  }

  loadValuesIfExisting(key) {
    this.memberService.getMember(key).subscribe(data => {
      Object.keys(data).forEach(keyName => {
        if (this.form.controls[keyName]) {
          this.form.controls[keyName].setValue(data[keyName]);
        }
      });
    });
  }

  ngOnInit() {}

  back() {
    this.router.navigateByUrl('/memberlist');
  }

  save() {
    this.router.navigateByUrl('/memberlist');
  }
}
