import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MockDataService } from '../../shared/mock-data.service';
import { CareFacility, FamilyMember, Pet, CareBooking } from '../../shared/models';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.css']
})
export class BookingFormComponent {
  bookingType = 'Family';
  selectedMember = '';
  selectedFacilityId = 0;
  pickupTime = '';
  dropoffTime = '';
  instructions = '';
  success = false;

  familyMembers: FamilyMember[] = [];
  pets: Pet[] = [];
  facilities: CareFacility[] = [];

  constructor(private mock: MockDataService, private router: Router) {
    this.familyMembers = this.mock.getFamilyMembers();
    this.pets = this.mock.getPets();
    this.facilities = this.mock.getFacilities();
  }

  get selectedFacility() {
    return this.facilities.find(f => f.id === this.selectedFacilityId);
  }

  onSubmit() {
    if (!this.selectedMember || !this.selectedFacilityId || !this.pickupTime || !this.dropoffTime) return;
    const booking: CareBooking = {
      userId: 2,
      facilityId: this.selectedFacilityId,
      pickupTime: this.pickupTime,
      dropoffTime: this.dropoffTime,
      status: 'Pending',
      bookingType: this.bookingType,
      memberName: this.selectedMember,
      facilityName: this.selectedFacility?.facilityName || ''
    };
    this.mock.createBooking(booking);
    this.success = true;
  }
}
