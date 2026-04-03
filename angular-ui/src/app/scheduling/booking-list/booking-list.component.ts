import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from '../../shared/api.service';
import { CareBooking, CareFacility, FamilyMember, Pet } from '../../shared/models';
import { BookingListItem, mapToBookingListItems } from './booking-list.mapper';

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.css']
})
export class BookingListComponent {
  bookings: BookingListItem[] = [];
  filterType = '';
  filterStatus = '';

  constructor(private api: ApiService) {
    this.load();
  }

  private load(): void {
    forkJoin({
      bookings: this.api.getBookings().pipe(catchError(() => of([] as CareBooking[]))),
      facilities: this.api.getFacilities().pipe(catchError(() => of([] as CareFacility[]))),
      familyMembers: this.api.getFamilyMembers().pipe(catchError(() => of([] as FamilyMember[]))),
      pets: this.api.getPets().pipe(catchError(() => of([] as Pet[])))
    }).subscribe(({ bookings, facilities, familyMembers, pets }) => {
      this.bookings = mapToBookingListItems(bookings, facilities, familyMembers, pets);
    });
  }

  get filtered(): BookingListItem[] {
    return this.bookings.filter(b =>
      (!this.filterType || b.bookingTypeUi === this.filterType) &&
      (!this.filterStatus || b.statusUi === this.filterStatus)
    );
  }
}
