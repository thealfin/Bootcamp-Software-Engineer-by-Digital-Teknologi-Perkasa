import { useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  ArrowDown,
  ArrowUp,
  CaretDown,
  CaretUp,
  CheckCircle,
  FloppyDisk,
  PencilSimple,
  Plus,
  Trash,
  WarningCircle,
  X,
} from '@phosphor-icons/react';
import {
  useAdminModuleSlides,
  useBootstrap,
  useCreateModule,
  useCreateSlide,
  useDeleteModule,
  useDeleteSlide,
  useUpdateModule,
  useUpdateSlide,
} from '../../lib/api';
import type {
  ModuleSummaryCard,
  SlideContent,
  SlideItem,
  SlideLayoutType,
} from '../../types/bootcamp';

const SLIDE_LAYOUT_OPTIONS: { value: SlideLayoutType; label: string }[] = [
  { value: 'cover', label: 'Cover Pembuka' },
  { value: 'summary', label: 'Ringkasan Materi' },
  { value: 'bento', label: 'Kartu Bento' },
  { value: 'comparison', label: 'Perbandingan Kode' },
  { value: 'practice', label: 'Langkah Praktik' },
  { value: 'quiz', label: 'Kuis Evaluasi' },
  { value: 'references', label: 'Daftar Referensi' },
  { value: 'task', label: 'Instruksi Tugas' },
];

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function extractAdvancedJson(content: SlideContent): string {
  const { highlights: _highlights, ...rest } = content;
  return JSON.stringify(rest, null, 2);
}

interface ModuleFormState {
  code: string;
  slug: string;
  orderIndex: number;
  month: number;
  sessionType: string;
  title: string;
  subtitle: string;
  summaryText: string;
  taskPrompt: string;
  deliverablesText: string;
  accentGradient: string;
  iconName: string;
}

const EMPTY_MODULE_FORM: ModuleFormState = {
  code: 'P17',
  slug: '',
  orderIndex: 17,
  month: 3,
  sessionType: 'Pertemuan Praktik',
  title: '',
  subtitle: '',
  summaryText: '',
  taskPrompt: '',
  deliverablesText: '',
  accentGradient: 'from-blue-600 to-indigo-600',
  iconName: 'Code',
};

interface SlideEditorState {
  mode: 'create' | 'edit';
  slideId?: number;
  title: string;
  subtitle: string;
  badge: string;
  layoutType: SlideLayoutType;
  isSummary: boolean;
  highlightsText: string;
  advancedJson: string;
  showAdvancedJson: boolean;
}

