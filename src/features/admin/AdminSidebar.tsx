import { Link, useNavigate, useRouterState } from '@tanstack/react-router';
import {
  ArrowSquareOut,
  BookOpen,
  ChartBar,
  CheckSquareOffset,
  SignOut,
  SquaresFour,
  Users,
  X,
} from '@phosphor-icons/react';
import { useLogout } from '../../lib/api';
import type { PublicUser } from '../../types/bootcamp';

export interface AdminSidebarProps {
  user: PublicUser;
  pendingCount: number;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export function AdminSidebar({
  user,
  pendingCount,
  isOpenMobile,
  onCloseMobile,
}: AdminSidebarProps) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const navigate = useNavigate();
  const logoutMutation = useLogout();

  const navItems = [
    {
      to: '/admin',
      label: 'Ringkasan',
      icon: SquaresFour,
      exact: true,
      badge: 0,
    },
    {
      to: '/admin/review',
      label: 'Review Tugas',
      icon: CheckSquareOffset,
      exact: false,
      badge: pendingCount,
    },
    {
      to: '/admin/peserta',
      label: 'Data Peserta',
      icon: Users,
      exact: false,
      badge: 0,
    },
    {
      to: '/admin/materi',
      label: 'Materi & Slide',
      icon: BookOpen,
      exact: false,
      badge: 0,
    },
    {
      to: '/admin/analitik',
      label: 'Analitik Peserta',
      icon: ChartBar,
      exact: false,
      badge: 0,
    },
  ] as const;

  const isActive = (to: string, exact: boolean) => {
    const normalized = pathname.replace(/\/+$/, '') || '/';
    if (exact) {
      return normalized === to;
    }
    return normalized === to || normalized.startsWith(`${to}/`);
  };

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } finally {
      onCloseMobile();
      await navigate({ to: '/admin/login', replace: true });
    }
  };

  return (
    <>
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-30 bg-black/35 backdrop-blur-xs lg:hidden"
          aria-hidden="true"
          onClick={onCloseMobile}
        />
      )}

      <aside
        aria-label="Navigasi Panel Admin Digitek"
        className={`fixed top-0 left-0 z-40 flex h-screen w-72 shrink-0 flex-col border-r border-black/[0.08] bg-white/95 text-[#111113] backdrop-blur-xl transition-transform duration-200 ease-out lg:sticky lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-black/[0.08] px-5 py-5">
          <Link
            to="/admin"
            onClick={onCloseMobile}
            className="inline-flex items-center gap-3 text-left no-underline"
          >
            <img
              src="/favicon.svg"
              alt="Digitek Admin"
              className="h-9 w-9 shrink-0 rounded-xl border border-black/[0.08] bg-[#F5F5F7] p-1"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold tracking-tight text-[#111113]">
                Digitek Admin
              </p>
              <p className="truncate text-[11px] font-medium text-[#52525B]">
                Panel Pengelola Bootcamp
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Tutup navigasi samping"
            className="cursor-pointer rounded-lg p-1.5 text-[#52525B] hover:bg-black/[0.05] hover:text-[#111113] lg:hidden"
          >
            <X size={18} weight="bold" />
          </button>
        </div>

        {/* Navigation List */}
        <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-3 py-5">
          <div>
            <p className="mb-2 px-3 font-mono text-[11px] font-semibold tracking-wider text-[#8E8E93] uppercase">
              Menu Manajemen
            </p>
            <ul className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.to, item.exact);
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      onClick={onCloseMobile}
                      className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold no-underline transition-all ${
                        active
                          ? 'bg-[#111113] text-white shadow-2xs'
                          : 'text-[#52525B] hover:bg-black/[0.04] hover:text-[#111113]'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon
                          size={17}
                          weight={active ? 'fill' : 'duotone'}
                          className={active ? 'text-[#FF4D00]' : 'text-[#52525B]'}
                        />
                        <span>{item.label}</span>
                      </span>
                      {item.badge > 0 && (
                        <span className="rounded-full bg-[#FF4D00] px-2 py-0.5 font-mono text-[10px] font-bold text-white">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <p className="mb-2 px-3 font-mono text-[11px] font-semibold tracking-wider text-[#8E8E93] uppercase">
              Pintasan Situs
            </p>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold text-[#52525B] no-underline transition-colors hover:bg-black/[0.04] hover:text-[#111113]"
            >
              <span className="flex items-center gap-2.5">
                <ArrowSquareOut size={17} weight="duotone" className="text-[#0071E3]" />
                <span>Buka Website Publik</span>
              </span>
            </a>
          </div>
        </div>

        {/* Admin User Footer */}
        <div className="border-t border-black/[0.08] bg-[#F5F5F7]/70 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-[#111113]">{user.name}</p>
              <p className="truncate font-mono text-[10px] font-semibold tracking-wider text-[#0071E3] uppercase">
                LEAD MENTOR
              </p>
            </div>

            <button
              type="button"
              disabled={logoutMutation.isPending}
              onClick={handleLogout}
              title="Keluar dari sesi pengelola"
              className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-bold text-[#B42318] transition hover:border-[#FF5F56]/40 hover:bg-[#FF5F56]/10 disabled:opacity-60"
            >
              <SignOut size={14} weight="bold" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
