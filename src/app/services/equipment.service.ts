import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Equipment } from '../entities/equipment';

@Injectable()
export class EquipmentService {
  constructor(private http: HttpClient) {}

  getEquipmentList(): Observable<Equipment[]> {
    return this.http.get<Equipment[]>(environment.TonicAPIURL + `equipment`);
  }

  // getMember(id): Observable<Member> {
  //   //console.log('getting: ', `Members/${id}`);
  //   return this.http.get<Member>(environment.TonicAPIURL + `member/` + id);
  // }


  // saveMember(member: Member): Observable<any> {
  //   console.dir('saving', member);

  //   if (member.id == 'New') {
  //     return this.http.post<Member>(environment.TonicAPIURL + 'member', member);
  //     //      this.sendNotificationOfNewMember(member, snapshot.ref.id);
  //   } else {
  //     return this.http.put<Member>(environment.TonicAPIURL + 'member', member);
  //   }
  // }
}
