import fs from 'node:fs/promises';
import path from 'node:path';
import { neon } from '@neondatabase/serverless';
import { asc, eq, and, notInArray, or } from 'drizzle-orm';
import { drizzle, type NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import { evaluateModuleAccess } from '../lib/access-guard';
import { hashPassword, verifyPassword } from '../lib/session';
import type {
  AnalyticsOverview,
  BootstrapResponse,
  CreateModuleInput,
  CreateSlideInput,
  MentorDashboardResponse,
  MentorProfile,
  MentorQueueItem,
  ModuleDetailResponse,
  ModuleSummaryCard,
  PublicUser,
  SeedModuleInput,
  SlideContent,
  SlideItem,
  StudentMatrixRow,
  SubmissionStatus,
  TaskSubmissionItem,
  UpdateModuleInput,
  UpdateSlideInput,
  UserRole,
} from '../types/bootcamp';

export interface BootcampRepository {
  readonly kind: 'neon' | 'local';
  ensureSeeded(
    seedModules: SeedModuleInput[],
    mentorUser: { name: string; email: string; schoolOrigin: string; role: 'mentor' },
  ): Promise<{ totalModules: number; totalSlides: number }>;
  getUserById(id: number): Promise<PublicUser | null>;
  getBootstrapData(user: PublicUser | null, mentorProfile: MentorProfile): Promise<BootstrapResponse>;
  getModuleDetail(
    slug: string,
    user: PublicUser | null,
    mentorProfile: MentorProfile,
  ): Promise<ModuleDetailResponse | null>;
  registerStudent(input: {
    name: string;
    email: string;
    schoolOrigin: string;
    password: string;
  }): Promise<PublicUser>;
  loginStudent(input: { email: string; password: string }): Promise<PublicUser | null>;
  verifyMentorLogin(input: { email: string; passcode: string }): Promise<PublicUser | null>;
  submitTask(
    userId: number,
    input: { moduleId: number; repoUrl: string; demoUrl?: string | null; learningLog: string },
  ): Promise<TaskSubmissionItem>;
  getMentorDashboard(mentor: PublicUser): Promise<MentorDashboardResponse>;
  reviewSubmission(input: {
    submissionId: number;
    status: 'approved' | 'revision';
    mentorFeedback: string;
    reviewerName: string;
  }): Promise<{ submission: TaskSubmissionItem; unlockedNextModuleSlug: string | null }>;
  setManualUnlock(input: { userId: number; moduleId: number; unlocked: boolean }): Promise<void>;
  updateModuleContent(
    moduleId: number,
    input: { summaryText?: string; taskPrompt?: string; taskDeliverables?: string[] },
  ): Promise<void>;
  getAnalytics(): Promise<AnalyticsOverview>;
  createModule(input: CreateModuleInput): Promise<ModuleSummaryCard>;
  updateModule(moduleId: number, input: UpdateModuleInput): Promise<ModuleSummaryCard>;
  deleteModule(moduleId: number): Promise<void>;
  getModuleSlidesAdmin(moduleId: number): Promise<SlideItem[]>;
  createSlide(moduleId: number, input: CreateSlideInput): Promise<SlideItem>;
  updateSlide(slideId: number, input: UpdateSlideInput): Promise<SlideItem>;
  deleteSlide(slideId: number): Promise<void>;
}

interface StoredUser {
  id: number;
  name: string;
  email: string;
  schoolOrigin: string;
  passwordHash?: string | null;
  role: UserRole;
  createdAt: string;
}

interface StoredModule {
  id: number;
  orderIndex: number;
  month: number;
  slug: string;
  code: string;
  sessionType: string;
  title: string;
  subtitle: string;
  summaryText: string;
  taskPrompt: string;
  taskDeliverables: string[];
  accentGradient: string;
  iconName: string;
}

interface StoredSlide extends SlideItem {}

interface StoredSubmission {
  id: number;
  userId: number;
  moduleId: number;
  repoUrl: string;
  demoUrl: string | null;
  learningLog: string;
  status: SubmissionStatus;
  mentorFeedback: string | null;
  reviewedBy: string | null;
  submittedAt: string;
  reviewedAt: string | null;
}

interface StoredUnlock {
  id: number;
  userId: number;
  moduleId: number;
  unlockedBy: string;
  isUnlocked: boolean;
  unlockedAt: string;
}

interface LocalDbSnapshot {
  counters: {
    users: number;
    modules: number;
    slides: number;
    taskSubmissions: number;
    moduleUnlocks: number;
  };
  users: StoredUser[];
  modules: StoredModule[];
  slides: StoredSlide[];
  taskSubmissions: StoredSubmission[];
  moduleUnlocks: StoredUnlock[];
}

const DEFAULT_ACCENT_GRADIENT = 'from-sky-500 to-indigo-600';
const DEFAULT_ICON_NAME = 'BookOpen';
const MONTH_SHORT_ID = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'Mei',
  'Jun',
  'Jul',
  'Agu',
  'Sep',
  'Okt',
  'Nov',
  'Des',
];

function toIsoString(val: Date | string | null | undefined): string {
  if (!val) return new Date().toISOString();
  return val instanceof Date ? val.toISOString() : val;
}

function toNullableIsoString(val: Date | string | null | undefined): string | null {
  if (!val) return null;
  return val instanceof Date ? val.toISOString() : val;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function toPublicUser(user: StoredUser): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    schoolOrigin: user.schoolOrigin,
    role: user.role,
    createdAt: user.createdAt,
  };
}

function getMentorPasscode(): string {
  return process.env.MENTOR_PASSCODE || 'digitek-mentor-2026';
}

function isManualOverrideBy(unlockedBy: string | null | undefined): boolean {
  return unlockedBy === 'MENTOR_MANUAL' || unlockedBy === 'MENTOR_LOCKED';
}

function toAdminModuleCard(mod: StoredModule, slidesForModule: StoredSlide[]): ModuleSummaryCard {
  return {
    id: mod.id,
    orderIndex: mod.orderIndex,
    month: mod.month,
    slug: mod.slug,
    code: mod.code,
    sessionType: mod.sessionType,
    title: mod.title,
    subtitle: mod.subtitle,
    summaryText: mod.summaryText,
    taskPrompt: mod.taskPrompt,
    taskDeliverables: mod.taskDeliverables,
    accentGradient: mod.accentGradient,
    iconName: mod.iconName,
    totalSlides: slidesForModule.length,
    summarySlides: slidesForModule.filter((s) => s.isSummary).length,
    accessLevel: 'FULL_ACCESS',
    accessReason: 'Mode Mentor (Alfin Almustajab): akses penuh seluruh pertemuan.',
    submissionStatus: null,
    mentorFeedback: null,
    isManualOverride: false,
  };
}

function buildModuleSummaryCard(params: {
  mod: StoredModule;
  slidesForModule: StoredSlide[];
  user: PublicUser | null;
  submissionByModuleId: Map<number, StoredSubmission>;
  unlockByModuleId: Map<number, StoredUnlock>;
  moduleByOrderIndex: Map<number, StoredModule>;
}): ModuleSummaryCard {
  const { mod, slidesForModule, user, submissionByModuleId, unlockByModuleId, moduleByOrderIndex } =
    params;
  const userSubmission = submissionByModuleId.get(mod.id) ?? null;
  const unlock = unlockByModuleId.get(mod.id) ?? null;
  const prevMod = moduleByOrderIndex.get(mod.orderIndex - 1);
  const prevSubmission = prevMod ? submissionByModuleId.get(prevMod.id) ?? null : null;

  const access = evaluateModuleAccess({
    user,
    moduleOrderIndex: mod.orderIndex,
    isReferenceModule: mod.orderIndex === 0 || mod.slug === 'pustaka-learning-hub',
    prevModuleSubmissionStatus: prevSubmission?.status ?? null,
    unlockOverride: unlock ? { isUnlocked: unlock.isUnlocked, unlockedBy: unlock.unlockedBy } : null,
  });

  return {
    id: mod.id,
    orderIndex: mod.orderIndex,
    month: mod.month,
    slug: mod.slug,
    code: mod.code,
    sessionType: mod.sessionType,
    title: mod.title,
    subtitle: mod.subtitle,
    summaryText: mod.summaryText,
    taskPrompt: mod.taskPrompt,
    taskDeliverables: mod.taskDeliverables,
    accentGradient: mod.accentGradient,
    iconName: mod.iconName,
    totalSlides: slidesForModule.length,
    summarySlides: slidesForModule.filter((s) => s.isSummary).length,
    accessLevel: access.accessLevel,
    accessReason: access.reason,
    submissionStatus: userSubmission?.status ?? null,
    mentorFeedback: userSubmission?.mentorFeedback ?? null,
    isManualOverride: Boolean(unlock && isManualOverrideBy(unlock.unlockedBy)),
  };
}

function assembleBootstrapResponse(params: {
  user: PublicUser | null;
  mentorProfile: MentorProfile;
  allUsers: StoredUser[];
  allModules: StoredModule[];
  allSlides: StoredSlide[];
  allSubmissions: StoredSubmission[];
  userUnlocks: StoredUnlock[];
}): BootstrapResponse {
  const { user, mentorProfile, allUsers, allModules, allSlides, allSubmissions, userUnlocks } =
    params;

  const sortedModules = [...allModules].sort((a, b) => a.orderIndex - b.orderIndex);
  const slidesByModule = new Map<number, StoredSlide[]>();
  for (const s of allSlides) {
    const list = slidesByModule.get(s.moduleId) ?? [];
    list.push(s);
    slidesByModule.set(s.moduleId, list);
  }

  const moduleByOrderIndex = new Map<number, StoredModule>(
    sortedModules.map((m) => [m.orderIndex, m]),
  );
  const userSubmissions = user ? allSubmissions.filter((s) => s.userId === user.id) : [];
  const submissionByModuleId = new Map<number, StoredSubmission>(
    userSubmissions.map((s) => [s.moduleId, s]),
  );
  const unlockByModuleId = new Map<number, StoredUnlock>(
    userUnlocks.map((u) => [u.moduleId, u]),
  );

  const moduleCards = sortedModules.map((mod) =>
    buildModuleSummaryCard({
      mod,
      slidesForModule: slidesByModule.get(mod.id) ?? [],
      user,
      submissionByModuleId,
      unlockByModuleId,
      moduleByOrderIndex,
    }),
  );

  return {
    user,
    mentorProfile,
    stats: {
      totalStudents: allUsers.filter((u) => u.role === 'user').length,
      totalModules: sortedModules.length,
      formalMeetings: sortedModules.filter((m) => m.orderIndex >= 1 && m.slug !== 'pustaka-learning-hub').length,
      pendingReviews: allSubmissions.filter((s) => s.status === 'pending').length,
      approvedReviews: allSubmissions.filter((s) => s.status === 'approved').length,
    },
    modules: moduleCards,
  };
}

