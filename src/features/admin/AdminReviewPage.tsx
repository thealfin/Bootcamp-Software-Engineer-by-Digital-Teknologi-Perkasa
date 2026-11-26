import { useMemo, useState } from 'react';
import {
  Check,
  CheckCircle,
  LinkSimple,
  Lock,
  MagnifyingGlass,
  PencilSimple,
  WarningCircle,
  X,
} from '@phosphor-icons/react';
import { useBootstrap, useMentorDashboard, useMentorReview } from '../../lib/api';
import type { MentorQueueItem, SubmissionStatus } from '../../types/bootcamp';

type QueueFilterStatus = 'all' | SubmissionStatus;

const QUEUE_STATUS_META: Record<
  SubmissionStatus,
  { label: string; badgeClass: string }
> = {
  pending: {
    label: 'Menunggu Review',
    badgeClass: 'border-[#0071E3]/30 bg-[#0071E3]/10 text-[#005BB8]',
  },
  approved: {
    label: 'Disetujui',
    badgeClass: 'border-[#27C93F]/35 bg-[#27C93F]/15 text-[#146C24]',
  },
  revision: {
    label: 'Perlu Revisi',
    badgeClass: 'border-[#FF5F56]/35 bg-[#FF5F56]/12 text-[#B42318]',
  },
};

