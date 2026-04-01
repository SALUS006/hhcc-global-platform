import { Router, Request, Response } from 'express';
import { proxyRequest } from '../utils/proxy';
import { PROFILE_SERVICE_URL, STUB_MODE } from '../utils/config';

const router = Router();

// ── Stub data (used when STUB_MODE=true) ──
const stubProfiles = [
  { id: 1, fullName: 'Admin User', email: 'admin@hhcc.com', role: 'ADMIN', contactNumber: '555-0100' },
  { id: 2, fullName: 'John Doe', email: 'john.doe@email.com', role: 'CUSTOMER', contactNumber: '555-0101' },
  { id: 3, fullName: 'Jane Smith', email: 'jane.smith@email.com', role: 'CUSTOMER', contactNumber: '555-0102' },
];

// GET /profiles
router.get('/profiles', async (req: Request, res: Response) => {
  if (STUB_MODE) {
    return res.json(stubProfiles);
  }
  await proxyRequest('GET', `${PROFILE_SERVICE_URL}/profiles`, req, res);
});

// POST /profiles
router.post('/profiles', async (req: Request, res: Response) => {
  if (STUB_MODE) {
    return res.status(201).json({ id: Date.now(), ...req.body });
  }
  await proxyRequest('POST', `${PROFILE_SERVICE_URL}/profiles`, req, res);
});

// GET /profiles/:id
router.get('/profiles/:id', async (req: Request, res: Response) => {
  if (STUB_MODE) {
    const profile = stubProfiles.find(p => p.id === Number(req.params.id));
    return profile ? res.json(profile) : res.status(404).json({ error: 'Not Found' });
  }
  await proxyRequest('GET', `${PROFILE_SERVICE_URL}/profiles/${req.params.id}`, req, res);
});

// PUT /profiles/:id
router.put('/profiles/:id', async (req: Request, res: Response) => {
  if (STUB_MODE) {
    return res.json({ id: Number(req.params.id), ...req.body });
  }
  await proxyRequest('PUT', `${PROFILE_SERVICE_URL}/profiles/${req.params.id}`, req, res);
});

// DELETE /profiles/:id
router.delete('/profiles/:id', async (req: Request, res: Response) => {
  if (STUB_MODE) {
    return res.status(204).send();
  }
  await proxyRequest('DELETE', `${PROFILE_SERVICE_URL}/profiles/${req.params.id}`, req, res);
});

// GET /profiles/health
router.get('/profiles/health', async (req: Request, res: Response) => {
  if (STUB_MODE) {
    return res.json({ service: 'UP', database: 'STUB' });
  }
  await proxyRequest('GET', `${PROFILE_SERVICE_URL}/profiles/health`, req, res);
});

export default router;
