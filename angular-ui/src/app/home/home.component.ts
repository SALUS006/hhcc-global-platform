import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MockDataService } from '../shared/mock-data.service';
import { CareFacility } from '../shared/models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
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
