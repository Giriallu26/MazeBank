import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { AccountService } from '../../services/account.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, MatTableModule, MatChipsModule],
  template: `
    <div class="container">
      <div class="page-header">
        <h2>Account Management</h2>
      </div>

      <!-- Create Account Section -->
      <mat-card class="create-account-card" *ngIf="accounts.length === 0">
        <mat-card-header>
          <mat-card-title>Create Bank Account</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="create-form">
            <mat-form-field appearance="outline">
              <mat-label>Aadhar Number (12 digits)</mat-label>
              <input matInput [(ngModel)]="aadharNumber" maxlength="12" placeholder="Enter 12-digit Aadhar number">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>PAN Number</mat-label>
              <input matInput [(ngModel)]="panNumber" maxlength="10" placeholder="e.g. ABCDE1234F" style="text-transform: uppercase;">
            </mat-form-field>
            <button mat-raised-button color="primary" (click)="createAccount()">
              <mat-icon>add</mat-icon> Create Savings Account
            </button>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Accounts List -->
      <mat-card>
        <mat-card-header>
          <mat-card-title>My Accounts</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="accounts" class="full-width" *ngIf="accounts.length > 0">
            <ng-container matColumnDef="accountNumber">
              <th mat-header-cell *matHeaderCellDef>Account Number</th>
              <td mat-cell *matCellDef="let acc">{{ acc.accountNumber }}</td>
            </ng-container>
            <ng-container matColumnDef="type">
              <th mat-header-cell *matHeaderCellDef>Type</th>
              <td mat-cell *matCellDef="let acc">{{ acc.accountType }}</td>
            </ng-container>
            <ng-container matColumnDef="balance">
              <th mat-header-cell *matHeaderCellDef>Balance</th>
              <td mat-cell *matCellDef="let acc">₹{{ acc.balance | number:'1.2-2' }}</td>
            </ng-container>
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let acc">
                <span [class]="acc.active ? 'active-badge' : 'inactive-badge'">
                  {{ acc.active ? 'Active' : 'Inactive' }}
                </span>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
          <p *ngIf="accounts.length === 0" class="no-data">No accounts found. Create one above!</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .create-account-card { margin-bottom: 24px; }
    .create-form { display: flex; gap: 16px; align-items: center; flex-wrap: wrap; }
    .active-badge { background: #e8f5e9; color: #2e7d32; padding: 4px 12px; border-radius: 12px; font-size: 12px; }
    .inactive-badge { background: #ffebee; color: #c62828; padding: 4px 12px; border-radius: 12px; font-size: 12px; }
    .no-data { text-align: center; color: #666; padding: 32px; }
  `]
})
export class AccountsComponent implements OnInit {
  accounts: any[] = [];
  aadharNumber = '';
  panNumber = '';
  displayedColumns = ['accountNumber', 'type', 'balance', 'status'];

  constructor(private accountService: AccountService, private auth: AuthService) {}

  ngOnInit() {
    this.loadAccounts();
  }

  loadAccounts() {
    this.accountService.getAccountsByCustomer(this.auth.getCustomerId()).subscribe(data => {
      this.accounts = data;
    });
  }

  createAccount() {
    // Client-side validation with alert
    const errors: string[] = [];

    if (!this.aadharNumber.trim()) {
      errors.push('Aadhar Number is required');
    } else if (!/^\d{12}$/.test(this.aadharNumber)) {
      errors.push('Aadhar Number must be exactly 12 digits');
    }

    if (!this.panNumber.trim()) {
      errors.push('PAN Number is required');
    } else if (!/^[A-Z]{5}\d{4}[A-Z]$/.test(this.panNumber.toUpperCase())) {
      errors.push('Invalid PAN format. Must be like ABCDE1234F');
    }

    if (errors.length > 0) {
      alert('Please fix the following:\n\n' + errors.map(e => '• ' + e).join('\n'));
      return;
    }

    this.accountService.createAccount(this.auth.getCustomerId(), {
      aadharNumber: this.aadharNumber,
      panNumber: this.panNumber.toUpperCase()
    }).subscribe({
      next: (acc: any) => {
        alert('Savings Account created successfully!\nAccount Number: ' + acc.accountNumber);
        this.aadharNumber = '';
        this.panNumber = '';
        this.loadAccounts();
      },
      error: (err: any) => {
        alert(err.error?.message || 'Failed to create account');
      }
    });
  }


}
