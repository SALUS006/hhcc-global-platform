import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ApiService } from '../../shared/api.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
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

  revenueFacilityId: string = '';
  revenueStartDate: string = '';
  revenueEndDate: string = '';

  get filteredInvoices() {
    return this.invoices.filter(i => {
      if (this.revenueFacilityId !== '' && i.facilityId?.toString() !== this.revenueFacilityId) return false;
      if (this.revenueStartDate && i.date < this.revenueStartDate) return false;
      if (this.revenueEndDate && i.date > this.revenueEndDate) return false;
      return true;
    });
  }

  get revenueTrendData() {
    const trend = new Map<string, number>();
    this.filteredInvoices.forEach(i => {
      if (i.status === 'Paid' || i.status === 'PAID') {
        const d = i.date ? i.date.split('T')[0] : 'Unknown';
        trend.set(d, (trend.get(d) || 0) + i.amount);
      }
    });
    return Array.from(trend.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(entry => ({ date: entry[0], amount: entry[1] }));
  }

  get maxTrendAmount() {
    const max = Math.max(...this.revenueTrendData.map(d => d.amount));
    return max > 0 ? max : 1;
  }


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
      bookings: this.api.getAllBookings(),
      invoices: this.api.getInvoices(),
      facilities: this.api.getFacilities()
    }).subscribe(({ users, bookings, invoices, facilities }) => {
      this.users = users;
      this.facilities = facilities;
      this.bookings = bookings.map(b => {
        const invoice = invoices.find(i => i.bookingId === b.id);
        return {
          ...b,
          paymentStatus: invoice ? invoice.status : 'Pending'
        };
      });
      this.invoices = invoices.map(inv => {
        const booking = bookings.find(b => b.id === inv.bookingId);
        const facility = booking ? facilities.find(f => f.id === booking.facilityId) : null;
        let d = inv.paymentDate;
        if (!d && booking) d = booking.pickupTime;
        return {
          ...inv,
          facilityId: facility ? facility.id : null,
          facilityName: facility ? facility.facilityName : 'Unknown',
          date: d ? new Date(d).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
        };
      });
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

  approveBooking(booking: any) {
    if (booking.paymentStatus === 'Paid' || booking.paymentStatus === 'PAID') {
      this.api.updateBooking(booking.id, { status: 'Approved' }).subscribe(updated => {
        // Update local status
        booking.status = 'Approved';
        // Optionally add to activity
        this.activities.unshift({ time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), text: `Booking confirmed: BK-${booking.id.toString().padStart(3, '0')} (Admin Approved)` });
      });
    }
  }
}
