import { Link } from '@tanstack/react-router';
import {
  ArrowRight,
  BookOpen,
  ChartBar,
  CheckCircle,
  CheckSquareOffset,
  Clock,
  TrendUp,
  Users,
  WarningCircle,
} from '@phosphor-icons/react';
import { useMentorDashboard } from '../../lib/api';

export function AdminOverviewPage() {
  const { data: dashboard, isLoading, isError, error, refetch } = useMentorDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-64 animate-pulse rounded-xl bg-black/[0.06]" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="mac-glass-card h-28 animate-pulse" />
          ))}
        </div>
        <div className="mac-glass-card h-72 animate-pulse" />
      </div>
    );
  }

  if (isError || !dashboard) {
    return (
      <div className="mac-glass-card mx-auto max-w-xl p-8 text-center">
        <WarningCircle size={32} weight="duotone" className="mx-auto text-[#FF5F56]" />
        <h2 className="mt-3 text-lg font-extrabold text-[#111113]">Gagal Memuat Ringkasan</h2>
        <p className="mt-1.5 text-sm text-[#52525B]">
          {error instanceof Error ? error.message : 'Terjadi kendala saat mengambil data panel.'}
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

  const { kpis, queue } = dashboard;
  const recentPending = queue.filter((item) => item.status === 'pending').slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <span className="font-mono text-xs font-semibold tracking-wider text-[#0071E3] uppercase">
          Ringkasan Operasional
        </span>
        <h1 className="mt-1 text-2xl font-extrabold text-[#111113] sm:text-3xl">
          Selamat bertugas, {dashboard.mentor.name}
        </h1>
        <p className="mt-1 text-sm text-[#52525B]">
          Pantau antrean tugas peserta, progres penyelesaian pertemuan, dan akses cepat pengelolaan
          kurikulum.
        </p>
      </div>

      {/* 4 KPI Cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Metrik Utama">
        <div className="mac-glass-card p-5">
          <Users size={20} weight="duotone" className="text-[#52525B]" />
          <p className="mt-4 font-mono text-[11px] font-semibold tracking-wider text-[#8E8E93] uppercase">
            Total Peserta
          </p>
          <p className="mt-1 text-3xl font-extrabold text-[#111113]">{kpis.totalStudents}</p>
        </div>

        <div className="mac-glass-card p-5">
          <Clock size={20} weight="duotone" className="text-[#FF4D00]" />
          <p className="mt-4 font-mono text-[11px] font-semibold tracking-wider text-[#8E8E93] uppercase">
            Menunggu Review
          </p>
          <p className="mt-1 text-3xl font-extrabold text-[#FF4D00]">{kpis.pendingCount}</p>
        </div>

        <div className="mac-glass-card p-5">
          <CheckCircle size={20} weight="duotone" className="text-[#27C93F]" />
          <p className="mt-4 font-mono text-[11px] font-semibold tracking-wider text-[#8E8E93] uppercase">
            Tugas Disetujui
          </p>
          <p className="mt-1 text-3xl font-extrabold text-[#146C24]">{kpis.approvedCount}</p>
        </div>

        <div className="mac-glass-card p-5">
          <TrendUp size={20} weight="duotone" className="text-[#0071E3]" />
          <p className="mt-4 font-mono text-[11px] font-semibold tracking-wider text-[#8E8E93] uppercase">
            Rata-rata Progres
          </p>
          <p className="mt-1 text-3xl font-extrabold text-[#0071E3]">
            {kpis.avgCompletionPercent}%
          </p>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Recent Pending Submissions */}
        <section className="mac-glass-card overflow-hidden lg:col-span-7">
          <div className="flex items-center justify-between border-b border-black/[0.07] px-5 py-4">
            <div>
              <h2 className="text-sm font-extrabold text-[#111113]">
                Kiriman Tugas Menunggu Review
              </h2>
              <p className="text-xs text-[#52525B]">
                Daftar kiriman terbaru yang memerlukan pemeriksaan mentor.
              </p>
            </div>
            <Link
              to="/admin/review"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#0071E3] no-underline hover:underline"
            >
              <span>Buka Antrean</span>
              <ArrowRight size={13} weight="bold" />
            </Link>
          </div>

          {recentPending.length === 0 ? (
            <div className="p-8 text-center">
              <CheckCircle size={32} weight="duotone" className="mx-auto text-[#27C93F]" />
              <p className="mt-2.5 text-sm font-bold text-[#111113]">
                Seluruh tugas sudah diperiksa
              </p>
              <p className="mt-1 text-xs text-[#52525B]">
                Belum ada kiriman baru yang menunggu persetujuan.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-black/[0.06]">
              {recentPending.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 hover:bg-black/[0.02]"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-[#111113] px-2 py-0.5 font-mono text-[10px] font-bold text-white">
                        {item.moduleCode}
                      </span>
                      <p className="truncate text-sm font-bold text-[#111113]">{item.userName}</p>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-[#52525B]">
                      {item.userSchoolOrigin} • {item.moduleTitle}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[11px] text-[#8E8E93]">
                      {new Date(item.submittedAt).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                      })}
                    </span>
                    <Link
                      to="/admin/review"
                      className="rounded-lg border border-black/10 bg-white px-3 py-1.5 text-xs font-bold text-[#111113] no-underline transition hover:border-[#0071E3] hover:text-[#0071E3]"
                    >
                      Periksa
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Quick Links */}
        <section className="space-y-3 lg:col-span-5" aria-label="Pintasan Pengelolaan">
          <Link
            to="/admin/review"
            className="mac-glass-card flex items-start justify-between gap-4 p-5 no-underline transition hover:border-black/20"
          >
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FF4D00]/10 text-[#FF4D00]">
                <CheckSquareOffset size={20} weight="duotone" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-[#111113]">Review Tugas Peserta</h3>
                <p className="mt-1 text-xs leading-relaxed text-[#52525B]">
                  Periksa repositori kode, catatan belajar, dan buka akses modul berikutnya.
                </p>
              </div>
            </div>
            <ArrowRight size={16} weight="bold" className="mt-1 shrink-0 text-[#8E8E93]" />
          </Link>

          <Link
            to="/admin/materi"
            className="mac-glass-card flex items-start justify-between gap-4 p-5 no-underline transition hover:border-black/20"
          >
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0071E3]/10 text-[#0071E3]">
                <BookOpen size={20} weight="duotone" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-[#111113]">Kelola Materi & Slide</h3>
                <p className="mt-1 text-xs leading-relaxed text-[#52525B]">
                  Tambah modul pertemuan, susun urutan slide, dan perbarui instruksi tugas.
                </p>
              </div>
            </div>
            <ArrowRight size={16} weight="bold" className="mt-1 shrink-0 text-[#8E8E93]" />
          </Link>

          <Link
            to="/admin/analitik"
            className="mac-glass-card flex items-start justify-between gap-4 p-5 no-underline transition hover:border-black/20"
          >
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#27C93F]/15 text-[#146C24]">
                <ChartBar size={20} weight="duotone" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-[#111113]">Analitik Peserta</h3>
                <p className="mt-1 text-xs leading-relaxed text-[#52525B]">
                  Amati tren pengumpulan 8 minggu, rasio revisi modul, dan performa individu.
                </p>
              </div>
            </div>
            <ArrowRight size={16} weight="bold" className="mt-1 shrink-0 text-[#8E8E93]" />
          </Link>
        </section>
      </div>
    </div>
  );
}
