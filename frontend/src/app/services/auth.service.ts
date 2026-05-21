import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost:6969/api/auth';

  constructor(private http: HttpClient, private router: Router) {}

  // Customer registration
  register(customer: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, customer);
  }

  // Customer login
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials);
  }

  // Admin login
  adminLogin(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/login`, credentials);
  }

  // Save token and user data to localStorage
  saveUserData(data: any): void {
    localStorage.setItem('token', data.token);
    localStorage.setItem('customerId', data.customerId);
    localStorage.setItem('fullName', data.fullName);
    localStorage.setItem('email', data.email);
    localStorage.setItem('role', data.role);
  }

  // Logout
  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // Get current user role
  getRole(): string {
    return localStorage.getItem('role') || '';
  }

  // Get current customer ID
  getCustomerId(): string {
    return localStorage.getItem('customerId') || '';
  }

  getFullName(): string {
    return localStorage.getItem('fullName') || '';
  }
}
