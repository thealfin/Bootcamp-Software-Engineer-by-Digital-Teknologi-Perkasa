import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Eye, EyeSlash, WarningCircle } from '@phosphor-icons/react';
import { useBootstrap, useMentorLogin } from '../../lib/api';

export function AdminLoginPage() {
  const { data: bootstrap, isLoading: isBootstrapLoading } = useBootstrap();
  const navigate = useNavigate();
  const mentorLoginMutation = useMentorLogin();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isBootstrapLoading && bootstrap?.user?.role === 'mentor') {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setErrorMessage('Email dan kata sandi wajib diisi.');
      return;
    }

    try {
      await mentorLoginMutation.mutateAsync({
        email: trimmedEmail,
        passcode: password,
      });
      await navigate({ to: '/admin', replace: true });
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Email atau kata sandi salah. Silakan periksa kembali.',
      );
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#F5F5F7] px-4 py-12">
      <div className="mb-8 w-full max-w-md text-center">
        <div className="mb-4 inline-flex items-center justify-center">
          <img
            src="/favicon.svg"
            alt="Logo Digitek Bootcamp"
            className="h-14 w-14 rounded-2xl border border-black/[0.08] bg-white p-2 shadow-xs"
          />
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-[#111113]">
          Panel Pengelola Digitek Bootcamp
        </h1>
        <p className="mt-1.5 text-sm text-[#52525B]">
          Masuk untuk meninjau tugas peserta, memperbarui modul, dan memantau analitik belajar.
        </p>
      </div>

      <div className="mac-glass-card w-full max-w-md p-6 sm:p-8">
        {errorMessage && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-2xl border border-[#FF5F56]/35 bg-[#FF5F56]/10 p-4 text-sm font-medium text-[#B42318]"
          >
            <WarningCircle size={18} weight="bold" className="mt-0.5 shrink-0 text-[#FF5F56]" />
            <span className="flex-1">{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <label
              htmlFor="admin-email"
              className="mb-2 block font-mono text-xs font-semibold tracking-wider text-[#111113] uppercase"
            >
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email pengelola"
              disabled={mentorLoginMutation.isPending}
              className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm text-[#111113] transition outline-none placeholder:text-[#8E8E93] focus:border-[#0071E3] focus:ring-4 focus:ring-[#0071E3]/15 disabled:opacity-60"
            />
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="mb-2 block font-mono text-xs font-semibold tracking-wider text-[#111113] uppercase"
            >
              Kata Sandi
            </label>
            <div className="relative">
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi"
                disabled={mentorLoginMutation.isPending}
                className="w-full rounded-xl border border-black/15 bg-white py-3 pr-28 pl-4 text-sm text-[#111113] transition outline-none placeholder:text-[#8E8E93] focus:border-[#0071E3] focus:ring-4 focus:ring-[#0071E3]/15 disabled:opacity-60"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                className="absolute inset-y-0 right-0 flex cursor-pointer items-center gap-1 pr-3 text-xs font-semibold text-[#52525B] transition hover:text-[#111113]"
              >
                {showPassword ? <EyeSlash size={15} /> : <Eye size={15} />}
                <span>{showPassword ? 'Sembunyikan' : 'Tampilkan'}</span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={mentorLoginMutation.isPending}
            className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#111113] px-4 py-3.5 text-sm font-bold text-white shadow-xs transition-colors hover:bg-[#0071E3] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span>
              {mentorLoginMutation.isPending ? 'Memverifikasi sesi...' : 'Masuk ke Panel Admin'}
            </span>
          </button>
        </form>
      </div>

      <div className="mt-8 flex flex-col items-center gap-3 text-center">
        <p className="max-w-sm font-mono text-xs text-[#8E8E93]">
          Akses terbatas untuk mentor dan pengelola resmi PT. Digital Teknologi Perkasa.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#52525B] transition hover:text-[#111113]"
        >
          <ArrowLeft size={13} weight="bold" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>
    </main>
  );
}
