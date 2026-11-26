import { useState } from 'react';
import {
  ArrowSquareOut,
  BookOpen,
  Check,
  CheckCircle,
  Copy,
  Eye,
  EyeSlash,
  FileCode,
  Lightbulb,
  RocketLaunch,
  ShieldCheck,
  TerminalWindow,
  X,
} from '@phosphor-icons/react';
import type {
  CodeBlock,
  ModuleDetailResponse,
  ReferenceItem,
  SlideItem,
} from '../../types/bootcamp';
import { TaskSlide } from './TaskSlide';

export interface SlideLayoutsProps {
  data: ModuleDetailResponse;
  slide: SlideItem;
}

const REFERENCE_TYPE_BADGE: Record<ReferenceItem['type'], string> = {
  Book: 'bg-[#0071E3]/10 text-[#005BB8] border-[#0071E3]/25',
  Course: 'bg-[#FF4D00]/10 text-[#C23B00] border-[#FF4D00]/25',
  PBL: 'bg-[#27C93F]/15 text-[#146C24] border-[#27C93F]/30',
  Docs: 'bg-black/[0.05] text-[#111113] border-black/15',
};

function CodeSnippetBlock({
  code,
  tone = 'default',
}: {
  code: CodeBlock;
  tone?: 'default' | 'bad' | 'good';
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code.snippet);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const borderTone =
    tone === 'bad'
      ? 'border-[#FF5F56]/35'
      : tone === 'good'
        ? 'border-[#27C93F]/35'
        : 'border-white/15';

  return (
    <div className={`code-mac-block overflow-hidden border ${borderTone}`}>
      <div className="flex items-center justify-between gap-2 border-b border-white/10 bg-white/[0.04] px-4 py-2">
        <span className="truncate text-xs font-semibold text-slate-300">
          {code.filename || code.title || code.language}
        </span>
        <div className="flex shrink-0 items-center gap-2">
          <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-bold tracking-wider text-slate-300 uppercase">
            {code.language}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-white/15 bg-white/10 px-2.5 py-0.5 text-[11px] font-semibold text-slate-100 transition hover:bg-white/20"
          >
            {copied ? <Check size={12} weight="bold" /> : <Copy size={12} />}
            {copied ? 'Tersalin' : 'Salin'}
          </button>
        </div>
      </div>
      <pre className="m-0 overflow-x-auto p-4 text-[13px] leading-relaxed text-slate-100">
        <code>{code.snippet}</code>
      </pre>
    </div>
  );
}

function StepSnippetBox({
  label,
  value,
  variant = 'command',
}: {
  label: string;
  value: string;
  variant?: 'command' | 'code';
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="code-mac-block overflow-hidden">
      <div className="flex items-center justify-between gap-2 border-b border-white/10 bg-white/[0.04] px-3.5 py-2">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-300">
          {variant === 'command' ? <TerminalWindow size={13} /> : <FileCode size={13} />}
          {label}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-white/15 bg-white/10 px-2 py-0.5 text-[11px] font-semibold text-slate-100 transition hover:bg-white/20"
        >
          {copied ? <Check size={12} weight="bold" /> : <Copy size={12} />}
          {copied ? 'Tersalin' : 'Salin'}
        </button>
      </div>
      <pre className="m-0 overflow-x-auto px-4 py-3 text-[13px] leading-relaxed text-slate-100">
        <code>{value}</code>
      </pre>
    </div>
  );
}

