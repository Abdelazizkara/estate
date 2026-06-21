import jwt from 'jsonwebtoken';
import type { AuthPayload } from '../types/auth.js';

export function verifyAuthToken(token: string): AuthPayload | null {
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;

  try {
    return jwt.verify(token, secret) as AuthPayload;
  } catch {
    return null;
  }
}
