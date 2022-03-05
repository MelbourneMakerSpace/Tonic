import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AccessLog } from '../../../app/entities/accessLog';
import { AccessLogService } from '../../services/access-log.service';

@Component({
  selector: 'app-access-log',
  templateUrl: './access-log.component.html',
  styleUrls: ['./access-log.component.scss'],
})
export class AccessLogComponent implements OnInit {
  public accessLogReport = [];
  dataSource;

  @ViewChild(MatSort) sort: MatSort;
  displayedColumns = [
    'name',
    'status',
    'accessGranted',
    'message',
    'timestamp',
    'email',
  ];
  constructor(
    private accessLogService: AccessLogService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.accessLogService.getAccessLog().subscribe((accessList) => {
      console.log(`accessList: ${JSON.stringify(accessList[0].member.id)}`);
      this.accessLogReport = accessList;
      this.dataSource = new MatTableDataSource(this.accessLogReport);
      this.dataSource.sort = this.sort;

      // Required to sort by columns not top-level
      this.dataSource.sortingDataAccessor = (
        row: AccessLog,
        columnName: string
      ): string => {
        if (columnName == 'name') return row.member.firstName;
        if (columnName == 'status') return row.member.status;
        if (columnName == 'email') return row.member.email;

        var columnValue = row[columnName as keyof AccessLog] as string;
        return columnValue;
      };
    });
  }
}
