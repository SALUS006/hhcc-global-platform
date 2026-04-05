import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProfile, FamilyMember, Pet, CareFacility, CareBooking, PaymentInvoice } from './models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = '/api/v1';

  constructor(private http: HttpClient) {}

  // ── Profiles ──
  getProfiles(): Observable<UserProfile[]> {
    return this.http.get<UserProfile[]>(`${this.baseUrl}/profiles`);
  }
  createProfile(profile: UserProfile): Observable<UserProfile> {
    return this.http.post<UserProfile>(`${this.baseUrl}/profiles`, profile);
  }

  // ── Family Members ──
  getFamilyMembers(): Observable<FamilyMember[]> {
    return this.http.get<FamilyMember[]>(`${this.baseUrl}/family-members`);
  }
  getFamilyMember(id: number): Observable<FamilyMember> {
    return this.http.get<FamilyMember>(`${this.baseUrl}/family-members/${id}`);
  }
  createFamilyMember(member: FamilyMember): Observable<FamilyMember> {
    return this.http.post<FamilyMember>(`${this.baseUrl}/family-members`, member);
  }
  updateFamilyMember(id: number, member: FamilyMember): Observable<FamilyMember> {
    return this.http.put<FamilyMember>(`${this.baseUrl}/family-members/${id}`, member);
  }
  deleteFamilyMember(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/family-members/${id}`);
  }

  // ── Pets ──
  getPets(): Observable<Pet[]> {
    return this.http.get<Pet[]>(`${this.baseUrl}/pets`);
  }
  getPet(id: number): Observable<Pet> {
    return this.http.get<Pet>(`${this.baseUrl}/pets/${id}`);
  }
  createPet(pet: Pet): Observable<Pet> {
    return this.http.post<Pet>(`${this.baseUrl}/pets`, pet);
  }
  updatePet(id: number, pet: Pet): Observable<Pet> {
    return this.http.put<Pet>(`${this.baseUrl}/pets/${id}`, pet);
  }
  deletePet(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/pets/${id}`);
  }

  // ── Facilities ──
  getFacilities(): Observable<CareFacility[]> {
    return this.http.get<CareFacility[]>(`${this.baseUrl}/facilities`);
  }

  // ── Bookings ──
  getBookings(): Observable<CareBooking[]> {
    return this.http.get<CareBooking[]>(`${this.baseUrl}/bookings`);
  }
  getAllBookings(): Observable<CareBooking[]> {
    return this.http.get<CareBooking[]>(`${this.baseUrl}/admin/bookings`);
  }
  createBooking(booking: CareBooking): Observable<CareBooking> {
    return this.http.post<CareBooking>(`${this.baseUrl}/bookings`, booking);
  }
  updateBooking(id: number, booking: Partial<CareBooking>): Observable<CareBooking> {
    return this.http.put<CareBooking>(`${this.baseUrl}/bookings/${id}`, booking);
  }

  // ── Payments ──
  getInvoices(): Observable<PaymentInvoice[]> {
    return this.http.get<PaymentInvoice[]>(`${this.baseUrl}/payments`);
  }
  getInvoice(id: number): Observable<PaymentInvoice> {
    return this.http.get<PaymentInvoice>(`${this.baseUrl}/payments/${id}`);
  }
  getPaymentByBooking(bookingId: number): Observable<PaymentInvoice> {
    return this.http.get<PaymentInvoice>(`${this.baseUrl}/payments/booking/${bookingId}`);
  }
  createPayment(invoice: PaymentInvoice): Observable<PaymentInvoice> {
    return this.http.post<PaymentInvoice>(`${this.baseUrl}/payments`, invoice);
  }
  payInvoice(id: number, payload: any): Observable<PaymentInvoice> {
    return this.http.put<PaymentInvoice>(`${this.baseUrl}/payments/${id}/pay`, payload);
  }

  // ── Feedback ──
  submitFeedback(feedback: { userId: number; rating: number; comment: string }): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/feedback`, feedback);
  }
  getFeedback(): Observable<unknown[]> {
    return this.http.get<unknown[]>(`${this.baseUrl}/feedback`);
  }
}
