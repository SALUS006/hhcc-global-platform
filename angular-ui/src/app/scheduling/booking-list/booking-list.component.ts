import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../shared/api.service';
import { CareBooking } from '../../shared/models';

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.css']
})
export class BookingListComponent {
  bookings: CareBooking[] = [];
  filterType = '';
  filterStatus = '';

  constructor(private api: ApiService) {
    this.api.getBookings().subscribe(data => this.bookings = data);
  }

  get filtered() {
    return this.bookings.filter(b =>
      (!this.filterType || b.bookingType === this.filterType) &&
      (!this.filterStatus || b.status === this.filterStatus)
    );
  }
}
