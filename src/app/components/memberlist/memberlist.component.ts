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
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
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
  public activeMemberCount: any = 'Counting...';
  dataSource;
  showInactive = false;

  @ViewChild(MatSort) sort: MatSort;
  displayedColumns = ['firstname', 'lastname', 'email', 'Status'];
  public filter$ = new BehaviorSubject(null);
  constructor(private memberService: MemberService, private router: Router) {}

  ngAfterViewInit() {}

  toggleShowInactive(toggle) {
    console.log(toggle.checked);
    this.showInactive = toggle.checked;
    this.filter$.next('');
  }

  ngOnInit() {
    this.filter$.pipe(debounceTime(400)).subscribe((filterstring) => {
      if (filterstring?.length > 0) {
        this.memberList = this.memberList.filter(
          (member) =>
            member.firstName
              .toLowerCase()
              .startsWith(filterstring.toLowerCase()) ||
            member.lastName.toLowerCase().startsWith(filterstring.toLowerCase())
        );

        if (!this.showInactive) {
          this.memberList = this.memberList.filter(
            (member) => member.status === 'Active'
          );
        }

        this.dataSource = new MatTableDataSource(this.memberList);
      } else {
        this.memberService.getMemberList().subscribe((members) => {
          this.memberList = members;

          if (this.showInactive) {
            this.dataSource = new MatTableDataSource(this.memberList);
          } else {
            this.dataSource = members.filter(
              (member) => member.status === 'Active'
            );
          }
          this.dataSource.sort = this.sort;
          this.activeMemberCount = this.memberList.filter(
            (member) => member.status === 'Active'
          ).length;
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
