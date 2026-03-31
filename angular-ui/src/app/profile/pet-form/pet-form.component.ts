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
  templateUrl: './pet-form.component.html',
  styleUrls: ['./pet-form.component.css']
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
