import { Router, Request, Response } from 'express';
import { proxyRequest } from '../utils/proxy';
import { SCHEDULING_SERVICE_URL, STUB_MODE } from '../utils/config';

const router = Router();

// ── Stub data (used when STUB_MODE=true) ──
const stubFacilities = [
  { id: 1, facilityName: 'Downtown Pet Care', locationAddress: '123 Main St', description: 'Full-service pet daycare', photoUrl: '', supportedCareTypes: 'PET', isActive: true },
  { id: 2, facilityName: 'Sunset Elderly Care', locationAddress: '456 Oak Ave', description: 'Premium elderly care facility', photoUrl: '', supportedCareTypes: 'ELDERLY', isActive: true },
];

const stubBookings = [
  { id: 1, userId: 2, facilityId: 1, careType: 'PET', dependentType: 'PET', dependentId: 1, pickupTime: '2026-04-05T08:00:00', dropoffTime: '2026-04-05T17:00:00', status: 'CONFIRMED', notes: 'Buddy needs his midday walk' },
  { id: 2, userId: 2, facilityId: 2, careType: 'ELDERLY', dependentType: 'FAMILY_MEMBER', dependentId: 3, pickupTime: '2026-04-06T09:00:00', dropoffTime: '2026-04-06T18:00:00', status: 'PENDING', notes: 'Requires wheelchair assistance' },
];

// ── Facilities ──

// GET /facilities
router.get('/facilities', async (req: Request, res: Response) => {
  if (STUB_MODE) {
    return res.json(stubFacilities);
  }
  await proxyRequest('GET', `${SCHEDULING_SERVICE_URL}/scheduling/facilities`, req, res);
});

// GET /facilities/:id
router.get('/facilities/:id', async (req: Request, res: Response) => {
  if (STUB_MODE) {
    const facility = stubFacilities.find(f => f.id === Number(req.params.id));
    return facility ? res.json(facility) : res.status(404).json({ error: 'Not Found' });
  }
  await proxyRequest('GET', `${SCHEDULING_SERVICE_URL}/scheduling/facilities/${req.params.id}`, req, res);
});

// ── Bookings ──

// GET /bookings — list all bookings for the current user
router.get('/bookings', async (req: Request, res: Response) => {
  if (STUB_MODE) {
    return res.json(stubBookings);
  }
  const userId = (req.headers['x-mock-user-id'] as string) || '1';
  await proxyRequest('GET', `${SCHEDULING_SERVICE_URL}/scheduling/bookings/${userId}`, req, res);
});

// POST /bookings
router.post('/bookings', async (req: Request, res: Response) => {
  if (STUB_MODE) {
    return res.status(201).json({ id: Date.now(), ...req.body, status: 'PENDING' });
  }
  await proxyRequest('POST', `${SCHEDULING_SERVICE_URL}/scheduling/bookings`, req, res);
});

// GET /bookings/:id — get single booking by id (scoped to user)
router.get('/bookings/:id', async (req: Request, res: Response) => {
  if (STUB_MODE) {
    const booking = stubBookings.find(b => b.id === Number(req.params.id));
    return booking ? res.json(booking) : res.status(404).json({ error: 'Not Found' });
  }
  const userId = (req.headers['x-mock-user-id'] as string) || '1';
  await proxyRequest('GET', `${SCHEDULING_SERVICE_URL}/scheduling/bookings/${userId}/${req.params.id}`, req, res);
});

// PUT /bookings/:id
router.put('/bookings/:id', async (req: Request, res: Response) => {
  if (STUB_MODE) {
    return res.json({ id: Number(req.params.id), ...req.body });
  }
  await proxyRequest('PUT', `${SCHEDULING_SERVICE_URL}/scheduling/bookings/${req.params.id}`, req, res);
});

// DELETE /bookings/:id — cancel booking (scoped to user)
router.delete('/bookings/:id', async (req: Request, res: Response) => {
  if (STUB_MODE) {
    return res.status(204).send();
  }
  const userId = (req.headers['x-mock-user-id'] as string) || '1';
  await proxyRequest('DELETE', `${SCHEDULING_SERVICE_URL}/scheduling/bookings/${userId}/${req.params.id}`, req, res);
});

// GET /scheduling/health
router.get('/scheduling/health', async (req: Request, res: Response) => {
  if (STUB_MODE) {
    return res.json({ service: 'UP', database: 'STUB' });
  }
  await proxyRequest('GET', `${SCHEDULING_SERVICE_URL}/scheduling/health`, req, res);
});

export default router;
