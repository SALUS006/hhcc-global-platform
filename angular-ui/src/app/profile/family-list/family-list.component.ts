import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MockDataService } from '../../shared/mock-data.service';
import { FamilyMember } from '../../shared/models';

@Component({
  selector: 'app-family-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './family-list.component.html',
  styleUrls: ['./family-list.component.css']
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
