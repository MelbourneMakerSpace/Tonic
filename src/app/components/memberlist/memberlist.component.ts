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
  currentListFilter = '';
  showInactive = false;

  @ViewChild(MatSort) sort: MatSort;
  displayedColumns = ['firstname', 'lastname', 'email', 'Status'];
  public filter$ = new BehaviorSubject('x');
  constructor(private memberService: MemberService, private router: Router) {}

  ngAfterViewInit() {}

  toggleShowInactive(toggle) {
    this.showInactive = toggle;
    sessionStorage.setItem('showInactive', toggle ? '1' : '0');
    this.filter$.next(this.currentListFilter);
  }

  ngOnInit() {
    this.filter$.pipe(debounceTime(400)).subscribe((filterstring) => {
      this.currentListFilter = filterstring;

      this.memberService.getMemberList().subscribe((members) => {
        this.memberList = members;

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
        }

        if (!this.showInactive) {
          this.memberList = this.memberList.filter(
            (member) => member.status === 'Active'
          );
        }

        this.dataSource = new MatTableDataSource(this.memberList);
        this.dataSource.sort = this.sort;

        this.activeMemberCount = this.memberList.filter(
          (member) => member.status === 'Active'
        ).length;
      });
    });

    this.showInactive = sessionStorage.getItem('showInactive') == '1';
    console.log('showInactive', this.showInactive);
    this.applyFilter(sessionStorage.getItem('filterString') ?? '');
  }

  applyFilter(filterstring: string) {
    sessionStorage.setItem('filterString', filterstring);
    this.filter$.next(filterstring);
  }

  clearFilter() {
    this.filter$.next('');
    this.currentListFilter = '';
  }

  addMember(event) {
    this.router.navigate(['member/New']);
  }
}
