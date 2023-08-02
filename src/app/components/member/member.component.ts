import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';
import { MemberService } from '../../services/member.service';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { AddEditMemberPlanComponent } from '../add-edit-member-plan/add-edit-member-plan.component';
import { AlertDialogComponent } from '../shared/alert-dialog/alert-dialog.component';
import { AddKeyComponent } from '../add-key/add-key.component';
import { AddTransactionComponent } from '../add-transaction/add-transaction.component';
import { UploadFileService } from '../../services/upload-service.service';
import { MatLegacySlideToggle as MatSlideToggle } from '@angular/material/legacy-slide-toggle';
import * as qr from 'qrcode-generator';
import { Key } from '../../entities/memberKey';
import { HttpErrorResponse } from '@angular/common/http';
import { Member } from '../../entities/member';
import { MemberPlan } from '../../entities/memberPlan';
import { KeyService } from '../../services/key.service';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { TransactionService } from '../../services/transaction.service';
import { Transaction } from '../../entities/transaction';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styles: [
    `
      .mediumField {
        width: 200px;
      }

      .mat-column-serialNumber {
        width: 50%;
        flex: none;
      }

      .subheaderText {
        margin-left: 1em;
      }

      .Inactive {
        color: red;
      }
    `,
  ],
})
export class MemberComponent implements OnInit {
  form: UntypedFormGroup;
  headerText = '';
  memberPlans = new MatTableDataSource<MemberPlan>();
  memberKeys = new MatTableDataSource<Key>();
  memberTransactions = new MatTableDataSource<Transaction>();
  memberId = '';
  memberTypes = ['Officer', 'Member', 'Disabled'];
  openPlan = false;
  memberPicture = '';
  memberStatus = 'Loading...';
  @ViewChild('fileInput') fileInput;
  filecontrol: ElementRef[];
  qrCode = '';

  memberBalance = '';

  constructor(
    private router: Router,
    private fb: UntypedFormBuilder,
    private activatedRoute: ActivatedRoute,
    private memberService: MemberService,
    private keyService: KeyService,
    private dialog: MatDialog,
    private transactionService: TransactionService,
    public uploadService: UploadFileService,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      id: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: [''],
      phone: [''],
      paypalEmail: [''],
      emergencyContact: [''],
      emergencyEmail: ['', Validators.email],
      emergencyPhone: [''],
      role: [''],
      password: [''],
    });

    //console.log('subscribe to route');

    this.activatedRoute.params.subscribe((params) => {
      this.form.controls['id'].setValue(params.id);
      this.memberId = params.id;

      if (this.form.controls['id'].value !== 'New') {
        this.updateMemberBalance();
        this.makeQRCode();
        this.loadValuesIfExisting(this.form.controls['id'].value);
        this.form.valueChanges.subscribe(() => {
          this.headerText =
            this.form.controls['firstName'].value +
            ' ' +
            this.form.controls['lastName'].value;
        });

        this.loadPlans();

        this.loadKeys();

        this.loadTransactions();
      } else {
        this.headerText = 'New Member';
      }
    });
  }

  private loadTransactions() {
    // load member transactions
    this.transactionService
      .getMemberTransactionList(this.memberId)
      .subscribe((transactions) => {
        this.memberTransactions.data = transactions;
        this.checkMemberStatus();
      });
  }

  private checkMemberStatus() {
    // load member transactions
    this.memberService.isMemberActive(this.memberId).subscribe((active) => {
      if (active) {
        this.memberStatus = 'Active';
      } else {
        this.memberStatus = 'Inactive';
      }
    });
  }

  private loadPlans() {
    this.memberService
      .getMemberPlans(this.memberId)
      .pipe(take(1))
      .subscribe((data) => {
        this.openPlan = false;
        this.memberPlans.data = data;
        //console.log('plans', data);
        data.forEach((record) => {
          if (!record.endDate) {
            this.openPlan = true;
          }
        });
        this.checkMemberStatus();
      });
  }

  private loadKeys() {
    this.keyService
      .getMemberKeyList(this.memberId)
      .pipe(take(1))
      .subscribe((data) => {
        this.memberKeys.data = data;
        //console.log('keys', data);
      });
  }

  makeQRCode() {
    const qrcode = qr(4, 'M');
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
    this.dialog
      .open(AddKeyComponent, {
        disableClose: true,
        data: { memberKey: this.memberId },
      })
      .afterClosed()
      .subscribe((result) => {
        this.loadKeys();
      });
  }

  setKeyStatus(key: Key) {
    if (key.status == 'Active') {
      key.status = 'Inactive';
    } else {
      key.status = 'Active';
    }

    this.keyService.saveKey(key).then(() => {
      this.snackBar.open(`Key set to ${key.status}`, null, {
        duration: 1500,
      });
    });
  }

  deleteKey(key: Key) {
    const messageText = 'Are you sure you want to delete this key?';

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
        if (result === 'ok') {
          const keyToUpdate = key;
          this.keyService.deleteKey(keyToUpdate).then(
            () => {
              this.loadKeys();
              this.snackBar.open('key deleted', null, {
                duration: 1500,
              });
            },
            (err) => {
              this.snackBar.open('error deleting key, check console.', null, {
                duration: 1500,
              });
              console.error(err);
            }
          );
        }
      });
  }

  addEditTransaction(id) {
    this.dialog
      .open(AddTransactionComponent, {
        disableClose: true,
        data: { id: id, memberId: this.memberId },
      })
      .afterClosed()
      .subscribe((result) => {
        console.dir(result);
        this.loadTransactions();
        this.updateMemberBalance();
      });
  }

  addEditPlan(Id) {
    if (Id === 'New' && this.openPlan) {
      this.dialog.open(AlertDialogComponent, {
        data: {
          message:
            'This member already has a plan.  Add an end date to the existing plan before adding a new one.',
        },
      });
      return;
    }

    this.dialog
      .open(AddEditMemberPlanComponent, {
        disableClose: true,
        data: { Id: Id, memberId: this.memberId },
      })
      .afterClosed()
      .subscribe((result) => {
        this.loadPlans();
      });
  }

  loadValuesIfExisting(memberId) {
    this.memberService.getMember(memberId).subscribe((data) => {
      Object.keys(data).forEach((KeyName) => {
        if (this.form.controls[KeyName]) {
          this.form.controls[KeyName].setValue(data[KeyName]);
        }
      });
      this.memberPicture = data.picture || '';
    });
  }

  ngOnInit() {}

  updateMemberBalance() {
    this.memberBalance = ' calculating...';

    this.memberService
      .getMemberBalance(this.memberId)
      .pipe(take(1))
      .subscribe(
        (balance) => (this.memberBalance = ' $ ' + balance.toString() + '.00')
      );
  }

  back() {
    this.router.navigateByUrl('/memberlist');
  }

  save() {
    this.memberService
      .saveMember(this.form.value)
      .pipe(take(1))
      .subscribe(
        (data: Member) => {
          this.form.controls['id'].setValue(data.id);
          this.snackBar.open('Member Saved', null, { duration: 1500 });
        },
        (err: HttpErrorResponse) => {
          console.dir(err);
          this.dialog.open(AlertDialogComponent, {
            disableClose: true,

            data: {
              OkCancel: false,
              message: err.error.message,
              header: 'Save Error',
            },
          });
        }
      );
  }
}
