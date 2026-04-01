import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { UserProfile, FamilyMember, Pet, CareBooking, PaymentInvoice } from './models';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => { httpMock.verify(); });

  function expectHeader(url: string, method: string) {
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe(method);
    expect(req.request.headers.get('X-Mock-User-Id')).toBe('1');
    return req;
  }

  // ── Profiles ──
  it('should GET /api/v1/profiles', () => {
    service.getProfiles().subscribe();
    expectHeader('/api/v1/profiles', 'GET').flush([]);
  });

  it('should POST /api/v1/profiles', () => {
    const p: UserProfile = { fullName: 'Test', email: 't@t.com', role: 'Customer', contactNumber: '555' };
    service.createProfile(p).subscribe();
    const req = expectHeader('/api/v1/profiles', 'POST');
    expect(req.request.body).toEqual(p);
    req.flush({ ...p, id: 1 });
  });

  // ── Family Members ──
  it('should GET /api/v1/family-members', () => {
    service.getFamilyMembers().subscribe();
    expectHeader('/api/v1/family-members', 'GET').flush([]);
  });

  it('should GET /api/v1/family-members/:id', () => {
    service.getFamilyMember(1).subscribe();
    expectHeader('/api/v1/family-members/1', 'GET').flush({});
  });

  it('should POST /api/v1/family-members', () => {
    const m: FamilyMember = { fullName: 'New', relationship: 'Child', dateOfBirth: '2020-01-01', careType: 'Child Care' };
    service.createFamilyMember(m).subscribe();
    const req = expectHeader('/api/v1/family-members', 'POST');
    expect(req.request.body).toEqual(m);
    req.flush({ ...m, id: 10 });
  });

  it('should PUT /api/v1/family-members/:id', () => {
    const m: FamilyMember = { fullName: 'Updated', relationship: 'Parent', dateOfBirth: '1990-01-01', careType: 'Elderly Care' };
    service.updateFamilyMember(1, m).subscribe();
    const req = expectHeader('/api/v1/family-members/1', 'PUT');
    expect(req.request.body).toEqual(m);
    req.flush({ ...m, id: 1 });
  });

  it('should DELETE /api/v1/family-members/:id', () => {
    service.deleteFamilyMember(1).subscribe();
    expectHeader('/api/v1/family-members/1', 'DELETE').flush(null);
  });

  // ── Pets ──
  it('should GET /api/v1/pets', () => {
    service.getPets().subscribe();
    expectHeader('/api/v1/pets', 'GET').flush([]);
  });

  it('should GET /api/v1/pets/:id', () => {
    service.getPet(1).subscribe();
    expectHeader('/api/v1/pets/1', 'GET').flush({});
  });

  it('should POST /api/v1/pets', () => {
    const p: Pet = { petName: 'Rex', petType: 'Dog', breed: 'Lab', age: 2 };
    service.createPet(p).subscribe();
    const req = expectHeader('/api/v1/pets', 'POST');
    expect(req.request.body).toEqual(p);
    req.flush({ ...p, id: 10 });
  });

  it('should PUT /api/v1/pets/:id', () => {
    const p: Pet = { petName: 'Rex', petType: 'Dog', breed: 'Lab', age: 3 };
    service.updatePet(1, p).subscribe();
    const req = expectHeader('/api/v1/pets/1', 'PUT');
    expect(req.request.body).toEqual(p);
    req.flush({ ...p, id: 1 });
  });

  it('should DELETE /api/v1/pets/:id', () => {
    service.deletePet(1).subscribe();
    expectHeader('/api/v1/pets/1', 'DELETE').flush(null);
  });

  // ── Facilities ──
  it('should GET /api/v1/facilities', () => {
    service.getFacilities().subscribe();
    expectHeader('/api/v1/facilities', 'GET').flush([]);
  });

  // ── Bookings ──
  it('should GET /api/v1/bookings', () => {
    service.getBookings().subscribe();
    expectHeader('/api/v1/bookings', 'GET').flush([]);
  });

  it('should POST /api/v1/bookings', () => {
    const b: CareBooking = { userId: 2, facilityId: 1, pickupTime: '', dropoffTime: '', status: 'Pending' };
    service.createBooking(b).subscribe();
    const req = expectHeader('/api/v1/bookings', 'POST');
    expect(req.request.body).toEqual(b);
    req.flush({ ...b, id: 1 });
  });

  // ── Payments ──
  it('should GET /api/v1/payments (list all)', () => {
    service.getInvoices().subscribe();
    expectHeader('/api/v1/payments', 'GET').flush([]);
  });

  it('should GET /api/v1/payments/:id (by invoice id)', () => {
    service.getInvoice(2).subscribe();
    expectHeader('/api/v1/payments/2', 'GET').flush({});
  });

  it('should GET /api/v1/payments/booking/:bookingId', () => {
    service.getPaymentByBooking(5).subscribe();
    expectHeader('/api/v1/payments/booking/5', 'GET').flush({});
  });

  it('should POST /api/v1/payments', () => {
    const inv: PaymentInvoice = { bookingId: 1, amount: 100, currency: 'USD', status: 'Unpaid' };
    service.createPayment(inv).subscribe();
    const req = expectHeader('/api/v1/payments', 'POST');
    expect(req.request.body).toEqual(inv);
    req.flush({ ...inv, id: 1 });
  });

  it('should PUT /api/v1/payments/:id/pay', () => {
    service.payInvoice(2).subscribe();
    const req = expectHeader('/api/v1/payments/2/pay', 'PUT');
    expect(req.request.body).toEqual({});
    req.flush({ id: 2, status: 'Paid' });
  });

  // ── Feedback ──
  it('should POST /api/v1/feedback', () => {
    const fb = { userId: 2, rating: 5, comment: 'Great service' };
    service.submitFeedback(fb).subscribe();
    const req = expectHeader('/api/v1/feedback', 'POST');
    expect(req.request.body).toEqual(fb);
    req.flush({ id: 1, ...fb });
  });

  it('should GET /api/v1/feedback', () => {
    service.getFeedback().subscribe();
    expectHeader('/api/v1/feedback', 'GET').flush([]);
  });
});
