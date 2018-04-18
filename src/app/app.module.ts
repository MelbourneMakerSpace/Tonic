import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppMaterialModule } from './/app-material.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { FirestoreComponent } from './components/examples/firestore/firestore.component';
import { FireStoreAuthComponent } from './components/examples/fire-store-auth/fire-store-auth.component';

import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { ExamplesHomeComponent } from './components/examples/examples-home/examples-home.component';
import { MaterialComponent } from './components/examples/material/material.component';
import { FlexLayoutComponent } from './components/examples/flex-layout/flex-layout.component';
import { FirebaseAuthService } from './services/security/firebase-auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';
import { LoggedInComponent } from './components/examples/logged-in/logged-in.component';
import { LoginComponent } from './components/admin/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    FirestoreComponent,
    FireStoreAuthComponent,
    ExamplesHomeComponent,
    MaterialComponent,
    FlexLayoutComponent,
    LoggedInComponent,
    LoginComponent
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
  providers: [FirebaseAuthService, AngularFireAuth],
  bootstrap: [AppComponent]
})
export class AppModule {}
