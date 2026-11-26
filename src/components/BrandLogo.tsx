export interface BrandLogoProps {
  subtitle?: string;
  showSubtitle?: boolean;
  className?: string;
}

export function BrandLogo({
  subtitle = 'Software Engineering',
  showSubtitle = true,
  className = '',
}: BrandLogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`.trim()}>
      <img
        src="/favicon.svg"
        alt="Digitek Bootcamp"
        width={36}
        height={36}
        className="h-9 w-9 shrink-0 rounded-xl object-contain shadow-xs transition-transform duration-200 group-hover:scale-[1.03]"
      />
      <span className="flex flex-col leading-tight">
        <span className="text-sm font-extrabold tracking-tight text-[#111113] sm:text-base">
          Digitek <span className="text-[#FF4D00]">Bootcamp</span>
        </span>
        {showSubtitle && (
          <span className="text-[11px] font-semibold tracking-wider text-[#8E8E93] uppercase">
            {subtitle}
          </span>
        )}
      </span>
    </span>
  );
}