function ReferenceCardsGrid({ references }: { references: ReferenceItem[] }) {
  return (
    <div className="grid gap-3.5 sm:grid-cols-2">
      {references.map((ref) => (
        <a
          key={`${ref.url}-${ref.title}`}
          href={ref.url}
          target="_blank"
          rel="noopener noreferrer"
          className="slide-stagger bento-mac-card group flex flex-col justify-between p-4 no-underline transition hover:-translate-y-0.5 hover:border-[#0071E3]/35 hover:shadow-md"
        >
          <div>
            <div className="mb-2 flex items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <span
                  className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${REFERENCE_TYPE_BADGE[ref.type]}`}
                >
                  {ref.type}
                </span>
                <span className="rounded-full border border-black/10 bg-black/[0.04] px-2 py-0.5 text-[10px] font-bold text-[#52525B]">
                  {ref.lang}
                </span>
              </div>
              <ArrowSquareOut
                size={15}
                className="shrink-0 text-[#8E8E93] transition group-hover:text-[#0071E3]"
              />
            </div>
            <h4 className="text-sm font-bold text-[#111113] group-hover:text-[#0071E3]">
              {ref.title}
            </h4>
            {ref.author && <p className="mt-1 text-xs font-medium text-[#52525B]">{ref.author}</p>}
          </div>
          <p className="mt-3 text-[11px] font-semibold tracking-wide text-[#8E8E93] uppercase">
            {ref.category}
          </p>
        </a>
      ))}
    </div>
  );
}

export function SlideLayouts({ data, slide }: SlideLayoutsProps) {
  const { contentJson, layoutType, badge, title, subtitle } = slide;
  const { mentorProfile } = data;

  const [revealedQuizKeys, setRevealedQuizKeys] = useState<Record<string, boolean>>({});
  const [masteredQuizKeys, setMasteredQuizKeys] = useState<Record<string, boolean>>({});

  return (
    <div className="space-y-7">
      {/* Clean Slide Header */}
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center rounded-full border border-[#FF4D00]/25 bg-[#FF4D00]/10 px-3 py-1 text-[11px] font-bold tracking-wider text-[#C23B00] uppercase">
            {badge}
          </span>
          {contentJson.eyebrow && (
            <span className="text-xs font-semibold tracking-wide text-[#8E8E93]">
              {contentJson.eyebrow}
            </span>
          )}
        </div>

        {layoutType === 'cover' ? (
          <h1 className="text-3xl leading-[1.08] font-extrabold text-[#111113] sm:text-5xl">
            {title}
          </h1>
        ) : (
          <h2 className="text-2xl leading-[1.15] font-bold text-[#111113] sm:text-4xl">
            {title}
          </h2>
        )}

        {subtitle && (
          <p className="max-w-3xl text-base leading-relaxed text-[#52525B] sm:text-lg">
            {subtitle}
          </p>
        )}
      </header>

      {/* 1. COVER */}
      {layoutType === 'cover' && (
        <div className="space-y-5">
          {contentJson.stats && contentJson.stats.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {contentJson.stats.map((stat) => (
                <div key={stat.label} className="slide-stagger bento-mac-card p-4">
                  <span className="text-[11px] font-bold tracking-wider text-[#8E8E93] uppercase">
                    {stat.label}
                  </span>
                  <p className="mt-1.5 text-base font-extrabold text-[#111113] sm:text-lg">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="slide-stagger bento-mac-card p-5 sm:p-6 lg:col-span-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider text-[#FF4D00] uppercase">
                <RocketLaunch size={15} weight="duotone" />
                Capaian Pembelajaran
              </span>
              <ul className="mt-3.5 space-y-2.5">
                {contentJson.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-[#111113]">
                    <CheckCircle
                      size={18}
                      weight="duotone"
                      className="mt-0.5 shrink-0 text-[#27C93F]"
                    />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="slide-stagger flex flex-col justify-between rounded-[18px] border border-white/15 bg-[#111113] p-5 text-white shadow-md sm:p-6">
              <div>
                <span className="inline-block rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-slate-200 uppercase">
                  Pengampu Materi
                </span>
                <p className="mt-3 text-lg font-extrabold text-white">{mentorProfile.name}</p>
                <p className="mt-0.5 text-xs font-semibold text-[#FF8A3D]">
                  {mentorProfile.roleTitle}
                </p>
                <p className="mt-1.5 text-xs font-medium text-slate-200">
                  {mentorProfile.division}
                </p>
                <p className="mt-3 text-xs leading-relaxed text-slate-100">
                  {mentorProfile.tagline}
                </p>
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {mentorProfile.specializations.slice(0, 4).map((spec) => (
                  <span
                    key={spec}
                    className="rounded-full border border-white/15 bg-white/10 px-2.5 py-0.5 text-[10px] font-semibold text-slate-100"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. SUMMARY */}
      {layoutType === 'summary' && (
        <div className="space-y-5">
          {contentJson.highlights.length > 0 && (
            <div className="slide-stagger bento-mac-card p-5 sm:p-6">
              <span className="text-xs font-bold tracking-wider text-[#0071E3] uppercase">
                Intisari Materi
              </span>
              <ul className="mt-3 space-y-2.5">
                {contentJson.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-[#111113]">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF4D00]" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {contentJson.bentoCards && contentJson.bentoCards.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {contentJson.bentoCards.map((card) => (
                <article
                  key={card.title}
                  className="slide-stagger bento-mac-card flex flex-col justify-between p-5"
                >
                  <div>
                    {card.tag && (
                      <span className="mb-2.5 inline-block rounded-full bg-[#FF4D00]/10 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-[#C23B00] uppercase">
                        {card.tag}
                      </span>
                    )}
                    <h3 className="text-base font-bold text-[#111113]">{card.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-[#52525B]">
                      {card.description}
                    </p>
                    {card.bullets && card.bullets.length > 0 && (
                      <ul className="mt-3 space-y-1.5">
                        {card.bullets.map((b) => (
                          <li key={b} className="flex items-start gap-2 text-xs text-[#111113]">
                            <Check
                              size={13}
                              weight="bold"
                              className="mt-0.5 shrink-0 text-[#27C93F]"
                            />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. BENTO */}
      {layoutType === 'bento' && (
        <div className="space-y-5">
          {contentJson.stats && contentJson.stats.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {contentJson.stats.map((stat) => (
                <div key={stat.label} className="slide-stagger bento-mac-card p-4">
                  <span className="text-[11px] font-bold tracking-wider text-[#8E8E93] uppercase">
                    {stat.label}
                  </span>
                  <p className="mt-1 text-xl font-extrabold text-[#FF4D00]">{stat.value}</p>
                </div>
              ))}
            </div>
          )}

          {contentJson.highlights.length > 0 && (
            <div className="slide-stagger bento-mac-card bg-white/80 p-4 sm:p-5">
              <ul className="grid gap-2.5 sm:grid-cols-2">
                {contentJson.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-[#111113]">
                    <CheckCircle
                      size={16}
                      weight="duotone"
                      className="mt-0.5 shrink-0 text-[#0071E3]"
                    />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {contentJson.bentoCards && contentJson.bentoCards.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2">
              {contentJson.bentoCards.map((card) => (
                <article
                  key={card.title}
                  className="slide-stagger bento-mac-card flex flex-col gap-3 p-5"
                >
                  {card.tag && (
                    <div>
                      <span className="inline-block rounded-full border border-black/10 bg-black/[0.04] px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-[#52525B] uppercase">
                        {card.tag}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-bold text-[#111113]">{card.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-[#52525B]">
                      {card.description}
                    </p>
                  </div>
                  {card.bullets && card.bullets.length > 0 && (
                    <ul className="space-y-1.5">
                      {card.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2 text-xs text-[#111113]">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF4D00]" />
                          <span className="leading-relaxed">{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {card.code && <CodeSnippetBlock code={card.code} />}
                </article>
              ))}
            </div>
          )}

          {contentJson.codeBlocks && contentJson.codeBlocks.length > 0 && (
            <div className="grid gap-4 lg:grid-cols-2">
              {contentJson.codeBlocks.map((block, idx) => (
                <div key={`${block.filename || block.title || idx}`} className="slide-stagger">
                  <CodeSnippetBlock code={block} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. COMPARISON */}
      {layoutType === 'comparison' && (
        <div className="space-y-5">
          {contentJson.highlights.length > 0 && (
            <div className="slide-stagger bento-mac-card p-4 sm:p-5">
              <ul className="space-y-1.5">
                {contentJson.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2.5 text-sm text-[#111113]">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF4D00]" />
                    <span className="leading-relaxed">{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {contentJson.comparison && (
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="slide-stagger bento-mac-card flex flex-col gap-4 border-[#FF5F56]/35 bg-[#FF5F56]/[0.04] p-5">
                <div className="border-b border-[#FF5F56]/20 pb-3">
                  <h3 className="text-base font-extrabold text-[#B42318]">
                    {contentJson.comparison.badTitle}
                  </h3>
                </div>

                <ul className="space-y-2">
                  {contentJson.comparison.badPoints.map((pt) => (
                    <li key={pt} className="flex items-start gap-2 text-sm text-[#111113]">
                      <X size={15} weight="bold" className="mt-1 shrink-0 text-[#FF5F56]" />
                      <span className="leading-relaxed">{pt}</span>
                    </li>
                  ))}
                </ul>

                {contentJson.comparison.badCode && (
                  <CodeSnippetBlock code={contentJson.comparison.badCode} tone="bad" />
                )}
              </div>

              <div className="slide-stagger bento-mac-card flex flex-col gap-4 border-[#27C93F]/35 bg-[#27C93F]/[0.04] p-5">
                <div className="border-b border-[#27C93F]/20 pb-3">
                  <h3 className="text-base font-extrabold text-[#146C24]">
                    {contentJson.comparison.goodTitle}
                  </h3>
                </div>

                <ul className="space-y-2">
                  {contentJson.comparison.goodPoints.map((pt) => (
                    <li key={pt} className="flex items-start gap-2 text-sm text-[#111113]">
                      <Check size={15} weight="bold" className="mt-1 shrink-0 text-[#27C93F]" />
                      <span className="leading-relaxed">{pt}</span>
                    </li>
                  ))}
                </ul>

                {contentJson.comparison.goodCode && (
                  <CodeSnippetBlock code={contentJson.comparison.goodCode} tone="good" />
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. PRACTICE */}
      {layoutType === 'practice' && (
        <div className="space-y-5">
          {contentJson.highlights.length > 0 && (
            <div className="slide-stagger bento-mac-card border-[#FF4D00]/20 bg-[#FF4D00]/[0.04] p-4 sm:p-5">
              <ul className="space-y-1.5">
                {contentJson.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-sm text-[#111113]">
                    <TerminalWindow
                      size={16}
                      weight="duotone"
                      className="mt-0.5 shrink-0 text-[#FF4D00]"
                    />
                    <span className="leading-relaxed">{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {contentJson.practiceSteps && contentJson.practiceSteps.length > 0 && (
            <div className="space-y-4">
              {contentJson.practiceSteps.map((step) => (
                <div key={step.step} className="slide-stagger bento-mac-card p-5">
                  <div className="flex items-start gap-3.5">
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#111113] text-xs font-extrabold text-white">
                      {String(step.step).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-[#111113]">{step.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-[#52525B]">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {(step.command || step.code) && (
                    <div className="mt-4 space-y-3">
                      {step.command && (
                        <StepSnippetBox
                          label="Perintah Terminal"
                          value={step.command}
                          variant="command"
                        />
                      )}
                      {step.code && (
                        <StepSnippetBox label="Potongan Kode" value={step.code} variant="code" />
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {contentJson.deliverables && contentJson.deliverables.length > 0 && (
            <div className="slide-stagger bento-mac-card border-[#27C93F]/25 bg-[#27C93F]/[0.04] p-5">
              <span className="text-xs font-bold tracking-wider text-[#146C24] uppercase">
                Target Hasil Praktik
              </span>
              <ul className="mt-2.5 space-y-2">
                {contentJson.deliverables.map((d) => (
                  <li key={d} className="flex items-start gap-2 text-sm text-[#111113]">
                    <CheckCircle
                      size={16}
                      weight="duotone"
                      className="mt-0.5 shrink-0 text-[#27C93F]"
                    />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* 6. QUIZ */}
      {layoutType === 'quiz' && (
        <div className="space-y-6">
          {contentJson.quizItems && contentJson.quizItems.length > 0 && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold tracking-wider text-[#0071E3] uppercase">
                  Evaluasi Pemahaman ({contentJson.quizItems.length} Pertanyaan)
                </span>
                <span className="rounded-full border border-[#27C93F]/30 bg-[#27C93F]/10 px-3 py-1 text-xs font-bold text-[#146C24]">
                  {
                    contentJson.quizItems.filter(
                      (_, idx) => masteredQuizKeys[`${slide.id}-q-${idx}`],
                    ).length
                  }{' '}
                  / {contentJson.quizItems.length} konsep dipahami
                </span>
              </div>

              {contentJson.quizItems.map((q, idx) => {
                const key = `${slide.id}-q-${idx}`;
                const isRevealed = Boolean(revealedQuizKeys[key]);
                const isMastered = Boolean(masteredQuizKeys[key]);

                return (
                  <div key={q.question} className="slide-stagger bento-mac-card p-5">
                    <div className="flex items-start gap-3">
                      <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#0071E3]/10 text-xs font-extrabold text-[#0071E3]">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <h3 className="text-base font-bold text-[#111113]">{q.question}</h3>
                        {q.hint && (
                          <p className="mt-1 text-xs font-medium text-[#8E8E93]">
                            Petunjuk: {q.hint}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setRevealedQuizKeys((prev) => ({ ...prev, [key]: !prev[key] }))
                        }
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#0071E3]/30 bg-[#0071E3]/10 px-3.5 py-1.5 text-xs font-bold text-[#005BB8] transition hover:bg-[#0071E3]/15"
                      >
                        {isRevealed ? <EyeSlash size={14} /> : <Eye size={14} />}
                        {isRevealed ? 'Sembunyikan Jawaban' : 'Lihat Jawaban'}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setMasteredQuizKeys((prev) => ({ ...prev, [key]: !prev[key] }))
                        }
                        className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-bold transition ${
                          isMastered
                            ? 'border-[#27C93F]/40 bg-[#27C93F]/15 text-[#146C24]'
                            : 'border-black/12 bg-white text-[#52525B] hover:bg-black/[0.04]'
                        }`}
                      >
                        <Check size={13} weight="bold" />
                        {isMastered ? 'Sudah Paham' : 'Tandai Paham'}
                      </button>
                    </div>

                    {isRevealed && (
                      <div className="mt-3 rounded-xl border border-[#27C93F]/25 bg-[#27C93F]/[0.06] p-3.5 text-sm leading-relaxed text-[#111113]">
                        <span className="mb-1 block text-[11px] font-bold tracking-wider text-[#146C24] uppercase">
                          Pembahasan
                        </span>
                        {q.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {contentJson.competencyChecklist && contentJson.competencyChecklist.length > 0 && (
            <div className="slide-stagger bento-mac-card p-5">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider text-[#146C24] uppercase">
                <ShieldCheck size={15} weight="duotone" />
                Daftar Kompetensi
              </span>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {contentJson.competencyChecklist.map((c) => (
                  <li key={c} className="flex items-start gap-2 text-sm text-[#111113]">
                    <CheckCircle
                      size={16}
                      weight="duotone"
                      className="mt-0.5 shrink-0 text-[#27C93F]"
                    />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {contentJson.references && contentJson.references.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-[#111113] uppercase">
                <BookOpen size={15} weight="duotone" className="text-[#FF4D00]" />
                Referensi Bacaan
              </div>
              <ReferenceCardsGrid references={contentJson.references} />
            </div>
          )}

          {contentJson.weeklyAssignment && (
            <div className="slide-stagger bento-mac-card border-[#FF4D00]/25 bg-[#FF4D00]/[0.04] p-5">
              <span className="text-xs font-bold tracking-wider text-[#C23B00] uppercase">
                {contentJson.weeklyAssignment.title}
              </span>
              <p className="mt-1.5 text-sm leading-relaxed text-[#111113]">
                {contentJson.weeklyAssignment.description}
              </p>
            </div>
          )}
        </div>
      )}

      {/* 7. REFERENCES */}
      {layoutType === 'references' && (
        <div className="space-y-5">
          {contentJson.highlights.length > 0 && (
            <div className="slide-stagger bento-mac-card p-4 sm:p-5">
              <ul className="space-y-1.5">
                {contentJson.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-sm text-[#111113]">
                    <BookOpen
                      size={16}
                      weight="duotone"
                      className="mt-0.5 shrink-0 text-[#0071E3]"
                    />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {contentJson.references && contentJson.references.length > 0 && (
            <ReferenceCardsGrid references={contentJson.references} />
          )}

          {contentJson.bentoCards && contentJson.bentoCards.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2">
              {contentJson.bentoCards.map((card) => (
                <div key={card.title} className="slide-stagger bento-mac-card p-5">
                  {card.tag && (
                    <span className="mb-2 inline-block rounded-full bg-black/[0.05] px-2.5 py-0.5 text-[10px] font-bold text-[#52525B] uppercase">
                      {card.tag}
                    </span>
                  )}
                  <h3 className="text-base font-bold text-[#111113]">{card.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-[#52525B]">{card.description}</p>
                </div>
              ))}
            </div>
          )}

          {contentJson.competencyChecklist && contentJson.competencyChecklist.length > 0 && (
            <div className="slide-stagger bento-mac-card p-5">
              <span className="text-xs font-bold tracking-wider text-[#146C24] uppercase">
                Daftar Kompetensi Akhir
              </span>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {contentJson.competencyChecklist.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-[#111113]">
                    <CheckCircle
                      size={16}
                      weight="duotone"
                      className="mt-0.5 shrink-0 text-[#27C93F]"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {contentJson.weeklyAssignment && (
            <div className="slide-stagger bento-mac-card border-[#FF4D00]/25 bg-[#FF4D00]/[0.04] p-5">
              <span className="text-xs font-bold tracking-wider text-[#C23B00] uppercase">
                {contentJson.weeklyAssignment.title}
              </span>
              <p className="mt-1.5 text-sm leading-relaxed text-[#111113]">
                {contentJson.weeklyAssignment.description}
              </p>
            </div>
          )}
        </div>
      )}

      {/* 8. TASK */}
      {layoutType === 'task' && <TaskSlide data={data} slide={slide} />}

      {/* Optional Mentor Tip */}
      {contentJson.mentorTip && (
        <div className="slide-stagger bento-mac-card border-[#0071E3]/20 bg-[#0071E3]/[0.04] p-4 sm:p-5">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider text-[#0071E3] uppercase">
            <Lightbulb size={15} weight="duotone" />
            Catatan Praktis
          </span>
          <p className="mt-1.5 text-sm leading-relaxed text-[#111113]">{contentJson.mentorTip}</p>
        </div>
      )}
    </div>
  );
}
