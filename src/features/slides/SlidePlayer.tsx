import { useEffect, useRef, useState, type TouchEvent } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, ArrowRight, WarningCircle } from '@phosphor-icons/react';
import gsap from 'gsap';
import { MacTrafficDots } from '../../components/MacTrafficDots';
import { useModuleDetail } from '../../lib/api';
import type { SlideItem } from '../../types/bootcamp';
import { GateSlide } from './GateSlide';
import { SlideLayouts } from './SlideLayouts';

export interface SlidePlayerProps {
  slug: string;
}

function isEditableElement(target: EventTarget | null): boolean {
  if (!target || !(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
  if (target.isContentEditable) return true;
  return Boolean(target.closest('[contenteditable="true"]'));
}

export function SlidePlayer({ slug }: SlidePlayerProps) {
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useModuleDetail(slug);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const slideContainerRef = useRef<HTMLDivElement | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    setCurrentIndex(0);
    setDirection('next');
  }, [slug]);

  useEffect(() => {
    const syncFullscreen = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', syncFullscreen);
    return () => document.removeEventListener('fullscreenchange', syncFullscreen);
  }, []);

  const slides = data?.slides ?? [];
  const isLockedOrGuest = Boolean(data && data.accessLevel !== 'FULL_ACCESS');
  const totalDisplaySlides = data ? (isLockedOrGuest ? slides.length + 1 : slides.length) : 0;

  useEffect(() => {
    if (totalDisplaySlides > 0 && currentIndex >= totalDisplaySlides) {
      setCurrentIndex(totalDisplaySlides - 1);
    }
  }, [totalDisplaySlides, currentIndex]);

  const isGateSlide = Boolean(data && isLockedOrGuest && currentIndex === slides.length);
  const activeSlide: SlideItem | null = !isGateSlide ? (slides[currentIndex] ?? null) : null;

  const handleClose = async () => {
    if (typeof document !== 'undefined' && document.fullscreenElement) {
      await document.exitFullscreen().catch(() => {});
    }
    await navigate({ to: '/' });
  };

  const handleMinimize = async () => {
    if (typeof document !== 'undefined' && document.fullscreenElement) {
      await document.exitFullscreen().catch(() => {});
    }
    setIsMinimized((prev) => !prev);
  };

  const handleFullscreen = async () => {
    setIsMinimized(false);
    if (typeof document === 'undefined') return;
    if (document.fullscreenElement) {
      await document.exitFullscreen().catch(() => {});
    } else if (document.documentElement.requestFullscreen) {
      await document.documentElement.requestFullscreen().catch(() => {});
    }
  };

  const handleNext = () => {
    if (currentIndex < totalDisplaySlides - 1) {
      setDirection('next');
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection('prev');
      setCurrentIndex((prev) => prev - 1);
    }
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (isEditableElement(document.activeElement) || isEditableElement(event.target)) {
        return;
      }

      if (event.key === 'ArrowRight' || event.key === ' ' || event.key === 'ArrowDown') {
        event.preventDefault();
        if (currentIndex < totalDisplaySlides - 1) {
          setDirection('next');
          setCurrentIndex((prev) => prev + 1);
        }
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        event.preventDefault();
        if (currentIndex > 0) {
          setDirection('prev');
          setCurrentIndex((prev) => prev - 1);
        }
      } else if (event.key === 'Escape') {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        }
        if (isMinimized) {
          setIsMinimized(false);
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [currentIndex, totalDisplaySlides, isMinimized]);

  // GSAP slide transition & child card stagger
  useEffect(() => {
    scrollContainerRef.current?.scrollTo({ top: 0 });
    const el = slideContainerRef.current;
    if (!el || !data || typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { autoAlpha: 0, y: direction === 'next' ? 22 : -22, scale: 0.985 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.55,
          ease: 'expo.out',
          clearProps: 'transform',
        },
      );

      const cards = el.querySelectorAll('.slide-stagger');
      if (cards.length > 0) {
        gsap.fromTo(
          cards,
          { y: 14, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            stagger: 0.04,
            duration: 0.4,
            ease: 'power2.out',
            clearProps: 'transform',
          },
        );
      }
    }, el);

    return () => ctx.revert();
  }, [currentIndex, slug, isGateSlide, Boolean(data)]);

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    if (!touch) return;
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    if (!start) return;
    const touch = event.changedTouches[0];
    if (!touch) return;

    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    if (absX > 60 && absX > absY * 1.5) {
      if (deltaX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  const progressPercent =
    totalDisplaySlides > 0 ? Math.round(((currentIndex + 1) / totalDisplaySlides) * 100) : 0;

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative h-screen w-screen overflow-hidden bg-[#F6F6F4]"
      style={{
        backgroundImage:
          'radial-gradient(56rem 36rem at 12% 0%, rgba(255, 77, 0, 0.06), transparent 65%), radial-gradient(52rem 34rem at 88% 8%, rgba(0, 113, 227, 0.06), transparent 65%)',
      }}
    >
      {/* Top-Left Floating Glass Pill: 3 Interactive Dots + Minimal Exit */}
      <div className="floating-glass-pill fixed top-4 left-4 z-50 flex items-center gap-2.5 px-3.5 py-2">
        <MacTrafficDots
          onClose={handleClose}
          onMinimize={handleMinimize}
          onFullscreen={handleFullscreen}
          isFullscreen={isFullscreen}
          isMinimized={isMinimized}
        />
        <span aria-hidden="true" className="h-3.5 w-px bg-black/10" />
        <button
          type="button"
          onClick={handleClose}
          className="inline-flex cursor-pointer items-center gap-1 rounded-full px-1.5 py-0.5 text-xs font-semibold text-[#52525B] transition hover:bg-black/[0.05] hover:text-[#111113]"
        >
          <ArrowLeft size={13} weight="bold" />
          <span>Keluar</span>
        </button>
      </div>

      {/* Fullscreen or Minimized Slide Window */}
      <div
        className={
          isMinimized
            ? 'mx-auto my-[9vh] h-[82vh] w-[calc(100%-2rem)] max-w-5xl overflow-hidden rounded-3xl border border-black/10 bg-white/90 shadow-2xl backdrop-blur-xl transition-all duration-300'
            : 'h-full w-full transition-all duration-300'
        }
      >
        <div
          ref={scrollContainerRef}
          className={`flex h-full w-full flex-col overflow-y-auto pb-24 ${
            isMinimized
              ? 'px-5 pt-14 sm:px-10 sm:pt-12'
              : 'px-5 pt-20 sm:px-10 md:px-16 lg:px-20'
          }`}
        >
          <div ref={slideContainerRef} className="mx-auto my-auto w-full max-w-5xl py-4">
            {isLoading ? (
              <div className="space-y-5">
                <div className="h-6 w-36 animate-pulse rounded-full bg-black/10" />
                <div className="h-12 w-3/4 animate-pulse rounded-2xl bg-black/10" />
                <div className="h-5 w-2/3 animate-pulse rounded-full bg-black/10" />
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="h-44 animate-pulse rounded-2xl bg-black/[0.06]" />
                  <div className="h-44 animate-pulse rounded-2xl bg-black/[0.06]" />
                </div>
              </div>
            ) : isError || !data ? (
              <div className="mx-auto max-w-lg text-center">
                <div className="bento-mac-card p-8">
                  <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF5F56]/15 text-[#B42318]">
                    <WarningCircle size={26} weight="duotone" />
                  </div>
                  <h1 className="mt-4 text-xl font-extrabold text-[#111113] sm:text-2xl">
                    Materi Tidak Ditemukan
                  </h1>
                  <p className="mt-2 text-sm text-[#52525B]">
                    {error instanceof Error
                      ? error.message
                      : `Materi dengan kode "${slug}" tidak tersedia.`}
                  </p>
                  <Link
                    to="/"
                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#111113] px-5 py-2.5 text-xs font-bold text-white no-underline transition hover:bg-[#FF4D00]"
                  >
                    <ArrowLeft size={14} weight="bold" />
                    Kembali ke Beranda
                  </Link>
                </div>
              </div>
            ) : isGateSlide ? (
              <GateSlide data={data} />
            ) : activeSlide ? (
              <SlideLayouts data={data} slide={activeSlide} />
            ) : null}
          </div>
        </div>
      </div>

      {/* Bottom-Center Floating Navigation Pill */}
      {totalDisplaySlides > 0 && (
        <nav
          id="nav-pill"
          aria-label="Navigasi slide"
          className="floating-glass-pill fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 px-2.5 py-1.5 sm:gap-3.5 sm:px-3"
        >
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            aria-label="Slide sebelumnya"
            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-black/10 bg-white text-[#111113] transition hover:bg-black/[0.05] disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ArrowLeft size={15} weight="bold" />
          </button>

          <span className="font-mono text-xs font-semibold tabular-nums text-[#111113]">
            {String(currentIndex + 1).padStart(2, '0')} /{' '}
            {String(totalDisplaySlides).padStart(2, '0')}
          </span>

          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-black/10 sm:w-32">
            <div
              className="h-full rounded-full bg-[#FF4D00] transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <button
            type="button"
            onClick={handleNext}
            disabled={currentIndex >= totalDisplaySlides - 1}
            aria-label="Slide berikutnya"
            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#111113] text-white transition hover:bg-[#FF4D00] disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ArrowRight size={15} weight="bold" />
          </button>
        </nav>
      )}
    </div>
  );
}
