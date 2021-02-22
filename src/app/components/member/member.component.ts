import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MemberService } from "../../services/member.service";
import { Observable } from "rxjs";
import { take } from "rxjs/operators";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { AddEditMemberPlanComponent } from "../add-edit-member-plan/add-edit-member-plan.component";
import { AlertDialogComponent } from "../shared/alert-dialog/alert-dialog.component";
import { DbRecordService } from "../../services/db-record.service";
import { AddKeyComponent } from "../add-key/add-key.component";
import { AddTransactionComponent } from "../add-transaction/add-transaction.component";
import { UploadFileService } from "../../services/upload-service.service";

import * as qr from "qrcode-generator";
import { MemberPlan } from "../../models/memberPlan";
import { MemberKey } from "../../models/memberKey";
import { Transaction } from "@google-cloud/firestore";
import { HttpErrorResponse } from "@angular/common/http";
import { Member } from "../../entities/member";

@Component({
  selector: "app-member",
  templateUrl: "./member.component.html",
  styles: [
    `
      .mediumField {
        width: 200px;
      }
    `,
  ],
})
export class MemberComponent implements OnInit {
  form: FormGroup;
  headerText = "";
  memberPlans = new MatTableDataSource<MemberPlan>();
  memberKeys = new MatTableDataSource<MemberKey>();
  memberTransactions = new MatTableDataSource<Transaction>();
  memberId = "";
  memberTypes = ["Officer", "Member", "Disabled"];
  openPlan = false;
  memberPicture = "";
  @ViewChild("fileInput") fileInput;
  filecontrol: ElementRef[];
  qrCode = "";

  memberBalance = "";

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private memberService: MemberService,
    private dialog: MatDialog,
    private dbService: DbRecordService,
    public uploadService: UploadFileService
  ) {
    this.form = this.fb.group({
      id: [""],
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      email: [""],
      phone: [""],
      paypalEmail: [""],
      emergencyContact: [""],
      emergencyEmail: ["", Validators.email],
      emergencyPhone: [""],
      role: [""],
      password: [""],
    });

    console.log("subscribe to route");

    this.activatedRoute.params.subscribe((params) => {
      this.form.controls["id"].setValue(params.id);
      this.memberId = params.id;

      if (this.form.controls["id"].value !== "New") {
        this.makeQRCode();
        this.loadValuesIfExisting(this.form.controls["id"].value);
        this.form.valueChanges.subscribe(() => {
          this.headerText =
            this.form.controls["firstName"].value +
            " " +
            this.form.controls["lastName"].value;
        });

        this.memberService.getMemberPlans(this.memberId).subscribe((data) => {
          // this.openPlan = false;
          // this.memberPlans.data = data;
          // data.forEach((record) => {
          //   if (!record.endDate) {
          //     this.openPlan = true;
          //   }
          // });
        });

        // load member keys
        // this.dbService
        //   .getFilteredRecordList("MemberKeys", "memberKey", this.Key)
        //   .subscribe((keys) => {
        //     this.memberKeys.data = keys;
        //   });

        // load member transactions
        // this.dbService
        //   .getFilteredRecordList("Transactions", "memberKey", this.Key)
        //   .subscribe((transactions) => {
        //     this.memberTransactions.data = transactions;
        //   });
      } else {
        this.headerText = "New Member";
      }
    });
  }

  makeQRCode() {
    const qrcode = qr(4, "M");
    qrcode.addData(this.memberId);
    qrcode.make();
    this.qrCode = qrcode.createDataURL(3, 0);
  }

  uploadMemberImage(file) {
    // this.uploadService.uploadfile(file, 'setMemberImage', {
    //   MemberKey: this.Key
    // });
    this.uploadService.uploadMemberImage(file, this.memberId);
  }

  addKey() {
    // console.log("add key for member:", this.Key);
    // this.dialog
    //   .open(AddKeyComponent, {
    //     disableClose: true,
    //     data: { memberKey: this.Key },
    //   })
    //   .afterClosed()
    //   .subscribe((result) => {
    //     console.dir(result);
    //   });
  }

  setKeyStatus(Key, status) {
    let messageText = "Are you sure you want to deactivate this key?";

    if (status === "Active") {
      messageText = "Are you sure you want to reactivate this key?";
    }

    this.dialog
      .open(AlertDialogComponent, {
        disableClose: true,
        data: {
          OkCancel: true,
          message: messageText,
        },
      })
      .afterClosed()
      .subscribe((result) => {
        // if (result === "ok") {
        //   const keyToUpdate = Key;
        //   keyToUpdate.status = status;
        //   this.dbService
        //     .saveRecord(keyToUpdate, "MemberKeys")
        //     .then(() => console.log("key inactivated"));
        // }
      });
  }

  addEditTransaction(Key) {
    this.dialog
      .open(AddTransactionComponent, {
        disableClose: true,
        data: { Key: Key, memberKey: this.memberId },
      })
      .afterClosed()
      .subscribe((result) => {
        console.dir(result);
        this.updateMemberBalance();
      });
  }

  addEditPlan(Key) {
    if (Key === "New" && this.openPlan) {
      // this.dialog.open(AlertDialogComponent, {
      //   data: {
      //     message:
      //       "This member already has a plan.  Add an end date to the existing plan before adding a new one.",
      //   },
      // });
      return;
    }

    this.dialog
      .open(AddEditMemberPlanComponent, {
        disableClose: true,
        data: { Key, memberKey: this.memberId },
      })
      .afterClosed()
      .subscribe((result) => {
        console.dir(result);
      });
  }

  loadValuesIfExisting(memberId) {
    this.memberService.getMember(memberId).subscribe((data) => {
      console.log("received:", data);
      Object.keys(data).forEach((KeyName) => {
        if (this.form.controls[KeyName]) {
          this.form.controls[KeyName].setValue(data[KeyName]);
        }
      });
      this.memberPicture = data.picture || "";
    });
  }

  ngOnInit() {
    //this.updateMemberBalance();
  }

  updateMemberBalance() {
    this.memberBalance = " calculating...";

    // this.memberService
    //   .getBalance(this.Key)
    //   .pipe(take(1))
    //   .subscribe(
    //     (value) => (this.memberBalance = " $ " + value.toString() + ".00")
    //   );
  }

  back() {
    this.router.navigateByUrl("/memberlist");
  }

  save() {
    console.dir(this.form);
    this.memberService
      .saveMember(this.form.value)
      .pipe(take(1))
      .subscribe(
        (data: Member) => {
          this.form.controls["id"].setValue(data.id);
        },
        (err: HttpErrorResponse) => {
          console.dir(err);
          this.dialog.open(AlertDialogComponent, {
            disableClose: true,

            data: {
              OkCancel: false,
              message: err.error.message,
              header: "Save Error",
            },
          });
        }
      );
  }
}
