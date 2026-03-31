import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.css']
})
export class SupportComponent {
  rating = 0;
  feedback = '';
  submitted = false;

  faqs: { q: string; a: string; open: boolean }[] = [
    { q: 'How do I schedule a pick-up?', a: 'Navigate to the Scheduling page and click "New Booking". Select your family member or pet, choose a facility, and set the pick-up and drop-off times.', open: false },
    { q: 'What payment methods are accepted?', a: 'We accept all major credit/debit cards, PayPal, and bank transfers.', open: false },
    { q: 'How do I add a family member?', a: 'Go to Profile > Family Members and click "Add Family Member". Fill in the required details and save.', open: false },
    { q: 'What is your cancellation policy?', a: 'Bookings can be cancelled up to 24 hours before the scheduled pick-up time for a full refund.', open: false },
    { q: 'How do I update my pet\'s information?', a: 'Go to Profile > My Pets, find your pet card, and click "Edit" to update their information.', open: false }
  ];

  submitFeedback() {
    if (this.rating > 0) { this.submitted = true; }
  }
}
