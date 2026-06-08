import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AdminService } from '../../services/admin.service';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatTableModule, MatTabsModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  template: `
    <div class="container">
      <div class="page-header">
        <h2>Admin Dashboard</h2>
      </div>

      <!-- Stats Cards -->
      <div class="card-grid">
        <div class="stat-card">
          <h3>Total Customers</h3>
          <div class="value">{{ stats.totalCustomers }}</div>
        </div>
        <div class="stat-card green">
          <h3>Total Accounts</h3>
          <div class="value">{{ stats.totalAccounts }}</div>
        </div>
        <div class="stat-card orange">
          <h3>Total Transactions</h3>
          <div class="value">{{ stats.totalTransactions }}</div>
        </div>
      </div>

      <!-- Tabs for details -->
      <mat-tab-group>
        <mat-tab label="Customers">
          <mat-card class="tab-card">
            <table mat-table [dataSource]="customers" class="full-width" *ngIf="customers.length > 0">
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef>ID</th>
                <td mat-cell *matCellDef="let c">{{ c.id }}</td>
              </ng-container>
              <ng-container matColumnDef="fullName">
                <th mat-header-cell *matHeaderCellDef>Name</th>
                <td mat-cell *matCellDef="let c">{{ c.fullName }}</td>
              </ng-container>
              <ng-container matColumnDef="email">
                <th mat-header-cell *matHeaderCellDef>Email</th>
                <td mat-cell *matCellDef="let c">{{ c.email }}</td>
              </ng-container>
              <ng-container matColumnDef="phoneNumber">
                <th mat-header-cell *matHeaderCellDef>Phone</th>
                <td mat-cell *matCellDef="let c">{{ c.phoneNumber }}</td>
              </ng-container>
              <ng-container matColumnDef="accountNumber">
                <th mat-header-cell *matHeaderCellDef>Account Number</th>
                <td mat-cell *matCellDef="let c">{{ getAccountNumberForCustomer(c.id) }}</td>
              </ng-container>
              <tr mat-header-row *matHeaderRowDef="['id','fullName','email','phoneNumber','accountNumber']"></tr>
              <tr mat-row *matRowDef="let row; columns: ['id','fullName','email','phoneNumber','accountNumber'];"></tr>
            </table>
          </mat-card>
        </mat-tab>

        <mat-tab label="Accounts">
          <mat-card class="tab-card">
            <table mat-table [dataSource]="accounts" class="full-width" *ngIf="accounts.length > 0">
              <ng-container matColumnDef="accountNumber">
                <th mat-header-cell *matHeaderCellDef>Account Number</th>
                <td mat-cell *matCellDef="let a">{{ a.accountNumber }}</td>
              </ng-container>
              <ng-container matColumnDef="customerName">
                <th mat-header-cell *matHeaderCellDef>Customer Name</th>
                <td mat-cell *matCellDef="let a">{{ a.customer?.fullName }}</td>
              </ng-container>
              <ng-container matColumnDef="accountType">
                <th mat-header-cell *matHeaderCellDef>Type</th>
                <td mat-cell *matCellDef="let a">{{ a.accountType }}</td>
              </ng-container>
              <ng-container matColumnDef="balance">
                <th mat-header-cell *matHeaderCellDef>Balance</th>
                <td mat-cell *matCellDef="let a">₹{{ a.balance | number:'1.2-2' }}</td>
              </ng-container>
              <ng-container matColumnDef="active">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let a">
                  <span [class]="a.active ? 'active-badge' : 'inactive-badge'">{{ a.active ? 'Active' : 'Inactive' }}</span>
                </td>
              </ng-container>
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let a">
                  <button mat-icon-button color="warn" *ngIf="a.active" (click)="deactivateAccount(a.id)">
                    <mat-icon>block</mat-icon>
                  </button>
                  <button mat-icon-button color="primary" *ngIf="!a.active" (click)="activateAccount(a.id)">
                    <mat-icon>check_circle</mat-icon>
                  </button>
                </td>
              </ng-container>
              <tr mat-header-row *matHeaderRowDef="['accountNumber','customerName','accountType','balance','active','actions']"></tr>
              <tr mat-row *matRowDef="let row; columns: ['accountNumber','customerName','accountType','balance','active','actions'];"></tr>
            </table>
          </mat-card>
        </mat-tab>

        <mat-tab label="Transactions">
          <mat-card class="tab-card">
            <div class="filter-row">
              <mat-form-field appearance="outline">
                <mat-label>Account Number</mat-label>
                <input matInput [(ngModel)]="txnFilters.accountNumber" placeholder="Enter account number" (ngModelChange)="filterTransactions()">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Transaction Type</mat-label>
                <mat-select [(ngModel)]="txnFilters.transactionType" (ngModelChange)="filterTransactions()">
                  <mat-option value="">All</mat-option>
                  <mat-option value="DEPOSIT">Deposit</mat-option>
                  <mat-option value="WITHDRAWAL">Withdrawal</mat-option>
                  <mat-option value="TRANSFER">Transfer</mat-option>
                </mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>From Date</mat-label>
                <input matInput type="date" [(ngModel)]="txnFilters.startDate" [max]="today" (ngModelChange)="filterTransactions()">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>To Date</mat-label>
                <input matInput type="date" [(ngModel)]="txnFilters.endDate" [min]="txnFilters.startDate" [max]="today" (ngModelChange)="filterTransactions()">
              </mat-form-field>
              <button mat-raised-button color="warn" class="clear-btn" (click)="clearFilters()">Clear</button>
            </div>
            <table mat-table [dataSource]="transactions" class="full-width" *ngIf="transactions.length > 0">
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef>ID</th>
                <td mat-cell *matCellDef="let t">{{ t.id }}</td>
              </ng-container>
              <ng-container matColumnDef="transactionType">
                <th mat-header-cell *matHeaderCellDef>Type</th>
                <td mat-cell *matCellDef="let t">{{ t.transactionType }}</td>
              </ng-container>
              <ng-container matColumnDef="amount">
                <th mat-header-cell *matHeaderCellDef>Amount</th>
                <td mat-cell *matCellDef="let t">₹{{ t.amount | number:'1.2-2' }}</td>
              </ng-container>
              <ng-container matColumnDef="accountNumber">
                <th mat-header-cell *matHeaderCellDef>Account Number</th>
                <td mat-cell *matCellDef="let t">{{ t.account?.accountNumber }}</td>
              </ng-container>
              <ng-container matColumnDef="transactionDate">
                <th mat-header-cell *matHeaderCellDef>Date</th>
                <td mat-cell *matCellDef="let t">{{ t.transactionDate | date:'medium' }}</td>
              </ng-container>
              <ng-container matColumnDef="description">
                <th mat-header-cell *matHeaderCellDef>Description</th>
                <td mat-cell *matCellDef="let t">{{ t.description }}</td>
              </ng-container>
              <tr mat-header-row *matHeaderRowDef="['id','transactionType','amount','accountNumber','transactionDate','description']"></tr>
              <tr mat-row *matRowDef="let row; columns: ['id','transactionType','amount','accountNumber','transactionDate','description'];"></tr>
            </table>
            <p *ngIf="transactions.length === 0" style="padding: 16px;">No transactions found.</p>
          </mat-card>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .tab-card { margin-top: 16px; padding: 16px; }
    .filter-row { display: flex; gap: 16px; align-items: flex-end; flex-wrap: wrap; padding: 16px 0; }
    .filter-row mat-form-field { flex: 1; min-width: 180px; }
    .clear-btn { height: 56px; margin-bottom: 22px; min-width: 80px; }
    .active-badge { background: #e8f5e9; color: #2e7d32; padding: 4px 12px; border-radius: 12px; font-size: 12px; }
    .inactive-badge { background: #ffebee; color: #c62828; padding: 4px 12px; border-radius: 12px; font-size: 12px; }
    .full-width { width: 100%; }
  `]
})
export class AdminDashboardComponent implements OnInit {
  stats: any = { totalCustomers: 0, totalAccounts: 0, totalTransactions: 0 };
  customers: any[] = [];
  accounts: any[] = [];
  transactions: any[] = [];
  txnFilters: any = { transactionType: '', accountNumber: '', startDate: '', endDate: '' };
  today: string = new Date().toISOString().split('T')[0];

