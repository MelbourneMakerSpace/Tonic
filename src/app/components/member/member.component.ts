import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styles: []
})
export class MemberComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  back() {
    this.router.navigateByUrl('/memberlist');
  }

  save() {
    this.router.navigateByUrl('/memberlist');
  }
}
