import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { MemberService } from '../../services/member.service';
import {
  filter,
  debounceTime,
  distinctUntilChanged,
  map,
  take,
} from 'rxjs/operators';
import { Router } from '@angular/router';
import { Member } from '../../entities/member';
@Component({
  selector: 'app-memberlist',
  templateUrl: './memberlist.component.html',
  styles: [],
})
export class MemberlistComponent implements OnInit {
  public memberList: Member[];
  displayedColumns = ['Name'];
  public filter$ = new BehaviorSubject(null);
  constructor(private memberService: MemberService, private router: Router) {}

  ngOnInit() {
    // this.memberSnapshot = this.memberService.getMemberList();
    this.filter$
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((filterstring) => {
        if (filterstring?.length > 0) {
          this.memberList = this.memberList.filter(
            (member) =>
              member.firstName
                .toLowerCase()
                .startsWith(filterstring.toLowerCase()) ||
              member.lastName
                .toLowerCase()
                .startsWith(filterstring.toLowerCase())
          );
        } else {
          this.memberService
            .getMemberList()
            .subscribe((members) => (this.memberList = members));
        }
      });
  }

  applyFilter(filterstring) {
    this.filter$.next(filterstring);
  }

  clearFilter(filter) {
    this.filter$.next('');
    filter.value = '';
  }

  addMember(event) {
    this.router.navigate(['member/New']);
  }
}
