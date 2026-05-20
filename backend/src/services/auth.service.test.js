/**
 * Unit tests for backend auth service functions.
 */
import { describe, it, expect } from 'vitest';

process.env.JWT_SECRET = 'unit-test-secret';

const { hashPassword, comparePassword, generateToken, verifyToken } = await import('./auth.service.js');

describe('Auth Service', () => {
  it('hashes and verifies passwords', async () => {
    const password = 'P@ssword123';
    const hashed = await hashPassword(password);

    expect(hashed).not.toBe(password);
    expect(await comparePassword(password, hashed)).toBe(true);
    expect(await comparePassword('wrong', hashed)).toBe(false);
  });

  it('generates and verifies JWT tokens', () => {
    const payload = { id: 1, username: 'akash' };
    const token = generateToken(payload);

    expect(typeof token).toBe('string');

    const decoded = verifyToken(token);
    expect(decoded.id).toBe(payload.id);
    expect(decoded.username).toBe(payload.username);
  });

  it('throws when token is invalid', () => {
    expect(() => verifyToken('invalid.token.value')).toThrow();
  });
});
