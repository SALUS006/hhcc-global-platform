import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../shared/api.service';
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
  constructor(private api: ApiService) { this.load(); }
  load() { this.api.getFamilyMembers().subscribe(data => this.members = data); }
  onDelete(id: number) {
    if (confirm('Are you sure you want to delete this family member?')) {
      this.api.deleteFamilyMember(id).subscribe(() => this.load());
    }
  }
}
