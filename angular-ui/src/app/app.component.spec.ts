import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([])]
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render navbar with logo text HHCC', () => {
    const logo = fixture.nativeElement.querySelector('.logo');
    expect(logo).toBeTruthy();
    expect(logo.textContent).toContain('HHCC');
  });

  it('should render 7 navigation links', () => {
    const links = fixture.nativeElement.querySelectorAll('.nav-links li');
    expect(links.length).toBe(7);
  });

  it('should toggle menuOpen when hamburger is clicked', () => {
    expect(component.menuOpen).toBeFalse();
    const hamburger: HTMLButtonElement = fixture.nativeElement.querySelector('.hamburger');
    hamburger.click();
    expect(component.menuOpen).toBeTrue();
    hamburger.click();
    expect(component.menuOpen).toBeFalse();
  });

  it('should render the footer with copyright text', () => {
    const footer = fixture.nativeElement.querySelector('.footer');
    expect(footer).toBeTruthy();
    expect(footer.textContent).toContain('Helping Hands Care Center');
  });
});
