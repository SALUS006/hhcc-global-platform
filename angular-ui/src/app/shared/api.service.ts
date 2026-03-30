import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProfile, CareFacility, CareBooking, PaymentInvoice } from './models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = '/api/v1';
  private headers = new HttpHeaders({ 'X-Mock-User-Id': '1' });

  constructor(private http: HttpClient) {}

  // Profile
  getProfiles(): Observable<UserProfile[]> {
    return this.http.get<UserProfile[]>(`${this.baseUrl}/profiles`, { headers: this.headers });
  }
  createProfile(profile: UserProfile): Observable<UserProfile> {
    return this.http.post<UserProfile>(`${this.baseUrl}/profiles`, profile, { headers: this.headers });
  }

  // Facilities
  getFacilities(): Observable<CareFacility[]> {
    return this.http.get<CareFacility[]>(`${this.baseUrl}/facilities`, { headers: this.headers });
  }

  // Bookings
  getBookings(): Observable<CareBooking[]> {
    return this.http.get<CareBooking[]>(`${this.baseUrl}/bookings`, { headers: this.headers });
  }
  createBooking(booking: CareBooking): Observable<CareBooking> {
    return this.http.post<CareBooking>(`${this.baseUrl}/bookings`, booking, { headers: this.headers });
  }

  // Payments
  getPaymentByBooking(bookingId: number): Observable<PaymentInvoice> {
    return this.http.get<PaymentInvoice>(`${this.baseUrl}/payments/${bookingId}`, { headers: this.headers });
  }
  createPayment(invoice: PaymentInvoice): Observable<PaymentInvoice> {
    return this.http.post<PaymentInvoice>(`${this.baseUrl}/payments`, invoice, { headers: this.headers });
  }
}
