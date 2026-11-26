import { useMemo, useState, type ComponentType } from 'react';
import { Link } from '@tanstack/react-router';
import {
  ArrowDown,
  ArrowRight,
  Atom,
  BookOpen,
  BracketsCurly,
  Briefcase,
  Browsers,
  CheckCircle,
  ClipboardText,
  Clock,
  CloudArrowUp,
  Code,
  Compass,
  Cpu,
  Database,
  Eye,
  FileCode,
  GitBranch,
  Globe,
  GraduationCap,
  HardDrives,
  Layout,
  Lightning,
  Lock,
  LockOpen,
  PlugsConnected,
  RocketLaunch,
  Sparkle,
  Stack,
  Terminal,
  Trophy,
  WarningCircle,
  Wrench,
} from '@phosphor-icons/react';
import { useBootstrap } from '../../lib/api';
import type { ModuleSummaryCard } from '../../types/bootcamp';
import type { AuthModalTab } from './Navbar';

export interface LandingPageProps {
  onOpenAuthModal: (tab?: AuthModalTab) => void;
}

type FilterKey = 'all' | 'month1' | 'month2' | 'month3' | 'hub';

const FILTER_TABS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'Semua' },
  { key: 'month1', label: 'Bulan 1 • Front-End' },
  { key: 'month2', label: 'Bulan 2 • Back-End & SQL' },
  { key: 'month3', label: 'Bulan 3 • Vue, TS & Nuxt' },
  { key: 'hub', label: 'Panduan & Pustaka' },
];

type PhosphorIconComponent = ComponentType<{
  size?: number;
  weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';
  className?: string;
}>;

const ICON_MAP: Record<string, PhosphorIconComponent> = {
  compass: Compass,
  globe: Globe,
  layout: Layout,
  browsers: Browsers,
  code: Code,
  filecode: FileCode,
  bracketscurly: BracketsCurly,
  gitbranch: GitBranch,
  database: Database,
  harddrives: HardDrives,
  server: HardDrives,
  terminal: Terminal,
  rocketlaunch: RocketLaunch,
  rocket: RocketLaunch,
  bookopen: BookOpen,
  sparkle: Sparkle,
  cpu: Cpu,
  stack: Stack,
  atom: Atom,
  plugsconnected: PlugsConnected,
  wrench: Wrench,
  cloudarrowup: CloudArrowUp,
  lightning: Lightning,
  graduationcap: GraduationCap,
  trophy: Trophy,
  briefcase: Briefcase,
};

function renderModuleIcon(iconName: string, isMuted = false) {
  const normalized = iconName.replace(/[^a-zA-Z]/g, '').toLowerCase();
  const IconComp = ICON_MAP[normalized] ?? Code;
  return (
    <IconComp
      size={20}
      weight="duotone"
      className={isMuted ? 'text-gray-400' : 'text-[#111113]'}
    />
  );
}

function getUnlockedStatusBadge(mod: ModuleSummaryCard) {
  if (mod.accessLevel === 'SUMMARY_ONLY') {
    return {
      label: 'Pratinjau 3 Slide',
      shortLabel: 'Pratinjau',
      className: 'border-[#FFBD2E]/45 bg-[#FFBD2E]/15 text-[#7A5600]',
      icon: <Eye size={13} weight="bold" />,
    };
  }
  if (mod.accessLevel === 'LOCKED_PREV_TASK') {
    return {
      label: 'Terkunci',
      shortLabel: 'Terkunci',
      className: 'border-gray-200 bg-gray-100 text-gray-500',
      icon: <Lock size={12} weight="fill" />,
    };
  }
  if (mod.submissionStatus === 'approved') {
    return {
      label: 'Tugas Di-ACC',
      shortLabel: 'Di-ACC',
      className: 'border-[#27C93F]/40 bg-[#27C93F]/15 text-[#146C24]',
      icon: <CheckCircle size={13} weight="fill" />,
    };
  }
  if (mod.submissionStatus === 'pending') {
    return {
      label: 'Menunggu Review',
      shortLabel: 'Menunggu',
      className: 'border-[#0071E3]/30 bg-[#0071E3]/12 text-[#005BB8]',
      icon: <Clock size={13} weight="bold" />,
    };
  }
  if (mod.submissionStatus === 'revision') {
    return {
      label: 'Perlu Revisi',
      shortLabel: 'Revisi',
      className: 'border-[#FF5F56]/40 bg-[#FF5F56]/15 text-[#B42318]',
      icon: <WarningCircle size={13} weight="bold" />,
    };
  }
  return {
    label: 'Terbuka',
    shortLabel: 'Terbuka',
    className: 'border-[#27C93F]/35 bg-[#27C93F]/12 text-[#146C24]',
    icon: <LockOpen size={13} weight="bold" />,
  };
}

