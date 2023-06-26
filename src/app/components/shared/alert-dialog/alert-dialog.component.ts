import { Component, OnInit, Input, Inject } from "@angular/core";
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from "@angular/material/legacy-dialog";

@Component({
  selector: "app-alert-dialog",
  templateUrl: "./alert-dialog.component.html",
  styles: [],
})
export class AlertDialogComponent implements OnInit {
  message;
  OkCancel = false;
  header = "";
  constructor(
    public dialogRef: MatDialogRef<AlertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.message = data.message;
    this.OkCancel = data.OkCancel;
    this.header = data.header || "Warning";
  }

  ngOnInit() {}

  cancel() {
    this.dialogRef.close("cancel");
  }

  ok() {
    this.dialogRef.close("ok");
  }

  close() {
    this.dialogRef.close();
  }
}
