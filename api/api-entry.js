var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var _a;
import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import cookieParser from "cookie-parser";
import express from "express";
import { z } from "zod";
import { neon } from "@neondatabase/serverless";
import { eq, and, notInArray, asc, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import { pgTable, timestamp, varchar, text, serial, jsonb, integer, boolean, uniqueIndex } from "drizzle-orm/pg-core";
import crypto from "node:crypto";
const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  email: varchar("email", { length: 180 }).notNull().unique(),
  schoolOrigin: varchar("school_origin", { length: 200 }).notNull(),
  passwordHash: text("password_hash"),
  role: varchar("role", { length: 20 }).$type().notNull().default("user"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
const modules = pgTable("modules", {
  id: serial("id").primaryKey(),
  orderIndex: integer("order_index").notNull().unique(),
  month: integer("month").notNull(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
  code: varchar("code", { length: 20 }).notNull(),
  sessionType: varchar("session_type", { length: 64 }).notNull(),
  title: varchar("title", { length: 220 }).notNull(),
  subtitle: text("subtitle").notNull(),
  summaryText: text("summary_text").notNull(),
  taskPrompt: text("task_prompt").notNull(),
  taskDeliverables: jsonb("task_deliverables").$type().notNull(),
  accentGradient: varchar("accent_gradient", { length: 120 }).notNull(),
  iconName: varchar("icon_name", { length: 64 }).notNull()
});
const slides = pgTable(
  "slides",
  {
    id: serial("id").primaryKey(),
    moduleId: integer("module_id").notNull().references(() => modules.id, { onDelete: "cascade" }),
    slideNumber: integer("slide_number").notNull(),
    isSummary: boolean("is_summary").notNull().default(false),
    layoutType: varchar("layout_type", { length: 40 }).$type().notNull(),
    badge: varchar("badge", { length: 80 }).notNull(),
    title: varchar("title", { length: 240 }).notNull(),
    subtitle: text("subtitle").notNull(),
    contentJson: jsonb("content_json").$type().notNull()
  },
  (table) => [uniqueIndex("slides_module_slide_idx").on(table.moduleId, table.slideNumber)]
);
const taskSubmissions = pgTable(
  "task_submissions",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    moduleId: integer("module_id").notNull().references(() => modules.id, { onDelete: "cascade" }),
    repoUrl: varchar("repo_url", { length: 500 }).notNull(),
    demoUrl: varchar("demo_url", { length: 500 }),
    learningLog: text("learning_log").notNull(),
    status: varchar("status", { length: 24 }).$type().notNull().default("pending"),
    mentorFeedback: text("mentor_feedback"),
    reviewedBy: varchar("reviewed_by", { length: 160 }),
    submittedAt: timestamp("submitted_at").defaultNow().notNull(),
    reviewedAt: timestamp("reviewed_at")
  },
  (table) => [uniqueIndex("submissions_user_module_idx").on(table.userId, table.moduleId)]
);
const moduleUnlocks = pgTable(
  "module_unlocks",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    moduleId: integer("module_id").notNull().references(() => modules.id, { onDelete: "cascade" }),
    unlockedBy: varchar("unlocked_by", { length: 40 }).notNull().default("SYSTEM_INITIAL"),
    isUnlocked: boolean("is_unlocked").notNull().default(true),
    unlockedAt: timestamp("unlocked_at").defaultNow().notNull()
  },
  (table) => [uniqueIndex("unlocks_user_module_idx").on(table.userId, table.moduleId)]
);
const schema = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  moduleUnlocks,
  modules,
  slides,
  taskSubmissions,
  users
}, Symbol.toStringTag, { value: "Module" }));
function evaluateModuleAccess({
  user,
  moduleOrderIndex,
  isReferenceModule: isReferenceModuleProp,
  prevModuleSubmissionStatus = null,
  unlockOverride = null
}) {
  const isReferenceModule = isReferenceModuleProp ?? (moduleOrderIndex === 0 || moduleOrderIndex === 17);
  if (!user) {
    if (isReferenceModule) {
      return {
        accessLevel: "FULL_ACCESS",
        canSubmitTask: false,
        reason: "Modul panduan & pustaka referensi terbuka untuk pratinjau."
      };
    }
    return {
      accessLevel: "SUMMARY_ONLY",
      canSubmitTask: false,
      reason: "Mode Guest: hanya 3 slide ringkasan terbuka. Daftar untuk membuka materi penuh."
    };
  }
  if (user.role === "mentor") {
    return {
      accessLevel: "FULL_ACCESS",
      canSubmitTask: false,
      reason: "Mode Mentor (Alfin Almustajab): akses penuh seluruh pertemuan."
    };
  }
  if (isReferenceModule) {
    if (unlockOverride && !unlockOverride.isUnlocked) {
      return {
        accessLevel: "LOCKED_PREV_TASK",
        canSubmitTask: false,
        reason: "Akses modul dikunci manual oleh Mentor."
      };
    }
    return {
      accessLevel: "FULL_ACCESS",
      canSubmitTask: false,
      reason: "Modul panduan & referensi terbuka penuh untuk peserta terdaftar."
    };
  }
  if (moduleOrderIndex === 1) {
    if (unlockOverride && !unlockOverride.isUnlocked) {
      return {
        accessLevel: "LOCKED_PREV_TASK",
        canSubmitTask: false,
        reason: "Pertemuan 01 dikunci manual oleh Mentor."
      };
    }
    return {
      accessLevel: "FULL_ACCESS",
      canSubmitTask: true,
      reason: "Pertemuan 01 otomatis terbuka setelah registrasi peserta."
    };
  }
  if (unlockOverride) {
    if (unlockOverride.isUnlocked) {
      return {
        accessLevel: "FULL_ACCESS",
        canSubmitTask: true,
        reason: unlockOverride.unlockedBy === "MENTOR_ACC" ? "Terbuka otomatis setelah task pertemuan sebelumnya di-ACC Mentor." : "Dibuka secara manual oleh Mentor."
      };
    }
    return {
      accessLevel: "LOCKED_PREV_TASK",
      canSubmitTask: false,
      reason: "Pertemuan dikunci oleh Mentor."
    };
  }
  if (prevModuleSubmissionStatus === "approved") {
    return {
      accessLevel: "FULL_ACCESS",
      canSubmitTask: true,
      reason: "Terbuka karena task pertemuan sebelumnya sudah di-ACC Mentor."
    };
  }
  const prevLabel = `Pertemuan ${String(moduleOrderIndex - 1).padStart(2, "0")}`;
  if (prevModuleSubmissionStatus === "pending") {
    return {
      accessLevel: "LOCKED_PREV_TASK",
      canSubmitTask: false,
      reason: `Terkunci: Task ${prevLabel} sedang menunggu ACC Mentor Alfin Almustajab.`
    };
  }
  if (prevModuleSubmissionStatus === "revision") {
    return {
      accessLevel: "LOCKED_PREV_TASK",
      canSubmitTask: false,
      reason: `Terkunci: Task ${prevLabel} membutuhkan revisi sesuai catatan Mentor.`
    };
  }
  return {
    accessLevel: "LOCKED_PREV_TASK",
    canSubmitTask: false,
    reason: `Terkunci: Selesaikan & dapatkan ACC Mentor untuk Task ${prevLabel} terlebih dahulu.`
  };
}
const SESSION_COOKIE_NAME = "bootcamp_session";
function getSessionSecret() {
  return process.env.SESSION_SECRET || "digitek-bootcamp-batch1-dev-secret";
}
function signData(data) {
  return crypto.createHmac("sha256", getSessionSecret()).update(data).digest("base64url");
}
function createSessionToken(payload) {
  const body = {
    uid: payload.uid,
    role: payload.role,
    iat: Date.now()
  };
  const encoded = Buffer.from(JSON.stringify(body), "utf8").toString("base64url");
  const signature = signData(encoded);
  return `${encoded}.${signature}`;
}
function verifySessionToken(token) {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [encoded, signature] = parts;
  if (!encoded || !signature) return null;
  const expected = signData(encoded);
  const sigBuf = Buffer.from(signature, "utf8");
  const expBuf = Buffer.from(expected, "utf8");
  if (sigBuf.length !== expBuf.length) return null;
  if (!crypto.timingSafeEqual(sigBuf, expBuf)) return null;
  try {
    const parsed = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
    if (typeof parsed.uid === "number" && Number.isInteger(parsed.uid) && (parsed.role === "user" || parsed.role === "mentor")) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}
function hashPassword(password) {
  const saltHex = crypto.randomBytes(16).toString("hex");
  const hashHex = crypto.scryptSync(password, saltHex, 64).toString("hex");
  return `scrypt$${saltHex}$${hashHex}`;
}
function verifyPassword(password, storedHash) {
  if (!storedHash || typeof storedHash !== "string") return false;
  const parts = storedHash.split("$");
  if (parts.length !== 3 || parts[0] !== "scrypt") return false;
  const [, saltHex, hashHex] = parts;
  if (!saltHex || !hashHex || hashHex.length % 2 !== 0) return false;
  try {
    const expected = Buffer.from(hashHex, "hex");
    if (expected.length === 0) return false;
    const derived = crypto.scryptSync(password, saltHex, expected.length);
    if (derived.length !== expected.length) return false;
    return crypto.timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
}
const DEFAULT_ACCENT_GRADIENT = "from-sky-500 to-indigo-600";
const DEFAULT_ICON_NAME = "BookOpen";
const MONTH_SHORT_ID = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des"
];
function toIsoString(val) {
  if (!val) return (/* @__PURE__ */ new Date()).toISOString();
  return val instanceof Date ? val.toISOString() : val;
}
function toNullableIsoString(val) {
  if (!val) return null;
  return val instanceof Date ? val.toISOString() : val;
}
function normalizeEmail(email) {
  return email.trim().toLowerCase();
}
function toPublicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    schoolOrigin: user.schoolOrigin,
    role: user.role,
    createdAt: user.createdAt
  };
}
function getMentorPasscode() {
  return process.env.MENTOR_PASSCODE || "digitek-mentor-2026";
}
function isManualOverrideBy(unlockedBy) {
  return unlockedBy === "MENTOR_MANUAL" || unlockedBy === "MENTOR_LOCKED";
}
function toAdminModuleCard(mod, slidesForModule) {
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
    accessLevel: "FULL_ACCESS",
    accessReason: "Mode Mentor (Alfin Almustajab): akses penuh seluruh pertemuan.",
    submissionStatus: null,
    mentorFeedback: null,
    isManualOverride: false
  };
}
function buildModuleSummaryCard(params) {
  const { mod, slidesForModule, user, submissionByModuleId, unlockByModuleId, moduleByOrderIndex } = params;
  const userSubmission = submissionByModuleId.get(mod.id) ?? null;
  const unlock = unlockByModuleId.get(mod.id) ?? null;
  const prevMod = moduleByOrderIndex.get(mod.orderIndex - 1);
  const prevSubmission = prevMod ? submissionByModuleId.get(prevMod.id) ?? null : null;
  const access = evaluateModuleAccess({
    user,
    moduleOrderIndex: mod.orderIndex,
    isReferenceModule: mod.orderIndex === 0 || mod.slug === "pustaka-learning-hub",
    prevModuleSubmissionStatus: (prevSubmission == null ? void 0 : prevSubmission.status) ?? null,
    unlockOverride: unlock ? { isUnlocked: unlock.isUnlocked, unlockedBy: unlock.unlockedBy } : null
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
    submissionStatus: (userSubmission == null ? void 0 : userSubmission.status) ?? null,
    mentorFeedback: (userSubmission == null ? void 0 : userSubmission.mentorFeedback) ?? null,
    isManualOverride: Boolean(unlock && isManualOverrideBy(unlock.unlockedBy))
  };
}
function assembleBootstrapResponse(params) {
  const { user, mentorProfile, allUsers, allModules, allSlides, allSubmissions, userUnlocks } = params;
  const sortedModules = [...allModules].sort((a, b) => a.orderIndex - b.orderIndex);
  const slidesByModule = /* @__PURE__ */ new Map();
  for (const s of allSlides) {
    const list = slidesByModule.get(s.moduleId) ?? [];
    list.push(s);
    slidesByModule.set(s.moduleId, list);
  }
  const moduleByOrderIndex = new Map(
    sortedModules.map((m) => [m.orderIndex, m])
  );
  const userSubmissions = user ? allSubmissions.filter((s) => s.userId === user.id) : [];
  const submissionByModuleId = new Map(
    userSubmissions.map((s) => [s.moduleId, s])
  );
  const unlockByModuleId = new Map(
    userUnlocks.map((u) => [u.moduleId, u])
  );
  const moduleCards = sortedModules.map(
    (mod) => buildModuleSummaryCard({
      mod,
      slidesForModule: slidesByModule.get(mod.id) ?? [],
      user,
      submissionByModuleId,
      unlockByModuleId,
      moduleByOrderIndex
    })
  );
  return {
    user,
    mentorProfile,
    stats: {
      totalStudents: allUsers.filter((u) => u.role === "user").length,
      totalModules: sortedModules.length,
      formalMeetings: sortedModules.filter((m) => m.orderIndex >= 1 && m.slug !== "pustaka-learning-hub").length,
      pendingReviews: allSubmissions.filter((s) => s.status === "pending").length,
      approvedReviews: allSubmissions.filter((s) => s.status === "approved").length
    },
    modules: moduleCards
  };
}
function assembleModuleDetailResponse(params) {
  const {
    targetModule,
    user,
    mentorProfile,
    allModules,
    moduleSlides,
    userSubmissions,
    userUnlocks
  } = params;
  const sortedSlides = [...moduleSlides].sort((a, b) => a.slideNumber - b.slideNumber);
  const moduleByOrderIndex = new Map(
    allModules.map((m) => [m.orderIndex, m])
  );
  const submissionByModuleId = new Map(
    userSubmissions.map((s) => [s.moduleId, s])
  );
  const unlockByModuleId = new Map(
    userUnlocks.map((u) => [u.moduleId, u])
  );
  const prevMod = moduleByOrderIndex.get(targetModule.orderIndex - 1) ?? null;
  const prevSubmission = prevMod ? submissionByModuleId.get(prevMod.id) ?? null : null;
  const currentSubmission = submissionByModuleId.get(targetModule.id) ?? null;
  const currentUnlock = unlockByModuleId.get(targetModule.id) ?? null;
  const access = evaluateModuleAccess({
    user,
    moduleOrderIndex: targetModule.orderIndex,
    isReferenceModule: targetModule.orderIndex === 0 || targetModule.slug === "pustaka-learning-hub",
    prevModuleSubmissionStatus: (prevSubmission == null ? void 0 : prevSubmission.status) ?? null,
    unlockOverride: currentUnlock ? { isUnlocked: currentUnlock.isUnlocked, unlockedBy: currentUnlock.unlockedBy } : null
  });
  const summarySlidesCount = sortedSlides.filter((s) => s.isSummary).length;
  const visibleSlides = access.accessLevel === "FULL_ACCESS" ? sortedSlides : sortedSlides.filter((s) => s.isSummary);
  const moduleCard = buildModuleSummaryCard({
    mod: targetModule,
    slidesForModule: sortedSlides,
    user,
    submissionByModuleId,
    unlockByModuleId,
    moduleByOrderIndex
  });
  const nextMod = moduleByOrderIndex.get(targetModule.orderIndex + 1) ?? null;
  let nextModuleInfo = null;
  if (nextMod) {
    const nextUnlock = unlockByModuleId.get(nextMod.id) ?? null;
    const nextAccess = evaluateModuleAccess({
      user,
      moduleOrderIndex: nextMod.orderIndex,
      isReferenceModule: nextMod.orderIndex === 0 || nextMod.slug === "pustaka-learning-hub",
      prevModuleSubmissionStatus: (currentSubmission == null ? void 0 : currentSubmission.status) ?? null,
      unlockOverride: nextUnlock ? { isUnlocked: nextUnlock.isUnlocked, unlockedBy: nextUnlock.unlockedBy } : null
    });
    nextModuleInfo = {
      slug: nextMod.slug,
      code: nextMod.code,
      title: nextMod.title,
      accessLevel: nextAccess.accessLevel
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
    prevModule: prevMod ? {
      id: prevMod.id,
      orderIndex: prevMod.orderIndex,
      slug: prevMod.slug,
      code: prevMod.code,
      title: prevMod.title,
      submissionStatus: (prevSubmission == null ? void 0 : prevSubmission.status) ?? null,
      mentorFeedback: (prevSubmission == null ? void 0 : prevSubmission.mentorFeedback) ?? null
    } : null,
    nextModule: nextModuleInfo
  };
}
function assembleMentorDashboardResponse(params) {
  const { mentor, allUsers, allModules, allSubmissions, allUnlocks } = params;
  const sortedModules = [...allModules].sort((a, b) => a.orderIndex - b.orderIndex);
  const formalModules = sortedModules.filter((m) => m.orderIndex >= 1 && m.slug !== "pustaka-learning-hub");
  const students = allUsers.filter((u) => u.role === "user").sort((a, b) => a.id - b.id);
  const userById = new Map(allUsers.map((u) => [u.id, u]));
  const moduleById = new Map(sortedModules.map((m) => [m.id, m]));
  const moduleByOrderIndex = new Map(
    sortedModules.map((m) => [m.orderIndex, m])
  );
  const submissionsByUser = /* @__PURE__ */ new Map();
  for (const sub of allSubmissions) {
    let map = submissionsByUser.get(sub.userId);
    if (!map) {
      map = /* @__PURE__ */ new Map();
      submissionsByUser.set(sub.userId, map);
    }
    map.set(sub.moduleId, sub);
  }
  const unlocksByUser = /* @__PURE__ */ new Map();
  for (const unl of allUnlocks) {
    let map = unlocksByUser.get(unl.userId);
    if (!map) {
      map = /* @__PURE__ */ new Map();
      unlocksByUser.set(unl.userId, map);
    }
    map.set(unl.moduleId, unl);
  }
  const queue = [];
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
      moduleTitle: m.title
    });
  }
  const priorityOrder = {
    pending: 0,
    revision: 1,
    approved: 2
  };
  queue.sort((a, b) => {
    const pDiff = priorityOrder[a.status] - priorityOrder[b.status];
    if (pDiff !== 0) return pDiff;
    return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
  });
  const studentsMatrix = students.map((student) => {
    const publicStudent = toPublicUser(student);
    const subMap = submissionsByUser.get(student.id) ?? /* @__PURE__ */ new Map();
    const unlMap = unlocksByUser.get(student.id) ?? /* @__PURE__ */ new Map();
    let approvedCount2 = 0;
    let pendingCount2 = 0;
    let revisionCount2 = 0;
    const moduleCells = formalModules.map((mod) => {
      const sub = subMap.get(mod.id) ?? null;
      const unl = unlMap.get(mod.id) ?? null;
      const prevMod = moduleByOrderIndex.get(mod.orderIndex - 1);
      const prevSub = prevMod ? subMap.get(prevMod.id) ?? null : null;
      const access = evaluateModuleAccess({
        user: publicStudent,
        moduleOrderIndex: mod.orderIndex,
        isReferenceModule: mod.orderIndex === 0 || mod.slug === "pustaka-learning-hub",
        prevModuleSubmissionStatus: (prevSub == null ? void 0 : prevSub.status) ?? null,
        unlockOverride: unl ? { isUnlocked: unl.isUnlocked, unlockedBy: unl.unlockedBy } : null
      });
      if ((sub == null ? void 0 : sub.status) === "approved") approvedCount2 += 1;
      else if ((sub == null ? void 0 : sub.status) === "pending") pendingCount2 += 1;
      else if ((sub == null ? void 0 : sub.status) === "revision") revisionCount2 += 1;
      return {
        moduleId: mod.id,
        orderIndex: mod.orderIndex,
        code: mod.code,
        slug: mod.slug,
        accessLevel: access.accessLevel,
        submissionStatus: (sub == null ? void 0 : sub.status) ?? null,
        isManualOverride: Boolean(unl && isManualOverrideBy(unl.unlockedBy)),
        unlockedBy: (unl == null ? void 0 : unl.unlockedBy) ?? null
      };
    });
    return {
      user: publicStudent,
      modules: moduleCells,
      approvedCount: approvedCount2,
      pendingCount: pendingCount2,
      revisionCount: revisionCount2
    };
  });
  const pendingCount = allSubmissions.filter((s) => s.status === "pending").length;
  const approvedCount = allSubmissions.filter((s) => s.status === "approved").length;
  const revisionCount = allSubmissions.filter((s) => s.status === "revision").length;
  let avgCompletionPercent = 0;
  if (studentsMatrix.length > 0 && formalModules.length > 0) {
    const totalRatio = studentsMatrix.reduce(
      (acc, row) => acc + row.approvedCount / formalModules.length,
      0
    );
    avgCompletionPercent = Math.round(totalRatio / studentsMatrix.length * 100);
  }
  return {
    mentor,
    kpis: {
      totalStudents: students.length,
      pendingCount,
      approvedCount,
      revisionCount,
      avgCompletionPercent
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
      iconName: m.iconName
    }))
  };
}
function formatShortDateId(d) {
  return `${String(d.getUTCDate()).padStart(2, "0")} ${MONTH_SHORT_ID[d.getUTCMonth()]}`;
}
function assembleAnalyticsOverview(params) {
  const { allUsers, allModules, allSubmissions } = params;
  const students = allUsers.filter((u) => u.role === "user").sort((a, b) => a.id - b.id);
  const studentIds = new Set(students.map((s) => s.id));
  const sortedModules = [...allModules].sort((a, b) => a.orderIndex - b.orderIndex);
  const formalModules = sortedModules.filter((m) => m.orderIndex >= 1 && m.slug !== "pustaka-learning-hub");
  const targetModules = formalModules.length > 0 ? formalModules : sortedModules;
  const moduleDenom = targetModules.length || 1;
  const targetModuleIds = new Set(targetModules.map((m) => m.id));
  const studentSubmissions = allSubmissions.filter((s) => studentIds.has(s.userId));
  const nowMs = Date.now();
  const sevenDaysAgoMs = nowMs - 7 * 24 * 60 * 60 * 1e3;
  const activeUserIds7d = /* @__PURE__ */ new Set();
  let reviewedTotalHours = 0;
  let reviewedCount = 0;
  let totalRevisionSubmissions = 0;
  const subsByUser = /* @__PURE__ */ new Map();
  const subsByModule = /* @__PURE__ */ new Map();
  for (const sub of studentSubmissions) {
    const subMs = new Date(sub.submittedAt).getTime();
    if (!Number.isNaN(subMs) && subMs >= sevenDaysAgoMs) {
      activeUserIds7d.add(sub.userId);
    }
    if (sub.status === "revision") {
      totalRevisionSubmissions += 1;
    }
    if (sub.reviewedAt) {
      const revMs = new Date(sub.reviewedAt).getTime();
      if (!Number.isNaN(subMs) && !Number.isNaN(revMs)) {
        reviewedTotalHours += Math.max(0, (revMs - subMs) / 36e5);
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
  const studentPerformance = students.map((student) => {
    const subs = subsByUser.get(student.id) ?? [];
    let approvedCount = 0;
    let pendingCount = 0;
    let revisionCount = 0;
    let lastSubmittedAt = null;
    let lastSubmittedMs = -Infinity;
    for (const s of subs) {
      if (targetModuleIds.has(s.moduleId)) {
        if (s.status === "approved") approvedCount += 1;
        else if (s.status === "pending") pendingCount += 1;
        else if (s.status === "revision") revisionCount += 1;
      }
      const ms = new Date(s.submittedAt).getTime();
      if (!Number.isNaN(ms) && ms > lastSubmittedMs) {
        lastSubmittedMs = ms;
        lastSubmittedAt = s.submittedAt;
      }
    }
    const progressPercent = Math.min(100, Math.round(approvedCount / moduleDenom * 100));
    return {
      userId: student.id,
      name: student.name,
      email: student.email,
      schoolOrigin: student.schoolOrigin,
      approvedCount,
      pendingCount,
      revisionCount,
      progressPercent,
      lastSubmittedAt
    };
  });
  studentPerformance.sort((a, b) => {
    if (b.progressPercent !== a.progressPercent) return b.progressPercent - a.progressPercent;
    if (b.approvedCount !== a.approvedCount) return b.approvedCount - a.approvedCount;
    return a.name.localeCompare(b.name);
  });
  const avgProgressPercent = studentPerformance.length > 0 ? Math.round(
    studentPerformance.reduce((sum, s) => sum + s.progressPercent, 0) / studentPerformance.length
  ) : 0;
  const avgReviewHours = reviewedCount > 0 ? Math.round(reviewedTotalHours / reviewedCount * 10) / 10 : 0;
  const revisionRatePercent = studentSubmissions.length > 0 ? Math.round(totalRevisionSubmissions / studentSubmissions.length * 100) : 0;
  const moduleDifficulty = targetModules.map((mod) => {
    const subs = subsByModule.get(mod.id) ?? [];
    const submissionsCount = subs.length;
    const approvedCount = subs.filter((s) => s.status === "approved").length;
    const revisionCount = subs.filter((s) => s.status === "revision").length;
    return {
      moduleId: mod.id,
      code: mod.code,
      title: mod.title,
      submissionsCount,
      approvedCount,
      revisionCount,
      revisionRatePercent: submissionsCount > 0 ? Math.round(revisionCount / submissionsCount * 100) : 0
    };
  });
  const schoolGroups = /* @__PURE__ */ new Map();
  for (const sp of studentPerformance) {
    const key = sp.schoolOrigin.trim() || "Lainnya";
    const cur = schoolGroups.get(key) ?? { count: 0, sumProgress: 0 };
    cur.count += 1;
    cur.sumProgress += sp.progressPercent;
    schoolGroups.set(key, cur);
  }
  const schoolBreakdown = Array.from(
    schoolGroups.entries()
  ).map(([schoolOrigin, val]) => ({
    schoolOrigin,
    studentCount: val.count,
    avgProgressPercent: Math.round(val.sumProgress / val.count)
  })).sort((a, b) => b.studentCount - a.studentCount || a.schoolOrigin.localeCompare(b.schoolOrigin));
  const weekMs = 7 * 24 * 60 * 60 * 1e3;
  const weeklyTrend = [];
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
      if (sub.status === "approved") {
        const appMs = new Date(sub.reviewedAt ?? sub.submittedAt).getTime();
        if (!Number.isNaN(appMs) && appMs >= startMs && appMs < endMs) {
          approvals += 1;
        }
      }
    }
    weeklyTrend.push({
      weekLabel: formatShortDateId(labelDate),
      submissions,
      approvals
    });
  }
  return {
    kpis: {
      totalStudents: students.length,
      activeStudents7d: activeUserIds7d.size,
      avgProgressPercent,
      avgReviewHours,
      revisionRatePercent,
      totalSubmissions: studentSubmissions.length
    },
    studentPerformance,
    moduleDifficulty,
    schoolBreakdown,
    weeklyTrend
  };
}
class NeonDrizzleRepository {
  constructor(db) {
    __publicField(this, "kind", "neon");
    this.db = db;
  }
  mapUser(row) {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      schoolOrigin: row.schoolOrigin,
      passwordHash: row.passwordHash ?? null,
      role: row.role,
      createdAt: toIsoString(row.createdAt)
    };
  }
  mapModule(row) {
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
      iconName: row.iconName
    };
  }
  mapSlide(row) {
    return {
      id: row.id,
      moduleId: row.moduleId,
      slideNumber: row.slideNumber,
      isSummary: row.isSummary,
      layoutType: row.layoutType,
      badge: row.badge,
      title: row.title,
      subtitle: row.subtitle,
      contentJson: row.contentJson
    };
  }
  mapSubmission(row) {
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
      reviewedAt: toNullableIsoString(row.reviewedAt)
    };
  }
  mapUnlock(row) {
    return {
      id: row.id,
      userId: row.userId,
      moduleId: row.moduleId,
      unlockedBy: row.unlockedBy,
      isUnlocked: row.isUnlocked,
      unlockedAt: toIsoString(row.unlockedAt)
    };
  }
  async ensureSeeded(seedModules, mentorUser) {
    const normalizedMentorEmail = normalizeEmail(mentorUser.email);
    await this.db.insert(users).values({
      name: mentorUser.name,
      email: normalizedMentorEmail,
      schoolOrigin: mentorUser.schoolOrigin,
      role: "mentor"
    }).onConflictDoUpdate({
      target: users.email,
      set: {
        name: mentorUser.name,
        schoolOrigin: mentorUser.schoolOrigin,
        role: "mentor"
      }
    });
    let totalSlides = 0;
    for (const mod of seedModules) {
      const [upsertedModule] = await this.db.insert(modules).values({
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
        iconName: mod.iconName
      }).onConflictDoUpdate({
        target: modules.orderIndex,
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
          iconName: mod.iconName
        }
      }).returning();
      const slideNumbers = mod.slides.map((s) => s.slideNumber);
      if (slideNumbers.length === 0) {
        await this.db.delete(slides).where(eq(slides.moduleId, upsertedModule.id));
      } else {
        await this.db.delete(slides).where(
          and(
            eq(slides.moduleId, upsertedModule.id),
            notInArray(slides.slideNumber, slideNumbers)
          )
        );
      }
      for (const slide of mod.slides) {
        await this.db.insert(slides).values({
          moduleId: upsertedModule.id,
          slideNumber: slide.slideNumber,
          isSummary: slide.isSummary,
          layoutType: slide.layoutType,
          badge: slide.badge,
          title: slide.title,
          subtitle: slide.subtitle,
          contentJson: slide.contentJson
        }).onConflictDoUpdate({
          target: [slides.moduleId, slides.slideNumber],
          set: {
            isSummary: slide.isSummary,
            layoutType: slide.layoutType,
            badge: slide.badge,
            title: slide.title,
            subtitle: slide.subtitle,
            contentJson: slide.contentJson
          }
        });
        totalSlides += 1;
      }
    }
    return { totalModules: seedModules.length, totalSlides };
  }
  async getUserById(id) {
    const [row] = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return row ? toPublicUser(this.mapUser(row)) : null;
  }
  async getBootstrapData(user, mentorProfile) {
    const [userRows, moduleRows, slideRows, submissionRows, unlockRows] = await Promise.all([
      this.db.select().from(users),
      this.db.select().from(modules).orderBy(asc(modules.orderIndex)),
      this.db.select().from(slides).orderBy(asc(slides.slideNumber)),
      this.db.select().from(taskSubmissions),
      user ? this.db.select().from(moduleUnlocks).where(eq(moduleUnlocks.userId, user.id)) : Promise.resolve([])
    ]);
    return assembleBootstrapResponse({
      user,
      mentorProfile,
      allUsers: userRows.map((r) => this.mapUser(r)),
      allModules: moduleRows.map((r) => this.mapModule(r)),
      allSlides: slideRows.map((r) => this.mapSlide(r)),
      allSubmissions: submissionRows.map((r) => this.mapSubmission(r)),
      userUnlocks: unlockRows.map((r) => this.mapUnlock(r))
    });
  }
  async getModuleDetail(slug, user, mentorProfile) {
    const moduleRows = await this.db.select().from(modules).orderBy(asc(modules.orderIndex));
    const targetRow = moduleRows.find((m) => m.slug === slug);
    if (!targetRow) return null;
    const [slideRows, submissionRows, unlockRows] = await Promise.all([
      this.db.select().from(slides).where(eq(slides.moduleId, targetRow.id)).orderBy(asc(slides.slideNumber)),
      user ? this.db.select().from(taskSubmissions).where(eq(taskSubmissions.userId, user.id)) : Promise.resolve([]),
      user ? this.db.select().from(moduleUnlocks).where(eq(moduleUnlocks.userId, user.id)) : Promise.resolve([])
    ]);
    return assembleModuleDetailResponse({
      targetModule: this.mapModule(targetRow),
      user,
      mentorProfile,
      allModules: moduleRows.map((r) => this.mapModule(r)),
      moduleSlides: slideRows.map((r) => this.mapSlide(r)),
      userSubmissions: submissionRows.map((r) => this.mapSubmission(r)),
      userUnlocks: unlockRows.map((r) => this.mapUnlock(r))
    });
  }
  async registerStudent(input) {
    const email = normalizeEmail(input.email);
    const name = input.name.trim();
    const schoolOrigin = input.schoolOrigin.trim();
    const passwordHash = hashPassword(input.password);
    const [existing] = await this.db.select().from(users).where(eq(users.email, email)).limit(1);
    let student;
    if (existing) {
      if (existing.role === "mentor") {
        throw new Error("MENTOR_EMAIL_CONFLICT");
      }
      if (existing.passwordHash && existing.passwordHash.trim().length > 0) {
        throw new Error("EMAIL_ALREADY_REGISTERED");
      }
      const [updated] = await this.db.update(users).set({ name, schoolOrigin, passwordHash }).where(eq(users.id, existing.id)).returning();
      student = toPublicUser(this.mapUser(updated));
    } else {
      const [inserted] = await this.db.insert(users).values({
        name,
        email,
        schoolOrigin,
        passwordHash,
        role: "user"
      }).returning();
      student = toPublicUser(this.mapUser(inserted));
    }
    const [p01] = await this.db.select().from(modules).where(eq(modules.orderIndex, 1)).limit(1);
    if (p01) {
      await this.db.insert(moduleUnlocks).values({
        userId: student.id,
        moduleId: p01.id,
        unlockedBy: "SYSTEM_INITIAL",
        isUnlocked: true
      }).onConflictDoNothing({
        target: [moduleUnlocks.userId, moduleUnlocks.moduleId]
      });
    }
    return student;
  }
  async loginStudent(input) {
    const email = normalizeEmail(input.email);
    const [row] = await this.db.select().from(users).where(and(eq(users.email, email), eq(users.role, "user"))).limit(1);
    if (!row || !row.passwordHash) return null;
    if (!verifyPassword(input.password, row.passwordHash)) return null;
    return toPublicUser(this.mapUser(row));
  }
  async verifyMentorLogin(input) {
    if (input.passcode !== getMentorPasscode()) {
      return null;
    }
    const email = normalizeEmail(input.email);
    const [row] = await this.db.select().from(users).where(and(eq(users.email, email), eq(users.role, "mentor"))).limit(1);
    return row ? toPublicUser(this.mapUser(row)) : null;
  }
  async submitTask(userId, input) {
    const user = await this.getUserById(userId);
    if (!user || user.role !== "user") {
      throw new Error("FORBIDDEN_USER");
    }
    const [modRow] = await this.db.select().from(modules).where(eq(modules.id, input.moduleId)).limit(1);
    if (!modRow) {
      throw new Error("MODULE_NOT_FOUND");
    }
    if (modRow.orderIndex < 1 || modRow.slug === "pustaka-learning-hub") {
      throw new Error("MODULE_NOT_SUBMITTABLE");
    }
    let prevStatus = null;
    if (modRow.orderIndex >= 2) {
      const [prevMod] = await this.db.select().from(modules).where(eq(modules.orderIndex, modRow.orderIndex - 1)).limit(1);
      if (prevMod) {
        const [prevSub] = await this.db.select().from(taskSubmissions).where(
          and(
            eq(taskSubmissions.userId, userId),
            eq(taskSubmissions.moduleId, prevMod.id)
          )
        ).limit(1);
        prevStatus = (prevSub == null ? void 0 : prevSub.status) ?? null;
      }
    }
    const [unlockRow] = await this.db.select().from(moduleUnlocks).where(
      and(
        eq(moduleUnlocks.userId, userId),
        eq(moduleUnlocks.moduleId, modRow.id)
      )
    ).limit(1);
    const access = evaluateModuleAccess({
      user,
      moduleOrderIndex: modRow.orderIndex,
      isReferenceModule: modRow.orderIndex === 0 || modRow.slug === "pustaka-learning-hub",
      prevModuleSubmissionStatus: prevStatus,
      unlockOverride: unlockRow ? { isUnlocked: unlockRow.isUnlocked, unlockedBy: unlockRow.unlockedBy } : null
    });
    if (access.accessLevel !== "FULL_ACCESS" || !access.canSubmitTask) {
      throw new Error("MODULE_LOCKED");
    }
    const now = /* @__PURE__ */ new Date();
    const [upserted] = await this.db.insert(taskSubmissions).values({
      userId,
      moduleId: modRow.id,
      repoUrl: input.repoUrl,
      demoUrl: input.demoUrl ?? null,
      learningLog: input.learningLog,
      status: "pending",
      mentorFeedback: null,
      reviewedBy: null,
      submittedAt: now,
      reviewedAt: null
    }).onConflictDoUpdate({
      target: [taskSubmissions.userId, taskSubmissions.moduleId],
      set: {
        repoUrl: input.repoUrl,
        demoUrl: input.demoUrl ?? null,
        learningLog: input.learningLog,
        status: "pending",
        mentorFeedback: null,
        reviewedBy: null,
        submittedAt: now,
        reviewedAt: null
      }
    }).returning();
    return this.mapSubmission(upserted);
  }
  async getMentorDashboard(mentor) {
    const [userRows, moduleRows, submissionRows, unlockRows] = await Promise.all([
      this.db.select().from(users),
      this.db.select().from(modules).orderBy(asc(modules.orderIndex)),
      this.db.select().from(taskSubmissions),
      this.db.select().from(moduleUnlocks)
    ]);
    return assembleMentorDashboardResponse({
      mentor,
      allUsers: userRows.map((r) => this.mapUser(r)),
      allModules: moduleRows.map((r) => this.mapModule(r)),
      allSubmissions: submissionRows.map((r) => this.mapSubmission(r)),
      allUnlocks: unlockRows.map((r) => this.mapUnlock(r))
    });
  }
  async reviewSubmission(input) {
    const now = /* @__PURE__ */ new Date();
    const [updated] = await this.db.update(taskSubmissions).set({
      status: input.status,
      mentorFeedback: input.mentorFeedback,
      reviewedBy: input.reviewerName,
      reviewedAt: now
    }).where(eq(taskSubmissions.id, input.submissionId)).returning();
    if (!updated) {
      throw new Error("SUBMISSION_NOT_FOUND");
    }
    let unlockedNextModuleSlug = null;
    if (input.status === "approved") {
      const [currentMod] = await this.db.select().from(modules).where(eq(modules.id, updated.moduleId)).limit(1);
      if (currentMod && currentMod.orderIndex >= 1 && currentMod.slug !== "pustaka-learning-hub") {
        const [nextMod] = await this.db.select().from(modules).where(eq(modules.orderIndex, currentMod.orderIndex + 1)).limit(1);
        if (nextMod && nextMod.slug !== "pustaka-learning-hub") {
          await this.db.insert(moduleUnlocks).values({
            userId: updated.userId,
            moduleId: nextMod.id,
            unlockedBy: "MENTOR_ACC",
            isUnlocked: true,
            unlockedAt: now
          }).onConflictDoUpdate({
            target: [moduleUnlocks.userId, moduleUnlocks.moduleId],
            set: {
              unlockedBy: "MENTOR_ACC",
              isUnlocked: true,
              unlockedAt: now
            }
          });
          unlockedNextModuleSlug = nextMod.slug;
        }
      }
    }
    return {
      submission: this.mapSubmission(updated),
      unlockedNextModuleSlug
    };
  }
  async setManualUnlock(input) {
    const [userRow] = await this.db.select({ id: users.id }).from(users).where(eq(users.id, input.userId)).limit(1);
    const [modRow] = await this.db.select({ id: modules.id }).from(modules).where(eq(modules.id, input.moduleId)).limit(1);
    if (!userRow || !modRow) {
      throw new Error("NOT_FOUND");
    }
    const unlockedBy = input.unlocked ? "MENTOR_MANUAL" : "MENTOR_LOCKED";
    const now = /* @__PURE__ */ new Date();
    await this.db.insert(moduleUnlocks).values({
      userId: input.userId,
      moduleId: input.moduleId,
      unlockedBy,
      isUnlocked: input.unlocked,
      unlockedAt: now
    }).onConflictDoUpdate({
      target: [moduleUnlocks.userId, moduleUnlocks.moduleId],
      set: {
        unlockedBy,
        isUnlocked: input.unlocked,
        unlockedAt: now
      }
    });
  }
  async updateModuleContent(moduleId, input) {
    await this.updateModule(moduleId, input);
  }
  async getAnalytics() {
    const [userRows, moduleRows, submissionRows] = await Promise.all([
      this.db.select().from(users),
      this.db.select().from(modules).orderBy(asc(modules.orderIndex)),
      this.db.select().from(taskSubmissions)
    ]);
    return assembleAnalyticsOverview({
      allUsers: userRows.map((r) => this.mapUser(r)),
      allModules: moduleRows.map((r) => this.mapModule(r)),
      allSubmissions: submissionRows.map((r) => this.mapSubmission(r))
    });
  }
  async createModule(input) {
    var _a2, _b;
    const slug = input.slug.trim();
    const [conflict] = await this.db.select({ id: modules.id }).from(modules).where(or(eq(modules.orderIndex, input.orderIndex), eq(modules.slug, slug))).limit(1);
    if (conflict) {
      throw new Error("MODULE_CONFLICT");
    }
    const [inserted] = await this.db.insert(modules).values({
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
      accentGradient: ((_a2 = input.accentGradient) == null ? void 0 : _a2.trim()) || DEFAULT_ACCENT_GRADIENT,
      iconName: ((_b = input.iconName) == null ? void 0 : _b.trim()) || DEFAULT_ICON_NAME
    }).returning();
    return toAdminModuleCard(this.mapModule(inserted), []);
  }
  async updateModule(moduleId, input) {
    const [existing] = await this.db.select().from(modules).where(eq(modules.id, moduleId)).limit(1);
    if (!existing) {
      throw new Error("MODULE_NOT_FOUND");
    }
    if (input.orderIndex !== void 0 || input.slug !== void 0) {
      const nextOrder = input.orderIndex ?? existing.orderIndex;
      const nextSlug = input.slug !== void 0 ? input.slug.trim() : existing.slug;
      const conflicts = await this.db.select({ id: modules.id }).from(modules).where(or(eq(modules.orderIndex, nextOrder), eq(modules.slug, nextSlug)));
      if (conflicts.some((c) => c.id !== moduleId)) {
        throw new Error("MODULE_CONFLICT");
      }
    }
    const patch = {};
    if (input.orderIndex !== void 0) patch.orderIndex = input.orderIndex;
    if (input.month !== void 0) patch.month = input.month;
    if (input.slug !== void 0) patch.slug = input.slug.trim();
    if (input.code !== void 0) patch.code = input.code.trim();
    if (input.sessionType !== void 0) patch.sessionType = input.sessionType.trim();
    if (input.title !== void 0) patch.title = input.title.trim();
    if (input.subtitle !== void 0) patch.subtitle = input.subtitle.trim();
    if (input.summaryText !== void 0) patch.summaryText = input.summaryText.trim();
    if (input.taskPrompt !== void 0) patch.taskPrompt = input.taskPrompt.trim();
    if (input.taskDeliverables !== void 0) patch.taskDeliverables = [...input.taskDeliverables];
    if (input.accentGradient !== void 0) patch.accentGradient = input.accentGradient.trim();
    if (input.iconName !== void 0) patch.iconName = input.iconName.trim();
    let updatedRow = existing;
    if (Object.keys(patch).length > 0) {
      const [row] = await this.db.update(modules).set(patch).where(eq(modules.id, moduleId)).returning();
      if (!row) throw new Error("MODULE_NOT_FOUND");
      updatedRow = row;
    }
    const slideRows = await this.db.select().from(slides).where(eq(slides.moduleId, moduleId));
    return toAdminModuleCard(
      this.mapModule(updatedRow),
      slideRows.map((r) => this.mapSlide(r))
    );
  }
  async deleteModule(moduleId) {
    const [deleted] = await this.db.delete(modules).where(eq(modules.id, moduleId)).returning({ id: modules.id });
    if (!deleted) {
      throw new Error("MODULE_NOT_FOUND");
    }
  }
  async getModuleSlidesAdmin(moduleId) {
    const [mod] = await this.db.select({ id: modules.id }).from(modules).where(eq(modules.id, moduleId)).limit(1);
    if (!mod) {
      throw new Error("MODULE_NOT_FOUND");
    }
    const rows = await this.db.select().from(slides).where(eq(slides.moduleId, moduleId)).orderBy(asc(slides.slideNumber));
    return rows.map((r) => this.mapSlide(r));
  }
  async createSlide(moduleId, input) {
    const existingSlides = await this.getModuleSlidesAdmin(moduleId);
    const maxNum = existingSlides.reduce((m, s) => Math.max(m, s.slideNumber), 0);
    const targetNum = input.slideNumber !== void 0 && input.slideNumber >= 1 ? input.slideNumber : maxNum + 1;
    if (existingSlides.some((s) => s.slideNumber === targetNum)) {
      const toShift = existingSlides.filter((s) => s.slideNumber >= targetNum).sort((a, b) => b.slideNumber - a.slideNumber);
      for (const s of toShift) {
        await this.db.update(slides).set({ slideNumber: s.slideNumber + 1 }).where(eq(slides.id, s.id));
      }
    }
    const [inserted] = await this.db.insert(slides).values({
      moduleId,
      slideNumber: targetNum,
      isSummary: input.isSummary,
      layoutType: input.layoutType,
      badge: input.badge.trim(),
      title: input.title.trim(),
      subtitle: input.subtitle.trim(),
      contentJson: input.contentJson
    }).returning();
    return this.mapSlide(inserted);
  }
  async updateSlide(slideId, input) {
    const [existing] = await this.db.select().from(slides).where(eq(slides.id, slideId)).limit(1);
    if (!existing) {
      throw new Error("SLIDE_NOT_FOUND");
    }
    const patch = {};
    if (input.isSummary !== void 0) patch.isSummary = input.isSummary;
    if (input.layoutType !== void 0) patch.layoutType = input.layoutType;
    if (input.badge !== void 0) patch.badge = input.badge.trim();
    if (input.title !== void 0) patch.title = input.title.trim();
    if (input.subtitle !== void 0) patch.subtitle = input.subtitle.trim();
    if (input.contentJson !== void 0) patch.contentJson = input.contentJson;
    if (input.slideNumber !== void 0 && input.slideNumber >= 1 && input.slideNumber !== existing.slideNumber) {
      const [conflict] = await this.db.select().from(slides).where(
        and(
          eq(slides.moduleId, existing.moduleId),
          eq(slides.slideNumber, input.slideNumber)
        )
      ).limit(1);
      if (conflict && conflict.id !== existing.id) {
        await this.db.update(slides).set({ slideNumber: -existing.id }).where(eq(slides.id, existing.id));
        await this.db.update(slides).set({ slideNumber: existing.slideNumber }).where(eq(slides.id, conflict.id));
      }
      patch.slideNumber = input.slideNumber;
    }
    if (Object.keys(patch).length === 0) {
      return this.mapSlide(existing);
    }
    const [updated] = await this.db.update(slides).set(patch).where(eq(slides.id, slideId)).returning();
    if (!updated) {
      throw new Error("SLIDE_NOT_FOUND");
    }
    return this.mapSlide(updated);
  }
  async deleteSlide(slideId) {
    const [deleted] = await this.db.delete(slides).where(eq(slides.id, slideId)).returning({ id: slides.id, moduleId: slides.moduleId });
    if (!deleted) {
      throw new Error("SLIDE_NOT_FOUND");
    }
    const remaining = await this.db.select().from(slides).where(eq(slides.moduleId, deleted.moduleId)).orderBy(asc(slides.slideNumber));
    const needsTemp = remaining.some((r, idx) => r.slideNumber < idx + 1);
    if (needsTemp) {
      for (let i = 0; i < remaining.length; i += 1) {
        if (remaining[i].slideNumber !== i + 1) {
          await this.db.update(slides).set({ slideNumber: -remaining[i].id }).where(eq(slides.id, remaining[i].id));
        }
      }
    }
    for (let i = 0; i < remaining.length; i += 1) {
      if (remaining[i].slideNumber !== i + 1) {
        await this.db.update(slides).set({ slideNumber: i + 1 }).where(eq(slides.id, remaining[i].id));
      }
    }
  }
}
class LocalJsonRepository {
  constructor(filePath) {
    __publicField(this, "kind", "local");
    __publicField(this, "writeQueue", Promise.resolve());
    this.filePath = filePath;
  }
  async readSnapshot() {
    try {
      const raw = await fs.readFile(this.filePath, "utf8");
      return JSON.parse(raw);
    } catch {
      return {
        counters: {
          users: 0,
          modules: 0,
          slides: 0,
          taskSubmissions: 0,
          moduleUnlocks: 0
        },
        users: [],
        modules: [],
        slides: [],
        taskSubmissions: [],
        moduleUnlocks: []
      };
    }
  }
  async writeSnapshot(snapshot) {
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });
    await fs.writeFile(this.filePath, JSON.stringify(snapshot, null, 2), "utf8");
  }
  withWriteLock(fn) {
    const run = this.writeQueue.then(async () => {
      const db = await this.readSnapshot();
      const result = await fn(db);
      await this.writeSnapshot(db);
      return result;
    });
    this.writeQueue = run.catch(() => void 0);
    return run;
  }
  async ensureSeeded(seedModules, mentorUser) {
    return this.withWriteLock((db) => {
      const email = normalizeEmail(mentorUser.email);
      const existingMentor = db.users.find((u) => u.email === email);
      if (existingMentor) {
        existingMentor.name = mentorUser.name;
        existingMentor.schoolOrigin = mentorUser.schoolOrigin;
        existingMentor.role = "mentor";
      } else {
        db.counters.users += 1;
        db.users.push({
          id: db.counters.users,
          name: mentorUser.name,
          email,
          schoolOrigin: mentorUser.schoolOrigin,
          role: "mentor",
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
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
            iconName: seedMod.iconName
          };
          db.modules.push(mod);
        }
        const modId = mod.id;
        const incomingNumbers = new Set(seedMod.slides.map((s) => s.slideNumber));
        db.slides = db.slides.filter(
          (s) => s.moduleId !== modId || incomingNumbers.has(s.slideNumber)
        );
        for (const seedSlide of seedMod.slides) {
          const existingSlide = db.slides.find(
            (s) => s.moduleId === modId && s.slideNumber === seedSlide.slideNumber
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
              contentJson: seedSlide.contentJson
            });
          }
          totalSlides += 1;
        }
      }
      return { totalModules: seedModules.length, totalSlides };
    });
  }
  async getUserById(id) {
    const db = await this.readSnapshot();
    const row = db.users.find((u) => u.id === id);
    return row ? toPublicUser(row) : null;
  }
  async getBootstrapData(user, mentorProfile) {
    const db = await this.readSnapshot();
    const userUnlocks = user ? db.moduleUnlocks.filter((u) => u.userId === user.id) : [];
    return assembleBootstrapResponse({
      user,
      mentorProfile,
      allUsers: db.users,
      allModules: db.modules,
      allSlides: db.slides,
      allSubmissions: db.taskSubmissions,
      userUnlocks
    });
  }
  async getModuleDetail(slug, user, mentorProfile) {
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
      userUnlocks
    });
  }
  async registerStudent(input) {
    return this.withWriteLock((db) => {
      const email = normalizeEmail(input.email);
      const name = input.name.trim();
      const schoolOrigin = input.schoolOrigin.trim();
      const passwordHash = hashPassword(input.password);
      let student = db.users.find((u) => u.email === email);
      if (student) {
        if (student.role === "mentor") {
          throw new Error("MENTOR_EMAIL_CONFLICT");
        }
        if (student.passwordHash && student.passwordHash.trim().length > 0) {
          throw new Error("EMAIL_ALREADY_REGISTERED");
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
          role: "user",
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        };
        db.users.push(student);
      }
      const p01 = db.modules.find((m) => m.orderIndex === 1);
      if (p01) {
        const existingUnlock = db.moduleUnlocks.find(
          (u) => u.userId === student.id && u.moduleId === p01.id
        );
        if (!existingUnlock) {
          db.counters.moduleUnlocks += 1;
          db.moduleUnlocks.push({
            id: db.counters.moduleUnlocks,
            userId: student.id,
            moduleId: p01.id,
            unlockedBy: "SYSTEM_INITIAL",
            isUnlocked: true,
            unlockedAt: (/* @__PURE__ */ new Date()).toISOString()
          });
        }
      }
      return toPublicUser(student);
    });
  }
  async loginStudent(input) {
    const db = await this.readSnapshot();
    const email = normalizeEmail(input.email);
    const student = db.users.find((u) => u.email === email && u.role === "user");
    if (!student || !student.passwordHash) return null;
    if (!verifyPassword(input.password, student.passwordHash)) return null;
    return toPublicUser(student);
  }
  async verifyMentorLogin(input) {
    if (input.passcode !== getMentorPasscode()) {
      return null;
    }
    const db = await this.readSnapshot();
    const email = normalizeEmail(input.email);
    const mentor = db.users.find((u) => u.email === email && u.role === "mentor");
    return mentor ? toPublicUser(mentor) : null;
  }
  async submitTask(userId, input) {
    return this.withWriteLock((db) => {
      const user = db.users.find((u) => u.id === userId);
      if (!user || user.role !== "user") {
        throw new Error("FORBIDDEN_USER");
      }
      const mod = db.modules.find((m) => m.id === input.moduleId);
      if (!mod) {
        throw new Error("MODULE_NOT_FOUND");
      }
      if (mod.orderIndex < 1 || mod.slug === "pustaka-learning-hub") {
        throw new Error("MODULE_NOT_SUBMITTABLE");
      }
      let prevStatus = null;
      if (mod.orderIndex >= 2) {
        const prevMod = db.modules.find((m) => m.orderIndex === mod.orderIndex - 1);
        if (prevMod) {
          const prevSub = db.taskSubmissions.find(
            (s) => s.userId === userId && s.moduleId === prevMod.id
          );
          prevStatus = (prevSub == null ? void 0 : prevSub.status) ?? null;
        }
      }
      const unlock = db.moduleUnlocks.find(
        (u) => u.userId === userId && u.moduleId === mod.id
      );
      const access = evaluateModuleAccess({
        user: toPublicUser(user),
        moduleOrderIndex: mod.orderIndex,
        isReferenceModule: mod.orderIndex === 0 || mod.slug === "pustaka-learning-hub",
        prevModuleSubmissionStatus: prevStatus,
        unlockOverride: unlock ? { isUnlocked: unlock.isUnlocked, unlockedBy: unlock.unlockedBy } : null
      });
      if (access.accessLevel !== "FULL_ACCESS" || !access.canSubmitTask) {
        throw new Error("MODULE_LOCKED");
      }
      const nowIso = (/* @__PURE__ */ new Date()).toISOString();
      const existing = db.taskSubmissions.find(
        (s) => s.userId === userId && s.moduleId === mod.id
      );
      if (existing) {
        existing.repoUrl = input.repoUrl;
        existing.demoUrl = input.demoUrl ?? null;
        existing.learningLog = input.learningLog;
        existing.status = "pending";
        existing.mentorFeedback = null;
        existing.reviewedBy = null;
        existing.submittedAt = nowIso;
        existing.reviewedAt = null;
        return { ...existing };
      }
      db.counters.taskSubmissions += 1;
      const created = {
        id: db.counters.taskSubmissions,
        userId,
        moduleId: mod.id,
        repoUrl: input.repoUrl,
        demoUrl: input.demoUrl ?? null,
        learningLog: input.learningLog,
        status: "pending",
        mentorFeedback: null,
        reviewedBy: null,
        submittedAt: nowIso,
        reviewedAt: null
      };
      db.taskSubmissions.push(created);
      return { ...created };
    });
  }
  async getMentorDashboard(mentor) {
    const db = await this.readSnapshot();
    return assembleMentorDashboardResponse({
      mentor,
      allUsers: db.users,
      allModules: db.modules,
      allSubmissions: db.taskSubmissions,
      allUnlocks: db.moduleUnlocks
    });
  }
  async reviewSubmission(input) {
    return this.withWriteLock((db) => {
      const submission = db.taskSubmissions.find((s) => s.id === input.submissionId);
      if (!submission) {
        throw new Error("SUBMISSION_NOT_FOUND");
      }
      const nowIso = (/* @__PURE__ */ new Date()).toISOString();
      submission.status = input.status;
      submission.mentorFeedback = input.mentorFeedback;
      submission.reviewedBy = input.reviewerName;
      submission.reviewedAt = nowIso;
      let unlockedNextModuleSlug = null;
      if (input.status === "approved") {
        const currentMod = db.modules.find((m) => m.id === submission.moduleId);
        if (currentMod && currentMod.orderIndex >= 1 && currentMod.slug !== "pustaka-learning-hub") {
          const nextMod = db.modules.find((m) => m.orderIndex === currentMod.orderIndex + 1);
          if (nextMod && nextMod.slug !== "pustaka-learning-hub") {
            const existingUnlock = db.moduleUnlocks.find(
              (u) => u.userId === submission.userId && u.moduleId === nextMod.id
            );
            if (existingUnlock) {
              existingUnlock.unlockedBy = "MENTOR_ACC";
              existingUnlock.isUnlocked = true;
              existingUnlock.unlockedAt = nowIso;
            } else {
              db.counters.moduleUnlocks += 1;
              db.moduleUnlocks.push({
                id: db.counters.moduleUnlocks,
                userId: submission.userId,
                moduleId: nextMod.id,
                unlockedBy: "MENTOR_ACC",
                isUnlocked: true,
                unlockedAt: nowIso
              });
            }
            unlockedNextModuleSlug = nextMod.slug;
          }
        }
      }
      return {
        submission: { ...submission },
        unlockedNextModuleSlug
      };
    });
  }
  async setManualUnlock(input) {
    return this.withWriteLock((db) => {
      const userExists = db.users.some((u) => u.id === input.userId);
      const modExists = db.modules.some((m) => m.id === input.moduleId);
      if (!userExists || !modExists) {
        throw new Error("NOT_FOUND");
      }
      const unlockedBy = input.unlocked ? "MENTOR_MANUAL" : "MENTOR_LOCKED";
      const nowIso = (/* @__PURE__ */ new Date()).toISOString();
      const existing = db.moduleUnlocks.find(
        (u) => u.userId === input.userId && u.moduleId === input.moduleId
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
          unlockedAt: nowIso
        });
      }
    });
  }
  async updateModuleContent(moduleId, input) {
    await this.updateModule(moduleId, input);
  }
  async getAnalytics() {
    const db = await this.readSnapshot();
    return assembleAnalyticsOverview({
      allUsers: db.users,
      allModules: db.modules,
      allSubmissions: db.taskSubmissions
    });
  }
  async createModule(input) {
    return this.withWriteLock((db) => {
      var _a2, _b;
      const slug = input.slug.trim();
      if (db.modules.some((m) => m.orderIndex === input.orderIndex || m.slug === slug)) {
        throw new Error("MODULE_CONFLICT");
      }
      db.counters.modules += 1;
      const mod = {
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
        accentGradient: ((_a2 = input.accentGradient) == null ? void 0 : _a2.trim()) || DEFAULT_ACCENT_GRADIENT,
        iconName: ((_b = input.iconName) == null ? void 0 : _b.trim()) || DEFAULT_ICON_NAME
      };
      db.modules.push(mod);
      return toAdminModuleCard(mod, []);
    });
  }
  async updateModule(moduleId, input) {
    return this.withWriteLock((db) => {
      const mod = db.modules.find((m) => m.id === moduleId);
      if (!mod) {
        throw new Error("MODULE_NOT_FOUND");
      }
      const nextOrder = input.orderIndex ?? mod.orderIndex;
      const nextSlug = input.slug !== void 0 ? input.slug.trim() : mod.slug;
      if (db.modules.some(
        (m) => m.id !== moduleId && (m.orderIndex === nextOrder || m.slug === nextSlug)
      )) {
        throw new Error("MODULE_CONFLICT");
      }
      if (input.orderIndex !== void 0) mod.orderIndex = input.orderIndex;
      if (input.month !== void 0) mod.month = input.month;
      if (input.slug !== void 0) mod.slug = nextSlug;
      if (input.code !== void 0) mod.code = input.code.trim();
      if (input.sessionType !== void 0) mod.sessionType = input.sessionType.trim();
      if (input.title !== void 0) mod.title = input.title.trim();
      if (input.subtitle !== void 0) mod.subtitle = input.subtitle.trim();
      if (input.summaryText !== void 0) mod.summaryText = input.summaryText.trim();
      if (input.taskPrompt !== void 0) mod.taskPrompt = input.taskPrompt.trim();
      if (input.taskDeliverables !== void 0) mod.taskDeliverables = [...input.taskDeliverables];
      if (input.accentGradient !== void 0) mod.accentGradient = input.accentGradient.trim();
      if (input.iconName !== void 0) mod.iconName = input.iconName.trim();
      const slidesForMod = db.slides.filter((s) => s.moduleId === moduleId);
      return toAdminModuleCard(mod, slidesForMod);
    });
  }
  async deleteModule(moduleId) {
    return this.withWriteLock((db) => {
      const idx = db.modules.findIndex((m) => m.id === moduleId);
      if (idx === -1) {
        throw new Error("MODULE_NOT_FOUND");
      }
      db.modules.splice(idx, 1);
      db.slides = db.slides.filter((s) => s.moduleId !== moduleId);
      db.taskSubmissions = db.taskSubmissions.filter((s) => s.moduleId !== moduleId);
      db.moduleUnlocks = db.moduleUnlocks.filter((u) => u.moduleId !== moduleId);
    });
  }
  async getModuleSlidesAdmin(moduleId) {
    const db = await this.readSnapshot();
    if (!db.modules.some((m) => m.id === moduleId)) {
      throw new Error("MODULE_NOT_FOUND");
    }
    return db.slides.filter((s) => s.moduleId === moduleId).sort((a, b) => a.slideNumber - b.slideNumber).map((s) => ({ ...s }));
  }
  async createSlide(moduleId, input) {
    return this.withWriteLock((db) => {
      if (!db.modules.some((m) => m.id === moduleId)) {
        throw new Error("MODULE_NOT_FOUND");
      }
      const modSlides = db.slides.filter((s) => s.moduleId === moduleId);
      const maxNum = modSlides.reduce((m, s) => Math.max(m, s.slideNumber), 0);
      const targetNum = input.slideNumber !== void 0 && input.slideNumber >= 1 ? input.slideNumber : maxNum + 1;
      if (modSlides.some((s) => s.slideNumber === targetNum)) {
        for (const s of modSlides) {
          if (s.slideNumber >= targetNum) {
            s.slideNumber += 1;
          }
        }
      }
      db.counters.slides += 1;
      const created = {
        id: db.counters.slides,
        moduleId,
        slideNumber: targetNum,
        isSummary: input.isSummary,
        layoutType: input.layoutType,
        badge: input.badge.trim(),
        title: input.title.trim(),
        subtitle: input.subtitle.trim(),
        contentJson: input.contentJson
      };
      db.slides.push(created);
      return { ...created };
    });
  }
  async updateSlide(slideId, input) {
    return this.withWriteLock((db) => {
      const slide = db.slides.find((s) => s.id === slideId);
      if (!slide) {
        throw new Error("SLIDE_NOT_FOUND");
      }
      if (input.slideNumber !== void 0 && input.slideNumber >= 1 && input.slideNumber !== slide.slideNumber) {
        const conflict = db.slides.find(
          (s) => s.moduleId === slide.moduleId && s.id !== slide.id && s.slideNumber === input.slideNumber
        );
        if (conflict) {
          conflict.slideNumber = slide.slideNumber;
        }
        slide.slideNumber = input.slideNumber;
      }
      if (input.isSummary !== void 0) slide.isSummary = input.isSummary;
      if (input.layoutType !== void 0) slide.layoutType = input.layoutType;
      if (input.badge !== void 0) slide.badge = input.badge.trim();
      if (input.title !== void 0) slide.title = input.title.trim();
      if (input.subtitle !== void 0) slide.subtitle = input.subtitle.trim();
      if (input.contentJson !== void 0) slide.contentJson = input.contentJson;
      return { ...slide };
    });
  }
  async deleteSlide(slideId) {
    return this.withWriteLock((db) => {
      const idx = db.slides.findIndex((s) => s.id === slideId);
      if (idx === -1) {
        throw new Error("SLIDE_NOT_FOUND");
      }
      const { moduleId } = db.slides[idx];
      db.slides.splice(idx, 1);
      const remaining = db.slides.filter((s) => s.moduleId === moduleId).sort((a, b) => a.slideNumber - b.slideNumber);
      remaining.forEach((s, i) => {
        s.slideNumber = i + 1;
      });
    });
  }
}
async function createBootcampRepository(options) {
  const databaseUrl = process.env.DATABASE_URL;
  const localFilePath = path.resolve(process.cwd(), ".data/bootcamp-db.json");
  if (databaseUrl && databaseUrl.startsWith("postgres")) {
    try {
      const sql = neon(databaseUrl);
      await sql`SELECT 1`;
      const db = drizzle(sql, { schema });
      return new NeonDrizzleRepository(db);
    } catch {
      console.warn(
        "[repository] Neon PostgreSQL connection failed; falling back to local JSON repository."
      );
    }
  }
  return new LocalJsonRepository(localFilePath);
}
const DEFAULT_MENTOR_USER = {
  name: "Alfin",
  email: "kangalfin95@gmail.com",
  schoolOrigin: "PT Digital Teknologi Perkasa",
  role: "mentor"
};
const MENTOR_PROFILE = {
  name: "Alfin",
  roleTitle: "Software Engineer Digitek Perkasa",
  company: "PT Digital Teknologi Perkasa",
  division: "Berfokus pada bidang Full-Stack Development, UI/UX Design, dan DevOps",
  tagline: "Saya merancang bootcamp ini untuk membagikan wawasan yang telah saya kuasai melalui penyampaian yang ringkas dan mudah diikuti. Seluruh materi disusun berdasarkan praktik kerja nyata, bukan sekadar teori.",
  specializations: [
    "Nuxt 4 & Nitro",
    "Vue 3 Composition API",
    "TypeScript",
    "Tailwind CSS",
    "Supabase & MySQL",
    "Neon Serverless Postgres",
    "AI & RAG Integrator"
  ],
  projects: [
    {
      name: "CoupleCash",
      year: "2026",
      description: "Aplikasi keuangan pasangan dengan asisten AI dan pemindai struk otomatis berbasis Vision AI.",
      stack: ["Nuxt 4", "Vue 3", "TypeScript", "Tailwind CSS", "Vision AI"]
    },
    {
      name: "Digitek Corporate Web",
      year: "2025",
      description: "Situs resmi dan panel admin PT Digital Teknologi Perkasa untuk manajemen profil layanan.",
      stack: ["Vue 3", "Nuxt", "Tailwind CSS", "Supabase"]
    },
    {
      name: "E-Lapak Pontren",
      year: "2025",
      description: "Platform niaga UMKM pondok pesantren yang memenuhi standar aksesibilitas inklusif WCAG 2.2 AA.",
      stack: ["HTML5", "CSS3", "JavaScript", "WCAG 2.2 AA"]
    },
    {
      name: "Katalog Website PPDB Pesantren Smart Digital",
      year: "2026",
      description: "Katalog solusi penerimaan santri baru berbasis web dengan mesin server Nitro dan Postgres.",
      stack: ["Nuxt", "Vue 3", "Nitro", "Neon Serverless Postgres"]
    },
    {
      name: "Gateway Pemesanan Padang & Web PPDB Yayasan",
      year: "2025",
      description: "Implementasi HTML semantik, Tailwind CSS, dan JavaScript interaktif untuk UMKM serta yayasan pendidikan.",
      stack: ["HTML5", "CSS3", "Tailwind CSS", "JavaScript"]
    }
  ],
  contacts: {
    websites: ["https://allfine.my.id"],
    whatsapp: "https://wa.me/6285789824597",
    email: "kangalfin95@gmail.com",
    cvUrl: "https://allfine.my.id/Alfin-Almustajab-CV.pdf"
  }
};
const STANDARD_LEARNING_LOG_FIELDS$1 = [
  "Tanggal",
  "Materi",
  "Hal baru yang dipahami",
  "Praktik yang dikerjakan",
  "Kendala yang ditemukan",
  "Cara mengatasi",
  "Hal yang masih belum dipahami",
  "Link repository / commit"
];
const MONTH_1_MODULES = [
  // ============================================================================
  // P00 || PANDUAN KURIKULUM & EVALUASI
  // ============================================================================
  {
    orderIndex: 0,
    month: 0,
    slug: "panduan-kurikulum-evaluasi",
    code: "P00",
    sessionType: "Panduan Program",
    title: "Panduan Program, Dual-Track Project & Rubrik Evaluasi",
    subtitle: "Peta belajar tiga bulan magang rekayasa perangkat lunak dari dasar web hingga aplikasi fullstack.",
    summaryText: "Pelajari porsi 30% konsep dan 70% praktik, evolusi proyek, rubrik nilai, serta aturan Learning Log.",
    taskPrompt: "Pelajari panduan kurikulum, aktifkan akun GitHub, dan pahami alur persetujuan bertahap sebelum memulai Pertemuan 01.",
    taskDeliverables: [
      "Memahami struktur 15 pertemuan selama 3 bulan.",
      "Memahami evolusi proyek TaskFlow dan InternFlow.",
      "Menyiapkan templat Learning Log untuk setiap akhir pertemuan."
    ],
    accentGradient: "from-slate-900 to-slate-700",
    iconName: "Compass",
    slides: [
      {
        slideNumber: 1,
        isSummary: true,
        layoutType: "cover",
        badge: "Panduan Resmi",
        title: "Software Engineering Internship || Roadmap 3 Bulan",
        subtitle: "Program pembinaan magang PT Digital Teknologi Perkasa berbasis konsep terukur dan praktik nyata.",
        contentJson: {
          eyebrow: "PT Digital Teknologi Perkasa • Lead Mentor: Alfin Almustajab",
          highlights: [
            "Program mencakup 15 pertemuan formal berdurasi 2–3 jam per sesi.",
            "Setiap sesi terdiri atas 30% konsep dasar dan 70% praktik.",
            "Lima belas tugas mingguan menjaga ritme latihan mandiri peserta.",
            "Target akhir berupa aplikasi web fullstack siap pakai dan terpublikasi."
          ],
          stats: [
            { label: "Durasi Program", value: "3 Bulan (12 Minggu)" },
            { label: "Komposisi Sesi", value: "30% Konsep : 70% Praktik" },
            { label: "Total Pertemuan", value: "15 Pertemuan Formal" },
            { label: "Target Output", value: "Fullstack Web App" }
          ]
        }
      },
      {
        slideNumber: 2,
        isSummary: true,
        layoutType: "summary",
        badge: "Dual-Track Project",
        title: "Satu Produk Berevolusi: TaskFlow & InternFlow",
        subtitle: "Kembangkan satu produk secara bertahap dari peramban lokal menuju arsitektur fullstack modern.",
        contentJson: {
          eyebrow: "Arsitektur Bertahap Bulan 1 Hingga Bulan 3",
          highlights: [
            "Kebutuhan produk tetap sama, sedangkan arsitektur teknis meningkat setiap bulan.",
            "TaskFlow melatih pembuatan aplikasi manajemen tugas dari DOM hingga Nuxt.",
            "InternFlow melatih pembuatan portal profil responsif hingga terhubung basis data."
          ],
          bentoCards: [
            {
              title: "Bulan 1 || Foundation",
              tag: "Pertemuan 01–05",
              description: "Membangun antarmuka TaskFlow dan InternFlow langsung di dalam peramban.",
              bullets: [
                "HTML5 semantik dan tata letak CSS3",
                "JavaScript murni, DOM, dan event listener",
                "Penyimpanan localStorage serta dasar Git"
              ]
            },
            {
              title: "Bulan 2 || Backend & Database",
              tag: "Pertemuan 06–10",
              description: "Menghubungkan antarmuka ke REST API Express dan basis data relasional MySQL.",
              bullets: [
                "Node.js, npm, dan REST API Express",
                "Basis data MySQL dan relasi tabel",
                "Integrasi fetch API dan uji Postman"
              ]
            },
            {
              title: "Bulan 3 || Modern Fullstack",
              tag: "Pertemuan 11–15",
              description: "Menulis ulang aplikasi dengan Vue 3, TypeScript, Nuxt, hingga rilis daring.",
              bullets: [
                "Vite, komponen Vue 3, dan TypeScript",
                "Fullstack Nuxt Nitro dengan MySQL",
                "Rilis ke Railway dan presentasi akhir"
              ]
            }
          ]
        }
      },
      {
        slideNumber: 3,
        isSummary: true,
        layoutType: "bento",
        badge: "Rubrik Evaluasi",
        title: "Bobot Penilaian & Prinsip Evaluasi Bulanan",
        subtitle: "Penilaian mengukur fungsi aplikasi sekaligus pemahaman peserta atas setiap baris kode.",
        contentJson: {
          eyebrow: "Komposisi Penilaian 100% Akhir Bulan",
          highlights: [
            "Pahami konsep, bangun fitur, kuasai kode, dan jelaskan alur kerjanya.",
            "Mentor menguji pemahaman melalui modifikasi kode langsung saat sesi presentasi.",
            "Salin tempel kode tanpa pemahaman konsep dinyatakan belum lulus evaluasi."
          ],
          stats: [
            { label: "Proyek Berjalan", value: "40%" },
            { label: "Kuis Konsep", value: "30%" },
            { label: "Penjelasan Kode", value: "20%" },
            { label: "Kerapian Git", value: "10%" }
          ],
          bentoCards: [
            {
              title: "40% || Proyek Sesuai Target",
              description: "Seluruh fitur wajib berjalan lancar tanpa galat di konsol peramban."
            },
            {
              title: "30% || Kuis Konsep Dasar",
              description: "Peserta menguasai istilah teknis dan logika dasar pada bulan berjalan."
            },
            {
              title: "20% || Presentasi & Bedah Kode",
              description: "Peserta menjelaskan alur data dan menyelesaikan ubahan kode secara langsung."
            },
            {
              title: "10% || Git & Kerapian Repositori",
              description: "Riwayat commit tercatat rapi, struktur berkas bersih, dan README tersedia."
            }
          ]
        }
      },
      {
        slideNumber: 4,
        isSummary: false,
        layoutType: "bento",
        badge: "Skala Nilai & Learning Log",
        title: "Skala Nilai Resmi & Format Learning Log",
        subtitle: "Tulis refleksi belajar pada Learning Log sebagai syarat pengajuan persetujuan mentor.",
        contentJson: {
          eyebrow: "Standar Evaluasi & Dokumentasi Teknis",
          highlights: [
            "Nilai di bawah 70 memerlukan perbaikan terarah pada sesi klinik proyek.",
            "Learning Log melatih komunikasi tertulis mengenai kendala dan solusi teknis."
          ],
          bentoCards: [
            {
              title: "Kategori Lulus (70–100)",
              tag: "Standar Kompeten",
              description: "Rentang nilai peserta yang memenuhi syarat lanjut ke tahap berikutnya.",
              bullets: [
                "90–100: Sangat baik dan mandiri",
                "80–89: Baik dengan sedikit arahan",
                "70–79: Cukup dan paham dasar"
              ]
            },
            {
              title: "Kategori Perbaikan (< 70)",
              tag: "Pendampingan",
              description: "Rentang nilai yang mewajibkan perbaikan fitur sebelum modul baru terbuka.",
              bullets: [
                "60–69: Perlu perbaikan fitur inti",
                "< 60: Wajib remedial materi dasar"
              ]
            },
            {
              title: "Format Wajib Learning Log",
              tag: "Templat Catatan",
              description: "Salin dan lengkapi delapan butir catatan ini saat mengumpulkan tugas.",
              code: {
                title: "Templat Learning Log",
                language: "text",
                filename: "learning-log.txt",
                snippet: `Tanggal: 2026-xx-xx
Materi: Pertemuan 01 - Kickoff & Setup Git
Hal baru yang dipahami: ...
Praktik yang dikerjakan: ...
Kendala yang ditemukan: ...
Cara mengatasi: ...
Hal yang masih belum dipahami: ...
Link repository / commit: https://github.com/username/repo`
              }
            }
          ]
        }
      },
      {
        slideNumber: 5,
        isSummary: false,
        layoutType: "task",
        badge: "Aturan Main & Etika Git",
        title: "Aturan Pembukaan Modul Bertahap & Disiplin Git",
        subtitle: "Modul terbuka berurutan setelah tugas sebelumnya di-ACC mentor agar fondasi kuat.",
        contentJson: {
          eyebrow: "Komitmen Peserta",
          highlights: [
            "Pertemuan berikutnya terbuka otomatis sesudah tugas saat ini di-ACC mentor.",
            "Jika berstatus revisi, perbaiki kode sesuai catatan lalu kirim ulang commit.",
            "Rekam progres lewat commit kecil per fitur, bukan satu tumpukan akhir."
          ],
          comparison: {
            badTitle: "✕ Kebiasaan Penghambat Belajar",
            badPoints: [
              "Menyalin kode AI mentah tanpa memahami alur logika program.",
              "Menyimpan berkas proyek memakai arsip manual tanpa riwayat Git.",
              "Menulis pesan commit kabur seperti update atau perbaikan biasa."
            ],
            goodTitle: "✓ Standar Intern PT Digital Teknologi Perkasa",
            goodPoints: [
              "Memahami konsep dasar, mengetik kode mandiri, lalu menguji hasilnya.",
              "Melakukan commit bertahap setiap kali satu fitur selesai diuji.",
              "Menulis pesan commit spesifik serta mencatat kendala di Learning Log."
            ]
          },
          deliverables: [
            "Mendaftar akun peserta dengan nama, surel, dan asal sekolah yang valid.",
            "Memahami mekanisme pembukaan modul berurutan melalui persetujuan mentor.",
            "Menyiapkan catatan Learning Log untuk diisi jujur sejak Pertemuan 01."
          ],
          learningLogFields: STANDARD_LEARNING_LOG_FIELDS$1,
          mentorTip: "Pesan galat di terminal dan konsol adalah petunjuk kerja harian, jadi biasakan membaca baris pesannya dan mencatat solusinya."
        }
      }
    ]
  },
  // ============================================================================
  // P01 || KICKOFF, CARA KERJA WEB & SETUP GIT/GITHUB
  // ============================================================================
  {
    orderIndex: 1,
    month: 1,
    slug: "pertemuan-01-kickoff-web-overview",
    code: "P01",
    sessionType: "Kickoff",
    title: "Kickoff, Cara Kerja Web & Setup Git/GitHub",
    subtitle: "Pahami komunikasi klien-server melalui HTTP, siapkan perkakas kerja, dan unggah repositori GitHub pertama.",
    summaryText: "Pelajari alur permintaan HTTP, peran tiga lapisan web, instalasi perkakas, serta alur dasar Git.",
    taskPrompt: "Pasang perkakas kerja, buat repositori GitHub berisi index.html profil awal, lalu kirim tautan beserta Learning Log.",
    taskDeliverables: [
      "VS Code, Git, Node.js, dan XAMPP terpasang serta terverifikasi di terminal.",
      "Repositori publik pertama telah dibuat di akun GitHub masing-masing.",
      "Berkas index.html dan README.md berhasil di-commit serta di-push."
    ],
    accentGradient: "from-orange-500 to-amber-500",
    iconName: "RocketLaunch",
    slides: [
      {
        slideNumber: 1,
        isSummary: true,
        layoutType: "cover",
        badge: "Bulan 1 • Pertemuan 01",
        title: "Kickoff, Cara Kerja Web & Setup Git/GitHub",
        subtitle: "Pahami cara kerja internet di balik layar dan siapkan lingkungan kerja standar industri.",
        contentJson: {
          eyebrow: "Sesi Kickoff • 30% Konsep / 70% Praktik",
          highlights: [
            "Mengenal alur kerja rekayasa perangkat lunak dari analisis hingga rilis.",
            "Memahami komunikasi klien, server, DNS, domain, dan protokol HTTP.",
            "Membedakan tanggung jawab frontend, backend, dan basis data aplikasi.",
            "Menyiapkan ruang kerja lokal lalu mengunggah kode perdana ke GitHub."
          ],
          stats: [
            { label: "Jenis Sesi", value: "Kickoff" },
            { label: "Durasi", value: "2–3 Jam" },
            { label: "Target Output", value: "Repo GitHub #1" },
            { label: "Tugas Mingguan", value: "Minggu 1" }
          ]
        }
      },
      {
        slideNumber: 2,
        isSummary: true,
        layoutType: "summary",
        badge: "Executive Summary",
        title: "Mengapa Arsitektur Web & Git Wajib Dikuasai Sejak Awal?",
        subtitle: "Pahami lokasi eksekusi kode dan cara mengamankan versi berkas sebelum menulis fitur.",
        contentJson: {
          eyebrow: "Fondasi Kerja Pengembang Web",
          highlights: [
            "Model klien-server memperjelas batas kode di peramban dan di server.",
            "Git dan GitHub menjaga riwayat perubahan sekaligus menjadi portofolio peninjauan.",
            "Instalasi perkakas hari pertama mencegah hambatan teknis pada pertemuan berikutnya."
          ],
          bentoCards: [
            {
              title: "Rumah Proyek InternFlow",
              tag: "Workspace",
              description: "Repositori yang dibuat hari ini menjadi fondasi pengembangan halaman profil InternFlow."
            },
            {
              title: "Target Keluaran Sesi",
              tag: "Deliverable",
              description: "Seluruh perkakas terverifikasi di terminal dan halaman HTML perdana tampil di GitHub."
            }
          ]
        }
      },
      {
        slideNumber: 3,
        isSummary: true,
        layoutType: "bento",
        badge: "Peta Konsep & Agenda",
        title: "Agenda Sesi: 30% Konsep Web & 70% Setup Perkakas",
        subtitle: "Alokasi waktu belajar terarah dari konsep jaringan hingga praktik terminal langsung.",
        contentJson: {
          eyebrow: "Alur Kegiatan Pertemuan 01",
          highlights: [
            "Bagian awal (30%) membahas alur HTTP serta pembagian tiga lapisan web.",
            "Bagian inti (70%) mempraktikkan instalasi perkakas, konfigurasi Git, dan push kode."
          ],
          bentoCards: [
            {
              title: "1. Cara Kerja Web",
              tag: "15 Menit",
              description: "Proses penerjemahan domain di DNS hingga halaman tampil di peramban."
            },
            {
              title: "2. Tiga Pilar Aplikasi",
              tag: "15 Menit",
              description: "Pembagian peran antarmuka frontend, logika backend, dan penyimpanan basis data."
            },
            {
              title: "3. Persiapan Perkakas",
              tag: "35 Menit",
              description: "Verifikasi instalasi VS Code, Git CLI, Node.js, dan modul XAMPP."
            },
            {
              title: "4. Repositori Pertama",
              tag: "55 Menit",
              description: "Pembuatan index.html diikuti perintah git init, commit, dan push."
            }
          ]
        }
      },
      {
        slideNumber: 4,
        isSummary: false,
        layoutType: "bento",
        badge: "Analogi & Konsep",
        title: "Analogi Restoran: Klien, Server, HTTP & Tiga Lapisan",
        subtitle: "Komunikasi peramban dan server bekerja layaknya pemesanan menu di sebuah restoran.",
        contentJson: {
          eyebrow: "Model Klien-Server",
          highlights: [
            "Peramban bertindak sebagai tamu yang mengirim pesanan melalui permintaan HTTP.",
            "Server memproses permintaan lalu mengembalikan respons berisi HTML atau JSON.",
            "Domain adalah nama lokasi mudah diingat yang mewakili alamat IP."
          ],
          bentoCards: [
            {
              title: "Frontend (Ruang Makan)",
              tag: "Sisi Klien",
              description: "Bagian visual di dalam peramban yang dilihat dan dioperasikan langsung oleh pengguna.",
              bullets: [
                "HTML sebagai kerangka konten",
                "CSS sebagai penata tampilan",
                "JavaScript sebagai penggerak interaksi"
              ]
            },
            {
              title: "Backend (Dapur Server)",
              tag: "Sisi Server",
              description: "Layanan di server yang memvalidasi aturan bisnis, izin akses, dan pertukaran data.",
              bullets: [
                "Node.js dan kerangka Express",
                "Mesin server Nuxt Nitro",
                "Jalur komunikasi REST API"
              ]
            },
            {
              title: "Database (Gudang Data)",
              tag: "Penyimpanan",
              description: "Sistem penyimpan data pengguna dan tugas secara terstruktur serta permanen.",
              bullets: [
                "Basis data relasional MySQL",
                "PostgreSQL pada layanan awan",
                "Struktur tabel dan relasi kunci"
              ]
            }
          ]
        }
      },
      {
        slideNumber: 5,
        isSummary: false,
        layoutType: "bento",
        badge: "Bedah Teknis & Terminal",
        title: "Perintah Dasar Terminal & Siklus Kerja Git",
        subtitle: "Kelola perubahan kode melewati folder kerja, area persiapan, hingga repositori daring.",
        contentJson: {
          eyebrow: "Working Directory → Staging → Repository → GitHub",
          highlights: [
            "Jalankan git status kapan saja untuk memeriksa berkas yang berubah.",
            "Gunakan git add untuk memilih berkas dan git commit menguncinya."
          ],
          codeBlocks: [
            {
              title: "Verifikasi Perkakas & Identitas Git",
              language: "bash",
              filename: "terminal-check.sh",
              snippet: `node -v
npm -v
git --version
code --version

git config --global user.name "Nama Lengkap"
git config --global user.email "nama@email.com"`
            },
            {
              title: "Alur Inisialisasi Hingga Push ke GitHub",
              language: "bash",
              filename: "git-workflow.sh",
              snippet: `git init
git add .
git commit -m "feat: inisialisasi halaman profil awal"
git branch -M main
git remote add origin https://github.com/USERNAME/internflow-profil.git
git push -u origin main`
            }
          ]
        }
      },
      {
        slideNumber: 6,
        isSummary: false,
        layoutType: "comparison",
        badge: "Bad vs Good Practice",
        title: "Pengelolaan Berkas: Salinan Manual vs Alur Git",
        subtitle: "Bandingkan kebiasaan menggandakan folder manual dengan pengelolaan versi standar industri.",
        contentJson: {
          eyebrow: "Disiplin Manajemen Kode",
          highlights: [
            "Git memungkinkan pemulihan kode ke versi sebelumnya tanpa menduplikasi folder proyek."
          ],
          comparison: {
            badTitle: "✕ Cara Manual (Rawan Tertukar)",
            badPoints: [
              "Menggandakan folder bernama revisi_final dan revisi_terakhir di Desktop.",
              "Mengunggah berkas lewat fitur seret lepas di situs web GitHub.",
              "Menulis pesan commit singkat yang tidak menjelaskan isi perubahan."
            ],
            badCode: {
              title: "Struktur & Commit Tidak Teratur",
              language: "text",
              filename: "Desktop/tugas1/",
              snippet: `Desktop/
├── web_rev1.html
├── web_rev2_fix.html
└── index (1).html

git commit -m "upload tugas"`
            },
            goodTitle: "✓ Standar Rekayasa Perangkat Lunak",
            goodPoints: [
              "Menyimpan seluruh proyek di dalam satu folder ruang kerja khusus.",
              "Menjalankan git add, commit, dan push langsung melalui terminal.",
              "Memakai awalan pesan commit yang jelas seperti feat atau fix."
            ],
            goodCode: {
              title: "Struktur & Commit Standar",
              language: "text",
              filename: "workspace/internflow-profil/",
              snippet: `digitek-bootcamp/
└── internflow-profil/
    ├── index.html
    └── README.md

git commit -m "feat: tambah halaman profil awal internflow"`
            }
          }
        }
      },
      {
        slideNumber: 7,
        isSummary: false,
        layoutType: "practice",
        badge: "70% Hands-On Praktik",
        title: "Langkah Praktik: Setup Ruang Kerja & Push Pertama",
        subtitle: "Ikuti empat langkah berurutan ini untuk menuntaskan target praktik Pertemuan 01.",
        contentJson: {
          eyebrow: "Lab Pertemuan 01 || InternFlow Profil Awal",
          highlights: [
            "Pastikan XAMPP sudah terpasang sebagai persiapan basis data Bulan 2."
          ],
          practiceSteps: [
            {
              step: 1,
              title: "Siapkan Folder Ruang Kerja Proyek",
              description: "Buat direktori khusus proyek magang lalu buka folder tersebut di VS Code.",
              command: "mkdir -p ~/digitek-bootcamp/internflow-profil && cd ~/digitek-bootcamp/internflow-profil && code ."
            },
            {
              step: 2,
              title: "Tulis Berkas index.html & README.md",
              description: "Buat kerangka dasar HTML5 berisi nama, asal sekolah, dan target belajar tiga bulan.",
              code: `<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Profil Intern || Nama Lengkap</title>
  </head>
  <body>
    <h1>Halo, saya peserta Digitek Bootcamp</h1>
    <p>Target: Membangun aplikasi fullstack TaskFlow dan InternFlow.</p>
  </body>
</html>`
            },
            {
              step: 3,
              title: "Rekam Commit Pertama di Lokal",
              description: "Inisialisasi Git di terminal VS Code lalu simpan versi perdana kode.",
              command: 'git init && git add . && git commit -m "feat: buat halaman profil html perdana"'
            },
            {
              step: 4,
              title: "Hubungkan Repositori Publik & Push ke GitHub",
              description: "Buat repositori kosong bernama internflow-profil di GitHub lalu unggah cabang utama.",
              command: "git branch -M main && git remote add origin https://github.com/USERNAME/internflow-profil.git && git push -u origin main"
            }
          ]
        }
      },
      {
        slideNumber: 8,
        isSummary: false,
        layoutType: "quiz",
        badge: "Kuis & Pustaka Belajar",
        title: "Uji Pemahaman Pertemuan 01 & Referensi Belajar",
        subtitle: "Jawab tiga pertanyaan konsep berikut secara mandiri sebelum mencocokkan kunci jawaban.",
        contentJson: {
          eyebrow: "Evaluasi Konsep & Referensi Terkurasi",
          highlights: [
            "Jelaskan jawaban menggunakan kalimat sendiri sebelum membuka kunci konsep."
          ],
          quizItems: [
            {
              question: "Apa alur yang terjadi sejak pengguna mengetik alamat situs di peramban hingga halaman tampil?",
              hint: "Urutkan peran DNS, HTTP Request, Server, dan HTTP Response.",
              answer: "Peramban mencari alamat IP server melalui DNS lalu mengirim HTTP Request. Server memproses permintaan dan membalas dengan HTTP Response berisi berkas web untuk di-render ke layar."
            },
            {
              question: "Apa perbedaan tanggung jawab antara Frontend, Backend, dan Database?",
              hint: "Pisahkan area tampilan pengguna, pemrosesan logika, dan penyimpanan data.",
              answer: "Frontend menyajikan antarmuka di peramban, sedangkan Backend memproses logika bisnis serta API di server. Database menyimpan data aplikasi secara terstruktur dan permanen."
            },
            {
              question: "Mengapa kita menjalankan git add sebelum git commit, lalu mengakhirinya dengan git push?",
              hint: "Perhatikan perpindahan berkas dari folder kerja ke GitHub.",
              answer: "Perintah git add memilih perubahan ke Staging Area, lalu git commit merekamnya ke riwayat lokal. Perintah git push mengunggah riwayat lokal tersebut ke repositori GitHub."
            }
          ],
          references: [
            {
              title: "Belajar Git untuk Pemula",
              url: "https://github.com/petanikode/belajar-git",
              author: "Ahmad Muhardian (Petani Kode)",
              category: "Git & Version Control",
              lang: "ID",
              type: "Book"
            },
            {
              title: "Pro Git 2nd Edition (Bahasa Indonesia)",
              url: "https://git-scm.com/book/id/",
              author: "Scott Chacon & Ben Straub",
              category: "Git & Version Control",
              lang: "ID",
              type: "Book"
            },
            {
              title: "GIT & GITHUB Playlist",
              url: "https://www.youtube.com/playlist?list=PLFIM0718LjIVknj6sgsSceMqlq242-jNf",
              author: "Sandhika Galih (Web Programming UNPAS)",
              category: "Git & GitHub",
              lang: "ID",
              type: "Course"
            },
            {
              title: "How the Web Works || MDN Web Docs",
              url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works",
              author: "MDN Contributors",
              category: "Web Fundamentals",
              lang: "EN",
              type: "Docs"
            }
          ],
          weeklyAssignment: {
            week: 1,
            title: "Weekly Coding Assignment || Minggu 1",
            description: "Pasang ekstensi Live Server dan Prettier di VS Code, lengkapi biodata singkat pada index.html, lalu unggah minimal dua commit terpisah ke GitHub."
          }
        }
      },
      {
        slideNumber: 9,
        isSummary: false,
        layoutType: "task",
        badge: "Task Submission",
        title: "Pengumpulan Tugas Pertemuan 01 & Pembukaan P02",
        subtitle: "Kirim tautan repositori GitHub publik beserta Learning Log untuk diperiksa oleh mentor.",
        contentJson: {
          eyebrow: "Syarat Pembukaan Pertemuan 02",
          highlights: [
            "Pertemuan 02 terbuka otomatis setelah tugas ini di-ACC oleh mentor.",
            "Pastikan visibilitas repositori diatur ke Public agar dapat ditinjau."
          ],
          deliverables: [
            "Tautan repositori GitHub publik untuk proyek profil awal.",
            "Berkas index.html dan README.md dengan pesan commit yang rapi.",
            "Catatan Learning Log berisi hasil verifikasi versi perkakas dan kendala instalasi."
          ],
          learningLogFields: STANDARD_LEARNING_LOG_FIELDS$1,
          mentorTip: "Saat diminta autentikasi ketika menjalankan git push, gunakan Git Credential Manager atau Personal Access Token lalu catat langkahnya di Learning Log."
        }
      }
    ]
  },
  // ============================================================================
  // P02 || HTML5 SEMANTIK, BOX MODEL, FLEXBOX, GRID & RESPONSIVE
  // ============================================================================
  {
    orderIndex: 2,
    month: 1,
    slug: "pertemuan-02-html-semantik-css-fundamental",
    code: "P02",
    sessionType: "Materi 1",
    title: "HTML5 Semantik, Box Model, Flexbox, Grid & Responsive",
    subtitle: "Susun dokumen HTML5 semantik dan tata letak responsif memakai Box Model, Flexbox, serta CSS Grid.",
    summaryText: "Kuasai elemen semantik HTML5, aturan Box Model, tata letak Flexbox-Grid, dan media query.",
    taskPrompt: "Bangun halaman profil statis InternFlow memakai HTML5 semantik dan berkas CSS terpisah yang responsif di ponsel maupun desktop.",
    taskDeliverables: [
      "Dokumen memakai tag semantik header, nav, main, section, article, dan footer.",
      "Berkas style.css terpisah menerapkan border-box, Flexbox, serta CSS Grid.",
      "Tata letak tampil rapi di layar ponsel dan desktop menggunakan media query."
    ],
    accentGradient: "from-blue-600 to-cyan-500",
    iconName: "Layout",
    slides: [
      {
        slideNumber: 1,
        isSummary: true,
        layoutType: "cover",
        badge: "Bulan 1 • Pertemuan 02",
        title: "HTML5 Semantik, Box Model, Flexbox, Grid & Responsive",
        subtitle: "Bangun kerangka dokumen yang aksesibel dan tata letak adaptif untuk berbagai ukuran layar.",
        contentJson: {
          eyebrow: "Materi 1 • 30% Konsep / 70% Praktik Tata Letak",
          highlights: [
            "Gunakan tag HTML5 semantik yang menjelaskan peran setiap blok konten.",
            "Atur ukuran elemen secara presisi melalui konsep CSS Box Model.",
            "Padukan Flexbox satu dimensi dengan CSS Grid dua dimensi.",
            "Sesuaikan tampilan layar ponsel dan desktop menggunakan aturan media query."
          ],
          stats: [
            { label: "Jenis Sesi", value: "Materi 1" },
            { label: "Fokus Proyek", value: "InternFlow" },
            { label: "Target Output", value: "Profil Responsif" },
            { label: "Tugas Mingguan", value: "Minggu 2" }
          ]
        }
      },
      {
        slideNumber: 2,
        isSummary: true,
        layoutType: "summary",
        badge: "Executive Summary",
        title: "Mengapa Struktur Semantik & Tata Letak Modern Penting?",
        subtitle: "Kode yang terstruktur rapi memudahkan pembacaan mesin pencari, pembaca layar, dan rekan setim.",
        contentJson: {
          eyebrow: "Peran Pertemuan 02 pada Evolusi Produk",
          highlights: [
            "HTML semantik meningkatkan kualitas SEO sekaligus aksesibilitas bagi pengguna pembaca layar.",
            "Pemahaman Box Model dan Grid menghentikan kebiasaan menebak margin acak.",
            "Antarmuka InternFlow menjadi fondasi gaya visual untuk aplikasi TaskFlow berikutnya."
          ],
          bentoCards: [
            {
              title: "HTML sebagai Struktur Makna",
              tag: "Kerangka",
              description: "Menentukan hierarki judul, navigasi, konten inti, formulir, dan kaki halaman."
            },
            {
              title: "CSS sebagai Sistem Tata Letak",
              tag: "Visual",
              description: "Mengendalikan tipografi, ruang kosong, susunan kartu, dan adaptasi lebar layar."
            }
          ]
        }
      },
      {
        slideNumber: 3,
        isSummary: true,
        layoutType: "bento",
        badge: "Peta Konsep & Agenda",
        title: "Peta Materi: Dari HTML5 Semantik Hingga Media Query",
        subtitle: "Pelajari empat fondasi antarmuka lalu terapkan langsung pada halaman profil InternFlow.",
        contentJson: {
          eyebrow: "Agenda Sesi Pertemuan 02",
          highlights: [
            "Sesi konsep (30%) membedah tag semantik, Box Model, dan Grid.",
            "Sesi praktik (70%) merakit navigasi Flexbox, kartu Grid, dan responsif."
          ],
          bentoCards: [
            {
              title: "1. HTML5 Semantik & Form",
              tag: "20 Menit",
              description: "Penggunaan tag struktural halaman beserta elemen input dan label formulir."
            },
            {
              title: "2. Selektor & Box Model",
              tag: "25 Menit",
              description: "Perhitungan ruang content, padding, border, margin, dan aturan border-box."
            },
            {
              title: "3. Flexbox & CSS Grid",
              tag: "45 Menit",
              description: "Penyusunan baris navigasi dengan Flex dan daftar kartu proyek dengan Grid."
            },
            {
              title: "4. Desain Responsif",
              tag: "50 Menit",
              description: "Penyesuaian kolom dan arah elemen di layar ponsel melalui media query."
            }
          ]
        }
      },
      {
        slideNumber: 4,
        isSummary: false,
        layoutType: "bento",
        badge: "Analogi & Konsep",
        title: "Analogi Paket Kiriman (Box Model) & Pemilihan Layout",
        subtitle: "Setiap elemen HTML merupakan kotak empat lapis yang disusun satu atau dua arah.",
        contentJson: {
          eyebrow: "Model Visual CSS",
          highlights: [
            "Empat lapis Box Model mencakup content, padding, border, dan margin.",
            "Gunakan Flexbox untuk satu arah dan Grid untuk baris-kolom."
          ],
          bentoCards: [
            {
              title: "Elemen Semantik Utama",
              tag: "Struktur HTML5",
              description: "Gunakan tag bermakna jelas sesuai peran konten di dalam halaman.",
              bullets: [
                "header dan nav untuk kepala navigasi",
                "main untuk satu area konten utama",
                "section, article, dan footer sesuai konteks"
              ]
            },
            {
              title: "Aturan Wajib border-box",
              tag: "Ukuran Presisi",
              description: "Nilai lebar elemen langsung mencakup ruang padding dan garis border tanpa melebar keluar."
            },
            {
              title: "Prinsip Desain Responsif",
              tag: "Multi-Layar",
              description: "Padukan meta viewport, satuan relatif rem atau fr, dan titik potong media query."
            }
          ]
        }
      },
      {
        slideNumber: 5,
        isSummary: false,
        layoutType: "bento",
        badge: "Bedah Teknis & Sintaks",
        title: "Pola Kode HTML Semantik, Flexbox & Grid Responsif",
        subtitle: "Gunakan pola dasar ini untuk menjaga struktur dokumen tetap bersih dan adaptif.",
        contentJson: {
          eyebrow: "Cuplikan Kode Inti",
          highlights: [
            "Hubungkan berkas style.css melalui elemen link di dalam bagian head.",
            "Fungsi auto-fit dan minmax membuat kolom Grid menyesuaikan lebar layar otomatis."
          ],
          codeBlocks: [
            {
              title: "Kerangka HTML5 Semantik",
              language: "html",
              filename: "index.html",
              snippet: `<header class="navbar">
  <a href="#profil" class="brand">InternFlow</a>
  <nav aria-label="Navigasi utama">
    <a href="#proyek">Proyek</a>
    <a href="#kontak">Kontak</a>
  </nav>
</header>
<main>
  <section id="proyek" class="projects-grid">
    <article class="card"><h2>TaskFlow</h2></article>
  </section>
</main>
<footer><p>&copy; 2026 InternFlow</p></footer>`
            },
            {
              title: "Reset Box Model, Flexbox & Grid",
              language: "css",
              filename: "style.css",
              snippet: `*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
}
@media (max-width: 640px) {
  .navbar { flex-direction: column; gap: 0.75rem; }
}`
            }
          ]
        }
      },
      {
        slideNumber: 6,
        isSummary: false,
        layoutType: "comparison",
        badge: "Bad vs Good Practice",
        title: "Div Berlebihan & Gaya Inline vs Semantik & CSS Terpisah",
        subtitle: "Pisahkan struktur HTML dari aturan gaya CSS agar kode mudah dirawat.",
        contentJson: {
          eyebrow: "Perbandingan Kualitas Kode",
          highlights: [
            "Berkas CSS eksternal menjaga dokumen HTML tetap ringkas dan konsisten."
          ],
          comparison: {
            badTitle: "✕ Penulisan Kaku & Sulit Dirawat",
            badPoints: [
              "Membungkus seluruh bagian halaman hanya menggunakan elemen div generik.",
              "Menulis atribut style berulang langsung di dalam tag HTML.",
              "Memasang lebar piksel kaku sehingga tampilan terpotong di layar ponsel."
            ],
            badCode: {
              title: "Contoh Div Soup & Lebar Kaku",
              language: "html",
              filename: "bad-profile.html",
              snippet: `<div style="width: 1200px; background: blue; color: white;">
  <div style="font-size: 24px;">Profil Saya</div>
</div>
<br><br>
<div onclick="kirim()">Klik di sini</div>`
            },
            goodTitle: "✓ Standar Semantik & Responsif",
            goodPoints: [
              "Memilih tag header, main, section, dan button sesuai fungsi aslinya.",
              "Menempatkan seluruh aturan tampilan di dalam berkas style.css terpisah.",
              "Memakai max-width, Flexbox, dan Grid agar adaptif di semua layar."
            ],
            goodCode: {
              title: "HTML Semantik Bersih",
              language: "html",
              filename: "good-profile.html",
              snippet: `<header class="site-header">
  <h1 class="site-title">Profil Saya</h1>
</header>
<main class="container">
  <section class="profile-card">
    <button type="button" class="btn-primary">Lihat Proyek</button>
  </section>
</main>`
            }
          }
        }
      },
      {
        slideNumber: 7,
        isSummary: false,
        layoutType: "practice",
        badge: "70% Hands-On Praktik",
        title: "Langkah Praktik: Merakit Halaman Profil InternFlow",
        subtitle: "Kembangkan halaman HTML awal menjadi portal profil responsif dalam empat langkah.",
        contentJson: {
          eyebrow: "Lab Pertemuan 02 || InternFlow",
          highlights: [
            "Aktifkan Live Server di VS Code untuk memantau perubahan langsung."
          ],
          practiceSteps: [
            {
              step: 1,
              title: "Susun Kerangka Semantik & Tautkan CSS",
              description: "Buat berkas style.css lalu bangun struktur header, main, daftar proyek, form kontak, dan footer.",
              command: "touch style.css"
            },
            {
              step: 2,
              title: "Terapkan Reset Box Model & Pembungkus Lebar",
              description: "Pasang aturan border-box serta kelas pembungkus tengah agar konten nyaman dibaca.",
              code: `*, *::before, *::after { box-sizing: border-box; }
.container {
  width: min(100% - 2rem, 1040px);
  margin-inline: auto;
}`
            },
            {
              step: 3,
              title: "Atur Navigasi Flexbox & Kartu Proyek Grid",
              description: "Sejajarkan menu navigasi memakai Flexbox dan tata daftar keahlian menggunakan CSS Grid."
            },
            {
              step: 4,
              title: "Uji Layar Ponsel di DevTools & Push ke GitHub",
              description: "Periksa tampilan pada lebar 375px dan 1280px tanpa geser samping, lalu unggah commit.",
              command: 'git add . && git commit -m "feat: terapkan html semantik dan css responsif internflow" && git push'
            }
          ]
        }
      },
      {
        slideNumber: 8,
        isSummary: false,
        layoutType: "quiz",
        badge: "Kuis & Pustaka Belajar",
        title: "Uji Pemahaman Pertemuan 02 & Referensi HTML/CSS",
        subtitle: "Uji penguasaan konsep semantik, lapisan Box Model, serta pemilihan Flexbox dan Grid.",
        contentJson: {
          eyebrow: "Evaluasi Konsep & Referensi Terkurasi",
          highlights: [
            "Rumuskan jawaban singkat terlebih dahulu sebelum melihat kunci konsep."
          ],
          quizItems: [
            {
              question: "Mengapa elemen semantik seperti header, main, dan footer lebih disarankan daripada div?",
              hint: "Pertimbangkan keterbacaan kode, aksesibilitas, dan mesin pencari.",
              answer: "Elemen semantik memberi arti struktural yang jelas pada setiap bagian dokumen. Hal ini memudahkan pemeliharaan kode, pembaca layar aksesibilitas, serta pengindeksan SEO."
            },
            {
              question: "Sebutkan empat lapisan Box Model dari dalam ke luar beserta fungsi aturan border-box.",
              hint: "Urutkan dari isi konten hingga jarak antar elemen.",
              answer: "Empat lapisannya adalah Content, Padding, Border, dan Margin. Aturan box-sizing: border-box menjaga total lebar elemen tetap sesuai nilai width karena sudah menyertakan padding dan border."
            },
            {
              question: "Kapan kita sebaiknya memilih Flexbox dan kapan memilih CSS Grid?",
              hint: "Bedakan kebutuhan tata letak satu arah dan dua arah.",
              answer: "Gunakan Flexbox untuk menyusun elemen satu dimensi seperti baris navigasi atau deretan tombol. Gunakan CSS Grid untuk mengatur baris dan kolom sekaligus seperti galeri kartu."
            }
          ],
          references: [
            {
              title: "Tutorial HTML untuk Pemula",
              url: "https://www.petanikode.com/tutorial/html/",
              author: "Ahmad Muhardian (Petani Kode)",
              category: "HTML & CSS",
              lang: "ID",
              type: "Book"
            },
            {
              title: "Tutorial Dasar CSS untuk Pemula",
              url: "https://www.petanikode.com/tutorial/css/",
              author: "Ahmad Muhardian (Petani Kode)",
              category: "HTML & CSS",
              lang: "ID",
              type: "Book"
            },
            {
              title: "Belajar FLEXBOX",
              url: "https://www.youtube.com/playlist?list=PLFIM0718LjIU1lWlM34j6E9fMlrrSGZ1k",
              author: "Sandhika Galih (Web Programming UNPAS)",
              category: "CSS Layout",
              lang: "ID",
              type: "Course"
            },
            {
              title: "CSS Grid Layout Playlist",
              url: "https://www.youtube.com/playlist?list=PLFIM0718LjIXmbwX0dEsoRVX-PC16vmuw",
              author: "Sandhika Galih (Web Programming UNPAS)",
              category: "CSS Layout",
              lang: "ID",
              type: "Course"
            },
            {
              title: "MDN Web Docs || CSS Reference",
              url: "https://developer.mozilla.org/en-US/docs/Web/CSS",
              author: "MDN Contributors",
              category: "HTML & CSS",
              lang: "EN",
              type: "Docs"
            }
          ],
          weeklyAssignment: {
            week: 2,
            title: "Weekly Coding Assignment || Minggu 2",
            description: "Sempurnakan profil InternFlow dengan seksi Hero, Grid kartu proyek, dan formulir kontak yang rapi pada lebar layar 375px."
          }
        }
      },
      {
        slideNumber: 9,
        isSummary: false,
        layoutType: "task",
        badge: "Task Submission",
        title: "Pengumpulan Tugas Pertemuan 02 & Pembukaan P03",
        subtitle: "Unggah kode profil responsif ke GitHub dan isi Learning Log untuk membuka materi JavaScript.",
        contentJson: {
          eyebrow: "Syarat Pembukaan Pertemuan 03",
          highlights: [
            "Mentor memeriksa tag semantik, pemisahan berkas CSS, dan tampilan ponsel."
          ],
          deliverables: [
            "Tautan repositori GitHub berisi index.html dan style.css terpisah.",
            "Penerapan elemen HTML5 semantik secara tepat di seluruh bagian halaman.",
            "Tata letak Flexbox dan Grid yang adaptif di layar ponsel maupun desktop."
          ],
          learningLogFields: STANDARD_LEARNING_LOG_FIELDS$1,
          mentorTip: "Jika halaman ponsel masih bergeser ke samping, periksa elemen yang memakai lebar piksel tetap dan tambahkan max-width: 100% pada gambar."
        }
      }
    ]
  },
  // ============================================================================
  // P03 - TAILWIND CSS: UTILITY-FIRST DAN PERBANDINGAN CSS VANILLA
  // ============================================================================
  {
    orderIndex: 3,
    month: 1,
    slug: "pertemuan-03-tailwind-css-utility-first",
    code: "P03",
    sessionType: "Materi 2",
    title: "Tailwind CSS: Utility-First dan Perbandingan CSS Vanilla",
    subtitle: "Mengenal pendekatan utility-first Tailwind CSS serta perbedaannya dengan CSS vanilla.",
    summaryText: "Pelajari konsep utility-first, bedah sintaks Tailwind CSS, perbandingan langsung dengan CSS vanilla, dan praktik mengubah kartu profil.",
    taskPrompt: "Ubah halaman kartu profil statis menggunakan kelas utilitas Tailwind CSS melalui CDN agar responsif dan rapi.",
    taskDeliverables: [
      "Mengubah komponen kartu profil dari CSS vanilla ke kelas utilitas Tailwind CSS.",
      "Menerapkan layout responsif dengan prefix breakpoint (md:, lg:) dan state (hover:).",
      "Mengunggah hasil praktik ke repositori GitHub beserta Learning Log."
    ],
    iconName: "PaintBrush",
    accentGradient: "from-cyan-500 to-sky-500",
    slides: [
      {
        slideNumber: 1,
        isSummary: true,
        layoutType: "cover",
        badge: "Pertemuan 03 || Materi 2",
        title: "Tailwind CSS: Utility-First dan Perbandingan CSS Vanilla",
        subtitle: "Membangun antarmuka modern lebih cepat tanpa bolak-balik berpindah berkas CSS.",
        contentJson: {
          eyebrow: "Materi 2 || 30% Konsep / 70% Praktik",
          highlights: [
            "Memahami alasan beralih dari CSS vanilla ke utility-first.",
            "Membaca dan menulis kelas utilitas Tailwind secara percaya diri.",
            "Membandingkan efisiensi kode CSS vanilla vs Tailwind CSS."
          ],
          stats: [
            { label: "Fokus Materi", value: "Utility-First CSS" },
            { label: "Porsi Praktik", value: "70% Hands-On" },
            { label: "Target", value: "Kartu Profil Tailwind" }
          ]
        }
      },
      {
        slideNumber: 2,
        isSummary: true,
        layoutType: "summary",
        badge: "Ringkasan Materi",
        title: "Ringkasan: Mengapa Beralih ke Tailwind CSS?",
        subtitle: "Mengatasi masalah klasik CSS vanilla seperti penamaan kelas dan konflik cascade.",
        contentJson: {
          eyebrow: "Ringkasan",
          highlights: [
            "Pada CSS vanilla, semakin besar proyek, semakin sulit menjaga konsistensi jarak, warna, dan nama kelas."
          ],
          bentoCards: [
            {
              title: "Bebas Bingung Menamai Kelas",
              description: "Tidak perlu lagi memikirkan nama seperti .card-wrapper-inner-box atau .btn-primary-alt."
            },
            {
              title: "Tidak Ada Efek Samping Global",
              description: "Mengubah kelas di satu elemen HTML tidak akan merusak tampilan halaman lain."
            },
            {
              title: "Desain Konsisten Secara Bawaan",
              description: "Skala spasi, ukuran teks, dan palet warna sudah terstruktur rapi sejak awal."
            }
          ],
          mentorTip: "Tailwind CSS bukan pengganti pemahaman CSS, melainkan cara menulis CSS yang lebih cepat dan terprediksi."
        }
      },
      {
        slideNumber: 3,
        isSummary: true,
        layoutType: "bento",
        badge: "Peta Konsep",
        title: "Peta Konsep Pertemuan 03",
        subtitle: "Alur belajar dari teori utility-first hingga praktik mengubah kartu profil.",
        contentJson: {
          eyebrow: "Peta Konsep",
          highlights: [
            "Empat langkah utama untuk menguasai dasar Tailwind CSS dalam satu sesi."
          ],
          bentoCards: [
            {
              title: "1. Utility-First vs Cascade",
              description: "Memahami perbedaan mendasar antara kelas utilitas tunggal dan aturan CSS tradisional."
            },
            {
              title: "2. Bedah Sintaks Utilitas",
              description: "Membaca pola warna, spasi, flexbox, state hover, dan breakpoint responsif."
            },
            {
              title: "3. Perbandingan Kode Nyata",
              description: "Melihat langsung perbandingan CSS vanilla dengan Tailwind CSS pada komponen yang sama."
            },
            {
              title: "4. Praktik Kartu Profil",
              description: "Mengonversi kartu profil HTML/CSS menjadi komponen Tailwind CSS yang responsif."
            }
          ]
        }
      },
      {
        slideNumber: 4,
        isSummary: false,
        layoutType: "bento",
        badge: "Konsep Inti",
        title: "Konsep Utility-First vs Cascade CSS Vanilla",
        subtitle: "Satu kelas mewakili satu properti gaya yang jelas dan langsung terlihat di HTML.",
        contentJson: {
          eyebrow: "Konsep Inti",
          highlights: [
            "CSS vanilla mengandalkan cascade dan selektor terpisah, sedangkan utility-first menyusun tampilan langsung dari blok-blok kecil di HTML."
          ],
          bentoCards: [
            {
              title: "CSS Vanilla (Semantic Class)",
              description: "Menulis struktur di HTML, lalu berpindah ke berkas .css untuk mendefinisikan setiap properti."
            },
            {
              title: "Tailwind CSS (Utility-First)",
              description: "Menggabungkan kelas kecil seperti p-4, rounded-lg, dan bg-white langsung pada elemen."
            },
            {
              title: "Kapan Tetap Pakai CSS Vanilla?",
              description: "Animasi kompleks dengan @keyframes atau aturan khusus tetap dapat ditulis di CSS biasa."
            }
          ]
        }
      },
      {
        slideNumber: 5,
        isSummary: false,
        layoutType: "bento",
        badge: "Bedah Sintaks",
        title: "Bedah Sintaks Kelas Utilitas Tailwind CSS",
        subtitle: "Pola penamaan yang konsisten membuat kelas Tailwind mudah ditebak tanpa menghafal semua.",
        contentJson: {
          eyebrow: "Bedah Sintaks",
          highlights: [
            "Kenali lima pola kelas yang paling sering dipakai saat membangun komponen antarmuka."
          ],
          bentoCards: [
            {
              title: "bg-red-500 & hover:bg-red-700",
              description: "Memberikan warna latar merah 500, lalu berubah menjadi merah 700 saat kursor diarahkan."
            },
            {
              title: "p-4",
              description: "Menambahkan padding 1rem (16px) di keempat sisi elemen."
            },
            {
              title: "flex gap-3",
              description: "Mengaktifkan Flexbox dengan jarak antar item sebesar 0.75rem (12px)."
            },
            {
              title: "md:grid-cols-2",
              description: "Mengatur tata letak menjadi 2 kolom mulai ukuran layar medium (768px ke atas)."
            }
          ]
        }
      },
      {
        slideNumber: 6,
        isSummary: false,
        layoutType: "comparison",
        badge: "Perbandingan Kode",
        title: "Perbandingan: CSS Vanilla vs Tailwind CSS",
        subtitle: "Komponen tombol yang sama, ditulis dengan dua pendekatan berbeda.",
        contentJson: {
          eyebrow: "Perbandingan Kode",
          highlights: [
            "Tailwind memangkas kebutuhan menulis dan merawat berkas CSS terpisah untuk komponen standar."
          ],
          comparison: {
            badTitle: "CSS Vanilla (HTML + CSS terpisah)",
            badPoints: [
              "Harus memikirkan nama kelas semantik dan berpindah antar berkas.",
              "Berisiko menimbulkan konflik cascade atau gaya yang tidak terduga."
            ],
            badCode: {
              language: "css",
              filename: "style.css & index.html",
              snippet: `.btn-danger {
  background-color: #ef4444;
  color: #ffffff;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
}
.btn-danger:hover {
  background-color: #b91c1c;
}

<!-- Di HTML -->
<button class="btn-danger">Hapus</button>`
            },
            goodTitle: "Tailwind CSS (Langsung di HTML)",
            goodPoints: [
              "Gaya langsung terlihat pada elemen HTML tanpa membuat berkas CSS baru.",
              "Skala warna, spasi, dan state hover konsisten secara bawaan."
            ],
            goodCode: {
              language: "html",
              filename: "index.html",
              snippet: `<button class="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-lg">
  Hapus
</button>`
            }
          }
        }
      },
      {
        slideNumber: 7,
        isSummary: false,
        layoutType: "practice",
        badge: "Praktik 70%",
        title: "Praktik 70%: Mengubah Kartu Profil ke Tailwind CSS",
        subtitle: "Terapkan langsung pada proyek profil dengan Play CDN Tailwind.",
        contentJson: {
          eyebrow: "Lab Pertemuan 03 || Kartu Profil Tailwind",
          highlights: [
            "Gunakan Play CDN Tailwind untuk mengubah kartu profil HTML/CSS menjadi komponen responsif."
          ],
          practiceSteps: [
            {
              step: 1,
              title: "Pasang Tailwind Play CDN",
              description: "Tambahkan skrip CDN Tailwind di dalam tag <head> pada berkas index.html.",
              code: `<script src="https://cdn.tailwindcss.com"><\/script>`
            },
            {
              step: 2,
              title: "Susun Kartu Profil dengan Utilitas",
              description: "Gunakan kelas flex, gap-4, p-6, rounded-xl, shadow-md, dan responsif md:flex-row.",
              code: `<article class="max-w-md mx-auto bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row items-center gap-4">
  <img class="w-20 h-20 rounded-full object-cover" src="avatar.jpg" alt="Foto Profil" />
  <div>
    <h2 class="text-lg font-bold text-slate-900">Nama Peserta</h2>
    <p class="text-sm text-slate-600">Full-Stack Intern</p>
  </div>
</article>`
            },
            {
              step: 3,
              title: "Simpan dan Dorong ke GitHub",
              description: "Commit perubahan kartu profil Tailwind CSS ke repositori.",
              code: 'git add . && git commit -m "feat: ubah kartu profil menggunakan tailwind css" && git push'
            }
          ]
        }
      },
      {
        slideNumber: 8,
        isSummary: false,
        layoutType: "quiz",
        badge: "Kuis & Referensi",
        title: "Kuis Pemahaman & Referensi Belajar",
        subtitle: "Uji pemahaman sintaks utility-first dan pelajari dokumentasi resmi.",
        contentJson: {
          eyebrow: "Evaluasi Singkat",
          highlights: [
            "Jawab dua pertanyaan singkat dan simpan referensi resmi Tailwind CSS."
          ],
          quizItems: [
            {
              question: "Apa fungsi prefix md: pada kelas seperti md:grid-cols-2 di Tailwind CSS?",
              answer: "Menerapkan kelas utilitas tersebut hanya pada ukuran layar medium (768px) ke atas.",
              hint: "Berkaitan dengan ukuran layar minimum 768px."
            },
            {
              question: "Mengapa Tailwind CSS membantu mengurangi konflik gaya antar halaman?",
              answer: "Karena setiap kelas utilitas hanya mengatur satu properti langsung pada elemen HTML terkait, tanpa mengubah aturan CSS global.",
              hint: "Ingat sifat kelas utilitas yang hanya berlaku pada elemen tempat kelas itu dipasang."
            }
          ],
          references: [
            {
              title: "Learn Tailwind CSS (dwyl/learn-tailwind)",
              url: "https://github.com/dwyl/learn-tailwind",
              category: "Tailwind CSS",
              lang: "EN",
              type: "Docs"
            },
            {
              title: "Tailwind CSS Official Documentation",
              url: "https://tailwindcss.com/docs",
              category: "Tailwind CSS",
              lang: "EN",
              type: "Docs"
            }
          ]
        }
      },
      {
        slideNumber: 9,
        isSummary: false,
        layoutType: "task",
        badge: "Penugasan Mingguan",
        title: "Tugas Pertemuan 03 & Learning Log",
        subtitle: "Selesaikan konversi kartu profil dan catat proses belajar di Learning Log.",
        contentJson: {
          eyebrow: "Penugasan Mingguan",
          highlights: [
            "Ubah kartu profil dan bagian daftar keahlian menggunakan kelas utilitas Tailwind CSS."
          ],
          weeklyAssignment: {
            week: 3,
            title: "Weekly Coding Assignment || Tailwind CSS",
            description: "Ubah kartu profil dan bagian daftar keahlian pada halaman profil agar sepenuhnya memakai kelas utilitas Tailwind CSS yang responsif."
          },
          deliverables: [
            "Tautan repositori GitHub berisi index.html dengan kelas utilitas Tailwind CSS.",
            "Tampilan kartu profil yang rapi di layar ponsel maupun desktop.",
            "Catatan Learning Log yang lengkap."
          ],
          learningLogFields: STANDARD_LEARNING_LOG_FIELDS$1,
          mentorTip: "Biasakan membaca kelas Tailwind dari luar ke dalam: tata letak (flex/grid), jarak (p-/m-/gap-), warna, lalu responsif."
        }
      }
    ]
  },
  // ============================================================================
  // P04 - JAVASCRIPT VANILLA, ARRAY METHODS, DOM & ASYNC FETCH
  // ============================================================================
  {
    orderIndex: 4,
    month: 1,
    slug: "pertemuan-04-javascript-vanilla-dom",
    code: "P06",
    sessionType: "Materi 2",
    title: "JavaScript Vanilla, Array Methods, DOM & Async Fetch",
    subtitle: "Hidupkan halaman statis memakai logika JavaScript ES6+, olahan array, manipulasi DOM, dan async fetch.",
    summaryText: "Pelajari variabel modern, fungsi, metode array, manipulasi DOM, event listener, serta async fetch.",
    taskPrompt: "Tambahkan berkas script.js pada InternFlow untuk menerapkan penyaringan data array, interaksi tombol, dan validasi formulir kontak.",
    taskDeliverables: [
      "Berkas script.js terpisah terhubung memakai atribut defer pada HTML.",
      "Penerapan struktur array of objects beserta metode map, filter, atau find.",
      "Interaksi pengguna berjalan lewat addEventListener tanpa galat di konsol."
    ],
    accentGradient: "from-amber-500 to-yellow-500",
    iconName: "Code",
    slides: [
      {
        slideNumber: 1,
        isSummary: true,
        layoutType: "cover",
        badge: "Bulan 1 • Pertemuan 03",
        title: "JavaScript Vanilla, Array Methods, DOM & Async Fetch",
        subtitle: "Ubah halaman statis menjadi antarmuka dinamis yang mengolah data dan merespons aksi pengguna.",
        contentJson: {
          eyebrow: "Materi 2 • 30% Konsep / 70% Praktik Interaksi DOM",
          highlights: [
            "Kuasai dasar ES6+ meliputi const, let, perbandingan ketat, dan fungsi.",
            "Olahan daftar objek menjadi lebih ringkas menggunakan map, filter, dan find.",
            "Manipulasi elemen halaman secara langsung melalui DOM dan addEventListener.",
            "Kenali JSON, fetch, dan async/await sebagai fondasi komunikasi API."
          ],
          stats: [
            { label: "Jenis Sesi", value: "Materi 2" },
            { label: "Bahasa", value: "JavaScript ES6+" },
            { label: "Target Output", value: "Profil Interaktif" },
            { label: "Tugas Mingguan", value: "Minggu 3" }
          ]
        }
      },
      {
        slideNumber: 2,
        isSummary: true,
        layoutType: "summary",
        badge: "Executive Summary",
        title: "Mengapa JavaScript Murni Wajib Kuat Sebelum Framework?",
        subtitle: "Kerangka kerja seperti Vue dan Nuxt berdiri sepenuhnya di atas konsep dasar JavaScript.",
        contentJson: {
          eyebrow: "Jembatan Menuju TaskFlow & REST API",
          highlights: [
            "Daftar tugas modern mengolah array objek langsung ke dalam DOM.",
            "Metode map, filter, dan find dipakai rutin di ekosistem Vue.",
            "Pemahaman JSON dan async/await mempermudah integrasi API Express di Bulan 2."
          ],
          bentoCards: [
            {
              title: "Pengelola Data (JS Core)",
              tag: "Logika",
              description: "Menyimpan serta memproses status aplikasi menggunakan variabel, fungsi, array, dan objek."
            },
            {
              title: "Pengendali Tampilan (DOM)",
              tag: "Interaksi",
              description: "Menghubungkan aksi klik atau pengiriman formulir ke pembaruan layar seketika."
            }
          ]
        }
      },
      {
        slideNumber: 3,
        isSummary: true,
        layoutType: "bento",
        badge: "Peta Konsep & Agenda",
        title: "Agenda Sesi: Dasar Bahasa, Metode Array, DOM & Async",
        subtitle: "Empat tahapan materi inti yang langsung diterapkan pada proyek InternFlow.",
        contentJson: {
          eyebrow: "Alokasi Waktu 30% Konsep / 70% Praktik",
          highlights: [
            "Manfaatkan tab Console di DevTools untuk menguji ekspresi kode secara cepat."
          ],
          bentoCards: [
            {
              title: "1. Variabel & Percabangan",
              tag: "25 Menit",
              description: "Deklarasi const dan let, tipe data dasar, operator ===, serta kondisional."
            },
            {
              title: "2. Fungsi, Array & Objek",
              tag: "35 Menit",
              description: "Pembuatan fungsi modular serta transformasi data dengan map, filter, dan find."
            },
            {
              title: "3. DOM & Event Listener",
              tag: "45 Menit",
              description: "Seleksi elemen querySelector, pembaruan textContent, classList, dan penanganan klik."
            },
            {
              title: "4. JSON & Async Fetch",
              tag: "35 Menit",
              description: "Struktur pertukaran JSON, mekanisme Promise, serta pengambilan data async/await."
            }
          ]
        }
      },
      {
        slideNumber: 4,
        isSummary: false,
        layoutType: "bento",
        badge: "Analogi & Konsep",
        title: "Model Mental JavaScript: Variabel, Olahan Array & Async",
        subtitle: "Pahami cara peramban merepresentasikan halaman sebagai pohon objek yang siap dimanipulasi.",
        contentJson: {
          eyebrow: "Konsep Inti JavaScript Peramban",
          highlights: [
            "DOM memetakan HTML menjadi pohon objek yang dikendalikan lewat JavaScript.",
            "Fungsi addEventListener memantau peristiwa pada elemen dan menjalankan kode saat dipicu."
          ],
          bentoCards: [
            {
              title: "Aturan const vs let",
              tag: "Variabel",
              description: "Gunakan const sebagai pilihan baku dan pakai let hanya saat nilai berubah."
            },
            {
              title: "Tiga Metode Array Utama",
              tag: "Transformasi Data",
              description: "Proses koleksi data secara bersih tanpa merusak susunan array aslinya.",
              bullets: [
                "map: mengubah bentuk setiap item",
                "filter: menyaring item sesuai syarat",
                "find: mengambil satu item pertama"
              ]
            },
            {
              title: "Promise & Async/Await",
              tag: "Asinkron",
              description: "Menunggu respons data jaringan secara terstruktur tanpa membekukan antarmuka pengguna."
            }
          ]
        }
      },
      {
        slideNumber: 5,
        isSummary: false,
        layoutType: "bento",
        badge: "Bedah Teknis & Sintaks",
        title: "Pola Penyaringan Array ke DOM & Pemanggilan Fetch",
        subtitle: "Pelajari pola kode ES6+ bersih untuk merender daftar data dan menangani permintaan jaringan.",
        contentJson: {
          eyebrow: "Cuplikan Kode ES6+",
          highlights: [
            "Gunakan operator === agar nilai sekaligus tipe datanya diperiksa secara akurat.",
            "Bungkus pemanggilan async fetch dengan blok try/catch untuk menangani kegagalan jaringan."
          ],
          codeBlocks: [
            {
              title: "Filter Array Objek & Render DOM",
              language: "javascript",
              filename: "dom-array.js",
              snippet: `const skills = [
  { id: 1, name: 'HTML5 Semantik', category: 'frontend' },
  { id: 2, name: 'Git & GitHub', category: 'tooling' },
];
const listEl = document.querySelector('#skill-list');

function renderSkills(items) {
  listEl.innerHTML = items.map((s) => \`<li>\${s.name}</li>\`).join('');
}
document.querySelector('#btn-fe').addEventListener('click', () => {
  renderSkills(skills.filter((s) => s.category === 'frontend'));
});`
            },
            {
              title: "Pengambilan Data JSON dengan Async/Await",
              language: "javascript",
              filename: "async-fetch.js",
              snippet: `async function loadSampleTask() {
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/todos/1');
    if (!res.ok) throw new Error(\`Gagal memuat: \${res.status}\`);
    const data = await res.json();
    console.log('Contoh tugas:', data.title);
  } catch (err) {
    console.error('Kendala jaringan:', err.message);
  }
}`
            }
          ]
        }
      },
      {
        slideNumber: 6,
        isSummary: false,
        layoutType: "comparison",
        badge: "Bad vs Good Practice",
        title: "Atribut onclick & var vs addEventListener & const",
        subtitle: "Jaga kode tetap aman dan terpisah dari markup HTML menggunakan standar ES6+.",
        contentJson: {
          eyebrow: "Perbandingan Kualitas Skrip",
          highlights: [
            "Pemisahan skrip dengan addEventListener memudahkan pelacakan alur program di DevTools."
          ],
          comparison: {
            badTitle: "✕ Rawan Bug (Global var & Inline JS)",
            badPoints: [
              "Memakai kata kunci var yang rawan tertimpa lintas cakupan blok.",
              "Mencampur pemanggilan fungsi onclick langsung di dalam atribut HTML.",
              "Memakai perbandingan longgar == dan menyisipkan input mentah ke innerHTML."
            ],
            badCode: {
              title: "Skrip Rentan Masalah Tipe & XSS",
              language: "javascript",
              filename: "bad-script.js",
              snippet: `var total = '1';
function hitung() {
  if (total == 1) {
    document.getElementById('info').innerHTML = 'Nilai: ' + total;
  }
}`
            },
            goodTitle: "✓ Standar Modern & Aman",
            goodPoints: [
              "Mendeklarasikan referensi tetap dengan const dan variabel dinamis dengan let.",
              "Mendaftarkan seluruh interaksi dari berkas JS memakai addEventListener.",
              "Memakai operator ketat === serta properti textContent untuk teks aman."
            ],
            goodCode: {
              title: "Skrip Terstruktur & Aman",
              language: "javascript",
              filename: "good-script.js",
              snippet: `const total = 1;
const btn = document.querySelector('#btn-tambah');
const infoEl = document.querySelector('#info');

btn.addEventListener('click', () => {
  if (total === 1) infoEl.textContent = \`Nilai valid: \${total}\`;
});`
            }
          }
        }
      },
      {
        slideNumber: 7,
        isSummary: false,
        layoutType: "practice",
        badge: "70% Hands-On Praktik",
        title: "Langkah Praktik: Menambahkan Interaksi DOM pada InternFlow",
        subtitle: "Pasang fitur penyaringan keahlian, pengubah tema, dan validasi formulir secara bertahap.",
        contentJson: {
          eyebrow: "Lab Pertemuan 03 || Profil Interaktif",
          highlights: [
            "Pasang atribut defer agar skrip berjalan sesudah struktur HTML siap."
          ],
          practiceSteps: [
            {
              step: 1,
              title: "Hubungkan Berkas script.js dengan Atribut defer",
              description: "Buat berkas script.js di folder proyek lalu tautkan pada bagian head dokumen HTML.",
              code: `<script src="script.js" defer><\/script>`
            },
            {
              step: 2,
              title: "Render & Saring Daftar Keahlian dari Array Objek",
              description: "Simpan daftar keahlian atau proyek dalam array lalu buat tombol filter kategori."
            },
            {
              step: 3,
              title: "Tambahkan Tombol Tema & Validasi Formulir Kontak",
              description: "Gunakan classList.toggle untuk tema gelap dan cegah pengiriman input kosong dengan preventDefault.",
              code: `form.addEventListener('submit', (event) => {
  event.preventDefault();
  const nama = namaInput.value.trim();
  if (!nama) {
    statusEl.textContent = 'Nama wajib diisi terlebih dahulu.';
    return;
  }
  statusEl.textContent = \`Terima kasih, \${nama}. Pesan tercatat.\`;
});`
            },
            {
              step: 4,
              title: "Verifikasi Konsol Bersih & Unggah ke GitHub",
              description: "Uji seluruh tombol di peramban, pastikan konsol bebas galat merah, lalu push commit.",
              command: 'git add . && git commit -m "feat: tambah filter array dan validasi form di dom" && git push'
            }
          ]
        }
      },
      {
        slideNumber: 8,
        isSummary: false,
        layoutType: "quiz",
        badge: "Kuis & Pustaka Belajar",
        title: "Uji Pemahaman JavaScript & Referensi Belajar",
        subtitle: "Uji penguasaan variabel, metode array, penanganan formulir, dan komunikasi asinkron.",
        contentJson: {
          eyebrow: "Evaluasi Konsep & Referensi Terkurasi",
          highlights: [
            "Biasakan menelusuri nilai kembalian setiap ekspresi kode sebelum menjalankannya."
          ],
          quizItems: [
            {
              question: "Kapan kita menggunakan const dan kapan menggunakan let?",
              hint: "Perhatikan apakah referensi variabelnya diisi ulang.",
              answer: "Gunakan const secara baku ketika referensi variabel tidak akan diganti ulang. Gunakan let hanya apabila nilainya memang diperbarui selama program berjalan."
            },
            {
              question: "Apa perbedaan nilai kembalian antara metode .filter() dan .find()?",
              hint: "Bandingkan daftar hasil saringan dengan pencarian tunggal.",
              answer: "Metode .filter() selalu mengembalikan array baru berisi seluruh elemen yang cocok. Metode .find() hanya mengembalikan satu elemen pertama yang memenuhi syarat atau undefined."
            },
            {
              question: "Mengapa kita memanggil event.preventDefault() saat menangani submit formulir?",
              hint: "Ingat perilaku bawaan peramban ketika tombol kirim ditekan.",
              answer: "Secara bawaan, pengiriman formulir akan memuat ulang halaman peramban. Pemanggilan preventDefault() menahan muat ulang tersebut agar validasi dapat diproses oleh JavaScript."
            },
            {
              question: "Bagaimana JSON, fetch(), dan async/await saling bekerja sama?",
              hint: "Hubungkan pengiriman permintaan jaringan, waktu tunggu, dan penguraian data.",
              answer: "Fungsi fetch() meminta data dari server dan mengembalikan Promise yang ditunggu secara rapi memakai async/await. Selanjutnya, response.json() mengurai teks JSON menjadi objek JavaScript."
            }
          ],
          references: [
            {
              title: "Tutorial JavaScript Modern (Bahasa Indonesia)",
              url: "https://id.javascript.info",
              author: "Ilya Kantor & Kontributor ID",
              category: "JavaScript",
              lang: "ID",
              type: "Book"
            },
            {
              title: "Learn JavaScript (Bahasa Indonesia)",
              url: "https://javascript.sumankunwar.com.np/id",
              author: "Suman Kumar & GitHub Contributors",
              category: "JavaScript",
              lang: "ID",
              type: "Book"
            },
            {
              title: "JavaScript dan DOM (Document Object Model)",
              url: "https://www.youtube.com/playlist?list=PLFIM0718LjIWB3YRoQbQh82ZewAGtE2-3",
              author: "Sandhika Galih (Web Programming UNPAS)",
              category: "JavaScript DOM",
              lang: "ID",
              type: "Course"
            },
            {
              title: "Belajar JavaScript Async",
              url: "https://www.youtube.com/playlist?list=PL-CtdCApEFH-I4CD6km3BcXqrhWAkY4et",
              author: "Eko Kurniawan Khannedy (Programmer Zaman Now)",
              category: "Async JavaScript",
              lang: "ID",
              type: "Course"
            },
            {
              title: "MDN || Introduction to the DOM",
              url: "https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction",
              author: "MDN Contributors",
              category: "Web APIs",
              lang: "EN",
              type: "Docs"
            }
          ],
          weeklyAssignment: {
            week: 3,
            title: "Weekly Coding Assignment || Minggu 3",
            description: "Buat skrip yang mengolah minimal lima data objek memakai map, filter, dan find lalu menampilkannya ke halaman HTML."
          }
        }
      },
      {
        slideNumber: 9,
        isSummary: false,
        layoutType: "task",
        badge: "Task Submission",
        title: "Pengumpulan Tugas Pertemuan 03 & Pembukaan P04",
        subtitle: "Kirim repositori InternFlow interaktif beserta Learning Log untuk lanjut membangun TaskFlow.",
        contentJson: {
          eyebrow: "Syarat Pembukaan Pertemuan 04",
          highlights: [
            "Pastikan seluruh logika JavaScript diketik mandiri dan siap dijelaskan cara kerjanya."
          ],
          deliverables: [
            "Repositori GitHub memuat berkas index.html, style.css, dan script.js terpisah.",
            "Fitur interaktif berjalan melalui addEventListener dan metode olahan array.",
            "Konsol peramban bersih tanpa pesan galat saat halaman diuji."
          ],
          learningLogFields: STANDARD_LEARNING_LOG_FIELDS$1,
          mentorTip: "Jika muncul galat pembacaan properti bernilai null, periksa kecocokan nama selektor di HTML dan pastikan tag script memakai atribut defer."
        }
      }
    ]
  },
  // ============================================================================
  // P04 || PRAKTIK BULAN 1: TASKFLOW & INTERNFLOW STATIS
  // ============================================================================
  {
    orderIndex: 4,
    month: 1,
    slug: "pertemuan-04-praktik-taskflow-todolist",
    code: "P06",
    sessionType: "Praktik",
    title: "Praktik Bulan 1: TaskFlow & InternFlow Statis",
    subtitle: "Padukan HTML5, CSS3, dan JavaScript murni untuk membangun aplikasi TaskFlow berbasis localStorage.",
    summaryText: "Bangun fitur tambah, tampil, tandai selesai, hapus, validasi input, dan penyimpanan localStorage.",
    taskPrompt: "Bangun aplikasi manajemen tugas TaskFlow dengan penyimpanan localStorage, desain responsif, dan dokumentasi README yang rapi di GitHub.",
    taskDeliverables: [
      "Fitur tambah, lihat daftar, tandai selesai, dan hapus tugas berjalan lancar.",
      "Validasi mencegah penyimpanan tugas kosong atau berisi spasi saja.",
      "Data tersimpan di localStorage sehingga tetap utuh saat peramban di-refresh.",
      "Berkas HTML, CSS, JS terpisah rapi serta dilengkapi README.md di GitHub."
    ],
    accentGradient: "from-emerald-500 to-teal-500",
    iconName: "CheckSquareOffset",
    slides: [
      {
        slideNumber: 1,
        isSummary: true,
        layoutType: "cover",
        badge: "Bulan 1 • Pertemuan 04",
        title: "Praktik Bulan 1: TaskFlow & InternFlow Statis",
        subtitle: "Satukan seluruh materi Bulan 1 ke dalam aplikasi manajemen tugas yang utuh dan persisten.",
        contentJson: {
          eyebrow: "Sesi Praktik & Klinik Proyek • Fokus Eksekusi",
          highlights: [
            "Bangun alur CRUD lokal meliputi tambah, tampil, tandai selesai, dan hapus.",
            "Simpan daftar tugas secara permanen di peramban menggunakan localStorage.",
            "Pertahankan arsitektur berkas terpisah antara HTML semantik, CSS, dan JS.",
            "Dokumentasikan fitur serta langkah penggunaan di dalam berkas README.md."
          ],
          stats: [
            { label: "Jenis Sesi", value: "Praktik" },
            { label: "Proyek Utama", value: "TaskFlow" },
            { label: "Penyimpanan", value: "localStorage" },
            { label: "Tugas Mingguan", value: "Minggu 4" }
          ]
        }
      },
      {
        slideNumber: 2,
        isSummary: true,
        layoutType: "summary",
        badge: "Executive Summary",
        title: "TaskFlow: Pola Dasar Sebelum Terhubung ke Basis Data",
        subtitle: "Alur pengelolaan state lokal hari ini mencerminkan pola aplikasi fullstack di bulan berikutnya.",
        contentJson: {
          eyebrow: "Alur State → Storage → Render",
          highlights: [
            "Array objek di JavaScript berperan sebagai sumber kebenaran tunggal data aplikasi.",
            "Pada Bulan 2, localStorage digantikan oleh panggilan REST API MySQL.",
            "Halaman InternFlow turut dirapikan sebagai pendamping portofolio evaluasi Bulan 1."
          ],
          bentoCards: [
            {
              title: "Tujuh Fitur Wajib TaskFlow",
              tag: "Target Produk",
              description: "Tambah, tampilkan, selesai, hapus, validasi kosong, tata letak responsif, dan localStorage."
            },
            {
              title: "Standar Kualitas Kode",
              tag: "Peninjauan",
              description: "Penamaan fungsi camelCase yang jelas, berkas terpisah, dan riwayat commit bertahap."
            }
          ]
        }
      },
      {
        slideNumber: 3,
        isSummary: true,
        layoutType: "bento",
        badge: "Peta Konsep & Agenda",
        title: "Tahapan Pengerjaan: Dari Antarmuka Hingga localStorage",
        subtitle: "Bagi pengerjaan ke dalam empat tahap kecil agar setiap fitur mudah diuji.",
        contentJson: {
          eyebrow: "Rencana Eksekusi Praktik",
          highlights: [
            "Selesaikan dan rekam commit satu fitur sebelum lanjut fitur berikutnya."
          ],
          bentoCards: [
            {
              title: "1. Struktur & Desain UI",
              tag: "25 Menit",
              description: "Pembuatan formulir tugas, pesan validasi, penghitung ringkas, dan daftar ul."
            },
            {
              title: "2. State & Fungsi Render",
              tag: "30 Menit",
              description: "Penyusunan fungsi renderTasks untuk menggambar ulang daftar dari array data."
            },
            {
              title: "3. Tambah, Selesai & Hapus",
              tag: "45 Menit",
              description: "Penerapan validasi trim, pembalikan status selesai, dan penghapusan berdasar ID."
            },
            {
              title: "4. Persistensi & Dokumentasi",
              tag: "40 Menit",
              description: "Penyimpanan JSON di localStorage serta penulisan dokumentasi README.md."
            }
          ]
        }
      },
      {
        slideNumber: 4,
        isSummary: false,
        layoutType: "bento",
        badge: "Analogi & Konsep",
        title: "Sumber Data Tunggal & Mekanisme localStorage",
        subtitle: "Perbarui array data terlebih dahulu, simpan ke localStorage, lalu gambar ulang tampilan.",
        contentJson: {
          eyebrow: "Arsitektur Data TaskFlow",
          highlights: [
            "Karena localStorage hanya menyimpan teks, ubah array memakai JSON.stringify dan JSON.parse.",
            "Urutan State, Save, dan Render menjaga tampilan sinkron dengan data."
          ],
          bentoCards: [
            {
              title: "Model Objek Tugas",
              tag: "Struktur Data",
              description: "Setiap item tugas direpresentasikan secara konsisten menggunakan tiga properti utama.",
              bullets: [
                "id: penanda unik setiap tugas",
                "title: teks tugas hasil trim",
                "completed: status boolean selesai"
              ]
            },
            {
              title: "Siklus Tiga Langkah CRUD",
              tag: "Alur Kerja",
              description: "Jalankan urutan baku ini setiap kali pengguna memicu perubahan tugas.",
              bullets: [
                "1. Perbarui isi array tasks",
                "2. Simpan JSON ke localStorage",
                "3. Panggil fungsi renderTasks()"
              ]
            }
          ]
        }
      },
      {
        slideNumber: 5,
        isSummary: false,
        layoutType: "bento",
        badge: "Bedah Teknis & Sintaks",
        title: "Kode Inti Penyimpanan Lokal & Render Aman ke DOM",
        subtitle: "Gunakan pola fungsi modular ini untuk menjaga kode aplikasi tetap bersih dan aman.",
        contentJson: {
          eyebrow: "Implementasi Inti TaskFlow",
          highlights: [
            "Sediakan nilai cadangan array kosong saat penyimpanan awal masih bernilai null.",
            "Gunakan atribut data-id dan data-action untuk mengenali tombol yang diklik."
          ],
          codeBlocks: [
            {
              title: "Muat, Simpan & Validasi Tambah Tugas",
              language: "javascript",
              filename: "app.js",
              snippet: `const STORAGE_KEY = 'taskflow_tasks_v1';
let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}
function addTask(rawTitle) {
  const title = rawTitle.trim();
  if (!title) return false;
  tasks.unshift({ id: Date.now(), title, completed: false });
  saveTasks();
  return true;
}`
            },
            {
              title: "Ubah Status, Hapus & Render Daftar",
              language: "javascript",
              filename: "render.js",
              snippet: `function toggleTask(id) {
  tasks = tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
  saveTasks();
}
function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  saveTasks();
}
function renderTasks(listEl) {
  listEl.replaceChildren(...tasks.map((t) => createTaskElement(t)));
}`
            }
          ]
        }
      },
      {
        slideNumber: 6,
        isSummary: false,
        layoutType: "comparison",
        badge: "Bad vs Good Practice",
        title: "Manipulasi DOM Langsung vs Pengelolaan State Terstruktur",
        subtitle: "Kelola daftar tugas berbasis data agar mudah disaring dan dihubungkan ke API.",
        contentJson: {
          eyebrow: "Standar Arsitektur Aplikasi",
          highlights: [
            "Data berbentuk array objek memudahkan penambahan penghitung tugas dan filter status."
          ],
          comparison: {
            badTitle: "✕ Manipulasi Tanpa State & Validasi",
            badPoints: [
              "Menempelkan string li langsung ke innerHTML tanpa menyimpan array data.",
              "Membiarkan spasi kosong lolos karena tidak memanggil metode .trim().",
              "Menyimpan array ke localStorage tanpa konversi JSON.stringify terlebih dahulu."
            ],
            badCode: {
              title: "Penyimpanan Rusak & Rawan Bug",
              language: "javascript",
              filename: "bad-todo.js",
              snippet: `// Menyimpan "[object Object]" di peramban
localStorage.setItem('tasks', tasks);

if (input.value !== '') {
  list.innerHTML += '<li>' + input.value + '</li>';
}`
            },
            goodTitle: "✓ Berbasis State, Trim & JSON",
            goodPoints: [
              "Membersihkan spasi input dengan .trim() lalu menampilkan pesan validasi jelas.",
              "Mengonversi data memakai JSON.stringify saat simpan dan JSON.parse saat muat.",
              "Merender teks tugas memakai textContent agar aman dari injeksi kode."
            ],
            goodCode: {
              title: "Validasi & Persistensi Bersih",
              language: "javascript",
              filename: "good-todo.js",
              snippet: `const cleanTitle = taskInput.value.trim();
if (!cleanTitle) {
  errorMsg.textContent = 'Nama tugas tidak boleh kosong.';
  return;
}
tasks.unshift({ id: Date.now(), title: cleanTitle, completed: false });
localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
renderTasks(listEl);`
            }
          }
        }
      },
      {
        slideNumber: 7,
        isSummary: false,
        layoutType: "practice",
        badge: "70% Hands-On Praktik",
        title: "Langkah Praktik: Membangun TaskFlow Hingga Siap Demo",
        subtitle: "Selesaikan empat langkah terstruktur ini dengan minimal tiga riwayat commit terpisah.",
        contentJson: {
          eyebrow: "Lab Pertemuan 04 || TaskFlow",
          highlights: [
            "Muat ulang halaman guna memastikan data pulih utuh dari localStorage."
          ],
          practiceSteps: [
            {
              step: 1,
              title: "Siapkan Berkas Proyek & Kerangka Semantik",
              description: "Buat folder taskflow berisi index.html, style.css, app.js, dan README.md dengan formulir tugas.",
              command: "mkdir taskflow && cd taskflow && touch index.html style.css app.js README.md"
            },
            {
              step: 2,
              title: "Tata Antarmuka Kartu Tugas yang Responsif",
              description: "Atur tampilan kartu terpusat, pembeda visual tugas selesai, dan tombol aksi yang rapi di ponsel."
            },
            {
              step: 3,
              title: "Pasang Event Delegation & Persistensi localStorage",
              description: "Tangani aksi selesai dan hapus pada elemen ul induk lalu simpan setiap perubahan ke localStorage.",
              code: `taskListEl.addEventListener('click', (event) => {
  const btn = event.target.closest('button[data-action]');
  if (!btn) return;
  const id = Number(btn.dataset.id);
  if (btn.dataset.action === 'toggle') toggleTask(id);
  if (btn.dataset.action === 'delete') deleteTask(id);
  renderTasks(taskListEl);
});`
            },
            {
              step: 4,
              title: "Uji Kasus Batas, Tulis README & Push ke GitHub",
              description: "Uji input kosong serta muat ulang F5, lengkapi dokumentasi README.md, lalu unggah commit.",
              command: 'git add . && git commit -m "feat: selesaikan aplikasi taskflow dengan localstorage" && git push'
            }
          ]
        }
      },
      {
        slideNumber: 8,
        isSummary: false,
        layoutType: "quiz",
        badge: "Kuis & Pustaka PBL",
        title: "Kuis Praktik TaskFlow & Referensi Proyek",
        subtitle: "Periksa pemahaman teknis seputar Web Storage, sanitasi input, dan delegasi event.",
        contentJson: {
          eyebrow: "Evaluasi Teknis & Referensi Project-Based Learning",
          highlights: [
            "Pelajari contoh proyek sejenis untuk memperkaya kerapian struktur kode aplikasi."
          ],
          quizItems: [
            {
              question: "Mengapa kita wajib memakai JSON.stringify() dan JSON.parse() pada localStorage?",
              hint: "Ingat batas tipe data yang diterima oleh Web Storage API.",
              answer: "Penyimpanan localStorage hanya menerima nilai bertipe string. JSON.stringify() mengubah array objek menjadi teks JSON saat disimpan, sedangkan JSON.parse() mengembalikannya menjadi array saat dibaca."
            },
            {
              question: "Apa kegunaan pemanggilan .trim() saat memvalidasi input formulir tugas?",
              hint: "Bayangkan pengguna hanya mengetik beberapa spasi lalu menekan tombol tambah.",
              answer: "Metode .trim() membuang spasi berlebih di ujung awal dan akhir teks. Dengan demikian, input berisi spasi kosong berubah menjadi string kosong dan langsung ditolak validasi."
            },
            {
              question: "Mengapa teknik event delegation pada elemen ul lebih efisien daripada memasang listener di tiap tombol?",
              hint: "Perhatikan apa yang terjadi ketika daftar item terus digambar ulang.",
              answer: "Satu listener pada elemen induk ul tetap aktif menangkap klik dari seluruh tombol anak meskipun isi daftar ditambah, dihapus, atau di-render ulang."
            }
          ],
          references: [
            {
              title: "Build a Todo List App in JavaScript",
              url: "https://github.com/dwyl/javascript-todo-list-tutorial",
              author: "dwyl (Project-Based Learning)",
              category: "Project-Based Learning",
              lang: "EN",
              type: "PBL"
            },
            {
              title: "Project-Based Learning || HTML & CSS Track",
              url: "https://github.com/practical-tutorials/project-based-learning#html-and-css",
              author: "Practical Tutorials",
              category: "Project-Based Learning",
              lang: "EN",
              type: "PBL"
            },
            {
              title: "Build an HTML Calculator with JS",
              url: "https://medium.freecodecamp.org/how-to-build-an-html-calculator-app-from-scratch-using-javascript-4454b8714b98",
              author: "freeCodeCamp (PBL)",
              category: "DOM & Logic Practice",
              lang: "EN",
              type: "PBL"
            },
            {
              title: "MDN || Web Storage API (localStorage)",
              url: "https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API",
              author: "MDN Contributors",
              category: "Browser Storage",
              lang: "EN",
              type: "Docs"
            },
            {
              title: "Ebook Belajar HTML Dan CSS Dasar",
              url: "https://www.malasngoding.com/download-ebook-belajar-html-dan-css-dasar-gratis/",
              author: "Malas Ngoding",
              category: "HTML & CSS",
              lang: "ID",
              type: "Book"
            }
          ],
          weeklyAssignment: {
            week: 4,
            title: "Weekly Coding Assignment || Minggu 4",
            description: "Tambahkan filter status tugas (Semua, Aktif, Selesai) beserta penghitung sisa tugas aktif pada TaskFlow sebelum sesi evaluasi."
          }
        }
      },
      {
        slideNumber: 9,
        isSummary: false,
        layoutType: "task",
        badge: "Task Submission",
        title: "Pengumpulan TaskFlow & Pembukaan Evaluasi Bulan 1",
        subtitle: "Kirim repositori TaskFlow beserta Learning Log untuk memasuki sesi evaluasi Pertemuan 05.",
        contentJson: {
          eyebrow: "Syarat Pembukaan Pertemuan 05",
          highlights: [
            "Pastikan ketujuh fitur minimum telah diuji mandiri tanpa galat sebelum dikirim."
          ],
          deliverables: [
            "Tautan repositori GitHub TaskFlow dengan berkas HTML, CSS, JS terpisah dan README.md.",
            "Seluruh fitur tambah, lihat, selesai, hapus, validasi, responsif, dan localStorage berfungsi.",
            "Riwayat commit tercatat bertahap serta Learning Log terisi lengkap."
          ],
          learningLogFields: STANDARD_LEARNING_LOG_FIELDS$1,
          mentorTip: "Uji aplikasi pada jendela penyamaran peramban untuk memastikan halaman tetap berjalan normal ketika data localStorage masih kosong."
        }
      }
    ]
  },
  // ============================================================================
  // P05 || PRESENTASI, REVIEW KODE & EVALUASI FUNDAMENTAL BULAN 1
  // ============================================================================
  {
    orderIndex: 5,
    month: 1,
    slug: "pertemuan-05-presentasi-evaluasi-bulan-1",
    code: "P06",
    sessionType: "Presentasi",
    title: "Presentasi, Review Kode & Evaluasi Fundamental Bulan 1",
    subtitle: "Presentasikan TaskFlow dan InternFlow, jelaskan alur kode, serta selesaikan evaluasi Bulan 1.",
    summaryText: "Sesi demonstrasi produk, bedah kode langsung, sepuluh kuis konsep dasar, dan audit repositori.",
    taskPrompt: "Tuntaskan audit akhir repositori TaskFlow dan InternFlow, kuasai sepuluh konsep dasar, lalu kumpulkan untuk persetujuan lanjut Bulan 2.",
    taskDeliverables: [
      "Repositori InternFlow dan TaskFlow bersih, responsif, serta memiliki README jelas.",
      "Riwayat commit teratur dan seluruh fitur berjalan tanpa galat di konsol.",
      "Kesiapan menjelaskan alur HTML, CSS, DOM, dan localStorage saat evaluasi."
    ],
    accentGradient: "from-violet-600 to-purple-500",
    iconName: "PresentationChart",
    slides: [
      {
        slideNumber: 1,
        isSummary: true,
        layoutType: "cover",
        badge: "Bulan 1 • Pertemuan 05",
        title: "Presentasi, Review Kode & Evaluasi Fundamental Bulan 1",
        subtitle: "Buktikan penguasaan fondasi frontend melalui demonstrasi produk dan penjelasan alur kode.",
        contentJson: {
          eyebrow: "Sesi Evaluasi Akhir Bulan 1 • Gerbang Menuju Backend",
          highlights: [
            "Demonstrasikan langsung fitur InternFlow dan TaskFlow di depan mentor.",
            "Jelaskan struktur HTML semantik, tata letak CSS, serta logika DOM JavaScript.",
            "Jawab sepuluh soal konsep dasar dan selesaikan tantangan ubahan kode singkat.",
            "Tinjau kerapian riwayat Git untuk menentukan kelulusan menuju Bulan 2."
          ],
          stats: [
            { label: "Jenis Sesi", value: "Presentasi" },
            { label: "Bobot Nilai", value: "40/30/20/10" },
            { label: "Kuis Konsep", value: "10 Soal Inti" },
            { label: "Tugas Mingguan", value: "Minggu 5" }
          ]
        }
      },
      {
        slideNumber: 2,
        isSummary: true,
        layoutType: "summary",
        badge: "Executive Summary",
        title: "Fokus Penilaian Mentor pada Evaluasi Bulan 1",
        subtitle: "Pemahaman jujur atas cara kerja kode bernilai lebih tinggi daripada tampilan hasil menyalin.",
        contentJson: {
          eyebrow: "Transparansi Rubrik Bulan 1",
          highlights: [
            "Sebanyak 40% nilai berasal dari kelancaran fitur wajib saat didemonstrasikan.",
            "Sebanyak 30% nilai berasal dari ketepatan menjawab sepuluh soal konsep dasar.",
            "Sebanyak 20% menilai kejelasan presentasi serta modifikasi kode secara langsung.",
            "Sebanyak 10% menilai kerapian struktur berkas, riwayat commit, dan README."
          ],
          bentoCards: [
            {
              title: "Indikator Siap Lanjut",
              tag: "Lulus Bulan 1",
              description: "Peserta memahami alur penambahan data hingga render DOM serta mampu mengubah fitur kecil."
            },
            {
              title: "Pendampingan Perbaikan",
              tag: "Umpan Balik",
              description: "Mentor memberikan catatan spesifik bagian kode yang perlu diperkuat sebelum masuk materi server."
            }
          ]
        }
      },
      {
        slideNumber: 3,
        isSummary: true,
        layoutType: "bento",
        badge: "Peta Konsep & Agenda",
        title: "Alur Sesi Evaluasi: Demo, Bedah Kode, Kuis & Audit Git",
        subtitle: "Empat tahapan evaluasi terukur untuk setiap peserta selama sekitar dua puluh menit.",
        contentJson: {
          eyebrow: "Urutan Pelaksanaan Evaluasi",
          highlights: [
            "Siapkan tab peramban, VS Code, dan GitHub sebelum giliran dimulai."
          ],
          bentoCards: [
            {
              title: "1. Demo Produk (7 Menit)",
              tag: "Bobot 40%",
              description: "Uji tampilan responsif InternFlow serta siklus CRUD dan muat ulang TaskFlow."
            },
            {
              title: "2. Bedah Kode (5 Menit)",
              tag: "Bobot 20%",
              description: "Tunjukkan struktur tag semantik, aturan Flexbox/Grid, dan fungsi penyimpanan lokal."
            },
            {
              title: "3. Kuis & Live Edit (5 Menit)",
              tag: "Bobot 30%",
              description: "Jawab pertanyaan konsep lisan lalu terapkan modifikasi kecil sesuai instruksi mentor."
            },
            {
              title: "4. Audit Git & Umpan Balik",
              tag: "Bobot 10%",
              description: "Pemeriksaan riwayat commit GitHub, kelengkapan README, dan penyampaian skor evaluasi."
            }
          ]
        }
      },
      {
        slideNumber: 4,
        isSummary: false,
        layoutType: "bento",
        badge: "Struktur Presentasi",
        title: "Kerangka Empat Langkah Menjelaskan Proyek Secara Runtut",
        subtitle: "Mulai penjelasan dari fungsi yang dilihat pengguna lalu telusuri kode penggeraknya.",
        contentJson: {
          eyebrow: "Komunikasi Teknis Software Engineer",
          highlights: [
            "Penjelasan yang runtut memudahkan rekan tim dan mentor meninjau arsitektur kode."
          ],
          bentoCards: [
            {
              title: "1. Tujuan & Daftar Fitur",
              tag: "30 Detik",
              description: "Sebutkan fungsi utama aplikasi beserta fitur inti yang telah selesai dibangun."
            },
            {
              title: "2. Struktur HTML & CSS",
              tag: "1 Menit",
              description: "Tunjukkan pembagian elemen semantik serta cara Grid dan Flexbox menjaga tata letak."
            },
            {
              title: "3. Alur Data JavaScript",
              tag: "2 Menit",
              description: "Urutkan perjalanan satu tugas dari validasi input, array, localStorage, hingga render DOM."
            },
            {
              title: "4. Kendala & Solusi",
              tag: "1 Menit",
              description: "Ceritakan satu bug nyata yang ditemui beserta cara melacaknya lewat DevTools."
            }
          ]
        }
      },
      {
        slideNumber: 5,
        isSummary: false,
        layoutType: "bento",
        badge: "Simulasi Live Coding",
        title: "Contoh Tantangan Ubah Kode & Standar README.md",
        subtitle: "Latih modifikasi fitur ringkas dan pastikan dokumentasi repositori mudah dipahami pembaca.",
        contentJson: {
          eyebrow: "Persiapan Bedah Kode & Repositori",
          highlights: [
            "Penulis kode mandiri dapat menuntaskan ubahan kecil dalam beberapa baris."
          ],
          codeBlocks: [
            {
              title: "Contoh Tantangan: Penghitung Tugas Aktif & Selesai",
              language: "javascript",
              filename: "counter.js",
              snippet: `function updateCounter(tasks, counterEl) {
  const total = tasks.length;
  const done = tasks.filter((t) => t.completed).length;
  const active = total - done;
  counterEl.textContent = \`Selesai: \${done} | Aktif: \${active} | Total: \${total}\`;
}`
            },
            {
              title: "Templat Ringkas README.md Evaluasi",
              language: "markdown",
              filename: "README.md",
              snippet: `# TaskFlow || Manajemen Tugas Vanilla JS

## Fitur Utama
- Tambah, tandai selesai, dan hapus tugas dengan validasi input
- Penyimpanan persisten di peramban melalui localStorage
- Tata letak responsif untuk layar ponsel dan desktop

## Teknologi
- HTML5 Semantik, CSS3 Flexbox/Grid, dan JavaScript ES6+`
            }
          ]
        }
      },
      {
        slideNumber: 6,
        isSummary: false,
        layoutType: "comparison",
        badge: "Bad vs Good Practice",
        title: "Presentasi Menghafal Teks vs Memahami Alur Data",
        subtitle: "Tunjukkan penguasaan lokasi fungsi dan alur logika saat sesi peninjauan kode.",
        contentJson: {
          eyebrow: "Sikap Profesional Saat Code Review",
          highlights: [
            "Sampaikan jujur bagian yang belum dipahami untuk dibahas bersama mentor."
          ],
          comparison: {
            badTitle: "✕ Kurang Siap Saat Peninjauan",
            badPoints: [
              "Bingung mencari letak fungsi tambah atau hapus di berkas sendiri.",
              "Mengeja sintaks kata demi kata tanpa menjelaskan tujuan bisnis fungsinya.",
              "Mengumpulkan repositori tanpa README dengan satu commit bertuliskan final."
            ],
            badCode: {
              title: "Riwayat Repositori Minim Informasi",
              language: "text",
              filename: "audit-buruk.txt",
              snippet: `Commit history:
- "upload semua" (1 commit sebulan)

README.md: tidak tersedia
Catatan: tidak tahu fungsi JSON.parse pada kode sendiri`
            },
            goodTitle: "✓ Standar Presentasi Engineer",
            goodPoints: [
              "Menjelaskan hubungan antar-fungsi mulai dari pemicu klik hingga pembaruan DOM.",
              "Mendemonstrasikan tampilan responsif serta ketahanan data saat halaman dimuat ulang.",
              "Menyajikan commit bertahap per fitur dilengkapi berkas README yang rapi."
            ],
            goodCode: {
              title: "Riwayat Repositori Terstruktur",
              language: "text",
              filename: "audit-baik.txt",
              snippet: `Commit history:
- feat: bangun struktur semantik dan css responsif
- feat: tambah logika crud tugas di dom
- feat: hubungkan penyimpanan localstorage
- docs: lengkapi panduan di readme`
            }
          }
        }
      },
      {
        slideNumber: 7,
        isSummary: false,
        layoutType: "practice",
        badge: "Checklist Sebelum Maju",
        title: "Langkah Praktik: Audit Mandiri Sebelum Sesi Evaluasi",
        subtitle: "Jalankan empat pemeriksaan akhir ini agar demonstrasi berjalan lancar tanpa kendala.",
        contentJson: {
          eyebrow: "Audit Mandiri Akhir Bulan 1",
          highlights: [
            "Audit mandiri lima belas menit mencegah galat saat demonstrasi berlangsung."
          ],
          practiceSteps: [
            {
              step: 1,
              title: "Uji Seluruh Skenario Fitur & Layar Responsif",
              description: "Uji input normal, penolakan spasi kosong, hapus tugas, muat ulang halaman, dan ukuran layar 375px."
            },
            {
              step: 2,
              title: "Bersihkan Kode Sisa Percobaan",
              description: "Hapus komentar usang serta console.log percobaan, lalu periksa perubahan dengan git diff.",
              command: "git status && git diff"
            },
            {
              step: 3,
              title: "Finalisasi README.md & Unggah Commit Terakhir",
              description: "Pastikan deskripsi fitur dan cara menjalankan aplikasi tertulis jelas di README.md.",
              command: 'git add . && git commit -m "chore: rapikan kode dan readme evaluasi bulan 1" && git push'
            },
            {
              step: 4,
              title: "Latih Jawaban Lisan Sepuluh Soal Evaluasi",
              description: "Pelajari sepuluh soal pada salindia berikutnya dan latih penjelasannya tanpa membaca catatan."
            }
          ]
        }
      },
      {
        slideNumber: 8,
        isSummary: false,
        layoutType: "quiz",
        badge: "10 Soal Evaluasi Resmi",
        title: "10 Pertanyaan Evaluasi Bulan 1 & Pustaka Persiapan Bulan 2",
        subtitle: "Kuasai kesepuluh pertanyaan resmi ini sebagai syarat kelulusan menuju materi backend.",
        contentJson: {
          eyebrow: "Bank Soal Resmi Bulan 1 & Bacaan Awal Bulan 2",
          highlights: [
            "Jawab setiap pertanyaan secara ringkas dan tepat menggunakan bahasa sendiri."
          ],
          quizItems: [
            {
              question: "1. Apa perbedaan peran HTML, CSS, dan JavaScript?",
              hint: "Bedakan kerangka konten, tata tampilan, dan logika interaksi.",
              answer: "HTML menyusun struktur dan makna konten, CSS mengatur tampilan serta tata letak, sedangkan JavaScript menjalankan logika dan interaksi dinamis."
            },
            {
              question: "2. Apa fungsi utama penggunaan HTML semantik?",
              hint: "Bandingkan tag bermakna seperti main dan article terhadap div biasa.",
              answer: "HTML semantik memperjelas peran setiap bagian halaman bagi pengembang, mesin pencari (SEO), dan perangkat pembaca layar aksesibilitas."
            },
            {
              question: "3. Apa yang dimaksud dengan CSS Box Model?",
              hint: "Sebutkan empat lapisan kotak elemen dari dalam ke luar.",
              answer: "CSS Box Model memandang setiap elemen sebagai kotak empat lapis dari dalam ke luar, yaitu Content, Padding, Border, dan Margin."
            },
            {
              question: "4. Apa perbedaan deklarasi variabel let dan const?",
              hint: "Periksa boleh tidaknya nilai variabel diisi ulang.",
              answer: "Kata kunci const mengunci referensi variabel agar tidak diisi ulang, sedangkan let dipakai untuk variabel yang nilainya berubah."
            },
            {
              question: "5. Apa pengertian dan manfaat function di JavaScript?",
              hint: "Pikirkan blok kode bernama yang dapat dipanggil berulang kali.",
              answer: "Function adalah blok kode terbungkus untuk menjalankan satu tugas spesifik yang dapat menerima parameter, mengembalikan nilai, dan mencegah duplikasi kode."
            },
            {
              question: "6. Apa perbedaan struktur data array dan object?",
              hint: "Bandingkan akses berbasis indeks angka dan nama properti.",
              answer: "Array menyimpan daftar nilai berurutan yang diakses memakai indeks angka mulai nol, sedangkan Object menyimpan pasangan kunci-nilai bernama."
            },
            {
              question: "7. Apa fungsi DOM di dalam peramban web?",
              hint: "Ingat jembatan antara dokumen HTML dan kode JavaScript.",
              answer: "DOM merepresentasikan dokumen HTML sebagai pohon objek sehingga JavaScript dapat membaca, mengubah, menambah, atau menghapus elemen secara dinamis."
            },
            {
              question: "8. Apa kegunaan metode addEventListener?",
              hint: "Bagaimana skrip merespons klik tombol atau pengiriman formulir?",
              answer: "Metode addEventListener memasang fungsi penangan yang dijalankan otomatis saat suatu peristiwa seperti click atau submit terjadi pada elemen."
            },
            {
              question: "9. Apa fungsi penyimpanan localStorage?",
              hint: "Mengapa daftar tugas TaskFlow tidak hilang saat halaman dimuat ulang?",
              answer: "Fitur localStorage menyimpan pasangan kunci-nilai bertipe string secara persisten di peramban sehingga data bertahan meski halaman di-refresh."
            },
            {
              question: "10. Bagaimana peramban menampilkan sebuah halaman situs web?",
              hint: "Urutkan dari pencarian DNS, HTTP, hingga pembentukan DOM dan render layar.",
              answer: "Peramban meminta halaman ke server lewat HTTP, lalu mengurai balasan HTML menjadi DOM dan CSS menjadi CSSOM untuk digambar ke layar sambil menjalankan JavaScript."
            }
          ],
          references: [
            {
              title: "Tutorial Node.js untuk Pemula (Persiapan Bulan 2)",
              url: "https://mfikri.com/artikel/tutorial-nodejs",
              author: "Mfikri",
              category: "Node.js & Backend",
              lang: "ID",
              type: "Book"
            },
            {
              title: "Belajar NodeJS Playlist (Persiapan Bulan 2)",
              url: "https://youtube.com/playlist?list=PLFIM0718LjIW-XBdVOerYgKegBtD6rSfD",
              author: "Sandhika Galih (Web Programming UNPAS)",
              category: "Node.js & Backend",
              lang: "ID",
              type: "Course"
            },
            {
              title: "Belajar Git Playlist",
              url: "https://www.youtube.com/playlist?list=PLuGFxya63u24bmP-ILRaiGeMwZh3PGxW4",
              author: "Galih Pratama",
              category: "Git & GitHub",
              lang: "ID",
              type: "Course"
            },
            {
              title: "JavaScript.info || Bahasa Indonesia",
              url: "https://id.javascript.info/",
              author: "Ilya Kantor",
              category: "JavaScript",
              lang: "ID",
              type: "Book"
            }
          ],
          weeklyAssignment: {
            week: 5,
            title: "Weekly Coding Assignment || Minggu 5 (Jembatan Bulan 2)",
            description: "Jalankan berkas JavaScript sederhana menggunakan perintah node di terminal dan pelajari fungsi berkas package.json hasil npm init."
          }
        }
      },
      {
        slideNumber: 9,
        isSummary: false,
        layoutType: "task",
        badge: "Evaluasi Akhir Bulan 1",
        title: "Daftar Kompetensi Bulan 1 & Pengajuan ACC ke Bulan 2",
        subtitle: "Pastikan sepuluh kompetensi dasar telah dikuasai lalu kirim pengajuan akhir Bulan 1.",
        contentJson: {
          eyebrow: "Daftar Periksa Kompetensi Frontend Fundamentals",
          highlights: [
            "Sesudah tugas di-ACC mentor, materi Backend Bulan 2 mulai terbuka."
          ],
          competencyChecklist: [
            "Memahami struktur dasar dokumen HTML.",
            "Menggunakan elemen HTML5 semantik secara tepat.",
            "Menyusun tata letak halaman menggunakan CSS eksternal.",
            "Menerapkan Flexbox dan CSS Grid sesuai kebutuhan.",
            "Membuat desain responsif untuk ponsel dan desktop.",
            "Memahami variabel serta tipe data JavaScript.",
            "Mengolah data memakai function, array, dan object.",
            "Memanipulasi DOM serta menangani event listener.",
            "Menyimpan data persisten menggunakan localStorage.",
            "Mengelola riwayat kode memakai Git dan GitHub."
          ],
          deliverables: [
            "Tautan repositori final Bulan 1 (TaskFlow dan InternFlow) beserta README.md.",
            "Tautan GitHub Pages atau tangkapan layar aplikasi pada tampilan ponsel dan desktop.",
            "Learning Log evaluasi Bulan 1 berisi refleksi capaian, kendala, dan kesiapan masuk Bulan 2."
          ],
          learningLogFields: STANDARD_LEARNING_LOG_FIELDS$1,
          mentorTip: "Tuliskan konsep yang masih terasa samar pada kolom Learning Log agar kita bahas tuntas sebelum mulai membangun REST API di Bulan 2."
        }
      }
    ]
  }
];
const MONTH_2_MODULES = [
  // =========================================================================
  // PERTEMUAN 07 || Node.js, npm, Express.js & Arsitektur REST API
  // =========================================================================
  {
    orderIndex: 7,
    month: 2,
    slug: "pertemuan-07-nodejs-express-rest-api",
    code: "P07",
    sessionType: "Materi 1",
    title: "Node.js, npm, Express.js & Arsitektur REST API",
    subtitle: "Membangun server HTTP pertama dengan Node.js, npm, konfigurasi .env, Express.js, dan pengujian endpoint di Postman.",
    summaryText: "Peserta beralih dari penyimpanan lokal browser menuju arsitektur client-server menggunakan Node.js, Express.js, JSON, dan Postman.",
    taskPrompt: "Bangun backend Express.js untuk TaskFlow dengan API (data di memori) dengan endpoint GET /api/health, GET /api/tasks, dan POST /api/tasks berkonfigurasi .env serta uji di Postman.",
    taskDeliverables: [
      "Repositori GitHub berisi package.json, .gitignore (node_modules dan .env), .env.example, serta src/server.js",
      "Server Express.js berjalan memakai variabel PORT dari file .env",
      "Endpoint GET /api/tasks (200) dan POST /api/tasks (201 atau 400) berfungsi dengan data di memori",
      "Koleksi atau tangkapan layar Postman yang membuktikan respons JSON sesuai status code"
    ],
    accentGradient: "from-green-600 to-emerald-500",
    iconName: "PlugsConnected",
    slides: [
      {
        slideNumber: 1,
        isSummary: true,
        layoutType: "cover",
        badge: "Bulan 2 • Pertemuan 06 • Materi 1",
        title: "Node.js, npm, Express.js & Arsitektur REST API",
        subtitle: "Transisi dari antarmuka statis menuju server backend berbasis protokol HTTP dan JSON.",
        contentJson: {
          eyebrow: "DIGITEK BOOTCAMP || BACK-END FUNDAMENTAL",
          highlights: [
            "Perbedaan runtime JavaScript di browser dan di server Node.js",
            "Manajemen paket npm, ES Modules, dan konfigurasi variabel .env",
            "Kontrak REST API: HTTP method, status code, dan format JSON",
            "Pembuatan server Express.js pertama serta pengujian di Postman"
          ],
          stats: [
            { label: "Komposisi Sesi", value: "30% Teori / 70% Praktik" },
            { label: "Durasi", value: "2.5 – 3 Jam" },
            { label: "Proyek Dual Track", value: "TaskFlow / InternFlow dengan API" },
            { label: "Mentor", value: "Alfin Almustajab" }
          ],
          mentorTip: "Pahami alur satu HTTP request hingga kembali sebagai JSON response sebelum menghafal sintaks Express."
        }
      },
      {
        slideNumber: 2,
        isSummary: true,
        layoutType: "summary",
        badge: "Ringkasan Materi",
        title: "Mengapa Penyimpanan Browser Tidak Lagi Cukup?",
        subtitle: "Data aplikasi nyata harus terpusat di server agar aman dan dapat diakses lintas perangkat.",
        contentJson: {
          eyebrow: "RINGKASAN EKSEKUTIF || MASALAH & SOLUSI",
          highlights: [
            "Data localStorage hilang saat cache dibersihkan dan terisolasi di satu browser",
            "Backend memisahkan tampilan antarmuka dari logika bisnis dan pengelolaan data",
            "Node.js menjalankan kode JavaScript langsung di sisi server",
            "Express.js menyederhanakan pembuatan rute REST API berformat JSON"
          ],
          stats: [
            { label: "Bulan 1", value: "HTML/CSS/JS + localStorage" },
            { label: "Bulan 2 (P06)", value: "Node.js + Express + JSON" },
            { label: "Alat Uji API", value: "Postman" }
          ]
        }
      },
      {
        slideNumber: 3,
        isSummary: true,
        layoutType: "bento",
        badge: "Peta Konsep & Agenda",
        title: "Agenda Belajar: 30% Konsep & 70% Praktik",
        subtitle: "Empat tahap membangun pondasi REST API sebelum terhubung ke database MySQL.",
        contentJson: {
          eyebrow: "PETA JALAN PERTEMUAN 06",
          highlights: [
            "45 menit konsep: runtime Node.js, npm, siklus HTTP, dan status code",
            "90 menit praktik: inisialisasi Express, konfigurasi .env, dan pengujian Postman"
          ],
          bentoCards: [
            {
              title: "1. Runtime Node.js & Terminal",
              tag: "00:00 – 00:20",
              description: "Menjalankan file JavaScript via terminal serta membedakan objek DOM dan process."
            },
            {
              title: "2. npm, package.json & .env",
              tag: "00:20 – 00:40",
              description: "Mengelola dependensi eksternal, mengaktifkan ES Modules, dan menyimpan konfigurasi di .env."
            },
            {
              title: "3. HTTP, JSON & Status Code",
              tag: "00:40 – 01:05",
              description: "Memetakan metode GET, POST, PUT, PATCH, DELETE beserta kode status HTTP."
            },
            {
              title: "4. Routing Express & Postman",
              tag: "01:05 – 02:30",
              description: "Membangun endpoint TaskFlow dengan API di memori dan memverifikasi respons via Postman."
            }
          ]
        }
      },
      {
        slideNumber: 4,
        isSummary: false,
        layoutType: "bento",
        badge: "30% Konsep Fundamental",
        title: "Arsitektur Client, REST API, Server, dan Status Code",
        subtitle: "Client mengirim permintaan terstandar melalui HTTP dan server mengembalikan respons JSON.",
        contentJson: {
          eyebrow: "KONSEP KOMUNIKASI CLIENT-SERVER",
          highlights: [
            "Browser dan Postman bertindak sebagai client pengirim HTTP request",
            "REST API menjembatani pertukaran data antara antarmuka dan server",
            "Status code memberi sinyal hasil pemrosesan secara cepat dan konsisten"
          ],
          bentoCards: [
            {
              title: "Browser JS vs Node.js",
              tag: "Runtime",
              description: "Browser mengelola antarmuka DOM, sedangkan Node.js mengakses jaringan dan sistem operasi.",
              bullets: [
                "Browser merender HTML dan interaksi pengguna",
                "Node.js melayani HTTP request dan database",
                "Konfigurasi server dibaca melalui objek process.env"
              ]
            },
            {
              title: "HTTP Methods Utama",
              tag: "REST Verbs",
              description: "Setiap operasi CRUD memakai metode HTTP spesifik pada URL resource.",
              bullets: [
                "GET mengambil daftar atau detail data",
                "POST mengirim dan membuat data baru",
                "PUT, PATCH, DELETE mengubah atau menghapus data"
              ]
            },
            {
              title: "HTTP Status Code Inti",
              tag: "Status Codes",
              description: "Gunakan kode status semantik sesuai hasil proses, bukan selalu 200 OK.",
              bullets: [
                "200 OK berhasil, 201 Created data dibuat",
                "400 Bad Request input salah, 401 Unauthorized",
                "404 Not Found kosong, 500 Server Error"
              ]
            },
            {
              title: "Format Payload JSON",
              tag: "Payload",
              description: "Format teks berbasis pasangan key-value yang dipahami berbagai bahasa pemrograman.",
              bullets: [
                "Nama key wajib memakai tanda kutip ganda",
                "Middleware express.json() mengurai isi req.body",
                "Method res.json() mengirim respons berformat JSON"
              ]
            }
          ]
        }
      },
      {
        slideNumber: 5,
        isSummary: false,
        layoutType: "bento",
        badge: "Bedah Teknis & Sintaks",
        title: "Anatomi Proyek Express.js Modern (.env & ES Modules)",
        subtitle: "Susun konfigurasi awal secara modular agar siap dikembangkan ke database MySQL.",
        contentJson: {
          eyebrow: "SINTAKS INTI NODE.JS & EXPRESS",
          highlights: [
            "Aktifkan type module di package.json agar mendukung sintaks import dan export",
            "Baca variabel PORT dari file .env agar konfigurasi terpisah",
            "Pasang middleware express.json() sebelum mendaftarkan rute endpoint"
          ],
          bentoCards: [
            {
              title: "package.json & Scripts",
              tag: "npm Config",
              description: "Mendefinisikan modul ES, dependensi utama, dan skrip pengembangan otomatis.",
              code: {
                title: "Konfigurasi package.json",
                language: "json",
                filename: "package.json",
                snippet: `{
  "name": "taskflow-api",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "node --watch src/server.js",
    "start": "node src/server.js"
  },
  "dependencies": {
    "dotenv": "^16.4.7",
    "express": "^4.21.2"
  }
}`
              }
            },
            {
              title: "Server Express & Middleware",
              tag: "src/server.js",
              description: "Memuat variabel .env, mengurai body JSON, dan membuka rute pengecekan server.",
              code: {
                title: "Bootstrap Express + .env",
                language: "javascript",
                filename: "src/server.js",
                snippet: `import 'dotenv/config';
import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'TaskFlow API' });
});
app.listen(PORT, () => {
  console.log(\`Server aktif di http://localhost:\${PORT}\`);
});`
              }
            }
          ],
          codeBlocks: [
            {
              title: "Template .env.example & .gitignore",
              language: "bash",
              filename: ".env.example",
              snippet: `# Salin ke file .env lokal
PORT=3000
APP_NAME="TaskFlow API"

# Isi wajib pada file .gitignore:
# node_modules/ dan .env`
            }
          ]
        }
      },
      {
        slideNumber: 6,
        isSummary: false,
        layoutType: "comparison",
        badge: "Good vs Bad Practice",
        title: "Standar Endpoint Express vs Kesalahan Pemula",
        subtitle: "Validasi input klien dan ketepatan status code memudahkan integrasi di sisi frontend.",
        contentJson: {
          eyebrow: "PERBANDINGAN KUALITAS KODE",
          highlights: [
            "Pisahkan variabel lingkungan di .env dan validasi payload sebelum menyimpan data",
            "Kirim kode 201 saat membuat data dan 400 saat gagal"
          ],
          comparison: {
            badTitle: "✕ Kesalahan Pemula (Bad Practice)",
            badPoints: [
              "Menulis port dan kredensial langsung di dalam file server.js",
              "Melewatkan express.json() sehingga nilai req.body menjadi undefined",
              "Mengembalikan status 200 OK meskipun validasi input gagal"
            ],
            badCode: {
              title: "Endpoint tanpa validasi dan status semantik",
              language: "javascript",
              filename: "bad-server.js",
              snippet: `app.post('/tasks', (req, res) => {
  // Rawan error: req.body belum tervalidasi
  tasks.push(req.body);
  // Respons teks biasa dengan status default 200
  res.send('Berhasil disimpan');
});`
            },
            goodTitle: "✓ Standar Software Engineer (Good Practice)",
            goodPoints: [
              "Membaca PORT dari process.env serta menyediakan .env.example dan .gitignore",
              "Memvalidasi field wajib sebelum memodifikasi data di server",
              "Mengirim respons JSON konsisten dengan status 201 atau 400"
            ],
            goodCode: {
              title: "Endpoint POST tervalidasi dengan respons JSON",
              language: "javascript",
              filename: "src/server.js",
              snippet: `app.post('/api/tasks', (req, res) => {
  const title = req.body?.title?.trim();
  if (!title) {
    return res.status(400).json({
      success: false,
      message: 'Field title wajib diisi.',
    });
  }
  const newTask = { id: Date.now(), title, isDone: false };
  tasks.push(newTask);
  return res.status(201).json({ success: true, data: newTask });
});`
            }
          }
        }
      },
      {
        slideNumber: 7,
        isSummary: false,
        layoutType: "practice",
        badge: "70% Praktik Hands-On",
        title: "Membangun REST API TaskFlow dengan API & Uji Postman",
        subtitle: "Ikuti empat langkah ini untuk menyiapkan server Express dan memverifikasi endpoint.",
        contentJson: {
          eyebrow: "PRAKTIK TERBIMBING || LANGKAH DEMI LANGKAH",
          highlights: [
            "Pastikan Node.js LTS sudah terpasang melalui perintah node -v di terminal",
            "Data disimpan sementara di memori sebelum dipindahkan ke MySQL pada P07"
          ],
          practiceSteps: [
            {
              step: 1,
              title: "Inisialisasi Proyek & Pasang Paket",
              description: "Buat folder proyek baru, inisialisasi package.json, lalu pasang express dan dotenv.",
              command: "mkdir taskflow-backend && cd taskflow-backend && npm init -y && npm install express dotenv"
            },
            {
              step: 2,
              title: "Siapkan .gitignore, .env & ES Modules",
              description: "Tambahkan type module di package.json, isi PORT=3000 di .env, dan buat file .gitignore.",
              code: `node_modules/
.env`
            },
            {
              step: 3,
              title: "Buat Endpoint GET & POST /api/tasks",
              description: "Tulis array data awal beserta rute GET dan POST tervalidasi di dalam src/server.js.",
              code: `const tasks = [
  { id: 1, title: 'Inisialisasi proyek Express', isDone: true },
  { id: 2, title: 'Uji endpoint di Postman', isDone: false },
];

app.get('/api/tasks', (req, res) => {
  res.status(200).json({ success: true, count: tasks.length, data: tasks });
});`
            },
            {
              step: 4,
              title: "Jalankan Server & Uji di Postman",
              description: "Jalankan npm run dev lalu uji respons 200, 201, dan 400 pada URL localhost:3000/api/tasks.",
              command: "npm run dev"
            }
          ]
        }
      },
      {
        slideNumber: 8,
        isSummary: false,
        layoutType: "quiz",
        badge: "Kuis & Pustaka Referensi",
        title: "Cek Pemahaman Dasar Backend & Referensi Belajar",
        subtitle: "Uji penguasaan konsep Node.js, HTTP, dan Express sebelum mempelajari database MySQL.",
        contentJson: {
          eyebrow: "EVALUASI KONSEP & REFERENSI",
          highlights: [
            "Jawab empat pertanyaan inti secara mandiri sebelum membaca kunci jawaban",
            "Gunakan referensi gratis berbahasa Indonesia dan dokumentasi resmi berikut"
          ],
          quizItems: [
            {
              question: "Apa perbedaan utama menjalankan JavaScript di browser dan di Node.js?",
              hint: "Bandingkan manipulasi DOM dengan akses sistem server.",
              answer: "Di browser, JavaScript memanipulasi DOM dan tampilan pengguna tanpa akses langsung ke sistem file. Di Node.js, JavaScript berjalan di server tanpa DOM untuk mengelola jaringan HTTP, file, variabel lingkungan, dan database."
            },
            {
              question: "Mengapa file .env dan folder node_modules tidak boleh diunggah ke GitHub?",
              hint: "Pertimbangkan keamanan kredensial dan ukuran repositori.",
              answer: "File .env menyimpan data rahasia seperti kata sandi atau kunci API yang berisiko bocor ke publik. Folder node_modules berukuran besar dan cukup dipasang ulang menggunakan perintah npm install dari package.json."
            },
            {
              question: "Kapan backend harus mengembalikan status code 201, 400, dan 404?",
              hint: "Bedakan pembuatan data baru, kesalahan input, dan ketiadaan data.",
              answer: "Gunakan 201 Created saat POST berhasil menyimpan data baru dan 400 Bad Request saat input klien tidak valid. Gunakan 404 Not Found ketika rute URL atau ID data yang diminta tidak ditemukan."
            },
            {
              question: "Apa fungsi pemasangan app.use(express.json()) pada aplikasi Express.js?",
              hint: "Perhatikan isi req.body jika middleware ini dilewatkan.",
              answer: "Middleware ini mengurai body HTTP request berformat JSON menjadi objek JavaScript pada req.body. Tanpa middleware tersebut, nilai req.body di dalam route handler akan bernilai undefined."
            }
          ],
          references: [
            {
              title: "Tutorial Node.js untuk Pemula (Full Tutorial)",
              url: "https://mfikri.com/artikel/tutorial-nodejs",
              author: "Mfikri",
              category: "Node.js & Express",
              lang: "ID",
              type: "Book"
            },
            {
              title: "Belajar NodeJS (Playlist Video)",
              url: "https://youtube.com/playlist?list=PLFIM0718LjIW-XBdVOerYgKegBtD6rSfD",
              author: "Sandhika Galih (Web Programming UNPAS)",
              category: "Node.js",
              lang: "ID",
              type: "Course"
            },
            {
              title: "ExpressJS Tutorial Indonesia",
              url: "https://www.youtube.com/playlist?list=PL9At9z2rvOC-sgzJx7rM_wMDONnEM4E0A",
              author: "Ekky Ridyanto (Baledemy)",
              category: "Express.js",
              lang: "ID",
              type: "Course"
            },
            {
              title: "MDN || HTTP Overview & Status Codes",
              url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview",
              author: "MDN Web Docs",
              category: "HTTP & REST API",
              lang: "EN",
              type: "Docs"
            },
            {
              title: "Express.js Getting Started & Postman Learning Center",
              url: "https://expressjs.com/en/starter/installing.html",
              author: "Express.js",
              category: "Express.js",
              lang: "EN",
              type: "Docs"
            }
          ],
          weeklyAssignment: {
            week: 6,
            title: "Weekly Assignment 6: REST API Sederhana dengan Express",
            description: "Tambahkan endpoint GET /api/tasks/:id (status 404 bila tidak ditemukan) serta uji skenario sukses dan gagal di Postman."
          }
        }
      },
      {
        slideNumber: 9,
        isSummary: false,
        layoutType: "task",
        badge: "Deliverable & Learning Log",
        title: "Pengumpulan Tugas Pertemuan 06 untuk ACC Mentor",
        subtitle: "Pastikan file .env tidak ikut terunggah dan seluruh endpoint telah teruji di Postman.",
        contentJson: {
          eyebrow: "SYARAT MEMBUKA PERTEMUAN 07",
          highlights: [
            "Mentor memeriksa package.json, .gitignore, validasi POST, dan bukti pengujian Postman",
            "Persetujuan tugas ini membuka akses penuh ke materi Pertemuan 07"
          ],
          deliverables: [
            "Tautan repositori GitHub proyek backend dengan riwayat commit yang jelas",
            "Server Express.js membaca PORT dari .env dan menyertakan .env.example",
            "Endpoint GET /api/health, GET /api/tasks, dan POST /api/tasks lulus uji Postman",
            "Catatan Learning Log berisi rangkuman materi dan kendala teknis"
          ],
          learningLogFields: [
            "Perbedaan runtime browser dan Node.js beserta fungsi status code HTTP",
            "Daftar endpoint Express.js yang dibuat dan diuji melalui Postman",
            "Kendala teknis saat konfigurasi proyek beserta solusi perbaikannya",
            "Tautan repositori GitHub dan kode commit terakhir"
          ],
          competencyChecklist: [
            "Memahami peran Node.js sebagai runtime JavaScript di sisi server",
            "Mampu menginisialisasi package.json dan memasang paket menggunakan npm",
            "Mampu menerapkan metode GET dan POST dengan status code semantik",
            "Mampu menguji request dan respons JSON menggunakan Postman"
          ],
          mentorTip: "Jalankan git status sebelum git commit untuk memastikan node_modules dan .env tidak masuk daftar unggahan."
        }
      }
    ]
  },
  // =========================================================================
  // PERTEMUAN 08 || MySQL via XAMPP, SQL CRUD/JOIN & Koneksi mysql2
  // =========================================================================
  {
    orderIndex: 8,
    month: 2,
    slug: "pertemuan-08-mysql-sql-koneksi-database",
    code: "P08",
    sessionType: "Materi 2",
    title: "MySQL via XAMPP, SQL CRUD/JOIN & Koneksi mysql2",
    subtitle: "Merancang tabel relasional di MySQL, menulis query SQL CRUD serta JOIN, dan menghubungkan Express menggunakan mysql2.",
    summaryText: "Peserta memindahkan penyimpanan data ke MySQL melalui XAMPP, merancang relasi tabel, dan menjalankan parameterized query dari Node.js.",
    taskPrompt: "Buat database taskflow di MySQL dengan tabel berelasi categories dan tasks, isi data awal di schema.sql, lalu hubungkan Express memakai connection pool mysql2/promise.",
    taskDeliverables: [
      "File schema.sql berisi perintah CREATE DATABASE, CREATE TABLE berelasi, dan INSERT data awal",
      "Modul koneksi src/config/db.js menggunakan mysql2/promise createPool dengan kredensial dari .env",
      "Endpoint GET /api/tasks membaca data langsung dari MySQL beserta nama kategori melalui LEFT JOIN",
      "Catatan Learning Log mengenai relasi tabel, query JOIN, dan konfigurasi koneksi database"
    ],
    accentGradient: "from-sky-600 to-blue-500",
    iconName: "Database",
    slides: [
      {
        slideNumber: 1,
        isSummary: true,
        layoutType: "cover",
        badge: "Bulan 2 • Pertemuan 07 • Materi 2",
        title: "MySQL via XAMPP, SQL CRUD/JOIN & Koneksi mysql2",
        subtitle: "Menyimpan data aplikasi secara permanen di database relasional dan menghubungkannya ke Node.js.",
        contentJson: {
          eyebrow: "DIGITEK BOOTCAMP || DATABASE RELASIONAL",
          highlights: [
            "Struktur database relasional: tabel, baris, kolom, primary key, dan foreign key",
            "Pengoperasian MySQL atau MariaDB lokal melalui XAMPP dan phpMyAdmin",
            "Sintaks SQL inti: CREATE, INSERT, SELECT, UPDATE, DELETE, dan JOIN",
            "Koneksi aman dari Express memakai pool mysql2/promise dan parameterized query"
          ],
          stats: [
            { label: "Komposisi Sesi", value: "30% Teori / 70% Praktik" },
            { label: "DBMS Lokal", value: "MySQL / MariaDB (XAMPP)" },
            { label: "Driver Node.js", value: "mysql2/promise" },
            { label: "Mentor", value: "Alfin Almustajab" }
          ],
          mentorTip: "Rancang relasi tabel dengan rapi sejak awal agar penulisan query API menjadi jauh lebih sederhana."
        }
      },
      {
        slideNumber: 2,
        isSummary: true,
        layoutType: "summary",
        badge: "Ringkasan Materi",
        title: "Dari Array Sementara Menuju Penyimpanan Permanen",
        subtitle: "Database relasional menjaga keutuhan data meskipun proses server dimatikan atau dimulai ulang.",
        contentJson: {
          eyebrow: "RINGKASAN EKSEKUTIF || DATABASE RELASIONAL",
          highlights: [
            "Data di memori hilang setiap kali server Node.js mengalami proses restart",
            "MySQL menyimpan data secara permanen ke dalam tabel yang saling berelasi",
            "Primary key dan foreign key menghubungkan tugas dengan kategori tanpa duplikasi",
            "Driver mysql2 mengeksekusi query secara asinkron dan mencegah celah SQL Injection"
          ],
          stats: [
            { label: "Database", value: "taskflow" },
            { label: "Relasi Utama", value: "One-to-Many (1:N)" },
            { label: "Keamanan Query", value: "Parameterized (?)" }
          ]
        }
      },
      {
        slideNumber: 3,
        isSummary: true,
        layoutType: "bento",
        badge: "Peta Konsep & Agenda",
        title: "Peta Konsep Database & Integrasi Backend",
        subtitle: "Empat tahap belajar dari menyalakan layanan MySQL hingga membaca tabel melalui Express.",
        contentJson: {
          eyebrow: "AGENDA 30% KONSEP / 70% PRAKTIK",
          highlights: [
            "45 menit konsep: struktur tabel, tipe data, kunci relasi, dan SQL",
            "90 menit praktik: skema phpMyAdmin dan koneksi pool di Express"
          ],
          bentoCards: [
            {
              title: "1. Konsep Tabel & Relasi Kunci",
              tag: "Konsep",
              description: "Membedakan database, tabel, primary key sebagai identitas unik, dan foreign key."
            },
            {
              title: "2. XAMPP & phpMyAdmin",
              tag: "Lingkungan Lokal",
              description: "Menjalankan service MySQL di port 3306 serta mengelola skema lewat phpMyAdmin."
            },
            {
              title: "3. SQL CRUD, Filter & JOIN",
              tag: "Query SQL",
              description: "Menulis perintah manipulasi data lengkap dengan klausa WHERE, ORDER BY, dan JOIN."
            },
            {
              title: "4. Pool Koneksi mysql2",
              tag: "Integrasi",
              description: "Menghubungkan Express ke MySQL memakai kredensial .env dan parameter tanda tanya."
            }
          ]
        }
      },
      {
        slideNumber: 4,
        isSummary: false,
        layoutType: "bento",
        badge: "30% Konsep Fundamental",
        title: "Anatomi Tabel, Kunci Relasi, dan Normalisasi Data",
        subtitle: "Normalisasi memecah data ke tabel terpisah untuk menjaga konsistensi dan mencegah duplikasi.",
        contentJson: {
          eyebrow: "KONSEP INTI RELATIONAL DATABASE",
          highlights: [
            "Database mewadahi seluruh tabel aplikasi seperti categories dan tasks",
            "Simpan category_id di tabel tasks agar nama kategori tidak ditulis berulang"
          ],
          bentoCards: [
            {
              title: "Hierarki & Tipe Data MySQL",
              tag: "Struktur",
              description: "Pilih tipe kolom yang presisi sesuai kebutuhan ukuran dan jenis nilai.",
              bullets: [
                "INT AUTO_INCREMENT untuk nomor ID otomatis",
                "VARCHAR dan TEXT untuk teks pendek atau panjang",
                "BOOLEAN dan TIMESTAMP untuk status serta waktu"
              ]
            },
            {
              title: "Primary Key vs Foreign Key",
              tag: "Kunci Relasi",
              description: "Dua jenis kunci yang menjaga integritas hubungan antarbaris di dalam tabel.",
              bullets: [
                "Primary key memberi identitas unik tiap baris",
                "Foreign key merujuk primary key tabel lain",
                "Index mempercepat pencarian pada klausa WHERE"
              ]
            },
            {
              title: "Pola Relasi Antartabel",
              tag: "Kardinalitas",
              description: "Tiga bentuk hubungan entitas yang paling sering digunakan dalam aplikasi.",
              bullets: [
                "One-to-One: satu pengguna punya satu profil",
                "One-to-Many: satu kategori memuat banyak tugas",
                "Many-to-Many: memakai tabel perantara tambahan"
              ]
            },
            {
              title: "Kompatibilitas XAMPP & MariaDB",
              tag: "Lingkungan",
              description: "XAMPP modern menyertakan MariaDB yang sepenuhnya kompatibel dengan protokol MySQL.",
              bullets: [
                "Berjalan di port standar 3306 secara lokal",
                "Mendukung sintaks SQL standar dan paket mysql2",
                "Periksa versi melalui perintah SELECT VERSION()"
              ]
            }
          ]
        }
      },
      {
        slideNumber: 5,
        isSummary: false,
        layoutType: "bento",
        badge: "Bedah Teknis & Sintaks",
        title: "Skema SQL Relasional & Connection Pool mysql2/promise",
        subtitle: "Gunakan connection pool berbasis promise agar eksekusi query tetap ringan dan rapi.",
        contentJson: {
          eyebrow: "SINTAKS SQL & DRIVER MYSQL2",
          highlights: [
            "Impor modul mysql2/promise supaya seluruh query mendukung sintaks async dan await",
            "Connection pool mengelola antrean koneksi tanpa membuka koneksi baru berulang kali"
          ],
          bentoCards: [
            {
              title: "Skema Tabel & Query LEFT JOIN",
              tag: "schema.sql",
              description: "Membangun relasi categories ke tasks lalu menggabungkan datanya menggunakan LEFT JOIN.",
              code: {
                title: "Skema & Query JOIN TaskFlow",
                language: "sql",
                filename: "schema.sql",
                snippet: `CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(80) NOT NULL
);
CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT NULL,
  title VARCHAR(180) NOT NULL,
  is_done BOOLEAN NOT NULL DEFAULT FALSE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);
SELECT t.id, t.title, t.is_done, c.name AS category_name
FROM tasks t LEFT JOIN categories c ON t.category_id = c.id;`
              }
            },
            {
              title: "Konfigurasi Pool & Parameter (?)",
              tag: "src/config/db.js",
              description: "Membaca kredensial database dari .env dan menjalankan query berparameter aman.",
              code: {
                title: "Pool Koneksi & Parameterized Query",
                language: "javascript",
                filename: "src/config/db.js",
                snippet: `import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'taskflow',
  connectionLimit: 10,
});
export async function getTaskById(id) {
  const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id]);
  return rows[0] || null;
}`
              }
            }
          ]
        }
      },
      {
        slideNumber: 6,
        isSummary: false,
        layoutType: "comparison",
        badge: "Good vs Bad Practice",
        title: "Celah SQL Injection vs Parameterized Query",
        subtitle: "Menyambung input pengguna langsung ke teks SQL membuka celah kebocoran database.",
        contentJson: {
          eyebrow: "KEAMANAN & KETEPATAN QUERY",
          highlights: [
            "Gunakan placeholder tanda tanya agar input diproses sebagai data murni",
            "Selalu sertakan klausa WHERE saat menjalankan perintah UPDATE maupun DELETE"
          ],
          comparison: {
            badTitle: "✕ Berisiko Tinggi (Bad Practice)",
            badPoints: [
              "Menggabungkan input pengguna ke string SQL memakai template literal",
              "Menyimpan kata sandi database secara terbuka di dalam kode sumber",
              "Menjalankan perintah UPDATE atau DELETE tanpa klausa penyaring WHERE"
            ],
            badCode: {
              title: "Rentan SQL Injection dan kredensial terbuka",
              language: "javascript",
              filename: "bad-db.js",
              snippet: `const conn = await mysql.createConnection({
  host: 'localhost', user: 'root', password: 'secret123', database: 'taskflow',
});
// Rawan SQL Injection jika input berisi kutip tunggal
const sql = \`SELECT * FROM tasks WHERE title = '\${req.query.q}'\`;
const [rows] = await conn.query(sql);`
            },
            goodTitle: "✓ Aman & Terstandar (Good Practice)",
            goodPoints: [
              "Memisahkan perintah SQL dan nilai parameter menggunakan array pada pool.query()",
              "Menyimpan kredensial koneksi database di dalam file .env lokal",
              "Menyertakan klausa WHERE berparameter saat mengubah atau menghapus baris"
            ],
            goodCode: {
              title: "Aman dengan Pool dan Parameterized Query",
              language: "javascript",
              filename: "good-db.js",
              snippet: `// Kredensial dimuat dari .env melalui instance pool
const [rows] = await pool.query(
  'SELECT id, title, is_done FROM tasks WHERE title LIKE ? ORDER BY id DESC LIMIT 50',
  [\`%\${keyword}%\`]
);
// Pembaruan baris spesifik menggunakan parameter terikat
await pool.query('UPDATE tasks SET is_done = ? WHERE id = ?', [isDone, taskId]);`
            }
          }
        }
      },
      {
        slideNumber: 7,
        isSummary: false,
        layoutType: "practice",
        badge: "70% Praktik Hands-On",
        title: "Membuat Database TaskFlow & Koneksi Express ke MySQL",
        subtitle: "Ikuti empat langkah ini untuk membaca data tabel MySQL langsung dari endpoint Express.",
        contentJson: {
          eyebrow: "PRAKTIK TERBIMBING || MYSQL & EXPRESS",
          highlights: [
            "Jalankan MySQL melalui XAMPP agar pengujian berjalan cepat di komputer lokal",
            "Simpan seluruh perintah pembuatan tabel ke dalam file schema.sql di repositori"
          ],
          practiceSteps: [
            {
              step: 1,
              title: "Aktifkan MySQL di XAMPP & Buka phpMyAdmin",
              description: "Klik Start pada modul Apache dan MySQL di XAMPP lalu akses localhost/phpmyadmin."
            },
            {
              step: 2,
              title: "Buat Database taskflow & Isi Data Awal",
              description: "Jalankan skema tabel categories dan tasks di tab SQL lalu masukkan data contoh.",
              code: `INSERT INTO categories (name) VALUES ('Backend'), ('Frontend');
INSERT INTO tasks (category_id, title, is_done) VALUES
  (1, 'Buat database taskflow di XAMPP', 1),
  (1, 'Hubungkan Express dengan mysql2', 0);`
            },
            {
              step: 3,
              title: "Pasang mysql2 & Lengkapi Konfigurasi .env",
              description: "Instal paket mysql2 di folder backend dan tambahkan kredensial database pada file .env.",
              command: "npm install mysql2",
              code: `DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=taskflow`
            },
            {
              step: 4,
              title: "Hubungkan GET /api/tasks ke Tabel MySQL",
              description: "Panggil pool.query dengan LEFT JOIN pada rute GET /api/tasks lalu verifikasi lewat Postman.",
              code: `app.get('/api/tasks', async (req, res) => {
  try {
    const [rows] = await pool.query(
      \`SELECT t.id, t.title, t.is_done, c.name AS category
       FROM tasks t LEFT JOIN categories c ON t.category_id = c.id
       ORDER BY t.id DESC\`
    );
    res.status(200).json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Gagal membaca data tugas' });
  }
});`
            }
          ]
        }
      },
      {
        slideNumber: 8,
        isSummary: false,
        layoutType: "quiz",
        badge: "Kuis & Pustaka Referensi",
        title: "Evaluasi Konsep SQL & Referensi Database MySQL",
        subtitle: "Pastikan konsep kunci relasi, JOIN, dan keamanan query sudah dikuasai dengan baik.",
        contentJson: {
          eyebrow: "KUIS KONSEP & REFERENSI",
          highlights: [
            "Jawab empat soal konsep database sebelum menyelesaikan tugas Pertemuan 07",
            "Manfaatkan buku elektronik dan materi video pilihan untuk latihan mandiri"
          ],
          quizItems: [
            {
              question: "Apa perbedaan antara database dan tabel di dalam MySQL?",
              hint: "Bandingkan wadah aplikasi secara utuh dengan struktur baris dan kolom.",
              answer: "Database adalah wadah utama yang mengelompokkan seluruh data milik satu aplikasi seperti taskflow. Tabel adalah struktur baris dan kolom di dalam database yang menyimpan satu entitas spesifik seperti tasks atau categories."
            },
            {
              question: "Apa peran primary key dan foreign key pada relasi One-to-Many?",
              hint: "Perhatikan hubungan antara categories.id dan tasks.category_id.",
              answer: "Primary key memberi identitas unik pada setiap baris di tabel asalnya. Foreign key menyimpan rujukan ke primary key tabel lain untuk menjaga keutuhan relasi antartabel."
            },
            {
              question: "Mengapa eksekusi query di Node.js wajib memakai parameter tanda tanya (?)?",
              hint: "Kaitkan dengan pencegahan serangan SQL Injection.",
              answer: "Parameterized query memisahkan struktur perintah SQL dari nilai input yang dikirim pengguna. Driver mysql2 akan mensterilkan nilai tersebut secara otomatis sehingga mencegah serangan SQL Injection."
            },
            {
              question: "Kapan kita memilih LEFT JOIN dibandingkan INNER JOIN saat membaca tasks?",
              hint: "Pertimbangkan baris tugas yang kolom category_id-nya bernilai NULL.",
              answer: "LEFT JOIN tetap menampilkan seluruh baris tugas meskipun kolom category_id bernilai NULL. INNER JOIN hanya menampilkan baris tugas yang sudah memiliki pasangan kategori yang cocok."
            }
          ],
          references: [
            {
              title: "Tutorial MySQL untuk Pemula Hingga Mahir (PDF)",
              url: "https://umardanny.com/tutorial-mysql-untuk-pemula-hingga-mahir-ebook-download-pdf/",
              author: "Umar Danny",
              category: "MySQL",
              lang: "ID",
              type: "Book"
            },
            {
              title: "MYSQL Tutorial Bahasa Indonesia (Playlist)",
              url: "https://www.youtube.com/playlist?list=PL-CtdCApEFH_P2_2zR6pvDublvpD3fF6W",
              author: "Eko Kurniawan Khannedy (Programmer Zaman Now)",
              category: "MySQL",
              lang: "ID",
              type: "Course"
            },
            {
              title: "Belajar MySQL (Playlist)",
              url: "https://www.youtube.com/playlist?list=PL2O3HdJI4voGs6CiEUPXwt1fhLLqu30E_",
              author: "Indonesia Belajar",
              category: "MySQL",
              lang: "ID",
              type: "Course"
            },
            {
              title: "mysql2 || Node.js MySQL Client Documentation",
              url: "https://sidorares.github.io/node-mysql2/",
              author: "Andrey Sidorov",
              category: "Node.js MySQL",
              lang: "EN",
              type: "Docs"
            },
            {
              title: "MySQL Official Documentation & phpMyAdmin Docs",
              url: "https://dev.mysql.com/doc/",
              author: "Oracle MySQL",
              category: "Database",
              lang: "EN",
              type: "Docs"
            }
          ],
          weeklyAssignment: {
            week: 7,
            title: "Weekly Assignment 7: Database MySQL & Latihan Query CRUD",
            description: "Latih query INSERT, SELECT dengan WHERE serta ORDER BY, UPDATE, dan DELETE di phpMyAdmin lalu simpan ke sql/practice.sql."
          }
        }
      },
      {
        slideNumber: 9,
        isSummary: false,
        layoutType: "task",
        badge: "Deliverable & Learning Log",
        title: "Pengumpulan Tugas Pertemuan 07 untuk ACC Mentor",
        subtitle: "Unggah file schema.sql beserta modul koneksi mysql2/promise ke repositori GitHub Anda.",
        contentJson: {
          eyebrow: "SYARAT MEMBUKA PERTEMUAN 08",
          highlights: [
            "Pastikan kredensial database berada di .env dan tercatat pada .gitignore",
            "Pertemuan 08 akan melanjutkan kelima endpoint CRUD hingga terhubung ke frontend"
          ],
          deliverables: [
            "File schema.sql berisi pembuatan database, tabel berelasi, dan data awal",
            "File src/config/db.js menggunakan mysql2/promise createPool berbasis variabel .env",
            "Endpoint GET /api/tasks menampilkan data nyata dari MySQL saat diuji di Postman",
            "Learning Log lengkap beserta tautan commit GitHub terbaru"
          ],
          learningLogFields: [
            "Konsep relasi primary key, foreign key, dan penggabungan tabel dengan JOIN",
            "Langkah pembuatan database di phpMyAdmin serta konfigurasi pool mysql2",
            "Kendala koneksi port atau sintaks SQL yang ditemui beserta solusinya",
            "Tautan repositori GitHub dan lokasi file schema.sql"
          ],
          competencyChecklist: [
            "Mampu merancang database dan tabel berelasi melalui phpMyAdmin",
            "Mampu menulis perintah SQL dasar beserta klausa penyaring dan JOIN",
            "Mampu menghubungkan Express ke MySQL memakai mysql2/promise dan .env",
            "Mampu menerapkan parameterized query untuk keamanan input dinamis"
          ],
          mentorTip: "Pastikan layanan MySQL di XAMPP sudah berstatus aktif sebelum menjalankan server agar terhindar dari error ECONNREFUSED."
        }
      }
    ]
  },
  // =========================================================================
  // PERTEMUAN 09 || Praktik Bulan 2: REST API CRUD Express + MySQL & Integrasi Frontend
  // =========================================================================
  {
    orderIndex: 9,
    month: 2,
    slug: "pertemuan-09-praktik-rest-api-crud-mysql",
    code: "P09",
    sessionType: "Praktik",
    title: "Praktik Bulan 2: REST API CRUD Express + MySQL & Integrasi Frontend",
    subtitle: "Membangun lima endpoint CRUD Express dan MySQL lengkap dengan validasi, CORS, serta integrasi fetch di frontend.",
    summaryText: "Peserta menyatukan antarmuka Bulan 1 dengan REST API Express dan database MySQL melalui lima endpoint CRUD tervalidasi.",
    taskPrompt: "Lengkapi 5 endpoint CRUD /api/tasks menggunakan Express dan mysql2, pasang middleware CORS serta penangan error, lalu hubungkan antarmuka Bulan 1 via fetch().",
    taskDeliverables: [
      "Backend Express.js menyediakan 5 endpoint CRUD /api/tasks dengan parameterized query ke MySQL",
      "Middleware cors aktif disertai validasi input (400), pengecekan ID kosong (404), dan error handler (500)",
      "Frontend Bulan 1 memanggil REST API menggunakan fetch() untuk membaca, menambah, mengubah, dan menghapus tugas",
      "Dokumentasi README.md memuat tabel spesifikasi endpoint beserta bukti pengujian Postman"
    ],
    accentGradient: "from-indigo-600 to-violet-500",
    iconName: "HardDrives",
    slides: [
      {
        slideNumber: 1,
        isSummary: true,
        layoutType: "cover",
        badge: "Bulan 2 • Pertemuan 08 • Praktik",
        title: "Praktik Bulan 2: REST API CRUD Express + MySQL & Integrasi Frontend",
        subtitle: "Menyatukan antarmuka Bulan 1 dengan backend Express dan penyimpanan permanen di MySQL.",
        contentJson: {
          eyebrow: "DIGITEK BOOTCAMP || FULL CRUD INTEGRATION",
          highlights: [
            "Lima endpoint wajib: GET daftar, GET detail, POST, PUT, dan DELETE",
            "Validasi payload, pengecekan affectedRows untuk 404, dan penanganan error terpusat",
            "Konfigurasi middleware CORS untuk komunikasi antarmuka dan server beda port",
            "Migrasi kode frontend dari localStorage menuju pemanggilan fetch() asinkron"
          ],
          stats: [
            { label: "Fokus Sesi", value: "80% Praktik Live Coding" },
            { label: "Target API", value: "5 Endpoint CRUD" },
            { label: "Integrasi", value: "Frontend fetch() -> Express -> MySQL" },
            { label: "Mentor", value: "Alfin Almustajab" }
          ],
          mentorTip: "Pastikan kelima endpoint berjalan benar di Postman sebelum menyambungkannya ke kode antarmuka browser."
        }
      },
      {
        slideNumber: 2,
        isSummary: true,
        layoutType: "summary",
        badge: "Ringkasan Materi",
        title: "Menjembatani Browser dan Database melalui Kontrak API",
        subtitle: "Frontend kini bertukar data melalui jaringan HTTP menuju Express dan tabel MySQL.",
        contentJson: {
          eyebrow: "RINGKASAN EKSEKUTIF || ALUR UJUNG KE UJUNG",
          highlights: [
            "Seluruh perubahan data dari antarmuka langsung tersimpan permanen di tabel MySQL",
            "Endpoint PUT dan DELETE memeriksa affectedRows bernilai nol untuk status 404",
            "Middleware cors membuka izin akses lintas port antara frontend dan backend",
            "Fungsi async di frontend memperbarui tampilan DOM sesuai respons server"
          ],
          stats: [
            { label: "Endpoint CRUD", value: "5 Rute" },
            { label: "Origin Frontend", value: "localhost:5500" },
            { label: "Origin API", value: "localhost:3000" }
          ]
        }
      },
      {
        slideNumber: 3,
        isSummary: true,
        layoutType: "bento",
        badge: "Peta Konsep & Agenda",
        title: "Arsitektur Alur Data & Target Praktik Sesi Ini",
        subtitle: "Menelusuri perjalanan data sejak tombol diklik hingga baris MySQL tampil kembali di layar.",
        contentJson: {
          eyebrow: "AGENDA PRAKTIK PERTEMUAN 08",
          highlights: [
            "20% ulasan teknis: router modular, kontrak endpoint, dan kebijakan CORS",
            "80% praktik: penulisan CRUD MySQL, uji Postman, dan integrasi fetch"
          ],
          bentoCards: [
            {
              title: "1. Router Modular Express",
              tag: "src/routes/tasks.js",
              description: "Memisahkan rute /api/tasks memakai express.Router() agar kode server tetap terorganisasi."
            },
            {
              title: "2. Operasi CRUD & Cek 404",
              tag: "Express + mysql2",
              description: "Memanfaatkan insertId pada POST serta affectedRows pada PUT dan DELETE."
            },
            {
              title: "3. CORS & Global Error Handler",
              tag: "Middleware",
              description: "Mengizinkan origin frontend lokal dan menangkap kegagalan server dalam format JSON."
            },
            {
              title: "4. Integrasi fetch() di UI",
              tag: "Antarmuka TaskFlow",
              description: "Mengganti fungsi localStorage dengan request GET, POST, PUT, dan DELETE ke API."
            }
          ]
        }
      },
      {
        slideNumber: 4,
        isSummary: false,
        layoutType: "bento",
        badge: "Konsep Integrasi",
        title: "Kebijakan CORS & Siklus Asinkron fetch() di Browser",
        subtitle: "Memahami aturan keamanan lintas port di browser serta cara menangani waktu tunggu respons.",
        contentJson: {
          eyebrow: "KOMUNIKASI CLIENT-SERVER",
          highlights: [
            "Browser memblokir komunikasi beda port kecuali server menyertakan header izin CORS",
            "Gunakan blok try/catch dan periksa properti res.ok saat memproses respons jaringan"
          ],
          bentoCards: [
            {
              title: "Penyebab & Solusi CORS",
              tag: "Keamanan Browser",
              description: "Port 5500 pada frontend dan port 3000 pada API diperlakukan sebagai origin berbeda.",
              bullets: [
                "Pasang paket cors lalu daftarkan app.use(cors())",
                "Batasi domain origin khusus saat masuk produksi"
              ]
            },
            {
              title: "Spesifikasi 5 Endpoint CRUD",
              tag: "Kontrak REST",
              description: "Pola URL dan kode status standar untuk pengelolaan resource tugas.",
              bullets: [
                "GET /api/tasks dan /:id mengembalikan 200 atau 404",
                "POST /api/tasks mengembalikan 201 atau 400",
                "PUT dan DELETE /:id mengembalikan 200 atau 404"
              ]
            },
            {
              title: "Konfigurasi fetch() POST & PUT",
              tag: "Frontend JS",
              description: "Pengiriman payload membutuhkan deklarasi method, header JSON, dan serialisasi body.",
              bullets: [
                "Sertakan header Content-Type bernilai application/json",
                "Ubah objek menjadi teks lewat JSON.stringify()",
                "Periksa kondisi res.ok sebelum memperbarui tampilan"
              ]
            },
            {
              title: "Penerapan pada Dual Track",
              tag: "Fleksibilitas",
              description: "Arsitektur CRUD ini berlaku identik baik untuk jalur TaskFlow maupun InternFlow.",
              bullets: [
                "TaskFlow dengan API mengelola daftar tugas di /api/tasks",
                "InternFlow dengan API mengelola log kegiatan di /api/interns"
              ]
            }
          ]
        }
      },
      {
        slideNumber: 5,
        isSummary: false,
        layoutType: "bento",
        badge: "Bedah Teknis & Sintaks",
        title: "Implementasi Router CRUD MySQL & Konsumsi fetch()",
        subtitle: "Contoh ringkas mutasi data di Express serta pemanggilannya dari skrip antarmuka.",
        contentJson: {
          eyebrow: "KODE INTI BACKEND & FRONTEND",
          highlights: [
            "Gunakan properti result.insertId setelah INSERT untuk mengambil baris yang baru dibuat",
            "Periksa result.affectedRows bernilai nol pada UPDATE dan DELETE untuk status 404"
          ],
          bentoCards: [
            {
              title: "Router Mutasi Data di Backend",
              tag: "src/routes/tasks.js",
              description: "Menangani penambahan dan pembaruan tugas menggunakan parameterized query serta validasi.",
              code: {
                title: "Cuplikan POST & DELETE dengan mysql2",
                language: "javascript",
                filename: "src/routes/tasks.js",
                snippet: `router.post('/', async (req, res, next) => {
  try {
    const title = req.body?.title?.trim();
    if (!title) return res.status(400).json({ message: 'Judul wajib diisi' });
    const [r] = await pool.query('INSERT INTO tasks (title) VALUES (?)', [title]);
    res.status(201).json({ id: r.insertId, title, is_done: 0 });
  } catch (err) { next(err); }
});
router.delete('/:id', async (req, res, next) => {
  const [r] = await pool.query('DELETE FROM tasks WHERE id = ?', [req.params.id]);
  if (!r.affectedRows) return res.status(404).json({ message: 'Tidak ditemukan' });
  res.status(200).json({ message: 'Tugas dihapus' });
});`
              }
            },
            {
              title: "Pemanggilan API dari Frontend",
              tag: "frontend/app.js",
              description: "Mengambil daftar tugas dan mengirim tugas baru menggunakan fungsi async fetch().",
              code: {
                title: "Konsumsi REST API dengan fetch()",
                language: "javascript",
                filename: "frontend/app.js",
                snippet: `const API_URL = 'http://localhost:3000/api/tasks';
async function loadTasks() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Gagal memuat daftar tugas');
  renderTasks((await res.json()).data);
}
async function createTask(title) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  if (res.ok) await loadTasks();
}`
              }
            }
          ]
        }
      },
      {
        slideNumber: 6,
        isSummary: false,
        layoutType: "comparison",
        badge: "Good vs Bad Practice",
        title: "Penanganan Error Rapuh vs Standar API Siap Produksi",
        subtitle: "Sembunyikan detail internal database dari publik dan tangani setiap kegagalan di antarmuka.",
        contentJson: {
          eyebrow: "STANDAR KUALITAS INTEGRASI",
          highlights: [
            "Oper error ke middleware global agar struktur database tidak bocor",
            "Perbarui elemen DOM hanya setelah server mengonfirmasi status respons berhasil"
          ],
          comparison: {
            badTitle: "✕ Implementasi Rapuh (Bad Practice)",
            badPoints: [
              "Mengirim objek error SQL mentah langsung ke respons HTTP klien",
              "Mengembalikan status 200 OK meskipun ID yang dihapus tidak ditemukan",
              "Melewatkan header Content-Type saat mengirim payload JSON dari fetch()"
            ],
            badCode: {
              title: "Membocorkan error internal dan mengabaikan affectedRows",
              language: "javascript",
              filename: "bad-route.js",
              snippet: `app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM tasks WHERE id = ' + req.params.id);
    res.json({ ok: true }); // Tetap 200 walau ID tidak ada
  } catch (err) {
    res.status(500).send(err); // Struktur tabel bocor ke publik
  }
});`
            },
            goodTitle: "✓ Standar API Profesional (Good Practice)",
            goodPoints: [
              "Memeriksa result.affectedRows === 0 untuk mengirim status 404 secara akurat",
              "Mencatat log error internal dan mengirim pesan aman ke klien",
              "Memverifikasi nilai res.ok di frontend sebelum menyinkronkan ulang tampilan"
            ],
            goodCode: {
              title: "Global Error Handler yang aman dan konsisten",
              language: "javascript",
              filename: "src/server.js",
              snippet: `// Pasang setelah seluruh rute terdaftar di server.js
app.use((err, req, res, next) => {
  console.error('[API Error]', err.message);
  res.status(500).json({
    success: false,
    message: 'Terjadi gangguan pada server. Silakan coba kembali.',
  });
});`
            }
          }
        }
      },
      {
        slideNumber: 7,
        isSummary: false,
        layoutType: "practice",
        badge: "70% Praktik Hands-On",
        title: "Eksekusi Full CRUD TaskFlow dengan API & Integrasi Antarmuka",
        subtitle: "Bangun kelima endpoint CRUD, verifikasi di Postman, lalu sambungkan ke halaman web.",
        contentJson: {
          eyebrow: "LANGKAH PRAKTIK TERSTRUKTUR",
          highlights: [
            "Pastikan layanan MySQL aktif dan tabel tasks sudah tersedia di database",
            "Nyalakan server Express dan server statis frontend secara bersamaan saat pengujian"
          ],
          practiceSteps: [
            {
              step: 1,
              title: "Pasang Middleware CORS & Pisahkan Router",
              description: "Instal paket cors, aktifkan app.use(cors()), dan hubungkan router /api/tasks di server.js.",
              command: "npm install cors"
            },
            {
              step: 2,
              title: "Lengkapi 5 Endpoint CRUD di src/routes/tasks.js",
              description: "Tulis rute GET semua, GET detail, POST, PUT, dan DELETE menggunakan parameterized query."
            },
            {
              step: 3,
              title: "Uji Siklus Lengkap CRUD Melalui Postman",
              description: "Uji urutan tambah data, baca detail, ubah status, hapus baris, hingga verifikasi kode 404."
            },
            {
              step: 4,
              title: "Ganti localStorage dengan fetch() di Frontend",
              description: "Hubungkan antarmuka Bulan 1 ke API lalu muat ulang halaman untuk memastikan data bertahan."
            }
          ]
        }
      },
      {
        slideNumber: 8,
        isSummary: false,
        layoutType: "quiz",
        badge: "Kuis & Pustaka Referensi",
        title: "Evaluasi Integrasi Client-Server & Referensi Pendukung",
        subtitle: "Uji pemahaman mengenai kebijakan CORS, pengecekan baris database, dan pengiriman header fetch.",
        contentJson: {
          eyebrow: "KUIS INTEGRASI & REFERENSI",
          highlights: [
            "Pahami alur utuh dari klik pengguna, fetch, SQL, hingga DOM",
            "Pelajari materi asinkron JavaScript dan dokumentasi Express untuk memperdalam praktik"
          ],
          quizItems: [
            {
              question: "Mengapa error CORS muncul saat frontend lokal memanggil API dan bagaimana solusinya?",
              hint: "Bandingkan nomor port antarmuka dengan nomor port backend.",
              answer: "Browser menerapkan Same-Origin Policy ketika frontend di port 5500 memanggil API di port 3000. Masalah ini diatasi dengan memasang middleware cors pada Express agar server menyertakan header Access-Control-Allow-Origin."
            },
            {
              question: "Bagaimana cara mengetahui apakah ID pada PUT atau DELETE benar-benar ada di MySQL?",
              hint: "Periksa objek hasil eksekusi dari pool.query().",
              answer: "Periksa nilai properti result.affectedRows setelah menjalankan query UPDATE atau DELETE. Jika nilainya 0, baris dengan ID tersebut tidak ada dan server wajib mengembalikan status 404 Not Found."
            },
            {
              question: "Mengapa header Content-Type application/json wajib disertakan pada fetch() POST dan PUT?",
              hint: "Ingat syarat agar middleware express.json() memproses body.",
              answer: "Middleware express.json() hanya mengurai isi body apabila header Content-Type bernilai application/json. Tanpa header tersebut, objek req.body di sisi backend akan tetap kosong."
            }
          ],
          references: [
            {
              title: "Express.js 4.x API Reference",
              url: "https://expressjs.com/en/4x/api.html",
              author: "Express.js",
              category: "Express.js",
              lang: "EN",
              type: "Docs"
            },
            {
              title: "Tutorial JavaScript Modern (Fetch & Async/Await)",
              url: "https://id.javascript.info",
              author: "Ilya Kantor",
              category: "JavaScript Async",
              lang: "ID",
              type: "Book"
            },
            {
              title: "Belajar JavaScript Async (Playlist)",
              url: "https://www.youtube.com/playlist?list=PL-CtdCApEFH-I4CD6km3BcXqrhWAkY4et",
              author: "Eko Kurniawan Khannedy (Programmer Zaman Now)",
              category: "JavaScript Async",
              lang: "ID",
              type: "Course"
            },
            {
              title: "Postman Learning Center",
              url: "https://learning.postman.com/",
              author: "Postman",
              category: "API Testing",
              lang: "EN",
              type: "Docs"
            },
            {
              title: "Project-Based Learning (Web & Node.js)",
              url: "https://github.com/practical-tutorials/project-based-learning",
              author: "Practical Tutorials",
              category: "Project-Based Learning",
              lang: "EN",
              type: "PBL"
            }
          ],
          weeklyAssignment: {
            week: 8,
            title: "Weekly Assignment 8: Menghubungkan API Express dengan MySQL",
            description: "Tambahkan fitur pencarian query string (q=kata) memakai klausa SQL LIKE berparameter dan hubungkan ke kotak cari frontend."
          }
        }
      },
      {
        slideNumber: 9,
        isSummary: false,
        layoutType: "task",
        badge: "Deliverable & Learning Log",
        title: "Pengumpulan Tugas Pertemuan 08 untuk ACC Mentor",
        subtitle: "Kumpulkan repositori berisi backend CRUD, frontend terintegrasi, dan dokumentasi endpoint pada README.md.",
        contentJson: {
          eyebrow: "SYARAT MEMBUKA PERTEMUAN 09",
          highlights: [
            "Pastikan tugas baru tetap tampil setelah halaman browser dimuat ulang",
            "Pertemuan 09 berfokus pada debugging, audit kode, dan cadangan file .sql"
          ],
          deliverables: [
            "5 endpoint CRUD /api/tasks berjalan lengkap dengan status 200, 201, 400, 404, dan 500",
            "Antarmuka Bulan 1 terhubung penuh ke API Express menggunakan fetch() async dan await",
            "File README.md memuat panduan instalasi, variabel .env.example, dan daftar endpoint",
            "Catatan Learning Log beserta tautan commit GitHub terbaru"
          ],
          learningLogFields: [
            "Alur komunikasi dari fetch() di browser menuju Express hingga tabel MySQL",
            "Daftar fitur CRUD yang telah diuji melalui Postman dan halaman antarmuka",
            "Kendala integrasi seperti CORS atau format payload beserta cara mengatasinya",
            "Tautan repositori GitHub untuk kode backend dan frontend"
          ],
          competencyChecklist: [
            "Mampu membangun 5 endpoint REST API CRUD menggunakan Express dan mysql2",
            "Mampu menerapkan parameterized query, validasi input, dan penanganan error terpusat",
            "Mampu menguji skenario positif serta negatif secara menyeluruh di Postman",
            "Mampu mengintegrasikan antarmuka web dengan REST API melalui fetch()"
          ],
          mentorTip: "Buka tab Network di Chrome DevTools untuk memeriksa status code dan isi payload saat hasil di antarmuka tidak sesuai harapan."
        }
      }
    ]
  },
  // =========================================================================
  // PERTEMUAN 10 || Project Clinic, Debugging API, Code Review & Intro Railway
  // =========================================================================
  {
    orderIndex: 10,
    month: 2,
    slug: "pertemuan-10-project-clinic-debugging-railway",
    code: "P10",
    sessionType: "Project Clinic",
    title: "Project Clinic, Debugging API, Code Review & Intro Railway",
    subtitle: "Mendiagnosis bug API dan koneksi MySQL, meninjau kerapian repositori Git, mencadangkan file .sql, serta pengenalan Railway.",
    summaryText: "Sesi klinik kode memastikan proyek bebas bug, aman dari kebocoran kredensial, memiliki cadangan .sql, dan terdokumentasi rapi.",
    taskPrompt: "Tuntaskan seluruh bug pada TaskFlow atau InternFlow dengan API, rapikan struktur folder dan README, ekspor cadangan database/taskflow.sql, serta siapkan koleksi Postman.",
    taskDeliverables: [
      "Seluruh 5 endpoint CRUD dan antarmuka berjalan stabil tanpa error di konsol maupun server",
      "File cadangan database/taskflow.sql hasil ekspor phpMyAdmin tersimpan di dalam repositori",
      "Dokumentasi README.md dan file koleksi Postman (.json) memuat contoh request serta respons",
      "Catatan hasil audit kode dan perbaikan bug tercatat rapi pada Learning Log"
    ],
    accentGradient: "from-amber-600 to-orange-500",
    iconName: "Wrench",
    slides: [
      {
        slideNumber: 1,
        isSummary: true,
        layoutType: "cover",
        badge: "Bulan 2 • Pertemuan 09 • Project Clinic",
        title: "Project Clinic, Debugging API, Code Review & Intro Railway",
        subtitle: "Menuntaskan bug tersisa, mengaudit keamanan repositori, mencadangkan file .sql, dan mengenal persiapan deployment.",
        contentJson: {
          eyebrow: "DIGITEK BOOTCAMP || KLINIK KODE & AUDIT KUALITAS",
          highlights: [
            "Diagnosis terarah untuk error koneksi MySQL, CORS, dan endpoint CRUD",
            "Tinjauan struktur folder, keamanan .gitignore, serta kerapian riwayat commit Git",
            "Ekspor cadangan database .sql dan penyusunan dokumentasi koleksi Postman",
            "Pengenalan deployment di Railway beserta kesiapan demonstrasi lokal"
          ],
          stats: [
            { label: "Format Sesi", value: "Klinik Kode & Review 1-on-1" },
            { label: "Target", value: "CRUD Stabil + Cadangan .sql" },
            { label: "Cloud Intro", value: "Railway (Opsional / Latihan)" },
            { label: "Mentor", value: "Alfin Almustajab" }
          ],
          mentorTip: "Gunakan sesi klinik untuk memahami akar penyebab setiap bug agar kesalahan serupa tidak terulang pada proyek berikutnya."
        }
      },
      {
        slideNumber: 2,
        isSummary: true,
        layoutType: "summary",
        badge: "Ringkasan Materi",
        title: "Menyiapkan Proyek Berstandar Tim Sebelum Evaluasi",
        subtitle: "Kesiapan demo ditentukan oleh stabilitas penanganan error, keamanan kredensial, dan kelengkapan cadangan database.",
        contentJson: {
          eyebrow: "RINGKASAN EKSEKUTIF || PROJECT CLINIC",
          highlights: [
            "Memastikan seluruh peserta menuntaskan fitur minimum sebelum sesi evaluasi Pertemuan 10",
            "Melatih pembacaan kode error Node.js dan MySQL dari log terminal",
            "Mengenalkan konsep deployment cloud dengan demonstrasi lokal sebagai standar utama"
          ],
          stats: [
            { label: "Bobot Proyek", value: "40% Nilai Bulan 2" },
            { label: "Bobot Git & Repo", value: "10% Nilai Bulan 2" },
            { label: "Cadangan Wajib", value: "taskflow.sql" }
          ]
        }
      },
      {
        slideNumber: 3,
        isSummary: true,
        layoutType: "bento",
        badge: "Peta Konsep & Agenda",
        title: "Empat Pos Pemeriksaan Kualitas Proyek Bulan 2",
        subtitle: "Tahapan audit menyeluruh agar aplikasi siap didemonstrasikan tanpa kendala teknis.",
        contentJson: {
          eyebrow: "DAFTAR PERIKSA PROJECT CLINIC",
          highlights: [
            "Peserta melewati pos debugging, audit kode, cadangan SQL, dan dokumentasi"
          ],
          bentoCards: [
            {
              title: "Pos 1: Diagnosis Koneksi & API",
              tag: "Diagnostik",
              description: "Menelusuri penyebab error ECONNREFUSED, ER_ACCESS_DENIED, pemblokiran CORS, dan req.body kosong."
            },
            {
              title: "Pos 2: Code Review & Kerapian Git",
              tag: "Kualitas Kode",
              description: "Memeriksa pemisahan folder, konsistensi penamaan, parameter SQL, serta perlindungan file .env."
            },
            {
              title: "Pos 3: Cadangan .sql & Dokumentasi",
              tag: "Portabilitas",
              description: "Mengekspor skema database dan koleksi Postman agar proyek mudah dijalankan ulang."
            },
            {
              title: "Pos 4: Pengenalan Deployment Railway",
              tag: "Deployment",
              description: "Mempelajari pengaturan variabel lingkungan cloud, batas kuota latihan, dan skenario demo lokal."
            }
          ]
        }
      },
      {
        slideNumber: 4,
        isSummary: false,
        layoutType: "bento",
        badge: "Panduan Debugging",
        title: "Panduan Cepat Diagnosis Error Backend & MySQL",
        subtitle: "Baca kode error pada terminal untuk menemukan sumber masalah secara presisi.",
        contentJson: {
          eyebrow: "PANDUAN PENANGANAN MASALAH",
          highlights: [
            "Pesan error Node.js dan MySQL memuat kode spesifik beserta baris penyebabnya"
          ],
          bentoCards: [
            {
              title: "ECONNREFUSED 127.0.0.1:3306",
              tag: "Koneksi",
              description: "Aplikasi Node.js gagal menjangkau layanan server database di komputer lokal.",
              bullets: [
                "Pastikan modul MySQL di XAMPP sudah berstatus Start",
                "Cocokkan nilai DB_PORT di .env dengan port aktif"
              ]
            },
            {
              title: "ER_ACCESS_DENIED / ER_BAD_DB_ERROR",
              tag: "Autentikasi",
              description: "Kredensial pengguna keliru atau nama database tujuan belum tersedia di MySQL.",
              bullets: [
                "Pengaturan bawaan XAMPP memakai user root tanpa sandi",
                "Periksa kesamaan ejaan DB_NAME dengan daftar di phpMyAdmin"
              ]
            },
            {
              title: "Property of undefined (req.body)",
              tag: "Payload",
              description: "Isi JSON dari client tidak terurai sebelum masuk ke fungsi penangan rute.",
              bullets: [
                "Letakkan app.use(express.json()) di atas deklarasi rute",
                "Pastikan pengirim menyertakan header Content-Type application/json"
              ]
            },
            {
              title: "Kebijakan Latihan Cloud Railway",
              tag: "Deployment",
              description: "Prinsip aman saat mencoba mengunggah aplikasi backend ke layanan cloud.",
              bullets: [
                "Pastikan aplikasi berjalan stabil di lokal terlebih dahulu",
                "Isi kredensial melalui menu Variables pada dashboard Railway",
                "Siapkan demo lokal dan file .sql cadangan"
              ]
            }
          ]
        }
      },
      {
        slideNumber: 5,
        isSummary: false,
        layoutType: "bento",
        badge: "Code Review & Struktur",
        title: "Struktur Folder Ideal & Konfigurasi Port Dinamis",
        subtitle: "Tata letak repositori yang bersih mempermudah peninjauan kode maupun proses deployment.",
        contentJson: {
          eyebrow: "STANDAR REPOSITORI & DEPLOYMENT",
          highlights: [
            "Gunakan process.env.PORT agar server menyesuaikan port lokal maupun port dinamis cloud",
            "Lampirkan database/taskflow.sql dan .env.example agar proyek mudah direplikasi"
          ],
          bentoCards: [
            {
              title: "Tata Letak Repositori Rapi",
              tag: "Struktur Folder",
              description: "Pisahkan direktori backend, frontend, cadangan SQL, dan koleksi pengujian Postman.",
              code: {
                title: "Struktur Proyek TaskFlow dengan API",
                language: "text",
                filename: "tree.txt",
                snippet: `taskflow-api/
├── backend/
│   ├── src/config/db.js
│   ├── src/routes/tasks.js
│   ├── src/server.js
│   ├── .env.example
│   └── package.json
├── frontend/          (index.html, style.css, app.js)
├── database/taskflow.sql
├── postman/taskflow.postman_collection.json
├── .gitignore
└── README.md`
              }
            },
            {
              title: "Healthcheck & Port Dinamis",
              tag: "Konfigurasi Server",
              description: "Menyediakan rute pemeriksaan koneksi database serta mendengarkan host 0.0.0.0.",
              code: {
                title: "Dynamic PORT & Healthcheck",
                language: "javascript",
                filename: "backend/src/server.js",
                snippet: `const PORT = process.env.PORT || 3000;

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).json({ status: 'ok', db: 'connected' });
  } catch {
    res.status(500).json({ status: 'error', db: 'disconnected' });
  }
});
app.listen(PORT, '0.0.0.0', () => {
  console.log(\`API aktif pada port \${PORT}\`);
});`
              }
            }
          ]
        }
      },
      {
        slideNumber: 6,
        isSummary: false,
        layoutType: "comparison",
        badge: "Good vs Bad Practice",
        title: "Repositori Berantakan vs Repositori Siap Dinilai",
        subtitle: "Kerapian riwayat Git dan dokumentasi menyumbang sepuluh persen dari nilai evaluasi.",
        contentJson: {
          eyebrow: "STANDAR PENINJAUAN KODE",
          highlights: [
            "Buat commit bertahap dengan pesan deskriptif sesuai perubahan fitur yang dikerjakan"
          ],
          comparison: {
            badTitle: "✕ Repositori Bermasalah (Bad Practice)",
            badPoints: [
              "File .env ikut terunggah ke GitHub sehingga kredensial database terbuka",
              "Tidak menyertakan file .sql sehingga struktur tabel sulit direplikasi",
              "Riwayat commit hanya berisi pesan singkat yang tidak menjelaskan perubahan"
            ],
            badCode: {
              title: "Riwayat commit tidak deskriptif dan tanpa struktur",
              language: "bash",
              filename: "bad-git-log.txt",
              snippet: `# Contoh pesan commit yang menyulitkan penelusuran bug
git add .
git commit -m "upload semua file"
git commit -m "perbaikan error"
git commit -m "versi final revisi"`
            },
            goodTitle: "✓ Standar Siap Review (Good Practice)",
            goodPoints: [
              "File .gitignore melindungi node_modules serta .env dan dilengkapi .env.example",
              "Tersedia file database/taskflow.sql yang siap diimpor melalui phpMyAdmin",
              "README.md memuat langkah instalasi, konfigurasi, dan tabel daftar endpoint"
            ],
            goodCode: {
              title: "Riwayat commit terstruktur dan mudah ditelusuri",
              language: "bash",
              filename: "good-git-log.txt",
              snippet: `# Pesan commit jelas sesuai cakupan perubahan
git commit -m "feat(api): setup express server and health endpoint"
git commit -m "feat(db): add mysql2 pool and taskflow schema"
git commit -m "feat(tasks): implement CRUD routes with validation"
git commit -m "docs: add API specification and sql backup"`
            }
          }
        }
      },
      {
        slideNumber: 7,
        isSummary: false,
        layoutType: "practice",
        badge: "70% Praktik Hands-On",
        title: "Audit Proyek, Ekspor .sql, & Dokumentasi Postman",
        subtitle: "Jalankan empat langkah pembersihan ini agar proyek siap didemonstrasikan pada Pertemuan 10.",
        contentJson: {
          eyebrow: "RENCANA AKSI PROJECT CLINIC",
          highlights: [
            "Utamakan kestabilan aplikasi lokal, kelengkapan koleksi Postman, dan file cadangan .sql"
          ],
          practiceSteps: [
            {
              step: 1,
              title: "Uji Ulang 5 Endpoint & Penanganan Error",
              description: "Tambahkan endpoint GET /api/health lalu verifikasi respons 200, 201, 400, dan 404 di Postman."
            },
            {
              step: 2,
              title: "Ekspor Database ke database/taskflow.sql",
              description: "Buka tab Export di phpMyAdmin dalam format SQL lalu simpan hasilnya ke folder database/."
            },
            {
              step: 3,
              title: "Ekspor Koleksi Postman & Lengkapi README.md",
              description: "Simpan file ekspor Collection v2.1 ke folder postman/ dan tulis panduan instalasi di README.md."
            },
            {
              step: 4,
              title: "Tinjau Kesiapan Konfigurasi Deployment",
              description: "Pastikan kode memakai process.env untuk seluruh konfigurasi dan lakukan simulasi demo lokal."
            }
          ]
        }
      },
      {
        slideNumber: 8,
        isSummary: false,
        layoutType: "quiz",
        badge: "Kuis & Pustaka Referensi",
        title: "Latihan Diagnosis Bug & Referensi Pengelolaan Proyek",
        subtitle: "Uji ketepatan membaca error umum backend serta langkah pengamanan kredensial.",
        contentJson: {
          eyebrow: "KUIS DIAGNOSTIK & DOKUMENTASI",
          highlights: [
            "Siapkan pemahaman menyeluruh untuk menghadapi sesi tanya jawab pada Pertemuan 10"
          ],
          quizItems: [
            {
              question: "Apa dua hal pertama yang harus diperiksa saat muncul error ECONNREFUSED di lokal?",
              hint: "Periksa status modul di XAMPP dan konfigurasi port.",
              answer: "Pertama, pastikan layanan MySQL pada XAMPP Control Panel sudah dijalankan. Kedua, periksa kesesuaian nilai DB_HOST dan DB_PORT pada file .env dengan port aktif MySQL."
            },
            {
              question: "Mengapa file cadangan .sql wajib disertakan di dalam repositori proyek?",
              hint: "Bayangkan ketika proyek harus dijalankan di perangkat lain.",
              answer: "File .sql memungkinkan struktur tabel beserta data awal diimpor dengan cepat di perangkat mentor maupun server lain. Cara ini mencegah perbedaan skema saat pengujian berlangsung."
            },
            {
              question: "Apa aturan keamanan utama saat mengunggah aplikasi Express dan MySQL ke layanan cloud?",
              hint: "Perhatikan pengelolaan kata sandi dan batas kuota layanan.",
              answer: "Jangan pernah menyimpan kata sandi atau kredensial database di dalam kode sumber maupun repositori publik. Masukkan seluruh nilai rahasia melalui fitur Environment Variables pada dashboard penyedia layanan."
            }
          ],
          references: [
            {
              title: "Railway Documentation (Variables & Node.js Deploy)",
              url: "https://docs.railway.com/",
              author: "Railway",
              category: "Deployment",
              lang: "EN",
              type: "Docs"
            },
            {
              title: "Railway Pricing & Trial Credits Policy",
              url: "https://railway.com/pricing",
              author: "Railway",
              category: "Deployment Policy",
              lang: "EN",
              type: "Docs"
            },
            {
              title: "phpMyAdmin Documentation (Export & Import SQL)",
              url: "https://docs.phpmyadmin.net/",
              author: "phpMyAdmin",
              category: "Database Tool",
              lang: "EN",
              type: "Docs"
            },
            {
              title: "Belajar Git untuk Pemula",
              url: "https://github.com/petanikode/belajar-git",
              author: "Ahmad Muhardian (Petani Kode)",
              category: "Git & Repository",
              lang: "ID",
              type: "Book"
            },
            {
              title: "GIT & GITHUB (Playlist Video)",
              url: "https://www.youtube.com/playlist?list=PLFIM0718LjIVknj6sgsSceMqlq242-jNf",
              author: "Sandhika Galih (Web Programming UNPAS)",
              category: "Git & GitHub",
              lang: "ID",
              type: "Course"
            }
          ],
          weeklyAssignment: {
            week: 9,
            title: "Weekly Assignment 9: Perbaikan Proyek & Dokumentasi API",
            description: "Lakukan simulasi presentasi mandiri selama 5 menit mencakup pengujian Postman, interaksi antarmuka, dan verifikasi data di phpMyAdmin."
          }
        }
      },
      {
        slideNumber: 9,
        isSummary: false,
        layoutType: "task",
        badge: "Deliverable & Learning Log",
        title: "Pengumpulan Tugas Pertemuan 09 untuk ACC Mentor",
        subtitle: "Pastikan proyek telah bebas bug, dicadangkan dalam file .sql, dan terdokumentasi lengkap.",
        contentJson: {
          eyebrow: "SYARAT MEMBUKA PERTEMUAN 10",
          highlights: [
            "Pertemuan 09 merupakan tahap verifikasi akhir sebelum sesi evaluasi Bulan 2",
            "Periksa riwayat Git untuk memastikan file .env tidak pernah ikut terunggah"
          ],
          deliverables: [
            "Aplikasi TaskFlow atau InternFlow dengan API berjalan stabil pada seluruh fitur CRUD",
            "File cadangan database/taskflow.sql dan koleksi postman/*.json tersedia di repositori",
            "README.md memuat langkah instalasi lokal, contoh .env, dan spesifikasi endpoint",
            "Learning Log mencatat daftar bug yang diperbaiki selama sesi Project Clinic"
          ],
          learningLogFields: [
            "Daftar bug yang ditemukan beserta langkah teknis perbaikannya",
            "Hasil audit keamanan untuk file .env, .gitignore, dan parameterized query",
            "Status kelengkapan cadangan .sql serta dokumentasi pengujian API",
            "Tautan repositori GitHub terbaru yang siap dievaluasi"
          ],
          competencyChecklist: [
            "Mampu mendiagnosis dan memperbaiki kegagalan koneksi MySQL maupun rute API",
            "Mampu menata struktur folder proyek dan menjaga kebersihan riwayat commit Git",
            "Mampu mengekspor cadangan database .sql serta koleksi pengujian Postman",
            "Memahami tata cara pengaturan variabel lingkungan untuk kebutuhan deployment"
          ],
          mentorTip: "Uji kloning repositori Anda ke folder baru dan ikuti langkah di README.md untuk memastikan panduan instalasi akurat."
        }
      }
    ]
  },
  // =========================================================================
  // PERTEMUAN 11 || Presentasi API Postman, Alur Database & Evaluasi Bulan 2
  // =========================================================================
  {
    orderIndex: 11,
    month: 2,
    slug: "pertemuan-11-presentasi-evaluasi-bulan-2",
    code: "P11",
    sessionType: "Presentasi",
    title: "Presentasi API Postman, Alur Database & Evaluasi Bulan 2",
    subtitle: "Mendemonstrasikan endpoint CRUD di Postman, integrasi antarmuka ke MySQL, alur kode backend, serta sepuluh soal evaluasi.",
    summaryText: "Peserta mempresentasikan proyek akhir Bulan 2 secara langsung, menjelaskan alur request hingga SQL, dan menuntaskan evaluasi konsep.",
    taskPrompt: "Demonstrasikan aplikasi TaskFlow atau InternFlow dengan API melalui Postman, browser, dan phpMyAdmin, jelaskan alur kode beserta SQL, lalu jawab 10 soal evaluasi Bulan 2.",
    taskDeliverables: [
      "Demonstrasi langsung atau rekaman pengujian 5 endpoint di Postman dan antarmuka terintegrasi MySQL",
      "Penjelasan alur HTTP request menuju query SQL berparameter pada kode sumber proyek",
      "Repositori GitHub final Bulan 2 dengan struktur rapi dan dokumentasi README.md lengkap",
      "Jawaban tertulis untuk 10 pertanyaan evaluasi Bulan 2 pada Learning Log"
    ],
    accentGradient: "from-rose-500 to-pink-500",
    iconName: "ChartBar",
    slides: [
      {
        slideNumber: 1,
        isSummary: true,
        layoutType: "cover",
        badge: "Bulan 2 • Pertemuan 10 • Presentasi & Evaluasi",
        title: "Presentasi API Postman, Alur Database & Evaluasi Bulan 2",
        subtitle: "Membuktikan penguasaan arsitektur backend, REST API, dan MySQL sebelum memasuki materi Bulan 3.",
        contentJson: {
          eyebrow: "DIGITEK BOOTCAMP || EVALUASI BULAN 2",
          highlights: [
            "Demonstrasi 5 endpoint CRUD melalui Postman dan halaman antarmuka web",
            "Penjelasan alur HTTP request dari browser menuju Express hingga MySQL",
            "Tinjauan metode HTTP, status code, query SQL, dan riwayat commit GitHub",
            "Evaluasi pemahaman melalui 10 pertanyaan inti backend dan database"
          ],
          stats: [
            { label: "Proyek Berjalan", value: "40%" },
            { label: "Kuis Konsep", value: "30%" },
            { label: "Presentasi Kode", value: "20%" },
            { label: "Git & Kerapian Repo", value: "10%" }
          ],
          mentorTip: "Fokuskan presentasi pada alasan teknis di balik kode yang Anda tulis, bukan sekadar membacakan baris program."
        }
      },
      {
        slideNumber: 2,
        isSummary: true,
        layoutType: "summary",
        badge: "Ringkasan Evaluasi",
        title: "Komponen Penilaian & Jembatan Menuju Bulan 3",
        subtitle: "Evaluasi mengukur kemampuan membangun fitur, memahami alur kode, dan menjelaskan arsitektur sistem.",
        contentJson: {
          eyebrow: "RINGKASAN EKSEKUTIF || RUBRIK KELULUSAN",
          highlights: [
            "Komposisi nilai: 40% proyek, 30% kuis, 20% presentasi, dan 10% Git",
            "Batas lulus minimal skor 70 dengan target optimal 80 hingga 100",
            "Penguasaan REST API dan SQL menjadi pondasi materi Nuxt Bulan 3"
          ],
          stats: [
            { label: "Standar Lulus", value: "Minimal 70 (Cukup)" },
            { label: "Target Optimal", value: "80 – 100 (Baik)" },
            { label: "Tahap Berikutnya", value: "Bulan 3: Vue 3, TS & Nuxt" }
          ]
        }
      },
      {
        slideNumber: 3,
        isSummary: true,
        layoutType: "bento",
        badge: "Peta Konsep & Agenda",
        title: "Susunan Sesi Presentasi & Evaluasi Bulan 2",
        subtitle: "Empat tahapan evaluasi selama lima belas menit untuk setiap peserta secara bergiliran.",
        contentJson: {
          eyebrow: "AGENDA PRESENTASI & EVALUASI",
          highlights: [
            "Sesi per peserta mencakup demo Postman, antarmuka, bedah SQL, dan kuis"
          ],
          bentoCards: [
            {
              title: "1. Demo Postman (5 Endpoint)",
              tag: "Tahap 1",
              description: "Menjalankan pengujian GET, POST (201 dan 400), PUT, serta DELETE secara langsung."
            },
            {
              title: "2. Demo Antarmuka & phpMyAdmin",
              tag: "Tahap 2",
              description: "Mengubah data melalui browser, memuat ulang halaman, dan memverifikasi tabel di phpMyAdmin."
            },
            {
              title: "3. Bedah Kode & Riwayat Git",
              tag: "Presentasi (20%)",
              description: "Menjelaskan alur rute Express, koneksi database, query SQL, serta catatan commit GitHub."
            },
            {
              title: "4. Kuis 10 Soal & Modifikasi Kecil",
              tag: "Evaluasi (30%)",
              description: "Menjawab 10 soal konsep inti dan menyelesaikan penyesuaian kode sederhana dari mentor."
            }
          ]
        }
      },
      {
        slideNumber: 4,
        isSummary: false,
        layoutType: "bento",
        badge: "Alur Arsitektur Lengkap",
        title: "Menjelaskan Siklus Request dari Browser hingga MySQL",
        subtitle: "Gunakan kerangka empat langkah ini saat memaparkan cara kerja aplikasi kepada mentor.",
        contentJson: {
          eyebrow: "SIKLUS HIDUP PERMINTAAN DATA",
          highlights: [
            "Uraikan perjalanan satu aksi simpan data dari browser hingga ke MySQL"
          ],
          bentoCards: [
            {
              title: "Langkah 1: Pemicu di Frontend",
              tag: "Browser / UI",
              description: "Event submit formulir memanggil fetch() POST dengan header JSON dan data terformat."
            },
            {
              title: "Langkah 2: Validasi di Express",
              tag: "Backend Server",
              description: "Middleware CORS dan express.json() memproses permintaan lalu router memvalidasi kelengkapan input."
            },
            {
              title: "Langkah 3: Eksekusi SQL Berparameter",
              tag: "Database Layer",
              description: "Connection pool mysql2 mengirim perintah INSERT berparameter tanda tanya ke server MySQL."
            },
            {
              title: "Langkah 4: Respons JSON & Update DOM",
              tag: "Umpan Balik",
              description: "Server membalas status 201 beserta data baru lalu antarmuka memperbarui tampilan daftar."
            }
          ]
        }
      },
      {
        slideNumber: 5,
        isSummary: false,
        layoutType: "bento",
        badge: "Bedah Kode Presentasi",
        title: "Bagian Kode Inti yang Wajib Dikuasai Saat Tanya Jawab",
        subtitle: "Kenali fungsi setiap baris pada modul koneksi database dan file rute utama Anda.",
        contentJson: {
          eyebrow: "PERSIAPAN PENJELASAN KODE",
          highlights: [
            "Kuasai peran server.js, config/db.js, routes/tasks.js, dan skrip frontend/app.js"
          ],
          bentoCards: [
            {
              title: "Konfigurasi Pool & Variabel .env",
              tag: "Keamanan",
              description: "Menjelaskan alasan pemisahan kredensial di .env serta efisiensi penggunaan createPool.",
              code: {
                title: "Koneksi Pool Aman",
                language: "javascript",
                filename: "backend/src/config/db.js",
                snippet: `import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10,
});`
              }
            },
            {
              title: "Query JOIN & Parameter Tanda Tanya",
              tag: "Query Inti",
              description: "Menjelaskan penggabungan tabel melalui LEFT JOIN dan penyaringan aman pada klausa WHERE.",
              code: {
                title: "Query Baca Data + Filter Parameter",
                language: "sql",
                filename: "query-summary.sql",
                snippet: `SELECT t.id, t.title, t.is_done, c.name AS category_name
FROM tasks t
LEFT JOIN categories c ON t.category_id = c.id
WHERE t.is_done = ?
ORDER BY t.id DESC
LIMIT 20;`
              }
            }
          ]
        }
      },
      {
        slideNumber: 6,
        isSummary: false,
        layoutType: "comparison",
        badge: "Good vs Bad Presentation",
        title: "Presentasi Hafalan vs Presentasi Berbasis Pemahaman",
        subtitle: "Kode yang disalin tanpa memahami cara kerjanya tidak dihitung sebagai pencapaian kompetensi.",
        contentJson: {
          eyebrow: "STANDAR EVALUASI KOMPETENSI",
          highlights: [
            "Pemahaman arsitektur memudahkan peserta menyelesaikan modifikasi kode langsung dari mentor"
          ],
          comparison: {
            badTitle: "✕ Indikasi Kurang Menguasai (Hindari)",
            badPoints: [
              "Membaca baris kode tanpa memahami dampak apabila bagian tersebut diubah",
              "Gagal membedakan fungsi metode POST, PUT, dan kode status 201",
              "Bingung menelusuri penyebab respons 400 atau 404 saat diuji Postman"
            ],
            goodTitle: "✓ Indikasi Siap Lulus (Target)",
            goodPoints: [
              "Menguraikan alur data secara runtut dari antarmuka hingga tabel MySQL",
              "Dapat menunjukkan peran parameterized query dalam mencegah celah SQL Injection",
              "Mendemonstrasikan skenario sukses maupun validasi gagal di Postman secara terstruktur"
            ]
          }
        }
      },
      {
        slideNumber: 7,
        isSummary: false,
        layoutType: "practice",
        badge: "70% Demo & Verifikasi",
        title: "Urutan Demonstrasi Wajib Saat Evaluasi Bulan 2",
        subtitle: "Siapkan seluruh aplikasi pendukung sebelum giliran presentasi dimulai agar waktu berjalan efektif.",
        contentJson: {
          eyebrow: "PANDUAN JALANNYA PRESENTASI",
          highlights: [
            "Siapkan XAMPP, Express, Postman, tab Network browser, dan GitHub sebelum maju"
          ],
          practiceSteps: [
            {
              step: 1,
              title: "Demonstrasi 5 Endpoint di Postman",
              description: "Tunjukkan respons GET (200), POST valid (201), POST kosong (400), PUT (200), dan DELETE hingga 404."
            },
            {
              step: 2,
              title: "Demonstrasi Integrasi Antarmuka & Database",
              description: "Tambah serta ubah tugas dari browser, perlihatkan request di tab Network, dan cek barisnya di phpMyAdmin."
            },
            {
              step: 3,
              title: "Penjelasan Kode Backend & Query SQL",
              description: "Paparkan isi config/db.js, routes/tasks.js, relasi kunci tabel, serta penggunaan parameter tanda tanya."
            },
            {
              step: 4,
              title: "Tinjauan Repositori GitHub & Modifikasi Langsung",
              description: "Perlihatkan riwayat commit, file taskflow.sql, README.md, lalu kerjakan penyesuaian singkat dari mentor."
            }
          ]
        }
      },
      {
        slideNumber: 8,
        isSummary: false,
        layoutType: "quiz",
        badge: "Evaluasi Resmi 10 Soal",
        title: "10 Pertanyaan Evaluasi Bulan 2 & Pustaka Pengayaan",
        subtitle: "Sepuluh pertanyaan resmi silabus Bulan 2 untuk menguji kesiapan menuju materi Bulan 3.",
        contentJson: {
          eyebrow: "EVALUASI RESMI BULAN 2 (10 PERTANYAAN)",
          highlights: [
            "Rumuskan jawaban secara mandiri sebelum mencocokkannya dengan kunci konsep berikut"
          ],
          quizItems: [
            {
              question: "1. Apa fungsi utama Node.js dalam pengembangan web?",
              hint: "Ingat peran runtime JavaScript di luar browser.",
              answer: "Node.js adalah runtime environment yang menjalankan kode JavaScript di sisi server. Teknologi ini digunakan untuk membangun layanan backend, REST API, dan koneksi ke database."
            },
            {
              question: "2. Apa perbedaan tanggung jawab antara frontend dan backend?",
              hint: "Bandingkan interaksi layar pengguna dengan pengolahan data di server.",
              answer: "Frontend berjalan di browser untuk menampilkan antarmuka dan menangkap interaksi pengguna. Backend berjalan di server untuk memproses logika bisnis, memvalidasi input, dan mengelola database."
            },
            {
              question: "3. Apa yang dimaksud dengan REST API?",
              hint: "Kaitkan dengan protokol HTTP, URL resource, dan format JSON.",
              answer: "REST API adalah antarmuka komunikasi standar berbasis HTTP antara client dan server. Pertukaran datanya menggunakan URL endpoint, metode HTTP spesifik, serta format payload JSON."
            },
            {
              question: "4. Apa perbedaan penggunaan metode HTTP GET dan POST?",
              hint: "Bedakan pembacaan data dengan pengiriman data baru.",
              answer: "Metode GET digunakan untuk mengambil data dari server tanpa mengubah isi database. Metode POST digunakan untuk mengirim payload di dalam request body guna membuat data baru."
            },
            {
              question: "5. Apa fungsi kode status HTTP pada respons API?",
              hint: "Ingat arti kode 200, 201, 400, 401, 404, dan 500.",
              answer: "Kode status HTTP memberi tahu client hasil pemrosesan suatu request secara terstandar. Contohnya 200 atau 201 menandakan berhasil, 400 input keliru, 404 data tidak ditemukan, dan 500 gangguan server."
            },
            {
              question: "6. Apa perbedaan antara database dan tabel?",
              hint: "Bandingkan wadah penyimpanan aplikasi dengan struktur baris dan kolom.",
              answer: "Database adalah wadah utama yang menampung seluruh koleksi data milik suatu aplikasi. Tabel adalah struktur terorganisasi berisi kolom dan baris untuk menyimpan satu entitas spesifik."
            },
            {
              question: "7. Apa fungsi primary key dan foreign key pada database relasional?",
              hint: "Bedakan penanda identitas unik dengan kolom penghubung relasi.",
              answer: "Primary key memberi penanda unik pada setiap baris agar tidak terjadi duplikasi identitas. Foreign key merujuk ke primary key di tabel lain untuk membentuk relasi dan menjaga integritas data."
            },
            {
              question: "8. Apa perbedaan perintah SQL SELECT, INSERT, UPDATE, dan DELETE?",
              hint: "Petakan keempat perintah tersebut ke dalam siklus CRUD.",
              answer: "SELECT berfungsi membaca data, sedangkan INSERT berfungsi menambahkan baris baru ke tabel. UPDATE mengubah nilai baris tertentu dengan klausa WHERE, dan DELETE menghapus baris dari tabel."
            },
            {
              question: "9. Mengapa eksekusi query database wajib menggunakan parameter?",
              hint: "Pertimbangkan risiko keamanan dari input pengguna.",
              answer: "Penggunaan parameter tanda tanya memisahkan struktur perintah SQL dari nilai input pengguna. Mekanisme ini mensterilkan karakter berbahaya secara otomatis sehingga mencegah serangan SQL Injection."
            },
            {
              question: "10. Bagaimana cara frontend mengambil dan mengirim data ke backend?",
              hint: "Sebutkan fungsi HTTP client bawaan browser modern.",
              answer: "Frontend mengirim permintaan HTTP secara asinkron menggunakan fungsi fetch() dengan async dan await. Setelah melewati izin CORS dan menerima JSON, frontend memperbarui elemen DOM di layar."
            }
          ],
          references: [
            {
              title: "Tutorial NodeJS Dasar - Bahasa Indonesia",
              url: "https://www.youtube.com/watch?v=b39Xqf5iyjo",
              author: "Eko Kurniawan Khannedy (Programmer Zaman Now)",
              category: "Node.js Review",
              lang: "ID",
              type: "Course"
            },
            {
              title: "Tutorial Node.js untuk Pemula",
              url: "https://mfikri.com/artikel/tutorial-nodejs",
              author: "Mfikri",
              category: "Node.js & REST API",
              lang: "ID",
              type: "Book"
            },
            {
              title: "Tutorial MySQL untuk Pemula Hingga Mahir (PDF)",
              url: "https://umardanny.com/tutorial-mysql-untuk-pemula-hingga-mahir-ebook-download-pdf/",
              author: "Umar Danny",
              category: "MySQL Review",
              lang: "ID",
              type: "Book"
            },
            {
              title: "Belajar Dengan Jenius Amazon Web Service & Node.js (PDF)",
              url: "https://github.com/gungunfebrianza/Belajar-Dengan-Jenius-Node.js/releases/download/1.2/Belajar.Dengan.Jenius.Javascript.Node.pdf",
              author: "Gun Gun Febrianza",
              category: "Node.js Lanjut",
              lang: "ID",
              type: "Book"
            },
            {
              title: "Node.js Official Learn Portal",
              url: "https://nodejs.org/en/learn",
              author: "OpenJS Foundation",
              category: "Node.js Docs",
              lang: "EN",
              type: "Docs"
            }
          ],
          weeklyAssignment: {
            week: 10,
            title: "Weekly Assignment 10: Evaluasi Akhir Backend & Persiapan Bulan 3",
            description: "Tindak lanjuti catatan evaluasi mentor pada repositori Anda lalu pelajari pengenalan Vite dan Vue 3 untuk persiapan Pertemuan 11."
          }
        }
      },
      {
        slideNumber: 9,
        isSummary: false,
        layoutType: "task",
        badge: "Deliverable & Learning Log",
        title: "Pengumpulan Evaluasi Final Bulan 2 untuk ACC Mentor",
        subtitle: "Persetujuan pada tahap ini menandai kelulusan Bulan 2 dan membuka akses materi Bulan 3.",
        contentJson: {
          eyebrow: "SYARAT KELULUSAN BULAN 2 & AKSES BULAN 3",
          highlights: [
            "Lampirkan repositori final, bukti demonstrasi, dan jawaban 10 soal evaluasi",
            "Pastikan seluruh catatan revisi saat sesi presentasi telah dituntaskan dengan rapi"
          ],
          deliverables: [
            "Repositori GitHub final Bulan 2 memuat backend, frontend, cadangan .sql, koleksi Postman, dan README.md",
            "Bukti demonstrasi pengujian Postman serta integrasi antarmuka dengan database MySQL",
            "Riwayat commit Git bersih tanpa kebocoran file .env maupun folder node_modules",
            "Learning Log lengkap berisi refleksi Bulan 2 dan rangkuman jawaban 10 soal evaluasi"
          ],
          learningLogFields: [
            "Rangkuman pemahaman atas 10 konsep inti backend, REST API, dan database MySQL",
            "Catatan umpan balik mentor saat sesi demonstrasi beserta tindak lanjutnya",
            "Kompetensi yang sudah dikuasai dengan kuat dan bagian yang perlu diperdalam",
            "Tautan repositori GitHub final Bulan 2 serta dokumentasi pengujian Postman"
          ],
          competencyChecklist: [
            "Mampu mendemonstrasikan kelima endpoint REST API CRUD menggunakan Postman",
            "Mampu menunjukkan integrasi penuh antara antarmuka web dan database MySQL",
            "Mampu menguraikan siklus HTTP request hingga eksekusi query SQL secara runtut",
            "Menjawab minimal tujuh dari sepuluh soal evaluasi konsep Bulan 2 dengan tepat"
          ],
          mentorTip: "Kuasai pemisahan peran frontend, REST API, dan SQL dari Bulan 2 sebagai bekal utama membangun aplikasi fullstack Nuxt di Bulan 3."
        }
      }
    ]
  }
];
const STANDARD_LEARNING_LOG_FIELDS = [
  "Tanggal",
  "Materi",
  "Hal baru yang dipahami",
  "Praktik yang dikerjakan",
  "Kendala yang ditemukan",
  "Cara mengatasi",
  "Hal yang belum dipahami",
  "Tautan repositori / commit"
];
const MONTH_3_MODULES = [
  {
    orderIndex: 12,
    month: 3,
    code: "P12",
    slug: "pertemuan-12-vite-vuejs-3-fundamental",
    sessionType: "Materi 1",
    title: "Vite Build Tool & Vue.js 3 Single File Component",
    subtitle: "Bangun antarmuka modular menggunakan Vite dan Vue.js 3 Composition API berbasis komponen reaktif.",
    summaryText: "Beralih dari manipulasi DOM manual ke komponen Vue 3 SFC dengan ref, v-model, props, dan emit.",
    taskPrompt: "Bangun antarmuka TaskFlow fullstack menggunakan Vite dan Vue 3 yang terhubung ke REST API Bulan 2.",
    taskDeliverables: [
      "Repositori GitHub proyek Vite + Vue 3 tanpa folder node_modules",
      "Minimal 3 komponen SFC (.vue) dengan <script setup>, ref, v-for (:key), v-if, dan v-model",
      "Komunikasi antarkomponen melalui defineProps dan defineEmits tanpa mutasi prop langsung",
      "Integrasi CRUD penuh ke endpoint REST API Bulan 2",
      "Catatan Learning Log lengkap beserta tautan commit terbaru"
    ],
    accentGradient: "from-emerald-500 to-green-600",
    iconName: "Lightning",
    slides: [
      {
        slideNumber: 1,
        isSummary: true,
        layoutType: "cover",
        badge: "Pertemuan 11 • Bulan 3",
        title: "Vite Build Tool & Vue.js 3 Single File Component",
        subtitle: "Pahami perbedaan build tool dan framework untuk membangun antarmuka reaktif.",
        contentJson: {
          eyebrow: "Materi 1 • Bulan 3: Modern Frontend",
          highlights: [
            "Pahami fungsi Vite dan mekanisme Hot Module Replacement (HMR).",
            "Kuasai struktur Single File Component (.vue) dengan <script setup>.",
            "Gunakan ref(), v-if, v-for, v-model, serta komunikasi props dan emit.",
            "Hubungkan komponen Vue 3 ke REST API Bulan 2."
          ],
          stats: [
            { label: "Porsi Sesi", value: "30% Konsep / 70% Praktik" },
            { label: "Stack Utama", value: "Vite + Vue.js 3" },
            { label: "Target Output", value: "TaskFlow UI Modular" },
            { label: "Minggu", value: "Week 11" }
          ]
        }
      },
      {
        slideNumber: 2,
        isSummary: true,
        layoutType: "summary",
        badge: "Ringkasan Eksekutif",
        title: "Mengapa Beralih dari Vanilla JS ke Vite & Vue 3?",
        subtitle: "Manipulasi DOM manual sulit dirawat saat fitur aplikasi terus bertambah.",
        contentJson: {
          eyebrow: "Executive Summary • Evolusi TaskFlow & InternFlow",
          highlights: [
            "Vite menyajikan kode via ES Modules dengan pembaruan HMR instan.",
            "Vue.js 3 menyinkronkan tampilan otomatis setiap kali state berubah.",
            "File .vue menyatukan logika, template, dan CSS terisolasi per fitur.",
            "Fondasi Vue 3 menyiapkan transisi ke Nuxt.js pada Pertemuan 12."
          ],
          stats: [
            { label: "Bulan 1", value: "DOM Manual + localStorage" },
            { label: "Bulan 2", value: "HTML/JS + Express + MySQL" },
            { label: "Bulan 3 (P11)", value: "Vite + Vue 3 SFC" }
          ]
        }
      },
      {
        slideNumber: 3,
        isSummary: true,
        layoutType: "bento",
        badge: "Peta Konsep & Agenda",
        title: "Peta Konsep & Agenda Sesi 30/70",
        subtitle: "Pelajari arsitektur Vite dan Vue 3, lalu bangun komponen TaskFlow secara langsung.",
        contentJson: {
          eyebrow: "Roadmap Pertemuan 11 (2–3 Jam)",
          highlights: [
            "Kenali skrip dev, build, dan preview pada package.json.",
            "Gunakan <script setup> sebagai standar utama Vue 3 dan Nuxt."
          ],
          bentoCards: [
            {
              title: "1. Vite & Build Tool (15%)",
              tag: "30% Konsep",
              description: "Pahami peran dev server, HMR, struktur proyek, dan proses bundling produksi.",
              bullets: [
                "npm run dev untuk server lokal",
                "npm run build ke folder dist/",
                "Vite sebagai tooling, Vue sebagai framework"
              ]
            },
            {
              title: "2. Vue 3 SFC & Reaktivitas (15%)",
              tag: "30% Konsep",
              description: "Pelajari anatomi file .vue, state ref(), direktif template, serta aliran data komponen.",
              bullets: [
                "<script setup> ringkas tanpa boilerplate",
                "Aliran data Props Down, Events Up",
                "Pengenalan composable dan Vue Router"
              ]
            },
            {
              title: "3. Praktik Komponen TaskFlow (50%)",
              tag: "70% Praktik",
              description: "Inisialisasi proyek Vite dan pecah antarmuka menjadi TaskForm, TaskList, serta TaskItem.",
              bullets: [
                "Kelola daftar tugas dengan ref()",
                "Ikat input form memakai v-model",
                "Kirim aksi via defineProps dan defineEmits"
              ]
            },
            {
              title: "4. Integrasi REST API (20%)",
              tag: "70% Praktik",
              description: "Sambungkan komponen Vue ke endpoint CRUD Bulan 2 menggunakan Fetch API.",
              bullets: [
                "Muat data awal saat onMounted",
                "Perbarui status dan hapus tugas"
              ]
            }
          ]
        }
      },
      {
        slideNumber: 4,
        isSummary: false,
        layoutType: "bento",
        badge: "30% Konsep • Analogi",
        title: "Analogi Vite & Aliran Data Komponen Vue 3",
        subtitle: "Pahami pembagian tugas antara bundler, komponen, state induk, dan direktif kondisi.",
        contentJson: {
          eyebrow: "Analogi & Konsep Fundamental",
          highlights: [
            "Vite menyajikan modul kode, sedangkan Vue mengelola logika tampilan.",
            "State milik komponen induk tidak boleh diubah langsung oleh anak."
          ],
          bentoCards: [
            {
              title: "Vite = Dapur Saji Sesuai Pesanan",
              tag: "Build Tool",
              description: "Vite memproses modul saat diminta browser ketika development, lalu membundelnya untuk produksi.",
              bullets: [
                "HMR memperbarui komponen tanpa muat ulang",
                "Build produksi meminifikasi kode ke dist/"
              ]
            },
            {
              title: "Komponen = Blok Modular Independen",
              tag: "SFC (.vue)",
              description: "Pecah halaman besar menjadi Navbar, TaskForm, TaskList, dan TaskItem yang dapat dipakai ulang.",
              bullets: [
                "Satu file .vue memegang satu tanggung jawab",
                "<style scoped> mencegah bentrok aturan CSS"
              ]
            },
            {
              title: "Props Down, Events Up",
              tag: "Komunikasi",
              description: "Induk mengirim data baca-saja lewat props, sedangkan anak melapor perubahan lewat emit.",
              bullets: [
                'Induk ke anak: :task="item"',
                'Anak ke induk: @toggle="handleToggle"'
              ]
            },
            {
              title: "v-if vs v-show",
              tag: "Direktif Kondisi",
              description: "v-if melepas elemen dari DOM, sedangkan v-show hanya mengubah properti CSS display.",
              bullets: [
                "Pakai v-if untuk kondisi jarang berubah",
                "Pakai v-show untuk panel sering dibuka"
              ]
            }
          ]
        }
      },
      {
        slideNumber: 5,
        isSummary: false,
        layoutType: "bento",
        badge: "Bedah Teknis • Sintaks Inti",
        title: "Sintaks Vite, <script setup>, Props/Emit & Composable",
        subtitle: "Pola dasar Composition API Vue 3 yang dipakai hingga proyek Nuxt.js.",
        contentJson: {
          eyebrow: "Sintaks Inti Vite + Vue.js 3",
          highlights: [
            "Akses nilai ref memakai .value di script, otomatis terbuka di template.",
            "Pisahkan logika fetch ke composable useTasks agar komponen tetap ringkas."
          ],
          bentoCards: [
            {
              title: "Skrip Standar Proyek Vite",
              tag: "package.json",
              description: "Konfigurasi skrip untuk menjalankan server HMR lokal dan kompilasi produksi.",
              code: {
                filename: "package.json",
                language: "json",
                snippet: `{
  "name": "taskflow-vue",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": { "vue": "^3.5.0" },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.2.0",
    "vite": "^6.0.0"
  }
}`
              }
            },
            {
              title: "Komponen Induk: ref & v-for",
              tag: "App.vue",
              description: "Kelola state daftar tugas di induk dan render item memakai :key unik.",
              code: {
                filename: "src/App.vue",
                language: "vue",
                snippet: `<script setup>
import { ref, onMounted } from 'vue';
import TaskItem from './components/TaskItem.vue';

const tasks = ref([]);
onMounted(async () => {
  const res = await fetch('http://localhost:3001/api/tasks');
  tasks.value = await res.json();
});
<\/script>
<template>
  <p v-if="!tasks.length">Belum ada tugas.</p>
  <TaskItem v-for="t in tasks" :key="t.id" :task="t" />
</template>`
              }
            },
            {
              title: "Komponen Anak: Props & Emit",
              tag: "TaskItem.vue",
              description: "Terima objek tugas lewat defineProps dan teruskan aksi pengguna lewat defineEmits.",
              code: {
                filename: "src/components/TaskItem.vue",
                language: "vue",
                snippet: `<script setup>
const props = defineProps({ task: { type: Object, required: true } });
const emit = defineEmits(['toggle', 'remove']);
<\/script>
<template>
  <li class="task-row">
    <button @click="emit('toggle', props.task.id)">Ubah Status</button>
    <span>{{ props.task.title }}</span>
    <button @click="emit('remove', props.task.id)">Hapus</button>
  </li>
</template>`
              }
            },
            {
              title: "Composable Logika API",
              tag: "useTasks.js",
              description: "Ekstrak state dan fungsi fetch ke composable agar mudah dipakai ulang.",
              code: {
                filename: "src/composables/useTasks.js",
                language: "javascript",
                snippet: `import { ref } from 'vue';

export function useTasks(apiUrl) {
  const tasks = ref([]);
  async function addTask(title) {
    if (!title.trim()) return;
    await fetch(\`\${apiUrl}/tasks\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
  }
  return { tasks, addTask };
}`
              }
            }
          ]
        }
      },
      {
        slideNumber: 6,
        isSummary: false,
        layoutType: "comparison",
        badge: "Good vs Bad Practice",
        title: "Anti-Pattern Pemula Vue 3 vs Standar Engineer",
        subtitle: "Hindari mutasi props langsung dan pastikan setiap v-for memiliki :key unik.",
        contentJson: {
          eyebrow: "Code Quality Review • Vue.js 3",
          highlights: [
            "Ubah state hanya di komponen pemilik state tersebut.",
            "Hindari indeks array sebagai :key saat item dapat dihapus."
          ],
          comparison: {
            badTitle: "✕ Anti-Pattern Pemula",
            badPoints: [
              "Mengubah properti props langsung dari dalam komponen anak.",
              "Menulis perulangan v-for tanpa atribut :key yang unik.",
              "Menyimpan state dinamis pada variabel biasa tanpa ref()."
            ],
            badCode: {
              filename: "BadTaskItem.vue",
              language: "vue",
              snippet: `<script setup>
const props = defineProps(['task']);
function markDone() {
  // Salah: mutasi prop secara langsung
  props.task.is_done = true;
}
<\/script>
<template>
  <li v-for="item in list" @click="markDone">{{ item.title }}</li>
</template>`
            },
            goodTitle: "✓ Standar Software Engineer",
            goodPoints: [
              "Kirim event via defineEmits agar induk memperbarui state.",
              'Pasang :key="task.id" yang stabil pada setiap elemen v-for.',
              "Bungkus state dinamis memakai ref() dan pisahkan composable."
            ],
            goodCode: {
              filename: "GoodTaskItem.vue",
              language: "vue",
              snippet: `<script setup>
const props = defineProps({ task: { type: Object, required: true } });
const emit = defineEmits(['toggle']);
<\/script>
<template>
  <li @click="emit('toggle', props.task.id)">
    {{ props.task.title }}
  </li>
</template>`
            }
          }
        }
      },
      {
        slideNumber: 7,
        isSummary: false,
        layoutType: "practice",
        badge: "70% Hands-On • PBL",
        title: "Langkah Praktik: Membangun TaskFlow Vue 3 + Vite",
        subtitle: "Bangun antarmuka komponen Vue 3 dan sambungkan ke REST API Bulan 2.",
        contentJson: {
          eyebrow: "70% Praktik Langsung • TaskFlow fullstack",
          highlights: [
            "Pastikan server API Bulan 2 aktif sebelum menguji fetch data.",
            "Struktur components/ dan composables/ ini selaras dengan arsitektur Nuxt."
          ],
          practiceSteps: [
            {
              step: 1,
              title: "Inisialisasi Proyek Vite + Vue",
              description: "Buat proyek menggunakan template resmi Vue, instal dependensi, lalu jalankan server HMR.",
              command: "npm create vite@latest taskflow-vue -- --template vue && cd taskflow-vue && npm install && npm run dev"
            },
            {
              step: 2,
              title: "Susun Komponen & Composable",
              description: "Pisahkan antarmuka menjadi TaskForm.vue, TaskList.vue, TaskItem.vue, serta logika API di useTasks.js.",
              code: `src/
├── components/
│   ├── TaskForm.vue
│   ├── TaskList.vue
│   └── TaskItem.vue
├── composables/
│   └── useTasks.js
└── App.vue`
            },
            {
              step: 3,
              title: "Buat Form Input dengan v-model",
              description: "Ikat input judul memakai v-model, validasi teks kosong, lalu kirim event ke induk.",
              code: `<script setup>
import { ref } from 'vue';
const title = ref('');
const emit = defineEmits(['submit-task']);
function onSubmit() {
  if (!title.value.trim()) return;
  emit('submit-task', title.value.trim());
  title.value = '';
}
<\/script>`
            },
            {
              step: 4,
              title: "Integrasikan CRUD API & Build Produksi",
              description: "Hubungkan operasi GET, POST, PUT, dan DELETE ke API Bulan 2, lalu uji build produksi.",
              command: 'npm run build && git add . && git commit -m "feat: taskflow vue 3 with vite"'
            }
          ]
        }
      },
      {
        slideNumber: 8,
        isSummary: false,
        layoutType: "quiz",
        badge: "Kuis & Referensi",
        title: "Evaluasi Konsep, Referensi & Tugas Mingguan",
        subtitle: "Uji pemahaman konsep Vite dan Vue 3 sebelum mengerjakan tugas mandiri.",
        contentJson: {
          eyebrow: "Evaluasi Pemahaman & Pustaka Terkurasi",
          highlights: [
            "Jelaskan perbedaan Vite dan Vue dengan kalimat Anda sendiri.",
            "Pahami alasan aliran data satu arah pada komunikasi komponen."
          ],
          quizItems: [
            {
              question: "Apa perbedaan peran antara Vite dan Vue.js 3?",
              hint: "Bandingkan alat pengemas kode dengan pengatur tampilan.",
              answer: "Vite adalah build tool dan dev server penyedia HMR serta bundling produksi. Vue.js 3 adalah framework untuk membangun antarmuka berbasis komponen reaktif."
            },
            {
              question: "Mengapa ref() membutuhkan .value di <script setup>, tetapi tidak di <template>?",
              hint: "Perhatikan cara kerja kompilator template Vue.",
              answer: "Di JavaScript, ref membungkus nilai dalam objek { value } agar perubahan terdeteksi. Di <template>, Vue membuka pembungkus tersebut secara otomatis."
            },
            {
              question: "Kapan Anda memilih v-if dibandingkan v-show?",
              hint: "Tinjau frekuensi perubahan tampilan elemen.",
              answer: "Gunakan v-if saat kondisi jarang berubah karena elemen dilepas dari DOM. Gunakan v-show untuk elemen yang sering dibuka-tutup via CSS."
            },
            {
              question: "Mengapa komponen anak menggunakan defineEmits alih-alih mengubah props langsung?",
              hint: "Prinsip satu sumber kebenaran state.",
              answer: "Aliran data satu arah menjaga state tetap terpusat di komponen induk sehingga sumber perubahan data mudah dilacak."
            }
          ],
          references: [
            {
              title: "Belajar Vue.js",
              url: "https://variancode.com/belajar-vue-js/",
              author: "Varian Hermianto",
              category: "Vue.js (Free Programming Books ID)",
              lang: "ID",
              type: "Book"
            },
            {
              title: "Dokumentasi Vue Bahasa Indonesia",
              url: "https://github.com/vuejs-id/docs",
              author: "Vue.js Indonesia",
              category: "Vue.js (Free Programming Books ID)",
              lang: "ID",
              type: "Book"
            },
            {
              title: "Vue 3 Dasar & Composition API",
              url: "https://youtube.com/playlist?list=PLnQvfeVegcJbn7ZDOUNbRN25obY4htSlB",
              author: "Nusendra Hanggarawan",
              category: "Vue.js (Free Courses ID)",
              lang: "ID",
              type: "Course"
            },
            {
              title: "Tutorial Vue.js dengan API Bahasa Indonesia",
              url: "https://www.youtube.com/playlist?list=PLIan8aHxsPj3a7oLHb2a8pw8IHBq45WYu",
              author: "Wahidev Academy",
              category: "Vue.js + API (Free Courses ID)",
              lang: "ID",
              type: "Course"
            },
            {
              title: "Vite Guide (Official)",
              url: "https://vite.dev/guide/",
              author: "Vite Team",
              category: "Build Tool",
              lang: "EN",
              type: "Docs"
            },
            {
              title: "Vue.js Official Guide",
              url: "https://vuejs.org/guide/introduction.html",
              author: "Vue Core Team",
              category: "Frontend Framework",
              lang: "EN",
              type: "Docs"
            },
            {
              title: "Vue Router Documentation",
              url: "https://router.vuejs.org/",
              author: "Vue Core Team",
              category: "SPA Routing",
              lang: "EN",
              type: "Docs"
            },
            {
              title: "Vue.js To-Do List Tutorial (PBL)",
              url: "https://www.youtube.com/watch?v=78tNYZUS-ps",
              author: "Project Based Learning",
              category: "Project-Based Learning",
              lang: "EN",
              type: "PBL"
            }
          ],
          weeklyAssignment: {
            week: 11,
            title: "Membuat Proyek Vue Menggunakan Vite",
            description: "Bangun minimal 3 komponen Vue 3 dengan fitur tambah tugas, filter status, dan unggah ke GitHub."
          }
        }
      },
      {
        slideNumber: 9,
        isSummary: false,
        layoutType: "task",
        badge: "Task Pertemuan 11",
        title: "Deliverable Wajib & Pengumpulan Learning Log",
        subtitle: "Kumpulkan tugas Pertemuan 11 untuk membuka materi TypeScript dan Nuxt.js.",
        contentJson: {
          eyebrow: "Submission Checklist • Pertemuan 11",
          highlights: [
            "Pastikan folder node_modules masuk ke dalam file .gitignore.",
            "Lampirkan tangkapan layar antarmuka yang terhubung ke REST API."
          ],
          deliverables: [
            "Tautan repositori GitHub proyek Vite + Vue 3 bersih tanpa node_modules",
            "Minimal 3 komponen SFC (.vue) memakai <script setup>, ref, v-model, v-for (:key), v-if, props, dan emit",
            "Fitur tambah, tampil, ubah status, dan hapus tugas terhubung ke API Bulan 2",
            "Catatan Learning Log lengkap sesuai 8 poin standar program"
          ],
          learningLogFields: STANDARD_LEARNING_LOG_FIELDS,
          mentorTip: "Kuasai aliran props, emit, dan ref() bawaan Vue 3 sebelum menggunakan pustaka state eksternal seperti Pinia."
        }
      }
    ]
  },
  {
    orderIndex: 13,
    month: 3,
    code: "P13",
    slug: "pertemuan-13-typescript-nuxtjs-server-api",
    sessionType: "Materi 2",
    title: "TypeScript Fundamental & Nuxt.js Server API (Nitro)",
    subtitle: "Terapkan keamanan tipe data TypeScript dan bangun aplikasi fullstack menggunakan Nuxt.js serta Nitro Server API.",
    summaryText: "Pelajari kontrak data TypeScript (interface, union, Promise<T>) serta arsitektur halaman, useFetch, dan server/api di Nuxt.js.",
    taskPrompt: "Buat proyek Nuxt.js bertipe TypeScript lengkap dengan kontrak data bersama, halaman useFetch, serta endpoint GET dan POST.",
    taskDeliverables: [
      "Repositori GitHub proyek Nuxt.js dengan pemeriksaan TypeScript aktif",
      "File shared/types/task.ts berisi interface Task, CreateTaskPayload, dan ApiResponse<T>",
      "Endpoint server/api/tasks.get.ts dan server/api/tasks.post.ts memakai defineEventHandler",
      "Halaman app/pages/index.vue menggunakan useFetch dan konfigurasi runtimeConfig di nuxt.config.ts",
      "Catatan Learning Log beserta bukti pengujian endpoint melalui Postman"
    ],
    accentGradient: "from-cyan-600 to-teal-500",
    iconName: "BracketsCurly",
    slides: [
      {
        slideNumber: 1,
        isSummary: true,
        layoutType: "cover",
        badge: "Pertemuan 12 • Bulan 3",
        title: "TypeScript Fundamental & Nuxt.js Server API (Nitro)",
        subtitle: "Satukan antarmuka Vue dan REST API server dalam satu proyek bertipe aman.",
        contentJson: {
          eyebrow: "Materi 2 • Bulan 3: Type-Safe Fullstack",
          highlights: [
            "Kuasai tipe primitif, interface, union, optional, dan Promise<T> di TypeScript.",
            "Pahami struktur folder app/, file-based routing, dan pengambilan data useFetch.",
            "Bangun endpoint REST API internal di server/api/ menggunakan mesin Nitro.",
            "Amankan kredensial server menggunakan konfigurasi runtimeConfig dan file .env."
          ],
          stats: [
            { label: "Bagian A", value: "TypeScript Fundamental" },
            { label: "Bagian B", value: "Nuxt + Nitro Server API" },
            { label: "Data Fetching", value: "useFetch<T>" },
            { label: "Minggu", value: "Week 12" }
          ]
        }
      },
      {
        slideNumber: 2,
        isSummary: true,
        layoutType: "summary",
        badge: "Ringkasan Eksekutif",
        title: "Mengapa TypeScript & Nuxt.js Menjadi Standar Industri?",
        subtitle: "TypeScript mendeteksi salah ketik properti sebelum kode dijalankan di peramban pengguna.",
        contentJson: {
          eyebrow: "Executive Summary • Fullstack Terpadu",
          highlights: [
            "Kontrak tipe data menyamakan struktur objek antara frontend dan backend.",
            "Nuxt.js menggabungkan render antarmuka Vue 3 dengan server API Nitro.",
            "Folder server/api/ menggantikan kebutuhan server Express terpisah pada proyek terpadu.",
            "Satu interface di shared/types/ dipakai bersama oleh halaman dan API."
          ],
          stats: [
            { label: "JavaScript", value: "Galat Muncul Saat Jalan" },
            { label: "TypeScript", value: "Galat Dicegah Saat Tulis" },
            { label: "Nuxt + Nitro", value: "UI + API Satu Proyek" }
          ]
        }
      },
      {
        slideNumber: 3,
        isSummary: true,
        layoutType: "bento",
        badge: "Peta Konsep & Agenda",
        title: "Peta Konsep & Agenda Sesi 30/70",
        subtitle: "Susun kontrak tipe data terlebih dahulu sebelum membangun halaman dan endpoint Nuxt.",
        contentJson: {
          eyebrow: "Roadmap Pertemuan 12 (2–3 Jam)",
          highlights: [
            "Mulai dari model data Task sederhana agar alur fullstack jelas.",
            "Uji setiap endpoint API sebelum mengintegrasikannya ke komponen halaman."
          ],
          bentoCards: [
            {
              title: "1. Dasar TypeScript (15%)",
              tag: "30% Konsep",
              description: "Pelajari anotasi tipe, interface, union literal, properti opsional, dan fungsi async.",
              bullets: [
                "interface Task untuk struktur objek",
                "Union literal untuk status terbatas",
                "Promise<Task[]> untuk fungsi async"
              ]
            },
            {
              title: "2. Arsitektur Nuxt & Nitro (15%)",
              tag: "30% Konsep",
              description: "Kenali pemisahan folder app/ untuk klien dan server/ untuk endpoint backend.",
              bullets: [
                "app/pages/ otomatis menjadi rute halaman",
                "server/api/ otomatis menjadi endpoint REST",
                "runtimeConfig memisahkan variabel publik dan rahasia"
              ]
            },
            {
              title: "3. Praktik Kontrak & API (40%)",
              tag: "70% Praktik",
              description: "Buat shared/types/task.ts serta handler GET dan POST memakai defineEventHandler.",
              bullets: [
                "Validasi body request dengan readBody<T>",
                "Uji respons JSON lewat Postman"
              ]
            },
            {
              title: "4. Integrasi Halaman UI (30%)",
              tag: "70% Praktik",
              description: "Konsumsi endpoint internal dari app/pages/index.vue menggunakan composable useFetch bertipe.",
              bullets: [
                "Tipe respons terbaca otomatis di template",
                "Panggil refresh() setelah menambah data"
              ]
            }
          ]
        }
      },
      {
        slideNumber: 4,
        isSummary: false,
        layoutType: "bento",
        badge: "30% Konsep • Analogi",
        title: "Analogi TypeScript & Arsitektur Nitro di Nuxt.js",
        subtitle: "Pahami batas eksekusi antara kode peramban dan kode server di Nuxt.",
        contentJson: {
          eyebrow: "Analogi & Konsep Fundamental",
          highlights: [
            "TypeScript memvalidasi tipe saat kompilasi lalu menghasilkan JavaScript murni.",
            "Kode di dalam server/api/ tidak pernah dikirim ke peramban klien."
          ],
          bentoCards: [
            {
              title: "TypeScript = Formulir Bervalidasi",
              tag: "Static Typing",
              description: "Setiap kolom memiliki aturan tipe jelas sehingga data salah tertolak sejak penulisan kode.",
              bullets: [
                "Inferensi tipe otomatis dari nilai awal",
                "Tanda ? menandai properti opsional"
              ]
            },
            {
              title: "interface vs type",
              tag: "Data Modeling",
              description: "Gunakan interface untuk struktur model objek dan type untuk union atau alias.",
              bullets: [
                'Union: "todo" | "in_progress" | "done"',
                "Generic: ApiResponse<T> untuk pembungkus JSON"
              ]
            },
            {
              title: "Nuxt = Ruang Makan & Dapur",
              tag: "Fullstack",
              description: "Folder app/ melayani tampilan pengguna, sedangkan server/ Nitro mengolah logika dan database.",
              bullets: [
                "Rute otomatis berdasarkan nama file",
                "Impor otomatis ref, computed, dan useFetch"
              ]
            },
            {
              title: "Keamanan runtimeConfig",
              tag: "Security",
              description: "Hanya properti di dalam runtimeConfig.public yang boleh diakses oleh peramban.",
              bullets: [
                "Kredensial database tetap aman di server",
                "Variabel NUXT_* terpetakan otomatis dari .env"
              ]
            }
          ]
        }
      },
      {
        slideNumber: 5,
        isSummary: false,
        layoutType: "bento",
        badge: "Bedah Teknis • Sintaks Inti",
        title: "Sintaks Kontrak TypeScript, Nitro Handler & useFetch",
        subtitle: "Pola kode standar untuk berbagi tipe data antara server Nitro dan halaman Vue.",
        contentJson: {
          eyebrow: "Bedah Teknis Bagian A & B",
          highlights: [
            "Akhiran nama file menentukan metode HTTP seperti tasks.get.ts dan tasks.post.ts.",
            "Gunakan useFetch saat pemuatan halaman dan $fetch saat aksi tombol."
          ],
          bentoCards: [
            {
              title: "Kontrak Tipe Bersama",
              tag: "shared/types/task.ts",
              description: "Satukan definisi model, payload input, dan pembungkus respons API.",
              code: {
                filename: "shared/types/task.ts",
                language: "typescript",
                snippet: `export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}`
              }
            },
            {
              title: "Fungsi Async & Promise<T>",
              tag: "useTaskHelper.ts",
              description: "Tentukan tipe kembalian Promise<T> agar hasil await tervalidasi otomatis.",
              code: {
                filename: "app/composables/useTaskHelper.ts",
                language: "typescript",
                snippet: `import type { ApiResponse, Task } from '../../shared/types/task';

export async function loadTasks(): Promise<Task[]> {
  const res = await $fetch<ApiResponse<Task[]>>('/api/tasks');
  return res.data;
}

export function countDone(tasks: Task[]): number {
  return tasks.filter((t) => t.status === 'done').length;
}`
              }
            },
            {
              title: "Endpoint Server Nitro",
              tag: "server/api/tasks.get.ts",
              description: "Kembalikan respons JSON bertipe sesuai kontrak ApiResponse dari sisi server.",
              code: {
                filename: "server/api/tasks.get.ts",
                language: "typescript",
                snippet: `import type { ApiResponse, Task } from '../../shared/types/task';

export default defineEventHandler(async (event): Promise<ApiResponse<Task[]>> => {
  const config = useRuntimeConfig(event);
  const tasks: Task[] = [
    { id: 1, title: \`Belajar \${config.public.appName}\`, status: 'done' },
  ];
  return { success: true, data: tasks };
});`
              }
            },
            {
              title: "Pengambilan Data SSR",
              tag: "app/pages/index.vue",
              description: "Panggil endpoint internal dengan useFetch untuk mendukung render sisi server.",
              code: {
                filename: "app/pages/index.vue",
                language: "vue",
                snippet: `<script setup lang="ts">
import type { ApiResponse, Task } from '../../shared/types/task';
const { data, pending, refresh } = await useFetch<ApiResponse<Task[]>>('/api/tasks');
<\/script>
<template>
  <p v-if="pending">Memuat data...</p>
  <ul v-else>
    <li v-for="t in data?.data ?? []" :key="t.id">{{ t.title }}</li>
  </ul>
  <button @click="refresh()">Muat Ulang</button>
</template>`
              }
            }
          ]
        }
      },
      {
        slideNumber: 6,
        isSummary: false,
        layoutType: "comparison",
        badge: "Good vs Bad Practice",
        title: "Anti-Pattern TypeScript & Nuxt vs Arsitektur Aman",
        subtitle: "Hindari penggunaan tipe any dan jangan pernah mengakses database dari komponen Vue.",
        contentJson: {
          eyebrow: "Code Quality Review • TypeScript & Nuxt",
          highlights: [
            "Tipe any mematikan pemeriksaan tipe dan menyembunyikan potensi bug.",
            "Koneksi database wajib terisolasi di dalam folder server/."
          ],
          comparison: {
            badTitle: "✕ Anti-Pattern Berbahaya",
            badPoints: [
              "Memakai tipe any sehingga kesalahan properti lolos dari kompilasi.",
              "Mengimpor driver database atau kredensial rahasia di komponen .vue.",
              "Memanggil $fetch langsung di setup hingga memicu request ganda."
            ],
            badCode: {
              filename: "BadPage.vue",
              language: "vue",
              snippet: `<script setup lang="ts">
// Salah: akses database dari klien dan pemakaian tipe any
import mysql from 'mysql2/promise';
const db: any = await mysql.createConnection({ password: '123' });
const tasks: any = await db.query('SELECT * FROM tasks');
<\/script>`
            },
            goodTitle: "✓ Standar Software Engineer",
            goodPoints: [
              "Bagikan interface ketat melalui folder shared/types/ untuk seluruh lapisan.",
              "Simpan kredensial database di runtimeConfig khusus sisi server.",
              "Gunakan useFetch pada setup halaman agar sinkron saat SSR."
            ],
            goodCode: {
              filename: "nuxt.config.ts",
              language: "typescript",
              snippet: `export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  runtimeConfig: {
    dbHost: process.env.NUXT_DB_HOST || '127.0.0.1',
    dbUser: process.env.NUXT_DB_USER || 'root',
    dbPassword: process.env.NUXT_DB_PASSWORD || '',
    dbName: process.env.NUXT_DB_NAME || 'taskflow_db',
    public: { appName: 'TaskFlow Nuxt' },
  },
});`
            }
          }
        }
      },
      {
        slideNumber: 7,
        isSummary: false,
        layoutType: "practice",
        badge: "70% Hands-On • PBL",
        title: "Langkah Praktik: Proyek Nuxt + TypeScript + Server API",
        subtitle: "Siapkan fondasi proyek Nuxt fullstack sebelum dihubungkan ke MySQL pada Pertemuan 13.",
        contentJson: {
          eyebrow: "70% Praktik Langsung • Nuxt.js & Nitro",
          highlights: [
            "Pisahkan folder app/, server/api/, dan shared/types/ sejak awal proyek.",
            "Pastikan pemeriksaan npx nuxi typecheck lulus tanpa pesan galat."
          ],
          practiceSteps: [
            {
              step: 1,
              title: "Inisialisasi Proyek Nuxt Baru",
              description: "Buat proyek menggunakan CLI resmi Nuxt, instal paket, dan nyalakan server lokal.",
              command: "npx nuxi@latest init taskflow-nuxt && cd taskflow-nuxt && npm install && npm run dev"
            },
            {
              step: 2,
              title: "Susun Struktur Direktori Fullstack",
              description: "Siapkan direktori halaman, komponen, server API, serta kontrak tipe bersama.",
              code: `taskflow-nuxt/
├── app/
│   ├── components/
│   └── pages/index.vue
├── server/
│   ├── api/tasks.get.ts
│   └── api/tasks.post.ts
├── shared/types/task.ts
└── nuxt.config.ts`
            },
            {
              step: 3,
              title: "Buat Kontrak Tipe & Handler POST",
              description: "Definisikan interface di shared/types/task.ts lalu validasi input pada tasks.post.ts.",
              code: `import type { CreateTaskPayload, Task } from '../../shared/types/task';

export default defineEventHandler(async (event) => {
  const body = await readBody<CreateTaskPayload>(event);
  if (!body?.title?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Judul wajib diisi' });
  }
  const task: Task = { id: Date.now(), title: body.title.trim(), status: 'todo' };
  return { success: true, data: task };
});`
            },
            {
              step: 4,
              title: "Tampilkan Data dengan useFetch & Typecheck",
              description: "Hubungkan halaman utama ke /api/tasks, uji via Postman, lalu jalankan validasi tipe.",
              command: "npx nuxi typecheck"
            }
          ]
        }
      },
      {
        slideNumber: 8,
        isSummary: false,
        layoutType: "quiz",
        badge: "Kuis & Referensi",
        title: "Kuis TypeScript + Nuxt, Referensi & Tugas Mingguan",
        subtitle: "Evaluasi penguasaan kontrak tipe TypeScript dan cara kerja server API Nitro.",
        contentJson: {
          eyebrow: "Evaluasi Pemahaman & Pustaka Terkurasi",
          highlights: [
            "Jalankan npx nuxi typecheck hingga bersih sebelum mengunggah tugas.",
            "Pelajari dokumentasi resmi Nuxt untuk pendalaman fitur server Nitro."
          ],
          quizItems: [
            {
              question: "Apa perbedaan utama antara interface dan type di TypeScript?",
              hint: "Bandingkan struktur objek dengan kombinasi union literal.",
              answer: 'Interface dirancang untuk mendefinisikan bentuk objek yang dapat diperluas. Type mendukung union literal (seperti "todo" | "done"), alias primitif, serta tuple.'
            },
            {
              question: "Apa fungsi mesin Nitro di Nuxt.js dan bagaimana metode HTTP dibedakan?",
              hint: "Perhatikan akhiran nama file di dalam server/api/.",
              answer: "Nitro menjalankan render sisi server dan endpoint REST API. Metode HTTP dibedakan lewat akhiran nama file seperti tasks.get.ts dan tasks.post.ts."
            },
            {
              question: "Mengapa kredensial database ditaruh di runtimeConfig, bukan di runtimeConfig.public?",
              hint: "Ingat batas akses antara server dan peramban.",
              answer: "Properti di luar runtimeConfig.public hanya tersedia di sisi server sehingga kata sandi database tidak terkirim ke peramban klien."
            },
            {
              question: "Apa arti deklarasi async function getTasks(): Promise<Task[]>?",
              hint: "Tinjau nilai kembalian fungsi asynchronous.",
              answer: "Fungsi async tersebut mengembalikan objek Promise yang menghasilkan array bertipe Task[] saat di-await."
            }
          ],
          references: [
            {
              title: "TypeScript untuk Pemula, Bagian 1: Memulai",
              url: "https://code.tutsplus.com/id/tutorials/typescript-for-beginners-getting-started--cms-29329",
              author: "Tutsplus",
              category: "TypeScript (Free Programming Books ID)",
              lang: "ID",
              type: "Book"
            },
            {
              title: "Tutorial TypeScript Dasar",
              url: "https://www.youtube.com/watch?v=C_C64faSO4c",
              author: "Eko Kurniawan Khannedy (Programmer Zaman Now)",
              category: "TypeScript (Free Courses ID)",
              lang: "ID",
              type: "Course"
            },
            {
              title: "TypeScript Dasar & OOP TypeScript",
              url: "https://www.youtube.com/playlist?list=PLnQvfeVegcJbjCnML6FdusK-rl-oDRMXJ",
              author: "Nusendra Hanggarawan",
              category: "TypeScript (Free Courses ID)",
              lang: "ID",
              type: "Course"
            },
            {
              title: "Belajar TypeScript Dasar Bahasa Indonesia",
              url: "https://www.youtube.com/playlist?list=PLiuHSY2x882Z4NSJGNq0eB9Fz6tIx-CgO",
              author: "Imam Farisi",
              category: "TypeScript (Free Courses ID)",
              lang: "ID",
              type: "Course"
            },
            {
              title: "TypeScript Handbook (Official)",
              url: "https://www.typescriptlang.org/docs/handbook/intro.html",
              author: "Microsoft TypeScript",
              category: "TypeScript Official",
              lang: "EN",
              type: "Docs"
            },
            {
              title: "Nuxt Documentation",
              url: "https://nuxt.com/docs",
              author: "Nuxt Core Team",
              category: "Nuxt.js Official",
              lang: "EN",
              type: "Docs"
            },
            {
              title: "Nuxt || Server Directory (Nitro)",
              url: "https://nuxt.com/docs/guide/directory-structure/server",
              author: "Nuxt Core Team",
              category: "Nuxt Server API",
              lang: "EN",
              type: "Docs"
            },
            {
              title: "Nuxt || Data Fetching (useFetch)",
              url: "https://nuxt.com/docs/getting-started/data-fetching",
              author: "Nuxt Core Team",
              category: "Nuxt Data Fetching",
              lang: "EN",
              type: "Docs"
            }
          ],
          weeklyAssignment: {
            week: 12,
            title: "Latihan TypeScript dan Endpoint Nuxt",
            description: "Buat kontrak tipe TypeScript lalu integrasikan dengan 1 halaman Nuxt dan 2 endpoint server/api."
          }
        }
      },
      {
        slideNumber: 9,
        isSummary: false,
        layoutType: "task",
        badge: "Task Pertemuan 12",
        title: "Deliverable Wajib & Pengumpulan Learning Log",
        subtitle: "Kumpulkan proyek Nuxt bertipe aman sebagai fondasi sesi Capstone Pertemuan 13.",
        contentJson: {
          eyebrow: "Submission Checklist • Pertemuan 12",
          highlights: [
            "Masukkan file .env ke .gitignore dan sertakan template .env.example.",
            "Pastikan seluruh model data bebas dari penggunaan tipe any."
          ],
          deliverables: [
            "Repositori GitHub proyek Nuxt.js dengan hasil npx nuxi typecheck bebas galat",
            "File shared/types/task.ts berisi model tipe lengkap tanpa tipe any",
            "Endpoint server/api/tasks.get.ts dan tasks.post.ts yang merespons JSON terstruktur",
            "Halaman app/pages/index.vue yang memakai useFetch serta konfigurasi runtimeConfig",
            "Catatan Learning Log lengkap beserta tautan commit GitHub"
          ],
          learningLogFields: STANDARD_LEARNING_LOG_FIELDS,
          mentorTip: "Perlakukan garis merah TypeScript sebagai pemeriksa dini yang mencegah kesalahan tipe data lolos ke produksi."
        }
      }
    ]
  },
  {
    orderIndex: 14,
    month: 3,
    code: "P14",
    slug: "pertemuan-14-praktik-capstone-nuxt-mysql",
    sessionType: "Praktik",
    title: "Praktik Capstone: TaskFlow & InternFlow Fullstack Nuxt + MySQL",
    subtitle: "Hubungkan Nuxt Server API ke database MySQL menggunakan connection pool, parameterized query, dan validasi input.",
    summaryText: "Bangun aplikasi capstone CRUD penuh dengan antarmuka Vue, API Nitro, dan penyimpanan MySQL yang aman.",
    taskPrompt: "Selesaikan aplikasi CRUD fullstack Nuxt.js + TypeScript + MySQL lengkap dengan skema SQL dan dokumentasi README.",
    taskDeliverables: [
      "Aplikasi CRUD fullstack Nuxt + TypeScript + MySQL berjalan utuh (List, Add, Edit, Complete, Delete)",
      "Koneksi MySQL di server/utils/db.ts memakai mysql2/promise dan runtimeConfig",
      "Seluruh query SQL menggunakan parameterized query (?) serta validasi status HTTP",
      "File database/schema.sql dan README.md berisi panduan menjalankan proyek",
      "Catatan Learning Log progres capstone beserta tautan repositori GitHub"
    ],
    accentGradient: "from-blue-600 to-indigo-600",
    iconName: "Stack",
    slides: [
      {
        slideNumber: 1,
        isSummary: true,
        layoutType: "cover",
        badge: "Pertemuan 13 • Bulan 3",
        title: "Praktik Capstone: TaskFlow & InternFlow Fullstack Nuxt + MySQL",
        subtitle: "Integrasikan antarmuka Vue 3 dan TypeScript dengan database relasional MySQL melalui Nitro.",
        contentJson: {
          eyebrow: "Sesi Praktik Capstone • 70% Hands-On Coding",
          highlights: [
            "Bangun fitur ringkasan dashboard, tampil, tambah, ubah, selesai, dan hapus.",
            "Hubungkan MySQL lokal secara eksklusif melalui folder server/api/ Nuxt.",
            "Terapkan parameterized query (?), variabel environment, serta penanganan galat HTTP.",
            "Tambahkan filter status atau pencarian sebagai target pengayaan opsional."
          ],
          stats: [
            { label: "Target CRUD", value: "5 Endpoint REST" },
            { label: "Database", value: "MySQL (mysql2/promise)" },
            { label: "Keamanan", value: "Parameterized Query ?" },
            { label: "Minggu", value: "Week 13" }
          ]
        }
      },
      {
        slideNumber: 2,
        isSummary: true,
        layoutType: "summary",
        badge: "Ringkasan Eksekutif",
        title: "Evolusi Arsitektur 3 Bulan: Dari Statis ke Fullstack",
        subtitle: "Lihat perkembangan arsitektur TaskFlow dari penyimpanan peramban hingga aplikasi fullstack terpadu.",
        contentJson: {
          eyebrow: "Executive Summary • TaskFlow tahap awal -> dengan API -> fullstack",
          highlights: [
            "Bulan 1: HTML, CSS, dan Vanilla JS dengan penyimpanan localStorage.",
            "Bulan 2: Frontend terpisah berkomunikasi dengan Express.js dan database MySQL.",
            "Bulan 3: Halaman Vue, API Nitro, dan MySQL dalam satu proyek.",
            "Fokus utama adalah alur CRUD fullstack yang stabil dan aman."
          ],
          stats: [
            { label: "TaskFlow tahap awal", value: "Vanilla + localStorage" },
            { label: "TaskFlow dengan API", value: "Express + MySQL" },
            { label: "TaskFlow fullstack", value: "Fullstack Nuxt + TS + MySQL" }
          ]
        }
      },
      {
        slideNumber: 3,
        isSummary: true,
        layoutType: "bento",
        badge: "Peta Fitur & Ketentuan",
        title: "Spesifikasi Fitur Minimum & Ketentuan Teknis Capstone",
        subtitle: "Penuhi seluruh syarat inti sebelum mengerjakan fitur tambahan.",
        contentJson: {
          eyebrow: "Spesifikasi Proyek Capstone Bulan 3",
          highlights: [
            "Pisahkan rute halaman, komponen UI, handler API, dan utilitas database.",
            "Seluruh ketentuan teknis ini akan diaudit pada sesi Code Review."
          ],
          bentoCards: [
            {
              title: "Fitur Minimum Wajib",
              tag: "Core CRUD",
              description: "Seluruh operasi utama TaskFlow berjalan utuh dengan data tersimpan permanen di MySQL.",
              bullets: [
                "Dashboard ringkasan jumlah dan status tugas",
                "Tambah, ubah, tandai selesai, dan hapus",
                "Tampilan responsif di desktop maupun ponsel"
              ]
            },
            {
              title: "Ketentuan Teknis Wajib",
              tag: "Engineering Rules",
              description: "Standar keamanan dan kualitas kode yang wajib dipenuhi pada repositori capstone.",
              bullets: [
                "TypeScript aktif pada model dan API",
                "Konfigurasi kredensial melalui .env dan runtimeConfig",
                "Parameterized query (?) serta validasi status HTTP"
              ]
            },
            {
              title: "Target Pengayaan Opsional",
              tag: "Stretch Goal",
              description: "Fitur tambahan setelah seluruh fungsi CRUD utama berjalan stabil tanpa bug.",
              bullets: [
                "Filter daftar berdasarkan status tugas",
                "Pencarian kata kunci judul tugas",
                "Relasi tabel pengguna atau login dasar"
              ]
            },
            {
              title: "Kelengkapan Paket Proyek",
              tag: "Deliverable",
              description: "Siapkan repositori agar orang lain dapat menjalankan ulang proyek dengan mudah.",
              bullets: [
                "Kode sumber bersih di GitHub",
                "File skema dan data awal .sql",
                "Panduan instalasi lengkap pada README.md"
              ]
            }
          ]
        }
      },
      {
        slideNumber: 4,
        isSummary: false,
        layoutType: "bento",
        badge: "Konsep Alur Sistem",
        title: "Alur Request Fullstack & Keamanan Lapisan Database",
        subtitle: "Pahami kerja connection pool, perlindungan SQL Injection, dan kode status HTTP.",
        contentJson: {
          eyebrow: "Arsitektur Fullstack Nuxt + MySQL",
          highlights: [
            "Hanya server Nitro yang boleh memegang kredensial dan koneksi MySQL.",
            "Gunakan kode status HTTP akurat agar klien mudah menangani respons."
          ],
          bentoCards: [
            {
              title: "Connection Pool Efisien",
              tag: "server/utils/db.ts",
              description: "mysql2.createPool() menyediakan jalur koneksi siap pakai tanpa membuka koneksi baru tiap request.",
              bullets: [
                "Satu instance pool untuk seluruh aplikasi",
                "Dipakai bersama oleh semua handler API"
              ]
            },
            {
              title: "Parameterized Query Aman",
              tag: "Anti SQL Injection",
              description: "Tanda tanya (?) memisahkan perintah SQL dari teks input pengguna berbahaya.",
              bullets: [
                "Gunakan db.execute(sql, [params]) secara konsisten",
                "Jangan gabungkan input memakai template string"
              ]
            },
            {
              title: "Validasi & Kode HTTP",
              tag: "Error Handling",
              description: "Kirim status 400 untuk input salah, 404 jika kosong, dan 500 saat gagal.",
              bullets: [
                "Lempar galat via createError({ statusCode })",
                "Sembunyikan detail internal SQL dari pengguna"
              ]
            },
            {
              title: "Kompatibilitas MySQL & MariaDB",
              tag: "XAMPP",
              description: "Driver mysql2 kompatibel dengan MySQL maupun MariaDB bawaan XAMPP pada port 3306.",
              bullets: [
                "Simpan cadangan ekspor .sql secara berkala"
              ]
            }
          ]
        }
      },
      {
        slideNumber: 5,
        isSummary: false,
        layoutType: "bento",
        badge: "Bedah Teknis • Fullstack Code",
        title: "Implementasi Pool MySQL, Endpoint CRUD & Skema SQL",
        subtitle: "Referensi kode produksi untuk koneksi database, validasi input, dan rute dinamis.",
        contentJson: {
          eyebrow: "Referensi Implementasi Capstone",
          highlights: [
            "Instal paket driver database terlebih dahulu menggunakan perintah npm install mysql2.",
            "Gunakan tipe ResultSetHeader agar hasil operasi tulis terketik rapi."
          ],
          bentoCards: [
            {
              title: "1. Utilitas Connection Pool",
              tag: "server/utils/db.ts",
              description: "Buat singleton pool MySQL yang membaca kredensial dari runtimeConfig server.",
              code: {
                filename: "server/utils/db.ts",
                language: "typescript",
                snippet: `import mysql from 'mysql2/promise';
let pool: mysql.Pool | null = null;

export function getDbPool(): mysql.Pool {
  if (!pool) {
    const cfg = useRuntimeConfig();
    pool = mysql.createPool({
      host: cfg.dbHost, port: Number(cfg.dbPort || 3306),
      user: cfg.dbUser, password: cfg.dbPassword, database: cfg.dbName,
    });
  }
  return pool;
}`
              }
            },
            {
              title: "2. Endpoint POST Bervalidasi",
              tag: "server/api/tasks.post.ts",
              description: "Validasi panjang judul sebelum menjalankan query INSERT berparameter.",
              code: {
                filename: "server/api/tasks.post.ts",
                language: "typescript",
                snippet: `import type { ResultSetHeader } from 'mysql2/promise';
import type { CreateTaskPayload } from '../../shared/types/task';

export default defineEventHandler(async (event) => {
  const body = await readBody<CreateTaskPayload>(event);
  const title = body?.title?.trim() ?? '';
  if (title.length < 3) {
    throw createError({ statusCode: 400, statusMessage: 'Judul minimal 3 karakter' });
  }
  const [res] = await getDbPool().execute<ResultSetHeader>(
    'INSERT INTO tasks (title, description, status) VALUES (?, ?, ?)',
    [title, body.description?.trim() ?? null, 'todo'],
  );
  return { success: true, id: res.insertId };
});`
              }
            },
            {
              title: "3. Rute Dinamis PUT [id]",
              tag: "server/api/tasks/[id].put.ts",
              description: "Ambil parameter ID rute dan periksa affectedRows untuk mendeteksi data kosong.",
              code: {
                filename: "server/api/tasks/[id].put.ts",
                language: "typescript",
                snippet: `import type { ResultSetHeader } from 'mysql2/promise';
import type { TaskStatus } from '../../../shared/types/task';

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'));
  if (!Number.isInteger(id) || id <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'ID tidak valid' });
  }
  const body = await readBody<{ title?: string; status?: TaskStatus }>(event);
  const [res] = await getDbPool().execute<ResultSetHeader>(
    'UPDATE tasks SET title = COALESCE(?, title), status = COALESCE(?, status) WHERE id = ?',
    [body.title?.trim() ?? null, body.status ?? null, id],
  );
  if (res.affectedRows === 0) throw createError({ statusCode: 404, statusMessage: 'Data kosong' });
  return { success: true };
});`
              }
            },
            {
              title: "4. Skema Tabel Tasks",
              tag: "database/schema.sql",
              description: "Definisi tabel relasional dengan kolom status bertipe ENUM dan pencatat waktu otomatis.",
              code: {
                filename: "database/schema.sql",
                language: "sql",
                snippet: `CREATE DATABASE IF NOT EXISTS taskflow_db;
USE taskflow_db;

CREATE TABLE IF NOT EXISTS tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(180) NOT NULL,
  description TEXT NULL,
  status ENUM('todo', 'in_progress', 'done') NOT NULL DEFAULT 'todo',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);`
              }
            }
          ]
        }
      },
      {
        slideNumber: 6,
        isSummary: false,
        layoutType: "comparison",
        badge: "Good vs Bad Practice",
        title: "Query Rawan Retas vs Implementasi Aman",
        subtitle: "Bandingkan penggabungan string SQL berbahaya dengan query berparameter dan validasi ketat.",
        contentJson: {
          eyebrow: "Security & Reliability Check • Capstone",
          highlights: [
            "Penggabungan string pada SQL membuka celah keamanan SQL Injection.",
            "Periksa selalu nilai affectedRows saat mengubah atau menghapus baris."
          ],
          comparison: {
            badTitle: "✕ Rawan SQL Injection",
            badPoints: [
              "Menyisipkan input pengguna langsung ke dalam template string SQL.",
              "Melewatkan validasi format ID dan pemeriksaan keberadaan baris data.",
              "Mengekspos pesan galat mentah MySQL langsung ke antarmuka klien."
            ],
            badCode: {
              filename: "BadHandler.ts",
              language: "typescript",
              snippet: `// Bahaya: penggabungan string membuka celah SQL Injection
const id = getRouterParam(event, 'id');
const body = await readBody(event);
await db.query(
  \`UPDATE tasks SET title = '\${body.title}' WHERE id = \${id}\`,
);
return { ok: true };`
            },
            goodTitle: "✓ Parameterized Query & Validasi",
            goodPoints: [
              "Memakai placeholder ? pada setiap pemanggilan db.execute(sql, params).",
              "Memvalidasi ID numerik dan payload sebelum menjalankan query database.",
              "Mengembalikan status HTTP 400 atau 404 dengan pesan terukur."
            ],
            goodCode: {
              filename: "GoodHandler.ts",
              language: "typescript",
              snippet: `const id = Number(getRouterParam(event, 'id'));
if (!Number.isInteger(id) || id <= 0) {
  throw createError({ statusCode: 400, statusMessage: 'ID tidak valid' });
}
const [res] = await db.execute<ResultSetHeader>(
  'DELETE FROM tasks WHERE id = ?',
  [id],
);
if (res.affectedRows === 0) {
  throw createError({ statusCode: 404, statusMessage: 'Data tidak ditemukan' });
}`
            }
          }
        }
      },
      {
        slideNumber: 7,
        isSummary: false,
        layoutType: "practice",
        badge: "70% Hands-On • Capstone",
        title: "Langkah Praktik: Merakit Capstone TaskFlow Fullstack",
        subtitle: "Sambungkan antarmuka Vue, API Nitro, dan database MySQL secara bertahap.",
        contentJson: {
          eyebrow: "70% Praktik Langsung • Fullstack Nuxt + MySQL",
          highlights: [
            "Uji setiap endpoint dengan Postman sebelum menyambungkannya ke antarmuka.",
            "Lakukan commit Git bertahap setiap kali satu fitur selesai."
          ],
          practiceSteps: [
            {
              step: 1,
              title: "Siapkan Database MySQL & Driver mysql2",
              description: "Aktifkan MySQL di XAMPP, impor database/schema.sql lewat phpMyAdmin, lalu instal paket mysql2.",
              command: "npm install mysql2"
            },
            {
              step: 2,
              title: "Konfigurasi .env & Utilitas Pool Database",
              description: "Isi kredensial NUXT_DB_* di file .env, petakan pada runtimeConfig, lalu buat server/utils/db.ts.",
              code: `NUXT_DB_HOST=127.0.0.1
NUXT_DB_PORT=3306
NUXT_DB_USER=root
NUXT_DB_PASSWORD=
NUXT_DB_NAME=taskflow_db`
            },
            {
              step: 3,
              title: "Bangun Endpoint CRUD & Antarmuka Dashboard",
              description: "Selesaikan kelima endpoint di server/api/ lalu hubungkan kartu ringkasan, form, dan daftar di index.vue.",
              code: `server/
├── api/
│   ├── tasks.get.ts
│   ├── tasks.post.ts
│   └── tasks/
│       ├── [id].put.ts
│       └── [id].delete.ts
└── utils/db.ts`
            },
            {
              step: 4,
              title: "Tulis Dokumentasi README & Validasi Akhir",
              description: "Dokumentasikan langkah instalasi lokal di README.md, jalankan pemeriksaan tipe, lalu simpan commit.",
              command: 'npx nuxi typecheck && git add . && git commit -m "feat: fullstack nuxt mysql capstone"'
            }
          ]
        }
      },
      {
        slideNumber: 8,
        isSummary: false,
        layoutType: "quiz",
        badge: "Kuis & Referensi",
        title: "Kuis Arsitektur Fullstack, Referensi & Tugas Mingguan",
        subtitle: "Pastikan Anda memahami alur data dari komponen halaman hingga tabel MySQL.",
        contentJson: {
          eyebrow: "Evaluasi Pemahaman & Pustaka Terkurasi",
          highlights: [
            "Kemampuan menjelaskan alur kode jauh lebih bernilai daripada sekadar fitur jadi."
          ],
          quizItems: [
            {
              question: "Mengapa aplikasi Nuxt wajib mengakses MySQL melalui server/api/, bukan dari halaman Vue?",
              hint: "Tinjau keamanan kredensial dan lingkungan eksekusi peramban.",
              answer: "Peramban tidak mendukung koneksi TCP langsung ke MySQL dan akan membocorkan kata sandi database. Folder server/api/ berjalan aman di sisi server Nitro."
            },
            {
              question: 'Apa kegunaan placeholder ? pada db.execute("SELECT * FROM tasks WHERE id = ?", [id])?',
              hint: "Perlindungan keamanan query.",
              answer: "Parameterized query memisahkan perintah SQL dari nilai input pengguna sehingga mencegah serangan SQL Injection."
            },
            {
              question: "Bagaimana handler API mengetahui bahwa ID tugas yang diubah atau dihapus tidak ditemukan?",
              hint: "Periksa properti pada ResultSetHeader.",
              answer: "Handler memeriksa kondisi result.affectedRows === 0 setelah query dijalankan, lalu mengembalikan status 404 melalui createError."
            },
            {
              question: "Apa perbedaan penggunaan useFetch dan $fetch pada aplikasi Nuxt?",
              hint: "Bandingkan pemuatan awal halaman dengan aksi klik pengguna.",
              answer: "Gunakan useFetch pada setup halaman agar data termuat sinkron saat SSR. Gunakan $fetch di dalam fungsi event seperti submit form POST, PUT, atau DELETE."
            }
          ],
          references: [
            {
              title: "Nuxt Documentation",
              url: "https://nuxt.com/docs",
              author: "Nuxt Core Team",
              category: "Fullstack Framework",
              lang: "EN",
              type: "Docs"
            },
            {
              title: "Nuxt Server API (Nitro)",
              url: "https://nuxt.com/docs/guide/directory-structure/server",
              author: "Nuxt Core Team",
              category: "Backend Nitro",
              lang: "EN",
              type: "Docs"
            },
            {
              title: "MySQL Documentation",
              url: "https://dev.mysql.com/doc/",
              author: "Oracle MySQL",
              category: "Relational Database",
              lang: "EN",
              type: "Docs"
            },
            {
              title: "Tutorial MySQL untuk Pemula Hingga Mahir",
              url: "https://umardanny.com/tutorial-mysql-untuk-pemula-hingga-mahir-ebook-download-pdf/",
              author: "Umar Danny",
              category: "MySQL (Free Programming Books ID)",
              lang: "ID",
              type: "Book"
            },
            {
              title: "MySQL Tutorial Bahasa Indonesia",
              url: "https://www.youtube.com/playlist?list=PL-CtdCApEFH_P2_2zR6pvDublvpD3fF6W",
              author: "Eko Kurniawan Khannedy (Programmer Zaman Now)",
              category: "MySQL (Free Courses ID)",
              lang: "ID",
              type: "Course"
            },
            {
              title: "Full Stack MEVN Application (Pembanding Arsitektur)",
              url: "https://medium.com/@anaida07/mevn-stack-application-part-1-3a27b61dcae0",
              author: "Project Based Learning",
              category: "Project-Based Learning",
              lang: "EN",
              type: "PBL"
            }
          ],
          weeklyAssignment: {
            week: 13,
            title: "Menyelesaikan Fitur Capstone Fullstack",
            description: "Tuntaskan seluruh fitur CRUD TaskFlow beserta skema .sql dan README.md di repositori GitHub."
          }
        }
      },
      {
        slideNumber: 9,
        isSummary: false,
        layoutType: "task",
        badge: "Task Pertemuan 13",
        title: "Deliverable Wajib & Pengumpulan Learning Log",
        subtitle: "Pastikan aplikasi capstone berjalan stabil di lokal sebelum dipresentasikan pada Pertemuan 14.",
        contentJson: {
          eyebrow: "Submission Checklist • Pertemuan 13",
          highlights: [
            "Pastikan fitur CRUD inti bebas bug sebelum menambah fitur pengayaan."
          ],
          deliverables: [
            "Repositori GitHub lengkap (app/, server/api/, shared/types/, database/schema.sql, README.md)",
            "Bukti seluruh operasi CRUD tersimpan permanen di database MySQL",
            "Bukti pengujian API dan validasi status 400/404 melalui Postman atau DevTools",
            "Catatan Learning Log berisi kendala teknis SQL atau TypeScript yang diselesaikan"
          ],
          learningLogFields: STANDARD_LEARNING_LOG_FIELDS,
          mentorTip: "Periksa log terminal tempat npm run dev berjalan saat muncul galat 500 agar pesan asli Nitro dan MySQL langsung terlihat."
        }
      }
    ]
  },
  {
    orderIndex: 15,
    month: 3,
    code: "P15",
    slug: "pertemuan-15-presentasi-code-review-deployment",
    sessionType: "Presentasi",
    title: "Presentasi Fullstack, Code Review & Deployment Railway",
    subtitle: "Presentasikan arsitektur capstone, tindak lanjuti catatan code review mentor, dan latih proses deployment ke Railway.",
    summaryText: "Sesi demo proyek fullstack, peninjauan kualitas kode dan GitHub, serta latihan deployment cloud beserta cadangan .sql.",
    taskPrompt: "Selesaikan perbaikan hasil code review mentor, siapkan cadangan database .sql, dan verifikasi build produksi atau deploy Railway.",
    taskDeliverables: [
      "Commit perbaikan hasil Code Review pada repositori GitHub TaskFlow fullstack",
      "File cadangan database .sql hasil ekspor phpMyAdmin atau mysqldump",
      "File .env.example dan README.md berisi panduan instalasi serta deployment",
      "Tautan deployment Railway atau bukti uji build produksi lokal beserta Postman",
      "Catatan Learning Log berisi daftar perbaikan code review yang dituntaskan"
    ],
    accentGradient: "from-purple-600 to-fuchsia-600",
    iconName: "CloudArrowUp",
    slides: [
      {
        slideNumber: 1,
        isSummary: true,
        layoutType: "cover",
        badge: "Pertemuan 14 • Bulan 3",
        title: "Presentasi Fullstack, Code Review & Deployment Railway",
        subtitle: "Uji kesiapan proyek bersama mentor, rapikan kode, dan pelajari alur deployment.",
        contentJson: {
          eyebrow: "Sesi Presentasi, Code Review & Project Clinic",
          highlights: [
            "Demonstrasikan operasi CRUD penuh serta alur Halaman menuju MySQL.",
            "Tinjau kualitas TypeScript, keamanan query SQL, serta kerapian commit GitHub.",
            "Pelajari konfigurasi environment produksi dan latihan deploy ke Railway.",
            "Siapkan cadangan ekspor .sql sebelum memasuki Evaluasi Akhir Pertemuan 15."
          ],
          stats: [
            { label: "Aktivitas 1", value: "Demo & Bedah Arsitektur" },
            { label: "Aktivitas 2", value: "Code Review Mentor" },
            { label: "Aktivitas 3", value: "Deploy Railway / Build" },
            { label: "Minggu", value: "Week 14" }
          ]
        }
      },
      {
        slideNumber: 2,
        isSummary: true,
        layoutType: "summary",
        badge: "Ringkasan Eksekutif",
        title: "Dari Lokal Menuju Aplikasi Siap Dipresentasikan",
        subtitle: "Aplikasi siap kerja menuntut kode terstruktur, konfigurasi rapi, dan penjelasan alur lugas.",
        contentJson: {
          eyebrow: "Executive Summary • Kualitas & Deployment",
          highlights: [
            "Presentasi melatih kemampuan menjelaskan alasan teknis di balik struktur kode.",
            "Code review mempercepat peningkatan standar keamanan dan keterbacaan kode.",
            "Deployment melatih pengelolaan environment variable, build produksi, dan database jarak jauh.",
            "Jika kuota Railway terbatas, verifikasi lokal dan file .sql tetap dinilai."
          ],
          stats: [
            { label: "Bobot Presentasi", value: "20% Penilaian" },
            { label: "Bobot Git & Repo", value: "10% Penilaian" },
            { label: "Deploy Scope", value: "Latihan Terukur" }
          ]
        }
      },
      {
        slideNumber: 3,
        isSummary: true,
        layoutType: "bento",
        badge: "Peta Aktivitas Sesi",
        title: "Agenda Presentasi, Code Review & Strategi Deployment",
        subtitle: "Empat tahapan evaluasi proyek capstone sebelum memasuki sesi penutupan akhir.",
        contentJson: {
          eyebrow: "Alur Sesi Pertemuan 14",
          highlights: [
            "Pastikan seluruh fitur berjalan stabil di localhost sebelum memulai deployment cloud."
          ],
          bentoCards: [
            {
              title: "1. Demo & Penjelasan Alur",
              tag: "Presentasi",
              description: "Tunjukkan operasi CRUD penuh sambil menjelaskan peran folder app/, server/api/, dan shared/types/.",
              bullets: [
                "Demo tambah, ubah, selesai, dan hapus",
                "Tunjukkan perubahan baris di tabel MySQL"
              ]
            },
            {
              title: "2. Audit Kode & GitHub",
              tag: "Code Quality",
              description: "Periksa keamanan query, penanganan galat, kelengkapan .gitignore, serta kualitas dokumentasi README.",
              bullets: [
                "Pastikan tidak ada kredensial rahasia bocor",
                "Catat poin revisi untuk Pertemuan 15"
              ]
            },
            {
              title: "3. Deployment Latihan Railway",
              tag: "Cloud Hosting",
              description: "Hubungkan layanan Nuxt dan MySQL di Railway memakai konfigurasi variabel environment.",
              bullets: [
                "Isi NUXT_DB_* pada menu Variables Railway",
                "Gunakan 1 proyek latihan secara efisien"
              ]
            },
            {
              title: "4. Mitigasi Kuota & Backup",
              tag: "Risk Mitigation",
              description: "Antisipasi batas kredit akun percobaan Railway dengan menyimpan cadangan database lokal.",
              bullets: [
                "Periksa kebijakan kuota di railway.com/pricing",
                "Wajib simpan ekspor .sql dari phpMyAdmin"
              ]
            }
          ]
        }
      },
      {
        slideNumber: 4,
        isSummary: false,
        layoutType: "bento",
        badge: "Konsep Environment",
        title: "Perbedaan Localhost vs Produksi & Strategi Railway",
        subtitle: "Pahami perbedaan kompilasi produksi, keamanan kredensial, dan rencana cadangan kuota cloud.",
        contentJson: {
          eyebrow: "Analogi & Prinsip Deployment",
          highlights: [
            "Selalu siapkan cadangan database .sql dan skenario verifikasi lokal."
          ],
          bentoCards: [
            {
              title: "Development vs Production",
              tag: "Build & Runtime",
              description: "Localhost memakai npm run dev, sedangkan server cloud menjalankan hasil kompilasi npm run build.",
              bullets: [
                "Nitro menghasilkan bundel mandiri di .output/",
                "Perintah jalan: node .output/server/index.mjs"
              ]
            },
            {
              title: "Kerahasiaan File .env",
              tag: "Credential Safety",
              description: "Simpan hanya nama variabel kosong di .env.example, lalu isi nilai aslinya di dashboard Railway.",
              bullets: [
                "Periksa git status sebelum melakukan commit",
                "Blokir file .env melalui aturan .gitignore"
              ]
            },
            {
              title: "Kebijakan Kredit Railway",
              tag: "Catatan Silabus",
              description: "Akun percobaan Railway memiliki kuota terbatas sehingga layanan latihan perlu dimatikan seusai demo.",
              bullets: [
                "Deployment latihan dimulai pada Pertemuan 14",
                "Pantau pemakaian resource di dashboard Railway"
              ]
            },
            {
              title: "Rencana Cadangan Evaluasi",
              tag: "Backup Plan",
              description: "Apabila kredit cloud habis, penilaian dilakukan penuh melalui build lokal, Postman, dan file .sql.",
              bullets: [
                "Fokus penilaian terletak pada pemahaman kode"
              ]
            }
          ]
        }
      },
      {
        slideNumber: 5,
        isSummary: false,
        layoutType: "bento",
        badge: "Bedah Teknis • Review & Deploy",
        title: "Checklist Code Review & Konfigurasi Produksi Nuxt",
        subtitle: "Periksa kesiapan build lokal, variabel environment, dan standar kualitas repositori.",
        contentJson: {
          eyebrow: "Audit Teknis & Deployment Config",
          highlights: [
            "Uji npm run build lokal untuk mendeteksi galat kompilasi lebih awal."
          ],
          bentoCards: [
            {
              title: "1. Uji Typecheck & Build Lokal",
              tag: "Pre-Deploy Check",
              description: "Pastikan TypeScript dan bundler Nitro berhasil membangun bundel produksi tanpa galat.",
              code: {
                filename: "terminal-check.sh",
                language: "bash",
                snippet: `# Periksa tipe data TypeScript
npx nuxi typecheck

# Bangun dan jalankan bundel produksi lokal
npm run build
node .output/server/index.mjs`
              }
            },
            {
              title: "2. Template .env.example",
              tag: "Repo Hygiene",
              description: "Dokumentasikan nama variabel yang dibutuhkan aplikasi tanpa menyertakan kata sandi asli.",
              code: {
                filename: ".env.example",
                language: "dotenv",
                snippet: `NUXT_DB_HOST=127.0.0.1
NUXT_DB_PORT=3306
NUXT_DB_USER=root
NUXT_DB_PASSWORD=
NUXT_DB_NAME=taskflow_db`
              }
            },
            {
              title: "3. Variabel Referensi Railway",
              tag: "Railway Env",
              description: "Hubungkan layanan aplikasi Nuxt ke layanan MySQL di Railway menggunakan variabel referensi.",
              code: {
                filename: "railway-variables.txt",
                language: "dotenv",
                snippet: `NITRO_HOST=0.0.0.0
NUXT_DB_HOST=\${{MySQL.MYSQLHOST}}
NUXT_DB_PORT=\${{MySQL.MYSQLPORT}}
NUXT_DB_USER=\${{MySQL.MYSQLUSER}}
NUXT_DB_PASSWORD=\${{MySQL.MYSQLPASSWORD}}
NUXT_DB_NAME=\${{MySQL.MYSQLDATABASE}}`
              }
            },
            {
              title: "4. Fokus Audit Code Review",
              tag: "Review Rubric",
              description: "Enam aspek teknis utama yang diperiksa mentor pada repositori peserta.",
              bullets: [
                "Struktur folder rapi dan bebas tipe any",
                "Query SQL berparameter (?) dan validasi HTTP",
                "Riwayat Git bersih dilengkapi panduan README.md"
              ]
            }
          ]
        }
      },
      {
        slideNumber: 6,
        isSummary: false,
        layoutType: "comparison",
        badge: "Good vs Bad Practice",
        title: "Kebiasaan Git & Deployment Buruk vs Profesional",
        subtitle: "Jaga kebersihan repositori dari file rahasia dan selalu siapkan cadangan database.",
        contentJson: {
          eyebrow: "Code Review & Deployment Hygiene",
          highlights: [
            "Kata sandi yang telanjur terunggah ke repositori publik wajib segera diganti."
          ],
          comparison: {
            badTitle: "✕ Kebiasaan Buruk Saat Deploy",
            badPoints: [
              "Mengunggah file .env serta folder node_modules ke repositori GitHub.",
              "Mencoba deploy ke cloud saat aplikasi lokal masih mengalami galat.",
              "Menulis pesan commit acak tanpa panduan README dan cadangan .sql."
            ],
            badCode: {
              filename: "bad-git-workflow.sh",
              language: "bash",
              snippet: `# Salah: tanpa .gitignore, file .env ikut terunggah ke publik
git add .
git commit -m "update dikit"
git push origin main`
            },
            goodTitle: "✓ Standar Siap Review",
            goodPoints: [
              "Memblokir node_modules, .nuxt, .output, dan .env melalui file .gitignore.",
              "Memastikan typecheck dan npm run build lulus sebelum deploy.",
              "Menyertakan pesan commit jelas, README lengkap, serta cadangan .sql."
            ],
            goodCode: {
              filename: ".gitignore",
              language: "text",
              snippet: `node_modules
.nuxt
.output
.env
*.log`
            }
          }
        }
      },
      {
        slideNumber: 7,
        isSummary: false,
        layoutType: "practice",
        badge: "70% Hands-On • Review & Deploy",
        title: "Langkah Praktik: Perbaikan Review, Backup .sql & Deploy",
        subtitle: "Jalankan audit tipe, ekspor database, uji build produksi, dan deploy terukur.",
        contentJson: {
          eyebrow: "70% Praktik Langsung • Project Clinic & Deployment",
          highlights: [
            "Ikuti urutan kerja: audit lokal, ekspor .sql, uji build, lalu deploy."
          ],
          practiceSteps: [
            {
              step: 1,
              title: "Tuntaskan Revisi Code Review & Typecheck",
              description: "Rapikan struktur folder, hapus kode debug yang tidak diperlukan, dan pastikan pemeriksaan TypeScript bersih.",
              command: "npx nuxi typecheck"
            },
            {
              step: 2,
              title: "Ekspor Cadangan Database .sql",
              description: "Ekspor skema beserta data contoh dari phpMyAdmin ke dalam file database/taskflow_backup.sql."
            },
            {
              step: 3,
              title: "Verifikasi Build Produksi di Lokal",
              description: "Bangun aplikasi Nuxt dan uji jalankan bundel server Nitro secara lokal.",
              command: "npm run build && node .output/server/index.mjs"
            },
            {
              step: 4,
              title: "Deploy ke Railway & Unggah Dokumentasi Final",
              description: "Hubungkan repositori ke Railway dengan variabel NUXT_DB_* (atau gunakan skenario lokal), lalu perbarui README.md.",
              command: 'git add . && git commit -m "chore: apply code review fixes and deploy config" && git push'
            }
          ]
        }
      },
      {
        slideNumber: 8,
        isSummary: false,
        layoutType: "quiz",
        badge: "Kuis & Referensi",
        title: "Kuis Deployment, Referensi & Tugas Mingguan",
        subtitle: "Uji kesiapan teknis menghadapi pertanyaan environment produksi dan peninjauan kode.",
        contentJson: {
          eyebrow: "Evaluasi Pemahaman & Pustaka Terkurasi",
          highlights: [
            "Siapkan penjelasan ringkas alur aplikasi untuk Evaluasi Akhir Pertemuan 15."
          ],
          quizItems: [
            {
              question: "Mengapa kita wajib memverifikasi aplikasi di localhost dan mengekspor file .sql sebelum deploy?",
              hint: "Pertimbangkan kecepatan pelacakan bug dan batas kuota cloud.",
              answer: "Pelacakan bug jauh lebih cepat dilakukan di lokal, sedangkan file .sql menjadi cadangan skema dan data apabila kuota layanan cloud habis."
            },
            {
              question: "Apa fungsi file .env.example jika file .env dilarang masuk ke GitHub?",
              hint: "Dokumentasi konfigurasi untuk pengembang lain.",
              answer: "File .env.example mencatat daftar nama variabel environment yang dibutuhkan proyek tanpa mengekspos nilai kata sandi asli."
            },
            {
              question: "Apa saja empat aspek utama yang perlu dijelaskan saat presentasi aplikasi fullstack Nuxt?",
              hint: "Urutkan dari struktur proyek hingga penyimpanan data.",
              answer: "Jelaskan struktur folder Nuxt, alur request halaman ke server/api, eksekusi query MySQL berparameter, serta penerapan kontrak TypeScript."
            },
            {
              question: "File mana yang dijalankan server produksi setelah perintah npm run build selesai?",
              hint: "Perhatikan hasil kompilasi mesin Nitro.",
              answer: "Server menjalankan titik masuk bundel Nitro pada file .output/server/index.mjs."
            }
          ],
          references: [
            {
              title: "Railway Documentation",
              url: "https://docs.railway.com/",
              author: "Railway Team",
              category: "Cloud Deployment",
              lang: "EN",
              type: "Docs"
            },
            {
              title: "Railway Pricing & Quota Policy",
              url: "https://railway.com/pricing",
              author: "Railway Team",
              category: "Deployment Cost Policy",
              lang: "EN",
              type: "Docs"
            },
            {
              title: "Nuxt Deployment & Nitro Output",
              url: "https://nuxt.com/docs",
              author: "Nuxt Core Team",
              category: "Fullstack Deployment",
              lang: "EN",
              type: "Docs"
            },
            {
              title: "Postman Learning Center",
              url: "https://learning.postman.com/",
              author: "Postman",
              category: "API Testing",
              lang: "EN",
              type: "Docs"
            },
            {
              title: "Pro Git 2nd Edition (Bahasa Indonesia)",
              url: "https://git-scm.com/book/id/",
              author: "Scott Chacon & Ben Straub",
              category: "Git (Free Programming Books ID)",
              lang: "ID",
              type: "Book"
            },
            {
              title: "Belajar Git untuk Pemula",
              url: "https://github.com/petanikode/belajar-git",
              author: "Ahmad Muhardian (Petani Kode)",
              category: "Git (Free Programming Books ID)",
              lang: "ID",
              type: "Book"
            }
          ],
          weeklyAssignment: {
            week: 14,
            title: "Code Review dan Penyempurnaan Proyek",
            description: "Tuntaskan seluruh catatan revisi mentor, rapikan README.md, dan pastikan cadangan file .sql siap diuji."
          }
        }
      },
      {
        slideNumber: 9,
        isSummary: false,
        layoutType: "task",
        badge: "Task Pertemuan 14",
        title: "Deliverable Wajib & Pengumpulan Learning Log",
        subtitle: "Tuntaskan revisi code review sebelum mengikuti Evaluasi Akhir pada Pertemuan 15.",
        contentJson: {
          eyebrow: "Submission Checklist • Pertemuan 14",
          highlights: [
            "Pastikan proyek bersih dari galat sebelum sesi Live Coding akhir."
          ],
          deliverables: [
            "Commit perbaikan pasca-review pada repositori GitHub",
            "File .env.example, .gitignore yang tepat, serta README.md lengkap",
            "File cadangan database .sql berisi skema dan data contoh",
            "Tautan deployment Railway aktif atau tangkapan layar build lokal dan Postman",
            "Catatan Learning Log berisi rincian revisi yang diselesaikan"
          ],
          learningLogFields: STANDARD_LEARNING_LOG_FIELDS,
          mentorTip: "Jadikan setiap catatan code review sebagai umpan balik objektif untuk meningkatkan standar kerapian dan keamanan kode Anda."
        }
      }
    ]
  },
  {
    orderIndex: 16,
    month: 3,
    code: "P16",
    slug: "pertemuan-16-evaluasi-akhir-live-coding",
    sessionType: "Evaluasi Akhir",
    title: "Evaluasi Akhir, Live Coding, Checklist Kompetensi & Penutupan",
    subtitle: "Uji penguasaan materi tiga bulan melalui kuis lintas modul, live coding, dan verifikasi 35 kompetensi.",
    summaryText: "Sesi evaluasi komprehensif berisi tantangan live coding Nuxt + MySQL, penilaian akhir, serta peta belajar lanjutan.",
    taskPrompt: "Kumpulkan repositori final TaskFlow fullstack, hasil live coding, evaluasi mandiri 35 kompetensi, dan rencana belajar pasca-bootcamp.",
    taskDeliverables: [
      "Repositori final GitHub TaskFlow fullstack lengkap dengan README.md dan database .sql",
      "Penyelesaian 4 tantangan Live Coding bersama mentor",
      "Evaluasi mandiri 35 Checklist Kompetensi Akhir (Frontend, Backend/DB, Modern Fullstack)",
      "Refleksi pembelajaran 3 bulan dan pilihan 3 topik prioritas pasca-bootcamp",
      "Catatan Learning Log penutupan program"
    ],
    accentGradient: "from-orange-500 to-red-500",
    iconName: "GraduationCap",
    slides: [
      {
        slideNumber: 1,
        isSummary: true,
        layoutType: "cover",
        badge: "Pertemuan 15 • Evaluasi Akhir",
        title: "Evaluasi Akhir, Live Coding, Checklist Kompetensi & Penutupan",
        subtitle: "Buktikan penguasaan fullstack tiga bulan dan susun langkah pengembangan karier berikutnya.",
        contentJson: {
          eyebrow: "Sesi Final • PT Digital Teknologi Perkasa",
          highlights: [
            "Uji konsep lintas bulan: Frontend dasar, MySQL, dan Fullstack Nuxt.",
            "Selesaikan 4 tantangan Live Coding: halaman, endpoint, alur SQL, dan debugging.",
            "Verifikasi ketuntasan 35 Checklist Kompetensi bersama mentor.",
            "Terima evaluasi akhir serta panduan 10 topik pengembangan pasca-program."
          ],
          stats: [
            { label: "Durasi Program", value: "3 Bulan • 15 Pertemuan" },
            { label: "Target Level", value: "Advanced Beginner" },
            { label: "Checklist", value: "35 Kompetensi" },
            { label: "Minggu", value: "Week 15" }
          ]
        }
      },
      {
        slideNumber: 2,
        isSummary: true,
        layoutType: "summary",
        badge: "Ringkasan Eksekutif",
        title: "Prinsip Kelulusan & Standar Advanced Beginner",
        subtitle: "Kelulusan diukur dari kemampuan membangun, memahami, dan menjelaskan alur kerja aplikasi.",
        contentJson: {
          eyebrow: "Executive Summary • Prinsip Utama Bootcamp",
          highlights: [
            "Pegang prinsip: pahami konsep, bangun fitur, kuasai kode, dan jelaskan hasilnya.",
            "Lulusan mencapai level Advanced Beginner pada stack Nuxt, TypeScript, dan MySQL.",
            "Skala industri menuntut pendalaman lanjutan di bidang keamanan, pengujian, dan arsitektur.",
            "Sepuluh topik pasca-program disiapkan sebagai peta belajar mandiri berikutnya."
          ],
          stats: [
            { label: "Beginner", value: "HTML, CSS, JS Statis" },
            { label: "Intermediate", value: "Vue.js & CRUD Dasar" },
            { label: "Advanced Beginner", value: "Fullstack Nuxt + TS + MySQL" }
          ]
        }
      },
      {
        slideNumber: 3,
        isSummary: true,
        layoutType: "bento",
        badge: "Peta Evaluasi Akhir",
        title: "Peta Aktivitas Evaluasi & Komponen Penilaian",
        subtitle: "Empat komponen utama yang menentukan kelulusan serta arah pengembangan pasca-program.",
        contentJson: {
          eyebrow: "Struktur Evaluasi Pertemuan 15",
          highlights: [
            "Mentor menguji modifikasi fitur langsung untuk memvalidasi keaslian pemahaman kode."
          ],
          bentoCards: [
            {
              title: "1. Bobot Nilai (40/30/20/10)",
              tag: "Sistem Evaluasi",
              description: "Penilaian menggabungkan hasil proyek, penguasaan teori, komunikasi teknis, dan kerapian Git.",
              bullets: [
                "40% proyek berjalan dan 30% kuis konsep",
                "20% presentasi dan penjelasan alur kode",
                "10% kerapian commit Git serta README"
              ]
            },
            {
              title: "2. Empat Skenario Live Coding",
              tag: "Live Assessment",
              description: "Pengujian praktik langsung untuk mengukur ketangkasan merakit fitur dan melacak galat.",
              bullets: [
                "Buat halaman daftar tugas dan endpoint API",
                "Jelaskan alur eksekusi query ke MySQL",
                "Lacak serta perbaiki 1 galat tersembunyi"
              ]
            },
            {
              title: "3. Audit 35 Kompetensi",
              tag: "Capaian Belajar",
              description: "Pemetaan menyeluruh atas keterampilan teknis dari Bulan 1 hingga Bulan 3.",
              bullets: [
                "10 kompetensi dasar HTML, CSS, dan JS",
                "11 kompetensi Node.js, REST API, dan MySQL",
                "14 kompetensi Vite, Vue, TypeScript, dan Nuxt"
              ]
            },
            {
              title: "4. Peta Belajar Lanjutan",
              tag: "Pasca-Bootcamp",
              description: "Penentuan prioritas topik lanjutan setelah fondasi utama tiga bulan terbentuk.",
              bullets: [
                "Autentikasi, password hashing, dan validasi skema",
                "Automated testing, Docker, serta alur CI/CD"
              ]
            }
          ]
        }
      },
      {
        slideNumber: 4,
        isSummary: false,
        layoutType: "bento",
        badge: "Sintesis 3 Bulan",
        title: "Sintesis 3 Bulan: Dari Antarmuka ke Produksi",
        subtitle: "Lihat keterkaitan materi Pertemuan 01 hingga 15 sebagai satu kesatuan sistem.",
        contentJson: {
          eyebrow: "Analogi Peta Besar Fullstack",
          highlights: [
            "Antarmuka, API server, dan database bekerja sebagai satu aliran terpadu."
          ],
          bentoCards: [
            {
              title: "Bulan 1 || Fondasi Antarmuka",
              tag: "P01 – P05",
              description: "HTML5 semantik menyusun struktur, CSS mengatur tata letak responsif, dan JS menangani interaksi.",
              bullets: [
                "Inspeksi elemen dan konsol melalui DevTools",
                "Pencatatan riwayat perubahan kode dengan Git"
              ]
            },
            {
              title: "Bulan 2 || Backend & Database",
              tag: "P06 – P10",
              description: "Node.js dan REST API menjembatani pertukaran JSON dengan penyimpanan relasional MySQL.",
              bullets: [
                "Alur Request -> Handler -> SQL -> Response",
                "Pengujian kontrak endpoint menggunakan Postman"
              ]
            },
            {
              title: "Bulan 3 || Fullstack Modern",
              tag: "P11 – P15",
              description: "Vue 3 memodularisasi komponen, TypeScript menjaga tipe data, dan Nuxt menyatukan server API.",
              bullets: [
                "Pengembangan aplikasi fullstack dalam satu kode sumber"
              ]
            },
            {
              title: "Alur Pelacakan Bug",
              tag: "Troubleshooting",
              description: "Telusuri masalah secara berurutan dari Console peramban, tab Network, log Nitro, hingga MySQL.",
              bullets: [
                "Isolasi letak galat sebelum mengubah baris kode"
              ]
            }
          ]
        }
      },
      {
        slideNumber: 5,
        isSummary: false,
        layoutType: "bento",
        badge: "Rubrik & Roadmap",
        title: "Skala Nilai Akhir & 10 Topik Pasca-Bootcamp",
        subtitle: "Standar penilaian kelulusan beserta sepuluh topik lanjutan untuk pendalaman mandiri.",
        contentJson: {
          eyebrow: "Skala Nilai & Peta Jalan Pasca-Program",
          highlights: [
            "Kuasai sepuluh topik lanjutan secara bertahap setelah fondasi fullstack selesai."
          ],
          bentoCards: [
            {
              title: "Skala Interpretasi Nilai",
              tag: "Standar Evaluasi",
              description: "Rentang skor akhir mengacu pada kemandirian penyelesaian fitur dan ketepatan penjelasan konsep.",
              bullets: [
                "90–100: Paham konsep dan mandiri mengembangkan fitur",
                "80–89: Target selesai dengan sedikit arahan",
                "70–79: Paham dasar, di bawah 70 remedial"
              ]
            },
            {
              title: "Roadmap #1–#5: Backend & Keamanan",
              tag: "Pasca-Bootcamp 1–5",
              description: "Lima topik prioritas untuk mengamankan akses pengguna dan struktur data produksi.",
              bullets: [
                "1–2: Autentikasi RBAC, password hashing, dan sesi",
                "3–4: Normalisasi database dan validasi skema API",
                "5: Middleware serta utilitas server lanjutan Nuxt"
              ]
            },
            {
              title: "Roadmap #6–#10: Kualitas & DevOps",
              tag: "Pasca-Bootcamp 6–10",
              description: "Lima topik lanjutan untuk pengujian otomatis, infrastruktur server, dan kolaborasi tim.",
              bullets: [
                "6–7: Automated testing dan pipeline CI/CD produksi",
                "8: Kontainerisasi Docker dan dasar server Linux",
                "9–10: Clean architecture, Git branching, dan PR"
              ]
            },
            {
              title: "Aset Portofolio Lulusan",
              tag: "Career Ready",
              description: "Bukti karya nyata yang siap dilampirkan saat melamar magang lanjutan atau pekerjaan.",
              bullets: [
                "Aplikasi fullstack TaskFlow teruji end-to-end",
                "Repositori GitHub rapi dengan dokumentasi README",
                "Kemampuan menjelaskan arsitektur kode secara lugas"
              ]
            }
          ]
        }
      },
      {
        slideNumber: 6,
        isSummary: false,
        layoutType: "comparison",
        badge: "Good vs Bad Practice",
        title: "Sikap Menghadapi Evaluasi & Live Coding",
        subtitle: "Kode salinan tanpa pemahaman tidak dihitung sebagai capaian kompetensi.",
        contentJson: {
          eyebrow: "Mindset Software Engineer Saat Evaluasi",
          highlights: [
            "Penilaian berfokus pada penalaran alur data dan ketenangan membaca pesan galat."
          ],
          comparison: {
            badTitle: "✕ Menghambat Kompetensi",
            badPoints: [
              "Menyalin kode utuh tanpa memahami fungsi setiap barisnya.",
              "Menebak perubahan secara acak tanpa membaca pesan galat terminal.",
              "Memoles tampilan CSS saat fungsi utama database masih gagal."
            ],
            badCode: {
              filename: "BuggyEndpoint.ts",
              language: "typescript",
              snippet: `// Contoh bug akibat menyalin kode tanpa teliti
export default defineEventHandler(async (event) => {
  const body = readBody(event); // Lupa kata kunci await
  const rows = await getDbPool().execute(
    'INSERT INTO tasks (title) VALUES (body.title)',
  );
  return rows;
});`
            },
            goodTitle: "✓ Sikap Engineer Terlatih",
            goodPoints: [
              "Menjelaskan fungsi setiap baris, termasuk await, tipe data, dan query.",
              "Membaca pesan galat lalu memeriksa tab Network serta log server.",
              "Memastikan alur CRUD inti stabil sebelum merapikan detail tampilan."
            ],
            goodCode: {
              filename: "FixedEndpoint.ts",
              language: "typescript",
              snippet: `export default defineEventHandler(async (event) => {
  const body = await readBody<{ title?: string }>(event);
  if (!body?.title?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Judul wajib diisi' });
  }
  const [res] = await getDbPool().execute(
    'INSERT INTO tasks (title) VALUES (?)',
    [body.title.trim()],
  );
  return { success: true, data: res };
});`
            }
          }
        }
      },
      {
        slideNumber: 7,
        isSummary: false,
        layoutType: "practice",
        badge: "Live Coding Test",
        title: "4 Tantangan Live Coding & Validasi Struktur Nuxt",
        subtitle: "Simulasikan empat skenario pengujian langsung bersama mentor pada sesi evaluasi.",
        contentJson: {
          eyebrow: "70% Praktik Evaluasi • Live Coding Challenge",
          highlights: [
            "Utamakan kode yang bersih, terketik rapi, dan mudah dijelaskan alurnya."
          ],
          practiceSteps: [
            {
              step: 1,
              title: "Tantangan 1: Buat Halaman Daftar Tugas",
              description: "Buat halaman app/pages/evaluasi.vue yang menampilkan daftar tugas via useFetch dan form input v-model."
            },
            {
              step: 2,
              title: "Tantangan 2: Buat Endpoint Ringkasan di Server API",
              description: "Tambahkan handler server/api/tasks/summary.get.ts yang menghitung jumlah tugas per status dalam format JSON.",
              code: `export default defineEventHandler(async () => {
  const [rows] = await getDbPool().execute(
    'SELECT status, COUNT(*) AS total FROM tasks GROUP BY status',
  );
  return { success: true, data: rows };
});`
            },
            {
              step: 3,
              title: "Tantangan 3: Jelaskan Alur Data End-to-End",
              description: "Uraikan secara lisan bagaimana useFetch memanggil endpoint Nitro, mengeksekusi query MySQL, dan merender JSON.",
              code: `taskflow/
├── app/pages/         # Komponen halaman & useFetch
├── server/api/        # Handler REST API Nitro
├── server/utils/db.ts # Connection pool MySQL
└── shared/types/      # Kontrak interface TypeScript`
            },
            {
              step: 4,
              title: "Tantangan 4: Perbaiki 1 Bug dari Mentor",
              description: "Temukan dan perbaiki satu galat yang disisipkan mentor, lalu pastikan validasi tipe lulus.",
              command: "npx nuxi typecheck"
            }
          ]
        }
      },
      {
        slideNumber: 8,
        isSummary: false,
        layoutType: "quiz",
        badge: "Evaluasi & 35 Checklist",
        title: "Kuis Lintas Bulan, 35 Kompetensi & Referensi",
        subtitle: "Uji pemahaman Bulan 1–3 dan periksa ketuntasan 35 daftar kompetensi.",
        contentJson: {
          eyebrow: "Final Assessment • Kuis + 35 Checklist Kompetensi",
          highlights: [
            "Gunakan 35 daftar kompetensi ini sebagai tolok ukur capaian belajar Anda."
          ],
          quizItems: [
            {
              question: "[Bulan 1] Mengapa elemen semantik HTML lebih disarankan daripada memakai <div> untuk semua bagian?",
              hint: "Tinjau aspek aksesibilitas, SEO, dan keterbacaan struktur.",
              answer: "HTML semantik memberi makna struktur dokumen bagi pembaca layar, mesin pencari, serta memudahkan pengembang memahami hierarki halaman."
            },
            {
              question: "[Bulan 2] Apa arti kode status HTTP 201, 400, 404, dan 500 pada REST API?",
              hint: "Bedakan respons sukses, kesalahan klien, dan kegagalan server.",
              answer: "Kode 201 menandakan data berhasil dibuat, 400 input klien tidak valid, 404 data tidak ditemukan, dan 500 terjadi kegagalan di sisi server."
            },
            {
              question: "[Bulan 3] Mengapa endpoint POST gagal membaca payload jika pemanggilan readBody(event) tidak memakai await?",
              hint: "Perhatikan tipe kembalian fungsi asynchronous.",
              answer: "Fungsi readBody(event) mengembalikan Promise. Tanpa await, variabel hanya memegang objek Promise yang belum selesai dibaca."
            },
            {
              question: "[Bulan 3] Bagaimana pembagian peran Vite, Vue 3, TypeScript, Nitro, dan MySQL di dalam proyek Nuxt?",
              hint: "Urutkan dari tooling, antarmuka, tipe data, server, hingga penyimpanan.",
              answer: "Vite membundel kode, Vue 3 membangun komponen UI, TypeScript menjaga kontrak tipe, Nitro menjalankan server/api/, dan MySQL menyimpan data relasional."
            },
            {
              question: "[Keamanan] Mengapa file .env wajib masuk .gitignore dan query SQL wajib memakai tanda tanya (?)?",
              hint: "Dua lapis perlindungan kredensial dan database.",
              answer: "Aturan .gitignore mencegah kebocoran kata sandi ke repositori publik, sedangkan placeholder (?) mencegah injeksi perintah SQL berbahaya."
            }
          ],
          competencyChecklist: [
            "Memahami struktur dasar dokumen HTML.",
            "Menggunakan elemen HTML semantik dengan tepat.",
            "Menyusun tata letak halaman menggunakan CSS.",
            "Menerapkan Flexbox dan CSS Grid.",
            "Membangun tampilan web responsif.",
            "Memahami variabel dan tipe data JavaScript.",
            "Menggunakan function, array, dan object.",
            "Mengelola DOM dan event listener.",
            "Menyimpan data sisi klien di localStorage.",
            "Mengelola versi kode dengan Git dan GitHub.",
            "Memahami peran runtime Node.js.",
            "Menjalankan skrip proyek menggunakan npm.",
            "Memahami konsep dasar Express.js.",
            "Memahami siklus HTTP request dan response.",
            "Memahami standar arsitektur REST API.",
            "Membangun endpoint CRUD fungsional.",
            "Memahami konsep database relasional.",
            "Merancang tabel pada database MySQL.",
            "Menulis query SQL CRUD dasar.",
            "Menghubungkan aplikasi Node.js dengan MySQL.",
            "Menguji endpoint API menggunakan Postman.",
            "Memahami peran Vite sebagai build tool.",
            "Memahami struktur proyek Vue.js 3.",
            "Membuat komponen Single File Component (.vue).",
            "Menggunakan ref, v-if, v-for, dan v-model.",
            "Menerapkan komunikasi komponen lewat props dan emit.",
            "Memahami anotasi tipe dasar TypeScript.",
            "Menggunakan type dan interface secara konsisten.",
            "Memahami struktur direktori fullstack Nuxt.",
            "Membuat halaman dengan file-based routing Nuxt.",
            "Membuat endpoint server API menggunakan Nitro.",
            "Menghubungkan server API Nuxt dengan MySQL.",
            "Mengamankan konfigurasi melalui environment variables.",
            "Mendemonstrasikan dan menjelaskan alur aplikasi fullstack.",
            "Menyiapkan latihan deployment Railway serta cadangan file .sql."
          ],
          references: [
            {
              title: "Free Programming Books (Bahasa Indonesia)",
              url: "https://github.com/EbookFoundation/free-programming-books/blob/main/books/free-programming-books-id.md",
              author: "EbookFoundation",
              category: "Katalog E-Book Gratis",
              lang: "ID",
              type: "Book"
            },
            {
              title: "Project-Based Learning Repository",
              url: "https://github.com/practical-tutorials/project-based-learning#html-and-css",
              author: "Practical Tutorials",
              category: "Katalog Proyek Praktik",
              lang: "EN",
              type: "PBL"
            },
            {
              title: "Nuxt Documentation (Middleware, Utils & Production)",
              url: "https://nuxt.com/docs",
              author: "Nuxt Core Team",
              category: "Materi Lanjutan",
              lang: "EN",
              type: "Docs"
            },
            {
              title: "Belajar Docker untuk Pemula (Roadmap #8)",
              url: "https://www.youtube.com/playlist?list=PL-CtdCApEFH-A7jBmdertzbeACuQWvQao",
              author: "Eko Kurniawan Khannedy (Programmer Zaman Now)",
              category: "DevOps Lanjutan (Free Courses ID)",
              lang: "ID",
              type: "Course"
            },
            {
              title: "TypeScript Handbook",
              url: "https://www.typescriptlang.org/docs/handbook/intro.html",
              author: "Microsoft TypeScript",
              category: "Type Safety Lanjutan",
              lang: "EN",
              type: "Docs"
            }
          ],
          weeklyAssignment: {
            week: 15,
            title: "Refleksi dan Rencana Belajar Lanjutan",
            description: "Tulis refleksi perkembangan belajar 3 bulan dan pilih 3 topik prioritas dari Roadmap Pasca-Bootcamp."
          }
        }
      },
      {
        slideNumber: 9,
        isSummary: false,
        layoutType: "task",
        badge: "Final Deliverable • Penutupan",
        title: "Pengumpulan Proyek Final, Refleksi & Penutupan",
        subtitle: "Lengkapi paket portofolio akhir Anda untuk verifikasi kelulusan program.",
        contentJson: {
          eyebrow: "Final Submission • Graduation",
          highlights: [
            "Jadikan repositori TaskFlow fullstack sebagai portofolio rekayasa perangkat lunak Anda."
          ],
          deliverables: [
            "Tautan repositori GitHub final TaskFlow fullstack (README lengkap, .env.example, database .sql)",
            "Tautan demo Railway atau dokumentasi tangkapan layar aplikasi beserta pengujian Postman",
            "Bukti penyelesaian 4 tantangan Live Coding Pertemuan 15",
            "Evaluasi 35 Checklist Kompetensi serta rencana belajar 3 topik pasca-bootcamp",
            "Catatan Learning Log penutupan program"
          ],
          learningLogFields: STANDARD_LEARNING_LOG_FIELDS,
          mentorTip: "Kelulusan ini merupakan titik awal untuk terus membangun proyek nyata dan memperdalam pemahaman atas setiap kode yang Anda tulis."
        }
      }
    ]
  },
  {
    orderIndex: 17,
    month: 0,
    code: "P17",
    slug: "pustaka-learning-hub",
    sessionType: "Learning Hub",
    title: "Pustaka Learning Hub: Free Programming Books & Project-Based Learning",
    subtitle: "Katalog referensi gratis Bahasa Indonesia dan Inggris dari buku terbuka, kursus video, serta dokumentasi resmi.",
    summaryText: "Pusat rujukan mandiri berisi e-book Bahasa Indonesia, playlist video, proyek latihan bertahap, dan dokumentasi resmi.",
    taskPrompt: "Gunakan Pustaka Learning Hub sebagai pendamping belajar mandiri lintas materi Bulan 1 hingga Bulan 3.",
    taskDeliverables: [
      "Pilih minimal 1 bacaan atau video Bahasa Indonesia serta 1 proyek latihan sesuai topik pertemuan aktif"
    ],
    accentGradient: "from-teal-600 to-emerald-600",
    iconName: "Books",
    slides: [
      {
        slideNumber: 1,
        isSummary: true,
        layoutType: "bento",
        badge: "Learning Hub • Pilar Pustaka",
        title: "Peta Pustaka Learning Hub & Strategi Belajar",
        subtitle: "Pilih topik bacaan dan proyek latihan yang sesuai dengan pertemuan aktif Anda.",
        contentJson: {
          eyebrow: "Pustaka Terkurasi • Digitek Software Engineering Bootcamp",
          highlights: [
            "Baca e-book Bahasa Indonesia untuk memperkuat konsep sebelum kelas dimulai.",
            "Kerjakan proyek kecil PBL untuk melatih logika pemrograman mandiri.",
            "Rujuk dokumentasi resmi untuk spesifikasi teknis Vite, Vue, TypeScript, dan Nuxt."
          ],
          stats: [
            { label: "Pilar 1", value: "Free Books ID" },
            { label: "Pilar 2", value: "Free Courses ID" },
            { label: "Pilar 3", value: "Project-Based Learning" },
            { label: "Pilar 4", value: "Official Docs Stack" }
          ],
          bentoCards: [
            {
              title: "1. Free Programming Books (ID)",
              tag: "Slide 02",
              description: "Kumpulan buku digital dan panduan teks berbahasa Indonesia untuk penguatan konsep dasar.",
              bullets: [
                "HTML, CSS, dan Git (Petani Kode)",
                "JavaScript Modern (id.javascript.info)",
                "Node.js, MySQL, Vue.js, dan TypeScript"
              ]
            },
            {
              title: "2. Free Video Courses (ID)",
              tag: "Slide 03",
              description: "Playlist video pembelajaran berbahasa Indonesia untuk melihat demonstrasi penulisan kode.",
              bullets: [
                "Web Programming UNPAS (Frontend & Git)",
                "Programmer Zaman Now (Node, MySQL, TS)",
                "Nusendra & Wahidev (Vue 3 & API)"
              ]
            },
            {
              title: "3. Project-Based Learning (PBL)",
              tag: "Slide 04",
              description: "Daftar tutorial berbasis proyek nyata untuk melatih pemecahan masalah secara bertahap.",
              bullets: [
                "HTML/CSS: Loading Screen & Calculator",
                "JavaScript: Todo, Weather App, JavaScript30",
                "Vue & Fullstack: Budgeting App & MEVN"
              ]
            },
            {
              title: "4. Dokumentasi Resmi Stack",
              tag: "Slide 04",
              description: "Rujukan teknis utama paling mutakhir untuk teknologi Bulan 1 hingga Bulan 3.",
              bullets: [
                "MDN Web Docs, Node.js, dan MySQL",
                "Vite, Vue 3, TypeScript, dan Nuxt",
                "Postman Learning Center & Railway Docs"
              ]
            }
          ]
        }
      },
      {
        slideNumber: 2,
        isSummary: true,
        layoutType: "references",
        badge: "E-Book Gratis (ID)",
        title: "Kurasi Free Programming Books (Bahasa Indonesia)",
        subtitle: "Kumpulan buku digital dan panduan pemrograman gratis berbahasa Indonesia sesuai kurikulum.",
        contentJson: {
          eyebrow: "Pilar 1 • Katalog Bacaan Bahasa Indonesia",
          highlights: [
            "Pelajari bab yang relevan sebelum sesi pertemuan dimulai.",
            "Catat istilah teknis baru ke dalam dokumen Learning Log Anda."
          ],
          references: [
            {
              title: "Tutorial HTML untuk Pemula",
              url: "https://www.petanikode.com/tutorial/html/",
              author: "Ahmad Muhardian (Petani Kode)",
              category: "HTML & CSS (Bulan 1)",
              lang: "ID",
              type: "Book"
            },
            {
              title: "Tutorial Dasar CSS untuk Pemula",
              url: "https://www.petanikode.com/tutorial/css/",
              author: "Ahmad Muhardian (Petani Kode)",
              category: "HTML & CSS (Bulan 1)",
              lang: "ID",
              type: "Book"
            },
            {
              title: "Tutorial JavaScript Modern",
              url: "https://id.javascript.info",
              author: "Ilya Kantor",
              category: "JavaScript (Bulan 1)",
              lang: "ID",
              type: "Book"
            },
            {
              title: "Learn JavaScript (Edisi Indonesia)",
              url: "https://javascript.sumankunwar.com.np/id",
              author: "Suman Kumar & Contributors",
              category: "JavaScript (Bulan 1)",
              lang: "ID",
              type: "Book"
            },
            {
              title: "Belajar Git untuk Pemula",
              url: "https://github.com/petanikode/belajar-git",
              author: "Ahmad Muhardian (Petani Kode)",
              category: "Git & GitHub (Bulan 1)",
              lang: "ID",
              type: "Book"
            },
            {
              title: "Pro Git 2nd Edition (Bahasa Indonesia)",
              url: "https://git-scm.com/book/id/",
              author: "Scott Chacon & Ben Straub",
              category: "Git & GitHub (Bulan 1–3)",
              lang: "ID",
              type: "Book"
            },
            {
              title: "Belajar Node.js",
              url: "http://idjs.github.io/belajar-nodejs/",
              author: "IDJS Community",
              category: "Node.js (Bulan 2)",
              lang: "ID",
              type: "Book"
            },
            {
              title: "Tutorial Node.js untuk Pemula",
              url: "https://mfikri.com/artikel/tutorial-nodejs",
              author: "M. Fikri",
              category: "Node.js (Bulan 2)",
              lang: "ID",
              type: "Book"
            },
            {
              title: "Tutorial MySQL untuk Pemula Hingga Mahir",
              url: "https://umardanny.com/tutorial-mysql-untuk-pemula-hingga-mahir-ebook-download-pdf/",
              author: "Umar Danny",
              category: "MySQL & SQL (Bulan 2–3)",
              lang: "ID",
              type: "Book"
            },
            {
              title: "Belajar Vue.js",
              url: "https://variancode.com/belajar-vue-js/",
              author: "Varian Hermianto",
              category: "Vue.js (Bulan 3)",
              lang: "ID",
              type: "Book"
            },
            {
              title: "Dokumentasi Vue Bahasa Indonesia",
              url: "https://github.com/vuejs-id/docs",
              author: "Vue.js Indonesia",
              category: "Vue.js (Bulan 3)",
              lang: "ID",
              type: "Book"
            },
            {
              title: "TypeScript untuk Pemula, Bagian 1: Memulai",
              url: "https://code.tutsplus.com/id/tutorials/typescript-for-beginners-getting-started--cms-29329",
              author: "Tutsplus",
              category: "TypeScript (Bulan 3)",
              lang: "ID",
              type: "Book"
            }
          ]
        }
      },
      {
        slideNumber: 3,
        isSummary: true,
        layoutType: "references",
        badge: "Video Courses (ID)",
        title: "Kurasi Free Video Courses (Bahasa Indonesia)",
        subtitle: "Playlist video tutorial terstruktur berbahasa Indonesia untuk pendamping praktik Bulan 1–3.",
        contentJson: {
          eyebrow: "Pilar 2 • Video Pembelajaran Bahasa Indonesia",
          highlights: [
            "Ketik ulang dan modifikasi setiap contoh kode dari video.",
            "Gunakan kecepatan putar sesuai kenyamanan saat meninjau ulang materi."
          ],
          references: [
            {
              title: "Belajar HTML5",
              url: "https://www.youtube.com/playlist?list=PLFIM0718LjIX-K5eeHRImnZhPUMhsw9A7",
              author: "Sandhika Galih (Web Programming UNPAS)",
              category: "HTML5 (Bulan 1)",
              lang: "ID",
              type: "Course"
            },
            {
              title: "Belajar Flexbox & CSS Grid",
              url: "https://www.youtube.com/playlist?list=PLFIM0718LjIU1lWlM34j6E9fMlrrSGZ1k",
              author: "Web Programming UNPAS",
              category: "CSS Layout (Bulan 1)",
              lang: "ID",
              type: "Course"
            },
            {
              title: "Belajar Tailwind CSS",
              url: "https://youtube.com/playlist?list=PLFIM0718LjIUHFRMzPJ0wGjx9_NlC5d1h",
              author: "Web Programming UNPAS",
              category: "Modern CSS (Bulan 1–3)",
              lang: "ID",
              type: "Course"
            },
            {
              title: "JavaScript dan DOM (Document Object Model)",
              url: "https://www.youtube.com/playlist?list=PLFIM0718LjIWB3YRoQbQh82ZewAGtE2-3",
              author: "Web Programming UNPAS",
              category: "JavaScript DOM (Bulan 1)",
              lang: "ID",
              type: "Course"
            },
            {
              title: "Git & GitHub Playlist",
              url: "https://www.youtube.com/playlist?list=PLFIM0718LjIVknj6sgsSceMqlq242-jNf",
              author: "Sandhika Galih (Web Programming UNPAS)",
              category: "Git & GitHub (Bulan 1–3)",
              lang: "ID",
              type: "Course"
            },
            {
              title: "Tutorial Node.js Dasar Bahasa Indonesia",
              url: "https://www.youtube.com/watch?v=b39Xqf5iyjo",
              author: "Eko Kurniawan Khannedy (Programmer Zaman Now)",
              category: "Node.js (Bulan 2)",
              lang: "ID",
              type: "Course"
            },
            {
              title: "MySQL Tutorial Bahasa Indonesia",
              url: "https://www.youtube.com/playlist?list=PL-CtdCApEFH_P2_2zR6pvDublvpD3fF6W",
              author: "Programmer Zaman Now",
              category: "MySQL (Bulan 2–3)",
              lang: "ID",
              type: "Course"
            },
            {
              title: "Vue 3 Dasar",
              url: "https://youtube.com/playlist?list=PLnQvfeVegcJbV2NGXpay7ulU6ybASzAlG",
              author: "Nusendra Hanggarawan",
              category: "Vue.js 3 (Bulan 3)",
              lang: "ID",
              type: "Course"
            },
            {
              title: "Vue 3 Composition API",
              url: "https://youtube.com/playlist?list=PLnQvfeVegcJbn7ZDOUNbRN25obY4htSlB",
              author: "Nusendra Hanggarawan",
              category: "Vue.js 3 (Bulan 3)",
              lang: "ID",
              type: "Course"
            },
            {
              title: "Vue 3 Lanjutan & Pinia",
              url: "https://youtube.com/playlist?list=PLnQvfeVegcJYV7uSax0W8z3peCyiOxr6W",
              author: "Nusendra Hanggarawan",
              category: "Vue.js 3 (Bulan 3)",
              lang: "ID",
              type: "Course"
            },
            {
              title: "Tutorial Vue.js dengan API Bahasa Indonesia",
              url: "https://www.youtube.com/playlist?list=PLIan8aHxsPj3a7oLHb2a8pw8IHBq45WYu",
              author: "Wahidev Academy",
              category: "Vue.js + API (Bulan 3)",
              lang: "ID",
              type: "Course"
            },
            {
              title: "Tutorial TypeScript Dasar",
              url: "https://www.youtube.com/watch?v=C_C64faSO4c",
              author: "Eko Kurniawan Khannedy (Programmer Zaman Now)",
              category: "TypeScript (Bulan 3)",
              lang: "ID",
              type: "Course"
            },
            {
              title: "TypeScript Dasar & OOP TypeScript",
              url: "https://www.youtube.com/playlist?list=PLnQvfeVegcJbjCnML6FdusK-rl-oDRMXJ",
              author: "Nusendra Hanggarawan",
              category: "TypeScript (Bulan 3)",
              lang: "ID",
              type: "Course"
            },
            {
              title: "Tutorial Docker untuk Pemula (Roadmap Lanjutan)",
              url: "https://www.youtube.com/playlist?list=PL-CtdCApEFH-A7jBmdertzbeACuQWvQao",
              author: "Eko Kurniawan Khannedy (Programmer Zaman Now)",
              category: "Pasca-Bootcamp DevOps",
              lang: "ID",
              type: "Course"
            }
          ]
        }
      },
      {
        slideNumber: 4,
        isSummary: true,
        layoutType: "references",
        badge: "PBL & Docs Resmi",
        title: "Kurasi Project-Based Learning & Dokumentasi Resmi",
        subtitle: "Ide proyek latihan bertahap beserta dokumentasi resmi dari HTML hingga Railway.",
        contentJson: {
          eyebrow: "Pilar 3 & 4 • Latihan Proyek Nyata & Official Docs",
          highlights: [
            "Jadikan dokumentasi resmi rujukan utama untuk Nuxt, TypeScript, dan Vite.",
            "Pilih satu proyek kecil PBL setiap akhir pekan untuk latihan."
          ],
          references: [
            {
              title: "Build a Loading Screen (HTML & CSS)",
              url: "https://medium.freecodecamp.org/how-to-build-a-delightful-loading-screen-in-5-minutes-847991da509f",
              author: "Project Based Learning",
              category: "PBL HTML & CSS",
              lang: "EN",
              type: "PBL"
            },
            {
              title: "Build an HTML Calculator with JS",
              url: "https://medium.freecodecamp.org/how-to-build-an-html-calculator-app-from-scratch-using-javascript-4454b8714b98",
              author: "Project Based Learning",
              category: "PBL HTML/CSS/JS",
              lang: "EN",
              type: "PBL"
            },
            {
              title: "Build a Todo List App in JavaScript",
              url: "https://github.com/dwyl/javascript-todo-list-tutorial",
              author: "dwyl (Project Based Learning)",
              category: "PBL JavaScript",
              lang: "EN",
              type: "PBL"
            },
            {
              title: "Build a Simple Weather App with Vanilla JS",
              url: "https://webdesign.tutsplus.com/tutorials/build-a-simple-weather-app-with-vanilla-javascript--cms-33893",
              author: "Project Based Learning",
              category: "PBL JavaScript & Fetch API",
              lang: "EN",
              type: "PBL"
            },
            {
              title: "JavaScript30 || Build 30 Things in 30 Days",
              url: "https://javascript30.com",
              author: "Wes Bos (PBL)",
              category: "PBL JavaScript",
              lang: "EN",
              type: "PBL"
            },
            {
              title: "Creating a Simple Budgeting App with Vue",
              url: "https://matthiashager.com/complete-vuejs-application-tutorial/",
              author: "Matthias Hager (PBL)",
              category: "PBL Vue.js",
              lang: "EN",
              type: "PBL"
            },
            {
              title: "Full Stack MEVN Application (Pembanding Arsitektur)",
              url: "https://medium.com/@anaida07/mevn-stack-application-part-1-3a27b61dcae0",
              author: "Project Based Learning",
              category: "PBL Fullstack",
              lang: "EN",
              type: "PBL"
            },
            {
              title: "MDN Web Docs || HTML & CSS",
              url: "https://developer.mozilla.org/en-US/docs/Web/HTML",
              author: "Mozilla MDN",
              category: "Official Docs (Bulan 1)",
              lang: "EN",
              type: "Docs"
            },
            {
              title: "Node.js Learn & Express Documentation",
              url: "https://nodejs.org/en/learn",
              author: "OpenJS Foundation",
              category: "Official Docs (Bulan 2)",
              lang: "EN",
              type: "Docs"
            },
            {
              title: "MySQL Documentation",
              url: "https://dev.mysql.com/doc/",
              author: "Oracle MySQL",
              category: "Official Docs (Bulan 2–3)",
              lang: "EN",
              type: "Docs"
            },
            {
              title: "Vite Guide & Vue.js Official Documentation",
              url: "https://vite.dev/guide/",
              author: "Vite & Vue Core Team",
              category: "Official Docs (Bulan 3)",
              lang: "EN",
              type: "Docs"
            },
            {
              title: "TypeScript Handbook",
              url: "https://www.typescriptlang.org/docs/handbook/intro.html",
              author: "Microsoft TypeScript",
              category: "Official Docs (Bulan 3)",
              lang: "EN",
              type: "Docs"
            },
            {
              title: "Nuxt Documentation & Server Directory",
              url: "https://nuxt.com/docs",
              author: "Nuxt Core Team",
              category: "Official Docs (Bulan 3)",
              lang: "EN",
              type: "Docs"
            },
            {
              title: "Postman Learning Center & Railway Docs",
              url: "https://docs.railway.com/",
              author: "Postman & Railway",
              category: "Official Docs (Testing & Deploy)",
              lang: "EN",
              type: "Docs"
            }
          ]
        }
      }
    ]
  }
];
const ALL_SEED_MODULES = [
  ...MONTH_1_MODULES,
  ...MONTH_2_MODULES,
  ...MONTH_3_MODULES
].sort((a, b) => a.orderIndex - b.orderIndex);
const DEFAULT_MENTOR_PROFILE = MENTOR_PROFILE;
const slideLayoutEnum = z.enum([
  "cover",
  "summary",
  "bento",
  "comparison",
  "practice",
  "quiz",
  "references",
  "task"
]);
const registerSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter").max(160),
  email: z.string().trim().email("Format email tidak valid").max(180),
  schoolOrigin: z.string().trim().min(2, "Asal sekolah/instansi wajib diisi").max(200),
  password: z.string().min(8, "Kata sandi minimal 8 karakter").max(128)
});
const studentLoginSchema = z.object({
  email: z.string().trim().email("Format email tidak valid").max(180),
  password: z.string().min(1, "Kata sandi wajib diisi").max(128)
});
const mentorLoginSchema = z.object({
  email: z.string().trim().email("Format email tidak valid"),
  passcode: z.string().min(1, "Passcode wajib diisi")
});
const submitTaskSchema = z.object({
  moduleId: z.coerce.number().int().positive(),
  repoUrl: z.string().trim().url("URL repository tidak valid").max(500),
  demoUrl: z.union([z.string().trim().url("URL demo tidak valid").max(500), z.literal(""), z.null()]).optional().transform((v) => v && v.length > 0 ? v : null),
  learningLog: z.string().trim().min(5, "Learning log minimal 5 karakter").max(8e3)
});
const reviewSchema = z.object({
  submissionId: z.coerce.number().int().positive(),
  status: z.enum(["approved", "revision"]),
  mentorFeedback: z.string().trim().min(1, "Feedback mentor wajib diisi").max(4e3)
});
const unlockSchema = z.object({
  userId: z.coerce.number().int().positive(),
  moduleId: z.coerce.number().int().positive(),
  unlocked: z.boolean()
});
const updateModuleContentSchema = z.object({
  summaryText: z.string().trim().min(1).optional(),
  taskPrompt: z.string().trim().min(1).optional(),
  taskDeliverables: z.array(z.string().trim().min(1)).optional()
});
const createModuleSchema = z.object({
  orderIndex: z.coerce.number().int().min(0).max(999),
  month: z.coerce.number().int().min(0).max(24),
  slug: z.string().trim().min(2).max(160),
  code: z.string().trim().min(1).max(20),
  sessionType: z.string().trim().min(1).max(64),
  title: z.string().trim().min(2).max(220),
  subtitle: z.string().trim().max(1e3).default(""),
  summaryText: z.string().trim().min(1).max(4e3),
  taskPrompt: z.string().trim().max(4e3).default(""),
  taskDeliverables: z.array(z.string().trim()).transform((arr) => arr.filter(Boolean)).default([]),
  accentGradient: z.string().trim().min(1).max(120).optional(),
  iconName: z.string().trim().min(1).max(64).optional()
});
const adminUpdateModuleSchema = createModuleSchema.partial();
const slideContentSchema = z.object({
  highlights: z.array(z.string()).default([])
}).passthrough().transform((val) => val);
const createSlideSchema = z.object({
  slideNumber: z.coerce.number().int().positive().optional(),
  isSummary: z.boolean().default(false),
  layoutType: slideLayoutEnum,
  badge: z.string().trim().min(1).max(80),
  title: z.string().trim().min(1).max(240),
  subtitle: z.string().trim().max(1e3).default(""),
  contentJson: slideContentSchema
});
const updateSlideSchema = z.object({
  slideNumber: z.coerce.number().int().positive().optional(),
  isSummary: z.boolean().optional(),
  layoutType: slideLayoutEnum.optional(),
  badge: z.string().trim().min(1).max(80).optional(),
  title: z.string().trim().min(1).max(240).optional(),
  subtitle: z.string().trim().max(1e3).optional(),
  contentJson: slideContentSchema.optional()
});
function setSessionCookie(res, user) {
  const token = createSessionToken({ uid: user.id, role: user.role });
  res.cookie(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 1e3 * 60 * 60 * 24 * 7
  });
}
async function resolveCurrentUser(req, repo) {
  var _a2;
  const rawToken = (_a2 = req.cookies) == null ? void 0 : _a2[SESSION_COOKIE_NAME];
  const session = verifySessionToken(rawToken);
  if (!session) return null;
  return repo.getUserById(session.uid);
}
async function requireMentor(req, res, repo) {
  const currentUser = await resolveCurrentUser(req, repo);
  if (!currentUser || currentUser.role !== "mentor") {
    res.status(403).json({ error: "Akses ditolak. Hanya Mentor yang memiliki izin ini." });
    return null;
  }
  return currentUser;
}
function parsePositiveInt(raw) {
  const n = Number(raw);
  return Number.isInteger(n) && n > 0 ? n : null;
}
function createServerApp(repo, options) {
  const app = express();
  const isProd = (options == null ? void 0 : options.isProd) ?? false;
  const mentorProfile = (options == null ? void 0 : options.mentorProfile) ?? DEFAULT_MENTOR_PROFILE;
  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser());
  app.get("/api/bootstrap", async (req, res, next) => {
    try {
      const currentUser = await resolveCurrentUser(req, repo);
      const data = await repo.getBootstrapData(currentUser, mentorProfile);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });
  app.get("/api/modules/:slug", async (req, res, next) => {
    try {
      const currentUser = await resolveCurrentUser(req, repo);
      const detail = await repo.getModuleDetail(req.params.slug, currentUser, mentorProfile);
      if (!detail) {
        res.status(404).json({ error: "Modul pertemuan tidak ditemukan." });
        return;
      }
      res.status(200).json(detail);
    } catch (err) {
      next(err);
    }
  });
  app.post("/api/auth/register", async (req, res, next) => {
    try {
      const parsed = registerSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: "Data registrasi tidak valid.",
          details: parsed.error.flatten()
        });
        return;
      }
      const user = await repo.registerStudent(parsed.data);
      setSessionCookie(res, user);
      res.status(200).json({ user });
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === "EMAIL_ALREADY_REGISTERED") {
          res.status(409).json({
            error: "Email sudah terdaftar. Silakan masuk menggunakan kata sandi."
          });
          return;
        }
        if (err.message === "MENTOR_EMAIL_CONFLICT") {
          res.status(409).json({
            error: "Email ini terdaftar sebagai akun Mentor. Silakan masuk melalui Login Admin."
          });
          return;
        }
      }
      next(err);
    }
  });
  app.post("/api/auth/login", async (req, res, next) => {
    try {
      const parsed = studentLoginSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: "Email atau kata sandi tidak valid.",
          details: parsed.error.flatten()
        });
        return;
      }
      const user = await repo.loginStudent(parsed.data);
      if (!user) {
        res.status(401).json({ error: "Email atau kata sandi salah." });
        return;
      }
      setSessionCookie(res, user);
      res.status(200).json({ user });
    } catch (err) {
      next(err);
    }
  });
  app.post("/api/auth/mentor-login", async (req, res, next) => {
    try {
      const parsed = mentorLoginSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: "Email atau passcode tidak valid.",
          details: parsed.error.flatten()
        });
        return;
      }
      const mentor = await repo.verifyMentorLogin(parsed.data);
      if (!mentor) {
        res.status(401).json({ error: "Email atau passcode mentor salah." });
        return;
      }
      setSessionCookie(res, mentor);
      res.status(200).json({ user: mentor });
    } catch (err) {
      next(err);
    }
  });
  app.post("/api/auth/logout", (_req, res) => {
    res.clearCookie(SESSION_COOKIE_NAME, { path: "/" });
    res.status(200).json({ ok: true });
  });
  app.post("/api/tasks/submit", async (req, res, next) => {
    try {
      const currentUser = await resolveCurrentUser(req, repo);
      if (!currentUser) {
        res.status(401).json({ error: "Silakan masuk terlebih dahulu untuk mengumpulkan task." });
        return;
      }
      if (currentUser.role !== "user") {
        res.status(403).json({ error: "Hanya peserta bootcamp yang dapat mengumpulkan task." });
        return;
      }
      const parsed = submitTaskSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: "Data task submission tidak valid.",
          details: parsed.error.flatten()
        });
        return;
      }
      const submission = await repo.submitTask(currentUser.id, parsed.data);
      res.status(200).json({ submission });
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === "MODULE_LOCKED") {
          res.status(403).json({
            error: "Pertemuan masih terkunci. Dapatkan ACC Mentor pada pertemuan sebelumnya terlebih dahulu."
          });
          return;
        }
        if (err.message === "MODULE_NOT_FOUND") {
          res.status(404).json({ error: "Modul pertemuan tidak ditemukan." });
          return;
        }
        if (err.message === "MODULE_NOT_SUBMITTABLE") {
          res.status(400).json({ error: "Modul panduan/referensi tidak memerlukan pengumpulan task." });
          return;
        }
      }
      next(err);
    }
  });
  app.get("/api/mentor/dashboard", async (req, res, next) => {
    try {
      const mentor = await requireMentor(req, res, repo);
      if (!mentor) return;
      const dashboard = await repo.getMentorDashboard(mentor);
      res.status(200).json(dashboard);
    } catch (err) {
      next(err);
    }
  });
  app.post("/api/mentor/review", async (req, res, next) => {
    try {
      const mentor = await requireMentor(req, res, repo);
      if (!mentor) return;
      const parsed = reviewSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: "Data review tidak valid.",
          details: parsed.error.flatten()
        });
        return;
      }
      const result = await repo.reviewSubmission({
        submissionId: parsed.data.submissionId,
        status: parsed.data.status,
        mentorFeedback: parsed.data.mentorFeedback,
        reviewerName: mentor.name
      });
      res.status(200).json(result);
    } catch (err) {
      if (err instanceof Error && err.message === "SUBMISSION_NOT_FOUND") {
        res.status(404).json({ error: "Task submission tidak ditemukan." });
        return;
      }
      next(err);
    }
  });
  app.post("/api/mentor/unlock", async (req, res, next) => {
    try {
      const mentor = await requireMentor(req, res, repo);
      if (!mentor) return;
      const parsed = unlockSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: "Payload unlock tidak valid.",
          details: parsed.error.flatten()
        });
        return;
      }
      await repo.setManualUnlock(parsed.data);
      res.status(200).json({ ok: true });
    } catch (err) {
      if (err instanceof Error && err.message === "NOT_FOUND") {
        res.status(404).json({ error: "Peserta atau modul tidak ditemukan." });
        return;
      }
      next(err);
    }
  });
  app.patch("/api/mentor/modules/:id", async (req, res, next) => {
    try {
      const mentor = await requireMentor(req, res, repo);
      if (!mentor) return;
      const moduleId = parsePositiveInt(req.params.id);
      if (!moduleId) {
        res.status(400).json({ error: "ID modul tidak valid." });
        return;
      }
      const parsed = updateModuleContentSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: "Data pembaruan modul tidak valid.",
          details: parsed.error.flatten()
        });
        return;
      }
      await repo.updateModuleContent(moduleId, parsed.data);
      res.status(200).json({ ok: true });
    } catch (err) {
      if (err instanceof Error && err.message === "MODULE_NOT_FOUND") {
        res.status(404).json({ error: "Modul tidak ditemukan." });
        return;
      }
      next(err);
    }
  });
  app.get("/api/admin/analytics", async (req, res, next) => {
    try {
      const mentor = await requireMentor(req, res, repo);
      if (!mentor) return;
      const analytics = await repo.getAnalytics();
      res.status(200).json(analytics);
    } catch (err) {
      next(err);
    }
  });
  app.post("/api/admin/modules", async (req, res, next) => {
    try {
      const mentor = await requireMentor(req, res, repo);
      if (!mentor) return;
      const parsed = createModuleSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: "Data pembuatan modul tidak valid.",
          details: parsed.error.flatten()
        });
        return;
      }
      const mod = await repo.createModule(parsed.data);
      res.status(200).json({ ...mod, module: mod, ok: true });
    } catch (err) {
      if (err instanceof Error && err.message === "MODULE_CONFLICT") {
        res.status(409).json({ error: "Nomor urutan atau slug modul sudah digunakan." });
        return;
      }
      next(err);
    }
  });
  app.patch("/api/admin/modules/:id", async (req, res, next) => {
    try {
      const mentor = await requireMentor(req, res, repo);
      if (!mentor) return;
      const moduleId = parsePositiveInt(req.params.id);
      if (!moduleId) {
        res.status(400).json({ error: "ID modul tidak valid." });
        return;
      }
      const parsed = adminUpdateModuleSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: "Data pembaruan modul tidak valid.",
          details: parsed.error.flatten()
        });
        return;
      }
      const mod = await repo.updateModule(moduleId, parsed.data);
      res.status(200).json({ ...mod, module: mod, ok: true });
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === "MODULE_NOT_FOUND") {
          res.status(404).json({ error: "Modul tidak ditemukan." });
          return;
        }
        if (err.message === "MODULE_CONFLICT") {
          res.status(409).json({ error: "Nomor urutan atau slug modul sudah digunakan." });
          return;
        }
      }
      next(err);
    }
  });
  app.delete("/api/admin/modules/:id", async (req, res, next) => {
    try {
      const mentor = await requireMentor(req, res, repo);
      if (!mentor) return;
      const moduleId = parsePositiveInt(req.params.id);
      if (!moduleId) {
        res.status(400).json({ error: "ID modul tidak valid." });
        return;
      }
      await repo.deleteModule(moduleId);
      res.status(200).json({ ok: true });
    } catch (err) {
      if (err instanceof Error && err.message === "MODULE_NOT_FOUND") {
        res.status(404).json({ error: "Modul tidak ditemukan." });
        return;
      }
      next(err);
    }
  });
  app.get("/api/admin/modules/:id/slides", async (req, res, next) => {
    try {
      const mentor = await requireMentor(req, res, repo);
      if (!mentor) return;
      const moduleId = parsePositiveInt(req.params.id);
      if (!moduleId) {
        res.status(400).json({ error: "ID modul tidak valid." });
        return;
      }
      const slides2 = await repo.getModuleSlidesAdmin(moduleId);
      res.status(200).json({ slides: slides2 });
    } catch (err) {
      if (err instanceof Error && err.message === "MODULE_NOT_FOUND") {
        res.status(404).json({ error: "Modul tidak ditemukan." });
        return;
      }
      next(err);
    }
  });
  app.post("/api/admin/modules/:id/slides", async (req, res, next) => {
    try {
      const mentor = await requireMentor(req, res, repo);
      if (!mentor) return;
      const moduleId = parsePositiveInt(req.params.id);
      if (!moduleId) {
        res.status(400).json({ error: "ID modul tidak valid." });
        return;
      }
      const parsed = createSlideSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: "Data pembuatan slide tidak valid.",
          details: parsed.error.flatten()
        });
        return;
      }
      const slide = await repo.createSlide(moduleId, parsed.data);
      res.status(200).json({ ...slide, slide, ok: true });
    } catch (err) {
      if (err instanceof Error && err.message === "MODULE_NOT_FOUND") {
        res.status(404).json({ error: "Modul tidak ditemukan." });
        return;
      }
      next(err);
    }
  });
  app.patch("/api/admin/slides/:id", async (req, res, next) => {
    try {
      const mentor = await requireMentor(req, res, repo);
      if (!mentor) return;
      const slideId = parsePositiveInt(req.params.id);
      if (!slideId) {
        res.status(400).json({ error: "ID slide tidak valid." });
        return;
      }
      const parsed = updateSlideSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: "Data pembaruan slide tidak valid.",
          details: parsed.error.flatten()
        });
        return;
      }
      const slide = await repo.updateSlide(slideId, parsed.data);
      res.status(200).json({ ...slide, slide, ok: true });
    } catch (err) {
      if (err instanceof Error && err.message === "SLIDE_NOT_FOUND") {
        res.status(404).json({ error: "Slide tidak ditemukan." });
        return;
      }
      next(err);
    }
  });
  app.delete("/api/admin/slides/:id", async (req, res, next) => {
    try {
      const mentor = await requireMentor(req, res, repo);
      if (!mentor) return;
      const slideId = parsePositiveInt(req.params.id);
      if (!slideId) {
        res.status(400).json({ error: "ID slide tidak valid." });
        return;
      }
      await repo.deleteSlide(slideId);
      res.status(200).json({ ok: true });
    } catch (err) {
      if (err instanceof Error && err.message === "SLIDE_NOT_FOUND") {
        res.status(404).json({ error: "Slide tidak ditemukan." });
        return;
      }
      next(err);
    }
  });
  app.all("/api/*", (_req, res) => {
    res.status(404).json({ error: "Endpoint API tidak ditemukan." });
  });
  if (options == null ? void 0 : options.vite) {
    app.use(options.vite.middlewares);
  } else if (isProd) {
    app.use(
      express.static(path.resolve(process.cwd(), "dist/client"), {
        index: false
      })
    );
  }
  app.get("*", async (req, res, next) => {
    try {
      const url = req.originalUrl;
      const currentUser = await resolveCurrentUser(req, repo);
      let template;
      let render;
      if (options == null ? void 0 : options.vite) {
        const rawHtml = await fs.readFile(path.resolve(process.cwd(), "index.html"), "utf8");
        template = await options.vite.transformIndexHtml(url, rawHtml);
        const mod = await options.vite.ssrLoadModule("/src/entry-server.tsx");
        render = mod.render;
      } else {
        template = await fs.readFile(
          path.resolve(process.cwd(), "dist/client/index.html"),
          "utf8"
        );
        const serverEntryUrl = pathToFileURL(
          path.resolve(process.cwd(), "dist/server/entry-server.js")
        ).href;
        const mod = await import(serverEntryUrl);
        render = mod.render;
      }
      const { html: appHtml, dehydratedState } = await render(url, currentUser, repo);
      const serializedState = JSON.stringify(dehydratedState).replace(/</g, "\\u003c");
      const stateScript = `<script>window.__TANSTACK_STATE__ = ${serializedState};<\/script>`;
      const fullHtml = template.replace("<!--app-html-->", appHtml).replace("<!--app-state-->", stateScript);
      res.status(200).set({ "Content-Type": "text/html" }).end(fullHtml);
    } catch (err) {
      if ((options == null ? void 0 : options.vite) && err instanceof Error) {
        options.vite.ssrFixStacktrace(err);
      }
      next(err);
    }
  });
  app.use((err, _req, res, _next) => {
    console.error("[server] Unhandled error:", err instanceof Error ? err.message : err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Terjadi kesalahan internal pada server." });
    }
  });
  return app;
}
async function startServer() {
  const isProd = process.argv.includes("--prod") || process.env.NODE_ENV === "production";
  const port = Number(process.env.PORT) || 3e3;
  const repo = await createBootcampRepository();
  const mentorProfile = MENTOR_PROFILE;
  const bootstrap = await repo.getBootstrapData(null, mentorProfile);
  if (bootstrap.modules.length === 0) {
    await repo.ensureSeeded(ALL_SEED_MODULES, DEFAULT_MENTOR_USER);
  }
  let vite;
  if (!isProd) {
    const { createServer: createViteServer } = await import("vite");
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom"
    });
  }
  const app = createServerApp(repo, { isProd, vite, mentorProfile });
  const httpServer = app.listen(port, () => {
    console.log(
      `[server] Digitek Bootcamp SSR Server (${isProd ? "prod" : "dev"}, db=${repo.kind}) running at http://localhost:${port}`
    );
  });
  let shuttingDown = false;
  const shutdown = async (signal) => {
    if (shuttingDown) return;
    shuttingDown = true;
    console.log(`[server] Received ${signal}, shutting down...`);
    await (vite == null ? void 0 : vite.close().catch(() => void 0));
    httpServer.close(() => {
      process.exit(0);
    });
    setTimeout(() => process.exit(0), 3e3).unref();
  };
  process.once("SIGINT", () => {
    void shutdown("SIGINT");
  });
  process.once("SIGTERM", () => {
    void shutdown("SIGTERM");
  });
}
const isMainEntry = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href || Boolean((_a = process.argv[1]) == null ? void 0 : _a.endsWith("server.ts"));
if (isMainEntry) {
  startServer().catch((err) => {
    console.error("[server] Fatal startup error:", err instanceof Error ? err.message : err);
    process.exit(1);
  });
}
let cachedAppPromise = null;
async function getApp() {
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
async function handler(req, res) {
  try {
    const app = await getApp();
    return app(req, res);
  } catch (err) {
    cachedAppPromise = null;
    const message = err instanceof Error ? err.message : "Server initialization failed";
    console.error("[vercel-handler] Error:", message);
    return res.status(500).json({ error: message });
  }
}
export {
  handler as default
};
