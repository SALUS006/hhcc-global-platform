import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MockDataService } from '../../shared/mock-data.service';
import { Pet } from '../../shared/models';

@Component({
  selector: 'app-pet-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mt-3">
      <div class="page-header">
        <div>
          <h1>My Pets</h1>
          <p class="breadcrumb">Profile &gt; My Pets</p>
        </div>
        <a routerLink="/profile/pets/add" class="btn btn-primary">+ Add Pet</a>
      </div>

      <div *ngIf="pets.length === 0" class="card empty-state">
        <div class="icon">🐾</div>
        <p>You haven't added any pets yet.</p>
        <a routerLink="/profile/pets/add" class="btn btn-primary mt-2">+ Add Pet</a>
      </div>

      <div class="grid grid-3" *ngIf="pets.length > 0">
        <div class="card pet-card" *ngFor="let p of pets">
          <div class="pet-icon">{{ p.petType === 'Dog' ? '🐕' : p.petType === 'Cat' ? '🐈' : '🐾' }}</div>
          <h3>{{ p.petName }}</h3>
          <p class="breed">{{ p.breed }}</p>
          <div class="pet-details">
            <span>Age: {{ p.age }} years</span>
            <span *ngIf="p.weight">Weight: {{ p.weight }} lbs</span>
          </div>
          <p *ngIf="p.specialNotes" class="notes">{{ p.specialNotes }}</p>
          <div class="pet-actions">
            <a [routerLink]="['/profile/pets/edit', p.id]" class="btn btn-sm btn-secondary">Edit</a>
            <button class="btn btn-sm btn-danger" (click)="onDelete(p.id!)">Delete</button>
          </div>
        </div>
      </div>

      <div class="mt-2">
        <a routerLink="/profile/family" class="btn btn-secondary">← View Family Members</a>
      </div>
    </div>
  `,
  styles: [`
    .breadcrumb { color: var(--text-light); font-size: 13px; margin-top: 4px; }
    .pet-card { text-align: center; }
    .pet-icon { font-size: 56px; margin-bottom: 8px; }
    .pet-card h3 { font-size: 18px; }
    .breed { color: var(--text-light); font-size: 14px; margin-bottom: 8px; }
    .pet-details { display: flex; gap: 16px; justify-content: center; font-size: 13px; color: var(--text-light); margin-bottom: 8px; }
    .notes { font-size: 13px; color: var(--text-light); font-style: italic; margin-bottom: 12px; }
    .pet-actions { display: flex; gap: 8px; justify-content: center; }
  `]
})
export class PetListComponent {
  pets: Pet[] = [];
  constructor(private mock: MockDataService) { this.load(); }
  load() { this.pets = this.mock.getPets(); }
  onDelete(id: number) {
    if (confirm('Are you sure you want to delete this pet?')) {
      this.mock.deletePet(id);
      this.load();
    }
  }
}
