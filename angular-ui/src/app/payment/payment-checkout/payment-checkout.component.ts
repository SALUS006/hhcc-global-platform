import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MockDataService } from '../../shared/mock-data.service';
import { PaymentInvoice } from '../../shared/models';

@Component({
  selector: 'app-payment-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container mt-3">
      <div class="page-header"><h1>Payment Checkout</h1></div>

      <!-- Success State -->
      <div *ngIf="paid" class="card text-center" style="max-width:500px;margin:0 auto;padding:48px;">
        <div style="font-size:64px;margin-bottom:16px;">✅</div>
        <h2>Payment Successful</h2>
        <p class="mt-1">Invoice: INV-{{ invoice?.id?.toString()?.padStart(3, '0') }}</p>
        <p>Amount: \${{ total.toFixed(2) }}</p>
        <p class="text-light mt-1">A confirmation email has been sent.</p>
        <div class="mt-2 flex gap-2" style="justify-content:center;">
          <a routerLink="/payment" class="btn btn-secondary">View Receipt</a>
          <a routerLink="/" class="btn btn-primary">Back to Home</a>
        </div>
      </div>

      <!-- Checkout Form -->
      <div *ngIf="!paid && invoice" style="max-width:600px;">
        <!-- Order Summary -->
        <div class="card mb-2">
          <h3>Order Summary</h3>
          <p class="mt-1">{{ invoice.bookingDescription }}</p>
          <hr style="margin:12px 0;border:none;border-top:1px solid var(--border);">
          <div class="flex-between"><span>Subtotal:</span><span>\${{ invoice.amount.toFixed(2) }}</span></div>
          <div class="flex-between"><span>Tax:</span><span>\${{ tax.toFixed(2) }}</span></div>
          <hr style="margin:12px 0;border:none;border-top:1px solid var(--border);">
          <div class="flex-between"><strong>Total:</strong><strong>\${{ total.toFixed(2) }}</strong></div>
        </div>

        <!-- Payment Method -->
        <div class="card">
          <h3>Payment Method</h3>
          <div class="form-group mt-2">
            <label><input type="radio" name="method" value="card" [(ngModel)]="method" checked> Credit / Debit Card</label>
            <label style="margin-left:16px"><input type="radio" name="method" value="paypal" [(ngModel)]="method"> PayPal</label>
          </div>
          <div class="form-group">
            <label for="cardNumber">Card Number *</label>
            <input id="cardNumber" class="form-control" [(ngModel)]="cardNumber" name="cardNumber" placeholder="XXXX XXXX XXXX XXXX" maxlength="19">
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="expiry">Expiry *</label>
              <input id="expiry" class="form-control" [(ngModel)]="expiry" name="expiry" placeholder="MM / YY">
            </div>
            <div class="form-group">
              <label for="cvv">CVV *</label>
              <input id="cvv" type="password" class="form-control" [(ngModel)]="cvv" name="cvv" placeholder="•••" maxlength="4">
            </div>
          </div>
          <div class="form-group">
            <label for="holder">Cardholder Name *</label>
            <input id="holder" class="form-control" [(ngModel)]="holderName" name="holderName">
          </div>
          <p style="font-size:12px;color:var(--text-light);">🔒 Your payment is secured with 256-bit SSL encryption</p>
          <div class="form-actions mt-2">
            <a routerLink="/payment" class="btn btn-secondary">Cancel</a>
            <button class="btn btn-primary" (click)="onPay()">Pay \${{ total.toFixed(2) }}</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .form-actions { display: flex; gap: 12px; justify-content: flex-end; }
    .text-light { color: var(--text-light); }
  `]
})
export class PaymentCheckoutComponent implements OnInit {
  invoice: PaymentInvoice | undefined;
  tax = 0;
  total = 0;
  paid = false;
  method = 'card';
  cardNumber = '';
  expiry = '';
  cvv = '';
  holderName = '';

  constructor(private mock: MockDataService, private route: ActivatedRoute) {}

  ngOnInit() {
    const id = +(this.route.snapshot.paramMap.get('invoiceId') || '0');
    this.invoice = this.mock.getInvoice(id);
    if (this.invoice) {
      this.tax = this.invoice.amount * 0.08;
      this.total = this.invoice.amount + this.tax;
    }
  }

  onPay() {
    if (!this.cardNumber || !this.expiry || !this.cvv || !this.holderName) return;
    if (this.invoice) {
      this.mock.payInvoice(this.invoice.id!);
      this.paid = true;
    }
  }
}
