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
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <div class="login-header">
          <mat-icon class="bank-icon">admin_panel_settings</mat-icon>
          <h1>Admin Login</h1>
          <p>Access the admin dashboard</p>
        </div>

        <mat-card-content>
          <div class="error-message" *ngIf="errorMessage">{{ errorMessage }}</div>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Username</mat-label>
            <input matInput [(ngModel)]="username">
            <mat-icon matPrefix>person</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Password</mat-label>
            <input matInput [(ngModel)]="password" type="password">
            <mat-icon matPrefix>lock</mat-icon>
          </mat-form-field>

          <button mat-raised-button color="warn" class="full-width" (click)="login()">
            Admin Login
          </button>

          <div class="links">
            <a routerLink="/login">Customer Login</a>
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
      background: linear-gradient(135deg, #311b92 0%, #4a148c 100%);
    }
    .login-card {
      width: 100%;
      max-width: 400px;
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
      color: #4a148c;
    }
    .login-header h1 { color: #4a148c; }
    .login-header p { color: #666; }
    .links { text-align: center; margin-top: 16px; }
    .links a { color: #4a148c; text-decoration: none; }
  `]
})
export class AdminLoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.errorMessage = '';
    this.authService.adminLogin({ username: this.username, password: this.password }).subscribe({
      next: (res) => {
        this.authService.saveUserData(res);
        this.router.navigate(['/admin']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Login failed';
      }
    });
  }
}
