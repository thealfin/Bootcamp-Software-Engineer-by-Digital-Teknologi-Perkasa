import { Link } from '@tanstack/react-router';
import { SignIn, SignOut, User as UserIcon, UserPlus } from '@phosphor-icons/react';
import { BrandLogo } from '../../components/BrandLogo';
import type { PublicUser } from '../../types/bootcamp';

export type AuthModalTab = 'register' | 'login';

export interface NavbarProps {
  user: PublicUser | null;
  onOpenAuthModal: (tab?: AuthModalTab) => void;
  onLogout: () => void;
}

export function Navbar({ user, onOpenAuthModal, onLogout }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-black/[0.06] bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        {/* Left: Brand + Main Navigation */}
        <div className="flex items-center gap-6">
          <Link to="/" className="group inline-flex items-center text-[#111113] no-underline">
            <BrandLogo />
          </Link>

          <nav aria-label="Navigasi utama" className="hidden items-center gap-1 md:flex">
            <Link
              to="/"
              activeOptions={{ exact: true }}
              className="rounded-full px-3.5 py-1.5 text-sm font-semibold text-[#52525B] no-underline transition-colors hover:bg-black/[0.04] hover:text-[#111113]"
              activeProps={{
                className:
                  'rounded-full px-3.5 py-1.5 text-sm font-semibold bg-[#111113] text-white no-underline',
              }}
            >
              Beranda
            </Link>
            <a
              href="/#silabus"
              className="rounded-full px-3.5 py-1.5 text-sm font-semibold text-[#52525B] no-underline transition-colors hover:bg-black/[0.04] hover:text-[#111113]"
            >
              Silabus
            </a>
            <a
              href="/#roadmap"
              className="rounded-full px-3.5 py-1.5 text-sm font-semibold text-[#52525B] no-underline transition-colors hover:bg-black/[0.04] hover:text-[#111113]"
            >
              Alur Belajar
            </a>
            <Link
              to="/profil-mentor"
              className="rounded-full px-3.5 py-1.5 text-sm font-semibold text-[#52525B] no-underline transition-colors hover:bg-black/[0.04] hover:text-[#111113]"
              activeProps={{
                className:
                  'rounded-full px-3.5 py-1.5 text-sm font-semibold bg-[#111113] text-white no-underline',
              }}
            >
              Profil Mentor
            </Link>
          </nav>
        </div>

        {/* Right: Guest Auth Actions or User Badge + Logout */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          <Link
            to="/profil-mentor"
            className="inline-flex items-center rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold text-[#52525B] no-underline md:hidden"
          >
            Profil Mentor
          </Link>

          {!user ? (
            <>
              <button
                type="button"
                onClick={() => onOpenAuthModal('login')}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-black/12 bg-white px-3.5 py-1.5 text-xs font-semibold text-[#111113] transition-colors hover:border-black/25 hover:bg-black/[0.03] sm:text-sm"
              >
                <SignIn size={15} weight="bold" />
                <span>Masuk</span>
              </button>
              <button
                type="button"
                onClick={() => onOpenAuthModal('register')}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-[#111113] px-4 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#FF4D00] sm:text-sm"
              >
                <UserPlus size={15} weight="bold" />
                <span>Daftar</span>
              </button>
            </>
          ) : (
            <>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#27C93F]/30 bg-[#27C93F]/10 px-3 py-1.5 text-xs font-semibold text-[#111113]">
                <UserIcon size={14} weight="bold" className="text-[#1D8F30]" />
                <span className="max-w-[170px] truncate sm:max-w-[240px]">
                  {user.role === 'user' && user.schoolOrigin
                    ? `${user.name} • ${user.schoolOrigin}`
                    : user.name}
                </span>
              </span>
              <button
                type="button"
                onClick={onLogout}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#FF5F56]/30 bg-[#FF5F56]/10 px-3.5 py-1.5 text-xs font-semibold text-[#B42318] transition-colors hover:bg-[#FF5F56]/20"
              >
                <SignOut size={14} weight="bold" />
                <span>Keluar</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
