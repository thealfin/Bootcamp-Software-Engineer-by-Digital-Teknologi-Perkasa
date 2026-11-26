import type { AccessLevel, PublicUser, SubmissionStatus } from '../types/bootcamp';

export interface AccessEvaluationInput {
  user: PublicUser | null;
  moduleOrderIndex: number;
  isReferenceModule?: boolean;
  prevModuleSubmissionStatus?: SubmissionStatus | null;
  unlockOverride?: { isUnlocked: boolean; unlockedBy: string } | null;
}

export interface AccessEvaluationResult {
  accessLevel: AccessLevel;
  canSubmitTask: boolean;
  reason: string;
}

/**
 * Pure progressive unlock & RBAC evaluation matching SRS Section 3.
 * - Guest: formal meetings (1..15) are SUMMARY_ONLY; reference modules (0, 16) are open to browse.
 * - Mentor: FULL_ACCESS across all modules (0..16), task submission disabled for mentor.
 * - Registered User:
 *   - Modules 0, 1, 16 are FULL_ACCESS unless explicitly locked by mentor override.
 *   - Modules 2..15 require either explicit unlock override (`isUnlocked: true`) OR previous module `approved`.
 */
export function evaluateModuleAccess({
  user,
  moduleOrderIndex,
  isReferenceModule: isReferenceModuleProp,
  prevModuleSubmissionStatus = null,
  unlockOverride = null,
}: AccessEvaluationInput): AccessEvaluationResult {
  const isReferenceModule =
    isReferenceModuleProp ?? (moduleOrderIndex === 0 || moduleOrderIndex === 17);

  if (!user) {
    if (isReferenceModule) {
      return {
        accessLevel: 'FULL_ACCESS',
        canSubmitTask: false,
        reason: 'Modul panduan & pustaka referensi terbuka untuk pratinjau.',
      };
    }
    return {
      accessLevel: 'SUMMARY_ONLY',
      canSubmitTask: false,
      reason: 'Mode Guest: hanya 3 slide ringkasan terbuka. Daftar untuk membuka materi penuh.',
    };
  }

  if (user.role === 'mentor') {
    return {
      accessLevel: 'FULL_ACCESS',
      canSubmitTask: false,
      reason: 'Mode Mentor (Alfin Almustajab): akses penuh seluruh pertemuan.',
    };
  }

  if (isReferenceModule) {
    if (unlockOverride && !unlockOverride.isUnlocked) {
      return {
        accessLevel: 'LOCKED_PREV_TASK',
        canSubmitTask: false,
        reason: 'Akses modul dikunci manual oleh Mentor.',
      };
    }
    return {
      accessLevel: 'FULL_ACCESS',
      canSubmitTask: false,
      reason: 'Modul panduan & referensi terbuka penuh untuk peserta terdaftar.',
    };
  }

  if (moduleOrderIndex === 1) {
    if (unlockOverride && !unlockOverride.isUnlocked) {
      return {
        accessLevel: 'LOCKED_PREV_TASK',
        canSubmitTask: false,
        reason: 'Pertemuan 01 dikunci manual oleh Mentor.',
      };
    }
    return {
      accessLevel: 'FULL_ACCESS',
      canSubmitTask: true,
      reason: 'Pertemuan 01 otomatis terbuka setelah registrasi peserta.',
    };
  }

  if (unlockOverride) {
    if (unlockOverride.isUnlocked) {
      return {
        accessLevel: 'FULL_ACCESS',
        canSubmitTask: true,
        reason:
          unlockOverride.unlockedBy === 'MENTOR_ACC'
            ? 'Terbuka otomatis setelah task pertemuan sebelumnya di-ACC Mentor.'
            : 'Dibuka secara manual oleh Mentor.',
      };
    }
    return {
      accessLevel: 'LOCKED_PREV_TASK',
      canSubmitTask: false,
      reason: 'Pertemuan dikunci oleh Mentor.',
    };
  }

  if (prevModuleSubmissionStatus === 'approved') {
    return {
      accessLevel: 'FULL_ACCESS',
      canSubmitTask: true,
      reason: 'Terbuka karena task pertemuan sebelumnya sudah di-ACC Mentor.',
    };
  }

  const prevLabel = `Pertemuan ${String(moduleOrderIndex - 1).padStart(2, '0')}`;
  if (prevModuleSubmissionStatus === 'pending') {
    return {
      accessLevel: 'LOCKED_PREV_TASK',
      canSubmitTask: false,
      reason: `Terkunci: Task ${prevLabel} sedang menunggu ACC Mentor Alfin Almustajab.`,
    };
  }
  if (prevModuleSubmissionStatus === 'revision') {
    return {
      accessLevel: 'LOCKED_PREV_TASK',
      canSubmitTask: false,
      reason: `Terkunci: Task ${prevLabel} membutuhkan revisi sesuai catatan Mentor.`,
    };
  }

  return {
    accessLevel: 'LOCKED_PREV_TASK',
    canSubmitTask: false,
    reason: `Terkunci: Selesaikan & dapatkan ACC Mentor untuk Task ${prevLabel} terlebih dahulu.`,
  };
}
