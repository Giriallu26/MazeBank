import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatTabsModule],
  template: `
    <div class="container">
      <div class="page-header">
        <h2>Admin Dashboard</h2>
        <p>System overview and monitoring</p>
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
              <tr mat-header-row *matHeaderRowDef="['id','fullName','email','phoneNumber']"></tr>
              <tr mat-row *matRowDef="let row; columns: ['id','fullName','email','phoneNumber'];"></tr>
            </table>
          </mat-card>
        </mat-tab>

        <mat-tab label="Accounts">
          <mat-card class="tab-card">
            <table mat-table [dataSource]="accounts" class="full-width" *ngIf="accounts.length > 0">
              <ng-container matColumnDef="accountNumber">
                <th mat-header-cell *matHeaderCellDef>Account #</th>
                <td mat-cell *matCellDef="let a">{{ a.accountNumber }}</td>
              </ng-container>
              <ng-container matColumnDef="accountType">
                <th mat-header-cell *matHeaderCellDef>Type</th>
                <td mat-cell *matCellDef="let a">{{ a.accountType }}</td>
              </ng-container>
              <ng-container matColumnDef="balance">
                <th mat-header-cell *matHeaderCellDef>Balance</th>
                <td mat-cell *matCellDef="let a">\${{ a.balance | number:'1.2-2' }}</td>
              </ng-container>
              <ng-container matColumnDef="active">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let a">{{ a.active ? 'Active' : 'Inactive' }}</td>
              </ng-container>
              <tr mat-header-row *matHeaderRowDef="['accountNumber','accountType','balance','active']"></tr>
              <tr mat-row *matRowDef="let row; columns: ['accountNumber','accountType','balance','active'];"></tr>
            </table>
          </mat-card>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .tab-card { margin-top: 16px; }
    .filter-row { display: flex; gap: 16px; align-items: center; flex-wrap: wrap; padding: 16px 0; }
  `]
})
export class AdminDashboardComponent implements OnInit {
  stats: any = { totalCustomers: 0, totalAccounts: 0, totalTransactions: 0 };
  customers: any[] = [];
  accounts: any[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.adminService.getDashboard().subscribe(data => this.stats = data);
    this.adminService.getAllCustomers().subscribe(data => this.customers = data);
    this.adminService.getAllAccounts().subscribe(data => this.accounts = data);
  }
}
