import { useEffect, useState, type FormEvent } from 'react';
import {
  ArrowRight,
  Eye,
  EyeSlash,
  SignIn,
  UserPlus,
  WarningCircle,
  X,
} from '@phosphor-icons/react';
import { MacTrafficDots } from '../../components/MacTrafficDots';
import { useRegister, useStudentLogin } from '../../lib/api';
import type { PublicUser } from '../../types/bootcamp';
import type { AuthModalTab } from './Navbar';

export interface AuthModalProps {
  isOpen: boolean;
  initialTab?: AuthModalTab;
  onClose: () => void;
  onSuccess?: (user: PublicUser, mode: AuthModalTab) => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AuthModal({
  isOpen,
  initialTab = 'register',
  onClose,
  onSuccess,
}: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<AuthModalTab>(initialTab);

  // Register state
  const [name, setName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [schoolOrigin, setSchoolOrigin] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const registerMutation = useRegister();
  const loginMutation = useStudentLogin();

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setRegisterError(null);
      setLoginError(null);
    }
  }, [isOpen, initialTab]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleRegisterSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setRegisterError(null);

    const trimmedName = name.trim();
    const trimmedEmail = registerEmail.trim();
    const trimmedSchool = schoolOrigin.trim();

    if (trimmedName.length < 2) {
      setRegisterError('Nama lengkap minimal 2 karakter.');
      return;
    }
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setRegisterError('Masukkan format alamat email yang valid.');
      return;
    }
    if (trimmedSchool.length < 2) {
      setRegisterError('Asal sekolah atau kampus wajib diisi.');
      return;
    }
    if (registerPassword.length < 8) {
      setRegisterError('Kata sandi minimal 8 karakter.');
      return;
    }
    if (registerPassword !== confirmPassword) {
      setRegisterError('Ulangi kata sandi harus sama dengan kata sandi.');
      return;
    }

    try {
      const result = await registerMutation.mutateAsync({
        name: trimmedName,
        email: trimmedEmail,
        schoolOrigin: trimmedSchool,
        password: registerPassword,
      });
      setRegisterPassword('');
      setConfirmPassword('');
      onSuccess?.(result.user, 'register');
      onClose();
    } catch (error) {
      setRegisterError(
        error instanceof Error ? error.message : 'Pendaftaran belum berhasil. Silakan coba lagi.',
      );
    }
  };

  const handleLoginSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginError(null);

    const trimmedEmail = loginEmail.trim();

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setLoginError('Masukkan format alamat email yang valid.');
      return;
    }
    if (!loginPassword) {
      setLoginError('Kata sandi wajib diisi.');
      return;
    }

    try {
      const result = await loginMutation.mutateAsync({
        email: trimmedEmail,
        password: loginPassword,
      });
      setLoginPassword('');
      onSuccess?.(result.user, 'login');
      onClose();
    } catch (error) {
      setLoginError(
        error instanceof Error ? error.message : 'Email atau kata sandi tidak sesuai.',
      );
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#111113]/45 p-4 backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="mac-glass-card slide-fade-up max-h-[92vh] w-full max-w-lg overflow-y-auto bg-white/95">
        {/* Modal Header: the ONLY place in landing with 3-dot window bar */}
        <div className="flex items-center justify-between border-b border-black/[0.07] bg-black/[0.02] px-5 py-3.5">
          <div className="flex items-center gap-3">
            <MacTrafficDots variant="window-bar" />
            <span
              id="auth-modal-title"
              className="text-xs font-bold tracking-wider text-[#52525B] uppercase"
            >
              {activeTab === 'register' ? 'Daftar Akun Peserta' : 'Masuk Peserta'}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup jendela akun"
            className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-[#52525B] transition-colors hover:bg-black/[0.07] hover:text-[#111113]"
          >
            <X size={16} weight="bold" />
          </button>
        </div>

        <div className="p-6">
          {/* Tab Switcher */}
          <div className="mb-6 grid grid-cols-2 gap-1.5 rounded-2xl bg-[#F5F5F7] p-1.5">
            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                setRegisterError(null);
              }}
              className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition-all sm:text-sm ${
                activeTab === 'register'
                  ? 'bg-white text-[#111113] shadow-xs'
                  : 'text-[#52525B] hover:text-[#111113]'
              }`}
            >
              <UserPlus size={16} weight="bold" />
              <span>Daftar Akun Peserta</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setLoginError(null);
              }}
              className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition-all sm:text-sm ${
                activeTab === 'login'
                  ? 'bg-white text-[#111113] shadow-xs'
                  : 'text-[#52525B] hover:text-[#111113]'
              }`}
            >
              <SignIn size={16} weight="bold" />
              <span>Masuk Peserta</span>
            </button>
          </div>

          {activeTab === 'register' ? (
            <form onSubmit={handleRegisterSubmit} noValidate className="space-y-4">
              <div>
                <h3 className="text-xl font-extrabold text-[#111113]">
                  Buat Akun Peserta Bootcamp
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-[#52525B]">
                  Isi data diri untuk membuka materi Pertemuan 01 secara penuh dan mengumpulkan
                  tugas praktik.
                </p>
              </div>

              {registerError && (
                <div
                  role="alert"
                  className="flex items-start gap-2.5 rounded-xl border border-[#FF5F56]/35 bg-[#FF5F56]/10 px-3.5 py-2.5 text-sm font-medium text-[#B42318]"
                >
                  <WarningCircle size={18} weight="bold" className="mt-0.5 shrink-0" />
                  <span>{registerError}</span>
                </div>
              )}

              <div>
                <label
                  htmlFor="reg-name"
                  className="mb-1.5 block text-xs font-bold tracking-wider text-[#52525B] uppercase"
                >
                  Nama Lengkap
                </label>
                <input
                  id="reg-name"
                  type="text"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full rounded-xl border border-black/15 bg-white px-3.5 py-2.5 text-sm text-[#111113] outline-none transition-all placeholder:text-[#8E8E93] focus:border-[#0071E3] focus:ring-4 focus:ring-[#0071E3]/15"
                />
              </div>

              <div>
                <label
                  htmlFor="reg-email"
                  className="mb-1.5 block text-xs font-bold tracking-wider text-[#52525B] uppercase"
                >
                  Email
                </label>
                <input
                  id="reg-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  placeholder="budi@smkn1lampung.sch.id"
                  className="w-full rounded-xl border border-black/15 bg-white px-3.5 py-2.5 text-sm text-[#111113] outline-none transition-all placeholder:text-[#8E8E93] focus:border-[#0071E3] focus:ring-4 focus:ring-[#0071E3]/15"
                />
              </div>

              <div>
                <label
                  htmlFor="reg-school"
                  className="mb-1.5 block text-xs font-bold tracking-wider text-[#52525B] uppercase"
                >
                  Asal Sekolah / Kampus
                </label>
                <input
                  id="reg-school"
                  type="text"
                  required
                  value={schoolOrigin}
                  onChange={(e) => setSchoolOrigin(e.target.value)}
                  placeholder="Contoh: SMKN 1 Bandar Lampung"
                  className="w-full rounded-xl border border-black/15 bg-white px-3.5 py-2.5 text-sm text-[#111113] outline-none transition-all placeholder:text-[#8E8E93] focus:border-[#0071E3] focus:ring-4 focus:ring-[#0071E3]/15"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="reg-password"
                    className="mb-1.5 block text-xs font-bold tracking-wider text-[#52525B] uppercase"
                  >
                    Kata Sandi
                  </label>
                  <div className="relative">
                    <input
                      id="reg-password"
                      type={showRegisterPassword ? 'text' : 'password'}
                      required
                      minLength={8}
                      autoComplete="new-password"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      placeholder="Minimal 8 karakter"
                      className="w-full rounded-xl border border-black/15 bg-white py-2.5 pr-10 pl-3.5 text-sm text-[#111113] outline-none transition-all placeholder:text-[#8E8E93] focus:border-[#0071E3] focus:ring-4 focus:ring-[#0071E3]/15"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegisterPassword((prev) => !prev)}
                      aria-label={
                        showRegisterPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'
                      }
                      className="absolute top-1/2 right-2.5 inline-flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-[#8E8E93] transition-colors hover:bg-black/5 hover:text-[#111113]"
                    >
                      {showRegisterPassword ? (
                        <EyeSlash size={16} weight="bold" />
                      ) : (
                        <Eye size={16} weight="bold" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="reg-confirm-password"
                    className="mb-1.5 block text-xs font-bold tracking-wider text-[#52525B] uppercase"
                  >
                    Ulangi Kata Sandi
                  </label>
                  <div className="relative">
                    <input
                      id="reg-confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      minLength={8}
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Ketik ulang sandi"
                      className="w-full rounded-xl border border-black/15 bg-white py-2.5 pr-10 pl-3.5 text-sm text-[#111113] outline-none transition-all placeholder:text-[#8E8E93] focus:border-[#0071E3] focus:ring-4 focus:ring-[#0071E3]/15"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      aria-label={
                        showConfirmPassword
                          ? 'Sembunyikan konfirmasi kata sandi'
                          : 'Tampilkan konfirmasi kata sandi'
                      }
                      className="absolute top-1/2 right-2.5 inline-flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-[#8E8E93] transition-colors hover:bg-black/5 hover:text-[#111113]"
                    >
                      {showConfirmPassword ? (
                        <EyeSlash size={16} weight="bold" />
                      ) : (
                        <Eye size={16} weight="bold" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={registerMutation.isPending}
                className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#111113] px-4 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#FF4D00] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span>
                  {registerMutation.isPending
                    ? 'Memproses Pendaftaran...'
                    : 'Daftar dan Buka Pertemuan 01'}
                </span>
                <ArrowRight size={16} weight="bold" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleLoginSubmit} noValidate className="space-y-4">
              <div>
                <h3 className="text-xl font-extrabold text-[#111113]">Masuk ke Akun Peserta</h3>
                <p className="mt-1 text-sm leading-relaxed text-[#52525B]">
                  Gunakan email dan kata sandi terdaftar untuk melanjutkan materi serta memantau
                  status tugas.
                </p>
              </div>

              {loginError && (
                <div
                  role="alert"
                  className="flex items-start gap-2.5 rounded-xl border border-[#FF5F56]/35 bg-[#FF5F56]/10 px-3.5 py-2.5 text-sm font-medium text-[#B42318]"
                >
                  <WarningCircle size={18} weight="bold" className="mt-0.5 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label
                  htmlFor="login-email"
                  className="mb-1.5 block text-xs font-bold tracking-wider text-[#52525B] uppercase"
                >
                  Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="budi@smkn1lampung.sch.id"
                  className="w-full rounded-xl border border-black/15 bg-white px-3.5 py-2.5 text-sm text-[#111113] outline-none transition-all placeholder:text-[#8E8E93] focus:border-[#0071E3] focus:ring-4 focus:ring-[#0071E3]/15"
                />
              </div>

              <div>
                <label
                  htmlFor="login-password"
                  className="mb-1.5 block text-xs font-bold tracking-wider text-[#52525B] uppercase"
                >
                  Kata Sandi
                </label>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Masukkan kata sandi"
                    className="w-full rounded-xl border border-black/15 bg-white py-2.5 pr-10 pl-3.5 text-sm text-[#111113] outline-none transition-all placeholder:text-[#8E8E93] focus:border-[#0071E3] focus:ring-4 focus:ring-[#0071E3]/15"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword((prev) => !prev)}
                    aria-label={
                      showLoginPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'
                    }
                    className="absolute top-1/2 right-2.5 inline-flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-[#8E8E93] transition-colors hover:bg-black/5 hover:text-[#111113]"
                  >
                    {showLoginPassword ? (
                      <EyeSlash size={16} weight="bold" />
                    ) : (
                      <Eye size={16} weight="bold" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#111113] px-4 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#FF4D00] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span>{loginMutation.isPending ? 'Memproses...' : 'Masuk ke Akun'}</span>
                <ArrowRight size={16} weight="bold" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
