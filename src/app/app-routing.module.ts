import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./components/admin/login/login.component";
import { MemberlistComponent } from "./components/memberlist/memberlist.component";
import { MemberComponent } from "./components/member/member.component";

const routes: Routes = [
  { path: "", component: LoginComponent },
  { path: "home", component: MemberlistComponent },
  { path: "memberlist", component: MemberlistComponent },
  { path: "member/:Key", component: MemberComponent },
  { path: "app-login", component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
