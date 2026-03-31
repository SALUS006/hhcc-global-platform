import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MockDataService } from '../../shared/mock-data.service';
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
  constructor(private mock: MockDataService) { this.load(); }
  load() { this.pets = this.mock.getPets(); }
  onDelete(id: number) {
    if (confirm('Are you sure you want to delete this pet?')) {
      this.mock.deletePet(id);
      this.load();
    }
  }
}
