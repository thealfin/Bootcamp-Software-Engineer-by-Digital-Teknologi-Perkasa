export type UserRole = 'user' | 'mentor';

export type AccessLevel = 'SUMMARY_ONLY' | 'LOCKED_PREV_TASK' | 'FULL_ACCESS';

export type SubmissionStatus = 'pending' | 'approved' | 'revision';

export type SlideLayoutType =
  | 'cover'
  | 'summary'
  | 'bento'
  | 'comparison'
  | 'practice'
  | 'quiz'
  | 'references'
  | 'task';

export interface CodeBlock {
  title?: string;
  language: string;
  filename?: string;
  snippet: string;
}

export interface BentoCard {
  title: string;
  description: string;
  tag?: string;
  bullets?: string[];
  code?: CodeBlock;
}

export interface ComparisonPayload {
  badTitle: string;
  badPoints: string[];
  badCode?: CodeBlock;
  goodTitle: string;
  goodPoints: string[];
  goodCode?: CodeBlock;
}

export interface PracticeStep {
  step: number;
  title: string;
  description: string;
  command?: string;
  code?: string;
}

export interface QuizItem {
  question: string;
  hint?: string;
  answer: string;
}

export interface ReferenceItem {
  title: string;
  url: string;
  author?: string;
  category: string;
  lang: 'ID' | 'EN';
  type: 'Book' | 'Course' | 'PBL' | 'Docs';
}

export interface WeeklyAssignment {
  week: number;
  title: string;
  description: string;
}

export interface SlideContent {
  eyebrow?: string;
  highlights: string[];
  stats?: { label: string; value: string }[];
  bentoCards?: BentoCard[];
  comparison?: ComparisonPayload;
  codeBlocks?: CodeBlock[];
  practiceSteps?: PracticeStep[];
  quizItems?: QuizItem[];
  references?: ReferenceItem[];
  weeklyAssignment?: WeeklyAssignment;
  competencyChecklist?: string[];
  deliverables?: string[];
  learningLogFields?: string[];
  mentorTip?: string;
}

export interface PublicUser {
  id: number;
  name: string;
  email: string;
  schoolOrigin: string;
  role: UserRole;
  createdAt: string;
}

export interface MentorProjectShowcase {
  name: string;
  year: string;
  description: string;
  stack: string[];
}

export interface MentorProfile {
  name: string;
  roleTitle: string;
  company: string;
  division: string;
  tagline: string;
  specializations: string[];
  projects: MentorProjectShowcase[];
  contacts: {
    websites: string[];
    whatsapp: string;
    email: string;
    cvUrl: string;
  };
}

export interface ModuleSummaryCard {
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
  totalSlides: number;
  summarySlides: number;
  accessLevel: AccessLevel;
  accessReason: string;
  submissionStatus: SubmissionStatus | null;
  mentorFeedback: string | null;
  isManualOverride: boolean;
}

export interface SlideItem {
  id: number;
  moduleId: number;
  slideNumber: number;
  isSummary: boolean;
  layoutType: SlideLayoutType;
  badge: string;
  title: string;
  subtitle: string;
  contentJson: SlideContent;
}

export interface TaskSubmissionItem {
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

export interface PrevModuleInfo {
  id: number;
  orderIndex: number;
  slug: string;
  code: string;
  title: string;
  submissionStatus: SubmissionStatus | null;
  mentorFeedback: string | null;
}

export interface BootstrapResponse {
  user: PublicUser | null;
  mentorProfile: MentorProfile;
  stats: {
    totalStudents: number;
    totalModules: number;
    formalMeetings: number;
    pendingReviews: number;
    approvedReviews: number;
  };
  modules: ModuleSummaryCard[];
}

export interface ModuleDetailResponse {
  user: PublicUser | null;
  mentorProfile: MentorProfile;
  module: ModuleSummaryCard;
  slides: SlideItem[];
  totalSlidesCount: number;
  summarySlidesCount: number;
  accessLevel: AccessLevel;
  accessReason: string;
  canSubmitTask: boolean;
  submission: TaskSubmissionItem | null;
  prevModule: PrevModuleInfo | null;
  nextModule: {
    slug: string;
    code: string;
    title: string;
    accessLevel: AccessLevel;
  } | null;
}

export interface MentorQueueItem extends TaskSubmissionItem {
  userName: string;
  userEmail: string;
  userSchoolOrigin: string;
  moduleOrderIndex: number;
  moduleCode: string;
  moduleSlug: string;
  moduleTitle: string;
}

export interface StudentMatrixRow {
  user: PublicUser;
  modules: {
    moduleId: number;
    orderIndex: number;
    code: string;
    slug: string;
    accessLevel: AccessLevel;
    submissionStatus: SubmissionStatus | null;
    isManualOverride: boolean;
    unlockedBy: string | null;
  }[];
  approvedCount: number;
  pendingCount: number;
  revisionCount: number;
}

export interface MentorDashboardResponse {
  mentor: PublicUser;
  kpis: {
    totalStudents: number;
    pendingCount: number;
    approvedCount: number;
    revisionCount: number;
    avgCompletionPercent: number;
  };
  queue: MentorQueueItem[];
  studentsMatrix: StudentMatrixRow[];
  modules: {
    id: number;
    orderIndex: number;
    month: number;
    code: string;
    slug: string;
    sessionType: string;
    title: string;
    subtitle: string;
    summaryText: string;
    taskPrompt: string;
    taskDeliverables: string[];
    accentGradient: string;
    iconName: string;
  }[];
}

export interface CreateModuleInput {
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
  accentGradient?: string;
  iconName?: string;
}

export type UpdateModuleInput = Partial<CreateModuleInput>;

export interface CreateSlideInput {
  slideNumber?: number;
  isSummary: boolean;
  layoutType: SlideLayoutType;
  badge: string;
  title: string;
  subtitle: string;
  contentJson: SlideContent;
}

export type UpdateSlideInput = Partial<CreateSlideInput>;

export interface AnalyticsOverview {
  kpis: {
    totalStudents: number;
    activeStudents7d: number;
    avgProgressPercent: number;
    avgReviewHours: number;
    revisionRatePercent: number;
    totalSubmissions: number;
  };
  studentPerformance: {
    userId: number;
    name: string;
    email: string;
    schoolOrigin: string;
    approvedCount: number;
    pendingCount: number;
    revisionCount: number;
    progressPercent: number;
    lastSubmittedAt: string | null;
  }[];
  moduleDifficulty: {
    moduleId: number;
    code: string;
    title: string;
    submissionsCount: number;
    approvedCount: number;
    revisionCount: number;
    revisionRatePercent: number;
  }[];
  schoolBreakdown: {
    schoolOrigin: string;
    studentCount: number;
    avgProgressPercent: number;
  }[];
  weeklyTrend: {
    weekLabel: string;
    submissions: number;
    approvals: number;
  }[];
}

export interface SeedSlideInput {
  slideNumber: number;
  isSummary: boolean;
  layoutType: SlideLayoutType;
  badge: string;
  title: string;
  subtitle: string;
  contentJson: SlideContent;
}

export interface SeedModuleInput {
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
  slides: SeedSlideInput[];
}
