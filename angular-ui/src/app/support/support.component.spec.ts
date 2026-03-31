import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SupportComponent } from './support.component';

describe('SupportComponent', () => {
  let component: SupportComponent;
  let fixture: ComponentFixture<SupportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupportComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(SupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should start with rating at 0', () => {
    expect(component.rating).toBe(0);
  });

  it('should update rating when a star is clicked', () => {
    const stars = fixture.nativeElement.querySelectorAll('.star');
    (stars[2] as HTMLElement).click();
    expect(component.rating).toBe(3);
  });

  it('should render 3 contact cards', () => {
    const cards = fixture.nativeElement.querySelectorAll('.contact-card');
    expect(cards.length).toBe(3);
  });

  it('should render 5 FAQ items', () => {
    const items = fixture.nativeElement.querySelectorAll('.faq-item');
    expect(items.length).toBe(5);
  });

  it('should toggle FAQ open state when clicked', () => {
    expect(component.faqs[0].open).toBeFalse();
    const faqItem: HTMLElement = fixture.nativeElement.querySelector('.faq-item');
    faqItem.click();
    expect(component.faqs[0].open).toBeTrue();
    fixture.detectChanges();
    const answer = fixture.nativeElement.querySelector('.faq-a');
    expect(answer).toBeTruthy();
  });
});
