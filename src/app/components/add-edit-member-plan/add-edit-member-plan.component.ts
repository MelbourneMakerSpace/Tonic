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

  constructor(
    public dialogRef: MatDialogRef<AddEditMemberPlanComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private memberService: MemberService,
    private fb: FormBuilder
  ) {
    this.planForm = this.fb.group({
      Key: [''],
      plan: ['', Validators.required],
      startDate: [''],
      endDate: ['']
    });
    if (data.key !== 'New') {
      this.loadExisting(data.Key);
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
    this.memberService
      .savePlan(this.planForm.value)
      .then(result => {
        this.dialogRef.close('Saved');
      })
      .catch(error => {
        console.log(error);
      });
  }

  ngOnInit() {}
}
