import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MockDataService } from '../shared/mock-data.service';
import { CareFacility } from '../shared/models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Hero -->
    <section class="hero">
      <div class="container">
        <h1>Helping Hands Care Center</h1>
        <p>Caring for Your Family &amp; Pets with Love and Trust</p>
        <div class="hero-actions">
          <a routerLink="/scheduling" class="btn btn-primary">Explore Services</a>
          <a routerLink="/register" class="btn btn-secondary">Sign Up</a>
        </div>
      </div>
    </section>

    <!-- Services -->
    <section class="container mt-3">
      <h2 class="section-title">Our Services</h2>
      <div class="grid grid-3">
        <div class="card service-card" *ngFor="let svc of services">
          <div class="service-icon">{{ svc.icon }}</div>
          <h3>{{ svc.title }}</h3>
          <p>{{ svc.desc }}</p>
          <a routerLink="/scheduling" class="btn btn-sm btn-secondary mt-2">Learn More</a>
        </div>
      </div>
    </section>

    <!-- USPs -->
    <section class="container mt-3">
      <h2 class="section-title">Why Choose HHCC?</h2>
      <div class="grid grid-2">
        <div class="usp-item" *ngFor="let usp of usps">
          <span class="usp-check">✅</span>
          <span>{{ usp }}</span>
        </div>
      </div>
    </section>

    <!-- Facilities -->
    <section class="container mt-3 mb-3">
      <h2 class="section-title">Our Care Centers</h2>
      <div class="grid grid-2">
        <div class="card facility-card" *ngFor="let f of facilities">
          <div class="facility-photo">🏢</div>
          <h3>{{ f.facilityName }}</h3>
          <p class="text-light">{{ f.locationAddress }}</p>
          <p>{{ f.description }}</p>
          <div class="stars">⭐⭐⭐⭐⭐</div>
          <a routerLink="/scheduling" class="btn btn-sm btn-primary mt-1">View Details</a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero { background: linear-gradient(135deg, var(--primary) 0%, #ff6e40 100%); color: #fff; padding: 80px 0; text-align: center; }
    .hero h1 { font-size: 42px; margin-bottom: 12px; }
    .hero p { font-size: 18px; opacity: 0.9; margin-bottom: 28px; }
    .hero-actions { display: flex; gap: 16px; justify-content: center; }
    .hero .btn-secondary { background: #fff; color: var(--primary); }
    .section-title { font-size: 24px; font-weight: 700; margin-bottom: 24px; text-align: center; }
    .service-card { text-align: center; }
    .service-icon { font-size: 48px; margin-bottom: 12px; }
    .service-card h3 { font-size: 18px; margin-bottom: 8px; }
    .service-card p { color: var(--text-light); font-size: 14px; }
    .usp-item { display: flex; align-items: center; gap: 12px; padding: 12px 0; font-size: 16px; }
    .usp-check { font-size: 20px; }
    .facility-card { display: flex; flex-direction: column; gap: 8px; }
    .facility-photo { font-size: 64px; text-align: center; padding: 20px; background: var(--bg); border-radius: var(--radius); }
    .facility-card h3 { font-size: 18px; }
    .text-light { color: var(--text-light); font-size: 14px; }
    .stars { color: var(--accent); }
  `]
})
export class HomeComponent {
  facilities: CareFacility[] = [];
  services = [
    { icon: '🐾', title: 'Pet Care', desc: 'Daycare, boarding, and grooming for your beloved pets.' },
    { icon: '👴', title: 'Elderly Care', desc: 'Community centers with compassionate activities and support.' },
    { icon: '👨‍👩‍👧', title: 'Family Care', desc: 'Flexible pick-up and drop-off scheduling for your family.' }
  ];
  usps = [
    'Trusted by 10,000+ families nationwide',
    'Certified & background-checked caregivers',
    'Flexible scheduling with real-time updates',
    'Secure online payments'
  ];

  constructor(private mock: MockDataService) {
    this.facilities = this.mock.getFacilities();
  }
}
