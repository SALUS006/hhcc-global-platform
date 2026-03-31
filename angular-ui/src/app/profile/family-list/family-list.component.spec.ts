import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { FamilyListComponent } from './family-list.component';
import { MockDataService } from '../../shared/mock-data.service';
import { FamilyMember } from '../../shared/models';

describe('FamilyListComponent', () => {
  let component: FamilyListComponent;
  let fixture: ComponentFixture<FamilyListComponent>;
  let mockDataService: jasmine.SpyObj<MockDataService>;

  const fakeMembers: FamilyMember[] = [
    { id: 1, fullName: 'Alice', relationship: 'Daughter', dateOfBirth: '2018-01-01', careType: 'Child Care' },
    { id: 2, fullName: 'Bob', relationship: 'Son', dateOfBirth: '2015-06-15', careType: 'Child Care' },
    { id: 3, fullName: 'Carol', relationship: 'Mother', dateOfBirth: '1955-03-20', careType: 'Elderly Care' }
  ];

  beforeEach(async () => {
    mockDataService = jasmine.createSpyObj<MockDataService>('MockDataService', ['getFamilyMembers', 'deleteFamilyMember']);
    mockDataService.getFamilyMembers.and.returnValue([...fakeMembers]);

    await TestBed.configureTestingModule({
      imports: [FamilyListComponent],
      providers: [
        provideRouter([]),
        { provide: MockDataService, useValue: mockDataService }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(FamilyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render 3 table rows for family members', () => {
    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(3);
  });

  it('should show empty state when getFamilyMembers returns empty array', () => {
    mockDataService.getFamilyMembers.and.returnValue([]);
    component.load();
    fixture.detectChanges();
    const emptyState = fixture.nativeElement.querySelector('.empty-state');
    expect(emptyState).toBeTruthy();
  });

  it('should call deleteFamilyMember when delete is confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    component.onDelete(1);
    expect(mockDataService.deleteFamilyMember).toHaveBeenCalledWith(1);
  });
});
