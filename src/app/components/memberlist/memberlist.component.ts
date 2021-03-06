import { Component, OnInit } from "@angular/core";
import { Observable, BehaviorSubject, Subject } from "rxjs";
import { MemberService } from "../../services/member.service";
import {
  filter,
  debounceTime,
  distinctUntilChanged,
  map,
} from "rxjs/operators";
import { Router } from "@angular/router";
import { Member } from "../../models/member";

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
  memberSnapshot: Observable<Member>;
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
          // this.memberSnapshot = this.memberService.getFilteredMemberList(
          //   filterstring
          // );
          this.filter = filterstring;
          this.memberSnapshot = this.memberService.getMemberList().pipe(
            map((members) =>
              members.filter((x: Member, idx) => {
                // console.dir(x);
                return x.FirstName.toLowerCase().startsWith(filterstring);
              })
            )
          );
        } else {
          this.memberSnapshot = this.memberService.getMemberList();
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
