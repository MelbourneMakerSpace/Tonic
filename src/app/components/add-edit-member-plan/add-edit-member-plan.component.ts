import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-add-edit-member-plan',
  templateUrl: './add-edit-member-plan.component.html',
  styles: []
})
export class AddEditMemberPlanComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<AddEditMemberPlanComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log('data:', data.Key);
  }

  onCancel(): void {
    this.dialogRef.close('Cancel');
  }

  ngOnInit() {}
}
