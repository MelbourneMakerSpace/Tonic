import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MemberService } from '../../services/member.service';
import { Observable } from 'rxjs/Observable';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { AddEditMemberPlanComponent } from '../add-edit-member-plan/add-edit-member-plan.component';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styles: [
    `
    .mediumField{
      width:200px;
    }
    `
  ]
})
export class MemberComponent implements OnInit {
  form: FormGroup;
  headerText = '';
  memberPlans = new MatTableDataSource<MemberPlan>();
  Key = '';
  memberTypes = ['Officer', 'Member', 'Disabled'];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private memberService: MemberService,
    private dialog: MatDialog
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
      emergencyPhone: [''],
      role: [''],
      password: ['']
    });

    this.activatedRoute.params.subscribe(params => {
      this.form.controls['Key'].setValue(params.Key);
      this.Key = params.Key;
      if (this.form.controls['Key'].value !== 'New') {
        this.loadValuesIfExisting(this.form.controls['Key'].value);
        this.form.valueChanges.subscribe(() => {
          this.headerText =
            this.form.controls['FirstName'].value +
            ' ' +
            this.form.controls['LastName'].value;
        });
        this.memberService.getMemberPlans().subscribe(data => {
          this.memberPlans.data = data;
        });
      } else {
        this.headerText = 'New Member';
      }
    });
  }

  addEditPlan(Key) {
    this.dialog
      .open(AddEditMemberPlanComponent, {
        disableClose: true,
        data: { Key }
      })
      .afterClosed()
      .subscribe(result => {
        console.dir(result);
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
      .then(result => {
        console.dir(result);
      })
      .catch(error => {
        console.log(error);
      });
    // this.memberService.blah(this.form.value);
  }
}
