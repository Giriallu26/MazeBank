import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <div class="login-header">
          <mat-icon class="bank-icon">account_balance</mat-icon>
          <h1>MazeBank</h1>
          <p>Welcome back! Please login to your account.</p>
        </div>

        <mat-card-content>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email</mat-label>
            <input matInput [(ngModel)]="email" type="email" placeholder="Enter your email">
            <mat-icon matPrefix>email</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Password</mat-label>
            <input matInput [(ngModel)]="password" [type]="hidePassword ? 'password' : 'text'">
            <mat-icon matPrefix>lock</mat-icon>
            <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword">
              <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
          </mat-form-field>

          <button mat-raised-button color="primary" class="full-width login-btn" (click)="login()" [disabled]="loading">
            <mat-spinner *ngIf="loading" diameter="20"></mat-spinner>
            <span *ngIf="!loading">Login</span>
          </button>

          <div class="links">
            <a routerLink="/register">Don't have an account? Register</a>
            <a routerLink="/admin-login">Admin Login</a>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #1a237e 0%, #0d47a1 50%, #01579b 100%);
    }
    .login-card {
      width: 100%;
      max-width: 420px;
      padding: 40px;
      border-radius: 16px;
    }
    .login-header {
      text-align: center;
      margin-bottom: 32px;
    }
    .bank-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #1a237e;
    }
    .login-header h1 {
      color: #1a237e;
      margin: 8px 0 4px;
    }
    .login-header p {
      color: #666;
      font-size: 14px;
    }
    .login-btn {
      height: 48px;
      font-size: 16px;
      margin-top: 8px;
    }
    .links {
      display: flex;
      justify-content: space-between;
      margin-top: 16px;
    }
    .links a {
      color: #1a237e;
      text-decoration: none;
      font-size: 14px;
    }
    .links a:hover {
      text-decoration: underline;
    }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  hidePassword = true;
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    // Validate form fields
    if (!this.email || !this.password) {
      alert('Please fill in all fields:\n' +
        (!this.email ? '- Email is required\n' : '') +
        (!this.password ? '- Password is required\n' : ''));
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(this.email)) {
      alert('Please enter a valid email address');
      return;
    }

    this.loading = true;
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        alert('Login successful! Welcome back.');
        this.authService.saveUserData(res);
        this.router.navigate(['/dashboard']);
        this.loading = false;
      },
      error: (err) => {
        alert(err.error?.message || 'Login failed. Please check your credentials.');
        this.loading = false;
      }
    });
  }
}
