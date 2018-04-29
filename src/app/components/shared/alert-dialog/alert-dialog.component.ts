import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styles: []
})
export class AlertDialogComponent implements OnInit {
  @Input() message;
  constructor(
    public dialogRef: MatDialogRef<AlertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.message = data.message;
  }

  ngOnInit() {}

  close() {
    this.dialogRef.close();
  }
}
