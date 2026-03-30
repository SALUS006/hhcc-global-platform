import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../shared/mock-data.service';
import { CareBooking } from '../../shared/models';

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="container mt-3">
      <div class="page-header">
        <h1>Scheduling</h1>
        <a routerLink="/scheduling/new" class="btn btn-primary">+ New Booking</a>
      </div>

      <!-- Filters -->
      <div class="card mb-2 flex gap-2" style="padding:12px 16px; flex-wrap:wrap;">
        <select class="form-control" style="width:auto" [(ngModel)]="filterType">
          <option value="">All Types</option>
          <option value="Pet">Pet</option>
          <option value="Family">Family</option>
        </select>
        <select class="form-control" style="width:auto" [(ngModel)]="filterStatus">
          <option value="">All Status</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div *ngIf="filtered.length === 0" class="card empty-state">
        <div class="icon">📅</div>
        <p>No bookings found.</p>
        <a routerLink="/scheduling/new" class="btn btn-primary mt-2">+ New Booking</a>
      </div>

      <div class="bookings">
        <div class="card booking-card mb-2" *ngFor="let b of filtered">
          <div class="booking-header">
            <span class="booking-icon">{{ b.bookingType === 'Pet' ? '🐾' : '👨‍👩‍👧' }}</span>
            <div>
              <strong>{{ b.memberName }}</strong> → {{ b.facilityName }}
              <div class="booking-times">
                Pick-up: {{ b.pickupTime | date:'MMM d, y h:mm a' }} &nbsp;|&nbsp;
                Drop-off: {{ b.dropoffTime | date:'MMM d, y h:mm a' }}
              </div>
            </div>
            <span class="badge" [class.badge-success]="b.status==='Confirmed'" [class.badge-warning]="b.status==='Pending'" [class.badge-info]="b.status==='Completed'">
              {{ b.status === 'Confirmed' ? '✅' : b.status === 'Pending' ? '⏳' : '✔️' }} {{ b.status }}
            </span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .booking-card { padding: 16px 20px; }
    .booking-header { display: flex; align-items: center; gap: 16px; }
    .booking-icon { font-size: 32px; }
    .booking-times { font-size: 13px; color: var(--text-light); margin-top: 4px; }
    .booking-header .badge { margin-left: auto; white-space: nowrap; }
  `]
})
export class BookingListComponent {
  bookings: CareBooking[] = [];
  filterType = '';
  filterStatus = '';

  constructor(private mock: MockDataService) {
    this.bookings = this.mock.getBookings();
  }

  get filtered() {
    return this.bookings.filter(b =>
      (!this.filterType || b.bookingType === this.filterType) &&
      (!this.filterStatus || b.status === this.filterStatus)
    );
  }
}