function assembleModuleDetailResponse(params: {
  targetModule: StoredModule;
  user: PublicUser | null;
  mentorProfile: MentorProfile;
  allModules: StoredModule[];
  moduleSlides: StoredSlide[];
  userSubmissions: StoredSubmission[];
  userUnlocks: StoredUnlock[];
}): ModuleDetailResponse {
  const {
    targetModule,
    user,
    mentorProfile,
    allModules,
    moduleSlides,
    userSubmissions,
    userUnlocks,
  } = params;

  const sortedSlides = [...moduleSlides].sort((a, b) => a.slideNumber - b.slideNumber);
  const moduleByOrderIndex = new Map<number, StoredModule>(
    allModules.map((m) => [m.orderIndex, m]),
  );
  const submissionByModuleId = new Map<number, StoredSubmission>(
    userSubmissions.map((s) => [s.moduleId, s]),
  );
  const unlockByModuleId = new Map<number, StoredUnlock>(
    userUnlocks.map((u) => [u.moduleId, u]),
  );

  const prevMod = moduleByOrderIndex.get(targetModule.orderIndex - 1) ?? null;
  const prevSubmission = prevMod ? submissionByModuleId.get(prevMod.id) ?? null : null;
  const currentSubmission = submissionByModuleId.get(targetModule.id) ?? null;
  const currentUnlock = unlockByModuleId.get(targetModule.id) ?? null;

  const access = evaluateModuleAccess({
    user,
    moduleOrderIndex: targetModule.orderIndex,
    isReferenceModule: targetModule.orderIndex === 0 || targetModule.slug === 'pustaka-learning-hub',
    prevModuleSubmissionStatus: prevSubmission?.status ?? null,
    unlockOverride: currentUnlock
      ? { isUnlocked: currentUnlock.isUnlocked, unlockedBy: currentUnlock.unlockedBy }
      : null,
  });

  const summarySlidesCount = sortedSlides.filter((s) => s.isSummary).length;
  const visibleSlides =
    access.accessLevel === 'FULL_ACCESS'
      ? sortedSlides
      : sortedSlides.filter((s) => s.isSummary);

  const moduleCard = buildModuleSummaryCard({
    mod: targetModule,
    slidesForModule: sortedSlides,
    user,
    submissionByModuleId,
    unlockByModuleId,
    moduleByOrderIndex,
  });

  const nextMod = moduleByOrderIndex.get(targetModule.orderIndex + 1) ?? null;
  let nextModuleInfo: ModuleDetailResponse['nextModule'] = null;
  if (nextMod) {
    const nextUnlock = unlockByModuleId.get(nextMod.id) ?? null;
    const nextAccess = evaluateModuleAccess({
      user,
      moduleOrderIndex: nextMod.orderIndex,
      isReferenceModule: nextMod.orderIndex === 0 || nextMod.slug === 'pustaka-learning-hub',
      prevModuleSubmissionStatus: currentSubmission?.status ?? null,
      unlockOverride: nextUnlock
        ? { isUnlocked: nextUnlock.isUnlocked, unlockedBy: nextUnlock.unlockedBy }
        : null,
    });
    nextModuleInfo = {
      slug: nextMod.slug,
      code: nextMod.code,
      title: nextMod.title,
      accessLevel: nextAccess.accessLevel,
    };
  }

  return {
    user,
    mentorProfile,
    module: moduleCard,
    slides: visibleSlides,
    totalSlidesCount: sortedSlides.length,
    summarySlidesCount,
    accessLevel: access.accessLevel,
    accessReason: access.reason,
    canSubmitTask: access.canSubmitTask,
    submission: currentSubmission,
    prevModule: prevMod
      ? {
          id: prevMod.id,
          orderIndex: prevMod.orderIndex,
          slug: prevMod.slug,
          code: prevMod.code,
          title: prevMod.title,
          submissionStatus: prevSubmission?.status ?? null,
          mentorFeedback: prevSubmission?.mentorFeedback ?? null,
        }
      : null,
    nextModule: nextModuleInfo,
  };
}

function assembleMentorDashboardResponse(params: {
  mentor: PublicUser;
  allUsers: StoredUser[];
  allModules: StoredModule[];
  allSubmissions: StoredSubmission[];
  allUnlocks: StoredUnlock[];
}): MentorDashboardResponse {
  const { mentor, allUsers, allModules, allSubmissions, allUnlocks } = params;

  const sortedModules = [...allModules].sort((a, b) => a.orderIndex - b.orderIndex);
  const formalModules = sortedModules.filter((m) => m.orderIndex >= 1 && m.slug !== 'pustaka-learning-hub');
  const students = allUsers
    .filter((u) => u.role === 'user')
    .sort((a, b) => a.id - b.id);

  const userById = new Map<number, StoredUser>(allUsers.map((u) => [u.id, u]));
  const moduleById = new Map<number, StoredModule>(sortedModules.map((m) => [m.id, m]));
  const moduleByOrderIndex = new Map<number, StoredModule>(
    sortedModules.map((m) => [m.orderIndex, m]),
  );

  const submissionsByUser = new Map<number, Map<number, StoredSubmission>>();
  for (const sub of allSubmissions) {
    let map = submissionsByUser.get(sub.userId);
    if (!map) {
      map = new Map();
      submissionsByUser.set(sub.userId, map);
    }
    map.set(sub.moduleId, sub);
  }

  const unlocksByUser = new Map<number, Map<number, StoredUnlock>>();
  for (const unl of allUnlocks) {
    let map = unlocksByUser.get(unl.userId);
    if (!map) {
      map = new Map();
      unlocksByUser.set(unl.userId, map);
    }
    map.set(unl.moduleId, unl);
  }

  const queue: MentorQueueItem[] = [];
  for (const sub of allSubmissions) {
    const u = userById.get(sub.userId);
    const m = moduleById.get(sub.moduleId);
    if (!u || !m) continue;
    queue.push({
      ...sub,
      userName: u.name,
      userEmail: u.email,
      userSchoolOrigin: u.schoolOrigin,
      moduleOrderIndex: m.orderIndex,
      moduleCode: m.code,
      moduleSlug: m.slug,
      moduleTitle: m.title,
    });
  }

  const priorityOrder: Record<SubmissionStatus, number> = {
    pending: 0,
    revision: 1,
    approved: 2,
  };
  queue.sort((a, b) => {
    const pDiff = priorityOrder[a.status] - priorityOrder[b.status];
    if (pDiff !== 0) return pDiff;
    return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
  });

  const studentsMatrix: StudentMatrixRow[] = students.map((student) => {
    const publicStudent = toPublicUser(student);
    const subMap = submissionsByUser.get(student.id) ?? new Map<number, StoredSubmission>();
    const unlMap = unlocksByUser.get(student.id) ?? new Map<number, StoredUnlock>();
    let approvedCount = 0;
    let pendingCount = 0;
    let revisionCount = 0;

    const moduleCells = formalModules.map((mod) => {
      const sub = subMap.get(mod.id) ?? null;
      const unl = unlMap.get(mod.id) ?? null;
      const prevMod = moduleByOrderIndex.get(mod.orderIndex - 1);
      const prevSub = prevMod ? subMap.get(prevMod.id) ?? null : null;

      const access = evaluateModuleAccess({
        user: publicStudent,
        moduleOrderIndex: mod.orderIndex,
        isReferenceModule: mod.orderIndex === 0 || mod.slug === 'pustaka-learning-hub',
        prevModuleSubmissionStatus: prevSub?.status ?? null,
        unlockOverride: unl ? { isUnlocked: unl.isUnlocked, unlockedBy: unl.unlockedBy } : null,
      });

      if (sub?.status === 'approved') approvedCount += 1;
      else if (sub?.status === 'pending') pendingCount += 1;
      else if (sub?.status === 'revision') revisionCount += 1;

      return {
        moduleId: mod.id,
        orderIndex: mod.orderIndex,
        code: mod.code,
        slug: mod.slug,
        accessLevel: access.accessLevel,
        submissionStatus: sub?.status ?? null,
        isManualOverride: Boolean(unl && isManualOverrideBy(unl.unlockedBy)),
        unlockedBy: unl?.unlockedBy ?? null,
      };
    });

    return {
      user: publicStudent,
      modules: moduleCells,
      approvedCount,
      pendingCount,
      revisionCount,
    };
  });

  const pendingCount = allSubmissions.filter((s) => s.status === 'pending').length;
  const approvedCount = allSubmissions.filter((s) => s.status === 'approved').length;
  const revisionCount = allSubmissions.filter((s) => s.status === 'revision').length;

  let avgCompletionPercent = 0;
  if (studentsMatrix.length > 0 && formalModules.length > 0) {
    const totalRatio = studentsMatrix.reduce(
      (acc, row) => acc + row.approvedCount / formalModules.length,
      0,
    );
    avgCompletionPercent = Math.round((totalRatio / studentsMatrix.length) * 100);
  }

  return {
    mentor,
    kpis: {
      totalStudents: students.length,
      pendingCount,
      approvedCount,
      revisionCount,
      avgCompletionPercent,
    },
    queue,
    studentsMatrix,
    modules: sortedModules.map((m) => ({
      id: m.id,
      orderIndex: m.orderIndex,
      month: m.month,
      code: m.code,
      slug: m.slug,
      sessionType: m.sessionType,
      title: m.title,
      subtitle: m.subtitle,
      summaryText: m.summaryText,
      taskPrompt: m.taskPrompt,
      taskDeliverables: m.taskDeliverables,
      accentGradient: m.accentGradient,
      iconName: m.iconName,
    })),
  };
}