const ROADMAP_MONTHS = [
  {
    month: 'Bulan 1',
    period: 'Pertemuan 01 – 05',
    title: 'Fondasi Front-End & Alur Kerja Git',
    color: 'from-[#FF4D00] to-[#FF8A3D]',
    taskFlow: 'TaskFlow tahap awal: Aplikasi daftar tugas interaktif dengan JavaScript dan localStorage',
    internFlow: 'InternFlow tahap awal: Halaman profil dan dasbor responsif berbasis Flexbox dan Grid',
    topics: ['HTTP & Cara Kerja Web', 'HTML5 Semantik', 'CSS3 Flexbox & Grid', 'DOM & Event', 'Git & Pull Request'],
  },
  {
    month: 'Bulan 2',
    period: 'Pertemuan 06 – 10',
    title: 'Back-End Node.js, REST API & MySQL',
    color: 'from-[#0071E3] to-[#38BDF8]',
    taskFlow: 'TaskFlow tahap lanjutan: Layanan REST API Express dan MySQL yang terhubung ke antarmuka web',
    internFlow: 'InternFlow tahap lanjutan: API jurnal harian dan manajemen tugas dengan relasi tabel SQL',
    topics: ['Node.js & npm', 'Routing Express.js', 'Metode & Status HTTP', 'Kueri CRUD & JOIN', 'Pengujian API'],
  },
  {
    month: 'Bulan 3',
    period: 'Pertemuan 11 – 15',
    title: 'Vite, Vue 3, TypeScript & Nuxt',
    color: 'from-[#27C93F] to-[#10B981]',
    taskFlow: 'TaskFlow versi penuh: Aplikasi web utuh menggunakan Nuxt, TypeScript, dan basis data daring',
    internFlow: 'InternFlow versi penuh: Portal magang terintegrasi dengan Nuxt Nitro dan rilis produksi',
    topics: ['Vite & Modul Modern', 'Komponen Vue 3', 'Tipe Data TypeScript', 'Server API Nuxt', 'Rilis ke Cloud'],
  },
];

const EVALUATION_RUBRIC = [
  { label: 'Proyek & Tugas Praktik', weight: '40%', bar: 'w-[40%] bg-[#FF4D00]' },
  { label: 'Kuis & Pemahaman Konsep', weight: '30%', bar: 'w-[30%] bg-[#0071E3]' },
  { label: 'Presentasi & Tinjauan Kode', weight: '20%', bar: 'w-[20%] bg-[#27C93F]' },
  { label: 'Kerapian Git & Catatan Belajar', weight: '10%', bar: 'w-[10%] bg-[#111113]' },
];

const GRADING_SCALE = [
  { range: '90 – 100', grade: 'Sangat Baik (A)', badge: 'bg-[#27C93F]/15 text-[#146C24]' },
  { range: '80 – 89', grade: 'Baik (B+)', badge: 'bg-[#0071E3]/15 text-[#005BB8]' },
  { range: '70 – 79', grade: 'Lulus Standar (B)', badge: 'bg-[#FFBD2E]/20 text-[#7A5600]' },
  { range: '60 – 69', grade: 'Perlu Pendampingan (C)', badge: 'bg-[#FF4D00]/15 text-[#C23B00]' },
  { range: '< 60', grade: 'Klinik Proyek & Perbaikan', badge: 'bg-[#FF5F56]/15 text-[#B42318]' },
];

