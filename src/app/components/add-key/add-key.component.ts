import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MemberService } from '../../services/member.service';
import { DbRecordService } from '../../services/db-record.service';

@Component({
  selector: 'app-add-key',
  templateUrl: './add-key.component.html',
  styles: []
})
export class AddKeyComponent implements OnInit {
  keyForm: FormGroup;
  error = '';
  constructor(
    public dialogRef: MatDialogRef<AddKeyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dbService: DbRecordService,
    private fb: FormBuilder
  ) {
    this.keyForm = this.fb.group({
      Key: [''],
      keySerial: ['', Validators.required],
      memberKey: [''],
      status: ['']
    });

    this.keyForm.controls['Key'].setValue('New');
    this.keyForm.controls['memberKey'].setValue(data.memberKey);
    this.keyForm.controls['status'].setValue('Active');
  }

  Save() {
    console.log('about to save:');
    console.dir(this.keyForm.value);
    if (this.keyForm.valid) {
      this.dbService
        .saveRecord(this.keyForm.value, 'MemberKeys')
        .then(result => {
          this.dialogRef.close('Saved');
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      this.error = 'Please fill in the serial number';
    }
  }

  onCancel(): void {
    this.dialogRef.close('Cancel');
  }

  ngOnInit() {}
}