function formatShortDateId(d: Date): string {
  return `${String(d.getUTCDate()).padStart(2, '0')} ${MONTH_SHORT_ID[d.getUTCMonth()]}`;
}

function assembleAnalyticsOverview(params: {
  allUsers: StoredUser[];
  allModules: StoredModule[];
  allSubmissions: StoredSubmission[];
}): AnalyticsOverview {
  const { allUsers, allModules, allSubmissions } = params;
  const students = allUsers
    .filter((u) => u.role === 'user')
    .sort((a, b) => a.id - b.id);
  const studentIds = new Set(students.map((s) => s.id));
  const sortedModules = [...allModules].sort((a, b) => a.orderIndex - b.orderIndex);
  const formalModules = sortedModules.filter((m) => m.orderIndex >= 1 && m.slug !== 'pustaka-learning-hub');
  const targetModules = formalModules.length > 0 ? formalModules : sortedModules;
  const moduleDenom = targetModules.length || 1;
  const targetModuleIds = new Set(targetModules.map((m) => m.id));

  const studentSubmissions = allSubmissions.filter((s) => studentIds.has(s.userId));
  const nowMs = Date.now();
  const sevenDaysAgoMs = nowMs - 7 * 24 * 60 * 60 * 1000;

  const activeUserIds7d = new Set<number>();
  let reviewedTotalHours = 0;
  let reviewedCount = 0;
  let totalRevisionSubmissions = 0;

  const subsByUser = new Map<number, StoredSubmission[]>();
  const subsByModule = new Map<number, StoredSubmission[]>();

  for (const sub of studentSubmissions) {
    const subMs = new Date(sub.submittedAt).getTime();
    if (!Number.isNaN(subMs) && subMs >= sevenDaysAgoMs) {
      activeUserIds7d.add(sub.userId);
    }
    if (sub.status === 'revision') {
      totalRevisionSubmissions += 1;
    }
    if (sub.reviewedAt) {
      const revMs = new Date(sub.reviewedAt).getTime();
      if (!Number.isNaN(subMs) && !Number.isNaN(revMs)) {
        reviewedTotalHours += Math.max(0, (revMs - subMs) / 3_600_000);
        reviewedCount += 1;
      }
    }

    const uList = subsByUser.get(sub.userId) ?? [];
    uList.push(sub);
    subsByUser.set(sub.userId, uList);

    const mList = subsByModule.get(sub.moduleId) ?? [];
    mList.push(sub);
    subsByModule.set(sub.moduleId, mList);
  }

  const studentPerformance: AnalyticsOverview['studentPerformance'] = students.map((student) => {
    const subs = subsByUser.get(student.id) ?? [];
    let approvedCount = 0;
    let pendingCount = 0;
    let revisionCount = 0;
    let lastSubmittedAt: string | null = null;
    let lastSubmittedMs = -Infinity;

    for (const s of subs) {
      if (targetModuleIds.has(s.moduleId)) {
        if (s.status === 'approved') approvedCount += 1;
        else if (s.status === 'pending') pendingCount += 1;
        else if (s.status === 'revision') revisionCount += 1;
      }
      const ms = new Date(s.submittedAt).getTime();
      if (!Number.isNaN(ms) && ms > lastSubmittedMs) {
        lastSubmittedMs = ms;
        lastSubmittedAt = s.submittedAt;
      }
    }

    const progressPercent = Math.min(100, Math.round((approvedCount / moduleDenom) * 100));
    return {
      userId: student.id,
      name: student.name,
      email: student.email,
      schoolOrigin: student.schoolOrigin,
      approvedCount,
      pendingCount,
      revisionCount,
      progressPercent,
      lastSubmittedAt,
    };
  });

  studentPerformance.sort((a, b) => {
    if (b.progressPercent !== a.progressPercent) return b.progressPercent - a.progressPercent;
    if (b.approvedCount !== a.approvedCount) return b.approvedCount - a.approvedCount;
    return a.name.localeCompare(b.name);
  });

  const avgProgressPercent =
    studentPerformance.length > 0
      ? Math.round(
          studentPerformance.reduce((sum, s) => sum + s.progressPercent, 0) /
            studentPerformance.length,
        )
      : 0;

  const avgReviewHours =
    reviewedCount > 0 ? Math.round((reviewedTotalHours / reviewedCount) * 10) / 10 : 0;

  const revisionRatePercent =
    studentSubmissions.length > 0
      ? Math.round((totalRevisionSubmissions / studentSubmissions.length) * 100)
      : 0;

  const moduleDifficulty: AnalyticsOverview['moduleDifficulty'] = targetModules.map((mod) => {
    const subs = subsByModule.get(mod.id) ?? [];
    const submissionsCount = subs.length;
    const approvedCount = subs.filter((s) => s.status === 'approved').length;
    const revisionCount = subs.filter((s) => s.status === 'revision').length;
    return {
      moduleId: mod.id,
      code: mod.code,
      title: mod.title,
      submissionsCount,
      approvedCount,
      revisionCount,
      revisionRatePercent:
        submissionsCount > 0 ? Math.round((revisionCount / submissionsCount) * 100) : 0,
    };
  });

  const schoolGroups = new Map<string, { count: number; sumProgress: number }>();
  for (const sp of studentPerformance) {
    const key = sp.schoolOrigin.trim() || 'Lainnya';
    const cur = schoolGroups.get(key) ?? { count: 0, sumProgress: 0 };
    cur.count += 1;
    cur.sumProgress += sp.progressPercent;
    schoolGroups.set(key, cur);
  }
  const schoolBreakdown: AnalyticsOverview['schoolBreakdown'] = Array.from(
    schoolGroups.entries(),
  )
    .map(([schoolOrigin, val]) => ({
      schoolOrigin,
      studentCount: val.count,
      avgProgressPercent: Math.round(val.sumProgress / val.count),
    }))
    .sort((a, b) => b.studentCount - a.studentCount || a.schoolOrigin.localeCompare(b.schoolOrigin));

  const weekMs = 7 * 24 * 60 * 60 * 1000;
  const weeklyTrend: AnalyticsOverview['weeklyTrend'] = [];
  for (let i = 7; i >= 0; i -= 1) {
    const startMs = nowMs - (i + 1) * weekMs;
    const endMs = i === 0 ? Infinity : nowMs - i * weekMs;
    const labelDate = new Date(nowMs - i * weekMs);
    let submissions = 0;
    let approvals = 0;

    for (const sub of studentSubmissions) {
      const subMs = new Date(sub.submittedAt).getTime();
      if (!Number.isNaN(subMs) && subMs >= startMs && subMs < endMs) {
        submissions += 1;
      }
      if (sub.status === 'approved') {
        const appMs = new Date(sub.reviewedAt ?? sub.submittedAt).getTime();
        if (!Number.isNaN(appMs) && appMs >= startMs && appMs < endMs) {
          approvals += 1;
        }
      }
    }

    weeklyTrend.push({
      weekLabel: formatShortDateId(labelDate),
      submissions,
      approvals,
    });
  }

  return {
    kpis: {
      totalStudents: students.length,
      activeStudents7d: activeUserIds7d.size,
      avgProgressPercent,
      avgReviewHours,
      revisionRatePercent,
      totalSubmissions: studentSubmissions.length,
    },
    studentPerformance,
    moduleDifficulty,
    schoolBreakdown,
    weeklyTrend,
  };
}

class NeonDrizzleRepository implements BootcampRepository {
  readonly kind = 'neon' as const;

  constructor(private readonly db: NeonHttpDatabase<typeof schema>) {}

