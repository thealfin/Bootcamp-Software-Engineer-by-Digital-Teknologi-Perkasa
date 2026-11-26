import { hydrateRoot } from 'react-dom/client';
import {
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
  type DehydratedState,
} from '@tanstack/react-query';
import { RouterProvider, createBrowserHistory } from '@tanstack/react-router';
import { createAppRouter } from './router';

async function hydrate() {
  const dehydratedState = (window as unknown as { __TANSTACK_STATE__?: DehydratedState })
    .__TANSTACK_STATE__;

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
      },
    },
  });

  const history = createBrowserHistory();
  const router = createAppRouter(queryClient, history);
  await router.load();

  hydrateRoot(
    document.getElementById('root')!,
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>
        <RouterProvider router={router} />
      </HydrationBoundary>
    </QueryClientProvider>,
  );
}

void hydrate();
