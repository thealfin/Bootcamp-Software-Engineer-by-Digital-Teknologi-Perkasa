import { useState } from 'react';
import { Navigate, Outlet } from '@tanstack/react-router';
import { List } from '@phosphor-icons/react';
import { useBootstrap, useMentorDashboard } from '../../lib/api';
import { AdminSidebar } from './AdminSidebar';

export function AdminLayout() {
  const { data: bootstrap, isLoading } = useBootstrap();
  const user = bootstrap?.user ?? null;
  const isMentor = user?.role === 'mentor';

  const { data: dashboard } = useMentorDashboard(Boolean(isMentor));
  const [mobileOpen, setMobileOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-[#F5F5F7]">
        <div className="hidden w-72 shrink-0 border-r border-black/[0.08] bg-white/80 p-5 lg:block">
          <div className="h-10 w-44 animate-pulse rounded-xl bg-black/[0.06]" />
          <div className="mt-8 space-y-2.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="h-9 animate-pulse rounded-xl bg-black/[0.05]" />
            ))}
          </div>
        </div>
        <div className="flex-1 p-6 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-6">
            <div className="h-10 w-64 animate-pulse rounded-xl bg-black/[0.06]" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="mac-glass-card h-28 animate-pulse" />
              ))}
            </div>
            <div className="mac-glass-card h-80 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'mentor') {
    return <Navigate to="/admin/login" replace />;
  }

  const pendingCount = dashboard?.kpis.pendingCount ?? bootstrap?.stats.pendingReviews ?? 0;

  return (
    <div className="flex min-h-screen bg-[#F5F5F7] text-[#111113]">
      <AdminSidebar
        user={user}
        pendingCount={pendingCount}
        isOpenMobile={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile Header */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-black/[0.08] bg-white/90 px-4 py-3 backdrop-blur-md lg:hidden">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Buka navigasi admin"
              className="cursor-pointer rounded-xl border border-black/10 bg-white p-2 text-[#111113] hover:bg-black/[0.04]"
            >
              <List size={18} weight="bold" />
            </button>
            <div className="flex items-center gap-2">
              <img src="/favicon.svg" alt="Digitek Admin" className="h-7 w-7 rounded-lg" />
              <span className="text-sm font-extrabold text-[#111113]">Digitek Admin</span>
            </div>
          </div>

          {pendingCount > 0 && (
            <span className="rounded-full bg-[#FF4D00] px-2.5 py-0.5 font-mono text-[11px] font-bold text-white">
              {pendingCount} tugas menunggu
            </span>
          )}
        </header>

        <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
