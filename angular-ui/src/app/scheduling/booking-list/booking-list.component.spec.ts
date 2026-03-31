import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BookingListComponent } from './booking-list.component';
import { MockDataService } from '../../shared/mock-data.service';
import { CareBooking } from '../../shared/models';

describe('BookingListComponent', () => {
  let component: BookingListComponent;
  let fixture: ComponentFixture<BookingListComponent>;
  let mockDataService: jasmine.SpyObj<MockDataService>;

  const fakeBookings: CareBooking[] = [
    { id: 1, userId: 2, facilityId: 1, pickupTime: '2026-03-30T08:00:00', dropoffTime: '2026-03-30T17:00:00', status: 'Confirmed', bookingType: 'Pet', memberName: 'Buddy', facilityName: 'Downtown Pet Care' },
    { id: 2, userId: 3, facilityId: 2, pickupTime: '2026-04-01T09:00:00', dropoffTime: '2026-04-01T16:00:00', status: 'Pending', bookingType: 'Family', memberName: 'Mary Doe', facilityName: 'Sunset Elderly Care' }
  ];

  beforeEach(async () => {
    mockDataService = jasmine.createSpyObj<MockDataService>('MockDataService', ['getBookings']);
    mockDataService.getBookings.and.returnValue([...fakeBookings]);

    await TestBed.configureTestingModule({
      imports: [BookingListComponent],
      providers: [
        provideRouter([]),
        { provide: MockDataService, useValue: mockDataService }
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

  it('should show 1 booking when filtering by type Pet', () => {
    component.filterType = 'Pet';
    fixture.detectChanges();
    const cards = fixture.nativeElement.querySelectorAll('.booking-card');
    expect(cards.length).toBe(1);
  });

  it('should show 1 booking when filtering by status Pending', () => {
    component.filterStatus = 'Pending';
    fixture.detectChanges();
    const cards = fixture.nativeElement.querySelectorAll('.booking-card');
    expect(cards.length).toBe(1);
  });

  it('should show empty state when no bookings match filters', () => {
    component.filterType = 'Pet';
    component.filterStatus = 'Pending';
    fixture.detectChanges();
    const emptyState = fixture.nativeElement.querySelector('.empty-state');
    expect(emptyState).toBeTruthy();
  });
});
