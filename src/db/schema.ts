import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import type { SlideContent, SlideLayoutType, SubmissionStatus, UserRole } from '../types/bootcamp';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 160 }).notNull(),
  email: varchar('email', { length: 180 }).notNull().unique(),
  schoolOrigin: varchar('school_origin', { length: 200 }).notNull(),
  passwordHash: text('password_hash'),
  role: varchar('role', { length: 20 }).$type<UserRole>().notNull().default('user'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const modules = pgTable('modules', {
  id: serial('id').primaryKey(),
  orderIndex: integer('order_index').notNull().unique(),
  month: integer('month').notNull(),
  slug: varchar('slug', { length: 160 }).notNull().unique(),
  code: varchar('code', { length: 20 }).notNull(),
  sessionType: varchar('session_type', { length: 64 }).notNull(),
  title: varchar('title', { length: 220 }).notNull(),
  subtitle: text('subtitle').notNull(),
  summaryText: text('summary_text').notNull(),
  taskPrompt: text('task_prompt').notNull(),
  taskDeliverables: jsonb('task_deliverables').$type<string[]>().notNull(),
  accentGradient: varchar('accent_gradient', { length: 120 }).notNull(),
  iconName: varchar('icon_name', { length: 64 }).notNull(),
});

export const slides = pgTable(
  'slides',
  {
    id: serial('id').primaryKey(),
    moduleId: integer('module_id')
      .notNull()
      .references(() => modules.id, { onDelete: 'cascade' }),
    slideNumber: integer('slide_number').notNull(),
    isSummary: boolean('is_summary').notNull().default(false),
    layoutType: varchar('layout_type', { length: 40 }).$type<SlideLayoutType>().notNull(),
    badge: varchar('badge', { length: 80 }).notNull(),
    title: varchar('title', { length: 240 }).notNull(),
    subtitle: text('subtitle').notNull(),
    contentJson: jsonb('content_json').$type<SlideContent>().notNull(),
  },
  (table) => [uniqueIndex('slides_module_slide_idx').on(table.moduleId, table.slideNumber)],
);

export const taskSubmissions = pgTable(
  'task_submissions',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    moduleId: integer('module_id')
      .notNull()
      .references(() => modules.id, { onDelete: 'cascade' }),
    repoUrl: varchar('repo_url', { length: 500 }).notNull(),
    demoUrl: varchar('demo_url', { length: 500 }),
    learningLog: text('learning_log').notNull(),
    status: varchar('status', { length: 24 }).$type<SubmissionStatus>().notNull().default('pending'),
    mentorFeedback: text('mentor_feedback'),
    reviewedBy: varchar('reviewed_by', { length: 160 }),
    submittedAt: timestamp('submitted_at').defaultNow().notNull(),
    reviewedAt: timestamp('reviewed_at'),
  },
  (table) => [uniqueIndex('submissions_user_module_idx').on(table.userId, table.moduleId)],
);

export const moduleUnlocks = pgTable(
  'module_unlocks',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    moduleId: integer('module_id')
      .notNull()
      .references(() => modules.id, { onDelete: 'cascade' }),
    unlockedBy: varchar('unlocked_by', { length: 40 }).notNull().default('SYSTEM_INITIAL'),
    isUnlocked: boolean('is_unlocked').notNull().default(true),
    unlockedAt: timestamp('unlocked_at').defaultNow().notNull(),
  },
  (table) => [uniqueIndex('unlocks_user_module_idx').on(table.userId, table.moduleId)],
);
