import { createContext, useContext, useState } from 'react';
import {
  Link,
  Outlet,
  createRootRouteWithContext,
  createRoute,
  createRouter,
  useRouterState,
  type RouterHistory,
} from '@tanstack/react-router';
import { type QueryClient } from '@tanstack/react-query';
import { CheckCircle, WarningCircle, X } from '@phosphor-icons/react';
import {
  AdminAnalyticsPage,
  AdminLayout,
  AdminLoginPage,
  AdminMaterialsPage,
  AdminOverviewPage,
  AdminParticipantsPage,
  AdminReviewPage,
} from './features/admin';
import {
  AuthModal,
  LandingPage,
  MentorProfilePage,
  Navbar,
  type AuthModalTab,
} from './features/landing';
import { SlidePlayer } from './features/slides';
import { useBootstrap, useLogout } from './lib/api';
import type { PublicUser } from './types/bootcamp';
import './styles/app.css';

export interface RouterContext {
  queryClient: QueryClient;
}

interface ToastMessage {
  id: number;
  tone: 'success' | 'info';
  text: string;
}

interface AuthModalContextValue {
  openAuthModal: (tab?: AuthModalTab) => void;
}

const AuthModalContext = createContext<AuthModalContextValue>({
  openAuthModal: () => {},
});

function RootLayout() {
  const { data: bootstrap } = useBootstrap();
  const logoutMutation = useLogout();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const isFullscreenOrAdmin =
    pathname === '/admin' ||
    pathname.startsWith('/admin/') ||
    pathname.startsWith('/modul/');

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<AuthModalTab>('register');
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = (text: string, tone: ToastMessage['tone'] = 'success') => {
    const id = Date.now();
    setToast({ id, tone, text });
    window.setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 4200);
  };

  const openAuthModal = (tab: AuthModalTab = 'register') => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (user: PublicUser, mode: AuthModalTab) => {
    if (mode === 'register') {
      showToast(`Selamat datang, ${user.name}. Pertemuan 01 sudah dapat dipelajari.`);
    } else {
      showToast(`Berhasil masuk sebagai ${user.name}.`);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      showToast('Anda telah keluar dari sesi peserta.', 'info');
    } catch {
      showToast('Gagal keluar dari sesi. Silakan coba kembali.', 'info');
    }
  };

  return (
    <AuthModalContext.Provider value={{ openAuthModal }}>
      <div className="flex min-h-screen flex-col">
        {!isFullscreenOrAdmin && (
          <Navbar
            user={bootstrap?.user ?? null}
            onOpenAuthModal={openAuthModal}
            onLogout={handleLogout}
          />
        )}

        <main className="flex-1">
          <Outlet />
        </main>

        {!isFullscreenOrAdmin && (
          <AuthModal
            isOpen={authModalOpen}
            initialTab={authModalTab}
            onClose={() => setAuthModalOpen(false)}
            onSuccess={handleAuthSuccess}
          />
        )}

        {toast && (
          <div
            role="status"
            aria-live="polite"
            className={`fixed right-4 z-50 max-w-sm sm:right-6 ${
              isFullscreenOrAdmin ? 'top-4' : 'top-20'
            }`}
          >
            <div className="mac-glass-card flex items-start gap-3 border-black/10 p-3.5 shadow-xl">
              {toast.tone === 'success' ? (
                <CheckCircle size={18} weight="fill" className="mt-0.5 shrink-0 text-[#27C93F]" />
              ) : (
                <WarningCircle size={18} weight="fill" className="mt-0.5 shrink-0 text-[#0071E3]" />
              )}
              <p className="flex-1 text-xs leading-relaxed font-semibold text-[#111113]">
                {toast.text}
              </p>
              <button
                type="button"
                aria-label="Tutup notifikasi"
                onClick={() => setToast(null)}
                className="inline-flex h-5 w-5 cursor-pointer items-center justify-center rounded-full text-[#8E8E93] transition hover:bg-black/5 hover:text-[#111113]"
              >
                <X size={12} weight="bold" />
              </button>
            </div>
          </div>
        )}
      </div>
    </AuthModalContext.Provider>
  );
}

function LandingRouteView() {
  const { openAuthModal } = useContext(AuthModalContext);
  return <LandingPage onOpenAuthModal={openAuthModal} />;
}

function ModuleRouteView() {
  const { slug } = moduleRoute.useParams();
  return <SlidePlayer slug={slug} />;
}

function MentorProfileRouteView() {
  return <MentorProfilePage />;
}

function NotFoundView() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <div className="mac-glass-card p-8 text-center">
        <span className="text-xs font-bold tracking-wider text-[#8E8E93] uppercase">
          404 • Halaman Tidak Ditemukan
        </span>
        <h1 className="mt-3 text-2xl font-extrabold text-[#111113]">Halaman Tidak Tersedia</h1>
        <p className="mt-2 text-sm text-[#52525B]">
          Alamat halaman yang Anda tuju tidak ditemukan di platform Digitek Bootcamp.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#111113] px-5 py-2.5 text-xs font-bold text-white no-underline transition hover:bg-[#FF4D00]"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}

const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingRouteView,
});

const mentorProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profil-mentor',
  component: MentorProfileRouteView,
});

const moduleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/modul/$slug',
  component: ModuleRouteView,
});

const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/login',
  component: AdminLoginPage,
});

const adminLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminLayout,
});

const adminOverviewRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/',
  component: AdminOverviewPage,
});

const adminReviewRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/review',
  component: AdminReviewPage,
});

const adminParticipantsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/peserta',
  component: AdminParticipantsPage,
});

const adminMaterialsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/materi',
  component: AdminMaterialsPage,
});

const adminAnalyticsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/analitik',
  component: AdminAnalyticsPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  mentorProfileRoute,
  moduleRoute,
  adminLoginRoute,
  adminLayoutRoute.addChildren([
    adminOverviewRoute,
    adminReviewRoute,
    adminParticipantsRoute,
    adminMaterialsRoute,
    adminAnalyticsRoute,
  ]),
]);

export function createAppRouter(queryClient: QueryClient, history?: RouterHistory) {
  return createRouter({
    routeTree,
    history,
    context: { queryClient },
    defaultNotFoundComponent: NotFoundView,
  });
}
