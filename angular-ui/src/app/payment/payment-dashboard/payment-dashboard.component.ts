import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MockDataService } from '../../shared/mock-data.service';
import { PaymentInvoice } from '../../shared/models';

@Component({
  selector: 'app-payment-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mt-3">
      <div class="page-header">
        <h1>Payments</h1>
      </div>

      <!-- Summary -->
      <div class="grid grid-3 mb-3">
        <div class="card summary-card">
          <div class="summary-label">Total Due</div>
          <div class="summary-value danger">\${{ totalDue.toFixed(2) }}</div>
        </div>
        <div class="card summary-card">
          <div class="summary-label">Total Paid</div>
          <div class="summary-value success">\${{ totalPaid.toFixed(2) }}</div>
        </div>
        <div class="card summary-card">
          <div class="summary-label">Invoices</div>
          <div class="summary-value">{{ invoices.length }}</div>
        </div>
      </div>

      <!-- Invoice Table -->
      <div class="card">
        <h3 style="margin-bottom:16px">Invoice History</h3>
        <table class="table">
          <thead>
            <tr><th>Invoice</th><th>Booking</th><th>Amount</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let inv of invoices">
              <td>INV-{{ inv.id?.toString()?.padStart(3, '0') }}</td>
              <td>{{ inv.bookingDescription }}</td>
              <td>\${{ inv.amount.toFixed(2) }}</td>
              <td>
                <span class="badge" [class.badge-success]="inv.status==='Paid'" [class.badge-warning]="inv.status==='Unpaid'" [class.badge-danger]="inv.status==='Refunded'">
                  {{ inv.status === 'Paid' ? '✅' : '⚠️' }} {{ inv.status }}
                </span>
              </td>
              <td>
                <a *ngIf="inv.status==='Unpaid'" [routerLink]="['/payment/checkout', inv.id]" class="btn btn-sm btn-primary">Pay Now</a>
                <span *ngIf="inv.status==='Paid'" class="text-light">View</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .summary-card { text-align: center; }
    .summary-label { font-size: 13px; color: var(--text-light); text-transform: uppercase; font-weight: 600; }
    .summary-value { font-size: 28px; font-weight: 700; margin-top: 4px; }
    .summary-value.danger { color: var(--danger); }
    .summary-value.success { color: var(--success); }
    .text-light { color: var(--text-light); font-size: 13px; }
  `]
})
export class PaymentDashboardComponent {
  invoices: PaymentInvoice[] = [];
  totalDue = 0;
  totalPaid = 0;

  constructor(private mock: MockDataService) {
    this.invoices = this.mock.getInvoices();
    this.totalDue = this.invoices.filter(i => i.status === 'Unpaid').reduce((s, i) => s + i.amount, 0);
    this.totalPaid = this.invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.amount, 0);
  }
}