  private mapUser(row: typeof schema.users.$inferSelect): StoredUser {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      schoolOrigin: row.schoolOrigin,
      passwordHash: row.passwordHash ?? null,
      role: row.role,
      createdAt: toIsoString(row.createdAt),
    };
  }

  private mapModule(row: typeof schema.modules.$inferSelect): StoredModule {
    return {
      id: row.id,
      orderIndex: row.orderIndex,
      month: row.month,
      slug: row.slug,
      code: row.code,
      sessionType: row.sessionType,
      title: row.title,
      subtitle: row.subtitle,
      summaryText: row.summaryText,
      taskPrompt: row.taskPrompt,
      taskDeliverables: row.taskDeliverables ?? [],
      accentGradient: row.accentGradient,
      iconName: row.iconName,
    };
  }

  private mapSlide(row: typeof schema.slides.$inferSelect): StoredSlide {
    return {
      id: row.id,
      moduleId: row.moduleId,
      slideNumber: row.slideNumber,
      isSummary: row.isSummary,
      layoutType: row.layoutType,
      badge: row.badge,
      title: row.title,
      subtitle: row.subtitle,
      contentJson: row.contentJson,
    };
  }

  private mapSubmission(row: typeof schema.taskSubmissions.$inferSelect): StoredSubmission {
    return {
      id: row.id,
      userId: row.userId,
      moduleId: row.moduleId,
      repoUrl: row.repoUrl,
      demoUrl: row.demoUrl ?? null,
      learningLog: row.learningLog,
      status: row.status,
      mentorFeedback: row.mentorFeedback ?? null,
      reviewedBy: row.reviewedBy ?? null,
      submittedAt: toIsoString(row.submittedAt),
      reviewedAt: toNullableIsoString(row.reviewedAt),
    };
  }

  private mapUnlock(row: typeof schema.moduleUnlocks.$inferSelect): StoredUnlock {
    return {
      id: row.id,
      userId: row.userId,
      moduleId: row.moduleId,
      unlockedBy: row.unlockedBy,
      isUnlocked: row.isUnlocked,
      unlockedAt: toIsoString(row.unlockedAt),
    };
  }

  async ensureSeeded(
    seedModules: SeedModuleInput[],
    mentorUser: { name: string; email: string; schoolOrigin: string; role: 'mentor' },
  ): Promise<{ totalModules: number; totalSlides: number }> {
    const normalizedMentorEmail = normalizeEmail(mentorUser.email);
    await this.db
      .insert(schema.users)
      .values({
        name: mentorUser.name,
        email: normalizedMentorEmail,
        schoolOrigin: mentorUser.schoolOrigin,
        role: 'mentor',
      })
      .onConflictDoUpdate({
        target: schema.users.email,
        set: {
          name: mentorUser.name,
          schoolOrigin: mentorUser.schoolOrigin,
          role: 'mentor',
        },
      });

    let totalSlides = 0;

    for (const mod of seedModules) {
      const [upsertedModule] = await this.db
        .insert(schema.modules)
        .values({
          orderIndex: mod.orderIndex,
          month: mod.month,
          slug: mod.slug,
          code: mod.code,
          sessionType: mod.sessionType,
          title: mod.title,
          subtitle: mod.subtitle,
          summaryText: mod.summaryText,
          taskPrompt: mod.taskPrompt,
          taskDeliverables: mod.taskDeliverables,
          accentGradient: mod.accentGradient,
          iconName: mod.iconName,
        })
        .onConflictDoUpdate({
          target: schema.modules.orderIndex,
          set: {
            month: mod.month,
            slug: mod.slug,
            code: mod.code,
            sessionType: mod.sessionType,
            title: mod.title,
            subtitle: mod.subtitle,
            summaryText: mod.summaryText,
            taskPrompt: mod.taskPrompt,
            taskDeliverables: mod.taskDeliverables,
            accentGradient: mod.accentGradient,
            iconName: mod.iconName,
          },
        })
        .returning();

      const slideNumbers = mod.slides.map((s) => s.slideNumber);
      if (slideNumbers.length === 0) {
        await this.db.delete(schema.slides).where(eq(schema.slides.moduleId, upsertedModule.id));
      } else {
        await this.db
          .delete(schema.slides)
          .where(
            and(
              eq(schema.slides.moduleId, upsertedModule.id),
              notInArray(schema.slides.slideNumber, slideNumbers),
            ),
          );
      }

      for (const slide of mod.slides) {
        await this.db
          .insert(schema.slides)
          .values({
            moduleId: upsertedModule.id,
            slideNumber: slide.slideNumber,
            isSummary: slide.isSummary,
            layoutType: slide.layoutType,
            badge: slide.badge,
            title: slide.title,
            subtitle: slide.subtitle,
            contentJson: slide.contentJson,
          })
          .onConflictDoUpdate({
            target: [schema.slides.moduleId, schema.slides.slideNumber],
            set: {
              isSummary: slide.isSummary,
              layoutType: slide.layoutType,
              badge: slide.badge,
              title: slide.title,
              subtitle: slide.subtitle,
              contentJson: slide.contentJson,
            },
          });
        totalSlides += 1;
      }
    }

    return { totalModules: seedModules.length, totalSlides };
  }

  async getUserById(id: number): Promise<PublicUser | null> {
    const [row] = await this.db.select().from(schema.users).where(eq(schema.users.id, id)).limit(1);
    return row ? toPublicUser(this.mapUser(row)) : null;
  }

  async getBootstrapData(
    user: PublicUser | null,
    mentorProfile: MentorProfile,
  ): Promise<BootstrapResponse> {
    const [userRows, moduleRows, slideRows, submissionRows, unlockRows] = await Promise.all([
      this.db.select().from(schema.users),
      this.db.select().from(schema.modules).orderBy(asc(schema.modules.orderIndex)),
      this.db.select().from(schema.slides).orderBy(asc(schema.slides.slideNumber)),
      this.db.select().from(schema.taskSubmissions),
      user
        ? this.db.select().from(schema.moduleUnlocks).where(eq(schema.moduleUnlocks.userId, user.id))
        : Promise.resolve([]),
    ]);

    return assembleBootstrapResponse({
      user,
      mentorProfile,
      allUsers: userRows.map((r) => this.mapUser(r)),
      allModules: moduleRows.map((r) => this.mapModule(r)),
      allSlides: slideRows.map((r) => this.mapSlide(r)),
      allSubmissions: submissionRows.map((r) => this.mapSubmission(r)),
      userUnlocks: unlockRows.map((r) => this.mapUnlock(r)),
    });
  }

  async getModuleDetail(
    slug: string,
    user: PublicUser | null,
    mentorProfile: MentorProfile,
  ): Promise<ModuleDetailResponse | null> {
    const moduleRows = await this.db
      .select()
      .from(schema.modules)
      .orderBy(asc(schema.modules.orderIndex));
    const targetRow = moduleRows.find((m) => m.slug === slug);
    if (!targetRow) return null;

    const [slideRows, submissionRows, unlockRows] = await Promise.all([
      this.db
        .select()
        .from(schema.slides)
        .where(eq(schema.slides.moduleId, targetRow.id))
        .orderBy(asc(schema.slides.slideNumber)),
      user
        ? this.db
            .select()
            .from(schema.taskSubmissions)
            .where(eq(schema.taskSubmissions.userId, user.id))
        : Promise.resolve([]),
      user
        ? this.db.select().from(schema.moduleUnlocks).where(eq(schema.moduleUnlocks.userId, user.id))
        : Promise.resolve([]),
    ]);

    return assembleModuleDetailResponse({
      targetModule: this.mapModule(targetRow),
      user,
      mentorProfile,
      allModules: moduleRows.map((r) => this.mapModule(r)),
      moduleSlides: slideRows.map((r) => this.mapSlide(r)),
      userSubmissions: submissionRows.map((r) => this.mapSubmission(r)),
      userUnlocks: unlockRows.map((r) => this.mapUnlock(r)),
    });
  }

  async registerStudent(input: {
    name: string;
    email: string;
    schoolOrigin: string;
    password: string;
  }): Promise<PublicUser> {
    const email = normalizeEmail(input.email);
    const name = input.name.trim();
    const schoolOrigin = input.schoolOrigin.trim();
    const passwordHash = hashPassword(input.password);

    const [existing] = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email))
      .limit(1);

    let student: PublicUser;
    if (existing) {
      if (existing.role === 'mentor') {
        throw new Error('MENTOR_EMAIL_CONFLICT');
      }
      if (existing.passwordHash && existing.passwordHash.trim().length > 0) {
        throw new Error('EMAIL_ALREADY_REGISTERED');
      }
      const [updated] = await this.db
        .update(schema.users)
        .set({ name, schoolOrigin, passwordHash })
        .where(eq(schema.users.id, existing.id))
        .returning();
      student = toPublicUser(this.mapUser(updated));
    } else {
      const [inserted] = await this.db
        .insert(schema.users)
        .values({
          name,
          email,
          schoolOrigin,
          passwordHash,
          role: 'user',
        })
        .returning();
      student = toPublicUser(this.mapUser(inserted));
    }

    const [p01] = await this.db
      .select()
      .from(schema.modules)
      .where(eq(schema.modules.orderIndex, 1))
      .limit(1);

    if (p01) {
      await this.db
        .insert(schema.moduleUnlocks)
        .values({
          userId: student.id,
          moduleId: p01.id,
          unlockedBy: 'SYSTEM_INITIAL',
          isUnlocked: true,
        })
        .onConflictDoNothing({
          target: [schema.moduleUnlocks.userId, schema.moduleUnlocks.moduleId],
        });
    }

    return student;
  }

  async loginStudent(input: { email: string; password: string }): Promise<PublicUser | null> {
    const email = normalizeEmail(input.email);
    const [row] = await this.db
      .select()
      .from(schema.users)
      .where(and(eq(schema.users.email, email), eq(schema.users.role, 'user')))
      .limit(1);

    if (!row || !row.passwordHash) return null;
    if (!verifyPassword(input.password, row.passwordHash)) return null;
    return toPublicUser(this.mapUser(row));
  }

  async verifyMentorLogin(input: { email: string; passcode: string }): Promise<PublicUser | null> {
    if (input.passcode !== getMentorPasscode()) {
      return null;
    }
    const email = normalizeEmail(input.email);
    const [row] = await this.db
      .select()
      .from(schema.users)
      .where(and(eq(schema.users.email, email), eq(schema.users.role, 'mentor')))
      .limit(1);
    return row ? toPublicUser(this.mapUser(row)) : null;
  }

  async submitTask(
    userId: number,
    input: { moduleId: number; repoUrl: string; demoUrl?: string | null; learningLog: string },
  ): Promise<TaskSubmissionItem> {
    const user = await this.getUserById(userId);
    if (!user || user.role !== 'user') {
      throw new Error('FORBIDDEN_USER');
    }

    const [modRow] = await this.db
      .select()
      .from(schema.modules)
      .where(eq(schema.modules.id, input.moduleId))
      .limit(1);
    if (!modRow) {
      throw new Error('MODULE_NOT_FOUND');
    }
    if (modRow.orderIndex < 1 || modRow.slug === 'pustaka-learning-hub') {
      throw new Error('MODULE_NOT_SUBMITTABLE');
    }

    let prevStatus: SubmissionStatus | null = null;
    if (modRow.orderIndex >= 2) {
      const [prevMod] = await this.db
        .select()
        .from(schema.modules)
        .where(eq(schema.modules.orderIndex, modRow.orderIndex - 1))
        .limit(1);
      if (prevMod) {
        const [prevSub] = await this.db
          .select()
          .from(schema.taskSubmissions)
          .where(
            and(
              eq(schema.taskSubmissions.userId, userId),
              eq(schema.taskSubmissions.moduleId, prevMod.id),
            ),
          )
          .limit(1);
        prevStatus = prevSub?.status ?? null;
      }
    }

    const [unlockRow] = await this.db
      .select()
      .from(schema.moduleUnlocks)
      .where(
        and(
          eq(schema.moduleUnlocks.userId, userId),
          eq(schema.moduleUnlocks.moduleId, modRow.id),
        ),
      )
      .limit(1);

    const access = evaluateModuleAccess({
      user,
      moduleOrderIndex: modRow.orderIndex,
      isReferenceModule: modRow.orderIndex === 0 || modRow.slug === 'pustaka-learning-hub',
      prevModuleSubmissionStatus: prevStatus,
      unlockOverride: unlockRow
        ? { isUnlocked: unlockRow.isUnlocked, unlockedBy: unlockRow.unlockedBy }
        : null,
    });

    if (access.accessLevel !== 'FULL_ACCESS' || !access.canSubmitTask) {
      throw new Error('MODULE_LOCKED');
    }

    const now = new Date();
    const [upserted] = await this.db
      .insert(schema.taskSubmissions)
      .values({
        userId,
        moduleId: modRow.id,
        repoUrl: input.repoUrl,
        demoUrl: input.demoUrl ?? null,
        learningLog: input.learningLog,
        status: 'pending',
        mentorFeedback: null,
        reviewedBy: null,
        submittedAt: now,
        reviewedAt: null,
      })
      .onConflictDoUpdate({
        target: [schema.taskSubmissions.userId, schema.taskSubmissions.moduleId],
        set: {
          repoUrl: input.repoUrl,
          demoUrl: input.demoUrl ?? null,
          learningLog: input.learningLog,
          status: 'pending',
          mentorFeedback: null,
          reviewedBy: null,
          submittedAt: now,
          reviewedAt: null,
        },
      })
      .returning();

    return this.mapSubmission(upserted);
  }

  async getMentorDashboard(mentor: PublicUser): Promise<MentorDashboardResponse> {
    const [userRows, moduleRows, submissionRows, unlockRows] = await Promise.all([
      this.db.select().from(schema.users),
      this.db.select().from(schema.modules).orderBy(asc(schema.modules.orderIndex)),
      this.db.select().from(schema.taskSubmissions),
      this.db.select().from(schema.moduleUnlocks),
    ]);

    return assembleMentorDashboardResponse({
      mentor,
      allUsers: userRows.map((r) => this.mapUser(r)),
      allModules: moduleRows.map((r) => this.mapModule(r)),
      allSubmissions: submissionRows.map((r) => this.mapSubmission(r)),
      allUnlocks: unlockRows.map((r) => this.mapUnlock(r)),
    });
  }

  async reviewSubmission(input: {
    submissionId: number;
    status: 'approved' | 'revision';
    mentorFeedback: string;
    reviewerName: string;
  }): Promise<{ submission: TaskSubmissionItem; unlockedNextModuleSlug: string | null }> {
    const now = new Date();
    const [updated] = await this.db
      .update(schema.taskSubmissions)
      .set({
        status: input.status,
        mentorFeedback: input.mentorFeedback,
        reviewedBy: input.reviewerName,
        reviewedAt: now,
      })
      .where(eq(schema.taskSubmissions.id, input.submissionId))
      .returning();

    if (!updated) {
      throw new Error('SUBMISSION_NOT_FOUND');
    }

    let unlockedNextModuleSlug: string | null = null;
    if (input.status === 'approved') {
      const [currentMod] = await this.db
        .select()
        .from(schema.modules)
        .where(eq(schema.modules.id, updated.moduleId))
        .limit(1);

      if (currentMod && currentMod.orderIndex >= 1 && currentMod.slug !== 'pustaka-learning-hub') {
        const [nextMod] = await this.db
          .select()
          .from(schema.modules)
          .where(eq(schema.modules.orderIndex, currentMod.orderIndex + 1))
          .limit(1);

        if (nextMod && nextMod.slug !== 'pustaka-learning-hub') {
          await this.db
            .insert(schema.moduleUnlocks)
            .values({
              userId: updated.userId,
              moduleId: nextMod.id,
              unlockedBy: 'MENTOR_ACC',
              isUnlocked: true,
              unlockedAt: now,
            })
            .onConflictDoUpdate({
              target: [schema.moduleUnlocks.userId, schema.moduleUnlocks.moduleId],
              set: {
                unlockedBy: 'MENTOR_ACC',
                isUnlocked: true,
                unlockedAt: now,
              },
            });
          unlockedNextModuleSlug = nextMod.slug;
        }
      }
    }

    return {
      submission: this.mapSubmission(updated),
      unlockedNextModuleSlug,
    };
  }

  async setManualUnlock(input: {
    userId: number;
    moduleId: number;
    unlocked: boolean;
  }): Promise<void> {
    const [userRow] = await this.db
      .select({ id: schema.users.id })
      .from(schema.users)
      .where(eq(schema.users.id, input.userId))
      .limit(1);
    const [modRow] = await this.db
      .select({ id: schema.modules.id })
      .from(schema.modules)
      .where(eq(schema.modules.id, input.moduleId))
      .limit(1);

    if (!userRow || !modRow) {
      throw new Error('NOT_FOUND');
    }

    const unlockedBy = input.unlocked ? 'MENTOR_MANUAL' : 'MENTOR_LOCKED';
    const now = new Date();
    await this.db
      .insert(schema.moduleUnlocks)
      .values({
        userId: input.userId,
        moduleId: input.moduleId,
        unlockedBy,
        isUnlocked: input.unlocked,
        unlockedAt: now,
      })
      .onConflictDoUpdate({
        target: [schema.moduleUnlocks.userId, schema.moduleUnlocks.moduleId],
        set: {
          unlockedBy,
          isUnlocked: input.unlocked,
          unlockedAt: now,
        },
      });
  }

  async updateModuleContent(
    moduleId: number,
    input: { summaryText?: string; taskPrompt?: string; taskDeliverables?: string[] },
  ): Promise<void> {
    await this.updateModule(moduleId, input);
  }

  async getAnalytics(): Promise<AnalyticsOverview> {
    const [userRows, moduleRows, submissionRows] = await Promise.all([
      this.db.select().from(schema.users),
      this.db.select().from(schema.modules).orderBy(asc(schema.modules.orderIndex)),
      this.db.select().from(schema.taskSubmissions),
    ]);

    return assembleAnalyticsOverview({
      allUsers: userRows.map((r) => this.mapUser(r)),
      allModules: moduleRows.map((r) => this.mapModule(r)),
      allSubmissions: submissionRows.map((r) => this.mapSubmission(r)),
    });
  }

  async createModule(input: CreateModuleInput): Promise<ModuleSummaryCard> {
    const slug = input.slug.trim();
    const [conflict] = await this.db
      .select({ id: schema.modules.id })
      .from(schema.modules)
      .where(or(eq(schema.modules.orderIndex, input.orderIndex), eq(schema.modules.slug, slug)))
      .limit(1);
    if (conflict) {
      throw new Error('MODULE_CONFLICT');
    }

    const [inserted] = await this.db
      .insert(schema.modules)
      .values({
        orderIndex: input.orderIndex,
        month: input.month,
        slug,
        code: input.code.trim(),
        sessionType: input.sessionType.trim(),
        title: input.title.trim(),
        subtitle: input.subtitle.trim(),
        summaryText: input.summaryText.trim(),
        taskPrompt: input.taskPrompt.trim(),
        taskDeliverables: [...input.taskDeliverables],
        accentGradient: input.accentGradient?.trim() || DEFAULT_ACCENT_GRADIENT,
        iconName: input.iconName?.trim() || DEFAULT_ICON_NAME,
      })
      .returning();

    return toAdminModuleCard(this.mapModule(inserted), []);
  }

  async updateModule(moduleId: number, input: UpdateModuleInput): Promise<ModuleSummaryCard> {
    const [existing] = await this.db
      .select()
      .from(schema.modules)
      .where(eq(schema.modules.id, moduleId))
      .limit(1);
    if (!existing) {
      throw new Error('MODULE_NOT_FOUND');
    }

    if (input.orderIndex !== undefined || input.slug !== undefined) {
      const nextOrder = input.orderIndex ?? existing.orderIndex;
      const nextSlug = input.slug !== undefined ? input.slug.trim() : existing.slug;
      const conflicts = await this.db
        .select({ id: schema.modules.id })
        .from(schema.modules)
        .where(or(eq(schema.modules.orderIndex, nextOrder), eq(schema.modules.slug, nextSlug)));
      if (conflicts.some((c) => c.id !== moduleId)) {
        throw new Error('MODULE_CONFLICT');
      }
    }

    const patch: Partial<typeof schema.modules.$inferInsert> = {};
    if (input.orderIndex !== undefined) patch.orderIndex = input.orderIndex;
    if (input.month !== undefined) patch.month = input.month;
    if (input.slug !== undefined) patch.slug = input.slug.trim();
    if (input.code !== undefined) patch.code = input.code.trim();
    if (input.sessionType !== undefined) patch.sessionType = input.sessionType.trim();
    if (input.title !== undefined) patch.title = input.title.trim();
    if (input.subtitle !== undefined) patch.subtitle = input.subtitle.trim();
    if (input.summaryText !== undefined) patch.summaryText = input.summaryText.trim();
    if (input.taskPrompt !== undefined) patch.taskPrompt = input.taskPrompt.trim();
    if (input.taskDeliverables !== undefined) patch.taskDeliverables = [...input.taskDeliverables];
    if (input.accentGradient !== undefined) patch.accentGradient = input.accentGradient.trim();
    if (input.iconName !== undefined) patch.iconName = input.iconName.trim();

    let updatedRow = existing;
    if (Object.keys(patch).length > 0) {
      const [row] = await this.db
        .update(schema.modules)
        .set(patch)
        .where(eq(schema.modules.id, moduleId))
        .returning();
      if (!row) throw new Error('MODULE_NOT_FOUND');
      updatedRow = row;
    }

    const slideRows = await this.db
      .select()
      .from(schema.slides)
      .where(eq(schema.slides.moduleId, moduleId));
    return toAdminModuleCard(
      this.mapModule(updatedRow),
      slideRows.map((r) => this.mapSlide(r)),
    );
  }

  async deleteModule(moduleId: number): Promise<void> {
    const [deleted] = await this.db
      .delete(schema.modules)
      .where(eq(schema.modules.id, moduleId))
      .returning({ id: schema.modules.id });
    if (!deleted) {
      throw new Error('MODULE_NOT_FOUND');
    }
  }

  async getModuleSlidesAdmin(moduleId: number): Promise<SlideItem[]> {
    const [mod] = await this.db
      .select({ id: schema.modules.id })
      .from(schema.modules)
      .where(eq(schema.modules.id, moduleId))
      .limit(1);
    if (!mod) {
      throw new Error('MODULE_NOT_FOUND');
    }

    const rows = await this.db
      .select()
      .from(schema.slides)
      .where(eq(schema.slides.moduleId, moduleId))
      .orderBy(asc(schema.slides.slideNumber));
    return rows.map((r) => this.mapSlide(r));
  }

  async createSlide(moduleId: number, input: CreateSlideInput): Promise<SlideItem> {
    const existingSlides = await this.getModuleSlidesAdmin(moduleId);
    const maxNum = existingSlides.reduce((m, s) => Math.max(m, s.slideNumber), 0);
    const targetNum =
      input.slideNumber !== undefined && input.slideNumber >= 1 ? input.slideNumber : maxNum + 1;

    if (existingSlides.some((s) => s.slideNumber === targetNum)) {
      const toShift = existingSlides
        .filter((s) => s.slideNumber >= targetNum)
        .sort((a, b) => b.slideNumber - a.slideNumber);
      for (const s of toShift) {
        await this.db
          .update(schema.slides)
          .set({ slideNumber: s.slideNumber + 1 })
          .where(eq(schema.slides.id, s.id));
      }
    }

    const [inserted] = await this.db
      .insert(schema.slides)
      .values({
        moduleId,
        slideNumber: targetNum,
        isSummary: input.isSummary,
        layoutType: input.layoutType,
        badge: input.badge.trim(),
        title: input.title.trim(),
        subtitle: input.subtitle.trim(),
        contentJson: input.contentJson as SlideContent,
      })
      .returning();

    return this.mapSlide(inserted);
  }

  async updateSlide(slideId: number, input: UpdateSlideInput): Promise<SlideItem> {
    const [existing] = await this.db
      .select()
      .from(schema.slides)
      .where(eq(schema.slides.id, slideId))
      .limit(1);
    if (!existing) {
      throw new Error('SLIDE_NOT_FOUND');
    }

    const patch: Partial<typeof schema.slides.$inferInsert> = {};
    if (input.isSummary !== undefined) patch.isSummary = input.isSummary;
    if (input.layoutType !== undefined) patch.layoutType = input.layoutType;
    if (input.badge !== undefined) patch.badge = input.badge.trim();
    if (input.title !== undefined) patch.title = input.title.trim();
    if (input.subtitle !== undefined) patch.subtitle = input.subtitle.trim();
    if (input.contentJson !== undefined) patch.contentJson = input.contentJson as SlideContent;

    if (
      input.slideNumber !== undefined &&
      input.slideNumber >= 1 &&
      input.slideNumber !== existing.slideNumber
    ) {
      const [conflict] = await this.db
        .select()
        .from(schema.slides)
        .where(
          and(
            eq(schema.slides.moduleId, existing.moduleId),
            eq(schema.slides.slideNumber, input.slideNumber),
          ),
        )
        .limit(1);

      if (conflict && conflict.id !== existing.id) {
        await this.db
          .update(schema.slides)
          .set({ slideNumber: -existing.id })
          .where(eq(schema.slides.id, existing.id));
        await this.db
          .update(schema.slides)
          .set({ slideNumber: existing.slideNumber })
          .where(eq(schema.slides.id, conflict.id));
      }
      patch.slideNumber = input.slideNumber;
    }

    if (Object.keys(patch).length === 0) {
      return this.mapSlide(existing);
    }

    const [updated] = await this.db
      .update(schema.slides)
      .set(patch)
      .where(eq(schema.slides.id, slideId))
      .returning();
    if (!updated) {
      throw new Error('SLIDE_NOT_FOUND');
    }
    return this.mapSlide(updated);
  }

  async deleteSlide(slideId: number): Promise<void> {
    const [deleted] = await this.db
      .delete(schema.slides)
      .where(eq(schema.slides.id, slideId))
      .returning({ id: schema.slides.id, moduleId: schema.slides.moduleId });
    if (!deleted) {
      throw new Error('SLIDE_NOT_FOUND');
    }

    const remaining = await this.db
      .select()
      .from(schema.slides)
      .where(eq(schema.slides.moduleId, deleted.moduleId))
      .orderBy(asc(schema.slides.slideNumber));

    const needsTemp = remaining.some((r, idx) => r.slideNumber < idx + 1);
    if (needsTemp) {
      for (let i = 0; i < remaining.length; i += 1) {
        if (remaining[i].slideNumber !== i + 1) {
          await this.db
            .update(schema.slides)
            .set({ slideNumber: -remaining[i].id })
            .where(eq(schema.slides.id, remaining[i].id));
        }
      }
    }

    for (let i = 0; i < remaining.length; i += 1) {
      if (remaining[i].slideNumber !== i + 1) {
        await this.db
          .update(schema.slides)
          .set({ slideNumber: i + 1 })
          .where(eq(schema.slides.id, remaining[i].id));
      }
    }
  }
}

