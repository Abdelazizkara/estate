import type { Request, Response, NextFunction } from 'express';
import { getPrisma } from '../lib/prisma.js';

import { mapUser } from '../utils/mapProperty.js';
import { getTokenFromRequest } from '../lib/authCookie.js';
import { verifyAuthToken } from '../lib/verifyToken.js';
import type { AuthPayload } from '../types/auth.js';

declare global {
  namespace Express {
    interface Request {
      auth?: AuthPayload;
      user?: ReturnType<typeof mapUser>;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = getTokenFromRequest(req);
  if (!token) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  const payload = verifyAuthToken(token);
  if (!payload) {
    res.status(401).json({ error: 'Invalid or expired session' });
    return;
  }

  req.auth = payload;
  next();
}

export async function attachUser(req: Request, res: Response, next: NextFunction) {
  if (!req.auth) {
    next();
    return;
  }
  const prisma = getPrisma();
  if (!prisma) {
    res.status(500).json({ error: 'Database is not configured (DATABASE_URL invalid)' });
    return;
  }

  const user = await prisma.user.findUnique({ where: { id: req.auth.userId } });

  if (!user) {
    res.status(401).json({ error: 'User not found' });
    return;
  }
  req.user = mapUser(user);
  next();
}
