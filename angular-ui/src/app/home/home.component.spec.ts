import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HomeComponent } from './home.component';
import { MockDataService } from '../shared/mock-data.service';
import { CareFacility } from '../shared/models';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockDataService: jasmine.SpyObj<MockDataService>;

  const fakeFacilities: CareFacility[] = [
    { id: 1, facilityName: 'Facility A', locationAddress: '123 St', description: 'Desc A', isActive: true },
    { id: 2, facilityName: 'Facility B', locationAddress: '456 Ave', description: 'Desc B', isActive: true }
  ];

  beforeEach(async () => {
    mockDataService = jasmine.createSpyObj<MockDataService>('MockDataService', ['getFacilities']);
    mockDataService.getFacilities.and.returnValue(fakeFacilities);

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        provideRouter([]),
        { provide: MockDataService, useValue: mockDataService }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render hero section with h1 Helping Hands Care Center', () => {
    const h1: HTMLElement = fixture.nativeElement.querySelector('.hero h1');
    expect(h1.textContent).toContain('Helping Hands Care Center');
  });

  it('should render 3 service cards', () => {
    const cards = fixture.nativeElement.querySelectorAll('.service-card');
    expect(cards.length).toBe(3);
  });

  it('should render 4 USP items', () => {
    const items = fixture.nativeElement.querySelectorAll('.usp-item');
    expect(items.length).toBe(4);
  });

  it('should render facility cards from mock data', () => {
    const cards = fixture.nativeElement.querySelectorAll('.facility-card');
    expect(cards.length).toBe(2);
    expect(cards[0].textContent).toContain('Facility A');
    expect(cards[1].textContent).toContain('Facility B');
  });
});
