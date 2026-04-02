import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../shared/api.service';
import { UserProfile } from '../../shared/models';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  form: UserProfile = { fullName: '', email: '', contactNumber: '', role: 'Customer' };
  password = '';
  confirmPassword = '';
  agreed = false;
  error = '';
  success = false;

  constructor(private api: ApiService) {}

  onSubmit() {
    this.error = '';
    if (!this.form.fullName || !this.form.email || !this.form.contactNumber) {
      this.error = 'Please fill in all required fields.'; return;
    }
    if (this.password.length < 6) { this.error = 'Password must be at least 6 characters.'; return; }
    if (this.password !== this.confirmPassword) { this.error = 'Passwords do not match.'; return; }
    if (!this.agreed) { this.error = 'You must agree to the Terms & Conditions.'; return; }
    this.api.createProfile(this.form).subscribe(() => {
      this.success = true;
    });
  }
}
