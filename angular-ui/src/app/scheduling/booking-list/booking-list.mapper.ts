import { CareBooking, CareFacility, FamilyMember, Pet } from '../../shared/models';

export type UiBookingType = 'Pet' | 'Family';
export type UiBookingStatus =
  | 'Confirmed'
  | 'Pending'
  | 'Completed'
  | 'Cancelled'
  | (string & {});

export interface BookingListItem extends CareBooking {
  bookingTypeUi: UiBookingType;
  statusUi: UiBookingStatus;
  memberNameUi: string;
  facilityNameUi: string;
}

export function mapToBookingListItems(
  bookings: CareBooking[],
  facilities: CareFacility[],
  familyMembers: FamilyMember[],
  pets: Pet[]
): BookingListItem[] {
  const facilityById = new Map<number, CareFacility>(
    facilities.filter(f => f.id != null).map(f => [f.id as number, f])
  );
  const familyById = new Map<number, FamilyMember>(
    familyMembers.filter(m => m.id != null).map(m => [m.id as number, m])
  );
  const petById = new Map<number, Pet>(
    pets.filter(p => p.id != null).map(p => [p.id as number, p])
  );

  return bookings.map((b): BookingListItem => ({
    ...b,
    bookingTypeUi: resolveBookingType(b),
    statusUi: resolveStatus(b.status),
    facilityNameUi: b.facilityName ?? resolveFacilityName(b.facilityId, facilityById),
    memberNameUi: b.memberName ?? resolveMemberName(b, familyById, petById),
  }));
}

function resolveBookingType(b: CareBooking): UiBookingType {
  const dependentType = (b.dependentType ?? '').toUpperCase();
  const careType = (b.careType ?? '').toUpperCase();
  return dependentType === 'PET' || careType === 'PET' ? 'Pet' : 'Family';
}

function resolveStatus(status: string | undefined): UiBookingStatus {
  switch ((status ?? '').toUpperCase()) {
    case 'CONFIRMED': return 'Confirmed';
    case 'PENDING':   return 'Pending';
    case 'COMPLETED': return 'Completed';
    case 'CANCELLED':
    case 'CANCELED':  return 'Cancelled';
    default:          return status ?? '';
  }
}

function resolveFacilityName(facilityId: number, facilityById: Map<number, CareFacility>): string {
  return facilityById.get(facilityId)?.facilityName ?? `Facility #${facilityId}`;
}

function resolveMemberName(
  booking: CareBooking,
  familyById: Map<number, FamilyMember>,
  petById: Map<number, Pet>
): string {
  if (!booking.dependentId) return 'Unknown dependent';
  const bookingType = resolveBookingType(booking);
  if (bookingType === 'Pet') {
    return petById.get(booking.dependentId)?.petName ?? `Pet #${booking.dependentId}`;
  }
  return familyById.get(booking.dependentId)?.fullName ?? `Member #${booking.dependentId}`;
}
