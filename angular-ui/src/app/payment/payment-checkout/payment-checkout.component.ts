import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../shared/api.service';
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

  constructor(private api: ApiService, private route: ActivatedRoute) {}

  ngOnInit() {
    const id = +(this.route.snapshot.paramMap.get('invoiceId') || '0');
    this.api.getInvoice(id).subscribe(invoice => {
      this.invoice = invoice;
      if (this.invoice) {
        this.tax = this.invoice.amount * 0.08;
        this.total = this.invoice.amount + this.tax;
      }
    });
  }

  onPay() {
    if (!this.cardNumber || !this.expiry || !this.cvv || !this.holderName) return;
    if (this.invoice) {
      // Format expiry to MM/YYYY if needed
      let formattedExpiry = this.expiry.trim();
      if (/^\d{2}\s*\/\s*\d{2}$/.test(formattedExpiry)) {
        // Convert MM/YY to MM/YYYY
        const [mm, yy] = formattedExpiry.split('/').map(s => s.trim());
        formattedExpiry = `${mm}/${+yy < 100 ? '20' + yy : yy}`;
      }
      const payload = {
        paymentMethod: 'CREDIT_CARD',
        cardNumber: this.cardNumber,
        cardExpiry: formattedExpiry,
        cardCvv: this.cvv,
        cardholderName: this.holderName
      };
      this.api.payInvoice(this.invoice.id!, payload).subscribe(() => {
        this.paid = true;
      });
    }
  }
}