  constructor(private adminService: AdminService, private accountService: AccountService) {}

  ngOnInit() {
    this.adminService.getDashboard().subscribe(data => this.stats = data);
    this.adminService.getAllCustomers().subscribe(data => this.customers = data);
    this.loadAccounts();
    this.loadTransactions();
  }

  loadTransactions() {
    this.adminService.getAllTransactions().subscribe(data => this.transactions = data);
  }

  filterTransactions() {
    const params: any = {};
    if (this.txnFilters.transactionType) params.transactionType = this.txnFilters.transactionType;
    if (this.txnFilters.accountNumber) params.accountNumber = this.txnFilters.accountNumber;
    if (this.txnFilters.startDate) params.startDate = this.txnFilters.startDate;
    if (this.txnFilters.endDate) params.endDate = this.txnFilters.endDate;
    if (Object.keys(params).length === 0) {
      this.loadTransactions();
      return;
    }
    this.adminService.getFilteredTransactions(params).subscribe(data => this.transactions = data);
  }

  clearFilters() {
    this.txnFilters = { transactionType: '', accountNumber: '', startDate: '', endDate: '' };
    this.loadTransactions();
  }

  loadAccounts() {
    this.adminService.getAllAccounts().subscribe(data => this.accounts = data);
  }

  activateAccount(id: number) {
    this.accountService.activateAccount(id).subscribe({
      next: () => { alert('Account activated successfully!'); this.loadAccounts(); },
      error: (err: any) => { alert(err.error?.message || 'Failed to activate account'); }
    });
  }

  deactivateAccount(id: number) {
    this.accountService.deactivateAccount(id).subscribe({
      next: () => { alert('Account deactivated successfully!'); this.loadAccounts(); },
      error: (err: any) => { alert(err.error?.message || 'Failed to deactivate account'); }
    });
  }

  getAccountNumberForCustomer(customerId: number): string {
    const acc = this.accounts.find(a => a.customer?.id === customerId);
    return acc ? acc.accountNumber : 'N/A';
  }
}
