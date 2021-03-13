import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
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
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-memberlist',
  templateUrl: './memberlist.component.html',
  styles: [
    `
      .mat-column-firstname {
        width: 15ch;
      }
      .mat-column-Status {
        width: 15ch;
      }
      .mat-column-Balance {
        width: 15ch;
        text-align: right;
      }
    `,
  ],
})
export class MemberlistComponent implements OnInit, AfterViewInit {
  public memberList = [];
  dataSource;

  @ViewChild(MatSort) sort: MatSort;
  displayedColumns = ['firstname', 'lastname', 'Status', 'Balance'];
  public filter$ = new BehaviorSubject(null);
  constructor(private memberService: MemberService, private router: Router) {}

  ngAfterViewInit() {}

  ngOnInit() {
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
          this.dataSource = new MatTableDataSource(this.memberList);
        } else {
          this.memberService.getMemberList().subscribe((members) => {
            this.memberList = members;
            this.dataSource = new MatTableDataSource(this.memberList);
            this.dataSource.sort = this.sort;
          });
        }
      });
  }

  applyFilter(filterstring) {
    this.filter$.next(filterstring);
  }

  clearFilter(filterInput) {
    this.filter$.next('');
    filterInput.value = '';
  }

  addMember(event) {
    this.router.navigate(['member/New']);
  }
}
