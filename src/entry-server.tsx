import { renderToString } from 'react-dom/server';
import { QueryClient, QueryClientProvider, dehydrate } from '@tanstack/react-query';
import { RouterProvider, createMemoryHistory } from '@tanstack/react-router';
import type { BootcampRepository } from './db/repository';
import { MENTOR_PROFILE } from './db/seed/mentor-profile';
import { queryKeys } from './lib/api';
import { createAppRouter } from './router';
import type { PublicUser } from './types/bootcamp';

export async function render(
  url: string,
  currentUser: PublicUser | null,
  repo: BootcampRepository,
) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
      },
    },
  });

  await queryClient.prefetchQuery({
    queryKey: queryKeys.bootstrap,
    queryFn: () => repo.getBootstrapData(currentUser, MENTOR_PROFILE),
  });

  const rawPath = url.split('?')[0]?.split('#')[0] ?? '/';
  const pathname = rawPath.length > 1 ? rawPath.replace(/\/+$/, '') : rawPath;
  const querySuffix = url.includes('?') ? `?${url.split('?')[1]?.split('#')[0] ?? ''}` : '';
  const normalizedUrl = `${pathname}${querySuffix}`;

  if (pathname.startsWith('/modul/')) {
    const rawSlug = pathname.slice('/modul/'.length).replace(/\/+$/, '');
    const slug = decodeURIComponent(rawSlug);
    if (slug) {
      await queryClient.prefetchQuery({
        queryKey: queryKeys.module(slug),
        queryFn: () => repo.getModuleDetail(slug, currentUser, MENTOR_PROFILE),
      });
    }
  }

  if (
    (pathname === '/admin' || pathname.startsWith('/admin/')) &&
    currentUser?.role === 'mentor'
  ) {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.mentorDashboard,
      queryFn: () => repo.getMentorDashboard(currentUser),
    });
  }

  const history = createMemoryHistory({
    initialEntries: [normalizedUrl],
  });
  const router = createAppRouter(queryClient, history);
  await router.load();

  const dehydratedState = dehydrate(queryClient);

  const html = renderToString(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );

  return { html, dehydratedState };
}
