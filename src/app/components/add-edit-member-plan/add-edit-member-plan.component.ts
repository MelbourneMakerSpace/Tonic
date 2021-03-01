import { Component, OnInit, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MemberService } from '../../services/member.service';
import { PlanService } from '../../services/plan.service';
import { Observable } from 'rxjs';
import { Plan } from '../../entities/plan';

@Component({
  selector: 'app-add-edit-member-plan',
  templateUrl: './add-edit-member-plan.component.html',
  styles: [],
})
export class AddEditMemberPlanComponent implements OnInit {
  @Input()
  memberKey;

  plans = new Observable<Plan[]>();
  planForm: FormGroup;
  error = '';

  constructor(
    public dialogRef: MatDialogRef<AddEditMemberPlanComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private memberService: MemberService,
    private fb: FormBuilder,
    private planService: PlanService
  ) {
    this.planForm = this.fb.group({
      id: [''],
      planId: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: [''],
      memberId: [data.memberId],
    });

    if (data.Id !== 'New') {
      this.loadExisting(data.Id);
    } else {
      this.planForm.controls['id'].setValue('New');
      this.planForm.controls['startDate'].setValue(new Date());
    }
  }

  loadExisting(Id) {
    this.memberService.getPlan(Id).subscribe((data) => {
      this.planForm.patchValue(data);
    });
  }

  onCancel(): void {
    this.dialogRef.close('Cancel');
  }

  Save() {
    if (this.planForm.valid) {
      this.memberService
        .savePlan(this.planForm.value)
        .then((result) => {
          this.dialogRef.close('Saved');
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      this.error = 'Please fill in requred fields';
    }
  }

  ngOnInit() {
    this.plans = this.planService.getPlanList();
  }
}
