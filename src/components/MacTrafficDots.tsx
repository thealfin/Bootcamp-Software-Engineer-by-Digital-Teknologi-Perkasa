export type MacTrafficDotsVariant = 'window-bar' | 'card-corner' | 'code-header' | 'compact';

export interface MacTrafficDotsProps {
  variant?: MacTrafficDotsVariant;
  className?: string;
  onClose?: () => void;
  onMinimize?: () => void;
  onFullscreen?: () => void;
  isFullscreen?: boolean;
  isMinimized?: boolean;
}

const VARIANT_CLASSES: Record<MacTrafficDotsVariant, { wrapper: string; dot: string }> = {
  'window-bar': {
    wrapper: 'gap-2',
    dot: 'h-3 w-3',
  },
  'card-corner': {
    wrapper: 'gap-1.5',
    dot: 'h-2.5 w-2.5',
  },
  'code-header': {
    wrapper: 'gap-1.5',
    dot: 'h-2.5 w-2.5 opacity-95',
  },
  compact: {
    wrapper: 'gap-1',
    dot: 'h-2 w-2',
  },
};

export function MacTrafficDots({
  variant = 'window-bar',
  className = '',
  onClose,
  onMinimize,
  onFullscreen,
  isFullscreen = false,
  isMinimized = false,
}: MacTrafficDotsProps) {
  const isInteractive = Boolean(onClose || onMinimize || onFullscreen);

  if (!isInteractive) {
    const styles = VARIANT_CLASSES[variant];
    return (
      <span
        aria-hidden="true"
        className={`inline-flex shrink-0 items-center ${styles.wrapper} ${className}`.trim()}
      >
        <span
          className={`inline-block rounded-full bg-[#FF5F56] ring-1 ring-inset ring-black/15 ${styles.dot}`}
        />
        <span
          className={`inline-block rounded-full bg-[#FFBD2E] ring-1 ring-inset ring-black/15 ${styles.dot}`}
        />
        <span
          className={`inline-block rounded-full bg-[#27C93F] ring-1 ring-inset ring-black/15 ${styles.dot}`}
        />
      </span>
    );
  }

  const dotBaseClass =
    "relative inline-flex h-3.5 w-3.5 cursor-pointer items-center justify-center rounded-full ring-1 ring-inset ring-black/15 transition-transform active:scale-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0071E3] before:absolute before:-inset-1 before:content-['']";

  const iconVisibilityClass =
    'h-2 w-2 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100';

  return (
    <div
      role="group"
      aria-label="Kontrol tampilan slide"
      className={`group inline-flex shrink-0 items-center gap-2 ${className}`.trim()}
    >
      <button
        type="button"
        aria-label="Keluar dari slide"
        title="Keluar dari slide"
        onClick={onClose}
        className={`${dotBaseClass} bg-[#FF5F56]`}
      >
        <svg
          viewBox="0 0 8 8"
          aria-hidden="true"
          className={`${iconVisibilityClass} text-[#4C0002]`}
        >
          <path
            d="M1.8 1.8L6.2 6.2M6.2 1.8L1.8 6.2"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <button
        type="button"
        aria-label="Kecilkan tampilan slide"
        title={isMinimized ? 'Kembalikan ukuran tampilan' : 'Kecilkan tampilan slide'}
        onClick={onMinimize}
        className={`${dotBaseClass} bg-[#FFBD2E]`}
      >
        <svg
          viewBox="0 0 8 8"
          aria-hidden="true"
          className={`${iconVisibilityClass} text-[#5C3C00]`}
        >
          <path
            d="M1.6 4H6.4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <button
        type="button"
        aria-label="Layar penuh"
        title={isFullscreen ? 'Keluar dari layar penuh' : 'Layar penuh'}
        onClick={onFullscreen}
        className={`${dotBaseClass} bg-[#27C93F]`}
      >
        <svg
          viewBox="0 0 8 8"
          aria-hidden="true"
          className={`${iconVisibilityClass} text-[#0B4614]`}
        >
          {isFullscreen ? (
            <path
              d="M6.4 1.6L4.6 3.4M4.6 1.8V3.4H6.2M1.6 6.4L3.4 4.6M3.4 6.2V4.6H1.8"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.35"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : (
            <path
              d="M4.7 1.6H6.4V3.3M3.3 6.4H1.6V4.7M6.2 1.8L4.6 3.4M1.8 6.2L3.4 4.6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.35"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </svg>
      </button>
    </div>
  );
}
