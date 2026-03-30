import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MockDataService } from '../../shared/mock-data.service';
import { Pet } from '../../shared/models';

@Component({
  selector: 'app-pet-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container mt-3">
      <div class="page-header">
        <div>
          <h1>{{ isEdit ? 'Edit' : 'Add' }} Pet</h1>
          <p class="breadcrumb">Profile &gt; My Pets &gt; {{ isEdit ? 'Edit' : 'Add New' }}</p>
        </div>
      </div>
      <div class="card form-card">
        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="petName">Pet Name *</label>
            <input id="petName" class="form-control" [(ngModel)]="form.petName" name="petName" required>
          </div>
          <div class="form-group">
            <label for="petType">Pet Type *</label>
            <select id="petType" class="form-control" [(ngModel)]="form.petType" name="petType" required>
              <option value="">Select...</option>
              <option *ngFor="let t of petTypes" [value]="t">{{ t }}</option>
            </select>
          </div>
          <div class="form-group">
            <label for="breed">Breed</label>
            <input id="breed" class="form-control" [(ngModel)]="form.breed" name="breed" placeholder="e.g. Golden Retriever">
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="age">Age (years) *</label>
              <input id="age" type="number" class="form-control" [(ngModel)]="form.age" name="age" min="0" required>
            </div>
            <div class="form-group">
              <label for="weight">Weight (lbs)</label>
              <input id="weight" type="number" class="form-control" [(ngModel)]="form.weight" name="weight" min="0">
            </div>
          </div>
          <div class="form-group">
            <label for="notes">Special Notes (Allergies, medications, etc.)</label>
            <textarea id="notes" class="form-control" [(ngModel)]="form.specialNotes" name="specialNotes"></textarea>
          </div>
          <div class="form-actions">
            <a routerLink="/profile/pets" class="btn btn-secondary">Cancel</a>
            <button type="submit" class="btn btn-primary">{{ isEdit ? 'Update' : 'Save' }} Pet</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`.form-card { max-width: 600px; } .form-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 8px; } .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; } .breadcrumb { color: var(--text-light); font-size: 13px; margin-top: 4px; }`]
})
export class PetFormComponent implements OnInit {
  form: Pet = { petName: '', petType: '', breed: '', age: 0 };
  isEdit = false;
  editId = 0;
  petTypes = ['Dog', 'Cat', 'Bird', 'Fish', 'Other'];

  constructor(private mock: MockDataService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.editId = +id;
      const existing = this.mock.getPet(this.editId);
      if (existing) { this.form = { ...existing }; }
    }
  }

  onSubmit() {
    if (!this.form.petName || !this.form.petType) return;
    if (this.isEdit) { this.mock.updatePet(this.editId, this.form); }
    else { this.mock.addPet(this.form); }
    this.router.navigate(['/profile/pets']);
  }
}
