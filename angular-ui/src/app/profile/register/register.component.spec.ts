import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RegisterComponent } from './register.component';
import { MockDataService } from '../../shared/mock-data.service';
import { UserProfile } from '../../shared/models';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockDataService: jasmine.SpyObj<MockDataService>;

  beforeEach(async () => {
    mockDataService = jasmine.createSpyObj<MockDataService>('MockDataService', ['createProfile']);
    mockDataService.createProfile.and.callFake((p: UserProfile) => ({ ...p, id: 100 }));

    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        provideRouter([]),
        { provide: MockDataService, useValue: mockDataService }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render form with 5 input fields', () => {
    const inputs = fixture.nativeElement.querySelectorAll('input.form-control');
    expect(inputs.length).toBe(5);
  });

  it('should show error when submitting with empty fields', () => {
    component.onSubmit();
    fixture.detectChanges();
    expect(component.error).toBe('Please fill in all required fields.');
  });

  it('should show error when password is shorter than 6 characters', () => {
    component.form = { fullName: 'Test', email: 'test@test.com', contactNumber: '555', role: 'Customer' };
    component.password = '123';
    component.confirmPassword = '123';
    component.agreed = true;
    component.onSubmit();
    expect(component.error).toBe('Password must be at least 6 characters.');
  });

  it('should show error when passwords do not match', () => {
    component.form = { fullName: 'Test', email: 'test@test.com', contactNumber: '555', role: 'Customer' };
    component.password = '123456';
    component.confirmPassword = '654321';
    component.agreed = true;
    component.onSubmit();
    expect(component.error).toBe('Passwords do not match.');
  });

  it('should show error when terms checkbox is not checked', () => {
    component.form = { fullName: 'Test', email: 'test@test.com', contactNumber: '555', role: 'Customer' };
    component.password = '123456';
    component.confirmPassword = '123456';
    component.agreed = false;
    component.onSubmit();
    expect(component.error).toBe('You must agree to the Terms & Conditions.');
  });

  it('should call createProfile and set success on valid submit', () => {
    component.form = { fullName: 'Test', email: 'test@test.com', contactNumber: '555', role: 'Customer' };
    component.password = '123456';
    component.confirmPassword = '123456';
    component.agreed = true;
    component.onSubmit();
    expect(mockDataService.createProfile).toHaveBeenCalledWith(component.form);
    expect(component.success).toBeTrue();
    expect(component.error).toBe('');
  });
});
