import { useState, type FormEvent } from 'react';
import { Link } from '@tanstack/react-router';
import {
  ArrowLeft,
  Clock,
  Eye,
  EyeSlash,
  Lock,
  SignIn,
  UserPlus,
  WarningCircle,
} from '@phosphor-icons/react';
import { useRegister, useStudentLogin } from '../../lib/api';
import type { ModuleDetailResponse } from '../../types/bootcamp';

export interface GateSlideProps {
  data: ModuleDetailResponse;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function GateSlide({ data }: GateSlideProps) {
  const { accessLevel, module, prevModule, totalSlidesCount, summarySlidesCount } = data;
  const remainingSlides = Math.max(0, totalSlidesCount - summarySlidesCount);

  const registerMutation = useRegister();
  const loginMutation = useStudentLogin();

  const [authTab, setAuthTab] = useState<'register' | 'login'>('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [schoolOrigin, setSchoolOrigin] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const switchTab = (nextTab: 'register' | 'login') => {
    setAuthTab(nextTab);
    setErrorMessage(null);
  };

  const handleRegisterSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedSchool = schoolOrigin.trim();

    if (trimmedName.length < 2) {
      setErrorMessage('Nama lengkap minimal 2 karakter.');
      return;
    }
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setErrorMessage('Masukkan format alamat email yang valid.');
      return;
    }
    if (trimmedSchool.length < 2) {
      setErrorMessage('Asal sekolah atau kampus wajib diisi.');
      return;
    }
    if (password.length < 8) {
      setErrorMessage('Kata sandi minimal 8 karakter.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Konfirmasi kata sandi tidak sesuai.');
      return;
    }

