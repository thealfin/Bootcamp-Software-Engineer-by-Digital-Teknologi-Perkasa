import { useEffect, useState, type FormEvent } from 'react';
import { Link } from '@tanstack/react-router';
import {
  ArrowRight,
  Check,
  CheckCircle,
  ClipboardText,
  PaperPlaneTilt,
  WarningCircle,
  X,
} from '@phosphor-icons/react';
import { useSubmitTask } from '../../lib/api';
import type { ModuleDetailResponse, SlideItem, SubmissionStatus } from '../../types/bootcamp';

export interface TaskSlideProps {
  data: ModuleDetailResponse;
  slide: SlideItem;
}

const SUBMISSION_STATUS_META: Record<
  SubmissionStatus,
  { label: string; description: string; badgeClass: string; boxClass: string }
> = {
  pending: {
    label: 'Menunggu Tinjauan',
    description:
      'Tugas dan Learning Log sudah diterima. Pengumpulan sedang ditinjau untuk membuka materi berikutnya.',
    badgeClass: 'border-[#0071E3]/30 bg-[#0071E3]/10 text-[#005BB8]',
    boxClass: 'border-[#0071E3]/25 bg-[#0071E3]/[0.05]',
  },
  approved: {
    label: 'Disetujui (Di-ACC)',
    description:
      'Tugas pertemuan ini sudah di-ACC dan akses menuju materi berikutnya telah dibuka.',
    badgeClass: 'border-[#27C93F]/35 bg-[#27C93F]/15 text-[#146C24]',
    boxClass: 'border-[#27C93F]/30 bg-[#27C93F]/[0.07]',
  },
  revision: {
    label: 'Perlu Revisi',
    description:
      'Terdapat catatan perbaikan pada kode atau Learning Log Anda. Silakan perbarui lalu kirim ulang.',
    badgeClass: 'border-[#FF5F56]/35 bg-[#FF5F56]/12 text-[#B42318]',
    boxClass: 'border-[#FF5F56]/30 bg-[#FF5F56]/[0.06]',
  },
};

function buildLearningLogTemplate(moduleCode: string, moduleTitle: string): string {
  const today = new Date().toISOString().slice(0, 10);
  return [
    `Tanggal: ${today}`,
    `Materi: ${moduleCode} - ${moduleTitle}`,
    'Hal baru yang dipahami: ',
    'Praktik yang dikerjakan: ',
    'Kendala yang ditemukan: ',
    'Cara mengatasi: ',
    'Hal yang masih belum dipahami: ',
    'Tautan repositori / commit: ',
  ].join('\n');
}

