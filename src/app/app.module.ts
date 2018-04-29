import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppMaterialModule } from './/app-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';

import { environment } from '../environments/environment';

import { FirebaseAuthService } from './services/security/firebase-auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/admin/login/login.component';
import { MemberlistComponent } from './components/memberlist/memberlist.component';

import { MemberService } from './services/member.service';
import { TbCardComponent } from './components/controls/tb-card/tb-card.component';
import { MemberComponent } from './components/member/member.component';
import { AddEditMemberPlanComponent } from './components/add-edit-member-plan/add-edit-member-plan.component';
import { DbRecordService } from './services/db-record.service';
import { AlertDialogComponent } from './components/shared/alert-dialog/alert-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MemberlistComponent,
    TbCardComponent,
    MemberComponent,
    AddEditMemberPlanComponent,
    AlertDialogComponent
  ],
  imports: [
    AppRoutingModule,
    AppMaterialModule,
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AppRoutingModule,
    AppMaterialModule,
    ReactiveFormsModule
  ],
  providers: [
    FirebaseAuthService,
    AngularFireAuth,
    MemberService,
    DbRecordService
  ],
  entryComponents: [AddEditMemberPlanComponent, AlertDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
