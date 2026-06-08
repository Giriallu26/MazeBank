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
import { MatTabsModule } from '@angular/material/tabs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { TransactionService } from '../../services/transaction.service';
import { AccountService } from '../../services/account.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, MatTableModule, MatTabsModule, MatDatepickerModule, MatNativeDateModule],
  template: `
    <div class="container">
      <div class="page-header">
        <h2>Transactions</h2>
      </div>

      <mat-tab-group>
        <!-- Deposit Tab -->
        <mat-tab label="Deposit">
          <mat-card class="tab-card">
            <mat-card-content>
              <div class="transaction-form">
                <div class="account-info" *ngIf="account">
                  <span class="account-label">Account:</span> {{ account.accountNumber }} ({{ account.accountType }}) - Balance: ₹{{ account.balance | number:'1.2-2' }}
                </div>
                <mat-form-field appearance="outline" floatLabel="always" class="full-width">
                  <mat-label>Amount</mat-label>
                  <span matTextPrefix>₹&nbsp;</span>
                  <input matInput type="number" placeholder="0.00" [(ngModel)]="depositAmount">
                </mat-form-field>
                <button mat-raised-button color="primary" (click)="deposit()">
                  <mat-icon>arrow_downward</mat-icon> Deposit
                </button>
              </div>
            </mat-card-content>
          </mat-card>
        </mat-tab>

        <!-- Withdraw Tab -->
        <mat-tab label="Withdraw">
          <mat-card class="tab-card">
            <mat-card-content>
              <div class="transaction-form">
                <div class="account-info" *ngIf="account">
                  <span class="account-label">Account:</span> {{ account.accountNumber }} ({{ account.accountType }}) - Balance: ₹{{ account.balance | number:'1.2-2' }}
                </div>
                <mat-form-field appearance="outline" floatLabel="always" class="full-width">
                  <mat-label>Amount</mat-label>
                  <span matTextPrefix>₹&nbsp;</span>
                  <input matInput type="number" placeholder="0.00" [(ngModel)]="withdrawAmount">
                </mat-form-field>
                <button mat-raised-button color="warn" (click)="withdraw()">
                  <mat-icon>arrow_upward</mat-icon> Withdraw
                </button>
              </div>
            </mat-card-content>
          </mat-card>
        </mat-tab>

        <!-- Transfer Tab -->
        <mat-tab label="Transfer">
          <mat-card class="tab-card">
            <mat-card-content>
              <div class="transaction-form">
                <div class="account-info" *ngIf="account">
                  <span class="account-label">From Account:</span> {{ account.accountNumber }} - Balance: ₹{{ account.balance | number:'1.2-2' }}
                </div>
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>To Account Number</mat-label>
                  <input matInput [(ngModel)]="transferToNumber" placeholder="Enter destination account number">
                </mat-form-field>
                <mat-form-field appearance="outline" floatLabel="always" class="full-width">
                  <mat-label>Amount</mat-label>
                  <span matTextPrefix>₹&nbsp;</span>
                  <input matInput type="number" placeholder="0.00" [(ngModel)]="transferAmount">
                </mat-form-field>
                <button mat-raised-button color="accent" (click)="transfer()">
                  <mat-icon>swap_horiz</mat-icon> Transfer
                </button>
              </div>
            </mat-card-content>
          </mat-card>
        </mat-tab>

        <!-- History Tab -->
        <mat-tab label="History">
          <mat-card class="tab-card">
            <mat-card-content>
              <div class="filter-row">
                <mat-form-field appearance="outline">
                  <mat-label>Filter by Type</mat-label>
                  <mat-select [(ngModel)]="filterType" (selectionChange)="applyFilters()">
                    <mat-option value="ALL">All</mat-option>
                    <mat-option value="DEPOSIT">Deposit</mat-option>
                    <mat-option value="WITHDRAWAL">Withdrawal</mat-option>
                    <mat-option value="TRANSFER">Transfer</mat-option>
                    <mat-option value="CREDIT">Credit</mat-option>
                  </mat-select>
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>From Date</mat-label>
                  <input matInput [matDatepicker]="fromPicker" [(ngModel)]="filterFromDate" [max]="maxDate" (dateChange)="applyFilters()">
                  <mat-datepicker-toggle matSuffix [for]="fromPicker"></mat-datepicker-toggle>
                  <mat-datepicker #fromPicker></mat-datepicker>
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>To Date</mat-label>
                  <input matInput [matDatepicker]="toPicker" [(ngModel)]="filterToDate" [min]="filterFromDate" [max]="maxDate" (dateChange)="applyFilters()">
                  <mat-datepicker-toggle matSuffix [for]="toPicker"></mat-datepicker-toggle>
                  <mat-datepicker #toPicker></mat-datepicker>
                </mat-form-field>
                <button mat-raised-button color="warn" (click)="clearFilters()">
                  <mat-icon>clear</mat-icon> Clear
                </button>
              </div>
              <table mat-table [dataSource]="filteredTransactions" class="full-width" *ngIf="filteredTransactions.length > 0">
                <ng-container matColumnDef="date">
                  <th mat-header-cell *matHeaderCellDef>Date</th>
                  <td mat-cell *matCellDef="let t">{{ t.transactionDate | date:'short' }}</td>
                </ng-container>
                <ng-container matColumnDef="type">
                  <th mat-header-cell *matHeaderCellDef>Type</th>
                  <td mat-cell *matCellDef="let t">{{ t.transactionType }}</td>
                </ng-container>
                <ng-container matColumnDef="amount">
                  <th mat-header-cell *matHeaderCellDef>Amount</th>
                  <td mat-cell *matCellDef="let t" [style.color]="(t.transactionType === 'DEPOSIT' || t.transactionType === 'CREDIT') ? '#4caf50' : '#f44336'">
                    {{ (t.transactionType === 'DEPOSIT' || t.transactionType === 'CREDIT') ? '+' : '-' }}₹{{ t.amount | number:'1.2-2' }}
                  </td>
                </ng-container>
                <ng-container matColumnDef="description">
                  <th mat-header-cell *matHeaderCellDef>Description</th>
                  <td mat-cell *matCellDef="let t">{{ t.description }}</td>
                </ng-container>
                <tr mat-header-row *matHeaderRowDef="historyColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: historyColumns;"></tr>
              </table>
              <p *ngIf="filteredTransactions.length === 0" class="no-data">No transactions found.</p>
            </mat-card-content>
          </mat-card>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .tab-card { margin-top: 16px; }
    .transaction-form { display: flex; flex-direction: column; gap: 8px; max-width: 500px; padding: 16px 0; }
    .filter-row { display: flex; gap: 16px; align-items: center; flex-wrap: wrap; padding: 16px 0; }
    .no-data { text-align: center; color: #666; padding: 32px; }
    .account-info { background: #fff; padding: 16px; border-radius: 4px; font-size: 14px; color: #333; border: 1px solid rgba(0,0,0,0.38); width: 100%; box-sizing: border-box; line-height: 1.5; }
    .account-label { font-weight: 500; color: rgba(0,0,0,0.6); }
  `]
})
export class TransactionsComponent implements OnInit {
  accounts: any[] = [];
  account: any = null;
  transactions: any[] = [];
  filteredTransactions: any[] = [];
  historyColumns = ['date', 'type', 'amount', 'description'];
  filterType = 'ALL';
  filterFromDate: Date | null = null;
  filterToDate: Date | null = null;
  maxDate: Date = new Date();

