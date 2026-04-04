import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { BookingFormComponent } from './booking-form.component';
import { MockDataService } from '../../shared/mock-data.service';
import { FamilyMember, Pet, CareFacility, CareBooking } from '../../shared/models';

describe('BookingFormComponent', () => {
  let component: BookingFormComponent;
  let fixture: ComponentFixture<BookingFormComponent>;
  let mockDataService: jasmine.SpyObj<MockDataService>;

  const fakeFamily: FamilyMember[] = [
    { id: 1, fullName: 'Sarah Doe', relationship: 'Daughter', dateOfBirth: '2018-03-15', careType: 'Child Care' }
  ];
  const fakePets: Pet[] = [
    { id: 1, petName: 'Buddy', species: 'Dog', breed: 'Golden', ageYears: 3 }
  ];
  const fakeFacilities: CareFacility[] = [
    { id: 1, facilityName: 'Downtown Pet Care', locationAddress: '123 Main St', description: 'Premium pet care.', isActive: true }
  ];

  beforeEach(async () => {
    mockDataService = jasmine.createSpyObj<MockDataService>('MockDataService', [
      'getFamilyMembers', 'getPets', 'getFacilities', 'createBooking'
    ]);
    mockDataService.getFamilyMembers.and.returnValue(fakeFamily);
    mockDataService.getPets.and.returnValue(fakePets);
    mockDataService.getFacilities.and.returnValue(fakeFacilities);
    mockDataService.createBooking.and.callFake((b: CareBooking) => ({ ...b, id: 100 }));

    await TestBed.configureTestingModule({
      imports: [BookingFormComponent],
      providers: [
        provideRouter([]),
        { provide: MockDataService, useValue: mockDataService }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(BookingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should default booking type to Family', () => {
    expect(component.bookingType).toBe('Family');
  });

  it('should show pet dropdown when toggling to Pet type', () => {
    component.bookingType = 'Pet';
    fixture.detectChanges();
    const petSelect = fixture.nativeElement.querySelector('#pet');
    expect(petSelect).toBeTruthy();
  });

  it('should show facility preview when a facility is selected', () => {
    component.selectedFacilityId = 1;
    fixture.detectChanges();
    const preview = fixture.nativeElement.querySelector('.facility-preview');
    expect(preview).toBeTruthy();
    expect(preview.textContent).toContain('Downtown Pet Care');
  });
});