export function AdminReviewPage() {
  const { data: bootstrap } = useBootstrap();
  const { data: dashboard, isLoading, isError, error, refetch } = useMentorDashboard();
  const reviewMutation = useMentorReview();

  const [statusFilter, setStatusFilter] = useState<QueueFilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [feedbackMap, setFeedbackMap] = useState<Record<number, string>>({});
  const [unlockedIds, setUnlockedIds] = useState<Record<number, boolean>>({});
  const [unlockModalItemId, setUnlockModalItemId] = useState<number | null>(null);
  const [unlockPasscode, setUnlockPasscode] = useState('');
  const [unlockError, setUnlockError] = useState<string | null>(null);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [toast, setToast] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const filteredQueue = useMemo(() => {
    const queue = dashboard?.queue ?? [];
    const q = searchQuery.trim().toLowerCase();
    return queue.filter((item) => {
      if (statusFilter !== 'all' && item.status !== statusFilter) return false;
      if (!q) return true;
      return (
        item.userName.toLowerCase().includes(q) ||
        item.userEmail.toLowerCase().includes(q) ||
        item.userSchoolOrigin.toLowerCase().includes(q) ||
        item.moduleCode.toLowerCase().includes(q) ||
        item.moduleTitle.toLowerCase().includes(q)
      );
    });
  }, [dashboard?.queue, statusFilter, searchQuery]);

  const getFeedbackValue = (item: MentorQueueItem) => {
    if (Object.prototype.hasOwnProperty.call(feedbackMap, item.id)) {
      return feedbackMap[item.id];
    }
    return item.mentorFeedback ?? '';
  };

  const handleReviewAction = async (
    item: MentorQueueItem,
    status: 'approved' | 'revision',
  ) => {
    const feedback = getFeedbackValue(item).trim();
    if (status === 'revision' && !feedback) {
      setToast({
        type: 'error',
        message: 'Tulis catatan perbaikan sebelum meminta revisi kepada peserta.',
      });
      return;
    }

    try {
      await reviewMutation.mutateAsync({
        submissionId: item.id,
        status,
        mentorFeedback:
          feedback ||
          (status === 'approved'
            ? 'Tugas memenuhi kriteria evaluasi. Materi berikutnya telah dibuka.'
            : 'Perbaiki kode sesuai catatan mentor.'),
      });
      setToast({
        type: 'success',
        message:
          status === 'approved'
            ? `Tugas ${item.moduleCode} milik ${item.userName} disetujui dan materi berikutnya dibuka.`
            : `Catatan revisi ${item.moduleCode} untuk ${item.userName} berhasil dikirim.`,
      });
    } catch (err) {
      setToast({
        type: 'error',
        message: err instanceof Error ? err.message : 'Gagal menyimpan hasil review tugas.',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-5">
        <div className="h-10 w-64 animate-pulse rounded-xl bg-black/[0.06]" />
        <div className="mac-glass-card h-16 animate-pulse" />
        <div className="mac-glass-card h-72 animate-pulse" />
      </div>
    );
  }

  if (isError || !dashboard) {
    return (
      <div className="mac-glass-card mx-auto max-w-xl p-8 text-center">
        <WarningCircle size={32} weight="duotone" className="mx-auto text-[#FF5F56]" />
        <h2 className="mt-3 text-lg font-extrabold text-[#111113]">Gagal Memuat Antrean Tugas</h2>
        <p className="mt-1.5 text-sm text-[#52525B]">
          {error instanceof Error ? error.message : 'Terjadi kendala saat mengambil antrean.'}
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-5 cursor-pointer rounded-xl bg-[#111113] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#0071E3]"
        >
          Muat Ulang
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <span className="font-mono text-xs font-semibold tracking-wider text-[#0071E3] uppercase">
          Evaluasi Praktik
        </span>
        <h1 className="mt-1 text-2xl font-extrabold text-[#111113] sm:text-3xl">
          Review Tugas Peserta
        </h1>
        <p className="mt-1 text-sm text-[#52525B]">
          Tinjau repositori kode serta catatan belajar peserta sebelum membuka pertemuan berikutnya.
        </p>
      </div>

      {toast && (
        <div
          role="status"
          className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold ${
            toast.type === 'success'
              ? 'border-[#27C93F]/40 bg-[#27C93F]/15 text-[#146C24]'
              : 'border-[#FF5F56]/40 bg-[#FF5F56]/15 text-[#B42318]'
          }`}
        >
          <div className="flex items-center gap-2">
            {toast.type === 'success' ? (
              <CheckCircle size={18} weight="fill" />
            ) : (
              <WarningCircle size={18} weight="bold" />
            )}
            <span>{toast.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setToast(null)}
            aria-label="Tutup pemberitahuan"
            className="cursor-pointer rounded-full p-1 hover:bg-black/10"
          >
            <X size={14} weight="bold" />
          </button>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="mac-glass-card flex flex-col justify-between gap-4 p-4 sm:flex-row sm:items-center">
        <div className="flex flex-wrap gap-1.5">
          {(
            [
              { key: 'all', label: 'Semua' },
              { key: 'pending', label: 'Menunggu Review' },
              { key: 'revision', label: 'Perlu Revisi' },
              { key: 'approved', label: 'Disetujui' },
            ] as const
          ).map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setStatusFilter(f.key)}
              className={`cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors ${
                statusFilter === f.key
                  ? 'bg-[#111113] text-white'
                  : 'bg-[#F5F5F7] text-[#52525B] hover:text-[#111113]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-80">
          <MagnifyingGlass
            size={16}
            weight="bold"
            className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[#8E8E93]"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama, sekolah, atau modul..."
            className="w-full rounded-full border border-black/10 bg-white py-2 pr-4 pl-9 text-xs font-medium text-[#111113] outline-none focus:border-[#0071E3] focus:ring-4 focus:ring-[#0071E3]/15"
          />
        </div>
      </div>

      {filteredQueue.length === 0 ? (
        <div className="mac-glass-card p-10 text-center">
          <CheckCircle size={36} weight="duotone" className="mx-auto text-[#27C93F]" />
          <p className="mt-3 text-base font-bold text-[#111113]">
            Tidak ada tugas pada filter ini
          </p>
          <p className="mt-1 text-xs text-[#52525B]">
            Ubah status filter atau kata kunci pencarian untuk menampilkan kiriman lain.
          </p>
        </div>
      ) : (
        <div className="grid gap-5">
          {filteredQueue.map((item) => {
            const statusMeta = QUEUE_STATUS_META[item.status];
            return (
              <article key={item.id} className="mac-glass-card overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/[0.07] bg-black/[0.02] px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <span className="rounded-full bg-[#111113] px-2.5 py-0.5 font-mono text-[11px] font-bold text-white">
                      {item.moduleCode}
                    </span>
                    <span className="text-sm font-extrabold text-[#111113]">
                      {item.moduleTitle}
                    </span>
                  </div>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-bold ${statusMeta.badgeClass}`}
                  >
                    {statusMeta.label}
                  </span>
                </div>

                <div className="grid gap-6 p-5 lg:grid-cols-12">
                  <div className="space-y-4 lg:col-span-7">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h2 className="text-base font-extrabold text-[#111113]">
                          {item.userName}
                        </h2>
                        <p className="text-xs font-medium text-[#52525B]">
                          {item.userEmail} • <strong>{item.userSchoolOrigin}</strong>
                        </p>
                      </div>
                      <span className="font-mono text-[11px] text-[#8E8E93]">
                        Dikirim: {new Date(item.submittedAt).toLocaleString('id-ID')}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <a
                        href={item.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-bold text-[#0071E3] no-underline transition-colors hover:border-[#0071E3]"
                      >
                        <LinkSimple size={14} weight="bold" />
                        <span>Repositori GitHub</span>
                      </a>
                      {item.demoUrl && (
                        <a
                          href={item.demoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-bold text-[#111113] no-underline transition-colors hover:border-[#FF4D00] hover:text-[#FF4D00]"
                        >
                          <LinkSimple size={14} weight="bold" />
                          <span>Pratinjau Demo</span>
                        </a>
                      )}
                    </div>

                    <div className="rounded-2xl border border-black/[0.07] bg-[#F5F5F7] p-4">
                      <p className="font-mono text-[11px] font-semibold tracking-wider text-[#8E8E93] uppercase">
                        Learning Log Peserta
                      </p>
                      <p className="mt-1.5 text-sm leading-relaxed whitespace-pre-line text-[#111113]">
                        {item.learningLog}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between space-y-4 lg:col-span-5">
                    {item.status === 'approved' && !unlockedIds[item.id] ? (
                      <div className="flex h-full flex-col justify-between space-y-4">
                        <div className="rounded-2xl border border-[#27C93F]/30 bg-[#27C93F]/[0.06] p-4">
                          <div className="mb-2 flex items-center justify-between gap-2">
                            <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold tracking-wider text-[#146C24] uppercase">
                              <Lock size={13} weight="bold" />
                              Catatan Mentor (Terkunci)
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setUnlockModalItemId(item.id);
                                setUnlockPasscode('');
                                setUnlockError(null);
                              }}
                              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-black/10 bg-white px-2.5 py-1 text-xs font-bold text-[#111113] shadow-2xs transition-colors hover:bg-[#F5F5F7]"
                            >
                              <PencilSimple size={13} weight="bold" />
                              <span>Edit Review</span>
                            </button>
                          </div>
                          <p className="text-sm leading-relaxed whitespace-pre-line text-[#111113]">
                            {item.mentorFeedback || 'Tugas memenuhi kriteria evaluasi.'}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div>
                          <label
                            htmlFor={`feedback-${item.id}`}
                            className="mb-1.5 block font-mono text-xs font-semibold tracking-wider text-[#52525B] uppercase"
                          >
                            Catatan Mentor
                          </label>
                          <textarea
                            id={`feedback-${item.id}`}
                            rows={4}
                            value={getFeedbackValue(item)}
                            onChange={(e) =>
                              setFeedbackMap((prev) => ({
                                ...prev,
                                [item.id]: e.target.value,
                              }))
                            }
                            placeholder="Tulis umpan balik atau poin perbaikan kode untuk peserta..."
                            className="w-full rounded-2xl border border-black/15 bg-white p-3.5 text-sm text-[#111113] transition outline-none placeholder:text-[#8E8E93] focus:border-[#0071E3] focus:ring-4 focus:ring-[#0071E3]/15"
                          />
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row">
                          <button
                            type="button"
                            disabled={reviewMutation.isPending}
                            onClick={() => handleReviewAction(item, 'approved')}
                            className="inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-[#27C93F] px-4 py-2.5 text-xs font-extrabold text-[#0B3D13] shadow-2xs transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <Check size={15} weight="bold" />
                            <span>Setujui & Buka Materi Berikutnya</span>
                          </button>
                          <button
                            type="button"
                            disabled={reviewMutation.isPending}
                            onClick={() => handleReviewAction(item, 'revision')}
                            className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-[#FF5F56]/40 bg-[#FF5F56]/12 px-4 py-2.5 text-xs font-extrabold text-[#B42318] transition-colors hover:bg-[#FF5F56]/20 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <WarningCircle size={15} weight="bold" />
                            <span>Minta Revisi</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {unlockModalItemId !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="unlock-review-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#111113]/45 p-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isUnlocking) {
              setUnlockModalItemId(null);
            }
          }}
        >
          <div className="mac-glass-card w-full max-w-sm bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between gap-2">
              <h3 id="unlock-review-title" className="text-base font-extrabold text-[#111113]">
                Buka Kunci Review
              </h3>
              <button
                type="button"
                disabled={isUnlocking}
                onClick={() => setUnlockModalItemId(null)}
                className="cursor-pointer rounded-full p-1 text-[#52525B] hover:bg-black/5"
                aria-label="Tutup modal"
              >
                <X size={16} weight="bold" />
              </button>
            </div>
            <p className="mt-1 text-xs text-[#52525B]">
              Masukkan kata sandi mentor untuk mengubah review yang sudah disetujui.
            </p>
            <form
              className="mt-4 space-y-3"
              onSubmit={async (e) => {
                e.preventDefault();
                if (!unlockPasscode.trim()) {
                  setUnlockError('Kata sandi mentor wajib diisi.');
                  return;
                }
                setIsUnlocking(true);
                setUnlockError(null);
                try {
                  const res = await fetch('/api/auth/mentor-login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      email: bootstrap?.user?.email || 'kangalfin95@gmail.com',
                      passcode: unlockPasscode,
                    }),
                  });
                  if (!res.ok) {
                    const data = await res.json().catch(() => ({}));
                    throw new Error(data.error || 'Kata sandi mentor tidak valid.');
                  }
                  const targetId = unlockModalItemId;
                  setUnlockedIds((prev) => ({ ...prev, [targetId]: true }));
                  setUnlockModalItemId(null);
                  setUnlockPasscode('');
                } catch (err) {
                  setUnlockError(
                    err instanceof Error ? err.message : 'Gagal memverifikasi kata sandi.',
                  );
                } finally {
                  setIsUnlocking(false);
                }
              }}
            >
              <div>
                <label
                  htmlFor="mentor-unlock-passcode"
                  className="mb-1 block font-mono text-[11px] font-semibold tracking-wider text-[#52525B] uppercase"
                >
                  Kata Sandi Mentor
                </label>
                <input
                  id="mentor-unlock-passcode"
                  type="password"
                  autoFocus
                  value={unlockPasscode}
                  onChange={(e) => setUnlockPasscode(e.target.value)}
                  placeholder="Masukkan kata sandi..."
                  className="w-full rounded-xl border border-black/15 bg-white px-3.5 py-2.5 text-sm text-[#111113] outline-none focus:border-[#0071E3] focus:ring-4 focus:ring-[#0071E3]/15"
                />
              </div>
              {unlockError && (
                <p className="text-xs font-semibold text-[#B42318]">{unlockError}</p>
              )}
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  disabled={isUnlocking}
                  onClick={() => setUnlockModalItemId(null)}
                  className="cursor-pointer rounded-xl border border-black/10 bg-white px-4 py-2 text-xs font-bold text-[#52525B] hover:bg-[#F5F5F7]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isUnlocking}
                  className="cursor-pointer rounded-xl bg-[#111113] px-4 py-2 text-xs font-bold text-white hover:bg-[#0071E3] disabled:opacity-60"
                >
                  {isUnlocking ? 'Memeriksa...' : 'Buka Kunci'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
