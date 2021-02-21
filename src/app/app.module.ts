import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppMaterialModule } from ".//app-material.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FlexLayoutModule } from "@angular/flex-layout";
import { AngularFireModule } from "@angular/fire";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireStorage } from "@angular/fire/storage";
// import { AngularFireStorage } from '@angular/fire/storage';

import { AppRoutingModule } from "./app-routing.module";
import { RouterModule } from "@angular/router";

import { environment } from "../environments/environment";

import { ReactiveFormsModule } from "@angular/forms";
import { AngularFireAuth } from "@angular/fire/auth";

import { AppComponent } from "./app.component";
import { LoginComponent } from "./components/admin/login/login.component";
import { MemberlistComponent } from "./components/memberlist/memberlist.component";

import { MemberService } from "./services/member.service";
import { TbCardComponent } from "./components/controls/tb-card/tb-card.component";
import { MemberComponent } from "./components/member/member.component";
import { AddEditMemberPlanComponent } from "./components/add-edit-member-plan/add-edit-member-plan.component";
import { DbRecordService } from "./services/db-record.service";
import { AlertDialogComponent } from "./components/shared/alert-dialog/alert-dialog.component";
import { AddKeyComponent } from "./components/add-key/add-key.component";
import { AddTransactionComponent } from "./components/add-transaction/add-transaction.component";

import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { GmailService } from "./services/email/gmail.service";
import { AuthInterceptor } from "./services/AuthInterceptor";
import { UploadFileService } from "./services/upload-service.service";
import { QrComponent } from "./components/qr/qr.component";
import { AuthService } from "./services/security/auth.service";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MemberlistComponent,
    TbCardComponent,
    MemberComponent,
    AddEditMemberPlanComponent,
    AlertDialogComponent,
    AddKeyComponent,
    AddTransactionComponent,
    // QrComponent
  ],
  imports: [
    AppRoutingModule,
    HttpClientModule,
    AppMaterialModule,
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    AngularFireModule.initializeApp(environment.firebase),
    AppRoutingModule,
    AppMaterialModule,
    ReactiveFormsModule,
  ],
  providers: [
    AuthService,
    AngularFireAuth,
    MemberService,
    DbRecordService,
    GmailService,
    UploadFileService,
    AngularFirestore,
    AngularFireStorage,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  entryComponents: [
    AddEditMemberPlanComponent,
    AlertDialogComponent,
    AddKeyComponent,
    AddTransactionComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
