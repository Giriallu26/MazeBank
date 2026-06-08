import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { TransactionService } from '../../services/transaction.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, RouterModule],
  template: `
    <div class="container">
      <div class="page-header">
        <h2>Welcome, {{ auth.getFullName() }}!</h2>
      </div>

      <div class="card-grid">
        <div class="stat-card green">
          <h3>Total Balance</h3>
          <div class="value">₹{{ totalBalance | number:'1.2-2' }}</div>
          <mat-icon>₹</mat-icon>
        </div>
        <div class="stat-card orange">
          <h3>Recent Transactions</h3>
          <div class="value">{{ recentTransactions.length }}</div>
          <mat-icon>receipt_long</mat-icon>
        </div>
      </div>

      <!-- Quick Actions -->
      <mat-card class="quick-actions">
        <mat-card-header>
          <mat-card-title>Quick Actions</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="action-buttons">
            <button mat-raised-button color="primary" routerLink="/accounts" *ngIf="accounts.length === 0">
              <mat-icon>add</mat-icon> New Account
            </button>
            <button mat-raised-button color="accent" routerLink="/transactions">
              <mat-icon>swap_horiz</mat-icon> Transfer Money
            </button>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Recent Transactions -->
      <mat-card class="recent-section" *ngIf="recentTransactions.length > 0">
        <mat-card-header>
          <mat-card-title>Recent Transactions</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="transaction-list">
            <div class="transaction-item" *ngFor="let t of recentTransactions.slice(0, 5)">
              <div class="transaction-icon" [ngClass]="t.transactionType.toLowerCase()">
                <mat-icon>{{ getTransactionIcon(t.transactionType) }}</mat-icon>
              </div>
              <div class="transaction-details">
                <strong>{{ t.transactionType }}</strong>
                <span>{{ t.description }}</span>
              </div>
              <div class="transaction-amount" [ngClass]="(t.transactionType === 'DEPOSIT' || t.transactionType === 'CREDIT') ? 'credit' : 'debit'">
                {{ (t.transactionType === 'DEPOSIT' || t.transactionType === 'CREDIT') ? '+' : '-' }}₹{{ t.amount | number:'1.2-2' }}
              </div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .quick-actions { margin-bottom: 24px; }
    .recent-section { margin-bottom: 24px; }
    .transaction-list { display: flex; flex-direction: column; gap: 12px; margin-top: 16px; }
    .transaction-item { display: flex; align-items: center; gap: 16px; padding: 12px; border-radius: 8px; background: #f5f5f5; }
    .transaction-icon { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; }
    .transaction-icon.deposit { background: #4caf50; }
    .transaction-icon.withdrawal { background: #f44336; }
    .transaction-icon.transfer { background: #2196f3; }
    .transaction-icon.credit { background: #4caf50; }
    .transaction-details { flex: 1; display: flex; flex-direction: column; }
    .transaction-details span { font-size: 12px; color: #666; }
    .transaction-amount { font-weight: 500; font-size: 16px; }
    .transaction-amount.credit { color: #4caf50; }
    .transaction-amount.debit { color: #f44336; }
    .stat-card { position: relative; }
    .stat-card mat-icon { position: absolute; top: 16px; right: 16px; opacity: 0.3; font-size: 40px; width: 40px; height: 40px; }
  `]
})
export class DashboardComponent implements OnInit {
  accounts: any[] = [];
  totalBalance = 0;
  recentTransactions: any[] = [];

  constructor(
    private accountService: AccountService,
    private transactionService: TransactionService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    const customerId = this.auth.getCustomerId();
    this.accountService.getAccountsByCustomer(customerId).subscribe(accounts => {
      this.accounts = accounts;
      this.totalBalance = accounts.reduce((sum: number, acc: any) => sum + acc.balance, 0);
    });
    this.transactionService.getByCustomer(customerId).subscribe(txns => {
      this.recentTransactions = txns;
    });
  }

  getTransactionIcon(type: string): string {
    switch (type) {
      case 'DEPOSIT': return 'arrow_downward';
      case 'CREDIT': return 'arrow_downward';
      case 'WITHDRAWAL': return 'arrow_upward';
      case 'TRANSFER': return 'swap_horiz';
      default: return 'receipt';
    }
  }
}
