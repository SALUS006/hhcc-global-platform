import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../shared/api.service';
import { PaymentInvoice } from '../../shared/models';

@Component({
  selector: 'app-payment-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './payment-dashboard.component.html',
  styleUrls: ['./payment-dashboard.component.css']
})
export class PaymentDashboardComponent {
  invoices: PaymentInvoice[] = [];
  totalDue = 0;
  totalPaid = 0;

  constructor(private api: ApiService) {
    this.api.getInvoices().subscribe(data => {
      this.invoices = data;
      this.totalDue = this.invoices.filter(i => i.status === 'Unpaid' || i.status === 'UNPAID').reduce((s, i) => s + i.amount, 0);
      this.totalPaid = this.invoices.filter(i => i.status === 'Paid' || i.status === 'PAID').reduce((s, i) => s + i.amount, 0);
    });
  }
}
