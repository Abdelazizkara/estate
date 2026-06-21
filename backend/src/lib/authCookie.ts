import type { Response, Request } from 'express';

export const AUTH_COOKIE = 'estate_session';

const maxAgeMs = 7 * 24 * 60 * 60 * 1000;

export function setAuthCookie(res: Response, token: string) {
  res.cookie(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: maxAgeMs,
    path: '/',
  });
}

export function clearAuthCookie(res: Response) {
  res.clearCookie(AUTH_COOKIE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
}

export function getTokenFromRequest(req: Request): string | undefined {
  const cookie = req.cookies?.[AUTH_COOKIE];
  if (typeof cookie === 'string' && cookie.length > 0) return cookie;

  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) {
    return header.slice(7);
  }

  return undefined;
}
