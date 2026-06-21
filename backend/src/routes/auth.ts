import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getPrisma } from '../lib/prisma.js';


import { mapUser } from '../utils/mapProperty.js';

import { setAuthCookie, clearAuthCookie, getTokenFromRequest } from '../lib/authCookie.js';
import { verifyAuthToken } from '../lib/verifyToken.js';
import type { UserRole } from '@prisma/client';

const router = Router();

function signToken(userId: string, email: string, role: string) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET not set');
  return jwt.sign({ userId, email, role }, secret, { expiresIn: '7d' });
}

router.post('/register', async (req, res) => {
  try {
    const { email, password, name, role = 'buyer', phone, agency } = req.body as {
      email?: string;
      password?: string;
      name?: string;
      role?: UserRole;
      phone?: string;
      agency?: string;
    };

    if (!email || !password || !name) {
      res.status(400).json({ error: 'Email, password, and name are required' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters' });
      return;
    }

const db = getPrisma();
    if (!db) {
      res.status(500).json({ error: 'Database is not configured (DATABASE_URL invalid)' });
      return;
    }

    const existing = await db.user.findUnique({ where: { email } });



    if (existing) {

      res.status(409).json({ error: 'Email already registered' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await db!.user.create({


      data: {
        email,
        passwordHash,
        name,
        role: role as UserRole,
        phone: phone ?? null,
        agency: agency ?? null,
      },
    });

    const token = signToken(user.id, user.email, user.role);
    setAuthCookie(res, token);
    res.status(201).json({ user: mapUser(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body as { email?: string; password?: string };

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const db = getPrisma();
    if (!db) {
      res.status(500).json({ error: 'Database is not configured (DATABASE_URL invalid)' });
      return;
    }

    const user = await db.user.findUnique({ where: { email } });

    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const token = signToken(user.id, user.email, user.role);
    setAuthCookie(res, token);
    res.json({ user: mapUser(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/logout', (_req, res) => {
  clearAuthCookie(res);
  res.json({ ok: true });
});

router.get('/me', async (req, res) => {
  const token = getTokenFromRequest(req);
  if (!token) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  const payload = verifyAuthToken(token);
  if (!payload) {
    clearAuthCookie(res);
    res.status(401).json({ error: 'Invalid or expired session' });
    return;
  }

  const db = getPrisma();
  if (!db) {
    res.status(500).json({ error: 'Database is not configured (DATABASE_URL invalid)' });
    return;
  }

  const user = await db.user.findUnique({ where: { id: payload.userId } });

  if (!user) {
    clearAuthCookie(res);
    res.status(401).json({ error: 'User not found' });
    return;
  }

  res.json({ user: mapUser(user) });
});

export default router;
