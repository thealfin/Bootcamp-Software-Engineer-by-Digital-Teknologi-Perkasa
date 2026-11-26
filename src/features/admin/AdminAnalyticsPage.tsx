import { useMemo, useState } from 'react';
import {
  ArrowsDownUp,
  CaretDown,
  CaretUp,
  Clock,
  Pulse,
  Repeat,
  TrendUp,
  Users,
  WarningCircle,
} from '@phosphor-icons/react';
import { useAdminAnalytics } from '../../lib/api';

type SortField =
  | 'name'
  | 'schoolOrigin'
  | 'approvedCount'
  | 'pendingCount'
  | 'revisionCount'
  | 'progressPercent'
  | 'lastSubmittedAt';

export function AdminAnalyticsPage() {
  const { data: analytics, isLoading, isError, error, refetch } = useAdminAnalytics();

  const [sortField, setSortField] = useState<SortField>('progressPercent');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir(field === 'name' || field === 'schoolOrigin' ? 'asc' : 'desc');
    }
  };

  const sortedStudents = useMemo(() => {
    const list = [...(analytics?.studentPerformance ?? [])];
    list.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'name' || sortField === 'schoolOrigin') {
        cmp = a[sortField].localeCompare(b[sortField], 'id');
      } else if (sortField === 'lastSubmittedAt') {
        const tA = a.lastSubmittedAt ? new Date(a.lastSubmittedAt).getTime() : 0;
        const tB = b.lastSubmittedAt ? new Date(b.lastSubmittedAt).getTime() : 0;
        cmp = tA - tB;
      } else {
        cmp = a[sortField] - b[sortField];
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return list;
  }, [analytics?.studentPerformance, sortField, sortDir]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-64 animate-pulse rounded-xl bg-black/[0.06]" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="mac-glass-card h-28 animate-pulse" />
          ))}
        </div>
        <div className="mac-glass-card h-72 animate-pulse" />
      </div>
    );
  }

  if (isError || !analytics) {
    return (
      <div className="mac-glass-card mx-auto max-w-xl p-8 text-center">
        <WarningCircle size={32} weight="duotone" className="mx-auto text-[#FF5F56]" />
        <h2 className="mt-3 text-lg font-extrabold text-[#111113]">Gagal Memuat Analitik</h2>
        <p className="mt-1.5 text-sm text-[#52525B]">
          {error instanceof Error ? error.message : 'Terjadi kendala saat memuat data analitik.'}
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

  const { kpis, weeklyTrend, moduleDifficulty, schoolBreakdown } = analytics;
  const maxWeeklyCount = Math.max(
    1,
    ...weeklyTrend.map((w) => Math.max(w.submissions, w.approvals)),
  );
  const maxDifficultySubmissions = Math.max(
    1,
    ...moduleDifficulty.map((m) => m.submissionsCount),
  );

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowsDownUp size={12} className="text-[#8E8E93]" />;
    }
    return sortDir === 'asc' ? (
      <CaretUp size={12} weight="bold" className="text-[#0071E3]" />
    ) : (
      <CaretDown size={12} weight="bold" className="text-[#0071E3]" />
    );
  };

  const formattedReviewHours = Number.isFinite(kpis.avgReviewHours)
    ? `${Number(kpis.avgReviewHours.toFixed(1))} jam`
    : '0 jam';

  return (
    <div className="space-y-6">
      <div>
        <span className="font-mono text-xs font-semibold tracking-wider text-[#0071E3] uppercase">
          Evaluasi Data
        </span>
        <h1 className="mt-1 text-2xl font-extrabold text-[#111113] sm:text-3xl">
          Analitik Peserta & Kurikulum
        </h1>
        <p className="mt-1 text-sm text-[#52525B]">
          Ringkasan keaktifan belajar, kecepatan review mentor, tingkat kesulitan modul, dan
          capaian per instansi.
        </p>
      </div>

      {/* 5 KPI Cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5" aria-label="Indikator Kinerja">
        <div className="mac-glass-card p-5">
          <Users size={19} weight="duotone" className="text-[#52525B]" />
          <p className="mt-3 font-mono text-[11px] font-semibold tracking-wider text-[#8E8E93] uppercase">
            Total Peserta
          </p>
          <p className="mt-1 text-2xl font-extrabold text-[#111113]">{kpis.totalStudents}</p>
        </div>

        <div className="mac-glass-card p-5">
          <Pulse size={19} weight="duotone" className="text-[#27C93F]" />
          <p className="mt-3 font-mono text-[11px] font-semibold tracking-wider text-[#8E8E93] uppercase">
            Aktif 7 Hari
          </p>
          <p className="mt-1 text-2xl font-extrabold text-[#146C24]">{kpis.activeStudents7d}</p>
        </div>

        <div className="mac-glass-card p-5">
          <TrendUp size={19} weight="duotone" className="text-[#0071E3]" />
          <p className="mt-3 font-mono text-[11px] font-semibold tracking-wider text-[#8E8E93] uppercase">
            Rata-rata Progres
          </p>
          <p className="mt-1 text-2xl font-extrabold text-[#0071E3]">
            {kpis.avgProgressPercent}%
          </p>
        </div>

        <div className="mac-glass-card p-5">
          <Clock size={19} weight="duotone" className="text-[#52525B]" />
          <p className="mt-3 font-mono text-[11px] font-semibold tracking-wider text-[#8E8E93] uppercase">
            Rata-rata Waktu Review
          </p>
          <p className="mt-1 text-2xl font-extrabold text-[#111113]">{formattedReviewHours}</p>
        </div>

        <div className="mac-glass-card p-5">
          <Repeat size={19} weight="duotone" className="text-[#FF4D00]" />
          <p className="mt-3 font-mono text-[11px] font-semibold tracking-wider text-[#8E8E93] uppercase">
            Rasio Revisi
          </p>
          <p className="mt-1 text-2xl font-extrabold text-[#FF4D00]">
            {kpis.revisionRatePercent}%
          </p>
        </div>
      </section>

      {/* 8-Week Trend CSS Bar Chart */}
      <section className="mac-glass-card p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-extrabold text-[#111113]">
              Tren Pengumpulan & Persetujuan (8 Minggu)
            </h2>
            <p className="text-xs text-[#52525B]">
              Perbandingan jumlah kiriman tugas dan tugas yang disetujui setiap minggu.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold text-[#52525B]">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-[#0071E3]" /> Kiriman Masuk
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-[#27C93F]" /> Disetujui
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-4 gap-3 sm:grid-cols-8">
          {weeklyTrend.map((bucket) => {
            const subHeight = Math.round((bucket.submissions / maxWeeklyCount) * 100);
            const appHeight = Math.round((bucket.approvals / maxWeeklyCount) * 100);
            return (
              <div key={bucket.weekLabel} className="flex flex-col items-center">
                <div className="flex h-36 w-full items-end justify-center gap-1.5 rounded-xl bg-[#F5F5F7] px-2 pt-4 pb-2">
                  <div className="flex h-full flex-col items-center justify-end gap-1">
                    <span className="font-mono text-[10px] font-bold text-[#0071E3]">
                      {bucket.submissions}
                    </span>
                    <div
                      style={{ height: `${Math.max(subHeight, bucket.submissions > 0 ? 8 : 2)}%` }}
                      className="w-3 rounded-t-md bg-[#0071E3] transition-all sm:w-3.5"
                      title={`Kiriman: ${bucket.submissions}`}
                    />
                  </div>
                  <div className="flex h-full flex-col items-center justify-end gap-1">
                    <span className="font-mono text-[10px] font-bold text-[#146C24]">
                      {bucket.approvals}
                    </span>
                    <div
                      style={{ height: `${Math.max(appHeight, bucket.approvals > 0 ? 8 : 2)}%` }}
                      className="w-3 rounded-t-md bg-[#27C93F] transition-all sm:w-3.5"
                      title={`Disetujui: ${bucket.approvals}`}
                    />
                  </div>
                </div>
                <span className="mt-2 truncate font-mono text-[10px] font-semibold text-[#52525B]">
                  {bucket.weekLabel}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Module Difficulty & School Origin Breakdown */}
      <div className="grid gap-6 lg:grid-cols-12">
        <section className="mac-glass-card p-6 lg:col-span-7">
          <h2 className="text-base font-extrabold text-[#111113]">Tingkat Kesulitan Modul</h2>
          <p className="text-xs text-[#52525B]">
            Jumlah pengumpulan dan proporsi revisi pada masing-masing modul pertemuan.
          </p>

          {moduleDifficulty.length === 0 ? (
            <p className="py-8 text-center text-xs text-[#52525B]">Belum ada data kiriman modul.</p>
          ) : (
            <div className="mt-4 max-h-80 space-y-3 overflow-y-auto pr-1">
              {moduleDifficulty.map((mod) => {
                const subWidth = Math.round(
                  (mod.submissionsCount / maxDifficultySubmissions) * 100,
                );
                return (
                  <div key={mod.moduleId} className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="flex min-w-0 items-center gap-2">
                        <span className="rounded bg-[#111113] px-1.5 py-0.5 font-mono text-[10px] font-bold text-white">
                          {mod.code}
                        </span>
                        <span className="truncate font-semibold text-[#111113]">{mod.title}</span>
                      </span>
                      <span className="shrink-0 font-mono text-[11px] text-[#52525B]">
                        {mod.submissionsCount} kiriman •{' '}
                        <strong className="text-[#FF4D00]">
                          {mod.revisionCount} revisi ({mod.revisionRatePercent}%)
                        </strong>
                      </span>
                    </div>
                    <div className="flex h-2 overflow-hidden rounded-full bg-black/[0.06]">
                      <div
                        style={{ width: `${subWidth}%` }}
                        className="bg-[#0071E3]"
                        title={`${mod.submissionsCount} kiriman`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="mac-glass-card p-6 lg:col-span-5">
          <h2 className="text-base font-extrabold text-[#111113]">Sebaran Asal Instansi</h2>
          <p className="text-xs text-[#52525B]">
            Jumlah peserta dan rata-rata progres berdasarkan asal sekolah atau kampus.
          </p>

          {schoolBreakdown.length === 0 ? (
            <p className="py-8 text-center text-xs text-[#52525B]">
              Belum ada data instansi peserta.
            </p>
          ) : (
            <ul className="mt-4 max-h-80 space-y-3.5 overflow-y-auto pr-1">
              {schoolBreakdown.map((school) => (
                <li key={school.schoolOrigin} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="truncate font-bold text-[#111113]">
                      {school.schoolOrigin}
                    </span>
                    <span className="shrink-0 font-mono text-[11px] text-[#52525B]">
                      {school.studentCount} peserta • {school.avgProgressPercent}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-black/[0.06]">
                    <div
                      style={{ width: `${Math.min(100, school.avgProgressPercent)}%` }}
                      className="h-full rounded-full bg-[#27C93F]"
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Sortable Student Performance Table */}
      <section className="mac-glass-card overflow-hidden">
        <div className="border-b border-black/[0.07] px-6 py-4">
          <h2 className="text-base font-extrabold text-[#111113]">Tabel Performa Peserta</h2>
          <p className="text-xs text-[#52525B]">
            Klik judul kolom untuk mengurutkan capaian peserta.
          </p>
        </div>

        {sortedStudents.length === 0 ? (
          <p className="p-8 text-center text-xs text-[#52525B]">Belum ada data peserta.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-black/[0.07] bg-[#F5F5F7]/70 font-mono text-[11px] font-semibold text-[#52525B] uppercase">
                  <th className="px-5 py-3">
                    <button
                      type="button"
                      onClick={() => toggleSort('name')}
                      className="inline-flex cursor-pointer items-center gap-1 uppercase"
                    >
                      <span>Peserta</span>
                      {renderSortIcon('name')}
                    </button>
                  </th>
                  <th className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => toggleSort('schoolOrigin')}
                      className="inline-flex cursor-pointer items-center gap-1 uppercase"
                    >
                      <span>Instansi</span>
                      {renderSortIcon('schoolOrigin')}
                    </button>
                  </th>
                  <th className="px-3 py-3 text-center">
                    <button
                      type="button"
                      onClick={() => toggleSort('approvedCount')}
                      className="inline-flex cursor-pointer items-center gap-1 uppercase"
                    >
                      <span>Disetujui</span>
                      {renderSortIcon('approvedCount')}
                    </button>
                  </th>
                  <th className="px-3 py-3 text-center">
                    <button
                      type="button"
                      onClick={() => toggleSort('pendingCount')}
                      className="inline-flex cursor-pointer items-center gap-1 uppercase"
                    >
                      <span>Menunggu</span>
                      {renderSortIcon('pendingCount')}
                    </button>
                  </th>
                  <th className="px-3 py-3 text-center">
                    <button
                      type="button"
                      onClick={() => toggleSort('revisionCount')}
                      className="inline-flex cursor-pointer items-center gap-1 uppercase"
                    >
                      <span>Revisi</span>
                      {renderSortIcon('revisionCount')}
                    </button>
                  </th>
                  <th className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => toggleSort('progressPercent')}
                      className="inline-flex cursor-pointer items-center gap-1 uppercase"
                    >
                      <span>Progres</span>
                      {renderSortIcon('progressPercent')}
                    </button>
                  </th>
                  <th className="px-5 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => toggleSort('lastSubmittedAt')}
                      className="inline-flex cursor-pointer items-center gap-1 uppercase"
                    >
                      <span>Kiriman Terakhir</span>
                      {renderSortIcon('lastSubmittedAt')}
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.06]">
                {sortedStudents.map((student) => (
                  <tr key={student.userId} className="hover:bg-black/[0.02]">
                    <td className="px-5 py-3 font-bold text-[#111113]">
                      <div>{student.name}</div>
                      <div className="text-[11px] font-normal text-[#8E8E93]">{student.email}</div>
                    </td>
                    <td className="px-4 py-3 text-[#52525B]">{student.schoolOrigin}</td>
                    <td className="px-3 py-3 text-center font-mono font-bold text-[#146C24]">
                      {student.approvedCount}
                    </td>
                    <td className="px-3 py-3 text-center font-mono font-bold text-[#0071E3]">
                      {student.pendingCount}
                    </td>
                    <td className="px-3 py-3 text-center font-mono font-bold text-[#FF4D00]">
                      {student.revisionCount}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-20 overflow-hidden rounded-full bg-black/[0.06]">
                          <div
                            style={{ width: `${Math.min(100, student.progressPercent)}%` }}
                            className="h-full rounded-full bg-[#0071E3]"
                          />
                        </div>
                        <span className="font-mono font-bold text-[#111113]">
                          {student.progressPercent}%
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right font-mono text-[11px] text-[#52525B]">
                      {student.lastSubmittedAt
                        ? new Date(student.lastSubmittedAt).toLocaleDateString('id-ID', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
