import 'dotenv/config';
import type { Express, Request, Response } from 'express';
import { createServerApp } from '../server';
import { createBootcampRepository } from '../src/db/repository';
import { ALL_SEED_MODULES, DEFAULT_MENTOR_USER, MENTOR_PROFILE } from '../src/db/seed-data';

let cachedAppPromise: Promise<Express> | null = null;

async function getApp(): Promise<Express> {
  if (!cachedAppPromise) {
    cachedAppPromise = (async () => {
      const repo = await createBootcampRepository();
      const bootstrap = await repo.getBootstrapData(null, MENTOR_PROFILE);
      if (bootstrap.modules.length === 0) {
        await repo.ensureSeeded(ALL_SEED_MODULES, DEFAULT_MENTOR_USER);
      }
      return createServerApp(repo, { isProd: true, mentorProfile: MENTOR_PROFILE });
    })();
  }
  return cachedAppPromise;
}

export default async function handler(req: Request, res: Response) {
  const app = await getApp();
  return app(req, res);
}
