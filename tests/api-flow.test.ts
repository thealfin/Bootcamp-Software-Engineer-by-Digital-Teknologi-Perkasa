import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createServerApp } from '../server';
import { createBootcampRepository, type BootcampRepository } from '../src/db/repository';
import type { SeedModuleInput, SeedSlideInput } from '../src/types/bootcamp';

function makeMockSlides(code: string): SeedSlideInput[] {
  const summarySlides: SeedSlideInput[] = [1, 2, 3].map((n) => ({
    slideNumber: n,
    isSummary: true,
    layoutType: n === 1 ? 'cover' : 'summary',
    badge: `${code} Ringkasan ${n}`,
    title: `${code} Summary Slide ${n}`,
    subtitle: `Ringkasan materi ${code} bagian ${n}`,
    contentJson: {
      highlights: [`Poin ringkasan ${n} untuk ${code}`],
    },
  }));

  const fullSlides: SeedSlideInput[] = [4, 5].map((n) => ({
    slideNumber: n,
    isSummary: false,
    layoutType: n === 4 ? 'practice' : 'task',
    badge: `${code} Materi Penuh ${n}`,
    title: `${code} Full Slide ${n}`,
    subtitle: `Materi mendalam ${code} bagian ${n}`,
    contentJson: {
      highlights: [`Detail praktik ${n} untuk ${code}`],
    },
  }));

  return [...summarySlides, ...fullSlides];
}

const MOCK_MODULES: SeedModuleInput[] = [
  {
    orderIndex: 1,
    month: 1,
    slug: 'pertemuan-01-kickoff-web',
    code: 'P01',
    sessionType: 'Kickoff',
    title: 'Kickoff & Web Architecture',
    subtitle: 'Pengenalan ekosistem web modern',
    summaryText: 'Ringkasan Pertemuan 01.',
    taskPrompt: 'Buat halaman profil HTML5 semantic dan push ke GitHub.',
    taskDeliverables: ['Repo GitHub', 'Learning Log'],
    accentGradient: 'from-sky-500 to-indigo-600',
    iconName: 'RocketLaunch',
    slides: makeMockSlides('P01'),
  },
  {
    orderIndex: 2,
    month: 1,
    slug: 'pertemuan-02-css-layout',
    code: 'P02',
    sessionType: 'Materi',
    title: 'Modern CSS, Flexbox & Grid',
    subtitle: 'Membangun layout responsif TaskFlow',
    summaryText: 'Ringkasan Pertemuan 02.',
    taskPrompt: 'Implementasikan layout dashboard TaskFlow menggunakan Grid & Flexbox.',
    taskDeliverables: ['Commit CSS Layout', 'Learning Log'],
    accentGradient: 'from-violet-500 to-purple-600',
    iconName: 'Layout',
    slides: makeMockSlides('P02'),
  },
  {
    orderIndex: 3,
    month: 1,
    slug: 'pertemuan-03-javascript-dom',
    code: 'P03',
    sessionType: 'Praktik',
    title: 'JavaScript ES6+ & DOM',
    subtitle: 'Interaktivitas sisi klien',
    summaryText: 'Ringkasan Pertemuan 03.',
    taskPrompt: 'Tambahkan filter & state lokal pada TaskFlow.',
    taskDeliverables: ['Commit JS DOM', 'Learning Log'],
    accentGradient: 'from-emerald-500 to-teal-600',
    iconName: 'Code',
    slides: makeMockSlides('P03'),
  },
];

const MOCK_MENTOR = {
  name: 'Alfin Almustajab',
  email: 'alfin@digitek.id',
  schoolOrigin: 'PT. Digital Teknologi Perkasa',
  role: 'mentor' as const,
};

