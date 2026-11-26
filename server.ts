import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import cookieParser from 'cookie-parser';
import express, { type Express, type Request, type Response } from 'express';
import type { ViteDevServer } from 'vite';
import { z } from 'zod';
import { createBootcampRepository, type BootcampRepository } from './src/db/repository';
import {
  ALL_SEED_MODULES,
  DEFAULT_MENTOR_USER,
  MENTOR_PROFILE,
} from './src/db/seed-data';
import {
  createSessionToken,
  SESSION_COOKIE_NAME,
  verifySessionToken,
} from './src/lib/session';
import type {
  MentorProfile,
  PublicUser,
  SlideContent,
} from './src/types/bootcamp';

export const DEFAULT_MENTOR_PROFILE: MentorProfile = MENTOR_PROFILE;

const slideLayoutEnum = z.enum([
  'cover',
  'summary',
  'bento',
  'comparison',
  'practice',
  'quiz',
  'references',
  'task',
]);

const registerSchema = z.object({
  name: z.string().trim().min(2, 'Nama minimal 2 karakter').max(160),
  email: z.string().trim().email('Format email tidak valid').max(180),
  schoolOrigin: z.string().trim().min(2, 'Asal sekolah/instansi wajib diisi').max(200),
  password: z.string().min(8, 'Kata sandi minimal 8 karakter').max(128),
});

const studentLoginSchema = z.object({
  email: z.string().trim().email('Format email tidak valid').max(180),
  password: z.string().min(1, 'Kata sandi wajib diisi').max(128),
});

const mentorLoginSchema = z.object({
  email: z.string().trim().email('Format email tidak valid'),
  passcode: z.string().min(1, 'Passcode wajib diisi'),
});

const submitTaskSchema = z.object({
  moduleId: z.coerce.number().int().positive(),
  repoUrl: z.string().trim().url('URL repository tidak valid').max(500),
  demoUrl: z
    .union([z.string().trim().url('URL demo tidak valid').max(500), z.literal(''), z.null()])
    .optional()
    .transform((v) => (v && v.length > 0 ? v : null)),
  learningLog: z.string().trim().min(5, 'Learning log minimal 5 karakter').max(8000),
});

const reviewSchema = z.object({
  submissionId: z.coerce.number().int().positive(),
  status: z.enum(['approved', 'revision']),
  mentorFeedback: z.string().trim().min(1, 'Feedback mentor wajib diisi').max(4000),
});

const unlockSchema = z.object({
  userId: z.coerce.number().int().positive(),
  moduleId: z.coerce.number().int().positive(),
  unlocked: z.boolean(),
});

const updateModuleContentSchema = z.object({
  summaryText: z.string().trim().min(1).optional(),
  taskPrompt: z.string().trim().min(1).optional(),
  taskDeliverables: z.array(z.string().trim().min(1)).optional(),
});

const createModuleSchema = z.object({
  orderIndex: z.coerce.number().int().min(0).max(999),
  month: z.coerce.number().int().min(0).max(24),
  slug: z.string().trim().min(2).max(160),
  code: z.string().trim().min(1).max(20),
  sessionType: z.string().trim().min(1).max(64),
  title: z.string().trim().min(2).max(220),
  subtitle: z.string().trim().max(1000).default(''),
  summaryText: z.string().trim().min(1).max(4000),
  taskPrompt: z.string().trim().max(4000).default(''),
  taskDeliverables: z
    .array(z.string().trim())
    .transform((arr) => arr.filter(Boolean))
    .default([]),
  accentGradient: z.string().trim().min(1).max(120).optional(),
  iconName: z.string().trim().min(1).max(64).optional(),
});

const adminUpdateModuleSchema = createModuleSchema.partial();

const slideContentSchema = z
  .object({
    highlights: z.array(z.string()).default([]),
  })
  .passthrough()
  .transform((val) => val as unknown as SlideContent);

