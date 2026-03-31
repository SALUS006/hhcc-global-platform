import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router, ActivatedRoute, convertToParamMap } from '@angular/router';
import { PetFormComponent } from './pet-form.component';
import { MockDataService } from '../../shared/mock-data.service';
import { Pet } from '../../shared/models';

describe('PetFormComponent', () => {
  let component: PetFormComponent;
  let fixture: ComponentFixture<PetFormComponent>;
  let mockDataService: jasmine.SpyObj<MockDataService>;
  let router: Router;

  beforeEach(async () => {
    mockDataService = jasmine.createSpyObj<MockDataService>('MockDataService', ['addPet', 'updatePet', 'getPet']);
    mockDataService.addPet.and.callFake((p: Pet) => ({ ...p, id: 100 }));

    await TestBed.configureTestingModule({
      imports: [PetFormComponent],
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
    fixture = TestBed.createComponent(PetFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render form fields for pet data', () => {
    const inputs = fixture.nativeElement.querySelectorAll('input.form-control, select.form-control, textarea.form-control');
    expect(inputs.length).toBeGreaterThanOrEqual(5);
  });

  it('should call addPet and navigate on valid submit', () => {
    component.form = { petName: 'Rex', petType: 'Dog', breed: 'Lab', age: 2 };
    component.onSubmit();
    expect(mockDataService.addPet).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/profile/pets']);
  });
});
