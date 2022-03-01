import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AccessLogService } from '../../services/access-log.service';

@Component({
  selector: 'app-access-log',
  templateUrl: './access-log.component.html',
  styles: [],
})
export class AccessLogComponent implements OnInit {
  public accessLogReport = [];
  dataSource;

  @ViewChild(MatSort) sort: MatSort;
  displayedColumns = [
    // 'firstname',
    // 'lastname',
    'name',
    'Status',
    'accessGranted',
    'message',
    'time',
    'email',
  ];
  constructor(
    private accessLogService: AccessLogService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.accessLogService.getAccessLog().subscribe((accessList) => {
      this.accessLogReport = accessList;
      // console.log(`accessLogReport: ${this.accessLogReport}`);
      // console.log(`accessLogReport: ${this.accessLogReport[0].message}`);
      this.dataSource = new MatTableDataSource(this.accessLogReport);
    });
  }
}
