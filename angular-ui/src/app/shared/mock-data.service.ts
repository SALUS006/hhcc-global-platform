import { Injectable } from '@angular/core';
import { UserProfile, FamilyMember, Pet, CareFacility, CareBooking, PaymentInvoice } from './models';

@Injectable({ providedIn: 'root' })
export class MockDataService {

  private profiles: UserProfile[] = [
    { id: 1, fullName: 'System Admin', email: 'admin@hhcc.com', role: 'Admin', contactNumber: '555-0100' },
    { id: 2, fullName: 'John Doe', email: 'john.doe@email.com', role: 'Customer', contactNumber: '555-0101' },
    { id: 3, fullName: 'Jane Smith', email: 'jane.smith@email.com', role: 'Customer', contactNumber: '555-0102' }
  ];

  private familyMembers: FamilyMember[] = [
    { id: 1, userId: 2, fullName: 'Sarah Doe', relationship: 'Daughter', dateOfBirth: '2018-03-15', careType: 'Child Care', specialNotes: 'Allergic to peanuts' },
    { id: 2, userId: 2, fullName: 'Tom Doe', relationship: 'Son', dateOfBirth: '2014-07-22', careType: 'Child Care' },
    { id: 3, userId: 2, fullName: 'Mary Doe', relationship: 'Mother', dateOfBirth: '1954-01-10', careType: 'Elderly Care', specialNotes: 'Requires wheelchair assistance' }
  ];

  private pets: Pet[] = [
    { id: 1, userId: 2, petName: 'Buddy', petType: 'Dog', breed: 'Golden Retriever', age: 3, weight: 65, specialNotes: 'Friendly, loves fetch' },
    { id: 2, userId: 2, petName: 'Whiskers', petType: 'Cat', breed: 'Persian', age: 2, weight: 10 }
  ];

  private facilities: CareFacility[] = [
    { id: 1, facilityName: 'Downtown Pet Care', locationAddress: '123 Main St, Metro City', description: 'Premium pet daycare and boarding.', photoUrl: '', isActive: true },
    { id: 2, facilityName: 'Sunset Elderly Care', locationAddress: '456 West Ave, Metro City', description: 'Compassionate community elderly care center.', photoUrl: '', isActive: true }
  ];

  private bookings: CareBooking[] = [
    { id: 1, userId: 2, facilityId: 1, pickupTime: '2026-03-30T08:00:00', dropoffTime: '2026-03-30T17:00:00', status: 'Confirmed', bookingType: 'Pet', memberName: 'Buddy', facilityName: 'Downtown Pet Care' },
    { id: 2, userId: 3, facilityId: 2, pickupTime: '2026-04-01T09:00:00', dropoffTime: '2026-04-01T16:00:00', status: 'Pending', bookingType: 'Family', memberName: 'Mary Doe', facilityName: 'Sunset Elderly Care' }
  ];

  private invoices: PaymentInvoice[] = [
    { id: 1, bookingId: 1, amount: 150.00, currency: 'USD', status: 'Paid', paymentDate: '2026-03-28', bookingDescription: 'Buddy @ Downtown Pet Care' },
    { id: 2, bookingId: 2, amount: 500.00, currency: 'USD', status: 'Unpaid', bookingDescription: 'Mary Doe @ Sunset Elderly Care' }
  ];

  private nextId = 100;

  getProfiles() { return [...this.profiles]; }
  createProfile(p: UserProfile) { p.id = this.nextId++; this.profiles.push(p); return p; }

  getFamilyMembers() { return [...this.familyMembers]; }
  getFamilyMember(id: number) { return this.familyMembers.find(f => f.id === id); }
  addFamilyMember(f: FamilyMember) { f.id = this.nextId++; this.familyMembers.push(f); return f; }
  updateFamilyMember(id: number, f: FamilyMember) {
    const idx = this.familyMembers.findIndex(m => m.id === id);
    if (idx >= 0) { this.familyMembers[idx] = { ...f, id }; } return this.familyMembers[idx];
  }
  deleteFamilyMember(id: number) { this.familyMembers = this.familyMembers.filter(f => f.id !== id); }

  getPets() { return [...this.pets]; }
  getPet(id: number) { return this.pets.find(p => p.id === id); }
  addPet(p: Pet) { p.id = this.nextId++; this.pets.push(p); return p; }
  updatePet(id: number, p: Pet) {
    const idx = this.pets.findIndex(x => x.id === id);
    if (idx >= 0) { this.pets[idx] = { ...p, id }; } return this.pets[idx];
  }
  deletePet(id: number) { this.pets = this.pets.filter(p => p.id !== id); }

  getFacilities() { return [...this.facilities]; }

  getBookings() { return [...this.bookings]; }
  createBooking(b: CareBooking) { b.id = this.nextId++; b.status = 'Pending'; this.bookings.push(b); return b; }

  getInvoices() { return [...this.invoices]; }
  getInvoice(id: number) { return this.invoices.find(i => i.id === id); }
  payInvoice(id: number) {
    const inv = this.invoices.find(i => i.id === id);
    if (inv) { inv.status = 'Paid'; inv.paymentDate = new Date().toISOString(); }
    return inv;
  }
}
