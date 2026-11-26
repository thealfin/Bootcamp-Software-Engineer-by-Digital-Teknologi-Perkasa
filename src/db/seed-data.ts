import { DEFAULT_MENTOR_USER, MENTOR_PROFILE } from './seed/mentor-profile';
import { MONTH_1_MODULES } from './seed/month1';
import { MONTH_2_MODULES } from './seed/month2';
import { MONTH_3_MODULES } from './seed/month3';
import type { SeedModuleInput } from '../types/bootcamp';

export { DEFAULT_MENTOR_USER, MENTOR_PROFILE };

export const ALL_SEED_MODULES: SeedModuleInput[] = [
  ...MONTH_1_MODULES,
  ...MONTH_2_MODULES,
  ...MONTH_3_MODULES,
].sort((a, b) => a.orderIndex - b.orderIndex);
