import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/admin/login/login.component';
import { MemberlistComponent } from './components/memberlist/memberlist.component';
import { MemberComponent } from './components/member/member.component';
import { EquipmentlistComponent } from './components/equipmentlist/equipmentlist.component';
import { AccessLogComponent } from './components/access-log/access-log.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'home', component: MemberlistComponent },
  { path: 'memberlist', component: MemberlistComponent },
  { path: 'member/:id', component: MemberComponent },
  { path: 'app-login', component: LoginComponent },
  { path: 'accessLog', component: AccessLogComponent },
  { path: 'equipmentlist', component: EquipmentlistComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
