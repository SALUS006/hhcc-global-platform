import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../shared/api.service';
import { Pet } from '../../shared/models';

@Component({
  selector: 'app-pet-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './pet-form.component.html',
  styleUrls: ['./pet-form.component.css']
})
export class PetFormComponent implements OnInit {
  form: Pet = { petName: '', species: '', breed: '', ageYears: 0 };
  isEdit = false;
  editId = 0;
  petTypes = ['Dog', 'Cat', 'Bird', 'Fish', 'Other'];

  constructor(private api: ApiService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.editId = +id;
      this.api.getPet(this.editId).subscribe(existing => {
        if (existing) { this.form = { ...existing }; }
      });
    }
  }

  onSubmit() {
    if (!this.form.petName || !this.form.species) return;
    if (this.isEdit) {
      this.api.updatePet(this.editId, this.form).subscribe(() => {
        this.router.navigate(['/profile/pets']);
      });
    } else {
      this.api.createPet(this.form).subscribe(() => {
        this.router.navigate(['/profile/pets']);
      });
    }
  }
}
