import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-3">
      <div class="page-header"><h1>Feedback &amp; Support</h1></div>

      <!-- Rating -->
      <div class="card mb-2">
        <h3>Rate Our Service</h3>
        <p class="text-light mt-1">How was your recent experience?</p>
        <div class="stars mt-1">
          <span *ngFor="let s of [1,2,3,4,5]" class="star" [class.active]="s <= rating" (click)="rating = s">⭐</span>
        </div>
        <div class="form-group mt-2">
          <label for="feedback">Tell us more (optional)</label>
          <textarea id="feedback" class="form-control" [(ngModel)]="feedback" placeholder="Share your experience..."></textarea>
        </div>
        <div *ngIf="submitted" class="alert-success" style="padding:12px;border-radius:8px;margin-bottom:12px;background:#e8f5e9;color:#388e3c;">
          Thank you for your feedback!
        </div>
        <button class="btn btn-primary" (click)="submitFeedback()" [disabled]="submitted">Submit Feedback</button>
      </div>

      <!-- Contact -->
      <div class="card mb-2">
        <h3>Contact Support</h3>
        <div class="grid grid-3 mt-2">
          <div class="contact-card">
            <div class="contact-icon">💬</div>
            <h4>Live Chat</h4>
            <p>Available 24/7</p>
            <button class="btn btn-sm btn-primary mt-1">Start Chat</button>
          </div>
          <div class="contact-card">
            <div class="contact-icon">📧</div>
            <h4>Email Support</h4>
            <p>Response within 24h</p>
            <button class="btn btn-sm btn-primary mt-1">Send Email</button>
          </div>
          <div class="contact-card">
            <div class="contact-icon">📞</div>
            <h4>Phone Support</h4>
            <p>Mon-Fri 9AM - 6PM</p>
            <button class="btn btn-sm btn-primary mt-1">Call Now</button>
          </div>
        </div>
      </div>

      <!-- FAQ -->
      <div class="card">
        <h3>Frequently Asked Questions</h3>
        <div class="faq-list mt-2">
          <div class="faq-item" *ngFor="let faq of faqs" (click)="faq.open = !faq.open">
            <div class="faq-q">{{ faq.open ? '▼' : '▶' }} {{ faq.q }}</div>
            <div class="faq-a" *ngIf="faq.open">{{ faq.a }}</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .text-light { color: var(--text-light); font-size: 14px; }
    .stars { font-size: 28px; cursor: pointer; }
    .star { opacity: 0.3; transition: opacity 0.2s; }
    .star.active { opacity: 1; }
    .contact-card { text-align: center; padding: 20px; border: 1px solid var(--border); border-radius: var(--radius); }
    .contact-icon { font-size: 36px; margin-bottom: 8px; }
    .contact-card h4 { font-size: 16px; margin-bottom: 4px; }
    .contact-card p { font-size: 13px; color: var(--text-light); }
    .faq-item { padding: 14px 0; border-bottom: 1px solid var(--border); cursor: pointer; }
    .faq-q { font-weight: 500; }
    .faq-a { margin-top: 8px; color: var(--text-light); font-size: 14px; padding-left: 20px; }
  `]
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
