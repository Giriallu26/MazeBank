import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private baseUrl = 'http://localhost:6969/api/transactions';

  constructor(private http: HttpClient) {}

  deposit(accountId: number, amount: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/deposit`, { accountId, amount });
  }

  withdraw(accountId: number, amount: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/withdraw`, { accountId, amount });
  }

  transfer(fromAccountId: number, toAccountNumber: string, amount: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/transfer`, { fromAccountId, toAccountNumber, amount });
  }

  getByAccount(accountId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/account/${accountId}`);
  }

  getByCustomer(customerId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/customer/${customerId}`);
  }
}
