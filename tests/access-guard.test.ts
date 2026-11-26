import { describe, expect, it } from 'vitest';
import { evaluateModuleAccess } from '../src/lib/access-guard';
import {
  createSessionToken,
  hashPassword,
  verifyPassword,
  verifySessionToken,
} from '../src/lib/session';
import type { PublicUser } from '../src/types/bootcamp';

const studentUser: PublicUser = {
  id: 2,
  name: 'Budi Santoso',
  email: 'budi@smkn1.sch.id',
  schoolOrigin: 'SMK Negeri 1 Jakarta',
  role: 'user',
  createdAt: '2026-11-01T00:00:00.000Z',
};

const mentorUser: PublicUser = {
  id: 1,
  name: 'Alfin Almustajab',
  email: 'alfin@digitek.id',
  schoolOrigin: 'PT. Digital Teknologi Perkasa',
  role: 'mentor',
  createdAt: '2026-11-01T00:00:00.000Z',
};

describe('session & password crypto helpers', () => {
  it('hashes passwords with scrypt + random 16-byte salt and verifies safely', () => {
    const hash1 = hashPassword('rahasia123');
    const hash2 = hashPassword('rahasia123');

    expect(hash1).toMatch(/^scrypt\$[0-9a-f]{32}\$[0-9a-f]{128}$/);
    expect(hash2).toMatch(/^scrypt\$[0-9a-f]{32}\$[0-9a-f]{128}$/);
    expect(hash1).not.toBe(hash2);

    expect(verifyPassword('rahasia123', hash1)).toBe(true);
    expect(verifyPassword('rahasia123', hash2)).toBe(true);
    expect(verifyPassword('salah123', hash1)).toBe(false);
    expect(verifyPassword('rahasia123', '')).toBe(false);
    expect(verifyPassword('rahasia123', 'plaintext')).toBe(false);
    expect(verifyPassword('rahasia123', 'scrypt$zz$00')).toBe(false);
  });

  it('signs and verifies session tokens and rejects tampered tokens', () => {
    const token = createSessionToken({ uid: 42, role: 'user' });
    const verified = verifySessionToken(token);
    expect(verified).toMatchObject({ uid: 42, role: 'user' });
    expect(verifySessionToken(`${token}tampered`)).toBeNull();
    expect(verifySessionToken(null)).toBeNull();
  });
});

