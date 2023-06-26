import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.component.html',
  styles: [],
})
export class AddTransactionComponent implements OnInit {
  transactionForm: UntypedFormGroup;
  error = '';
  methods = ['Cash', 'Paypal', 'Credit Card', 'Check'];
  constructor(
    public dialogRef: MatDialogRef<AddTransactionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private transactionService: TransactionService,
    private fb: UntypedFormBuilder
  ) {
    this.transactionForm = this.fb.group({
      id: [''],
      memberId: ['', Validators.required],
      transactionDate: ['', Validators.required],
      description: [''],
      amount: ['', Validators.required],
      method: [''],
      confirmation: [''],
      notes: [''],
    });

    if (data.id === 'New') {
      this.transactionForm.controls['id'].setValue(data.id);
      this.transactionForm.controls['memberId'].setValue(data.memberId);
      this.transactionForm.controls['transactionDate'].setValue(new Date());
    } else {
      this.loadTransaction(data.id);
    }
  }

  loadTransaction(id) {
    this.transactionService.getTransaction(id).subscribe((data) => {
      this.transactionForm.patchValue(data);
    });
  }

  Save() {
    if (this.transactionForm.valid) {
      this.transactionService
        .saveTransaction(this.transactionForm.value)
        .then((result) => {
          this.dialogRef.close('Saved');
        })
        .catch((error) => {
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
