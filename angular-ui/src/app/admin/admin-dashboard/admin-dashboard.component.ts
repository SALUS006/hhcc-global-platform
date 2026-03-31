import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MockDataService } from '../../shared/mock-data.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
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
