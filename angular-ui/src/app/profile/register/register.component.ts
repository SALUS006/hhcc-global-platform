import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MockDataService } from '../../shared/mock-data.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container mt-3">
      <div class="register-card card">
        <h2>Create Your Account</h2>
        <p class="subtitle">Join HHCC to manage care for your family and pets.</p>

        <div *ngIf="success" class="alert alert-success">Account created successfully! <a routerLink="/">Go to Home</a></div>

        <form *ngIf="!success" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="fullName">Full Name *</label>
            <input id="fullName" class="form-control" [(ngModel)]="form.fullName" name="fullName" placeholder="e.g. John Doe" required>
          </div>
          <div class="form-group">
            <label for="email">Email Address *</label>
            <input id="email" type="email" class="form-control" [(ngModel)]="form.email" name="email" placeholder="e.g. john@email.com" required>
          </div>
          <div class="form-group">
            <label for="contact">Contact Number *</label>
            <input id="contact" class="form-control" [(ngModel)]="form.contactNumber" name="contactNumber" placeholder="e.g. 555-0101" required>
          </div>
          <div class="form-group">
            <label for="password">Password *</label>
            <input id="password" type="password" class="form-control" [(ngModel)]="password" name="password" placeholder="••••••••" required>
          </div>
          <div class="form-group">
            <label for="confirm">Confirm Password *</label>
            <input id="confirm" type="password" class="form-control" [(ngModel)]="confirmPassword" name="confirmPassword" placeholder="••••••••" required>
          </div>
          <div class="form-group">
            <label><input type="checkbox" [(ngModel)]="agreed" name="agreed"> I agree to Terms &amp; Conditions</label>
          </div>
          <div *ngIf="error" class="alert alert-error">{{ error }}</div>
          <button type="submit" class="btn btn-primary" style="width:100%">Register Now</button>
          <p class="text-center mt-2">Already have an account? <a routerLink="/">Login</a></p>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .register-card { max-width: 480px; margin: 0 auto; }
    .register-card h2 { font-size: 24px; margin-bottom: 4px; }
    .subtitle { color: var(--text-light); margin-bottom: 24px; }
    .alert { padding: 12px 16px; border-radius: var(--radius); margin-bottom: 16px; font-size: 14px; }
    .alert-success { background: #e8f5e9; color: var(--success); }
    .alert-error { background: #ffebee; color: var(--danger); }
  `]
})
export class RegisterComponent {
  form = { fullName: '', email: '', contactNumber: '', role: 'Customer' };
  password = '';
  confirmPassword = '';
  agreed = false;
  error = '';
  success = false;

  constructor(private mock: MockDataService) {}

  onSubmit() {
    this.error = '';
    if (!this.form.fullName || !this.form.email || !this.form.contactNumber) {
      this.error = 'Please fill in all required fields.'; return;
    }
    if (this.password.length < 6) { this.error = 'Password must be at least 6 characters.'; return; }
    if (this.password !== this.confirmPassword) { this.error = 'Passwords do not match.'; return; }
    if (!this.agreed) { this.error = 'You must agree to the Terms & Conditions.'; return; }
    this.mock.createProfile(this.form);
    this.success = true;
  }
}
