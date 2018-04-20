import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MemberService } from '../../services/member.service';

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
  }`
  ]
})
export class MemberlistComponent implements OnInit {
  memberSnapshot: Observable<Member>;
  displayedColumns = ['Name'];
  constructor(private memberService: MemberService) {}

  ngOnInit() {
    this.memberSnapshot = this.memberService.getMemberList();
  }

  viewMember(Key) {
    console.log('Key:', Key);
  }

  addMember(event) {
    console.log('add member button');
  }
}
