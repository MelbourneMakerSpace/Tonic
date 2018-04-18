import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FirestoreComponent } from './components/examples/firestore/firestore.component';
import { ExamplesHomeComponent } from './components/examples/examples-home/examples-home.component';
import { FireStoreAuthComponent } from './components/examples/fire-store-auth/fire-store-auth.component';
import { MaterialComponent } from './components/examples/material/material.component';
import { FlexLayoutComponent } from './components/examples/flex-layout/flex-layout.component';
import { LoggedInComponent } from './components/examples/logged-in/logged-in.component';

const routes: Routes = [
  { path: '', component: ExamplesHomeComponent },
  { path: 'home', component: ExamplesHomeComponent },
  { path: 'firestore', component: FirestoreComponent },
  { path: 'material', component: MaterialComponent },
  { path: 'flexlayout', component: FlexLayoutComponent },
  { path: 'loggedIn', component: LoggedInComponent },
  { path: 'firestoreauth', component: FireStoreAuthComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
