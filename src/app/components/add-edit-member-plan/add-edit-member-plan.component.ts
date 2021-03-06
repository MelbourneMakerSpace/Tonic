import { Component, OnInit, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MemberService } from '../../services/member.service';

@Component({
  selector: 'app-add-edit-member-plan',
  templateUrl: './add-edit-member-plan.component.html',
  styles: []
})
export class AddEditMemberPlanComponent implements OnInit {
  @Input()
  memberKey;

  plans = [50, 25, 0];
  planForm: FormGroup;
  error = '';

  constructor(
    public dialogRef: MatDialogRef<AddEditMemberPlanComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private memberService: MemberService,
    private fb: FormBuilder
  ) {
    this.planForm = this.fb.group({
      Key: [''],
      plan: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: [''],
      memberKey: [data.memberKey]
    });

    if (data.Key !== 'New') {
      this.loadExisting(data.Key);
    } else {
      this.planForm.controls['Key'].setValue('New');
      this.planForm.controls['startDate'].setValue(new Date());
      this.planForm.controls['plan'].setValue(50);
    }
  }

  loadExisting(Key) {
    this.memberService.getPlan(Key).subscribe(data => {
      Object.keys(data).forEach(KeyName => {
        if (data[KeyName].seconds) {
          this.planForm.controls[KeyName].setValue(
            new Date(data[KeyName].seconds * 1000)
          );
        } else {
          if (this.planForm.controls[KeyName]) {
            this.planForm.controls[KeyName].setValue(data[KeyName]);
          }
        }
      });
    });
  }

  onCancel(): void {
    this.dialogRef.close('Cancel');
  }

  Save() {
    console.log('about to save:');
    console.dir(this.planForm.value);

    // this.planForm["memberKey"] = this.memberService.

    if (this.planForm.valid) {
      this.memberService
        .savePlan(this.planForm.value)
        .then(result => {
          this.dialogRef.close('Saved');
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      this.error = 'Please fill in requred fields';
    }
  }

  ngOnInit() {}
}
