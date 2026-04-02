import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../shared/api.service';
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
  selectedMemberId = 0;
  selectedMemberName = '';
  selectedFacilityId = 0;
  pickupTime = '';
  dropoffTime = '';
  instructions = '';
  success = false;

  familyMembers: FamilyMember[] = [];
  pets: Pet[] = [];
  facilities: CareFacility[] = [];

  constructor(private api: ApiService, private router: Router) {
    this.api.getFamilyMembers().subscribe(data => this.familyMembers = data);
    this.api.getPets().subscribe(data => this.pets = data);
    this.api.getFacilities().subscribe(data => this.facilities = data);
  }

  get selectedFacility() {
    return this.facilities.find(f => f.id === this.selectedFacilityId);
  }

  onMemberChange() {
    const member = this.familyMembers.find(m => m.id === this.selectedMemberId);
    this.selectedMemberName = member?.fullName || '';
  }

  onPetChange() {
    const pet = this.pets.find(p => p.id === this.selectedMemberId);
    this.selectedMemberName = pet?.petName || '';
  }

  onSubmit() {
    if (!this.selectedMemberId || !this.selectedFacilityId || !this.pickupTime || !this.dropoffTime) return;
    const booking: CareBooking = {
      userId: 1,
      facilityId: this.selectedFacilityId,
      careType: this.bookingType === 'Pet' ? 'PET' : 'CHILDCARE',
      dependentType: this.bookingType === 'Pet' ? 'PET' : 'FAMILY_MEMBER',
      dependentId: this.selectedMemberId,
      pickupTime: this.pickupTime,
      dropoffTime: this.dropoffTime,
      status: 'PENDING',
      notes: this.instructions || undefined,
      bookingType: this.bookingType,
      memberName: this.selectedMemberName,
      facilityName: this.selectedFacility?.facilityName || ''
    };
    this.api.createBooking(booking).subscribe(() => {
      this.success = true;
    });
  }
}
