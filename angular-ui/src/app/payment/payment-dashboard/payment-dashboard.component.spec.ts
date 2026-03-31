import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PaymentDashboardComponent } from './payment-dashboard.component';
import { MockDataService } from '../../shared/mock-data.service';
import { PaymentInvoice } from '../../shared/models';

describe('PaymentDashboardComponent', () => {
  let component: PaymentDashboardComponent;
  let fixture: ComponentFixture<PaymentDashboardComponent>;
  let mockDataService: jasmine.SpyObj<MockDataService>;

  const fakeInvoices: PaymentInvoice[] = [
    { id: 1, bookingId: 1, amount: 150, currency: 'USD', status: 'Paid', paymentDate: '2026-03-28', bookingDescription: 'Buddy @ Downtown' },
    { id: 2, bookingId: 2, amount: 500, currency: 'USD', status: 'Unpaid', bookingDescription: 'Mary @ Sunset' }
  ];

  beforeEach(async () => {
    mockDataService = jasmine.createSpyObj<MockDataService>('MockDataService', ['getInvoices']);
    mockDataService.getInvoices.and.returnValue([...fakeInvoices]);

    await TestBed.configureTestingModule({
      imports: [PaymentDashboardComponent],
      providers: [
        provideRouter([]),
        { provide: MockDataService, useValue: mockDataService }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(PaymentDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate totalDue as 500', () => {
    expect(component.totalDue).toBe(500);
  });

  it('should calculate totalPaid as 150', () => {
    expect(component.totalPaid).toBe(150);
  });

  it('should render 2 table rows for invoices', () => {
    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(2);
  });

  it('should show Pay Now link only for unpaid invoices', () => {
    const payLinks = fixture.nativeElement.querySelectorAll('a.btn-primary');
    const payNowLinks = Array.from(payLinks).filter((el: unknown) => (el as HTMLElement).textContent?.includes('Pay Now'));
    expect(payNowLinks.length).toBe(1);
  });
});
