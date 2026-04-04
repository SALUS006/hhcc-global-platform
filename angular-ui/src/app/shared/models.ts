export interface UserProfile {
  id?: number;
  fullName: string;
  email: string;
  role: string;
  contactNumber: string;
  createdBy?: number;
  updatedBy?: number;
}

export interface FamilyMember {
  id?: number;
  userId?: number;
  fullName: string;
  relationship: string;
  dateOfBirth: string;
  careType: string;
  specialNotes?: string;
}

export interface Pet {
  id?: number;
  userId?: number;
  petName: string;
  species: string;
  breed: string;
  ageYears: number;
  medicalNotes?: string;
}

export interface CareFacility {
  id?: number;
  facilityName: string;
  locationAddress: string;
  description?: string;
  photoUrl?: string;
  isActive: boolean;
}

export interface CareBooking {
  id?: number;
  userId: number;
  facilityId: number;
  careType?: string;
  dependentType?: string;
  dependentId?: number;
  pickupTime: string;
  dropoffTime: string;
  status: string;
  notes?: string;
  bookingType?: string;
  memberName?: string;
  facilityName?: string;
}

export interface PaymentInvoice {
  id?: number;
  bookingId: number;
  amount: number;
  currency: string;
  status: string;
  paymentDate?: string;
  bookingDescription?: string;
}
