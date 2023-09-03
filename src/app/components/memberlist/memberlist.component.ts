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
  currentListFilter = null;

  @ViewChild(MatSort) sort: MatSort;
  displayedColumns = ['firstname', 'lastname', 'email', 'Status'];
  public filter$ = new BehaviorSubject(null);
  constructor(private memberService: MemberService, private router: Router) {}

  ngAfterViewInit() {}

  toggleShowInactive(toggle) {
    this.showInactive = toggle.checked;
    this.filter$.next(this.currentListFilter);
  }

  public get showInactive(): boolean {
    console.log(`showInactive: ${sessionStorage.getItem('showInactive')}`);
    return sessionStorage.getItem('showInactive') == '1' ? true : false;
  }

  public set showInactive(flag: boolean) {
    sessionStorage.setItem('showInactive', flag ? '1' : '0');
  }

  ngOnInit() {
    this.filter$.pipe(debounceTime(400)).subscribe((filterstring) => {
      this.currentListFilter = filterstring;

      if (filterstring?.length > 0) {
        // Need to set memberList = members so that we re-search the whole
        // list, not just the current filtered list
        this.memberService.getMemberList().subscribe((members) => {
          this.memberList = members;
        });

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

  applyFilter(filterstring: string) {
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
