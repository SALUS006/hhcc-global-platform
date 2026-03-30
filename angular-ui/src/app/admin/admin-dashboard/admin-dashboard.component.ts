import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MockDataService } from '../../shared/mock-data.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mt-3">
      <div class="page-header"><h1>Admin Dashboard</h1></div>

      <!-- KPI Cards -->
      <div class="grid grid-4 mb-3">
        <div class="card kpi-card">
          <div class="kpi-icon">👥</div>
          <div class="kpi-value">{{ stats.users }}</div>
          <div class="kpi-label">Users</div>
        </div>
        <div class="card kpi-card">
          <div class="kpi-icon">📅</div>
          <div class="kpi-value">{{ stats.bookings }}</div>
          <div class="kpi-label">Bookings</div>
        </div>
        <div class="card kpi-card">
          <div class="kpi-icon">💰</div>
          <div class="kpi-value">\${{ stats.revenue.toFixed(0) }}</div>
          <div class="kpi-label">Revenue</div>
        </div>
        <div class="card kpi-card">
          <div class="kpi-icon">🏢</div>
          <div class="kpi-value">{{ stats.facilities }}</div>
          <div class="kpi-label">Facilities</div>
        </div>
      </div>

      <div class="grid grid-2">
        <!-- Recent Activity -->
        <div class="card">
          <h3>Recent Activity</h3>
          <div class="activity-list mt-2">
            <div class="activity-item" *ngFor="let a of activities">
              <span class="activity-time">🕐 {{ a.time }}</span>
              <span>{{ a.text }}</span>
            </div>
          </div>
        </div>

        <!-- User Management -->
        <div class="card">
          <div class="flex-between mb-2">
            <h3>User Management</h3>
          </div>
          <table class="table">
            <thead><tr><th>ID</th><th>Name</th><th>Role</th></tr></thead>
            <tbody>
              <tr *ngFor="let u of users">
                <td>{{ u.id }}</td>
                <td>{{ u.fullName }}</td>
                <td><span class="badge" [class.badge-danger]="u.role==='Admin'" [class.badge-info]="u.role==='Customer'">{{ u.role }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Facility Management -->
      <div class="card mt-3">
        <div class="flex-between mb-2">
          <h3>Facility Management</h3>
        </div>
        <div class="grid grid-2">
          <div class="facility-admin-card" *ngFor="let f of facilities">
            <div class="flex-between">
              <div>
                <strong>{{ f.facilityName }}</strong>
                <p class="text-light">{{ f.locationAddress }}</p>
                <p class="text-light">{{ f.description }}</p>
              </div>
              <span class="badge badge-success">🟢 Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .kpi-card { text-align: center; padding: 20px; }
    .kpi-icon { font-size: 32px; margin-bottom: 8px; }
    .kpi-value { font-size: 28px; font-weight: 700; }
    .kpi-label { font-size: 13px; color: var(--text-light); text-transform: uppercase; font-weight: 600; margin-top: 4px; }
    .activity-list { display: flex; flex-direction: column; gap: 12px; }
    .activity-item { font-size: 14px; display: flex; gap: 8px; }
    .activity-time { color: var(--text-light); font-size: 13px; white-space: nowrap; }
    .facility-admin-card { padding: 16px; border: 1px solid var(--border); border-radius: var(--radius); }
    .text-light { color: var(--text-light); font-size: 13px; margin-top: 4px; }
  `]
})
export class AdminDashboardComponent {
  stats = { users: 0, bookings: 0, revenue: 0, facilities: 0 };
  users: any[] = [];
  facilities: any[] = [];
  activities = [
    { time: '10:30 AM', text: 'New user registered: Jane Smith' },
    { time: '10:15 AM', text: 'Booking confirmed: BK-042 (Downtown Pet Care)' },
    { time: '9:45 AM', text: 'Payment received: $150.00 (INV-001)' },
    { time: '9:30 AM', text: 'New booking created: BK-041 (Sunset Elderly)' },
    { time: '9:00 AM', text: 'User profile updated: John Doe' }
  ];

  constructor(private mock: MockDataService) {
    this.users = this.mock.getProfiles();
    this.facilities = this.mock.getFacilities();
    const invoices = this.mock.getInvoices();
    this.stats = {
      users: this.users.length,
      bookings: this.mock.getBookings().length,
      revenue: invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.amount, 0),
      facilities: this.facilities.length
    };
  }
}
