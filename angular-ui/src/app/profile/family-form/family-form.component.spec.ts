import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router, ActivatedRoute, convertToParamMap } from '@angular/router';
import { FamilyFormComponent } from './family-form.component';
import { MockDataService } from '../../shared/mock-data.service';
import { FamilyMember } from '../../shared/models';

describe('FamilyFormComponent', () => {
  let component: FamilyFormComponent;
  let fixture: ComponentFixture<FamilyFormComponent>;
  let mockDataService: jasmine.SpyObj<MockDataService>;
  let router: Router;

  beforeEach(async () => {
    mockDataService = jasmine.createSpyObj<MockDataService>('MockDataService', [
      'addFamilyMember', 'updateFamilyMember', 'getFamilyMember'
    ]);
    mockDataService.addFamilyMember.and.callFake((f: FamilyMember) => ({ ...f, id: 100 }));

    await TestBed.configureTestingModule({
      imports: [FamilyFormComponent],
      providers: [
        provideRouter([]),
        { provide: MockDataService, useValue: mockDataService },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({}) } }
        }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture = TestBed.createComponent(FamilyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render form with 5 fields', () => {
    const inputs = fixture.nativeElement.querySelectorAll('input.form-control, select.form-control, textarea.form-control');
    expect(inputs.length).toBe(5);
  });

  it('should display Add title in add mode', () => {
    const h1: HTMLElement = fixture.nativeElement.querySelector('h1');
    expect(h1.textContent).toContain('Add');
  });

  it('should call addFamilyMember and navigate on valid submit', () => {
    component.form = {
      fullName: 'New Member',
      relationship: 'Child',
      dateOfBirth: '2020-01-01',
      careType: 'Child Care'
    };
    component.onSubmit();
    expect(mockDataService.addFamilyMember).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/profile/family']);
  });
});
