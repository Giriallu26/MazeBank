import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private baseUrl = 'http://localhost:6969/api/customers';

  constructor(private http: HttpClient) {}

  getCustomerById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  updateCustomer(id: string, customer: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, customer);
  }
}
