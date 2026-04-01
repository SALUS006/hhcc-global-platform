import { Router, Request, Response } from 'express';

const router = Router();

// ═══════════════════════════════════════════════════════════════
// Family Members — In-memory stub (no backing microservice yet)
// TODO: Proxy to Profile microservice once family_member table and API exist
// ═══════════════════════════════════════════════════════════════

let familyMembers = [
  { id: 1, userId: 2, fullName: 'Sarah Doe', relationship: 'Daughter', dateOfBirth: '2018-03-15', careType: 'Child Care', specialNotes: 'Allergic to peanuts' },
  { id: 2, userId: 2, fullName: 'Tom Doe', relationship: 'Son', dateOfBirth: '2014-07-22', careType: 'Child Care', specialNotes: '' },
  { id: 3, userId: 2, fullName: 'Mary Doe', relationship: 'Mother', dateOfBirth: '1954-01-10', careType: 'Elderly Care', specialNotes: 'Requires wheelchair assistance' },
];
let familyNextId = 4;

// GET /family-members
// TODO: Proxy to Profile microservice once family_member table and API exist
router.get('/family-members', (_req: Request, res: Response) => {
  res.json(familyMembers);
});

// POST /family-members
// TODO: Proxy to Profile microservice once family_member table and API exist
router.post('/family-members', (req: Request, res: Response) => {
  const member = { id: familyNextId++, ...req.body };
  familyMembers.push(member);
  res.status(201).json(member);
});

// GET /family-members/:id
// TODO: Proxy to Profile microservice once family_member table and API exist
router.get('/family-members/:id', (req: Request, res: Response) => {
  const member = familyMembers.find(m => m.id === Number(req.params.id));
  if (!member) return res.status(404).json({ error: 'Family member not found' });
  res.json(member);
});

// PUT /family-members/:id
// TODO: Proxy to Profile microservice once family_member table and API exist
router.put('/family-members/:id', (req: Request, res: Response) => {
  const idx = familyMembers.findIndex(m => m.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Family member not found' });
  familyMembers[idx] = { ...familyMembers[idx], ...req.body, id: familyMembers[idx].id };
  res.json(familyMembers[idx]);
});

// DELETE /family-members/:id
// TODO: Proxy to Profile microservice once family_member table and API exist
router.delete('/family-members/:id', (req: Request, res: Response) => {
  const idx = familyMembers.findIndex(m => m.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Family member not found' });
  familyMembers.splice(idx, 1);
  res.status(204).send();
});

// ═══════════════════════════════════════════════════════════════
// Pets — In-memory stub (no backing microservice yet)
// TODO: Proxy to Profile microservice once pet_profile table and API exist
// ═══════════════════════════════════════════════════════════════

let pets = [
  { id: 1, userId: 2, petName: 'Buddy', petType: 'Dog', breed: 'Golden Retriever', age: 3, weight: 65, specialNotes: 'Friendly, loves fetch' },
  { id: 2, userId: 2, petName: 'Whiskers', petType: 'Cat', breed: 'Persian', age: 2, weight: 10, specialNotes: '' },
];
let petNextId = 3;

// GET /pets
// TODO: Proxy to Profile microservice once pet_profile table and API exist
router.get('/pets', (_req: Request, res: Response) => {
  res.json(pets);
});

// POST /pets
// TODO: Proxy to Profile microservice once pet_profile table and API exist
router.post('/pets', (req: Request, res: Response) => {
  const pet = { id: petNextId++, ...req.body };
  pets.push(pet);
  res.status(201).json(pet);
});

// GET /pets/:id
// TODO: Proxy to Profile microservice once pet_profile table and API exist
router.get('/pets/:id', (req: Request, res: Response) => {
  const pet = pets.find(p => p.id === Number(req.params.id));
  if (!pet) return res.status(404).json({ error: 'Pet not found' });
  res.json(pet);
});

// PUT /pets/:id
// TODO: Proxy to Profile microservice once pet_profile table and API exist
router.put('/pets/:id', (req: Request, res: Response) => {
  const idx = pets.findIndex(p => p.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Pet not found' });
  pets[idx] = { ...pets[idx], ...req.body, id: pets[idx].id };
  res.json(pets[idx]);
});

// DELETE /pets/:id
// TODO: Proxy to Profile microservice once pet_profile table and API exist
router.delete('/pets/:id', (req: Request, res: Response) => {
  const idx = pets.findIndex(p => p.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Pet not found' });
  pets.splice(idx, 1);
  res.status(204).send();
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
