import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AccessLog } from '../entities/accessLog';

@Injectable()
export class AccessLogService {
  constructor(private http: HttpClient) {}

  getAccessLog(): Observable<AccessLog[]> {
    return this.http.get<AccessLog[]>(
      environment.TonicAPIURL + `accessLog/getAccessLog`
    );
  }
}
