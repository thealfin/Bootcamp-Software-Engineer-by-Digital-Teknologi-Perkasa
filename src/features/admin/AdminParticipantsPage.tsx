import { useMemo, useState } from 'react';
import {
  Check,
  CheckCircle,
  Lock,
  LockOpen,
  MagnifyingGlass,
  WarningCircle,
  X,
} from '@phosphor-icons/react';
import { useMentorDashboard, useMentorUnlock } from '../../lib/api';

export function AdminParticipantsPage() {
  const { data: dashboard, isLoading, isError, error, refetch } = useMentorDashboard();
  const unlockMutation = useMentorUnlock();

  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<{
    type: 'success' | 'error';
    message: string;
    undoPayload?: { userId: number; moduleId: number; unlocked: boolean };
  } | null>(null);

  const formalColumns = useMemo(() => {
    return (dashboard?.modules ?? [])
      .filter((m) => m.orderIndex >= 1 && m.slug !== 'pustaka-learning-hub')
      .sort((a, b) => a.orderIndex - b.orderIndex);
  }, [dashboard?.modules]);

  const filteredStudents = useMemo(() => {
    const rows = dashboard?.studentsMatrix ?? [];
    const q = searchQuery.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (row) =>
        row.user.name.toLowerCase().includes(q) ||
        row.user.email.toLowerCase().includes(q) ||
        row.user.schoolOrigin.toLowerCase().includes(q),
    );
  }, [dashboard?.studentsMatrix, searchQuery]);

  const handleToggleUnlock = async (params: {
    userId: number;
    userName: string;
    moduleId: number;
    moduleCode: string;
    currentlyUnlocked: boolean;
  }) => {
    const nextUnlocked = !params.currentlyUnlocked;
    try {
      await unlockMutation.mutateAsync({
        userId: params.userId,
        moduleId: params.moduleId,
        unlocked: nextUnlocked,
      });
      setToast({
        type: 'success',
        message: nextUnlocked
          ? `Akses ${params.moduleCode} dibuka manual untuk ${params.userName}.`
          : `Akses ${params.moduleCode} dikunci manual untuk ${params.userName}.`,
        undoPayload: {
          userId: params.userId,
          moduleId: params.moduleId,
          unlocked: params.currentlyUnlocked,
        },
      });
    } catch (err) {
      setToast({
        type: 'error',
        message: err instanceof Error ? err.message : 'Gagal memperbarui status akses modul.',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-5">
        <div className="h-10 w-64 animate-pulse rounded-xl bg-black/[0.06]" />
        <div className="mac-glass-card h-96 animate-pulse" />
      </div>
    );
  }

  if (isError || !dashboard) {
    return (
      <div className="mac-glass-card mx-auto max-w-xl p-8 text-center">
        <WarningCircle size={32} weight="duotone" className="mx-auto text-[#FF5F56]" />
        <h2 className="mt-3 text-lg font-extrabold text-[#111113]">Gagal Memuat Data Peserta</h2>
        <p className="mt-1.5 text-sm text-[#52525B]">
          {error instanceof Error ? error.message : 'Terjadi kendala saat memuat matriks peserta.'}
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
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="font-mono text-xs font-semibold tracking-wider text-[#0071E3] uppercase">
            Matriks Akses
          </span>
          <h1 className="mt-1 text-2xl font-extrabold text-[#111113] sm:text-3xl">
            Data & Progres Peserta
          </h1>
          <p className="mt-1 text-sm text-[#52525B]">
            Klik sel modul {formalColumns[0]?.code ?? 'P01'}–{formalColumns[formalColumns.length - 1]?.code ?? 'P16'} untuk membuka atau mengunci akses peserta secara manual.
          </p>
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
            placeholder="Cari nama, email, atau asal sekolah..."
            className="w-full rounded-full border border-black/10 bg-white py-2 pr-4 pl-9 text-xs font-medium text-[#111113] outline-none focus:border-[#0071E3] focus:ring-4 focus:ring-[#0071E3]/15"
          />
        </div>
      </div>

      {toast && (
        <div
          role="status"
          className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold ${
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
          <div className="flex items-center gap-2">
            {toast.undoPayload && (
              <button
                type="button"
                onClick={async () => {
                  const payload = toast.undoPayload!;
                  await unlockMutation.mutateAsync(payload);
                  setToast(null);
                }}
                className="cursor-pointer rounded-full bg-white px-3 py-1 text-xs font-bold text-[#111113] shadow-2xs hover:bg-white/90"
              >
                Urungkan
              </button>
            )}
            <button
              type="button"
              onClick={() => setToast(null)}
              aria-label="Tutup pemberitahuan"
              className="cursor-pointer rounded-full p-1 hover:bg-black/10"
            >
              <X size={14} weight="bold" />
            </button>
          </div>
        </div>
      )}

      <div className="mac-glass-card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/[0.07] bg-black/[0.02] px-5 py-3.5">
          <span className="font-mono text-xs font-semibold tracking-wider text-[#52525B] uppercase">
            {filteredStudents.length} Peserta Terdaftar
          </span>
          <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold text-[#52525B]">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#27C93F]" /> Disetujui
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#0071E3]" /> Terbuka / Menunggu
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]" /> Perlu Revisi
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-black/20" /> Terkunci
            </span>
          </div>
        </div>

        {filteredStudents.length === 0 ? (
          <div className="p-10 text-center text-sm text-[#52525B]">
            {searchQuery.trim()
              ? 'Tidak ada peserta yang sesuai dengan pencarian.'
              : 'Belum ada peserta terdaftar.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px] border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-black/[0.07] bg-[#F5F5F7]/70 font-mono text-[11px] font-semibold text-[#52525B] uppercase">
                  <th className="sticky left-0 z-10 bg-[#F5F5F7] px-4 py-3">Peserta</th>
                  <th className="px-3 py-3">Asal Sekolah / Kampus</th>
                  <th className="px-3 py-3 text-center">Selesai</th>
                  {formalColumns.map((col) => (
                    <th key={col.id} className="px-2 py-3 text-center">
                      {col.code}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.06]">
                {filteredStudents.map((row) => (
                  <tr key={row.user.id} className="hover:bg-black/[0.02]">
                    <td className="sticky left-0 z-10 bg-white/95 px-4 py-3 font-bold text-[#111113]">
                      <div>{row.user.name}</div>
                      <div className="text-[11px] font-normal text-[#8E8E93]">
                        {row.user.email}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-[#52525B]">{row.user.schoolOrigin}</td>
                    <td className="px-3 py-3 text-center font-mono font-bold text-[#146C24]">
                      {row.approvedCount}/{formalColumns.length || 15}
                    </td>
                    {formalColumns.map((col) => {
                      const cell = row.modules.find((m) => m.moduleId === col.id);
                      const isUnlocked = cell?.accessLevel === 'FULL_ACCESS';
                      const status = cell?.submissionStatus;

                      let cellClass =
                        'border-black/10 bg-black/[0.05] text-[#8E8E93] hover:bg-black/10';
                      if (status === 'approved') {
                        cellClass =
                          'border-[#27C93F]/40 bg-[#27C93F]/20 text-[#146C24] hover:bg-[#27C93F]/30';
                      } else if (status === 'revision') {
                        cellClass =
                          'border-[#FF5F56]/40 bg-[#FF5F56]/20 text-[#B42318] hover:bg-[#FF5F56]/30';
                      } else if (status === 'pending' || isUnlocked) {
                        cellClass =
                          'border-[#0071E3]/35 bg-[#0071E3]/15 text-[#005BB8] hover:bg-[#0071E3]/25';
                      }

                      return (
                        <td key={col.id} className="px-1.5 py-2.5 text-center">
                          <button
                            type="button"
                            disabled={unlockMutation.isPending}
                            title={`${row.user.name} • ${col.code} (${
                              isUnlocked
                                ? 'Terbuka || klik untuk mengunci'
                                : 'Terkunci || klik untuk membuka manual'
                            })`}
                            onClick={() =>
                              handleToggleUnlock({
                                userId: row.user.id,
                                userName: row.user.name,
                                moduleId: col.id,
                                moduleCode: col.code,
                                currentlyUnlocked: Boolean(isUnlocked),
                              })
                            }
                            className={`inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border font-bold transition-all ${cellClass}`}
                          >
                            {status === 'approved' ? (
                              <Check size={14} weight="bold" />
                            ) : isUnlocked ? (
                              <LockOpen size={14} weight="bold" />
                            ) : (
                              <Lock size={13} weight="bold" />
                            )}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
