import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MockDataService } from '../../shared/mock-data.service';
import { FamilyMember } from '../../shared/models';

@Component({
  selector: 'app-family-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container mt-3">
      <div class="page-header">
        <div>
          <h1>{{ isEdit ? 'Edit' : 'Add' }} Family Member</h1>
          <p class="breadcrumb">Profile &gt; Family Members &gt; {{ isEdit ? 'Edit' : 'Add New' }}</p>
        </div>
      </div>
      <div class="card form-card">
        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="fullName">Full Name *</label>
            <input id="fullName" class="form-control" [(ngModel)]="form.fullName" name="fullName" required>
          </div>
          <div class="form-group">
            <label for="relationship">Relationship *</label>
            <select id="relationship" class="form-control" [(ngModel)]="form.relationship" name="relationship" required>
              <option value="">Select...</option>
              <option *ngFor="let r of relationships" [value]="r">{{ r }}</option>
            </select>
          </div>
          <div class="form-group">
            <label for="dob">Date of Birth *</label>
            <input id="dob" type="date" class="form-control" [(ngModel)]="form.dateOfBirth" name="dateOfBirth" required>
          </div>
          <div class="form-group">
            <label for="careType">Care Type *</label>
            <select id="careType" class="form-control" [(ngModel)]="form.careType" name="careType" required>
              <option value="">Select...</option>
              <option value="Child Care">Child Care</option>
              <option value="Elderly Care">Elderly Care</option>
            </select>
          </div>
          <div class="form-group">
            <label for="notes">Special Notes</label>
            <textarea id="notes" class="form-control" [(ngModel)]="form.specialNotes" name="specialNotes" placeholder="Allergies, medical conditions, etc."></textarea>
          </div>
          <div class="form-actions">
            <a routerLink="/profile/family" class="btn btn-secondary">Cancel</a>
            <button type="submit" class="btn btn-primary">{{ isEdit ? 'Update' : 'Save' }} Family Member</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`.form-card { max-width: 600px; } .form-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 8px; } .breadcrumb { color: var(--text-light); font-size: 13px; margin-top: 4px; }`]
})
export class FamilyFormComponent implements OnInit {
  form: FamilyMember = { fullName: '', relationship: '', dateOfBirth: '', careType: '' };
  isEdit = false;
  editId = 0;
  relationships = ['Child', 'Parent', 'Spouse', 'Sibling', 'Other'];

  constructor(private mock: MockDataService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.editId = +id;
      const existing = this.mock.getFamilyMember(this.editId);
      if (existing) { this.form = { ...existing }; }
    }
  }

  onSubmit() {
    if (!this.form.fullName || !this.form.relationship || !this.form.dateOfBirth || !this.form.careType) return;
    if (this.isEdit) { this.mock.updateFamilyMember(this.editId, this.form); }
    else { this.mock.addFamilyMember(this.form); }
    this.router.navigate(['/profile/family']);
  }
}
