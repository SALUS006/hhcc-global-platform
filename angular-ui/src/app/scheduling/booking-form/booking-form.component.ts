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
  template: `
    <div class="container mt-3">
      <div class="page-header">
        <h1>New Booking</h1>
      </div>
      <div class="card form-card">
        <form (ngSubmit)="onSubmit()">
          <!-- Booking Type Toggle -->
          <div class="form-group">
            <label>Booking Type *</label>
            <div class="toggle-group">
              <button type="button" class="toggle-btn" [class.active]="bookingType==='Family'" (click)="bookingType='Family'">👨‍👩‍👧 Family Member</button>
              <button type="button" class="toggle-btn" [class.active]="bookingType==='Pet'" (click)="bookingType='Pet'">🐾 Pet</button>
            </div>
          </div>

          <!-- Family Member Select -->
          <div class="form-group" *ngIf="bookingType==='Family'">
            <label for="member">Select Family Member *</label>
            <select id="member" class="form-control" [(ngModel)]="selectedMember" name="member" required>
              <option value="">Select...</option>
              <option *ngFor="let m of familyMembers" [value]="m.fullName">{{ m.fullName }} ({{ m.relationship }})</option>
            </select>
          </div>

          <!-- Pet Select -->
          <div class="form-group" *ngIf="bookingType==='Pet'">
            <label for="pet">Select Pet *</label>
            <select id="pet" class="form-control" [(ngModel)]="selectedMember" name="pet" required>
              <option value="">Select...</option>
              <option *ngFor="let p of pets" [value]="p.petName">{{ p.petType === 'Dog' ? '🐕' : '🐈' }} {{ p.petName }}</option>
            </select>
          </div>

          <!-- Facility -->
          <div class="form-group">
            <label for="facility">Select Care Facility *</label>
            <select id="facility" class="form-control" [(ngModel)]="selectedFacilityId" name="facility" required>
              <option [ngValue]="0">Select...</option>
              <option *ngFor="let f of facilities" [ngValue]="f.id">{{ f.facilityName }} - {{ f.locationAddress }}</option>
            </select>
          </div>

          <!-- Facility Preview -->
          <div *ngIf="selectedFacility" class="facility-preview card mb-2">
            <strong>🏢 {{ selectedFacility.facilityName }}</strong>
            <p>{{ selectedFacility.locationAddress }}</p>
            <p class="text-light">{{ selectedFacility.description }}</p>
          </div>

          <!-- Date/Time -->
          <div class="form-row">
            <div class="form-group">
              <label for="pickup">Pick-Up Date &amp; Time *</label>
              <input id="pickup" type="datetime-local" class="form-control" [(ngModel)]="pickupTime" name="pickupTime" required>
            </div>
            <div class="form-group">
              <label for="dropoff">Drop-Off Date &amp; Time *</label>
              <input id="dropoff" type="datetime-local" class="form-control" [(ngModel)]="dropoffTime" name="dropoffTime" required>
            </div>
          </div>

          <div class="form-group">
            <label for="instructions">Special Instructions</label>
            <textarea id="instructions" class="form-control" [(ngModel)]="instructions" name="instructions"></textarea>
          </div>

          <div *ngIf="success" class="alert-success" style="padding:12px;border-radius:8px;margin-bottom:16px;background:#e8f5e9;color:#388e3c;">
            Booking created successfully! <a routerLink="/scheduling">View Bookings</a>
          </div>

          <div class="form-actions">
            <a routerLink="/scheduling" class="btn btn-secondary">Cancel</a>
            <button type="submit" class="btn btn-primary" [disabled]="success">Confirm Booking</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .form-card { max-width: 650px; }
    .form-actions { display: flex; gap: 12px; justify-content: flex-end; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .toggle-group { display: flex; gap: 12px; }
    .toggle-btn { padding: 10px 20px; border: 2px solid var(--border); border-radius: var(--radius); background: #fff; cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.2s; }
    .toggle-btn.active { border-color: var(--primary); background: var(--primary-light); color: var(--primary); }
    .facility-preview { padding: 12px 16px; background: var(--bg); }
    .facility-preview p { font-size: 13px; margin-top: 4px; }
    .text-light { color: var(--text-light); }
  `]
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
