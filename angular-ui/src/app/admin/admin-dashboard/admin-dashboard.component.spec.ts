import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { MockDataService } from '../../shared/mock-data.service';
import { UserProfile, CareBooking, PaymentInvoice, CareFacility } from '../../shared/models';

describe('AdminDashboardComponent', () => {
  let component: AdminDashboardComponent;
  let fixture: ComponentFixture<AdminDashboardComponent>;
  let mockDataService: jasmine.SpyObj<MockDataService>;

  const fakeProfiles: UserProfile[] = [
    { id: 1, fullName: 'Admin', email: 'admin@hhcc.com', role: 'Admin', contactNumber: '555-0100' },
    { id: 2, fullName: 'John', email: 'john@email.com', role: 'Customer', contactNumber: '555-0101' },
    { id: 3, fullName: 'Jane', email: 'jane@email.com', role: 'Customer', contactNumber: '555-0102' }
  ];
  const fakeBookings: CareBooking[] = [
    { id: 1, userId: 2, facilityId: 1, pickupTime: '', dropoffTime: '', status: 'Confirmed' },
    { id: 2, userId: 3, facilityId: 2, pickupTime: '', dropoffTime: '', status: 'Pending' }
  ];
  const fakeInvoices: PaymentInvoice[] = [
    { id: 1, bookingId: 1, amount: 150, currency: 'USD', status: 'Paid' },
    { id: 2, bookingId: 2, amount: 500, currency: 'USD', status: 'Unpaid' }
  ];
  const fakeFacilities: CareFacility[] = [
    { id: 1, facilityName: 'Facility A', locationAddress: '123 St', isActive: true },
    { id: 2, facilityName: 'Facility B', locationAddress: '456 Ave', isActive: true }
  ];

  beforeEach(async () => {
    mockDataService = jasmine.createSpyObj<MockDataService>('MockDataService', [
      'getProfiles', 'getBookings', 'getInvoices', 'getFacilities'
    ]);
    mockDataService.getProfiles.and.returnValue(fakeProfiles);
    mockDataService.getBookings.and.returnValue(fakeBookings);
    mockDataService.getInvoices.and.returnValue(fakeInvoices);
    mockDataService.getFacilities.and.returnValue(fakeFacilities);

    await TestBed.configureTestingModule({
      imports: [AdminDashboardComponent],
      providers: [
        provideRouter([]),
        { provide: MockDataService, useValue: mockDataService }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(AdminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render 4 KPI cards', () => {
    const kpiCards = fixture.nativeElement.querySelectorAll('.kpi-card');
    expect(kpiCards.length).toBe(4);
  });

  it('should set stats.users to 3', () => {
    expect(component.stats.users).toBe(3);
  });

  it('should render 3 rows in user management table', () => {
    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(3);
  });

  it('should render 2 facility admin cards', () => {
    const facilityCards = fixture.nativeElement.querySelectorAll('.facility-admin-card');
    expect(facilityCards.length).toBe(2);
  });
});
