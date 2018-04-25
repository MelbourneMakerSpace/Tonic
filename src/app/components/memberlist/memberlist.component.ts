import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MemberService } from '../../services/member.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { Subject } from 'rxjs/Subject';
import { filter } from 'rxjs/operators/filter';
import { Router } from '@angular/router';

@Component({
  selector: 'app-memberlist',
  templateUrl: './memberlist.component.html',
  styles: [
    `.headerdiv {
    padding-left:10px;
  }
  .headerspan {
    font-size:50px;
    font-weight:bold;
  }
  .hover:hover{
    background-color:#e1e2e1;
  }`
  ]
})
export class MemberlistComponent implements OnInit {
  memberSnapshot: Observable<Member>;
  displayedColumns = ['Name'];
  filter$ = new BehaviorSubject(null);
  filter = '';
  constructor(private memberService: MemberService, private router: Router) {}

  ngOnInit() {
    // this.memberSnapshot = this.memberService.getMemberList();
    this.filter$
      .debounceTime(400)
      .distinctUntilChanged()
      .subscribe(filterstring => {
        if (filterstring) {
          // this.memberSnapshot = this.memberService.getFilteredMemberList(
          //   filterstring
          // );
          this.filter = filterstring;
          this.memberSnapshot = this.memberService
            .getMemberList()
            .map(members =>
              members.filter((x: Member, idx) => {
                // console.dir(x);
                return x.FirstName.toLowerCase().startsWith(filterstring);
              })
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
    this.router.navigate(['member/New']);
  }
}
