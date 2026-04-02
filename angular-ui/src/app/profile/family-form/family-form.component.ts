import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../shared/api.service';
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

  constructor(private api: ApiService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.editId = +id;
      this.api.getFamilyMember(this.editId).subscribe(existing => {
        if (existing) { this.form = { ...existing }; }
      });
    }
  }

  onSubmit() {
    if (!this.form.fullName || !this.form.relationship || !this.form.dateOfBirth || !this.form.careType) return;
    if (this.isEdit) {
      this.api.updateFamilyMember(this.editId, this.form).subscribe(() => {
        this.router.navigate(['/profile/family']);
      });
    } else {
      this.api.createFamilyMember(this.form).subscribe(() => {
        this.router.navigate(['/profile/family']);
      });
    }
  }
}
