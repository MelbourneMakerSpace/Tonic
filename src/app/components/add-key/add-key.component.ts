import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MemberService } from '../../services/member.service';
import { DbRecordService } from '../../services/db-record.service';
import { KeyService } from '../../services/key.service';

@Component({
  selector: 'app-add-key',
  templateUrl: './add-key.component.html',
  styles: [],
})
export class AddKeyComponent implements OnInit {
  keyForm: FormGroup;
  error = '';
  constructor(
    public dialogRef: MatDialogRef<AddKeyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private keyService: KeyService
  ) {
    this.keyForm = this.fb.group({
      id: [''],
      serialNumber: ['', Validators.required],
      memberId: [''],
      status: [''],
    });

    this.keyForm.controls['id'].setValue('New');
    this.keyForm.controls['memberId'].setValue(data.memberKey);
    this.keyForm.controls['status'].setValue('Active');
  }

  Save() {
    console.log('about to save:');
    console.dir(this.keyForm.value);
    if (this.keyForm.valid) {
      this.keyService
        .saveKey(this.keyForm.value)
        .then((result) => {
          this.dialogRef.close('ok');
        })
        .catch((error) => {
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
