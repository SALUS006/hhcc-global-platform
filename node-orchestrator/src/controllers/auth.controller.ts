import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { PROFILE_SERVICE_URL, STUB_MODE } from '../utils/config';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'hhcc-super-secret-key-2026';

// Mock fallback profiles just in case
const authProfiles = [
  { id: 1, email: 'admin@hhcc.com', role: 'ADMIN' },
  { id: 2, email: 'john.doe@email.com', role: 'CUSTOMER' },
  { id: 3, email: 'jane.smith@email.com', role: 'CUSTOMER' },
];

router.post('/login', async (req: Request, res: Response) => {
  const { email } = req.body;
  let user: any = null;

  try {
    if (STUB_MODE) {
      user = authProfiles.find(p => p.email === email);
    } else {
      // Query the Java Profile Service for registered users
      const response = await axios.get(`${PROFILE_SERVICE_URL}/profiles`);
      const profiles = response.data;
      user = profiles.find((p: any) => p.email === email);
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Role safety catch
    const role = user.role?.toUpperCase() || 'CUSTOMER';

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        userId: user.id,
        email: user.email,
        role: role
      }
    });

  } catch (err) {
    console.error('Login error querying profile service:', err);
    res.status(500).json({ error: 'Internal server error while logging in' });
  }
});

export default router;
