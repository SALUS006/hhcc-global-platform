import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PetListComponent } from './pet-list.component';
import { MockDataService } from '../../shared/mock-data.service';
import { Pet } from '../../shared/models';

describe('PetListComponent', () => {
  let component: PetListComponent;
  let fixture: ComponentFixture<PetListComponent>;
  let mockDataService: jasmine.SpyObj<MockDataService>;

  const fakePets: Pet[] = [
    { id: 1, petName: 'Buddy', species: 'Dog', breed: 'Golden', ageYears: 3 },
    { id: 2, petName: 'Whiskers', species: 'Cat', breed: 'Persian', ageYears: 2 }
  ];

  beforeEach(async () => {
    mockDataService = jasmine.createSpyObj<MockDataService>('MockDataService', ['getPets', 'deletePet']);
    mockDataService.getPets.and.returnValue([...fakePets]);

    await TestBed.configureTestingModule({
      imports: [PetListComponent],
      providers: [
        provideRouter([]),
        { provide: MockDataService, useValue: mockDataService }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(PetListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render 2 pet cards', () => {
    const cards = fixture.nativeElement.querySelectorAll('.pet-card');
    expect(cards.length).toBe(2);
  });

  it('should show empty state when no pets exist', () => {
    mockDataService.getPets.and.returnValue([]);
    component.load();
    fixture.detectChanges();
    const emptyState = fixture.nativeElement.querySelector('.empty-state');
    expect(emptyState).toBeTruthy();
  });

  it('should call deletePet when delete is confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    component.onDelete(1);
    expect(mockDataService.deletePet).toHaveBeenCalledWith(1);
  });
});