export function AdminMaterialsPage() {
  const { data: bootstrap, isLoading: isBootstrapLoading } = useBootstrap();
  const modules = useMemo(
    () => [...(bootstrap?.modules ?? [])].sort((a, b) => a.orderIndex - b.orderIndex),
    [bootstrap?.modules],
  );

  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  const [moduleForm, setModuleForm] = useState<ModuleFormState>(EMPTY_MODULE_FORM);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newModuleForm, setNewModuleForm] = useState<ModuleFormState>(EMPTY_MODULE_FORM);
  const [confirmDeleteModule, setConfirmDeleteModule] = useState(false);

  const [slideEditor, setSlideEditor] = useState<SlideEditorState | null>(null);
  const [confirmDeleteSlide, setConfirmDeleteSlide] = useState<SlideItem | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null,
  );

  const createModuleMutation = useCreateModule();
  const updateModuleMutation = useUpdateModule();
  const deleteModuleMutation = useDeleteModule();

  const { data: slidesData, isLoading: isSlidesLoading } = useAdminModuleSlides(selectedModuleId);
  const slides = useMemo(
    () => [...(slidesData?.slides ?? [])].sort((a, b) => a.slideNumber - b.slideNumber),
    [slidesData?.slides],
  );

  const createSlideMutation = useCreateSlide();
  const updateSlideMutation = useUpdateSlide();
  const deleteSlideMutation = useDeleteSlide();

  const syncFormFromModule = (mod: ModuleSummaryCard) => {
    setModuleForm({
      code: mod.code,
      slug: mod.slug,
      orderIndex: mod.orderIndex,
      month: mod.month,
      sessionType: mod.sessionType,
      title: mod.title,
      subtitle: mod.subtitle,
      summaryText: mod.summaryText,
      taskPrompt: mod.taskPrompt,
      deliverablesText: mod.taskDeliverables.join('\n'),
      accentGradient: mod.accentGradient || 'from-blue-600 to-indigo-600',
      iconName: mod.iconName || 'Code',
    });
  };

  useEffect(() => {
    if (!modules.length) return;
    const found = modules.find((m) => m.id === selectedModuleId) ?? modules[0];
    if (found && found.id !== selectedModuleId) {
      setSelectedModuleId(found.id);
      syncFormFromModule(found);
    }
  }, [modules, selectedModuleId]);

  const handleSelectModule = (mod: ModuleSummaryCard) => {
    setSelectedModuleId(mod.id);
    syncFormFromModule(mod);
    setSlideEditor(null);
    setConfirmDeleteModule(false);
  };

  const openCreateModuleModal = () => {
    const nextOrder = modules.length
      ? Math.max(...modules.map((m) => m.orderIndex)) + 1
      : 1;
    const padded = String(nextOrder).padStart(2, '0');
    setNewModuleForm({
      ...EMPTY_MODULE_FORM,
      code: `P${padded}`,
      orderIndex: nextOrder,
    });
    setCreateModalOpen(true);
  };

  const handleCreateModule = async (e: FormEvent) => {
    e.preventDefault();
    const slug = newModuleForm.slug.trim() || toSlug(newModuleForm.title);
    if (
      !newModuleForm.code.trim() ||
      !newModuleForm.title.trim() ||
      !slug ||
      !newModuleForm.summaryText.trim()
    ) {
      setToast({
        type: 'error',
        message: 'Kode, judul, slug, dan ringkasan materi wajib diisi.',
      });
      return;
    }

    try {
      const created = await createModuleMutation.mutateAsync({
        code: newModuleForm.code.trim(),
        slug,
        orderIndex: Number(newModuleForm.orderIndex),
        month: Number(newModuleForm.month),
        sessionType: newModuleForm.sessionType.trim() || 'Pertemuan Praktik',
        title: newModuleForm.title.trim(),
        subtitle: newModuleForm.subtitle.trim(),
        summaryText: newModuleForm.summaryText.trim(),
        taskPrompt: newModuleForm.taskPrompt.trim(),
        taskDeliverables: newModuleForm.deliverablesText
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean),
        accentGradient: newModuleForm.accentGradient.trim() || 'from-blue-600 to-indigo-600',
        iconName: newModuleForm.iconName.trim() || 'Code',
      });
      const createdId = created.module?.id ?? created.id;
      if (typeof createdId === 'number') {
        setSelectedModuleId(createdId);
      }
      setCreateModalOpen(false);
      setToast({ type: 'success', message: `Modul ${newModuleForm.code} berhasil ditambahkan.` });
    } catch (err) {
      setToast({
        type: 'error',
        message: err instanceof Error ? err.message : 'Gagal membuat modul baru.',
      });
    }
  };

  const handleSaveModule = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedModuleId) return;
    if (
      !moduleForm.code.trim() ||
      !moduleForm.slug.trim() ||
      !moduleForm.title.trim() ||
      !moduleForm.summaryText.trim()
    ) {
      setToast({
        type: 'error',
        message: 'Kode, slug, judul, dan ringkasan materi tidak boleh kosong.',
      });
      return;
    }

    try {
      await updateModuleMutation.mutateAsync({
        id: selectedModuleId,
        code: moduleForm.code.trim(),
        slug: moduleForm.slug.trim(),
        orderIndex: Number(moduleForm.orderIndex),
        month: Number(moduleForm.month),
        sessionType: moduleForm.sessionType.trim(),
        title: moduleForm.title.trim(),
        subtitle: moduleForm.subtitle.trim(),
        summaryText: moduleForm.summaryText.trim(),
        taskPrompt: moduleForm.taskPrompt.trim(),
        taskDeliverables: moduleForm.deliverablesText
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean),
        accentGradient: moduleForm.accentGradient.trim() || 'from-blue-600 to-indigo-600',
        iconName: moduleForm.iconName.trim() || 'Code',
      });
      setToast({ type: 'success', message: 'Perubahan modul berhasil disimpan.' });
    } catch (err) {
      setToast({
        type: 'error',
        message: err instanceof Error ? err.message : 'Gagal memperbarui modul.',
      });
    }
  };

  const handleConfirmDeleteModule = async () => {
    if (!selectedModuleId) return;
    const deletedCode = moduleForm.code;
    try {
      await deleteModuleMutation.mutateAsync(selectedModuleId);
      setConfirmDeleteModule(false);
      const remaining = modules.filter((m) => m.id !== selectedModuleId);
      setSelectedModuleId(remaining[0]?.id ?? null);
      if (remaining[0]) syncFormFromModule(remaining[0]);
      setToast({ type: 'success', message: `Modul ${deletedCode} berhasil dihapus.` });
    } catch (err) {
      setToast({
        type: 'error',
        message: err instanceof Error ? err.message : 'Gagal menghapus modul.',
      });
    }
  };

  const openCreateSlide = () => {
    setSlideEditor({
      mode: 'create',
      title: '',
      subtitle: '',
      badge: `${moduleForm.code} • Materi`,
      layoutType: 'bento',
      isSummary: slides.length < 3,
      highlightsText: '',
      advancedJson: '{}',
      showAdvancedJson: false,
    });
  };

  const openEditSlide = (slide: SlideItem) => {
    const advancedStr = extractAdvancedJson(slide.contentJson);
    setSlideEditor({
      mode: 'edit',
      slideId: slide.id,
      title: slide.title,
      subtitle: slide.subtitle,
      badge: slide.badge,
      layoutType: slide.layoutType,
      isSummary: slide.isSummary,
      highlightsText: (slide.contentJson.highlights ?? []).join('\n'),
      advancedJson: advancedStr,
      showAdvancedJson: advancedStr !== '{}',
    });
  };

  // shortcut: raw JSON textarea for nested layout blocks; upgrade to per-layout form fields if non-technical editors use it
  const jsonValidationError = useMemo(() => {
    if (!slideEditor) return null;
    const raw = slideEditor.advancedJson.trim();
    if (!raw) return null;
    try {
      const parsed: unknown = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        return 'JSON harus berupa objek (misalnya {"bentoCards": [...]}).';
      }
      return null;
    } catch (err) {
      return err instanceof Error ? `Format JSON tidak valid: ${err.message}` : 'JSON tidak valid.';
    }
  }, [slideEditor]);

  const handleSaveSlide = async (e: FormEvent) => {
    e.preventDefault();
    if (!slideEditor || !selectedModuleId) return;
    if (!slideEditor.title.trim()) {
      setToast({ type: 'error', message: 'Judul slide wajib diisi.' });
      return;
    }
    if (jsonValidationError) {
      setToast({ type: 'error', message: jsonValidationError });
      return;
    }

    const parsedExtra = slideEditor.advancedJson.trim()
      ? (JSON.parse(slideEditor.advancedJson.trim()) as Omit<SlideContent, 'highlights'>)
      : {};
    const contentJson: SlideContent = {
      ...parsedExtra,
      highlights: slideEditor.highlightsText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean),
    };

    try {
      if (slideEditor.mode === 'create') {
        await createSlideMutation.mutateAsync({
          moduleId: selectedModuleId,
          title: slideEditor.title.trim(),
          subtitle: slideEditor.subtitle.trim(),
          badge: slideEditor.badge.trim() || moduleForm.code,
          layoutType: slideEditor.layoutType,
          isSummary: slideEditor.isSummary,
          contentJson,
        });
        setToast({ type: 'success', message: 'Slide baru berhasil ditambahkan.' });
      } else if (slideEditor.slideId) {
        await updateSlideMutation.mutateAsync({
          id: slideEditor.slideId,
          title: slideEditor.title.trim(),
          subtitle: slideEditor.subtitle.trim(),
          badge: slideEditor.badge.trim() || moduleForm.code,
          layoutType: slideEditor.layoutType,
          isSummary: slideEditor.isSummary,
          contentJson,
        });
        setToast({ type: 'success', message: 'Perubahan slide berhasil disimpan.' });
      }
      setSlideEditor(null);
    } catch (err) {
      setToast({
        type: 'error',
        message: err instanceof Error ? err.message : 'Gagal menyimpan slide.',
      });
    }
  };

  const handleSwapSlide = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const current = slides[index];
    const neighbor = slides[targetIndex];
    if (!current || !neighbor) return;

    try {
      await updateSlideMutation.mutateAsync({
        id: current.id,
        slideNumber: neighbor.slideNumber,
      });
      await updateSlideMutation.mutateAsync({
        id: neighbor.id,
        slideNumber: current.slideNumber,
      });
    } catch (err) {
      setToast({
        type: 'error',
        message: err instanceof Error ? err.message : 'Gagal mengubah urutan slide.',
      });
    }
  };

  const handleConfirmDeleteSlide = async () => {
    if (!confirmDeleteSlide) return;
    try {
      await deleteSlideMutation.mutateAsync(confirmDeleteSlide.id);
      if (slideEditor?.slideId === confirmDeleteSlide.id) {
        setSlideEditor(null);
      }
      setConfirmDeleteSlide(null);
      setToast({ type: 'success', message: 'Slide berhasil dihapus dan urutan diperbarui.' });
    } catch (err) {
      setToast({
        type: 'error',
        message: err instanceof Error ? err.message : 'Gagal menghapus slide.',
      });
    }
  };

  if (isBootstrapLoading) {
    return (
      <div className="space-y-5">
        <div className="h-10 w-64 animate-pulse rounded-xl bg-black/[0.06]" />
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="mac-glass-card h-96 animate-pulse lg:col-span-4" />
          <div className="mac-glass-card h-96 animate-pulse lg:col-span-8" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="font-mono text-xs font-semibold tracking-wider text-[#0071E3] uppercase">
            Manajemen Kurikulum
          </span>
          <h1 className="mt-1 text-2xl font-extrabold text-[#111113] sm:text-3xl">
            Materi & Slide Pertemuan
          </h1>
          <p className="mt-1 text-sm text-[#52525B]">
            Atur metadata modul, instruksi tugas, serta isi dan urutan slide pembelajaran.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModuleModal}
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#111113] px-4 py-2.5 text-xs font-bold text-white shadow-2xs transition hover:bg-[#0071E3]"
        >
          <Plus size={15} weight="bold" />
          <span>Tambah Modul</span>
        </button>
      </div>

      {toast && (
        <div
          role="status"
          className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold ${
            toast.type === 'success'
              ? 'border-[#27C93F]/40 bg-[#27C93F]/15 text-[#146C24]'
              : 'border-[#FF5F56]/40 bg-[#FF5F56]/15 text-[#B42318]'
          }`}
        >
          <div className="flex items-center gap-2">
            {toast.type === 'success' ? (
              <CheckCircle size={18} weight="fill" />
            ) : (
              <WarningCircle size={18} weight="bold" />
            )}
            <span>{toast.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setToast(null)}
            aria-label="Tutup pemberitahuan"
            className="cursor-pointer rounded-full p-1 hover:bg-black/10"
          >
            <X size={14} weight="bold" />
          </button>
        </div>
      )}

      <div className="grid items-start gap-6 lg:grid-cols-12">
        {/* Left: Module List */}
        <aside className="mac-glass-card p-4 lg:col-span-4">
          <div className="mb-3 flex items-center justify-between px-1">
            <p className="font-mono text-xs font-semibold tracking-wider text-[#8E8E93] uppercase">
              Daftar Modul ({modules.length})
            </p>
          </div>
          <div className="max-h-[680px] space-y-1.5 overflow-y-auto pr-1">
            {modules.map((mod) => {
              const isSelected = mod.id === selectedModuleId;
              return (
                <button
                  key={mod.id}
                  type="button"
                  onClick={() => handleSelectModule(mod)}
                  className={`flex w-full cursor-pointer items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-left text-xs transition-all ${
                    isSelected
                      ? 'border-[#0071E3] bg-[#0071E3]/10 font-bold text-[#111113]'
                      : 'border-black/[0.07] bg-white text-[#52525B] hover:border-black/20 hover:text-[#111113]'
                  }`}
                >
                  <span className="flex min-w-0 items-center gap-2.5">
                    <span className="shrink-0 rounded bg-[#111113] px-2 py-0.5 font-mono text-[10px] font-bold text-white">
                      {mod.code}
                    </span>
                    <span className="truncate">{mod.title}</span>
                  </span>
                  <span className="shrink-0 font-mono text-[10px] text-[#8E8E93]">
                    {mod.totalSlides} slide
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Right: Module Metadata + Slides */}
        <div className="space-y-6 lg:col-span-8">
          {!selectedModuleId ? (
            <div className="mac-glass-card p-8 text-center text-sm text-[#52525B]">
              Pilih salah satu modul di sebelah kiri atau buat modul baru.
            </div>
          ) : (
            <>
              {/* Module Metadata Form */}
              <form onSubmit={handleSaveModule} className="mac-glass-card space-y-4 p-6">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/[0.07] pb-3.5">
                  <div>
                    <h2 className="text-base font-extrabold text-[#111113]">
                      Pengaturan Modul {moduleForm.code}
                    </h2>
                    <p className="text-xs text-[#52525B]">
                      Perbarui identitas pertemuan, ringkasan katalog, dan spesifikasi tugas.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteModule(true)}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-[#FF5F56]/35 bg-[#FF5F56]/10 px-3 py-2 text-xs font-bold text-[#B42318] transition hover:bg-[#FF5F56]/20"
                  >
                    <Trash size={14} weight="bold" />
                    <span>Hapus Modul</span>
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-4">
                  <div>
                    <label className="mb-1 block font-mono text-[11px] font-semibold text-[#52525B] uppercase">
                      Kode
                    </label>
                    <input
                      type="text"
                      value={moduleForm.code}
                      onChange={(e) => setModuleForm((p) => ({ ...p, code: e.target.value }))}
                      className="w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-xs font-bold text-[#111113] outline-none focus:border-[#0071E3]"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block font-mono text-[11px] font-semibold text-[#52525B] uppercase">
                      Urutan
                    </label>
                    <input
                      type="number"
                      value={moduleForm.orderIndex}
                      onChange={(e) =>
                        setModuleForm((p) => ({ ...p, orderIndex: Number(e.target.value) }))
                      }
                      className="w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-xs text-[#111113] outline-none focus:border-[#0071E3]"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block font-mono text-[11px] font-semibold text-[#52525B] uppercase">
                      Bulan (0–3)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={12}
                      value={moduleForm.month}
                      onChange={(e) =>
                        setModuleForm((p) => ({ ...p, month: Number(e.target.value) }))
                      }
                      className="w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-xs text-[#111113] outline-none focus:border-[#0071E3]"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block font-mono text-[11px] font-semibold text-[#52525B] uppercase">
                      Tipe Sesi
                    </label>
                    <input
                      type="text"
                      value={moduleForm.sessionType}
                      onChange={(e) =>
                        setModuleForm((p) => ({ ...p, sessionType: e.target.value }))
                      }
                      className="w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-xs text-[#111113] outline-none focus:border-[#0071E3]"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block font-mono text-[11px] font-semibold text-[#52525B] uppercase">
                      Judul Modul
                    </label>
                    <input
                      type="text"
                      value={moduleForm.title}
                      onChange={(e) => setModuleForm((p) => ({ ...p, title: e.target.value }))}
                      className="w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-xs text-[#111113] outline-none focus:border-[#0071E3]"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block font-mono text-[11px] font-semibold text-[#52525B] uppercase">
                      Slug URL
                    </label>
                    <input
                      type="text"
                      value={moduleForm.slug}
                      onChange={(e) => setModuleForm((p) => ({ ...p, slug: e.target.value }))}
                      className="w-full rounded-xl border border-black/15 bg-white px-3 py-2 font-mono text-xs text-[#111113] outline-none focus:border-[#0071E3]"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block font-mono text-[11px] font-semibold text-[#52525B] uppercase">
                    Subjudul Modul
                  </label>
                  <input
                    type="text"
                    value={moduleForm.subtitle}
                    onChange={(e) => setModuleForm((p) => ({ ...p, subtitle: e.target.value }))}
                    className="w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-xs text-[#111113] outline-none focus:border-[#0071E3]"
                  />
                </div>

                <div>
                  <label className="mb-1 block font-mono text-[11px] font-semibold text-[#52525B] uppercase">
                    Ringkasan Materi
                  </label>
                  <textarea
                    rows={2}
                    value={moduleForm.summaryText}
                    onChange={(e) =>
                      setModuleForm((p) => ({ ...p, summaryText: e.target.value }))
                    }
                    className="w-full rounded-xl border border-black/15 bg-white p-3 text-xs text-[#111113] outline-none focus:border-[#0071E3]"
                  />
                </div>

                <div>
                  <label className="mb-1 block font-mono text-[11px] font-semibold text-[#52525B] uppercase">
                    Instruksi Tugas Praktik
                  </label>
                  <textarea
                    rows={3}
                    value={moduleForm.taskPrompt}
                    onChange={(e) => setModuleForm((p) => ({ ...p, taskPrompt: e.target.value }))}
                    className="w-full rounded-xl border border-black/15 bg-white p-3 text-xs text-[#111113] outline-none focus:border-[#0071E3]"
                  />
                </div>

                <div>
                  <label className="mb-1 block font-mono text-[11px] font-semibold text-[#52525B] uppercase">
                    Target Deliverable (Satu Poin per Baris)
                  </label>
                  <textarea
                    rows={3}
                    value={moduleForm.deliverablesText}
                    onChange={(e) =>
                      setModuleForm((p) => ({ ...p, deliverablesText: e.target.value }))
                    }
                    className="w-full rounded-xl border border-black/15 bg-white p-3 font-mono text-xs text-[#111113] outline-none focus:border-[#0071E3]"
                  />
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={updateModuleMutation.isPending}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#111113] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#0071E3] disabled:opacity-60"
                  >
                    <FloppyDisk size={15} weight="bold" />
                    <span>
                      {updateModuleMutation.isPending ? 'Menyimpan...' : 'Simpan Modul'}
                    </span>
                  </button>
                </div>
              </form>

              {/* Slides List & Slide Editor */}
              <section className="mac-glass-card space-y-4 p-6">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/[0.07] pb-3.5">
                  <div>
                    <h2 className="text-base font-extrabold text-[#111113]">
                      Daftar Slide ({slides.length})
                    </h2>
                    <p className="text-xs text-[#52525B]">
                      Kelola konten per halaman slide atau ubah urutannya.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={openCreateSlide}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#0071E3] px-3.5 py-2 text-xs font-bold text-white transition hover:bg-[#005BB8]"
                  >
                    <Plus size={14} weight="bold" />
                    <span>Tambah Slide</span>
                  </button>
                </div>

                {isSlidesLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((n) => (
                      <div key={n} className="h-12 animate-pulse rounded-xl bg-black/[0.05]" />
                    ))}
                  </div>
                ) : slides.length === 0 ? (
                  <p className="py-6 text-center text-xs text-[#52525B]">
                    Modul ini belum memiliki slide. Klik tombol Tambah Slide untuk mulai mengisi
                    materi.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {slides.map((slide, idx) => (
                      <li
                        key={slide.id}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-black/[0.08] bg-white px-4 py-3"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded bg-[#111113] px-2 py-0.5 font-mono text-[10px] font-bold text-white">
                              #{String(slide.slideNumber).padStart(2, '0')}
                            </span>
                            <span className="rounded-md bg-[#F5F5F7] px-2 py-0.5 font-mono text-[10px] font-semibold text-[#52525B]">
                              {slide.layoutType}
                            </span>
                            {slide.isSummary && (
                              <span className="rounded-md bg-[#27C93F]/15 px-2 py-0.5 text-[10px] font-bold text-[#146C24]">
                                Pratinjau Tamu
                              </span>
                            )}
                          </div>
                          <p className="mt-1 truncate text-xs font-bold text-[#111113]">
                            {slide.title}
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            disabled={idx === 0 || updateSlideMutation.isPending}
                            onClick={() => handleSwapSlide(idx, 'up')}
                            title="Pindahkan slide ke atas"
                            aria-label="Naik"
                            className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-black/10 bg-[#F5F5F7] px-2.5 py-1.5 text-[11px] font-bold text-[#111113] transition hover:bg-black/10 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <ArrowUp size={12} weight="bold" />
                            <span>Naik</span>
                          </button>
                          <button
                            type="button"
                            disabled={idx === slides.length - 1 || updateSlideMutation.isPending}
                            onClick={() => handleSwapSlide(idx, 'down')}
                            title="Pindahkan slide ke bawah"
                            aria-label="Turun"
                            className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-black/10 bg-[#F5F5F7] px-2.5 py-1.5 text-[11px] font-bold text-[#111113] transition hover:bg-black/10 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <ArrowDown size={12} weight="bold" />
                            <span>Turun</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => openEditSlide(slide)}
                            className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-black/10 bg-white px-2.5 py-1.5 text-[11px] font-bold text-[#0071E3] transition hover:border-[#0071E3]"
                          >
                            <PencilSimple size={12} weight="bold" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteSlide(slide)}
                            className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-[#FF5F56]/30 bg-[#FF5F56]/10 px-2.5 py-1.5 text-[11px] font-bold text-[#B42318] transition hover:bg-[#FF5F56]/20"
                          >
                            <Trash size={12} weight="bold" />
                            <span>Hapus Slide</span>
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Inline Slide Editor Form */}
                {slideEditor && (
                  <form
                    onSubmit={handleSaveSlide}
                    className="mt-5 space-y-4 rounded-2xl border border-[#0071E3]/30 bg-[#F5F5F7]/80 p-5"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-extrabold text-[#111113]">
                        {slideEditor.mode === 'create' ? 'Tambah Slide Baru' : 'Edit Konten Slide'}
                      </h3>
                      <button
                        type="button"
                        onClick={() => setSlideEditor(null)}
                        aria-label="Tutup editor slide"
                        className="cursor-pointer rounded-lg p-1 text-[#52525B] hover:bg-black/10"
                      >
                        <X size={15} weight="bold" />
                      </button>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block font-mono text-[11px] font-semibold text-[#52525B] uppercase">
                          Judul Slide
                        </label>
                        <input
                          type="text"
                          required
                          value={slideEditor.title}
                          onChange={(e) =>
                            setSlideEditor((p) => (p ? { ...p, title: e.target.value } : p))
                          }
                          className="w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-xs text-[#111113] outline-none focus:border-[#0071E3]"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block font-mono text-[11px] font-semibold text-[#52525B] uppercase">
                          Badge Atas
                        </label>
                        <input
                          type="text"
                          value={slideEditor.badge}
                          onChange={(e) =>
                            setSlideEditor((p) => (p ? { ...p, badge: e.target.value } : p))
                          }
                          className="w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-xs text-[#111113] outline-none focus:border-[#0071E3]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block font-mono text-[11px] font-semibold text-[#52525B] uppercase">
                        Subjudul Slide
                      </label>
                      <input
                        type="text"
                        value={slideEditor.subtitle}
                        onChange={(e) =>
                          setSlideEditor((p) => (p ? { ...p, subtitle: e.target.value } : p))
                        }
                        className="w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-xs text-[#111113] outline-none focus:border-[#0071E3]"
                      />
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 sm:items-end">
                      <div>
                        <label className="mb-1 block font-mono text-[11px] font-semibold text-[#52525B] uppercase">
                          Tipe Tata Letak
                        </label>
                        <select
                          value={slideEditor.layoutType}
                          onChange={(e) =>
                            setSlideEditor((p) =>
                              p ? { ...p, layoutType: e.target.value as SlideLayoutType } : p,
                            )
                          }
                          className="w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-xs font-semibold text-[#111113] outline-none focus:border-[#0071E3]"
                        >
                          {SLIDE_LAYOUT_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label} ({opt.value})
                            </option>
                          ))}
                        </select>
                      </div>

                      <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-black/10 bg-white px-3.5 py-2 text-xs font-semibold text-[#111113]">
                        <input
                          type="checkbox"
                          checked={slideEditor.isSummary}
                          onChange={(e) =>
                            setSlideEditor((p) => (p ? { ...p, isSummary: e.target.checked } : p))
                          }
                          className="h-4 w-4 accent-[#0071E3]"
                        />
                        <span>Tampilkan sebagai slide ringkasan publik</span>
                      </label>
                    </div>

                    <div>
                      <label className="mb-1 block font-mono text-[11px] font-semibold text-[#52525B] uppercase">
                        Poin Utama / Highlights (Satu Baris per Poin)
                      </label>
                      <textarea
                        rows={4}
                        value={slideEditor.highlightsText}
                        onChange={(e) =>
                          setSlideEditor((p) =>
                            p ? { ...p, highlightsText: e.target.value } : p,
                          )
                        }
                        className="w-full rounded-xl border border-black/15 bg-white p-3 text-xs text-[#111113] outline-none focus:border-[#0071E3]"
                      />
                    </div>

                    <div>
                      <button
                        type="button"
                        onClick={() =>
                          setSlideEditor((p) =>
                            p ? { ...p, showAdvancedJson: !p.showAdvancedJson } : p,
                          )
                        }
                        className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-bold text-[#0071E3] hover:underline"
                      >
                        {slideEditor.showAdvancedJson ? (
                          <CaretUp size={13} weight="bold" />
                        ) : (
                          <CaretDown size={13} weight="bold" />
                        )}
                        <span>JSON Konten Lanjutan</span>
                      </button>

                      {slideEditor.showAdvancedJson && (
                        <div className="mt-2 space-y-1.5">
                          <p className="text-[11px] text-[#52525B]">
                            Properti opsional seperti <code>bentoCards</code>,{' '}
                            <code>comparison</code>, <code>codeBlocks</code>,{' '}
                            <code>practiceSteps</code>, <code>quizItems</code>, atau{' '}
                            <code>references</code>.
                          </p>
                          <textarea
                            rows={8}
                            value={slideEditor.advancedJson}
                            onChange={(e) =>
                              setSlideEditor((p) =>
                                p ? { ...p, advancedJson: e.target.value } : p,
                              )
                            }
                            className="w-full rounded-xl border border-black/15 bg-white p-3 font-mono text-xs text-[#111113] outline-none focus:border-[#0071E3]"
                          />
                          {jsonValidationError && (
                            <p className="text-xs font-semibold text-[#B42318]">
                              {jsonValidationError}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setSlideEditor(null)}
                        className="cursor-pointer rounded-xl border border-black/10 bg-white px-4 py-2 text-xs font-bold text-[#52525B] hover:text-[#111113]"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        disabled={
                          Boolean(jsonValidationError) ||
                          createSlideMutation.isPending ||
                          updateSlideMutation.isPending
                        }
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#111113] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#0071E3] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <FloppyDisk size={14} weight="bold" />
                        <span>Simpan Slide</span>
                      </button>
                    </div>
                  </form>
                )}
              </section>
            </>
          )}
        </div>
      </div>

      {/* Create Module Modal */}
      {createModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Tambah Modul Baru"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs"
        >
          <form
            onSubmit={handleCreateModule}
            className="mac-glass-card max-h-[90vh] w-full max-w-xl space-y-4 overflow-y-auto p-6"
          >
            <div className="flex items-center justify-between border-b border-black/[0.07] pb-3">
              <h2 className="text-base font-extrabold text-[#111113]">Tambah Modul Baru</h2>
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                aria-label="Tutup dialog"
                className="cursor-pointer rounded-lg p-1 text-[#52525B] hover:bg-black/10"
              >
                <X size={16} weight="bold" />
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className="mb-1 block font-mono text-[11px] font-semibold text-[#52525B] uppercase">
                  Kode
                </label>
                <input
                  type="text"
                  required
                  value={newModuleForm.code}
                  onChange={(e) => setNewModuleForm((p) => ({ ...p, code: e.target.value }))}
                  className="w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-xs font-bold text-[#111113] outline-none focus:border-[#0071E3]"
                />
              </div>
              <div>
                <label className="mb-1 block font-mono text-[11px] font-semibold text-[#52525B] uppercase">
                  Urutan
                </label>
                <input
                  type="number"
                  value={newModuleForm.orderIndex}
                  onChange={(e) =>
                    setNewModuleForm((p) => ({ ...p, orderIndex: Number(e.target.value) }))
                  }
                  className="w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-xs text-[#111113] outline-none focus:border-[#0071E3]"
                />
              </div>
              <div>
                <label className="mb-1 block font-mono text-[11px] font-semibold text-[#52525B] uppercase">
                  Bulan
                </label>
                <input
                  type="number"
                  min={0}
                  max={12}
                  value={newModuleForm.month}
                  onChange={(e) =>
                    setNewModuleForm((p) => ({ ...p, month: Number(e.target.value) }))
                  }
                  className="w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-xs text-[#111113] outline-none focus:border-[#0071E3]"
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block font-mono text-[11px] font-semibold text-[#52525B] uppercase">
                  Judul Modul
                </label>
                <input
                  type="text"
                  required
                  value={newModuleForm.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setNewModuleForm((p) => ({
                      ...p,
                      title,
                      slug: p.slug ? p.slug : toSlug(title),
                    }));
                  }}
                  className="w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-xs text-[#111113] outline-none focus:border-[#0071E3]"
                />
              </div>
              <div>
                <label className="mb-1 block font-mono text-[11px] font-semibold text-[#52525B] uppercase">
                  Slug URL
                </label>
                <input
                  type="text"
                  required
                  value={newModuleForm.slug}
                  onChange={(e) => setNewModuleForm((p) => ({ ...p, slug: e.target.value }))}
                  className="w-full rounded-xl border border-black/15 bg-white px-3 py-2 font-mono text-xs text-[#111113] outline-none focus:border-[#0071E3]"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block font-mono text-[11px] font-semibold text-[#52525B] uppercase">
                Tipe Sesi
              </label>
              <input
                type="text"
                value={newModuleForm.sessionType}
                onChange={(e) =>
                  setNewModuleForm((p) => ({ ...p, sessionType: e.target.value }))
                }
                className="w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-xs text-[#111113] outline-none focus:border-[#0071E3]"
              />
            </div>

            <div>
              <label className="mb-1 block font-mono text-[11px] font-semibold text-[#52525B] uppercase">
                Subjudul Modul
              </label>
              <input
                type="text"
                value={newModuleForm.subtitle}
                onChange={(e) => setNewModuleForm((p) => ({ ...p, subtitle: e.target.value }))}
                className="w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-xs text-[#111113] outline-none focus:border-[#0071E3]"
              />
            </div>

            <div>
              <label className="mb-1 block font-mono text-[11px] font-semibold text-[#52525B] uppercase">
                Ringkasan Materi
              </label>
              <textarea
                rows={2}
                value={newModuleForm.summaryText}
                onChange={(e) =>
                  setNewModuleForm((p) => ({ ...p, summaryText: e.target.value }))
                }
                className="w-full rounded-xl border border-black/15 bg-white p-3 text-xs text-[#111113] outline-none focus:border-[#0071E3]"
              />
            </div>

            <div>
              <label className="mb-1 block font-mono text-[11px] font-semibold text-[#52525B] uppercase">
                Instruksi Tugas Praktik
              </label>
              <textarea
                rows={2}
                value={newModuleForm.taskPrompt}
                onChange={(e) =>
                  setNewModuleForm((p) => ({ ...p, taskPrompt: e.target.value }))
                }
                className="w-full rounded-xl border border-black/15 bg-white p-3 text-xs text-[#111113] outline-none focus:border-[#0071E3]"
              />
            </div>

            <div>
              <label className="mb-1 block font-mono text-[11px] font-semibold text-[#52525B] uppercase">
                Deliverable (Satu per Baris)
              </label>
              <textarea
                rows={2}
                value={newModuleForm.deliverablesText}
                onChange={(e) =>
                  setNewModuleForm((p) => ({ ...p, deliverablesText: e.target.value }))
                }
                className="w-full rounded-xl border border-black/15 bg-white p-3 font-mono text-xs text-[#111113] outline-none focus:border-[#0071E3]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="cursor-pointer rounded-xl border border-black/10 bg-white px-4 py-2 text-xs font-bold text-[#52525B]"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={createModuleMutation.isPending}
                className="cursor-pointer rounded-xl bg-[#111113] px-5 py-2 text-xs font-bold text-white hover:bg-[#0071E3] disabled:opacity-60"
              >
                {createModuleMutation.isPending ? 'Menambahkan...' : 'Simpan Modul Baru'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Confirm Delete Module Dialog */}
      {confirmDeleteModule && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs"
        >
          <div className="mac-glass-card w-full max-w-md p-6">
            <h3 className="text-base font-extrabold text-[#111113]">
              Hapus Modul {moduleForm.code}?
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[#52525B]">
              Seluruh slide dan data terkait modul <strong>{moduleForm.title}</strong> akan dihapus
              permanen. Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteModule(false)}
                className="cursor-pointer rounded-xl border border-black/10 bg-white px-4 py-2 text-xs font-bold text-[#52525B]"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={deleteModuleMutation.isPending}
                onClick={handleConfirmDeleteModule}
                className="cursor-pointer rounded-xl bg-[#FF5F56] px-4 py-2 text-xs font-bold text-white hover:brightness-95 disabled:opacity-60"
              >
                {deleteModuleMutation.isPending ? 'Menghapus...' : 'Ya, Hapus Modul'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Slide Dialog */}
      {confirmDeleteSlide && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs"
        >
          <div className="mac-glass-card w-full max-w-md p-6">
            <h3 className="text-base font-extrabold text-[#111113]">
              Hapus Slide #{confirmDeleteSlide.slideNumber}?
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[#52525B]">
              Slide <strong>{confirmDeleteSlide.title}</strong> akan dihapus dan nomor urut slide
              sisanya disesuaikan otomatis.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteSlide(null)}
                className="cursor-pointer rounded-xl border border-black/10 bg-white px-4 py-2 text-xs font-bold text-[#52525B]"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={deleteSlideMutation.isPending}
                onClick={handleConfirmDeleteSlide}
                className="cursor-pointer rounded-xl bg-[#FF5F56] px-4 py-2 text-xs font-bold text-white hover:brightness-95 disabled:opacity-60"
              >
                {deleteSlideMutation.isPending ? 'Menghapus...' : 'Ya, Hapus Slide'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