describe('Bootcamp API End-to-End Flow', () => {
  const tmpFile = path.join(os.tmpdir(), `bootcamp-test-${Date.now()}-${Math.random()}.json`);
  let repo: BootcampRepository;
  let app: ReturnType<typeof createServerApp>;

  const createAgent = () => request.agent(app);

  beforeAll(async () => {
    repo = await createBootcampRepository({
      forceLocal: true,
      localFilePath: tmpFile,
    });
    expect(repo.kind).toBe('local');
    const seeded = await repo.ensureSeeded(MOCK_MODULES, MOCK_MENTOR);
    expect(seeded.totalModules).toBe(3);
    expect(seeded.totalSlides).toBe(15);
    app = createServerApp(repo, { isProd: false });
  });

  afterAll(async () => {
    await fs.rm(tmpFile, { force: true });
  });

  it('restricts Guest to 3 summary slides only and blocks protected mentor/admin endpoints', async () => {
    const boot = await request(app).get('/api/bootstrap').expect(200);
    expect(boot.body.user).toBeNull();
    expect(boot.body.modules).toHaveLength(3);
    expect(boot.body.modules[0].accessLevel).toBe('SUMMARY_ONLY');

    const p01 = await request(app).get('/api/modules/pertemuan-01-kickoff-web').expect(200);
    expect(p01.body.accessLevel).toBe('SUMMARY_ONLY');
    expect(p01.body.totalSlidesCount).toBe(5);
    expect(p01.body.summarySlidesCount).toBe(3);
    expect(p01.body.slides).toHaveLength(3);
    expect(p01.body.slides.every((s: { isSummary: boolean }) => s.isSummary)).toBe(true);
    expect(p01.body.canSubmitTask).toBe(false);

    await request(app).get('/api/mentor/dashboard').expect(403);
    await request(app).get('/api/admin/analytics').expect(403);
    await request(app).get('/api/admin/modules/1/slides').expect(403);
    await request(app)
      .post('/api/tasks/submit')
      .send({
        moduleId: 1,
        repoUrl: 'https://github.com/student/taskflow',
        learningLog: 'Belajar dasar web.',
      })
      .expect(401);
  });

  it('handles student password registration, logout, login validation, and duplicate prevention', async () => {
    const student = createAgent();

    // Password too short (< 8 chars) -> 400
    await student
      .post('/api/auth/register')
      .send({
        name: 'Rina Wijaya',
        email: 'rina@smk2.sch.id',
        schoolOrigin: 'SMKN 2 Bandung',
        password: 'short',
      })
      .expect(400);

    // Mentor email hijack -> 409
    await student
      .post('/api/auth/register')
      .send({
        name: 'Fake Mentor',
        email: 'alfin@digitek.id',
        schoolOrigin: 'Unknown',
        password: 'password123',
      })
      .expect(409);

    // Register with valid password -> 200
    const regRes = await student
      .post('/api/auth/register')
      .send({
        name: 'Rina Wijaya',
        email: 'rina@smk2.sch.id',
        schoolOrigin: 'SMKN 2 Bandung',
        password: 'rina-password-2026',
      })
      .expect(200);

    expect(regRes.body.user.role).toBe('user');
    expect(regRes.body.user.passwordHash).toBeUndefined();

    // Duplicate register on already-registered email -> 409
    const dupRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Rina Clone',
        email: 'RINA@smk2.sch.id',
        schoolOrigin: 'SMKN 2 Bandung',
        password: 'another-password-123',
      })
      .expect(409);
    expect(dupRes.body.error).toContain('Email sudah terdaftar');

    // Logout -> clears session
    await student.post('/api/auth/logout').expect(200);
    const bootGuest = await student.get('/api/bootstrap').expect(200);
    expect(bootGuest.body.user).toBeNull();

    // Login with wrong password -> 401
    await student
      .post('/api/auth/login')
      .send({
        email: 'rina@smk2.sch.id',
        password: 'wrong-password-999',
      })
      .expect(401);

    // Login with unknown email -> 401
    await student
      .post('/api/auth/login')
      .send({
        email: 'tidakada@smk2.sch.id',
        password: 'rina-password-2026',
      })
      .expect(401);

    // Login with right password -> 200 & sets cookie
    const loginRes = await student
      .post('/api/auth/login')
      .send({
        email: 'rina@smk2.sch.id',
        password: 'rina-password-2026',
      })
      .expect(200);
    expect(loginRes.body.user.email).toBe('rina@smk2.sch.id');
    expect(loginRes.body.user.passwordHash).toBeUndefined();

    const bootLogged = await student.get('/api/bootstrap').expect(200);
    expect(bootLogged.body.user?.email).toBe('rina@smk2.sch.id');
  });

  it('runs task submission, mentor ACC, auto-unlock, revision, manual override, and analytics', async () => {
    const student = createAgent();
    const mentor = createAgent();

    // Login as Rina from previous test
    const loginRes = await student
      .post('/api/auth/login')
      .send({
        email: 'rina@smk2.sch.id',
        password: 'rina-password-2026',
      })
      .expect(200);
    const studentId = loginRes.body.user.id as number;

    // Register a second student from another school (no submissions yet)
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Dimas Pratama',
        email: 'dimas@smkn4.sch.id',
        schoolOrigin: 'SMKN 4 Malang',
        password: 'dimas-password-2026',
      })
      .expect(200);

    const p01Detail = await student.get('/api/modules/pertemuan-01-kickoff-web').expect(200);
    expect(p01Detail.body.accessLevel).toBe('FULL_ACCESS');
    expect(p01Detail.body.canSubmitTask).toBe(true);
    expect(p01Detail.body.slides).toHaveLength(5);

    const p02Locked = await student.get('/api/modules/pertemuan-02-css-layout').expect(200);
    expect(p02Locked.body.accessLevel).toBe('LOCKED_PREV_TASK');
    expect(p02Locked.body.slides).toHaveLength(3);

    // Student cannot access mentor/admin endpoints
    await student.get('/api/mentor/dashboard').expect(403);
    await student.get('/api/admin/analytics').expect(403);

    // Student submits P01 task -> pending
    const submitP01 = await student
      .post('/api/tasks/submit')
      .send({
        moduleId: p01Detail.body.module.id,
        repoUrl: 'https://github.com/rina/taskflow-p01',
        demoUrl: 'https://rina-p01.vercel.app',
        learningLog: 'Memahami struktur semantic HTML5 dan alur HTTP.',
      })
      .expect(200);
    const p01SubmissionId = submitP01.body.submission.id as number;

    // Mentor logs in
    await mentor
      .post('/api/auth/mentor-login')
      .send({ email: 'alfin@digitek.id', passcode: 'wrong-passcode' })
      .expect(401);

    await mentor
      .post('/api/auth/mentor-login')
      .send({
        email: 'alfin@digitek.id',
        passcode: process.env.MENTOR_PASSCODE || 'digitek-mentor-2026',
      })
      .expect(200);

    // Mentor approves P01 -> P02 auto-unlocks
    const approveRes = await mentor
      .post('/api/mentor/review')
      .send({
        submissionId: p01SubmissionId,
        status: 'approved',
        mentorFeedback: 'Struktur HTML semantic rapi.',
      })
      .expect(200);
    expect(approveRes.body.unlockedNextModuleSlug).toBe('pertemuan-02-css-layout');

    const p02Unlocked = await student.get('/api/modules/pertemuan-02-css-layout').expect(200);
    expect(p02Unlocked.body.accessLevel).toBe('FULL_ACCESS');
    expect(p02Unlocked.body.slides).toHaveLength(5);

    // Student submits P02 -> Mentor requests revision
    const submitP02 = await student
      .post('/api/tasks/submit')
      .send({
        moduleId: p02Unlocked.body.module.id,
        repoUrl: 'https://github.com/rina/taskflow-p02',
        learningLog: 'Membuat layout dashboard dengan CSS Grid.',
      })
      .expect(200);

    await mentor
      .post('/api/mentor/review')
      .send({
        submissionId: submitP02.body.submission.id,
        status: 'revision',
        mentorFeedback: 'Perbaiki responsive breakpoint di mobile 375px.',
      })
      .expect(200);

    // Manual unlock & lock P03
    const p03Before = await student.get('/api/modules/pertemuan-03-javascript-dom').expect(200);
    await mentor
      .post('/api/mentor/unlock')
      .send({ userId: studentId, moduleId: p03Before.body.module.id, unlocked: true })
      .expect(200);

    const p03Open = await student.get('/api/modules/pertemuan-03-javascript-dom').expect(200);
    expect(p03Open.body.accessLevel).toBe('FULL_ACCESS');

    await mentor
      .post('/api/mentor/unlock')
      .send({ userId: studentId, moduleId: p03Before.body.module.id, unlocked: false })
      .expect(200);

    // Legacy PATCH /api/mentor/modules/:id still works
    await mentor
      .patch(`/api/mentor/modules/${p01Detail.body.module.id}`)
      .send({
        summaryText: 'Ringkasan Pertemuan 01 diperbarui.',
        taskPrompt: 'Prompt tugas P01 diperbarui.',
        taskDeliverables: ['Repo GitHub Updated', 'Learning Log Updated'],
      })
      .expect(200);

    // Admin Analytics accuracy check
    const analyticsRes = await mentor.get('/api/admin/analytics').expect(200);
    const analytics = analyticsRes.body;

    expect(analytics.kpis.totalStudents).toBe(2);
    expect(analytics.kpis.activeStudents7d).toBe(1);
    expect(analytics.kpis.totalSubmissions).toBe(2);
    expect(analytics.kpis.revisionRatePercent).toBe(50);
    expect(analytics.kpis.avgProgressPercent).toBe(17); // (33 + 0) / 2 = 16.5 -> 17
    expect(typeof analytics.kpis.avgReviewHours).toBe('number');

    expect(analytics.studentPerformance).toHaveLength(2);
    expect(analytics.studentPerformance[0].email).toBe('rina@smk2.sch.id');
    expect(analytics.studentPerformance[0].approvedCount).toBe(1);
    expect(analytics.studentPerformance[0].revisionCount).toBe(1);
    expect(analytics.studentPerformance[0].progressPercent).toBe(33);

    expect(analytics.moduleDifficulty).toHaveLength(3);
    const p02Diff = analytics.moduleDifficulty.find((m: { code: string }) => m.code === 'P02');
    expect(p02Diff).toMatchObject({
      submissionsCount: 1,
      approvedCount: 0,
      revisionCount: 1,
      revisionRatePercent: 100,
    });

    expect(analytics.schoolBreakdown).toHaveLength(2);
    expect(analytics.weeklyTrend).toHaveLength(8);
    expect(analytics.weeklyTrend[7]).toMatchObject({
      submissions: 2,
      approvals: 1,
    });
  });

  it('enforces RBAC and supports full Admin CRUD for modules and slides with sequential renumbering', async () => {
    const student = createAgent();
    const mentor = createAgent();

    await student
      .post('/api/auth/login')
      .send({ email: 'rina@smk2.sch.id', password: 'rina-password-2026' })
      .expect(200);

    await mentor
      .post('/api/auth/mentor-login')
      .send({
        email: 'alfin@digitek.id',
        passcode: process.env.MENTOR_PASSCODE || 'digitek-mentor-2026',
      })
      .expect(200);

    const newModulePayload = {
      orderIndex: 4,
      month: 1,
      slug: 'pertemuan-04-typescript',
      code: 'P04',
      sessionType: 'Materi',
      title: 'TypeScript Fundamental',
      subtitle: 'Static typing untuk aplikasi web',
      summaryText: 'Ringkasan materi TypeScript.',
      taskPrompt: 'Konversi modul utilitas ke TypeScript.',
      taskDeliverables: ['Repo TypeScript', 'Learning Log'],
    };

    // Student blocked from all admin CRUD endpoints (403)
    await student.post('/api/admin/modules').send(newModulePayload).expect(403);
    await student.patch('/api/admin/modules/1').send({ title: 'Hack' }).expect(403);
    await student.delete('/api/admin/modules/1').expect(403);
    await student.get('/api/admin/modules/1/slides').expect(403);
    await student
      .post('/api/admin/modules/1/slides')
      .send({
        isSummary: true,
        layoutType: 'cover',
        badge: 'Hack',
        title: 'Hack',
        subtitle: 'Hack',
        contentJson: { highlights: ['x'] },
      })
      .expect(403);
    await student.patch('/api/admin/slides/1').send({ title: 'Hack' }).expect(403);
    await student.delete('/api/admin/slides/1').expect(403);

    // Mentor creates module P04 -> 200
    const createdModRes = await mentor
      .post('/api/admin/modules')
      .send(newModulePayload)
      .expect(200);
    const createdModuleId = createdModRes.body.id as number;
    expect(createdModuleId).toBeGreaterThan(0);
    expect(createdModRes.body.code).toBe('P04');

    // Duplicate orderIndex/slug -> 409
    await mentor.post('/api/admin/modules').send(newModulePayload).expect(409);

    // Mentor updates module metadata -> 200
    const updatedModRes = await mentor
      .patch(`/api/admin/modules/${createdModuleId}`)
      .send({
        title: 'TypeScript & Strict Mode',
        subtitle: 'Menjaga kontrak tipe di frontend dan backend',
      })
      .expect(200);
    expect(updatedModRes.body.title).toBe('TypeScript & Strict Mode');

    // Mentor creates 3 slides on P04 (auto-numbered 1, 2, 3)
    const s1 = await mentor
      .post(`/api/admin/modules/${createdModuleId}/slides`)
      .send({
        isSummary: true,
        layoutType: 'cover',
        badge: 'P04 Cover',
        title: 'Slide Satu',
        subtitle: 'Pengantar',
        contentJson: { highlights: ['Poin 1'] },
      })
      .expect(200);
    expect(s1.body.slideNumber).toBe(1);

    const s2 = await mentor
      .post(`/api/admin/modules/${createdModuleId}/slides`)
      .send({
        isSummary: true,
        layoutType: 'summary',
        badge: 'P04 Ringkasan',
        title: 'Slide Dua',
        subtitle: 'Konsep inti',
        contentJson: { highlights: ['Poin 2'] },
      })
      .expect(200);
    expect(s2.body.slideNumber).toBe(2);

    const s3 = await mentor
      .post(`/api/admin/modules/${createdModuleId}/slides`)
      .send({
        isSummary: false,
        layoutType: 'practice',
        badge: 'P04 Praktik',
        title: 'Slide Tiga',
        subtitle: 'Latihan kode',
        contentJson: { highlights: ['Poin 3'] },
      })
      .expect(200);
    expect(s3.body.slideNumber).toBe(3);

    // Mentor swaps Slide 2 to slideNumber 1 and updates title -> 200
    await mentor
      .patch(`/api/admin/slides/${s2.body.id}`)
      .send({ slideNumber: 1, title: 'Slide Dua Jadi Pertama' })
      .expect(200);

    const slidesAfterSwap = await mentor
      .get(`/api/admin/modules/${createdModuleId}/slides`)
      .expect(200);
    expect(slidesAfterSwap.body.slides.map((s: { slideNumber: number }) => s.slideNumber)).toEqual([
      1, 2, 3,
    ]);
    expect(slidesAfterSwap.body.slides[0].title).toBe('Slide Dua Jadi Pertama');

    // Mentor deletes slide #1 -> remaining slides renumber to 1..2
    await mentor.delete(`/api/admin/slides/${s2.body.id}`).expect(200);

    const slidesAfterDelete = await mentor
      .get(`/api/admin/modules/${createdModuleId}/slides`)
      .expect(200);
    expect(slidesAfterDelete.body.slides).toHaveLength(2);
    expect(
      slidesAfterDelete.body.slides.map((s: { slideNumber: number }) => s.slideNumber),
    ).toEqual([1, 2]);
    expect(slidesAfterDelete.body.slides[0].id).toBe(s1.body.id);
    expect(slidesAfterDelete.body.slides[1].id).toBe(s3.body.id);

    // Mentor deletes module P04 -> 200, module no longer exists
    await mentor.delete(`/api/admin/modules/${createdModuleId}`).expect(200);
    await mentor.get(`/api/modules/pertemuan-04-typescript`).expect(404);
  });
});
