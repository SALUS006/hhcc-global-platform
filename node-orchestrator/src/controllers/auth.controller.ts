import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'hhcc-super-secret-key-2026';

// Mock profiles for auth
const authProfiles = [
  { id: 1, email: 'admin@hhcc.com', role: 'ADMIN' },
  { id: 2, email: 'john.doe@email.com', role: 'CUSTOMER' },
  { id: 3, email: 'jane.smith@email.com', role: 'CUSTOMER' },
];

router.post('/login', (req: Request, res: Response) => {
  const { email } = req.body;
  const user = authProfiles.find(p => p.email === email);

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '1d' }
  );

  res.json({
    token,
    user: {
      userId: user.id,
      email: user.email,
      role: user.role
    }
  });
});

export default router;
