import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CustomerService } from '../../services/customer.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  template: `
    <div class="container">
      <div class="page-header">
        <h2>My Profile</h2>
      </div>

      <mat-card class="profile-card">
        <mat-card-content>
          <div class="success-message" *ngIf="successMsg">{{ successMsg }}</div>
          <div class="error-message" *ngIf="errorMsg">{{ errorMsg }}</div>

          <div class="profile-form">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Full Name</mat-label>
              <input matInput [(ngModel)]="customer.fullName">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput [value]="customer.email" disabled>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Phone Number</mat-label>
              <input matInput [(ngModel)]="customer.phoneNumber">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Address</mat-label>
              <input matInput [(ngModel)]="customer.address">
            </mat-form-field>

            <button mat-raised-button color="primary" (click)="updateProfile()">
              <mat-icon>save</mat-icon> Update Profile
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .profile-card { max-width: 600px; padding: 24px; }
    .profile-form { display: flex; flex-direction: column; gap: 8px; }
  `]
})
export class ProfileComponent implements OnInit {
  customer: any = {};
  successMsg = '';
  errorMsg = '';

  constructor(private customerService: CustomerService, private auth: AuthService) {}

  ngOnInit() {
    this.customerService.getCustomerById(this.auth.getCustomerId()).subscribe(data => {
      this.customer = data;
    });
  }

  updateProfile() {
    this.successMsg = '';
    this.errorMsg = '';
    this.customerService.updateCustomer(this.auth.getCustomerId(), this.customer).subscribe({
      next: () => { this.successMsg = 'Profile updated successfully!'; },
      error: (err: any) => { this.errorMsg = err.error?.message || 'Update failed'; }
    });
  }
}
