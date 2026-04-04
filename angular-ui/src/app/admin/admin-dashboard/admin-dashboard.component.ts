import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ApiService } from '../../shared/api.service';

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
  bookings: any[] = [];
  invoices: any[] = [];
  activeTab: 'activity' | 'users' | 'bookings' | 'revenue' | 'facilities' = 'activity';

  activities = [
    { time: '10:30 AM', text: 'New user registered: Jane Smith' },
    { time: '10:15 AM', text: 'Booking confirmed: BK-042 (Downtown Pet Care)' },
    { time: '9:45 AM', text: 'Payment received: $150.00 (INV-001)' },
    { time: '9:30 AM', text: 'New booking created: BK-041 (Sunset Elderly)' },
    { time: '9:00 AM', text: 'User profile updated: John Doe' }
  ];

  constructor(private api: ApiService) {
    forkJoin({
      users: this.api.getProfiles(),
      bookings: this.api.getBookings(),
      invoices: this.api.getInvoices(),
      facilities: this.api.getFacilities()
    }).subscribe(({ users, bookings, invoices, facilities }) => {
      this.users = users;
      this.facilities = facilities;
      this.bookings = bookings;
      this.invoices = invoices;
      this.stats = {
        users: users.length,
        bookings: bookings.length,
        revenue: invoices.filter(i => i.status === 'Paid' || i.status === 'PAID').reduce((s, i) => s + i.amount, 0),
        facilities: facilities.length
      };
    });
  }

  setActiveTab(tab: 'activity' | 'users' | 'bookings' | 'revenue' | 'facilities') {
    this.activeTab = tab;
  }
}
