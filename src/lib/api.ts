import { useMutation, useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query';
import type {
  AnalyticsOverview,
  BootstrapResponse,
  CreateModuleInput,
  CreateSlideInput,
  MentorDashboardResponse,
  ModuleDetailResponse,
  ModuleSummaryCard,
  PublicUser,
  SlideItem,
  SubmissionStatus,
  TaskSubmissionItem,
  UpdateModuleInput,
  UpdateSlideInput,
} from '../types/bootcamp';

export type {
  AnalyticsOverview,
  CreateModuleInput,
  CreateSlideInput,
  UpdateModuleInput,
  UpdateSlideInput,
};

export const queryKeys = {
  bootstrap: ['bootstrap'] as const,
  module: (slug: string) => ['module', slug] as const,
  mentorDashboard: ['mentor-dashboard'] as const,
  adminAnalytics: ['admin-analytics'] as const,
  adminModuleSlides: (moduleId: number) => ['admin-module-slides', moduleId] as const,
};

async function apiRequest<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    credentials: 'include',
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  const text = await response.text();
  let parsed: unknown = null;
  if (text) {
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = null;
    }
  }

  if (!response.ok) {
    const errObj =
      parsed && typeof parsed === 'object' && !Array.isArray(parsed)
        ? (parsed as Record<string, unknown>)
        : null;
    const message =
      (errObj && typeof errObj.error === 'string' && errObj.error) ||
      (errObj && typeof errObj.message === 'string' && errObj.message) ||
      `Permintaan gagal (${response.status})`;
    throw new Error(message);
  }

  return (parsed ?? {}) as T;
}

async function invalidateBootcampQueries(
  queryClient: QueryClient,
  options?: { slides?: boolean; analytics?: boolean },
) {
  const tasks: Promise<unknown>[] = [
    queryClient.invalidateQueries({ queryKey: queryKeys.bootstrap }),
    queryClient.invalidateQueries({ queryKey: ['module'] }),
    queryClient.invalidateQueries({ queryKey: queryKeys.mentorDashboard }),
  ];
  if (options?.analytics) {
    tasks.push(queryClient.invalidateQueries({ queryKey: queryKeys.adminAnalytics }));
  }
  if (options?.slides) {
    tasks.push(queryClient.invalidateQueries({ queryKey: ['admin-module-slides'] }));
  }
  await Promise.all(tasks);
}

export function fetchBootstrap(): Promise<BootstrapResponse> {
  return apiRequest<BootstrapResponse>('/api/bootstrap', { method: 'GET' });
}

export function fetchModuleDetail(slug: string): Promise<ModuleDetailResponse> {
  return apiRequest<ModuleDetailResponse>(`/api/modules/${encodeURIComponent(slug)}`, {
    method: 'GET',
  });
}

export function fetchMentorDashboard(): Promise<MentorDashboardResponse> {
  return apiRequest<MentorDashboardResponse>('/api/mentor/dashboard', {
    method: 'GET',
  });
}

export function fetchAdminAnalytics(): Promise<AnalyticsOverview> {
  return apiRequest<AnalyticsOverview>('/api/admin/analytics', {
    method: 'GET',
  });
}

export async function fetchAdminModuleSlides(
  moduleId: number,
): Promise<{ slides: SlideItem[] }> {
  const res = await apiRequest<{ slides?: SlideItem[] } | SlideItem[]>(
    `/api/admin/modules/${moduleId}/slides`,
    { method: 'GET' },
  );
  if (Array.isArray(res)) {
    return { slides: res };
  }
  return { slides: Array.isArray(res.slides) ? res.slides : [] };
}

export function useBootstrap() {
  return useQuery({
    queryKey: queryKeys.bootstrap,
    queryFn: fetchBootstrap,
  });
}

export function useModuleDetail(slug: string) {
  return useQuery({
    queryKey: queryKeys.module(slug),
    queryFn: () => fetchModuleDetail(slug),
    enabled: Boolean(slug),
  });
}

export function useMentorDashboard(enabled = true) {
  return useQuery({
    queryKey: queryKeys.mentorDashboard,
    queryFn: fetchMentorDashboard,
    enabled,
  });
}

export function useAdminAnalytics(enabled = true) {
  return useQuery({
    queryKey: queryKeys.adminAnalytics,
    queryFn: fetchAdminAnalytics,
    enabled,
  });
}

export function useAdminModuleSlides(moduleId: number | null) {
  return useQuery({
    queryKey: queryKeys.adminModuleSlides(moduleId ?? 0),
    queryFn: () => fetchAdminModuleSlides(moduleId!),
    enabled: typeof moduleId === 'number' && moduleId > 0,
  });
}

