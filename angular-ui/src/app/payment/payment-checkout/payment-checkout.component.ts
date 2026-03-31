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
  templateUrl: './payment-checkout.component.html',
  styleUrls: ['./payment-checkout.component.css']
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