    try {
      await registerMutation.mutateAsync({
        name: trimmedName,
        email: trimmedEmail,
        schoolOrigin: trimmedSchool,
        password,
      });
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Pendaftaran belum berhasil. Silakan coba kembali.',
      );
    }
  };

  const handleLoginSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    const trimmedEmail = email.trim();
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setErrorMessage('Masukkan format alamat email yang valid.');
      return;
    }
    if (!password) {
      setErrorMessage('Kata sandi wajib diisi.');
      return;
    }

    try {
      await loginMutation.mutateAsync({
        email: trimmedEmail,
        password,
      });
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Gagal masuk ke akun peserta. Periksa email dan kata sandi Anda.',
      );
    }
  };

  if (accessLevel === 'SUMMARY_ONLY') {
    const isSubmitting = registerMutation.isPending || loginMutation.isPending;

    return (
      <div className="mx-auto w-full max-w-lg py-2">
        <div className="slide-stagger bento-mac-card p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold tracking-wider text-[#FF4D00] uppercase">
              Akses Materi • {module.code}
            </span>
            <span className="rounded-full bg-[#FFBD2E]/20 px-2.5 py-0.5 text-[11px] font-bold text-[#8A5A00]">
              +{remainingSlides} slide lanjutan
            </span>
          </div>

          <h2 className="mt-3 text-2xl font-extrabold text-[#111113] sm:text-3xl">
            Buka Materi Lengkap {module.code}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#52525B]">
            Anda telah membaca {summarySlidesCount} slide ringkasan. Daftar atau masuk sebagai
            peserta untuk mempelajari seluruh materi dan mengumpulkan tugas.
          </p>

          <div
            role="tablist"
            aria-label="Pilihan autentikasi peserta"
            className="mt-5 grid grid-cols-2 gap-1.5 rounded-xl bg-black/[0.05] p-1"
          >
            <button
              type="button"
              role="tab"
              aria-selected={authTab === 'register'}
              onClick={() => switchTab('register')}
              className={`inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition ${
                authTab === 'register'
                  ? 'bg-white text-[#111113] shadow-2xs'
                  : 'text-[#52525B] hover:text-[#111113]'
              }`}
            >
              <UserPlus size={14} weight="bold" />
              Daftar Peserta
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={authTab === 'login'}
              onClick={() => switchTab('login')}
              className={`inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition ${
                authTab === 'login'
                  ? 'bg-white text-[#111113] shadow-2xs'
                  : 'text-[#52525B] hover:text-[#111113]'
              }`}
            >
              <SignIn size={14} weight="bold" />
              Masuk Peserta
            </button>
          </div>

          {authTab === 'register' ? (
            <form onSubmit={handleRegisterSubmit} className="mt-5 space-y-3.5">
              <div>
                <label
                  htmlFor="gate-register-name"
                  className="mb-1 block text-xs font-bold text-[#111113]"
                >
                  Nama Lengkap
                </label>
                <input
                  id="gate-register-name"
                  type="text"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama lengkap sesuai identitas"
                  className="w-full rounded-xl border border-black/12 bg-white px-3.5 py-2.5 text-sm text-[#111113] outline-none transition focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20"
                />
              </div>

              <div>
                <label
                  htmlFor="gate-register-email"
                  className="mb-1 block text-xs font-bold text-[#111113]"
                >
                  Email Aktif
                </label>
                <input
                  id="gate-register-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@sekolah.sch.id"
                  className="w-full rounded-xl border border-black/12 bg-white px-3.5 py-2.5 text-sm text-[#111113] outline-none transition focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20"
                />
              </div>

              <div>
                <label
                  htmlFor="gate-register-school"
                  className="mb-1 block text-xs font-bold text-[#111113]"
                >
                  Asal Sekolah atau Kampus
                </label>
                <input
                  id="gate-register-school"
                  type="text"
                  required
                  value={schoolOrigin}
                  onChange={(e) => setSchoolOrigin(e.target.value)}
                  placeholder="Contoh: SMKN 1 Bandar Lampung"
                  className="w-full rounded-xl border border-black/12 bg-white px-3.5 py-2.5 text-sm text-[#111113] outline-none transition focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="gate-register-password"
                    className="mb-1 block text-xs font-bold text-[#111113]"
                  >
                    Kata Sandi
                  </label>
                  <div className="relative">
                    <input
                      id="gate-register-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={8}
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimal 8 karakter"
                      className="w-full rounded-xl border border-black/12 bg-white py-2.5 pr-9 pl-3.5 text-sm text-[#111113] outline-none transition focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20"
                    />
                    <button
                      type="button"
                      aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute top-1/2 right-2.5 -translate-y-1/2 cursor-pointer text-[#8E8E93] hover:text-[#111113]"
                    >
                      {showPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="gate-register-confirm"
                    className="mb-1 block text-xs font-bold text-[#111113]"
                  >
                    Konfirmasi Kata Sandi
                  </label>
                  <input
                    id="gate-register-confirm"
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi kata sandi"
                    className="w-full rounded-xl border border-black/12 bg-white px-3.5 py-2.5 text-sm text-[#111113] outline-none transition focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20"
                  />
                </div>
              </div>

              {errorMessage && (
                <div className="flex items-start gap-2 rounded-xl border border-[#FF5F56]/35 bg-[#FF5F56]/10 p-3 text-xs font-medium text-[#B42318]">
                  <WarningCircle size={16} weight="fill" className="mt-0.5 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#FF4D00] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#E04300] disabled:opacity-60"
              >
                {registerMutation.isPending ? 'Memproses pendaftaran...' : 'Daftar dan Buka Materi'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleLoginSubmit} className="mt-5 space-y-3.5">
              <div>
                <label
                  htmlFor="gate-login-email"
                  className="mb-1 block text-xs font-bold text-[#111113]"
                >
                  Email Peserta
                </label>
                <input
                  id="gate-login-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@sekolah.sch.id"
                  className="w-full rounded-xl border border-black/12 bg-white px-3.5 py-2.5 text-sm text-[#111113] outline-none transition focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20"
                />
              </div>

              <div>
                <label
                  htmlFor="gate-login-password"
                  className="mb-1 block text-xs font-bold text-[#111113]"
                >
                  Kata Sandi
                </label>
                <div className="relative">
                  <input
                    id="gate-login-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi akun"
                    className="w-full rounded-xl border border-black/12 bg-white py-2.5 pr-9 pl-3.5 text-sm text-[#111113] outline-none transition focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute top-1/2 right-2.5 -translate-y-1/2 cursor-pointer text-[#8E8E93] hover:text-[#111113]"
                  >
                    {showPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {errorMessage && (
                <div className="flex items-start gap-2 rounded-xl border border-[#FF5F56]/35 bg-[#FF5F56]/10 p-3 text-xs font-medium text-[#B42318]">
                  <WarningCircle size={16} weight="fill" className="mt-0.5 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#111113] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#FF4D00] disabled:opacity-60"
              >
                {loginMutation.isPending ? 'Memverifikasi akun...' : 'Masuk ke Materi'}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  const prevStatusLabel = (() => {
    if (!prevModule?.submissionStatus) return 'Belum Mengumpulkan Tugas';
    if (prevModule.submissionStatus === 'pending') return 'Menunggu Tinjauan';
    if (prevModule.submissionStatus === 'revision') return 'Perlu Revisi';
    return 'Disetujui (Di-ACC)';
  })();

  const prevStatusPillClass =
    prevModule?.submissionStatus === 'pending'
      ? 'border-[#0071E3]/30 bg-[#0071E3]/10 text-[#005BB8]'
      : prevModule?.submissionStatus === 'revision'
        ? 'border-[#FF5F56]/35 bg-[#FF5F56]/12 text-[#B42318]'
        : 'border-[#FFBD2E]/50 bg-[#FFBD2E]/20 text-[#8A5A00]';

  return (
    <div className="mx-auto w-full max-w-lg py-4">
      <div className="slide-stagger bento-mac-card p-6 sm:p-8">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-bold tracking-wider text-[#B42318] uppercase">
            Akses Bertahap • {module.code}
          </span>
          <span className="rounded-full bg-black/[0.05] px-2.5 py-0.5 text-[11px] font-bold text-[#52525B]">
            +{remainingSlides} slide terkunci
          </span>
        </div>

        <div className="mt-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FF5F56]/12 text-[#B42318]">
          <Lock size={22} weight="duotone" />
        </div>

        <h2 className="mt-3 text-2xl font-extrabold text-[#111113] sm:text-3xl">
          Materi {module.code} Belum Terbuka
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[#52525B]">
          Seluruh slide pada <strong>{module.code}</strong> akan terbuka otomatis setelah tugas pada{' '}
          <strong>
            {prevModule ? `${prevModule.code} (${prevModule.title})` : 'pertemuan sebelumnya'}
          </strong>{' '}
          diselesaikan dan di-ACC.
        </p>

        {prevModule && (
          <div className="mt-5 rounded-2xl border border-black/[0.08] bg-black/[0.025] p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-[#111113]">
                {prevModule.code}: {prevModule.title}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${prevStatusPillClass}`}
              >
                {prevModule.submissionStatus === 'pending' ? (
                  <Clock size={12} weight="bold" />
                ) : (
                  <WarningCircle size={12} weight="bold" />
                )}
                {prevStatusLabel}
              </span>
            </div>

            {prevModule.mentorFeedback && (
              <div className="mt-3 rounded-xl border border-[#FF5F56]/25 bg-white p-3">
                <p className="text-[11px] font-bold tracking-wider text-[#B42318] uppercase">
                  Catatan Peninjau
                </p>
                <p className="mt-1 text-xs leading-relaxed text-[#111113]">
                  {prevModule.mentorFeedback}
                </p>
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              <Link
                to="/modul/$slug"
                params={{ slug: prevModule.slug }}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#111113] px-4 py-2 text-xs font-bold text-white no-underline transition hover:bg-[#FF4D00]"
              >
                <ArrowLeft size={13} weight="bold" />
                Buka Materi {prevModule.code}
              </Link>
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 rounded-full border border-black/12 bg-white px-4 py-2 text-xs font-semibold text-[#111113] no-underline transition hover:bg-black/[0.04]"
              >
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