export interface RegisterPayload {
  name: string;
  email: string;
  schoolOrigin: string;
  password: string;
}

export interface StudentLoginPayload {
  email: string;
  password: string;
}

export interface MentorLoginPayload {
  email: string;
  passcode: string;
}

export interface SubmitTaskPayload {
  moduleId: number;
  repoUrl: string;
  demoUrl?: string;
  learningLog: string;
}

export interface MentorReviewPayload {
  submissionId: number;
  status: Extract<SubmissionStatus, 'approved' | 'revision'>;
  mentorFeedback: string;
}

export interface MentorUnlockPayload {
  userId: number;
  moduleId: number;
  unlocked: boolean;
}

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RegisterPayload) =>
      apiRequest<{ user: PublicUser }>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    onSuccess: async () => {
      await invalidateBootcampQueries(queryClient, { analytics: true });
    },
  });
}

export function useStudentLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: StudentLoginPayload) =>
      apiRequest<{ user: PublicUser }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    onSuccess: async () => {
      await invalidateBootcampQueries(queryClient);
    },
  });
}

export function useMentorLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: MentorLoginPayload) =>
      apiRequest<{ user: PublicUser }>('/api/auth/mentor-login', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    onSuccess: async () => {
      await invalidateBootcampQueries(queryClient, { analytics: true, slides: true });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () =>
      apiRequest<{ ok: boolean }>('/api/auth/logout', {
        method: 'POST',
      }),
    onSuccess: async () => {
      await invalidateBootcampQueries(queryClient, { analytics: true, slides: true });
    },
  });
}

export function useSubmitTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SubmitTaskPayload) =>
      apiRequest<{ submission: TaskSubmissionItem }>('/api/tasks/submit', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    onSuccess: async () => {
      await invalidateBootcampQueries(queryClient, { analytics: true });
    },
  });
}

export function useMentorReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: MentorReviewPayload) =>
      apiRequest<{ ok: boolean; submission: TaskSubmissionItem }>('/api/mentor/review', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    onSuccess: async () => {
      await invalidateBootcampQueries(queryClient, { analytics: true });
    },
  });
}

export function useMentorUnlock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: MentorUnlockPayload) =>
      apiRequest<{ ok: boolean }>('/api/mentor/unlock', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    onSuccess: async () => {
      await invalidateBootcampQueries(queryClient, { analytics: true });
    },
  });
}

export function useCreateModule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateModuleInput) =>
      apiRequest<{ module?: ModuleSummaryCard } & Partial<ModuleSummaryCard>>(
        '/api/admin/modules',
        {
          method: 'POST',
          body: JSON.stringify(payload),
        },
      ),
    onSuccess: async () => {
      await invalidateBootcampQueries(queryClient, { analytics: true, slides: true });
    },
  });
}

export function useUpdateModule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: { id: number } & UpdateModuleInput) =>
      apiRequest<{ ok?: boolean; module?: ModuleSummaryCard }>(`/api/admin/modules/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      }),
    onSuccess: async () => {
      await invalidateBootcampQueries(queryClient, { analytics: true, slides: true });
    },
  });
}

export function useDeleteModule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      apiRequest<{ ok?: boolean }>(`/api/admin/modules/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: async () => {
      await invalidateBootcampQueries(queryClient, { analytics: true, slides: true });
    },
  });
}

export function useCreateSlide() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ moduleId, ...body }: { moduleId: number } & CreateSlideInput) =>
      apiRequest<{ slide?: SlideItem } & Partial<SlideItem>>(
        `/api/admin/modules/${moduleId}/slides`,
        {
          method: 'POST',
          body: JSON.stringify(body),
        },
      ),
    onSuccess: async (_data, variables) => {
      await Promise.all([
        invalidateBootcampQueries(queryClient, { slides: true }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.adminModuleSlides(variables.moduleId),
        }),
      ]);
    },
  });
}

export function useUpdateSlide() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: { id: number } & UpdateSlideInput) =>
      apiRequest<{ slide?: SlideItem } & Partial<SlideItem>>(`/api/admin/slides/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      }),
    onSuccess: async () => {
      await invalidateBootcampQueries(queryClient, { slides: true });
    },
  });
}

export function useDeleteSlide() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      apiRequest<{ ok?: boolean }>(`/api/admin/slides/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: async () => {
      await invalidateBootcampQueries(queryClient, { slides: true });
    },
  });
}
