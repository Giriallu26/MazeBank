import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule],
  template: `
    <mat-toolbar color="primary" class="navbar" *ngIf="auth.isLoggedIn()">
      <mat-icon class="logo-icon" [routerLink]="auth.getRole() === 'ADMIN' ? '/admin-dashboard' : '/dashboard'" style="cursor:pointer">account_balance</mat-icon>
      <span class="brand" [routerLink]="auth.getRole() === 'ADMIN' ? '/admin-dashboard' : '/dashboard'" style="cursor:pointer">MazeBank</span>

      <span class="spacer"></span>

      <!-- Customer Navigation -->
      <ng-container *ngIf="auth.getRole() === 'CUSTOMER'">
        <button mat-button routerLink="/dashboard" routerLinkActive="active-link">
          <mat-icon>dashboard</mat-icon> Dashboard
        </button>
        <button mat-button routerLink="/accounts" routerLinkActive="active-link">
          <mat-icon>account_balance_wallet</mat-icon> Accounts
        </button>
        <button mat-button routerLink="/transactions" routerLinkActive="active-link">
          <mat-icon>receipt_long</mat-icon> Transactions
        </button>
        <button mat-button routerLink="/profile" routerLinkActive="active-link">
          <mat-icon>person</mat-icon> Profile
        </button>
      </ng-container>

      <!-- Admin Navigation -->
      <ng-container *ngIf="auth.getRole() === 'ADMIN'">
        
      </ng-container>

      <!-- User menu -->
      <button mat-icon-button [matMenuTriggerFor]="userMenu">
        <mat-icon>account_circle</mat-icon>
      </button>
      <mat-menu #userMenu="matMenu">
        <div class="menu-header">{{ auth.getFullName() }}</div>
        <button mat-menu-item (click)="auth.logout()">
          <mat-icon>logout</mat-icon> Logout
        </button>
      </mat-menu>
    </mat-toolbar>
  `,
  styles: [`
    .navbar {
      position: sticky;
      top: 0;
      z-index: 1000;
    }
    .logo-icon {
      margin-right: 8px;
    }
    .brand {
      font-size: 20px;
      font-weight: 500;
    }
    .spacer {
      flex: 1;
    }
    .active-link {
      background: rgba(255,255,255,0.1);
      border-radius: 4px;
    }
    .menu-header {
      padding: 8px 16px;
      font-weight: 500;
      border-bottom: 1px solid #eee;
    }
    @media (max-width: 768px) {
      button[mat-button] span {
        display: none;
      }
    }
  `]
})
export class NavbarComponent {
  constructor(public auth: AuthService) {}
}
