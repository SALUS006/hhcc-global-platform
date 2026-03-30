import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MockDataService } from '../../shared/mock-data.service';
import { FamilyMember } from '../../shared/models';

@Component({
  selector: 'app-family-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mt-3">
      <div class="page-header">
        <div>
          <h1>Family Members</h1>
          <p class="breadcrumb">Profile &gt; Family Members</p>
        </div>
        <a routerLink="/profile/family/add" class="btn btn-primary">+ Add Family Member</a>
      </div>

      <div *ngIf="members.length === 0" class="card empty-state">
        <div class="icon">📭</div>
        <p>You haven't added any family members yet.</p>
        <a routerLink="/profile/family/add" class="btn btn-primary mt-2">+ Add Family Member</a>
      </div>

      <div *ngIf="members.length > 0" class="card">
        <table class="table">
          <thead>
            <tr><th>Name</th><th>Relationship</th><th>Care Type</th><th>DOB</th><th>Actions</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let m of members">
              <td><strong>👤 {{ m.fullName }}</strong></td>
              <td>{{ m.relationship }}</td>
              <td><span class="badge" [class.badge-info]="m.careType==='Child Care'" [class.badge-warning]="m.careType==='Elderly Care'">{{ m.careType }}</span></td>
              <td>{{ m.dateOfBirth }}</td>
              <td>
                <a [routerLink]="['/profile/family/edit', m.id]" class="btn btn-sm btn-secondary">Edit</a>
                <button class="btn btn-sm btn-danger" (click)="onDelete(m.id!)">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
        <p class="mt-2 text-light" style="font-size:13px">Showing {{ members.length }} family members</p>
      </div>

      <div class="mt-2">
        <a routerLink="/profile/pets" class="btn btn-secondary">View My Pets →</a>
      </div>
    </div>
  `,
  styles: [`.breadcrumb { color: var(--text-light); font-size: 13px; margin-top: 4px; } .text-light { color: var(--text-light); }`]
})
export class FamilyListComponent {
  members: FamilyMember[] = [];
  constructor(private mock: MockDataService) { this.load(); }
  load() { this.members = this.mock.getFamilyMembers(); }
  onDelete(id: number) {
    if (confirm('Are you sure you want to delete this family member?')) {
      this.mock.deleteFamilyMember(id);
      this.load();
    }
  }
}
