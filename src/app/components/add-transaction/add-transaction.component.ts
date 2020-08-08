import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DbRecordService } from '../../services/db-record.service';

@Component({
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.component.html',
  styles: []
})
export class AddTransactionComponent implements OnInit {
  transactionForm: FormGroup;
  error = '';
  methods = ['Cash', 'Paypal', 'Credit Card', 'Check'];
  constructor(
    public dialogRef: MatDialogRef<AddTransactionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dbService: DbRecordService,
    private fb: FormBuilder
  ) {
    this.transactionForm = this.fb.group({
      Key: [''],
      memberKey: ['', Validators.required],
      date: ['', Validators.required],
      description: [''],
      amount: ['', Validators.required],
      method: [''],
      confirmation: [''],
      notes: ['']
    });

    if (data.Key === 'New') {
      this.transactionForm.controls['Key'].setValue(data.Key);
      this.transactionForm.controls['memberKey'].setValue(data.memberKey);
      this.transactionForm.controls['date'].setValue(new Date());
    } else {
      this.loadValuesIfExisting(data.Key);
    }
  }

  loadValuesIfExisting(Key) {
    this.dbService.getRecord(Key, 'Transactions').subscribe(data => {
      Object.keys(data).forEach(KeyName => {
        if (this.transactionForm.controls[KeyName]) {
          if (data[KeyName].seconds) {
            this.transactionForm.controls[KeyName].setValue(
              new Date(data[KeyName].seconds * 1000)
            );
          } else {
            this.transactionForm.controls[KeyName].setValue(data[KeyName]);
          }
        }
      });
    });
  }

  Save() {
    if (this.transactionForm.valid) {
      this.dbService
        .saveRecord(this.transactionForm.value, 'Transactions')
        .then(result => {
          this.dialogRef.close('Saved');
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      this.error = 'Please fix validation errors';
    }
  }

  onCancel(): void {
    this.dialogRef.close('Cancel');
  }

  ngOnInit() {}
}
