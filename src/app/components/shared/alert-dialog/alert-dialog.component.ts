import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styles: []
})
export class AlertDialogComponent implements OnInit {
  message;
  OkCancel = false;
  constructor(
    public dialogRef: MatDialogRef<AlertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.message = data.message;
    this.OkCancel = data.OkCancel;
  }

  ngOnInit() {}

  cancel() {
    this.dialogRef.close('cancel');
  }

  ok() {
    this.dialogRef.close('ok');
  }

  close() {
    this.dialogRef.close();
  }
}
