import 'dotenv/config';
import { createBootcampRepository } from './repository';
import { ALL_SEED_MODULES, DEFAULT_MENTOR_USER } from './seed-data';

async function main() {
  const repo = await createBootcampRepository();
  const result = await repo.ensureSeeded(ALL_SEED_MODULES, DEFAULT_MENTOR_USER);
  console.log(
    `[seed:${repo.kind}] Seeded ${result.totalModules} modules and ${result.totalSlides} slides.`,
  );
}

main().catch((err) => {
  console.error('[seed] Failed to seed bootcamp database:', err instanceof Error ? err.message : err);
  process.exit(1);
});
