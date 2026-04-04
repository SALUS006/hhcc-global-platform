import { Router, Request, Response } from 'express';
import { proxyRequest } from '../utils/proxy';
import { PAYMENT_SERVICE_URL, STUB_MODE } from '../utils/config';

const router = Router();

// ── Stub data (used when STUB_MODE=true) ──
const stubPayments = [
  { id: 1, bookingId: 1, amount: 150.00, currency: 'USD', paymentMethod: 'MOCK', status: 'PAID', paymentDate: '2026-04-05T10:00:00' },
  { id: 2, bookingId: 2, amount: 500.00, currency: 'USD', paymentMethod: 'MOCK', status: 'UNPAID', paymentDate: null },
];

// GET /payments — list all invoices
router.get('/payments', async (req: Request, res: Response) => {
  if (STUB_MODE) {
    return res.json(stubPayments);
  }
  await proxyRequest('GET', `${PAYMENT_SERVICE_URL}/payment/invoices`, req, res);
});

// POST /payments — create invoice
router.post('/payments', async (req: Request, res: Response) => {
  if (STUB_MODE) {
    return res.status(201).json({ id: Date.now(), ...req.body, status: 'UNPAID' });
  }
  await proxyRequest('POST', `${PAYMENT_SERVICE_URL}/payment/invoices`, req, res);
});

// IMPORTANT: Place /payments/booking/:bookingId BEFORE /payments/:id
// to avoid Express matching "booking" as an :id parameter.

// GET /payments/booking/:bookingId — get invoice by booking ID
router.get('/payments/booking/:bookingId', async (req: Request, res: Response) => {
  if (STUB_MODE) {
    const payment = stubPayments.find(p => p.bookingId === Number(req.params.bookingId));
    return payment ? res.json(payment) : res.status(404).json({ error: 'Not Found' });
  }
  await proxyRequest('GET', `${PAYMENT_SERVICE_URL}/payment/invoices/${req.params.bookingId}`, req, res);
});

// GET /payments/:id — get invoice by ID
router.get('/payments/:id', async (req: Request, res: Response) => {
  if (STUB_MODE) {
    const payment = stubPayments.find(p => p.id === Number(req.params.id));
    return payment ? res.json(payment) : res.status(404).json({ error: 'Not Found' });
  }
  await proxyRequest('GET', `${PAYMENT_SERVICE_URL}/payment/invoices/${req.params.id}`, req, res);
});

// PUT /payments/:id/pay — mark invoice as paid
router.put('/payments/:id/pay', async (req: Request, res: Response) => {
  if (STUB_MODE) {
    const payment = stubPayments.find(p => p.id === Number(req.params.id));
    if (!payment) return res.status(404).json({ error: 'Not Found' });
    payment.status = 'PAID';
    payment.paymentDate = new Date().toISOString();
    return res.json(payment);
  }
  await proxyRequest('PUT', `${PAYMENT_SERVICE_URL}/payment/invoices/${req.params.id}/pay`, req, res);
});

// POST /payments/:id/refund — refund invoice
router.post('/payments/:id/refund', async (req: Request, res: Response) => {
  if (STUB_MODE) {
    const payment = stubPayments.find(p => p.id === Number(req.params.id));
    if (!payment) return res.status(404).json({ error: 'Not Found' });
    payment.status = 'REFUNDED';
    return res.json(payment);
  }
  await proxyRequest('POST', `${PAYMENT_SERVICE_URL}/payment/invoices/${req.params.id}/refund`, req, res);
});

// GET /payment/health
router.get('/payment/health', async (req: Request, res: Response) => {
  if (STUB_MODE) {
    return res.json({ service: 'UP', database: 'STUB' });
  }
  await proxyRequest('GET', `${PAYMENT_SERVICE_URL}/payment/health`, req, res);
});

export default router;
