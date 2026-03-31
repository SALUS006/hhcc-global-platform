import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, ActivatedRoute, convertToParamMap } from '@angular/router';
import { PaymentCheckoutComponent } from './payment-checkout.component';
import { MockDataService } from '../../shared/mock-data.service';
import { PaymentInvoice } from '../../shared/models';

describe('PaymentCheckoutComponent', () => {
  let component: PaymentCheckoutComponent;
  let fixture: ComponentFixture<PaymentCheckoutComponent>;
  let mockDataService: jasmine.SpyObj<MockDataService>;

  const fakeInvoice: PaymentInvoice = {
    id: 2, bookingId: 2, amount: 500, currency: 'USD', status: 'Unpaid', bookingDescription: 'Mary @ Sunset'
  };

  beforeEach(async () => {
    mockDataService = jasmine.createSpyObj<MockDataService>('MockDataService', ['getInvoice', 'payInvoice']);
    mockDataService.getInvoice.and.returnValue({ ...fakeInvoice });
    mockDataService.payInvoice.and.returnValue({ ...fakeInvoice, status: 'Paid' });

    await TestBed.configureTestingModule({
      imports: [PaymentCheckoutComponent],
      providers: [
        provideRouter([]),
        { provide: MockDataService, useValue: mockDataService },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ invoiceId: '2' }) } }
        }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(PaymentCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load the invoice on init', () => {
    expect(mockDataService.getInvoice).toHaveBeenCalledWith(2);
    expect(component.invoice).toBeTruthy();
  });

  it('should calculate tax as 8% of invoice amount', () => {
    expect(component.tax).toBe(40);
  });

  it('should calculate total as amount plus tax', () => {
    expect(component.total).toBe(540);
  });

  it('should set paid to true when onPay is called with valid card data', () => {
    component.cardNumber = '4111111111111111';
    component.expiry = '12/28';
    component.cvv = '123';
    component.holderName = 'John Doe';
    component.onPay();
    expect(component.paid).toBeTrue();
    expect(mockDataService.payInvoice).toHaveBeenCalledWith(2);
  });
});