class LocalJsonRepository implements BootcampRepository {
  readonly kind = 'local' as const;
  private writeQueue: Promise<unknown> = Promise.resolve();

  constructor(private readonly filePath: string) {}

  private async readSnapshot(): Promise<LocalDbSnapshot> {
    try {
      const raw = await fs.readFile(this.filePath, 'utf8');
      return JSON.parse(raw) as LocalDbSnapshot;
    } catch {
      return {
        counters: {
          users: 0,
          modules: 0,
          slides: 0,
          taskSubmissions: 0,
          moduleUnlocks: 0,
        },
        users: [],
        modules: [],
        slides: [],
        taskSubmissions: [],
        moduleUnlocks: [],
      };
    }
  }

  private async writeSnapshot(snapshot: LocalDbSnapshot): Promise<void> {
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });
    await fs.writeFile(this.filePath, JSON.stringify(snapshot, null, 2), 'utf8');
  }

  private withWriteLock<T>(fn: (db: LocalDbSnapshot) => Promise<T> | T): Promise<T> {
    const run = this.writeQueue.then(async () => {
      const db = await this.readSnapshot();
      const result = await fn(db);
      await this.writeSnapshot(db);
      return result;
    });
    this.writeQueue = run.catch(() => undefined);
    return run;
  }

  async ensureSeeded(
    seedModules: SeedModuleInput[],
    mentorUser: { name: string; email: string; schoolOrigin: string; role: 'mentor' },
  ): Promise<{ totalModules: number; totalSlides: number }> {
    return this.withWriteLock((db) => {
      const email = normalizeEmail(mentorUser.email);
      const existingMentor = db.users.find((u) => u.email === email);
      if (existingMentor) {
        existingMentor.name = mentorUser.name;
        existingMentor.schoolOrigin = mentorUser.schoolOrigin;
        existingMentor.role = 'mentor';
      } else {
        db.counters.users += 1;
        db.users.push({
          id: db.counters.users,
          name: mentorUser.name,
          email,
          schoolOrigin: mentorUser.schoolOrigin,
          role: 'mentor',
          createdAt: new Date().toISOString(),
        });
      }

      let totalSlides = 0;

      for (const seedMod of seedModules) {
        let mod = db.modules.find((m) => m.orderIndex === seedMod.orderIndex);
        if (mod) {
          mod.month = seedMod.month;
          mod.slug = seedMod.slug;
          mod.code = seedMod.code;
          mod.sessionType = seedMod.sessionType;
          mod.title = seedMod.title;
          mod.subtitle = seedMod.subtitle;
          mod.summaryText = seedMod.summaryText;
          mod.taskPrompt = seedMod.taskPrompt;
          mod.taskDeliverables = [...seedMod.taskDeliverables];
          mod.accentGradient = seedMod.accentGradient;
          mod.iconName = seedMod.iconName;
        } else {
          db.counters.modules += 1;
          mod = {
            id: db.counters.modules,
            orderIndex: seedMod.orderIndex,
            month: seedMod.month,
            slug: seedMod.slug,
            code: seedMod.code,
            sessionType: seedMod.sessionType,
            title: seedMod.title,
            subtitle: seedMod.subtitle,
            summaryText: seedMod.summaryText,
            taskPrompt: seedMod.taskPrompt,
            taskDeliverables: [...seedMod.taskDeliverables],
            accentGradient: seedMod.accentGradient,
            iconName: seedMod.iconName,
          };
          db.modules.push(mod);
        }

        const modId = mod.id;
        const incomingNumbers = new Set(seedMod.slides.map((s) => s.slideNumber));
        db.slides = db.slides.filter(
          (s) => s.moduleId !== modId || incomingNumbers.has(s.slideNumber),
        );

        for (const seedSlide of seedMod.slides) {
          const existingSlide = db.slides.find(
            (s) => s.moduleId === modId && s.slideNumber === seedSlide.slideNumber,
          );
          if (existingSlide) {
            existingSlide.isSummary = seedSlide.isSummary;
            existingSlide.layoutType = seedSlide.layoutType;
            existingSlide.badge = seedSlide.badge;
            existingSlide.title = seedSlide.title;
            existingSlide.subtitle = seedSlide.subtitle;
            existingSlide.contentJson = seedSlide.contentJson;
          } else {
            db.counters.slides += 1;
            db.slides.push({
              id: db.counters.slides,
              moduleId: modId,
              slideNumber: seedSlide.slideNumber,
              isSummary: seedSlide.isSummary,
              layoutType: seedSlide.layoutType,
              badge: seedSlide.badge,
              title: seedSlide.title,
              subtitle: seedSlide.subtitle,
              contentJson: seedSlide.contentJson,
            });
          }
          totalSlides += 1;
        }
      }

      return { totalModules: seedModules.length, totalSlides };
    });
  }

  async getUserById(id: number): Promise<PublicUser | null> {
    const db = await this.readSnapshot();
    const row = db.users.find((u) => u.id === id);
    return row ? toPublicUser(row) : null;
  }

  async getBootstrapData(
    user: PublicUser | null,
    mentorProfile: MentorProfile,
  ): Promise<BootstrapResponse> {
    const db = await this.readSnapshot();
    const userUnlocks = user ? db.moduleUnlocks.filter((u) => u.userId === user.id) : [];

    return assembleBootstrapResponse({
      user,
      mentorProfile,
      allUsers: db.users,
      allModules: db.modules,
      allSlides: db.slides,
      allSubmissions: db.taskSubmissions,
      userUnlocks,
    });
  }

  async getModuleDetail(
    slug: string,
    user: PublicUser | null,
    mentorProfile: MentorProfile,
  ): Promise<ModuleDetailResponse | null> {
    const db = await this.readSnapshot();
    const targetModule = db.modules.find((m) => m.slug === slug);
    if (!targetModule) return null;

    const moduleSlides = db.slides.filter((s) => s.moduleId === targetModule.id);
    const userSubmissions = user ? db.taskSubmissions.filter((s) => s.userId === user.id) : [];
    const userUnlocks = user ? db.moduleUnlocks.filter((u) => u.userId === user.id) : [];

    return assembleModuleDetailResponse({
      targetModule,
      user,
      mentorProfile,
      allModules: db.modules,
      moduleSlides,
      userSubmissions,
      userUnlocks,
    });
  }

  async registerStudent(input: {
    name: string;
    email: string;
    schoolOrigin: string;
    password: string;
  }): Promise<PublicUser> {
    return this.withWriteLock((db) => {
      const email = normalizeEmail(input.email);
      const name = input.name.trim();
      const schoolOrigin = input.schoolOrigin.trim();
      const passwordHash = hashPassword(input.password);

      let student = db.users.find((u) => u.email === email);
      if (student) {
        if (student.role === 'mentor') {
          throw new Error('MENTOR_EMAIL_CONFLICT');
        }
        if (student.passwordHash && student.passwordHash.trim().length > 0) {
          throw new Error('EMAIL_ALREADY_REGISTERED');
        }
        student.name = name;
        student.schoolOrigin = schoolOrigin;
        student.passwordHash = passwordHash;
      } else {
        db.counters.users += 1;
        student = {
          id: db.counters.users,
          name,
          email,
          schoolOrigin,
          passwordHash,
          role: 'user',
          createdAt: new Date().toISOString(),
        };
        db.users.push(student);
      }

      const p01 = db.modules.find((m) => m.orderIndex === 1);
      if (p01) {
        const existingUnlock = db.moduleUnlocks.find(
          (u) => u.userId === student!.id && u.moduleId === p01.id,
        );
        if (!existingUnlock) {
          db.counters.moduleUnlocks += 1;
          db.moduleUnlocks.push({
            id: db.counters.moduleUnlocks,
            userId: student.id,
            moduleId: p01.id,
            unlockedBy: 'SYSTEM_INITIAL',
            isUnlocked: true,
            unlockedAt: new Date().toISOString(),
          });
        }
      }

      return toPublicUser(student);
    });
  }

  async loginStudent(input: { email: string; password: string }): Promise<PublicUser | null> {
    const db = await this.readSnapshot();
    const email = normalizeEmail(input.email);
    const student = db.users.find((u) => u.email === email && u.role === 'user');
    if (!student || !student.passwordHash) return null;
    if (!verifyPassword(input.password, student.passwordHash)) return null;
    return toPublicUser(student);
  }

  async verifyMentorLogin(input: { email: string; passcode: string }): Promise<PublicUser | null> {
    if (input.passcode !== getMentorPasscode()) {
      return null;
    }
    const db = await this.readSnapshot();
    const email = normalizeEmail(input.email);
    const mentor = db.users.find((u) => u.email === email && u.role === 'mentor');
    return mentor ? toPublicUser(mentor) : null;
  }

  async submitTask(
    userId: number,
    input: { moduleId: number; repoUrl: string; demoUrl?: string | null; learningLog: string },
  ): Promise<TaskSubmissionItem> {
    return this.withWriteLock((db) => {
      const user = db.users.find((u) => u.id === userId);
      if (!user || user.role !== 'user') {
        throw new Error('FORBIDDEN_USER');
      }

      const mod = db.modules.find((m) => m.id === input.moduleId);
      if (!mod) {
        throw new Error('MODULE_NOT_FOUND');
      }
      if (mod.orderIndex < 1 || mod.slug === 'pustaka-learning-hub') {
        throw new Error('MODULE_NOT_SUBMITTABLE');
      }

      let prevStatus: SubmissionStatus | null = null;
      if (mod.orderIndex >= 2) {
        const prevMod = db.modules.find((m) => m.orderIndex === mod.orderIndex - 1);
        if (prevMod) {
          const prevSub = db.taskSubmissions.find(
            (s) => s.userId === userId && s.moduleId === prevMod.id,
          );
          prevStatus = prevSub?.status ?? null;
        }
      }

      const unlock = db.moduleUnlocks.find(
        (u) => u.userId === userId && u.moduleId === mod.id,
      );

      const access = evaluateModuleAccess({
        user: toPublicUser(user),
        moduleOrderIndex: mod.orderIndex,
        isReferenceModule: mod.orderIndex === 0 || mod.slug === 'pustaka-learning-hub',
        prevModuleSubmissionStatus: prevStatus,
        unlockOverride: unlock
          ? { isUnlocked: unlock.isUnlocked, unlockedBy: unlock.unlockedBy }
          : null,
      });

      if (access.accessLevel !== 'FULL_ACCESS' || !access.canSubmitTask) {
        throw new Error('MODULE_LOCKED');
      }

      const nowIso = new Date().toISOString();
      const existing = db.taskSubmissions.find(
        (s) => s.userId === userId && s.moduleId === mod.id,
      );
      if (existing) {
        existing.repoUrl = input.repoUrl;
        existing.demoUrl = input.demoUrl ?? null;
        existing.learningLog = input.learningLog;
        existing.status = 'pending';
        existing.mentorFeedback = null;
        existing.reviewedBy = null;
        existing.submittedAt = nowIso;
        existing.reviewedAt = null;
        return { ...existing };
      }

      db.counters.taskSubmissions += 1;
      const created: StoredSubmission = {
        id: db.counters.taskSubmissions,
        userId,
        moduleId: mod.id,
        repoUrl: input.repoUrl,
        demoUrl: input.demoUrl ?? null,
        learningLog: input.learningLog,
        status: 'pending',
        mentorFeedback: null,
        reviewedBy: null,
        submittedAt: nowIso,
        reviewedAt: null,
      };
      db.taskSubmissions.push(created);
      return { ...created };
    });
  }

  async getMentorDashboard(mentor: PublicUser): Promise<MentorDashboardResponse> {
    const db = await this.readSnapshot();
    return assembleMentorDashboardResponse({
      mentor,
      allUsers: db.users,
      allModules: db.modules,
      allSubmissions: db.taskSubmissions,
      allUnlocks: db.moduleUnlocks,
    });
  }

  async reviewSubmission(input: {
    submissionId: number;
    status: 'approved' | 'revision';
    mentorFeedback: string;
    reviewerName: string;
  }): Promise<{ submission: TaskSubmissionItem; unlockedNextModuleSlug: string | null }> {
    return this.withWriteLock((db) => {
      const submission = db.taskSubmissions.find((s) => s.id === input.submissionId);
      if (!submission) {
        throw new Error('SUBMISSION_NOT_FOUND');
      }

      const nowIso = new Date().toISOString();
      submission.status = input.status;
      submission.mentorFeedback = input.mentorFeedback;
      submission.reviewedBy = input.reviewerName;
      submission.reviewedAt = nowIso;

      let unlockedNextModuleSlug: string | null = null;
      if (input.status === 'approved') {
        const currentMod = db.modules.find((m) => m.id === submission.moduleId);
        if (currentMod && currentMod.orderIndex >= 1 && currentMod.slug !== 'pustaka-learning-hub') {
          const nextMod = db.modules.find((m) => m.orderIndex === currentMod.orderIndex + 1);
          if (nextMod && nextMod.slug !== 'pustaka-learning-hub') {
            const existingUnlock = db.moduleUnlocks.find(
              (u) => u.userId === submission.userId && u.moduleId === nextMod.id,
            );
            if (existingUnlock) {
              existingUnlock.unlockedBy = 'MENTOR_ACC';
              existingUnlock.isUnlocked = true;
              existingUnlock.unlockedAt = nowIso;
            } else {
              db.counters.moduleUnlocks += 1;
              db.moduleUnlocks.push({
                id: db.counters.moduleUnlocks,
                userId: submission.userId,
                moduleId: nextMod.id,
                unlockedBy: 'MENTOR_ACC',
                isUnlocked: true,
                unlockedAt: nowIso,
              });
            }
            unlockedNextModuleSlug = nextMod.slug;
          }
        }
      }

      return {
        submission: { ...submission },
        unlockedNextModuleSlug,
      };
    });
  }

  async setManualUnlock(input: {
    userId: number;
    moduleId: number;
    unlocked: boolean;
  }): Promise<void> {
    return this.withWriteLock((db) => {
      const userExists = db.users.some((u) => u.id === input.userId);
      const modExists = db.modules.some((m) => m.id === input.moduleId);
      if (!userExists || !modExists) {
        throw new Error('NOT_FOUND');
      }

      const unlockedBy = input.unlocked ? 'MENTOR_MANUAL' : 'MENTOR_LOCKED';
      const nowIso = new Date().toISOString();
      const existing = db.moduleUnlocks.find(
        (u) => u.userId === input.userId && u.moduleId === input.moduleId,
      );
      if (existing) {
        existing.unlockedBy = unlockedBy;
        existing.isUnlocked = input.unlocked;
        existing.unlockedAt = nowIso;
      } else {
        db.counters.moduleUnlocks += 1;
        db.moduleUnlocks.push({
          id: db.counters.moduleUnlocks,
          userId: input.userId,
          moduleId: input.moduleId,
          unlockedBy,
          isUnlocked: input.unlocked,
          unlockedAt: nowIso,
        });
      }
    });
  }

  async updateModuleContent(
    moduleId: number,
    input: { summaryText?: string; taskPrompt?: string; taskDeliverables?: string[] },
  ): Promise<void> {
    await this.updateModule(moduleId, input);
  }

  async getAnalytics(): Promise<AnalyticsOverview> {
    const db = await this.readSnapshot();
    return assembleAnalyticsOverview({
      allUsers: db.users,
      allModules: db.modules,
      allSubmissions: db.taskSubmissions,
    });
  }

  async createModule(input: CreateModuleInput): Promise<ModuleSummaryCard> {
    return this.withWriteLock((db) => {
      const slug = input.slug.trim();
      if (db.modules.some((m) => m.orderIndex === input.orderIndex || m.slug === slug)) {
        throw new Error('MODULE_CONFLICT');
      }

      db.counters.modules += 1;
      const mod: StoredModule = {
        id: db.counters.modules,
        orderIndex: input.orderIndex,
        month: input.month,
        slug,
        code: input.code.trim(),
        sessionType: input.sessionType.trim(),
        title: input.title.trim(),
        subtitle: input.subtitle.trim(),
        summaryText: input.summaryText.trim(),
        taskPrompt: input.taskPrompt.trim(),
        taskDeliverables: [...input.taskDeliverables],
        accentGradient: input.accentGradient?.trim() || DEFAULT_ACCENT_GRADIENT,
        iconName: input.iconName?.trim() || DEFAULT_ICON_NAME,
      };
      db.modules.push(mod);
      return toAdminModuleCard(mod, []);
    });
  }

  async updateModule(moduleId: number, input: UpdateModuleInput): Promise<ModuleSummaryCard> {
    return this.withWriteLock((db) => {
      const mod = db.modules.find((m) => m.id === moduleId);
      if (!mod) {
        throw new Error('MODULE_NOT_FOUND');
      }

      const nextOrder = input.orderIndex ?? mod.orderIndex;
      const nextSlug = input.slug !== undefined ? input.slug.trim() : mod.slug;
      if (
        db.modules.some(
          (m) => m.id !== moduleId && (m.orderIndex === nextOrder || m.slug === nextSlug),
        )
      ) {
        throw new Error('MODULE_CONFLICT');
      }

      if (input.orderIndex !== undefined) mod.orderIndex = input.orderIndex;
      if (input.month !== undefined) mod.month = input.month;
      if (input.slug !== undefined) mod.slug = nextSlug;
      if (input.code !== undefined) mod.code = input.code.trim();
      if (input.sessionType !== undefined) mod.sessionType = input.sessionType.trim();
      if (input.title !== undefined) mod.title = input.title.trim();
      if (input.subtitle !== undefined) mod.subtitle = input.subtitle.trim();
      if (input.summaryText !== undefined) mod.summaryText = input.summaryText.trim();
      if (input.taskPrompt !== undefined) mod.taskPrompt = input.taskPrompt.trim();
      if (input.taskDeliverables !== undefined) mod.taskDeliverables = [...input.taskDeliverables];
      if (input.accentGradient !== undefined) mod.accentGradient = input.accentGradient.trim();
      if (input.iconName !== undefined) mod.iconName = input.iconName.trim();

      const slidesForMod = db.slides.filter((s) => s.moduleId === moduleId);
      return toAdminModuleCard(mod, slidesForMod);
    });
  }

  async deleteModule(moduleId: number): Promise<void> {
    return this.withWriteLock((db) => {
      const idx = db.modules.findIndex((m) => m.id === moduleId);
      if (idx === -1) {
        throw new Error('MODULE_NOT_FOUND');
      }
      db.modules.splice(idx, 1);
      db.slides = db.slides.filter((s) => s.moduleId !== moduleId);
      db.taskSubmissions = db.taskSubmissions.filter((s) => s.moduleId !== moduleId);
      db.moduleUnlocks = db.moduleUnlocks.filter((u) => u.moduleId !== moduleId);
    });
  }

  async getModuleSlidesAdmin(moduleId: number): Promise<SlideItem[]> {
    const db = await this.readSnapshot();
    if (!db.modules.some((m) => m.id === moduleId)) {
      throw new Error('MODULE_NOT_FOUND');
    }
    return db.slides
      .filter((s) => s.moduleId === moduleId)
      .sort((a, b) => a.slideNumber - b.slideNumber)
      .map((s) => ({ ...s }));
  }

  async createSlide(moduleId: number, input: CreateSlideInput): Promise<SlideItem> {
    return this.withWriteLock((db) => {
      if (!db.modules.some((m) => m.id === moduleId)) {
        throw new Error('MODULE_NOT_FOUND');
      }

      const modSlides = db.slides.filter((s) => s.moduleId === moduleId);
      const maxNum = modSlides.reduce((m, s) => Math.max(m, s.slideNumber), 0);
      const targetNum =
        input.slideNumber !== undefined && input.slideNumber >= 1 ? input.slideNumber : maxNum + 1;

      if (modSlides.some((s) => s.slideNumber === targetNum)) {
        for (const s of modSlides) {
          if (s.slideNumber >= targetNum) {
            s.slideNumber += 1;
          }
        }
      }

      db.counters.slides += 1;
      const created: StoredSlide = {
        id: db.counters.slides,
        moduleId,
        slideNumber: targetNum,
        isSummary: input.isSummary,
        layoutType: input.layoutType,
        badge: input.badge.trim(),
        title: input.title.trim(),
        subtitle: input.subtitle.trim(),
        contentJson: input.contentJson,
      };
      db.slides.push(created);
      return { ...created };
    });
  }

  async updateSlide(slideId: number, input: UpdateSlideInput): Promise<SlideItem> {
    return this.withWriteLock((db) => {
      const slide = db.slides.find((s) => s.id === slideId);
      if (!slide) {
        throw new Error('SLIDE_NOT_FOUND');
      }

      if (
        input.slideNumber !== undefined &&
        input.slideNumber >= 1 &&
        input.slideNumber !== slide.slideNumber
      ) {
        const conflict = db.slides.find(
          (s) =>
            s.moduleId === slide.moduleId &&
            s.id !== slide.id &&
            s.slideNumber === input.slideNumber,
        );
        if (conflict) {
          conflict.slideNumber = slide.slideNumber;
        }
        slide.slideNumber = input.slideNumber;
      }

      if (input.isSummary !== undefined) slide.isSummary = input.isSummary;
      if (input.layoutType !== undefined) slide.layoutType = input.layoutType;
      if (input.badge !== undefined) slide.badge = input.badge.trim();
      if (input.title !== undefined) slide.title = input.title.trim();
      if (input.subtitle !== undefined) slide.subtitle = input.subtitle.trim();
      if (input.contentJson !== undefined) slide.contentJson = input.contentJson;

      return { ...slide };
    });
  }

  async deleteSlide(slideId: number): Promise<void> {
    return this.withWriteLock((db) => {
      const idx = db.slides.findIndex((s) => s.id === slideId);
      if (idx === -1) {
        throw new Error('SLIDE_NOT_FOUND');
      }
      const { moduleId } = db.slides[idx];
      db.slides.splice(idx, 1);

      const remaining = db.slides
        .filter((s) => s.moduleId === moduleId)
        .sort((a, b) => a.slideNumber - b.slideNumber);
      remaining.forEach((s, i) => {
        s.slideNumber = i + 1;
      });
    });
  }
}

export async function createBootcampRepository(options?: {
  databaseUrl?: string;
  localFilePath?: string;
  forceLocal?: boolean;
}): Promise<BootcampRepository> {
  const databaseUrl = options?.databaseUrl ?? process.env.DATABASE_URL;
  const localFilePath =
    options?.localFilePath ?? path.resolve(process.cwd(), '.data/bootcamp-db.json');
  const forceLocal = options?.forceLocal ?? false;

  if (!forceLocal && databaseUrl && databaseUrl.startsWith('postgres')) {
    try {
      const sql = neon(databaseUrl);
      await sql`SELECT 1`;
      const db = drizzle(sql, { schema });
      return new NeonDrizzleRepository(db);
    } catch {
      console.warn(
        '[repository] Neon PostgreSQL connection failed; falling back to local JSON repository.',
      );
    }
  }

  return new LocalJsonRepository(localFilePath);
}
