import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProfile, FamilyMember, Pet, CareFacility, CareBooking, PaymentInvoice } from './models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = '/api/v1';
  private headers = new HttpHeaders({ 'X-Mock-User-Id': '1' });

  constructor(private http: HttpClient) {}

  // ── Profiles ──
  getProfiles(): Observable<UserProfile[]> {
    return this.http.get<UserProfile[]>(`${this.baseUrl}/profiles`, { headers: this.headers });
  }
  createProfile(profile: UserProfile): Observable<UserProfile> {
    return this.http.post<UserProfile>(`${this.baseUrl}/profiles`, profile, { headers: this.headers });
  }

  // ── Family Members ──
  getFamilyMembers(): Observable<FamilyMember[]> {
    return this.http.get<FamilyMember[]>(`${this.baseUrl}/family-members`, { headers: this.headers });
  }
  getFamilyMember(id: number): Observable<FamilyMember> {
    return this.http.get<FamilyMember>(`${this.baseUrl}/family-members/${id}`, { headers: this.headers });
  }
  createFamilyMember(member: FamilyMember): Observable<FamilyMember> {
    return this.http.post<FamilyMember>(`${this.baseUrl}/family-members`, member, { headers: this.headers });
  }
  updateFamilyMember(id: number, member: FamilyMember): Observable<FamilyMember> {
    return this.http.put<FamilyMember>(`${this.baseUrl}/family-members/${id}`, member, { headers: this.headers });
  }
  deleteFamilyMember(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/family-members/${id}`, { headers: this.headers });
  }

  // ── Pets ──
  getPets(): Observable<Pet[]> {
    return this.http.get<Pet[]>(`${this.baseUrl}/pets`, { headers: this.headers });
  }
  getPet(id: number): Observable<Pet> {
    return this.http.get<Pet>(`${this.baseUrl}/pets/${id}`, { headers: this.headers });
  }
  createPet(pet: Pet): Observable<Pet> {
    return this.http.post<Pet>(`${this.baseUrl}/pets`, pet, { headers: this.headers });
  }
  updatePet(id: number, pet: Pet): Observable<Pet> {
    return this.http.put<Pet>(`${this.baseUrl}/pets/${id}`, pet, { headers: this.headers });
  }
  deletePet(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/pets/${id}`, { headers: this.headers });
  }

  // ── Facilities ──
  getFacilities(): Observable<CareFacility[]> {
    return this.http.get<CareFacility[]>(`${this.baseUrl}/facilities`, { headers: this.headers });
  }

  // ── Bookings ──
  getBookings(): Observable<CareBooking[]> {
    return this.http.get<CareBooking[]>(`${this.baseUrl}/bookings`, { headers: this.headers });
  }
  createBooking(booking: CareBooking): Observable<CareBooking> {
    return this.http.post<CareBooking>(`${this.baseUrl}/bookings`, booking, { headers: this.headers });
  }

  // ── Payments ──
  getInvoices(): Observable<PaymentInvoice[]> {
    return this.http.get<PaymentInvoice[]>(`${this.baseUrl}/payments`, { headers: this.headers });
  }
  getInvoice(id: number): Observable<PaymentInvoice> {
    return this.http.get<PaymentInvoice>(`${this.baseUrl}/payments/${id}`, { headers: this.headers });
  }
  getPaymentByBooking(bookingId: number): Observable<PaymentInvoice> {
    return this.http.get<PaymentInvoice>(`${this.baseUrl}/payments/booking/${bookingId}`, { headers: this.headers });
  }
  createPayment(invoice: PaymentInvoice): Observable<PaymentInvoice> {
    return this.http.post<PaymentInvoice>(`${this.baseUrl}/payments`, invoice, { headers: this.headers });
  }
  payInvoice(id: number): Observable<PaymentInvoice> {
    return this.http.put<PaymentInvoice>(`${this.baseUrl}/payments/${id}/pay`, {}, { headers: this.headers });
  }

  // ── Feedback ──
  submitFeedback(feedback: { userId: number; rating: number; comment: string }): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/feedback`, feedback, { headers: this.headers });
  }
  getFeedback(): Observable<unknown[]> {
    return this.http.get<unknown[]>(`${this.baseUrl}/feedback`, { headers: this.headers });
  }
}
