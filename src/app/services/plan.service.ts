import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { MemberPlan } from "../entities/memberPlan";
import { Plan } from "../entities/plan";

@Injectable()
export class PlanService {
  constructor(private http: HttpClient) {}

  getPlanList(): Observable<Plan[]> {
    return this.http.get<Plan[]>(environment.TonicAPIURL + `plan`);
  }
}
