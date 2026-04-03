import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { BookingListComponent } from './booking-list.component';
import { ApiService } from '../../shared/api.service';
import { CareBooking, CareFacility, FamilyMember, Pet } from '../../shared/models';

describe('BookingListComponent', () => {
  let component: BookingListComponent;
  let fixture: ComponentFixture<BookingListComponent>;
  let apiService: jasmine.SpyObj<ApiService>;

  const fakeBookings: CareBooking[] = [
    {
      id: 1, userId: 1, facilityId: 10,
      careType: 'PET', dependentType: 'PET', dependentId: 101,
      pickupTime: '2026-03-30T08:00:00', dropoffTime: '2026-03-30T17:00:00',
      status: 'PENDING'
    },
    {
      id: 2, userId: 1, facilityId: 11,
      careType: 'CHILDCARE', dependentType: 'FAMILY_MEMBER', dependentId: 201,
      pickupTime: '2026-04-01T09:00:00', dropoffTime: '2026-04-01T16:00:00',
      status: 'CONFIRMED'
    }
  ];

  const fakeFacilities: CareFacility[] = [
    { id: 10, facilityName: 'Downtown Pet Care', locationAddress: 'A', isActive: true },
    { id: 11, facilityName: 'Sunshine Childcare', locationAddress: 'B', isActive: true }
  ];

  const fakeFamily: FamilyMember[] = [
    { id: 201, userId: 1, fullName: 'Mary Doe', relationship: 'Mother', dateOfBirth: '1954-01-10', careType: 'Elderly Care' }
  ];

  const fakePets: Pet[] = [
    { id: 101, userId: 1, petName: 'Buddy', petType: 'Dog', breed: 'Golden Retriever', age: 3 }
  ];

  beforeEach(async () => {
    apiService = jasmine.createSpyObj<ApiService>('ApiService', [
      'getBookings', 'getFacilities', 'getFamilyMembers', 'getPets'
    ]);
    apiService.getBookings.and.returnValue(of(fakeBookings));
    apiService.getFacilities.and.returnValue(of(fakeFacilities));
    apiService.getFamilyMembers.and.returnValue(of(fakeFamily));
    apiService.getPets.and.returnValue(of(fakePets));

    await TestBed.configureTestingModule({
      imports: [BookingListComponent],
      providers: [
        provideRouter([]),
        { provide: ApiService, useValue: apiService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BookingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render 2 booking cards', () => {
    const cards = fixture.nativeElement.querySelectorAll('.booking-card');
    expect(cards.length).toBe(2);
  });

  it('should map and render member and facility names', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Buddy');
    expect(text).toContain('Downtown Pet Care');
    expect(text).toContain('Mary Doe');
    expect(text).toContain('Sunshine Childcare');
  });

  it('should filter by type Pet', () => {
    component.filterType = 'Pet';
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.booking-card').length).toBe(1);
  });

  it('should filter by status Pending', () => {
    component.filterStatus = 'Pending';
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.booking-card').length).toBe(1);
  });

  it('should show empty state when no bookings match filters', () => {
    component.filterType = 'Family';
    component.filterStatus = 'Pending';
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.empty-state')).toBeTruthy();
  });
});
