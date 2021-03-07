import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { MemberPlan } from '../entities/memberPlan';
import { Plan } from '../entities/plan';
import { Transaction } from '../entities/transaction';

@Injectable()
export class TransactionService {
  constructor(private http: HttpClient) {}

  getMemberTransactionList(memberId): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(
      environment.TonicAPIURL + `Transaction/memberTransactions/${memberId}`
    );
  }

  getTransaction(id): Observable<Transaction> {
    return this.http.get<Transaction>(
      environment.TonicAPIURL + `Transaction/${id}`
    );
  }

  saveTransaction(transaction: Transaction): Promise<any> {
    console.log('saving Transaction to web service', transaction);
    return this.http
      .post(environment.TonicAPIURL + 'Transaction', transaction)
      .toPromise();
  }

  deleteTransaction(transaction: Transaction): Promise<any> {
    return this.http
      .delete(environment.TonicAPIURL + `Transaction/${transaction.id}`)
      .toPromise();
  }
}
