import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MemberService } from '../../services/member.service';

@Component({
  selector: 'app-memberlist',
  templateUrl: './memberlist.component.html',
  styles: []
})
export class MemberlistComponent implements OnInit {
  memberSnapshot: Observable<Member>;
  displayedColumns = ['Name', 'Actions'];
  constructor(private memberService: MemberService) {}

  ngOnInit() {
    this.memberSnapshot = this.memberService.getMemberList();
  }

  viewMember(Key) {
    console.log('Key:', Key);
  }

  addMember() {
    console.log('add member button');
  }
}
