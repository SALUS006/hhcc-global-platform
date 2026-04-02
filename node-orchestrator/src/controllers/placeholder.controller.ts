import { Router, Request, Response } from 'express';
import { proxyRequest } from '../utils/proxy';
import { PROFILE_SERVICE_URL, STUB_MODE } from '../utils/config';

const router = Router();

// ═══════════════════════════════════════════════════════════════
// Family Members — Proxied to Profile microservice
// ═══════════════════════════════════════════════════════════════

let familyMembers = [
  { id: 1, userId: 2, fullName: 'Sarah Doe', relationship: 'Daughter', dateOfBirth: '2018-03-15', careType: 'Child Care', specialNotes: 'Allergic to peanuts' },
  { id: 2, userId: 2, fullName: 'Tom Doe', relationship: 'Son', dateOfBirth: '2014-07-22', careType: 'Child Care', specialNotes: '' },
  { id: 3, userId: 2, fullName: 'Mary Doe', relationship: 'Mother', dateOfBirth: '1954-01-10', careType: 'Elderly Care', specialNotes: 'Requires wheelchair assistance' },
];
let familyNextId = 4;

// GET /family-members
// Proxied to Profile microservice
router.get('/family-members', async (req: Request, res: Response) => {
  if (STUB_MODE) {
    return res.json(familyMembers);
  }
  const userId = (req.headers['x-mock-user-id'] as string) || '1';
  await proxyRequest('GET', `${PROFILE_SERVICE_URL}/profiles/${userId}/family-members`, req, res);
});

// POST /family-members
// Proxied to Profile microservice
router.post('/family-members', async (req: Request, res: Response) => {
  if (STUB_MODE) {
    const member = { id: familyNextId++, ...req.body };
    familyMembers.push(member);
    return res.status(201).json(member);
  }
  const userId = (req.headers['x-mock-user-id'] as string) || '1';
  await proxyRequest('POST', `${PROFILE_SERVICE_URL}/profiles/${userId}/family-members`, req, res);
});

// GET /family-members/:id
// Proxied to Profile microservice
router.get('/family-members/:id', async (req: Request, res: Response) => {
  if (STUB_MODE) {
    const member = familyMembers.find(m => m.id === Number(req.params.id));
    if (!member) return res.status(404).json({ error: 'Family member not found' });
    return res.json(member);
  }
  const userId = (req.headers['x-mock-user-id'] as string) || '1';
  await proxyRequest('GET', `${PROFILE_SERVICE_URL}/profiles/${userId}/family-members/${req.params.id}`, req, res);
});

// PUT /family-members/:id
// Proxied to Profile microservice
router.put('/family-members/:id', async (req: Request, res: Response) => {
  if (STUB_MODE) {
    const idx = familyMembers.findIndex(m => m.id === Number(req.params.id));
    if (idx === -1) return res.status(404).json({ error: 'Family member not found' });
    familyMembers[idx] = { ...familyMembers[idx], ...req.body, id: familyMembers[idx].id };
    return res.json(familyMembers[idx]);
  }
  const userId = (req.headers['x-mock-user-id'] as string) || '1';
  await proxyRequest('PUT', `${PROFILE_SERVICE_URL}/profiles/${userId}/family-members/${req.params.id}`, req, res);
});

// DELETE /family-members/:id
// Proxied to Profile microservice
router.delete('/family-members/:id', async (req: Request, res: Response) => {
  if (STUB_MODE) {
    const idx = familyMembers.findIndex(m => m.id === Number(req.params.id));
    if (idx === -1) return res.status(404).json({ error: 'Family member not found' });
    familyMembers.splice(idx, 1);
    return res.status(204).send();
  }
  const userId = (req.headers['x-mock-user-id'] as string) || '1';
  await proxyRequest('DELETE', `${PROFILE_SERVICE_URL}/profiles/${userId}/family-members/${req.params.id}`, req, res);
});

// ═══════════════════════════════════════════════════════════════
// Pets — Proxied to Profile microservice
// ═══════════════════════════════════════════════════════════════

