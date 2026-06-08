import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  template: `
    <div class="register-container">
      <mat-card class="register-card">
        <div class="register-header">
          <mat-icon class="bank-icon">account_balance</mat-icon>
          <h1>Create Account</h1>
          <p>Join MazeBank today</p>
        </div>

        <mat-card-content>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Full Name</mat-label>
            <input matInput [(ngModel)]="customer.fullName">
            <mat-icon matPrefix>person</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email</mat-label>
            <input matInput [(ngModel)]="customer.email" type="email">
            <mat-icon matPrefix>email</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Phone Number</mat-label>
            <input matInput [(ngModel)]="customer.phoneNumber">
            <mat-icon matPrefix>phone</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Address</mat-label>
            <input matInput [(ngModel)]="customer.address">
            <mat-icon matPrefix>home</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Password</mat-label>
            <input matInput [(ngModel)]="customer.password" type="password">
            <mat-icon matPrefix>lock</mat-icon>
          </mat-form-field>

          <button mat-raised-button color="primary" class="full-width" (click)="register()" [disabled]="loading">
            {{ loading ? 'Registering...' : 'Register' }}
          </button>

          <div class="links">
            <a routerLink="/login">Already have an account? Login</a>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #1a237e 0%, #0d47a1 50%, #01579b 100%);
      padding: 20px;
    }
    .register-card {
      width: 100%;
      max-width: 450px;
      padding: 32px;
      border-radius: 16px;
    }
    .register-header {
      text-align: center;
      margin-bottom: 24px;
    }
    .bank-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #1a237e;
    }
    .register-header h1 {
      color: #1a237e;
      margin: 8px 0 4px;
    }
    .register-header p {
      color: #666;
    }
    .links {
      text-align: center;
      margin-top: 16px;
    }
    .links a {
      color: #1a237e;
      text-decoration: none;
    }
  `]
})
export class RegisterComponent {
  customer = { fullName: '', email: '', password: '', phoneNumber: '', address: '' };
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    // Client-side validation with specific constraint messages
    const errors: string[] = [];

    if (!this.customer.fullName.trim()) {
      errors.push('Full Name is required');
    }
    if (!this.customer.email.trim()) {
      errors.push('Email is required');
    } else {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(this.customer.email)) {
        errors.push('Invalid email format (e.g. user@example.com)');
      }
    }
    if (!this.customer.phoneNumber.trim()) {
      errors.push('Phone Number is required');
    } else {
      const phonePattern = /^[6-9]\d{9}$/;
      if (!phonePattern.test(this.customer.phoneNumber)) {
        errors.push('Invalid mobile number. Must be 10 digits starting with 6-9');
      }
    }
    if (!this.customer.password) {
      errors.push('Password is required');
    } else {
      if (this.customer.password.length < 8) {
        errors.push('Password must be at least 8 characters');
      }
      if (!/[A-Z]/.test(this.customer.password)) {
        errors.push('Password must contain at least one uppercase letter');
      }
      if (!/[a-z]/.test(this.customer.password)) {
        errors.push('Password must contain at least one lowercase letter');
      }
      if (!/\d/.test(this.customer.password)) {
        errors.push('Password must contain at least one digit');
      }
      if (!/[@#$%^&+=!]/.test(this.customer.password)) {
        errors.push('Password must contain at least one special character (@#$%^&+=!)');
      }
    }

    if (errors.length > 0) {
      alert('Please fix the following:\n\n' + errors.map(e => '• ' + e).join('\n'));
      return;
    }

    this.loading = true;
    this.authService.register(this.customer).subscribe({
      next: () => {
        alert('Registration successful! Redirecting to login...');
        this.router.navigate(['/login']);
        this.loading = false;
      },
      error: (err) => {
        alert(err.error?.message || 'Registration failed');
        this.loading = false;
      }
    });
  }
}