describe('evaluateModuleAccess', () => {
  describe('Guest mode (user = null)', () => {
    it('gives SUMMARY_ONLY and disables submission for formal meetings (P01..P16)', () => {
      for (const orderIndex of [1, 2, 8, 15, 16]) {
        const res = evaluateModuleAccess({ user: null, moduleOrderIndex: orderIndex });
        expect(res.accessLevel).toBe('SUMMARY_ONLY');
        expect(res.canSubmitTask).toBe(false);
      }
    });

    it('gives FULL_ACCESS without task submission for reference modules (0 and 17)', () => {
      for (const orderIndex of [0, 17]) {
        const res = evaluateModuleAccess({ user: null, moduleOrderIndex: orderIndex });
        expect(res.accessLevel).toBe('FULL_ACCESS');
        expect(res.canSubmitTask).toBe(false);
      }
    });
  });

  describe('Mentor mode (role = mentor)', () => {
    it('gives FULL_ACCESS across all modules (0..16) with canSubmitTask = false', () => {
      for (let orderIndex = 0; orderIndex <= 16; orderIndex += 1) {
        const res = evaluateModuleAccess({
          user: mentorUser,
          moduleOrderIndex: orderIndex,
          prevModuleSubmissionStatus: null,
          unlockOverride: { isUnlocked: false, unlockedBy: 'MENTOR_LOCKED' },
        });
        expect(res.accessLevel).toBe('FULL_ACCESS');
        expect(res.canSubmitTask).toBe(false);
      }
    });
  });

  describe('Registered student (role = user) on P01 and reference modules', () => {
    it('gives FULL_ACCESS and canSubmitTask = true for P01 by default', () => {
      const res = evaluateModuleAccess({
        user: studentUser,
        moduleOrderIndex: 1,
      });
      expect(res.accessLevel).toBe('FULL_ACCESS');
      expect(res.canSubmitTask).toBe(true);
    });

    it('locks P01 if mentor explicitly locked it via unlockOverride', () => {
      const res = evaluateModuleAccess({
        user: studentUser,
        moduleOrderIndex: 1,
        unlockOverride: { isUnlocked: false, unlockedBy: 'MENTOR_LOCKED' },
      });
      expect(res.accessLevel).toBe('LOCKED_PREV_TASK');
      expect(res.canSubmitTask).toBe(false);
    });

    it('opens reference modules (0 and 17) unless manually locked by mentor', () => {
      expect(
        evaluateModuleAccess({ user: studentUser, moduleOrderIndex: 0 }),
      ).toMatchObject({ accessLevel: 'FULL_ACCESS', canSubmitTask: false });

      expect(
        evaluateModuleAccess({
          user: studentUser,
          moduleOrderIndex: 17,
          unlockOverride: { isUnlocked: false, unlockedBy: 'MENTOR_LOCKED' },
        }),
      ).toMatchObject({ accessLevel: 'LOCKED_PREV_TASK', canSubmitTask: false });
    });
  });

  describe('Registered student sequential gating on P02..P15', () => {
    it('locks P02 when P01 submission is unsubmitted (null)', () => {
      const res = evaluateModuleAccess({
        user: studentUser,
        moduleOrderIndex: 2,
        prevModuleSubmissionStatus: null,
      });
      expect(res.accessLevel).toBe('LOCKED_PREV_TASK');
      expect(res.canSubmitTask).toBe(false);
      expect(res.reason).toContain('Pertemuan 01');
    });

    it('locks P02 when P01 submission is pending', () => {
      const res = evaluateModuleAccess({
        user: studentUser,
        moduleOrderIndex: 2,
        prevModuleSubmissionStatus: 'pending',
      });
      expect(res.accessLevel).toBe('LOCKED_PREV_TASK');
      expect(res.canSubmitTask).toBe(false);
      expect(res.reason).toContain('menunggu ACC');
    });

    it('locks P02 when P01 submission needs revision', () => {
      const res = evaluateModuleAccess({
        user: studentUser,
        moduleOrderIndex: 2,
        prevModuleSubmissionStatus: 'revision',
      });
      expect(res.accessLevel).toBe('LOCKED_PREV_TASK');
      expect(res.canSubmitTask).toBe(false);
      expect(res.reason).toContain('revisi');
    });

    it('unlocks P02 when P01 submission is approved', () => {
      const res = evaluateModuleAccess({
        user: studentUser,
        moduleOrderIndex: 2,
        prevModuleSubmissionStatus: 'approved',
      });
      expect(res.accessLevel).toBe('FULL_ACCESS');
      expect(res.canSubmitTask).toBe(true);
    });
  });

  describe('Manual unlock / lock overrides on P02..P15', () => {
    it('grants FULL_ACCESS when MENTOR_MANUAL unlockOverride is true even if prev task is unsubmitted', () => {
      const res = evaluateModuleAccess({
        user: studentUser,
        moduleOrderIndex: 5,
        prevModuleSubmissionStatus: null,
        unlockOverride: { isUnlocked: true, unlockedBy: 'MENTOR_MANUAL' },
      });
      expect(res.accessLevel).toBe('FULL_ACCESS');
      expect(res.canSubmitTask).toBe(true);
      expect(res.reason).toContain('manual');
    });

    it('grants FULL_ACCESS with ACC reason when unlockOverride is MENTOR_ACC', () => {
      const res = evaluateModuleAccess({
        user: studentUser,
        moduleOrderIndex: 2,
        prevModuleSubmissionStatus: 'approved',
        unlockOverride: { isUnlocked: true, unlockedBy: 'MENTOR_ACC' },
      });
      expect(res.accessLevel).toBe('FULL_ACCESS');
      expect(res.canSubmitTask).toBe(true);
      expect(res.reason).toContain('ACC Mentor');
    });

    it('locks P02 when mentor manually locks it even if P01 was approved', () => {
      const res = evaluateModuleAccess({
        user: studentUser,
        moduleOrderIndex: 2,
        prevModuleSubmissionStatus: 'approved',
        unlockOverride: { isUnlocked: false, unlockedBy: 'MENTOR_LOCKED' },
      });
      expect(res.accessLevel).toBe('LOCKED_PREV_TASK');
      expect(res.canSubmitTask).toBe(false);
    });
  });
});
