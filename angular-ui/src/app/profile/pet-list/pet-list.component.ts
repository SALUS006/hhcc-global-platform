import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../shared/api.service';
import { Pet } from '../../shared/models';

@Component({
  selector: 'app-pet-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './pet-list.component.html',
  styleUrls: ['./pet-list.component.css']
})
export class PetListComponent {
  pets: Pet[] = [];
  constructor(private api: ApiService) { this.load(); }
  load() { this.api.getPets().subscribe(data => this.pets = data); }
  onDelete(id: number) {
    if (confirm('Are you sure you want to delete this pet?')) {
      this.api.deletePet(id).subscribe(() => this.load());
    }
  }
}
