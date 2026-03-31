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
  templateUrl: './family-form.component.html',
  styleUrls: ['./family-form.component.css']
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
