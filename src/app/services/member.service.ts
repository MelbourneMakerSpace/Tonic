import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { DocumentReference } from '@firebase/firestore-types';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Member } from '../entities/member';
import { MemberPlan } from '../entities/memberPlan';

@Injectable()
export class MemberService {
  constructor(private http: HttpClient) {}

  getMemberList(): Observable<Member[]> {
    return this.http.get<Member[]>(environment.TonicAPIURL + `member`);
  }

  getMemberPlans(memberKey): Observable<MemberPlan[]> {
    return this.http.get<MemberPlan[]>(
      environment.TonicAPIURL + 'member/plans/' + memberKey
    );
  }

  isMemberActive(memberKey): Observable<boolean> {
    return this.http.get<boolean>(
      environment.TonicAPIURL + 'member/isActive/' + memberKey
    );
  }

  getPlan(Id): Observable<MemberPlan> {
    return this.http.get<MemberPlan>(environment.TonicAPIURL + 'plan/' + Id);
  }

  savePlan(plan: MemberPlan): Promise<any> {
    //console.log('saving plan', plan);
    return this.http
      .post(environment.TonicAPIURL + 'plan/memberplan', plan)
      .toPromise();
  }

  getMember(id): Observable<Member> {
    //console.log('getting: ', `Members/${id}`);
    return this.http.get<Member>(environment.TonicAPIURL + `member/` + id);
  }

  getMemberBalance(id): Observable<number> {
    return this.http.get<number>(
      environment.TonicAPIURL + `member/balance/` + id
    );
  }

  saveMember(member: Member): Observable<any> {
    console.dir('saving', member);

    if (member.id == 'New') {
      return this.http.post<Member>(environment.TonicAPIURL + 'member', member);
      //      this.sendNotificationOfNewMember(member, snapshot.ref.id);
    } else {
      return this.http.put<Member>(environment.TonicAPIURL + 'member', member);
    }
  }

  async sendNotificationOfNewMember(member: Member, id: string) {}
}