const createSlideSchema = z.object({
  slideNumber: z.coerce.number().int().positive().optional(),
  isSummary: z.boolean().default(false),
  layoutType: slideLayoutEnum,
  badge: z.string().trim().min(1).max(80),
  title: z.string().trim().min(1).max(240),
  subtitle: z.string().trim().max(1000).default(''),
  contentJson: slideContentSchema,
});

const updateSlideSchema = z.object({
  slideNumber: z.coerce.number().int().positive().optional(),
  isSummary: z.boolean().optional(),
  layoutType: slideLayoutEnum.optional(),
  badge: z.string().trim().min(1).max(80).optional(),
  title: z.string().trim().min(1).max(240).optional(),
  subtitle: z.string().trim().max(1000).optional(),
  contentJson: slideContentSchema.optional(),
});

function setSessionCookie(res: Response, user: PublicUser): void {
  const token = createSessionToken({ uid: user.id, role: user.role });
  res.cookie(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
}

async function resolveCurrentUser(
  req: Request,
  repo: BootcampRepository,
): Promise<PublicUser | null> {
  const rawToken = req.cookies?.[SESSION_COOKIE_NAME] as string | undefined;
  const session = verifySessionToken(rawToken);
  if (!session) return null;
  return repo.getUserById(session.uid);
}

async function requireMentor(
  req: Request,
  res: Response,
  repo: BootcampRepository,
): Promise<PublicUser | null> {
  const currentUser = await resolveCurrentUser(req, repo);
  if (!currentUser || currentUser.role !== 'mentor') {
    res.status(403).json({ error: 'Akses ditolak. Hanya Mentor yang memiliki izin ini.' });
    return null;
  }
  return currentUser;
}

function parsePositiveInt(raw: string): number | null {
  const n = Number(raw);
  return Number.isInteger(n) && n > 0 ? n : null;
}

export function createServerApp(
  repo: BootcampRepository,
  options?: {
    isProd?: boolean;
    vite?: ViteDevServer;
    mentorProfile?: MentorProfile;
  },
): Express {
  const app = express();
  const isProd = options?.isProd ?? false;
  const mentorProfile = options?.mentorProfile ?? DEFAULT_MENTOR_PROFILE;

  app.use(express.json({ limit: '1mb' }));
  app.use(cookieParser());

  // 1. GET /api/bootstrap
  app.get('/api/bootstrap', async (req, res, next) => {
    try {
      const currentUser = await resolveCurrentUser(req, repo);
      const data = await repo.getBootstrapData(currentUser, mentorProfile);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  // 2. GET /api/modules/:slug
  app.get('/api/modules/:slug', async (req, res, next) => {
    try {
      const currentUser = await resolveCurrentUser(req, repo);
      const detail = await repo.getModuleDetail(req.params.slug, currentUser, mentorProfile);
      if (!detail) {
        res.status(404).json({ error: 'Modul pertemuan tidak ditemukan.' });
        return;
      }
      res.status(200).json(detail);
    } catch (err) {
      next(err);
    }
  });

  // 3. POST /api/auth/register
  app.post('/api/auth/register', async (req, res, next) => {
    try {
      const parsed = registerSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: 'Data registrasi tidak valid.',
          details: parsed.error.flatten(),
        });
        return;
      }

      const user = await repo.registerStudent(parsed.data);
      setSessionCookie(res, user);
      res.status(200).json({ user });
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === 'EMAIL_ALREADY_REGISTERED') {
          res.status(409).json({
            error: 'Email sudah terdaftar. Silakan masuk menggunakan kata sandi.',
          });
          return;
        }
        if (err.message === 'MENTOR_EMAIL_CONFLICT') {
          res.status(409).json({
            error: 'Email ini terdaftar sebagai akun Mentor. Silakan masuk melalui Login Admin.',
          });
          return;
        }
      }
      next(err);
    }
  });

  // 4. POST /api/auth/login
  app.post('/api/auth/login', async (req, res, next) => {
    try {
      const parsed = studentLoginSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: 'Email atau kata sandi tidak valid.',
          details: parsed.error.flatten(),
        });
        return;
      }

      const user = await repo.loginStudent(parsed.data);
      if (!user) {
        res.status(401).json({ error: 'Email atau kata sandi salah.' });
        return;
      }

      setSessionCookie(res, user);
      res.status(200).json({ user });
    } catch (err) {
      next(err);
    }
  });

  // 5. POST /api/auth/mentor-login
  app.post('/api/auth/mentor-login', async (req, res, next) => {
    try {
      const parsed = mentorLoginSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: 'Email atau passcode tidak valid.',
          details: parsed.error.flatten(),
        });
        return;
      }

      const mentor = await repo.verifyMentorLogin(parsed.data);
      if (!mentor) {
        res.status(401).json({ error: 'Email atau passcode mentor salah.' });
        return;
      }

      setSessionCookie(res, mentor);
      res.status(200).json({ user: mentor });
    } catch (err) {
      next(err);
    }
  });

  // 6. POST /api/auth/logout
  app.post('/api/auth/logout', (_req, res) => {
    res.clearCookie(SESSION_COOKIE_NAME, { path: '/' });
    res.status(200).json({ ok: true });
  });

  // 7. POST /api/tasks/submit
  app.post('/api/tasks/submit', async (req, res, next) => {
    try {
      const currentUser = await resolveCurrentUser(req, repo);
      if (!currentUser) {
        res.status(401).json({ error: 'Silakan masuk terlebih dahulu untuk mengumpulkan task.' });
        return;
      }
      if (currentUser.role !== 'user') {
        res.status(403).json({ error: 'Hanya peserta bootcamp yang dapat mengumpulkan task.' });
        return;
      }

      const parsed = submitTaskSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: 'Data task submission tidak valid.',
          details: parsed.error.flatten(),
        });
        return;
      }

      const submission = await repo.submitTask(currentUser.id, parsed.data);
      res.status(200).json({ submission });
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === 'MODULE_LOCKED') {
          res.status(403).json({
            error: 'Pertemuan masih terkunci. Dapatkan ACC Mentor pada pertemuan sebelumnya terlebih dahulu.',
          });
          return;
        }
        if (err.message === 'MODULE_NOT_FOUND') {
          res.status(404).json({ error: 'Modul pertemuan tidak ditemukan.' });
          return;
        }
        if (err.message === 'MODULE_NOT_SUBMITTABLE') {
          res.status(400).json({ error: 'Modul panduan/referensi tidak memerlukan pengumpulan task.' });
          return;
        }
      }
      next(err);
    }
  });

  // 8. GET /api/mentor/dashboard
  app.get('/api/mentor/dashboard', async (req, res, next) => {
    try {
      const mentor = await requireMentor(req, res, repo);
      if (!mentor) return;
      const dashboard = await repo.getMentorDashboard(mentor);
      res.status(200).json(dashboard);
    } catch (err) {
      next(err);
    }
  });

  // 9. POST /api/mentor/review
  app.post('/api/mentor/review', async (req, res, next) => {
    try {
      const mentor = await requireMentor(req, res, repo);
      if (!mentor) return;

      const parsed = reviewSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: 'Data review tidak valid.',
          details: parsed.error.flatten(),
        });
        return;
      }

      const result = await repo.reviewSubmission({
        submissionId: parsed.data.submissionId,
        status: parsed.data.status,
        mentorFeedback: parsed.data.mentorFeedback,
        reviewerName: mentor.name,
      });
      res.status(200).json(result);
    } catch (err) {
      if (err instanceof Error && err.message === 'SUBMISSION_NOT_FOUND') {
        res.status(404).json({ error: 'Task submission tidak ditemukan.' });
        return;
      }
      next(err);
    }
  });

  // 10. POST /api/mentor/unlock
  app.post('/api/mentor/unlock', async (req, res, next) => {
    try {
      const mentor = await requireMentor(req, res, repo);
      if (!mentor) return;

      const parsed = unlockSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: 'Payload unlock tidak valid.',
          details: parsed.error.flatten(),
        });
        return;
      }

      await repo.setManualUnlock(parsed.data);
      res.status(200).json({ ok: true });
    } catch (err) {
      if (err instanceof Error && err.message === 'NOT_FOUND') {
        res.status(404).json({ error: 'Peserta atau modul tidak ditemukan.' });
        return;
      }
      next(err);
    }
  });

  // 11. PATCH /api/mentor/modules/:id
  app.patch('/api/mentor/modules/:id', async (req, res, next) => {
    try {
      const mentor = await requireMentor(req, res, repo);
      if (!mentor) return;

      const moduleId = parsePositiveInt(req.params.id);
      if (!moduleId) {
        res.status(400).json({ error: 'ID modul tidak valid.' });
        return;
      }

      const parsed = updateModuleContentSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: 'Data pembaruan modul tidak valid.',
          details: parsed.error.flatten(),
        });
        return;
      }

      await repo.updateModuleContent(moduleId, parsed.data);
      res.status(200).json({ ok: true });
    } catch (err) {
      if (err instanceof Error && err.message === 'MODULE_NOT_FOUND') {
        res.status(404).json({ error: 'Modul tidak ditemukan.' });
        return;
      }
      next(err);
    }
  });

  // 12. GET /api/admin/analytics
  app.get('/api/admin/analytics', async (req, res, next) => {
    try {
      const mentor = await requireMentor(req, res, repo);
      if (!mentor) return;
      const analytics = await repo.getAnalytics();
      res.status(200).json(analytics);
    } catch (err) {
      next(err);
    }
  });

  // 13. POST /api/admin/modules
  app.post('/api/admin/modules', async (req, res, next) => {
    try {
      const mentor = await requireMentor(req, res, repo);
      if (!mentor) return;

      const parsed = createModuleSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: 'Data pembuatan modul tidak valid.',
          details: parsed.error.flatten(),
        });
        return;
      }

      const mod = await repo.createModule(parsed.data);
      res.status(200).json({ ...mod, module: mod, ok: true });
    } catch (err) {
      if (err instanceof Error && err.message === 'MODULE_CONFLICT') {
        res.status(409).json({ error: 'Nomor urutan atau slug modul sudah digunakan.' });
        return;
      }
      next(err);
    }
  });

  // 14. PATCH /api/admin/modules/:id
  app.patch('/api/admin/modules/:id', async (req, res, next) => {
    try {
      const mentor = await requireMentor(req, res, repo);
      if (!mentor) return;

      const moduleId = parsePositiveInt(req.params.id);
      if (!moduleId) {
        res.status(400).json({ error: 'ID modul tidak valid.' });
        return;
      }

      const parsed = adminUpdateModuleSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: 'Data pembaruan modul tidak valid.',
          details: parsed.error.flatten(),
        });
        return;
      }

      const mod = await repo.updateModule(moduleId, parsed.data);
      res.status(200).json({ ...mod, module: mod, ok: true });
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === 'MODULE_NOT_FOUND') {
          res.status(404).json({ error: 'Modul tidak ditemukan.' });
          return;
        }
        if (err.message === 'MODULE_CONFLICT') {
          res.status(409).json({ error: 'Nomor urutan atau slug modul sudah digunakan.' });
          return;
        }
      }
      next(err);
    }
  });

  // 15. DELETE /api/admin/modules/:id
  app.delete('/api/admin/modules/:id', async (req, res, next) => {
    try {
      const mentor = await requireMentor(req, res, repo);
      if (!mentor) return;

      const moduleId = parsePositiveInt(req.params.id);
      if (!moduleId) {
        res.status(400).json({ error: 'ID modul tidak valid.' });
        return;
      }

      await repo.deleteModule(moduleId);
      res.status(200).json({ ok: true });
    } catch (err) {
      if (err instanceof Error && err.message === 'MODULE_NOT_FOUND') {
        res.status(404).json({ error: 'Modul tidak ditemukan.' });
        return;
      }
      next(err);
    }
  });

  // 16. GET /api/admin/modules/:id/slides
  app.get('/api/admin/modules/:id/slides', async (req, res, next) => {
    try {
      const mentor = await requireMentor(req, res, repo);
      if (!mentor) return;

      const moduleId = parsePositiveInt(req.params.id);
      if (!moduleId) {
        res.status(400).json({ error: 'ID modul tidak valid.' });
        return;
      }

      const slides = await repo.getModuleSlidesAdmin(moduleId);
      res.status(200).json({ slides });
    } catch (err) {
      if (err instanceof Error && err.message === 'MODULE_NOT_FOUND') {
        res.status(404).json({ error: 'Modul tidak ditemukan.' });
        return;
      }
      next(err);
    }
  });

  // 17. POST /api/admin/modules/:id/slides
  app.post('/api/admin/modules/:id/slides', async (req, res, next) => {
    try {
      const mentor = await requireMentor(req, res, repo);
      if (!mentor) return;

      const moduleId = parsePositiveInt(req.params.id);
      if (!moduleId) {
        res.status(400).json({ error: 'ID modul tidak valid.' });
        return;
      }

      const parsed = createSlideSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: 'Data pembuatan slide tidak valid.',
          details: parsed.error.flatten(),
        });
        return;
      }

      const slide = await repo.createSlide(moduleId, parsed.data);
      res.status(200).json({ ...slide, slide, ok: true });
    } catch (err) {
      if (err instanceof Error && err.message === 'MODULE_NOT_FOUND') {
        res.status(404).json({ error: 'Modul tidak ditemukan.' });
        return;
      }
      next(err);
    }
  });

  // 18. PATCH /api/admin/slides/:id
  app.patch('/api/admin/slides/:id', async (req, res, next) => {
    try {
      const mentor = await requireMentor(req, res, repo);
      if (!mentor) return;

      const slideId = parsePositiveInt(req.params.id);
      if (!slideId) {
        res.status(400).json({ error: 'ID slide tidak valid.' });
        return;
      }

      const parsed = updateSlideSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: 'Data pembaruan slide tidak valid.',
          details: parsed.error.flatten(),
        });
        return;
      }

      const slide = await repo.updateSlide(slideId, parsed.data);
      res.status(200).json({ ...slide, slide, ok: true });
    } catch (err) {
      if (err instanceof Error && err.message === 'SLIDE_NOT_FOUND') {
        res.status(404).json({ error: 'Slide tidak ditemukan.' });
        return;
      }
      next(err);
    }
  });

  // 19. DELETE /api/admin/slides/:id
  app.delete('/api/admin/slides/:id', async (req, res, next) => {
    try {
      const mentor = await requireMentor(req, res, repo);
      if (!mentor) return;

      const slideId = parsePositiveInt(req.params.id);
      if (!slideId) {
        res.status(400).json({ error: 'ID slide tidak valid.' });
        return;
      }

      await repo.deleteSlide(slideId);
      res.status(200).json({ ok: true });
    } catch (err) {
      if (err instanceof Error && err.message === 'SLIDE_NOT_FOUND') {
        res.status(404).json({ error: 'Slide tidak ditemukan.' });
        return;
      }
      next(err);
    }
  });

  app.all('/api/*', (_req, res) => {
    res.status(404).json({ error: 'Endpoint API tidak ditemukan.' });
  });

  if (options?.vite) {
    app.use(options.vite.middlewares);
  } else if (isProd) {
    app.use(
      express.static(path.resolve(process.cwd(), 'dist/client'), {
        index: false,
      }),
    );
  }

  // SSR handler for non-/api GET routes (including /, /modul/*, /admin, /admin/*)
  app.get('*', async (req, res, next) => {
    try {
      const url = req.originalUrl;
      const currentUser = await resolveCurrentUser(req, repo);

      let template: string;
      let render: (
        url: string,
        user: PublicUser | null,
        repo: BootcampRepository,
      ) => Promise<{ html: string; dehydratedState: unknown }>;

      if (options?.vite) {
        const rawHtml = await fs.readFile(path.resolve(process.cwd(), 'index.html'), 'utf8');
        template = await options.vite.transformIndexHtml(url, rawHtml);
        const mod = (await options.vite.ssrLoadModule('/src/entry-server.tsx')) as {
          render: typeof render;
        };
        render = mod.render;
      } else {
        template = await fs.readFile(
          path.resolve(process.cwd(), 'dist/client/index.html'),
          'utf8',
        );
        const serverEntryUrl = pathToFileURL(
          path.resolve(process.cwd(), 'dist/server/entry-server.js'),
        ).href;
        const mod = (await import(serverEntryUrl)) as { render: typeof render };
        render = mod.render;
      }

      const { html: appHtml, dehydratedState } = await render(url, currentUser, repo);
      const serializedState = JSON.stringify(dehydratedState).replace(/</g, '\\u003c');
      const stateScript = `<script>window.__TANSTACK_STATE__ = ${serializedState};</script>`;

      const fullHtml = template
        .replace('<!--app-html-->', appHtml)
        .replace('<!--app-state-->', stateScript);

      res.status(200).set({ 'Content-Type': 'text/html' }).end(fullHtml);
    } catch (err) {
      if (options?.vite && err instanceof Error) {
        options.vite.ssrFixStacktrace(err);
      }
      next(err);
    }
  });

  app.use((err: unknown, _req: Request, res: Response, _next: express.NextFunction) => {
    console.error('[server] Unhandled error:', err instanceof Error ? err.message : err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Terjadi kesalahan internal pada server.' });
    }
  });

  return app;
}