let pets = [
  { id: 1, userId: 2, petName: 'Buddy', petType: 'Dog', breed: 'Golden Retriever', age: 3, weight: 65, specialNotes: 'Friendly, loves fetch' },
  { id: 2, userId: 2, petName: 'Whiskers', petType: 'Cat', breed: 'Persian', age: 2, weight: 10, specialNotes: '' },
];
let petNextId = 3;

// GET /pets
// Proxied to Profile microservice
router.get('/pets', async (req: Request, res: Response) => {
  if (STUB_MODE) {
    return res.json(pets);
  }
  const userId = (req.headers['x-mock-user-id'] as string) || '1';
  await proxyRequest('GET', `${PROFILE_SERVICE_URL}/profiles/${userId}/pets`, req, res);
});

// POST /pets
// Proxied to Profile microservice
router.post('/pets', async (req: Request, res: Response) => {
  if (STUB_MODE) {
    const pet = { id: petNextId++, ...req.body };
    pets.push(pet);
    return res.status(201).json(pet);
  }
  const userId = (req.headers['x-mock-user-id'] as string) || '1';
  await proxyRequest('POST', `${PROFILE_SERVICE_URL}/profiles/${userId}/pets`, req, res);
});

// GET /pets/:id
// Proxied to Profile microservice
router.get('/pets/:id', async (req: Request, res: Response) => {
  if (STUB_MODE) {
    const pet = pets.find(p => p.id === Number(req.params.id));
    if (!pet) return res.status(404).json({ error: 'Pet not found' });
    return res.json(pet);
  }
  const userId = (req.headers['x-mock-user-id'] as string) || '1';
  await proxyRequest('GET', `${PROFILE_SERVICE_URL}/profiles/${userId}/pets/${req.params.id}`, req, res);
});

// PUT /pets/:id
// Proxied to Profile microservice
router.put('/pets/:id', async (req: Request, res: Response) => {
  if (STUB_MODE) {
    const idx = pets.findIndex(p => p.id === Number(req.params.id));
    if (idx === -1) return res.status(404).json({ error: 'Pet not found' });
    pets[idx] = { ...pets[idx], ...req.body, id: pets[idx].id };
    return res.json(pets[idx]);
  }
  const userId = (req.headers['x-mock-user-id'] as string) || '1';
  await proxyRequest('PUT', `${PROFILE_SERVICE_URL}/profiles/${userId}/pets/${req.params.id}`, req, res);
});

// DELETE /pets/:id
// Proxied to Profile microservice
router.delete('/pets/:id', async (req: Request, res: Response) => {
  if (STUB_MODE) {
    const idx = pets.findIndex(p => p.id === Number(req.params.id));
    if (idx === -1) return res.status(404).json({ error: 'Pet not found' });
    pets.splice(idx, 1);
    return res.status(204).send();
  }
  const userId = (req.headers['x-mock-user-id'] as string) || '1';
  await proxyRequest('DELETE', `${PROFILE_SERVICE_URL}/profiles/${userId}/pets/${req.params.id}`, req, res);
});

// ═══════════════════════════════════════════════════════════════
// Feedback — In-memory stub (no backing microservice yet)
// TODO: Proxy to a Feedback microservice once feedback table and API exist
// ═══════════════════════════════════════════════════════════════

interface FeedbackEntry {
  id: number;
  userId: number;
  rating: number;
  comment: string;
  createdAt: string;
}

const feedbackStore: FeedbackEntry[] = [];
let feedbackNextId = 1;

// POST /feedback
// TODO: Proxy to a Feedback microservice once feedback table and API exist
router.post('/feedback', (req: Request, res: Response) => {
  const entry: FeedbackEntry = {
    id: feedbackNextId++,
    ...req.body,
    createdAt: new Date().toISOString(),
  };
  feedbackStore.push(entry);
  res.status(201).json(entry);
});

// GET /feedback
// TODO: Proxy to a Feedback microservice once feedback table and API exist
router.get('/feedback', (_req: Request, res: Response) => {
  res.json(feedbackStore);
});

export default router;
