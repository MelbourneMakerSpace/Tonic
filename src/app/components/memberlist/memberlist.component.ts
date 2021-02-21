import { Component, OnInit } from "@angular/core";
import { Observable, BehaviorSubject, Subject } from "rxjs";
import { MemberService } from "../../services/member.service";
import {
  filter,
  debounceTime,
  distinctUntilChanged,
  map,
  take,
} from "rxjs/operators";
import { Router } from "@angular/router";
import { Member } from "../../entities/member";
@Component({
  selector: "app-memberlist",
  templateUrl: "./memberlist.component.html",
  styles: [
    `
      .headerdiv {
        padding-left: 10px;
      }
      .headerspan {
        font-size: 50px;
        font-weight: bold;
      }
    `,
  ],
})
export class MemberlistComponent implements OnInit {
  public memberList: Observable<Member[]>;
  displayedColumns = ["Name"];
  filter$ = new BehaviorSubject(null);
  filter = "";
  constructor(private memberService: MemberService, private router: Router) {}

  ngOnInit() {
    // this.memberSnapshot = this.memberService.getMemberList();
    this.filter$
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((filterstring) => {
        if (filterstring) {
          console.log("add filter ability");
        } else {
          this.memberList = this.memberService.getMemberList();
        }
      });
  }

  applyFilter(filterstring) {
    this.filter$.next(filterstring);
  }

  viewMember(Key) {
    console.dir(Key);
  }

  addMember(event) {
    this.router.navigate(["member/New"]);
  }
}
