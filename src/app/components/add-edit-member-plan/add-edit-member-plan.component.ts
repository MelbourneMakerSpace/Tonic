import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MemberService } from '../../services/member.service';

@Component({
  selector: 'app-add-edit-member-plan',
  templateUrl: './add-edit-member-plan.component.html',
  styles: []
})
export class AddEditMemberPlanComponent implements OnInit {
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
      endDate: ['']
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
        console.log('find: ', KeyName);
        if (this.planForm.controls[KeyName]) {
          console.log('set: ', KeyName, ' = ', data[KeyName]);
          this.planForm.controls[KeyName].setValue(data[KeyName]);
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
