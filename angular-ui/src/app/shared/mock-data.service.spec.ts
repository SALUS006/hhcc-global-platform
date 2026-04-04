import { TestBed } from '@angular/core/testing';
import { MockDataService } from './mock-data.service';
import { FamilyMember, Pet, CareBooking } from './models';

describe('MockDataService', () => {
  let service: MockDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MockDataService);
  });

  it('should return 3 profiles', () => {
    expect(service.getProfiles().length).toBe(3);
  });

  it('should return 2 facilities', () => {
    expect(service.getFacilities().length).toBe(2);
  });

  it('should return 3 family members', () => {
    expect(service.getFamilyMembers().length).toBe(3);
  });

  it('should return 2 pets', () => {
    expect(service.getPets().length).toBe(2);
  });

  it('should return 2 bookings', () => {
    expect(service.getBookings().length).toBe(2);
  });

  it('should return 2 invoices', () => {
    expect(service.getInvoices().length).toBe(2);
  });

  // Family CRUD
  it('should add a family member with an assigned id', () => {
    const member: FamilyMember = { fullName: 'New', relationship: 'Child', dateOfBirth: '2020-01-01', careType: 'Child Care' };
    const result = service.addFamilyMember(member);
    expect(result.id).toBeDefined();
    expect(service.getFamilyMembers().length).toBe(4);
  });

  it('should update an existing family member', () => {
    const updated: FamilyMember = { fullName: 'Updated Name', relationship: 'Spouse', dateOfBirth: '1990-01-01', careType: 'Elderly Care' };
    service.updateFamilyMember(1, updated);
    const found = service.getFamilyMember(1);
    expect(found?.fullName).toBe('Updated Name');
  });

  it('should delete a family member', () => {
    service.deleteFamilyMember(1);
    expect(service.getFamilyMembers().length).toBe(2);
  });

  it('should return undefined for getFamilyMember with bad id', () => {
    expect(service.getFamilyMember(999)).toBeUndefined();
  });

  // Pet CRUD
  it('should add a pet with an assigned id', () => {
    const pet: Pet = { petName: 'Rex', species: 'Dog', breed: 'Lab', ageYears: 1 };
    const result = service.addPet(pet);
    expect(result.id).toBeDefined();
    expect(service.getPets().length).toBe(3);
  });

  it('should update an existing pet', () => {
    const updated: Pet = { petName: 'Updated', species: 'Cat', breed: 'Siamese', ageYears: 5 };
    service.updatePet(1, updated);
    const found = service.getPet(1);
    expect(found?.petName).toBe('Updated');
  });

  it('should delete a pet', () => {
    service.deletePet(1);
    expect(service.getPets().length).toBe(1);
  });

  // Booking
  it('should create a booking with Pending status', () => {
    const booking: CareBooking = {
      userId: 2, facilityId: 1, pickupTime: '2026-05-01T08:00:00',
      dropoffTime: '2026-05-01T17:00:00', status: 'Confirmed'
    };
    const result = service.createBooking(booking);
    expect(result.status).toBe('Pending');
    expect(result.id).toBeDefined();
  });

  // Payment
  it('should change invoice status to Paid when payInvoice is called', () => {
    const result = service.payInvoice(2);
    expect(result?.status).toBe('Paid');
    expect(result?.paymentDate).toBeDefined();
  });
});