async function startServer() {
  const isProd = process.argv.includes('--prod') || process.env.NODE_ENV === 'production';
  const port = Number(process.env.PORT) || 3000;
  const repo = await createBootcampRepository();
  const mentorProfile = MENTOR_PROFILE;

  const bootstrap = await repo.getBootstrapData(null, mentorProfile);
  if (bootstrap.modules.length === 0) {
    await repo.ensureSeeded(ALL_SEED_MODULES, DEFAULT_MENTOR_USER);
  }

  let vite: ViteDevServer | undefined;
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
  }

  const app = createServerApp(repo, { isProd, vite, mentorProfile });
  const httpServer = app.listen(port, () => {
    console.log(
      `[server] Digitek Bootcamp SSR Server (${isProd ? 'prod' : 'dev'}, db=${repo.kind}) running at http://localhost:${port}`,
    );
  });

  let shuttingDown = false;
  const shutdown = async (signal: string) => {
    if (shuttingDown) return;
    shuttingDown = true;
    console.log(`[server] Received ${signal}, shutting down...`);
    await vite?.close().catch(() => undefined);
    httpServer.close(() => {
      process.exit(0);
    });
    setTimeout(() => process.exit(0), 3000).unref();
  };

  process.once('SIGINT', () => {
    void shutdown('SIGINT');
  });
  process.once('SIGTERM', () => {
    void shutdown('SIGTERM');
  });
}

const isMainEntry =
  (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) ||
  Boolean(process.argv[1]?.endsWith('server.ts'));

if (isMainEntry) {
  startServer().catch((err) => {
    console.error('[server] Fatal startup error:', err instanceof Error ? err.message : err);
    process.exit(1);
  });
}