  depositAmount: number | null = null;
  withdrawAmount: number | null = null;

  transferToNumber = '';
  transferAmount: number | null = null;

  constructor(
    private transactionService: TransactionService,
    private accountService: AccountService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.loadAccounts();
    this.loadTransactions();
  }

  loadAccounts() {
    this.accountService.getAccountsByCustomer(this.auth.getCustomerId()).subscribe(data => {
      this.accounts = data;
      if (data.length > 0) {
        this.account = data[0];
      }
    });
  }

  loadTransactions() {
    this.transactionService.getByCustomer(this.auth.getCustomerId()).subscribe(data => {
      this.transactions = data;
      this.applyFilters();
    });
  }

  applyFilters() {
    this.filteredTransactions = this.transactions.filter(t => {
      if (this.filterType !== 'ALL' && t.transactionType !== this.filterType) return false;
      const txDate = new Date(t.transactionDate);
      if (this.filterFromDate) {
        const from = new Date(this.filterFromDate); from.setHours(0,0,0,0);
        if (txDate < from) return false;
      }
      if (this.filterToDate) {
        const to = new Date(this.filterToDate); to.setHours(23,59,59,999);
        if (txDate > to) return false;
      }
      return true;
    });
  }

  clearFilters() {
    this.filterType = 'ALL';
    this.filterFromDate = null;
    this.filterToDate = null;
    this.applyFilters();
  }

  deposit() {
    if (!this.account) { alert('No account found'); return; }
    if (!this.depositAmount || this.depositAmount <= 0) { alert('Please enter a valid amount greater than 0'); return; }
    this.transactionService.deposit(this.account.id, this.depositAmount).subscribe({
      next: () => { alert('Deposit successful!'); window.location.reload(); },
      error: (err: any) => { alert(err.error?.message || 'Deposit failed'); window.location.reload(); }
    });
  }

  withdraw() {
    if (!this.account) { alert('No account found'); return; }
    if (!this.withdrawAmount || this.withdrawAmount <= 0) { alert('Please enter a valid amount greater than 0'); return; }
    this.transactionService.withdraw(this.account.id, this.withdrawAmount).subscribe({
      next: () => { alert('Withdrawal successful!'); window.location.reload(); },
      error: (err: any) => { alert(err.error?.message || 'Withdrawal failed'); window.location.reload(); }
    });
  }

  transfer() {
    const errors: string[] = [];
    if (!this.account) errors.push('No account found');
    if (!this.transferToNumber.trim()) errors.push('Please enter destination account number');
    if (!this.transferAmount || this.transferAmount <= 0) errors.push('Please enter a valid amount greater than 0');
    if (errors.length > 0) { alert(errors.join('\n')); return; }

    // Self-transfer check
    if (this.account.accountNumber === this.transferToNumber.trim()) {
      alert('Self-transfer is not allowed. Please enter a different destination account.');
      return;
    }

    this.transactionService.transfer(this.account.id, this.transferToNumber, this.transferAmount!).subscribe({
      next: () => { alert('Transfer successful!'); window.location.reload(); },
      error: (err: any) => { alert(err.error?.message || 'Transfer failed'); window.location.reload(); }
    });
  }
}
