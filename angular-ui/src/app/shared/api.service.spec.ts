import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { UserProfile, CareBooking, PaymentInvoice } from './models';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should send GET to /api/v1/profiles with X-Mock-User-Id header', () => {
    service.getProfiles().subscribe();
    const req = httpMock.expectOne('/api/v1/profiles');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('X-Mock-User-Id')).toBe('1');
    req.flush([]);
  });

  it('should send POST to /api/v1/profiles for createProfile', () => {
    const profile: UserProfile = { fullName: 'Test', email: 'test@test.com', role: 'Customer', contactNumber: '555' };
    service.createProfile(profile).subscribe();
    const req = httpMock.expectOne('/api/v1/profiles');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(profile);
    req.flush({ ...profile, id: 1 });
  });

  it('should send GET to /api/v1/facilities', () => {
    service.getFacilities().subscribe();
    const req = httpMock.expectOne('/api/v1/facilities');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should send GET to /api/v1/bookings', () => {
    service.getBookings().subscribe();
    const req = httpMock.expectOne('/api/v1/bookings');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should send POST to /api/v1/bookings for createBooking', () => {
    const booking: CareBooking = { userId: 2, facilityId: 1, pickupTime: '', dropoffTime: '', status: 'Pending' };
    service.createBooking(booking).subscribe();
    const req = httpMock.expectOne('/api/v1/bookings');
    expect(req.request.method).toBe('POST');
    req.flush({ ...booking, id: 1 });
  });

  it('should send GET to /api/v1/payments/{id} for getPaymentByBooking', () => {
    service.getPaymentByBooking(5).subscribe();
    const req = httpMock.expectOne('/api/v1/payments/5');
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should send POST to /api/v1/payments for createPayment', () => {
    const invoice: PaymentInvoice = { bookingId: 1, amount: 100, currency: 'USD', status: 'Unpaid' };
    service.createPayment(invoice).subscribe();
    const req = httpMock.expectOne('/api/v1/payments');
    expect(req.request.method).toBe('POST');
    req.flush({ ...invoice, id: 1 });
  });
});