function isValidHttpUrl(raw: string): boolean {
  try {
    const parsed = new URL(raw);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export function TaskSlide({ data, slide }: TaskSlideProps) {
  const { module, canSubmitTask, submission, nextModule, mentorProfile, user } = data;
  const { contentJson } = slide;
  const submitTaskMutation = useSubmitTask();

  const [repoUrl, setRepoUrl] = useState(submission?.repoUrl ?? '');
  const [demoUrl, setDemoUrl] = useState(submission?.demoUrl ?? '');
  const [learningLog, setLearningLog] = useState(submission?.learningLog ?? '');
  const [taskError, setTaskError] = useState<string | null>(null);
  const [taskSuccess, setTaskSuccess] = useState<string | null>(null);

  useEffect(() => {
    setRepoUrl(submission?.repoUrl ?? '');
    setDemoUrl(submission?.demoUrl ?? '');
    setLearningLog(submission?.learningLog ?? '');
    setTaskError(null);
    setTaskSuccess(null);
  }, [module.id, submission?.id, submission?.submittedAt]);

  const deliverables =
    contentJson.deliverables && contentJson.deliverables.length > 0
      ? contentJson.deliverables
      : module.taskDeliverables;

  const handleInsertTemplate = () => {
    const template = buildLearningLogTemplate(module.code, module.title);
    setLearningLog((prev) => (prev.trim() ? `${prev.trim()}\n\n${template}` : template));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTaskError(null);
    setTaskSuccess(null);

    const trimmedRepo = repoUrl.trim();
    const trimmedDemo = demoUrl.trim();
    const trimmedLog = learningLog.trim();

    if (!trimmedRepo || !isValidHttpUrl(trimmedRepo)) {
      setTaskError('Masukkan tautan repositori GitHub yang valid dengan awalan https://.');
      return;
    }

    if (trimmedDemo && !isValidHttpUrl(trimmedDemo)) {
      setTaskError('Masukkan tautan demo yang valid dengan awalan https://.');
      return;
    }

    if (trimmedLog.length < 15) {
      setTaskError('Catatan Learning Log minimal 15 karakter.');
      return;
    }

    try {
      await submitTaskMutation.mutateAsync({
        moduleId: module.id,
        repoUrl: trimmedRepo,
        demoUrl: trimmedDemo || undefined,
        learningLog: trimmedLog,
      });
      setTaskSuccess('Tugas dan Learning Log berhasil dikirim untuk ditinjau.');
    } catch (err) {
      setTaskError(
        err instanceof Error ? err.message : 'Pengiriman tugas belum berhasil. Silakan coba lagi.',
      );
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="slide-stagger bento-mac-card p-5">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider text-[#FF4D00] uppercase">
            <ClipboardText size={15} weight="duotone" />
            Instruksi Tugas {module.code}
          </span>
          <p className="mt-2.5 text-sm leading-relaxed text-[#111113]">{module.taskPrompt}</p>

          {contentJson.highlights.length > 0 && (
            <ul className="mt-4 space-y-1.5 border-t border-black/[0.06] pt-3">
              {contentJson.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2 text-xs text-[#52525B]">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF4D00]" />
                  <span className="leading-relaxed">{h}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="slide-stagger bento-mac-card p-5">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider text-[#146C24] uppercase">
            <CheckCircle size={15} weight="duotone" />
            Target Luaran Wajib
          </span>
          <ul className="mt-2.5 space-y-2">
            {deliverables.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-[#111113]">
                <Check size={15} weight="bold" className="mt-1 shrink-0 text-[#27C93F]" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {contentJson.comparison && (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="slide-stagger bento-mac-card border-[#FF5F56]/30 bg-[#FF5F56]/[0.04] p-5">
            <h3 className="text-sm font-extrabold text-[#B42318]">
              {contentJson.comparison.badTitle}
            </h3>
            <ul className="mt-2.5 space-y-1.5">
              {contentJson.comparison.badPoints.map((pt) => (
                <li key={pt} className="flex items-start gap-2 text-xs text-[#111113]">
                  <X size={13} weight="bold" className="mt-0.5 shrink-0 text-[#FF5F56]" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="slide-stagger bento-mac-card border-[#27C93F]/30 bg-[#27C93F]/[0.04] p-5">
            <h3 className="text-sm font-extrabold text-[#146C24]">
              {contentJson.comparison.goodTitle}
            </h3>
            <ul className="mt-2.5 space-y-1.5">
              {contentJson.comparison.goodPoints.map((pt) => (
                <li key={pt} className="flex items-start gap-2 text-xs text-[#111113]">
                  <Check size={13} weight="bold" className="mt-0.5 shrink-0 text-[#27C93F]" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {contentJson.weeklyAssignment && (
        <div className="slide-stagger bento-mac-card border-[#FF4D00]/25 bg-[#FF4D00]/[0.04] p-4 sm:p-5">
          <span className="text-xs font-bold tracking-wider text-[#C23B00] uppercase">
            {contentJson.weeklyAssignment.title}
          </span>
          <p className="mt-1.5 text-sm leading-relaxed text-[#111113]">
            {contentJson.weeklyAssignment.description}
          </p>
        </div>
      )}

      {submission && (
        <div
          className={`slide-stagger bento-mac-card p-5 ${SUBMISSION_STATUS_META[submission.status].boxClass}`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold tracking-wider text-[#111113] uppercase">
              Status Pengumpulan
            </span>
            <span
              className={`rounded-full border px-3 py-0.5 text-xs font-bold ${SUBMISSION_STATUS_META[submission.status].badgeClass}`}
            >
              {SUBMISSION_STATUS_META[submission.status].label}
            </span>
          </div>
          <p className="mt-2 text-sm text-[#111113]">
            {SUBMISSION_STATUS_META[submission.status].description}
          </p>

          {submission.mentorFeedback && (
            <div className="mt-3 rounded-xl border border-black/10 bg-white p-3.5">
              <p className="text-[11px] font-bold tracking-wider text-[#0071E3] uppercase">
                Catatan Peninjau ({submission.reviewedBy || mentorProfile.name})
              </p>
              <p className="mt-1 text-sm leading-relaxed text-[#111113]">
                {submission.mentorFeedback}
              </p>
            </div>
          )}

          {submission.status === 'approved' && nextModule && (
            <div className="mt-4">
              <Link
                to="/modul/$slug"
                params={{ slug: nextModule.slug }}
                className="inline-flex items-center gap-2 rounded-full bg-[#27C93F] px-4 py-2 text-xs font-extrabold text-white no-underline transition hover:bg-[#1FB135]"
              >
                Lanjut ke {nextModule.code}: {nextModule.title}
                <ArrowRight size={14} weight="bold" />
              </Link>
            </div>
          )}
        </div>
      )}

      {canSubmitTask ? (
        <form onSubmit={handleSubmit} className="slide-stagger bento-mac-card space-y-4 p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/[0.06] pb-3">
            <h3 className="text-base font-extrabold text-[#111113]">
              {submission
                ? `Perbarui Tugas ${module.code}`
                : `Kumpulkan Tugas ${module.code}`}
            </h3>
            <button
              type="button"
              onClick={handleInsertTemplate}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#0071E3]/30 bg-[#0071E3]/10 px-3 py-1.5 text-xs font-bold text-[#005BB8] transition hover:bg-[#0071E3]/15"
            >
              <ClipboardText size={14} weight="bold" />
              Isi Format Learning Log
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="task-repo-url"
                className="mb-1 block text-xs font-bold text-[#111113]"
              >
                Tautan Repositori GitHub
              </label>
              <input
                id="task-repo-url"
                type="url"
                required
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/username/nama-repositori"
                className="w-full rounded-xl border border-black/12 bg-white px-3.5 py-2.5 text-sm text-[#111113] outline-none transition focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20"
              />
            </div>

            <div>
              <label
                htmlFor="task-demo-url"
                className="mb-1 block text-xs font-bold text-[#111113]"
              >
                Tautan Demo atau Tangkapan Layar (Opsional)
              </label>
              <input
                id="task-demo-url"
                type="url"
                value={demoUrl}
                onChange={(e) => setDemoUrl(e.target.value)}
                placeholder="https://proyek-anda.vercel.app"
                className="w-full rounded-xl border border-black/12 bg-white px-3.5 py-2.5 text-sm text-[#111113] outline-none transition focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="task-learning-log"
              className="mb-1 block text-xs font-bold text-[#111113]"
            >
              Catatan Learning Log
            </label>
            <textarea
              id="task-learning-log"
              rows={7}
              required
              value={learningLog}
              onChange={(e) => setLearningLog(e.target.value)}
              placeholder="Gunakan tombol Isi Format Learning Log untuk memuat kerangka catatan harian."
              className="w-full rounded-xl border border-black/12 bg-white px-3.5 py-2.5 font-mono text-xs leading-relaxed text-[#111113] outline-none transition focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20"
            />
          </div>

          {taskError && (
            <div className="flex items-start gap-2 rounded-xl border border-[#FF5F56]/35 bg-[#FF5F56]/10 p-3 text-xs font-medium text-[#B42318]">
              <WarningCircle size={16} weight="fill" className="mt-0.5 shrink-0" />
              <span>{taskError}</span>
            </div>
          )}

          {taskSuccess && (
            <div className="flex items-start gap-2 rounded-xl border border-[#27C93F]/35 bg-[#27C93F]/10 p-3 text-xs font-semibold text-[#146C24]">
              <CheckCircle size={16} weight="fill" className="mt-0.5 shrink-0" />
              <span>{taskSuccess}</span>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitTaskMutation.isPending}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#FF4D00] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#E04300] disabled:opacity-60"
            >
              <PaperPlaneTilt size={16} weight="bold" />
              {submitTaskMutation.isPending
                ? 'Mengirim tugas...'
                : submission
                  ? 'Perbarui Tugas'
                  : 'Kirim Tugas'}
            </button>
          </div>
        </form>
      ) : (
        <div className="slide-stagger bento-mac-card bg-black/[0.025] p-5">
          <p className="text-sm text-[#52525B]">
            {module.orderIndex === 0 || module.orderIndex === 16
              ? 'Modul panduan dan referensi tidak memerlukan pengumpulan tugas. Anda dapat langsung melanjutkan ke Pertemuan 01.'
              : user?.role === 'mentor'
                ? 'Akun pengelola aktif. Formulir pengumpulan tugas pada halaman ini dikhususkan untuk peserta.'
                : 'Formulir pengumpulan tersedia setelah akses penuh pertemuan ini terbuka.'}
          </p>
          {(module.orderIndex === 0 || module.orderIndex === 16) && (
            <div className="mt-3">
              <Link
                to="/modul/$slug"
                params={{ slug: 'pertemuan-01-kickoff-web-overview' }}
                className="inline-flex items-center gap-2 rounded-full bg-[#111113] px-4 py-2 text-xs font-bold text-white no-underline transition hover:bg-[#FF4D00]"
              >
                Buka Pertemuan 01
                <ArrowRight size={14} weight="bold" />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
