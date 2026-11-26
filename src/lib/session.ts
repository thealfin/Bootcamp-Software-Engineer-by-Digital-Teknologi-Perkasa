import crypto from 'node:crypto';
import type { UserRole } from '../types/bootcamp';

export const SESSION_COOKIE_NAME = 'bootcamp_session';

export interface SessionPayload {
  uid: number;
  role: UserRole;
  iat: number;
}

function getSessionSecret(): string {
  return process.env.SESSION_SECRET || 'digitek-bootcamp-batch1-dev-secret';
}

function signData(data: string): string {
  return crypto.createHmac('sha256', getSessionSecret()).update(data).digest('base64url');
}

export function createSessionToken(payload: { uid: number; role: UserRole }): string {
  const body: SessionPayload = {
    uid: payload.uid,
    role: payload.role,
    iat: Date.now(),
  };
  const encoded = Buffer.from(JSON.stringify(body), 'utf8').toString('base64url');
  const signature = signData(encoded);
  return `${encoded}.${signature}`;
}

export function verifySessionToken(token: string | undefined | null): SessionPayload | null {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [encoded, signature] = parts;
  if (!encoded || !signature) return null;

  const expected = signData(encoded);
  const sigBuf = Buffer.from(signature, 'utf8');
  const expBuf = Buffer.from(expected, 'utf8');
  if (sigBuf.length !== expBuf.length) return null;
  if (!crypto.timingSafeEqual(sigBuf, expBuf)) return null;

  try {
    const parsed = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as SessionPayload;
    if (
      typeof parsed.uid === 'number' &&
      Number.isInteger(parsed.uid) &&
      (parsed.role === 'user' || parsed.role === 'mentor')
    ) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function hashPassword(password: string): string {
  const saltHex = crypto.randomBytes(16).toString('hex');
  const hashHex = crypto.scryptSync(password, saltHex, 64).toString('hex');
  return `scrypt$${saltHex}$${hashHex}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash || typeof storedHash !== 'string') return false;
  const parts = storedHash.split('$');
  if (parts.length !== 3 || parts[0] !== 'scrypt') return false;
  const [, saltHex, hashHex] = parts;
  if (!saltHex || !hashHex || hashHex.length % 2 !== 0) return false;
  try {
    const expected = Buffer.from(hashHex, 'hex');
    if (expected.length === 0) return false;
    const derived = crypto.scryptSync(password, saltHex, expected.length);
    if (derived.length !== expected.length) return false;
    return crypto.timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
}