export function LandingPage({ onOpenAuthModal }: LandingPageProps) {
  const { data, isLoading, isError, error, refetch } = useBootstrap();
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  const filteredModules = useMemo(() => {
    const modules = data?.modules ?? [];
    switch (activeFilter) {
      case 'month1':
        return modules.filter((m) => m.month === 1);
      case 'month2':
        return modules.filter((m) => m.month === 2);
      case 'month3':
        return modules.filter((m) => m.month === 3);
      case 'hub':
        return modules.filter((m) => m.month === 0 || m.orderIndex === 0 || m.orderIndex === 16);
      default:
        return modules;
    }
  }, [data?.modules, activeFilter]);

  const formalModules = useMemo(() => {
    return (data?.modules ?? []).filter(
      (m) => m.orderIndex >= 1 && m.slug !== 'pustaka-learning-hub',
    );
  }, [data?.modules]);

  const studentProgress = useMemo(() => {
    const approvedCount = formalModules.filter((m) => m.submissionStatus === 'approved').length;
    const pendingCount = formalModules.filter((m) => m.submissionStatus === 'pending').length;
    const revisionCount = formalModules.filter((m) => m.submissionStatus === 'revision').length;
    const nextUnlocked = formalModules.find(
      (m) => m.accessLevel === 'FULL_ACCESS' && m.submissionStatus !== 'approved',
    );
    const totalFormal = formalModules.length || 15;
    const percent = Math.round((approvedCount / totalFormal) * 100);
    return { approvedCount, pendingCount, revisionCount, totalFormal, percent, nextUnlocked };
  }, [formalModules]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mac-glass-card animate-pulse p-10">
          <div className="h-6 w-48 rounded-full bg-black/10" />
          <div className="mt-5 h-14 w-3/4 rounded-2xl bg-black/10" />
          <div className="mt-4 h-5 w-1/2 rounded-xl bg-black/10" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <div className="mac-glass-card p-8 text-center">
          <WarningCircle size={40} weight="duotone" className="mx-auto text-[#FF5F56]" />
          <h2 className="mt-3 text-xl font-extrabold text-[#111113]">
            Data Materi Belum Dapat Dimuat
          </h2>
          <p className="mt-2 text-sm text-[#52525B]">
            {error instanceof Error ? error.message : 'Terjadi kendala jaringan saat memuat halaman.'}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#111113] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#FF4D00]"
          >
            Muat Ulang Halaman
          </button>
        </div>
      </div>
    );
  }

  const { user, stats } = data;
  const isRegisteredStudent = user?.role === 'user';

  return (
    <div className="scroll-smooth">
      {/* SECTION 1: FULL-HEIGHT LANDING HERO (Above the Fold) */}
      <section
        aria-label="Beranda Digitek Bootcamp"
        className="mx-auto flex min-h-[calc(100vh-76px)] max-w-6xl flex-col justify-between px-4 py-10 sm:px-6 sm:py-14 lg:px-8"
      >
        <div className="my-auto flex flex-col items-center text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FF4D00]/10 px-3.5 py-1.5 text-xs font-bold tracking-wider text-[#FF4D00] uppercase">
              <Sparkle size={14} weight="fill" />
              PT Digital Teknologi Perkasa
            </span>
            <span className="inline-flex items-center rounded-full border border-black/10 bg-white/90 px-3.5 py-1.5 text-xs font-semibold text-[#52525B]">
              30% Konsep • 70% Praktik Terbimbing
            </span>
          </div>

          <h1 className="mt-6 max-w-4xl text-4xl font-extrabold leading-[1.06] tracking-tight text-[#111113] sm:text-6xl">
            Kurikulum Software Engineering{' '}
            <span className="text-[#FF4D00]">3 Bulan</span> untuk Peserta PKL dan Magang
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#52525B] sm:text-xl">
            Pelajari pengembangan aplikasi web dari HTML, CSS, dan Node.js hingga Nuxt serta
            TypeScript melalui slide ringkas. Kerjakan tugas bertahap di setiap pertemuan untuk
            membuka materi berikutnya setelah di-ACC mentor.
          </p>

          {/* Primary CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {!user ? (
              <button
                type="button"
                onClick={() => onOpenAuthModal('register')}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#111113] px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#FF4D00]"
              >
                <span>Daftar dan Mulai Pertemuan 01</span>
                <ArrowRight size={16} weight="bold" />
              </button>
            ) : isRegisteredStudent && studentProgress.nextUnlocked ? (
              <Link
                to="/modul/$slug"
                params={{ slug: studentProgress.nextUnlocked.slug }}
                className="inline-flex items-center gap-2 rounded-full bg-[#111113] px-6 py-3.5 text-sm font-bold text-white no-underline shadow-md transition-all hover:bg-[#FF4D00]"
              >
                <span>
                  Lanjutkan {studentProgress.nextUnlocked.code}:{' '}
                  {studentProgress.nextUnlocked.title}
                </span>
                <ArrowRight size={16} weight="bold" />
              </Link>
            ) : null}

            <a
              href="#silabus"
              className="inline-flex items-center gap-2 rounded-full border border-black/12 bg-white/90 px-6 py-3.5 text-sm font-bold text-[#111113] no-underline shadow-2xs transition-colors hover:border-black/25 hover:bg-white"
            >
              <span>Lihat Silabus Materi</span>
              <ArrowDown size={15} weight="bold" />
            </a>
          </div>

          {/* Key Highlights Strip */}
          <div className="mt-12 grid w-full max-w-4xl gap-3 sm:grid-cols-4">
            <div className="mac-glass-card px-4 py-4 text-left">
              <p className="text-[11px] font-bold tracking-wider text-[#8E8E93] uppercase">
                Durasi Belajar
              </p>
              <p className="mt-1 text-xl font-extrabold text-[#111113]">3 Bulan</p>
              <p className="text-xs text-[#52525B]">12 minggu terjadwal</p>
            </div>
            <div className="mac-glass-card px-4 py-4 text-left">
              <p className="text-[11px] font-bold tracking-wider text-[#8E8E93] uppercase">
                Struktur Materi
              </p>
              <p className="mt-1 text-xl font-extrabold text-[#111113]">
                {stats.formalMeetings} Pertemuan
              </p>
              <p className="text-xs text-[#52525B]">Ditambah panduan dan pustaka</p>
            </div>
            <div className="mac-glass-card px-4 py-4 text-left">
              <p className="text-[11px] font-bold tracking-wider text-[#8E8E93] uppercase">
                Proyek Utama
              </p>
              <p className="mt-1 text-xl font-extrabold text-[#FF4D00]">TaskFlow</p>
              <p className="text-xs text-[#52525B]">dan InternFlow (bertahap)</p>
            </div>
            <div className="mac-glass-card px-4 py-4 text-left">
              <p className="text-[11px] font-bold tracking-wider text-[#8E8E93] uppercase">
                {isRegisteredStudent ? 'Progres Tugas' : 'Peserta Aktif'}
              </p>
              <p className="mt-1 text-xl font-extrabold text-[#146C24]">
                {isRegisteredStudent
                  ? `${studentProgress.approvedCount}/${studentProgress.totalFormal} Di-ACC`
                  : `${stats.totalStudents} Peserta`}
              </p>
              <p className="text-xs text-[#52525B]">
                {isRegisteredStudent
                  ? `${studentProgress.percent}% materi tuntas`
                  : `${stats.approvedReviews} tugas di-ACC`}
              </p>
            </div>
          </div>
        </div>

        {/* Scroll Cue */}
        <div className="mt-8 flex justify-center">
          <a
            href="#silabus"
            className="inline-flex items-center gap-2 text-xs font-bold tracking-wider text-[#8E8E93] uppercase no-underline transition-colors hover:text-[#111113]"
          >
            <span>Gulir ke silabus materi</span>
            <ArrowDown size={14} weight="bold" className="animate-bounce" />
          </a>
        </div>
      </section>

      {/* SECTION 2: SILABUS MATERI (+ STICKY DAFTAR TUGAS SIDEBAR FOR REGISTERED STUDENTS) */}
      <section
        id="silabus"
        aria-labelledby="silabus-heading"
        className="mx-auto max-w-7xl scroll-mt-20 border-t border-black/[0.06] px-4 py-14 sm:px-6 lg:px-8"
      >
        {!user && (
          <div className="mb-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-black/10 bg-white/85 px-5 py-4 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#FFBD2E]/25 text-[#7A5600]">
                <Eye size={18} weight="bold" />
              </span>
              <div>
                <p className="text-sm font-bold text-[#111113]">
                  Akses Tamu: Pratinjau 3 Slide Ringkasan
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-[#52525B] sm:text-sm">
                  Modul Panduan, Pertemuan 01, dan Pustaka terbuka untuk dilihat. Daftar atau masuk
                  akun peserta untuk membuka slide lengkap dan mengumpulkan tugas praktik.
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => onOpenAuthModal('login')}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-black/12 bg-white px-4 py-2 text-xs font-bold text-[#111113] transition-colors hover:border-black/25 sm:text-sm"
              >
                <span>Masuk</span>
              </button>
              <button
                type="button"
                onClick={() => onOpenAuthModal('register')}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#111113] px-4 py-2 text-xs font-bold text-white shadow-xs transition-colors hover:bg-[#FF4D00] sm:text-sm"
              >
                <span>Daftar Peserta</span>
                <ArrowRight size={15} weight="bold" />
              </button>
            </div>
          </div>
        )}

        {/* Section Header + Filter Tabs */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="text-xs font-bold tracking-widest text-[#FF4D00] uppercase">
              Silabus Kurikulum
            </span>
            <h2
              id="silabus-heading"
              className="mt-1 text-2xl font-extrabold text-[#111113] sm:text-3xl"
            >
              Materi Pertemuan dan Slide Belajar
            </h2>
          </div>

          <div
            role="tablist"
            aria-label="Filter modul berdasarkan bulan"
            className="flex flex-wrap gap-2"
          >
            {FILTER_TABS.map((tab) => {
              const isActive = activeFilter === tab.key;
              return (
                <button
                  key={tab.key}
                  role="tab"
                  aria-selected={isActive}
                  type="button"
                  onClick={() => setActiveFilter(tab.key)}
                  className={`cursor-pointer rounded-full px-4 py-2 text-xs font-bold transition-all sm:text-sm ${
                    isActive
                      ? 'bg-[#111113] text-white shadow-sm'
                      : 'border border-black/10 bg-white/80 text-[#52525B] hover:border-black/20 hover:text-[#111113]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content Layout: 2-Column with Sticky Daftar Tugas Sidebar when Student is Logged In */}
        <div
          className={`mt-8 ${
            isRegisteredStudent ? 'grid items-start gap-8 lg:grid-cols-[1fr_340px]' : ''
          }`}
        >
          {/* Syllabus Cards Grid */}
          <div
            className={`grid gap-5 ${
              isRegisteredStudent ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'
            }`}
          >
            {filteredModules.map((mod) => {
              const isVisuallyLocked = isRegisteredStudent
                ? mod.accessLevel === 'LOCKED_PREV_TASK'
                : !user
                  ? mod.orderIndex >= 2 && mod.slug !== 'pustaka-learning-hub'
                  : false;

              const isFullAccess = mod.accessLevel === 'FULL_ACCESS';
              const statusBadge = getUnlockedStatusBadge(mod);
              const visibleSlideCount = isFullAccess ? mod.totalSlides : mod.summarySlides;

              return (
                <Link
                  key={mod.id}
                  to="/modul/$slug"
                  params={{ slug: mod.slug }}
                  className={`catalog-mac-card group overflow-hidden p-5 no-underline ${
                    isVisuallyLocked
                      ? 'locked bg-[#F4F4F5]/90 opacity-65 grayscale-[35%]'
                      : ''
                  }`}
                >
                  {/* Top Row: Module Code & Session Type */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 font-mono text-[11px] font-bold ${
                        isVisuallyLocked
                          ? 'bg-gray-200/90 text-gray-500'
                          : 'bg-[#111113] text-white'
                      }`}
                    >
                      {mod.code}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                        isVisuallyLocked
                          ? 'bg-gray-100 text-gray-500'
                          : 'bg-black/[0.05] text-[#52525B]'
                      }`}
                    >
                      {mod.sessionType}
                    </span>
                  </div>

                  {/* Icon + Title */}
                  <div className="mt-4 flex items-start gap-3.5">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${
                        isVisuallyLocked
                          ? 'border-gray-200/80 bg-gray-100 text-gray-400'
                          : 'border-black/[0.08] bg-[#F5F5F7] shadow-2xs transition-transform duration-300 group-hover:scale-105'
                      }`}
                    >
                      {renderModuleIcon(mod.iconName, isVisuallyLocked)}
                    </div>
                    <div className="min-w-0">
                      <h3
                        className={`text-base font-extrabold leading-snug ${
                          isVisuallyLocked
                            ? 'text-gray-500'
                            : 'text-[#111113] transition-colors group-hover:text-[#FF4D00]'
                        }`}
                      >
                        {mod.title}
                      </h3>
                      <p
                        className={`mt-0.5 text-xs font-medium ${
                          isVisuallyLocked ? 'text-gray-400' : 'text-[#8E8E93]'
                        }`}
                      >
                        {mod.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Summary */}
                  <p
                    className={`mt-3 line-clamp-3 flex-1 text-sm leading-relaxed ${
                      isVisuallyLocked ? 'text-gray-500' : 'text-[#52525B]'
                    }`}
                  >
                    {mod.summaryText}
                  </p>

                  {/* Footer Badge & Slide Count */}
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-black/[0.06] pt-3.5">
                    {isVisuallyLocked ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-bold tracking-wider text-gray-500 uppercase">
                        <Lock size={12} weight="fill" />
                        <span>Terkunci</span>
                      </span>
                    ) : (
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${statusBadge.className}`}
                      >
                        {statusBadge.icon}
                        <span>{statusBadge.label}</span>
                      </span>
                    )}

                    <span
                      className={`font-mono text-xs font-bold ${
                        isVisuallyLocked ? 'text-gray-400' : 'text-[#52525B]'
                      }`}
                    >
                      {isVisuallyLocked
                        ? `${mod.totalSlides} Slide`
                        : `${visibleSlideCount}/${mod.totalSlides} Slide`}
                    </span>
                  </div>

                  {!isVisuallyLocked && (
                    <div
                      className={`pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r opacity-75 transition-opacity group-hover:opacity-100 ${
                        mod.accentGradient || 'from-[#FF4D00] to-[#0071E3]'
                      }`}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Sticky Sidebar: Daftar Tugas */}
          {isRegisteredStudent && (
            <aside
              aria-label="Daftar Tugas"
              className="mac-glass-card overflow-hidden lg:sticky lg:top-24"
            >
              <div className="border-b border-black/[0.07] bg-black/[0.02] p-5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[#FF4D00]/12 text-[#FF4D00]">
                      <ClipboardText size={16} weight="bold" />
                    </span>
                    <div>
                      <h3 className="text-sm font-extrabold text-[#111113]">Daftar Tugas</h3>
                      <p className="text-[11px] font-medium text-[#52525B]">
                        {user.name} • {user.schoolOrigin}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-extrabold text-[#FF4D00]">
                    {studentProgress.percent}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mt-3.5 h-2 w-full overflow-hidden rounded-full bg-black/[0.06]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#FF4D00] to-[#27C93F] transition-all duration-500"
                    style={{ width: `${studentProgress.percent}%` }}
                  />
                </div>
                <div className="mt-2.5 flex items-center justify-between text-[11px] font-semibold text-[#52525B]">
                  <span>{studentProgress.approvedCount} Di-ACC</span>
                  <span>{studentProgress.pendingCount} Menunggu</span>
                  <span>{studentProgress.revisionCount} Revisi</span>
                </div>
              </div>

              {/* Registered Task Items */}
              <div className="max-h-[540px] divide-y divide-black/[0.05] overflow-y-auto">
                {formalModules.map((mod) => {
                  const badge = getUnlockedStatusBadge(mod);
                  const isLocked = mod.accessLevel === 'LOCKED_PREV_TASK';
                  return (
                    <Link
                      key={mod.id}
                      to="/modul/$slug"
                      params={{ slug: mod.slug }}
                      className={`block px-4 py-3 no-underline transition-colors hover:bg-black/[0.025] ${
                        isLocked ? 'opacity-60' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`font-mono text-[11px] font-extrabold ${
                                isLocked ? 'text-gray-500' : 'text-[#111113]'
                              }`}
                            >
                              {mod.code}
                            </span>
                            <span
                              className={`truncate text-xs font-bold ${
                                isLocked ? 'text-gray-500' : 'text-[#111113]'
                              }`}
                            >
                              {mod.title}
                            </span>
                          </div>
                          <p className="mt-0.5 line-clamp-1 text-[11px] text-[#52525B]">
                            {mod.taskPrompt}
                          </p>
                        </div>
                        <span
                          className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold ${badge.className}`}
                        >
                          {badge.icon}
                          <span>{badge.shortLabel}</span>
                        </span>
                      </div>

                      {mod.submissionStatus === 'revision' && mod.mentorFeedback && (
                        <p className="mt-1.5 rounded-lg bg-[#FF5F56]/10 px-2.5 py-1 text-[11px] font-medium text-[#B42318]">
                          Catatan: {mod.mentorFeedback}
                        </p>
                      )}
                    </Link>
                  );
                })}
              </div>
            </aside>
          )}
        </div>
      </section>

      {/* SECTION 3: ALUR BELAJAR 3 BULAN & EVALUASI */}
      <section
        id="roadmap"
        className="mx-auto max-w-7xl scroll-mt-20 px-4 pt-4 pb-16 sm:px-6 lg:px-8"
      >
        <div className="mac-glass-card overflow-hidden p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/[0.07] pb-5">
            <div>
              <span className="text-[11px] font-bold tracking-widest text-[#FF4D00] uppercase">
                Alur Belajar &amp; Evaluasi
              </span>
              <h2 className="mt-0.5 text-2xl font-extrabold text-[#111113] sm:text-3xl">
                Tahapan Proyek 3 Bulan: TaskFlow &amp; InternFlow
              </h2>
            </div>
            <span className="rounded-full bg-[#111113] px-3.5 py-1.5 text-xs font-bold text-white">
              15 Pertemuan • 15 Tugas Praktik
            </span>
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            {ROADMAP_MONTHS.map((item) => (
              <div key={item.month} className="bento-mac-card relative overflow-hidden p-5">
                <div className={`h-1.5 w-16 rounded-full bg-gradient-to-r ${item.color}`} />
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs font-extrabold tracking-wider text-[#8E8E93] uppercase">
                    {item.month}
                  </span>
                  <span className="font-mono text-xs font-bold text-[#111113]">{item.period}</span>
                </div>
                <h3 className="mt-1.5 text-lg font-extrabold text-[#111113]">{item.title}</h3>

                <div className="mt-4 space-y-2.5 text-xs">
                  <div className="rounded-xl bg-[#F5F5F7] p-3">
                    <p className="font-bold text-[#FF4D00]">{item.taskFlow}</p>
                  </div>
                  <div className="rounded-xl bg-[#F5F5F7] p-3">
                    <p className="font-bold text-[#0071E3]">{item.internFlow}</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {item.topics.map((topic) => (
                    <span
                      key={topic}
                      className="rounded-full border border-black/10 bg-white px-2.5 py-0.5 text-[11px] font-semibold text-[#52525B]"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Evaluation Rubric & Grading Scale */}
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="bento-mac-card p-5 sm:p-6">
              <h3 className="text-lg font-extrabold text-[#111113]">Komposisi Penilaian</h3>
              <p className="mt-1 text-xs leading-relaxed text-[#52525B]">
                Nilai akhir dihitung dari konsistensi pengerjaan tugas praktik, penguasaan konsep,
                presentasi proyek, dan kerapian riwayat Git.
              </p>

              <div className="mt-5 space-y-4">
                {EVALUATION_RUBRIC.map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between text-xs font-bold text-[#111113]">
                      <span>{item.label}</span>
                      <span className="font-mono">{item.weight}</span>
                    </div>
                    <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-[#F5F5F7]">
                      <div className={`h-full rounded-full ${item.bar}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bento-mac-card p-5 sm:p-6">
              <h3 className="text-lg font-extrabold text-[#111113]">
                Rentang Nilai dan Standar Lulus
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-[#52525B]">
                Peserta dinyatakan lulus apabila mencapai nilai minimal 70 dan seluruh tugas
                pertemuan telah di-ACC oleh mentor.
              </p>

              <div className="mt-4 space-y-2.5">
                {GRADING_SCALE.map((scale) => (
                  <div
                    key={scale.range}
                    className="flex items-center justify-between rounded-xl border border-black/[0.06] bg-[#F5F5F7]/70 px-3.5 py-2.5"
                  >
                    <span className="font-mono text-xs font-extrabold text-[#111113]">
                      {scale.range}
                    </span>
                    <span
                      className={`rounded-full px-3 py-0.5 text-xs font-bold ${scale.badge}`}
                    >
                      {scale.grade}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
