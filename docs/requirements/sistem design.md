# System Design Document (`sistem design.md`)
## Digitek Software Engineering Bootcamp — React + TanStack SSR + Drizzle ORM + Neon DB

| Komponen Arsitektur | Teknologi yang Digunakan |
| :--- | :--- |
| **UI Library** | React 19 (TypeScript) |
| **Routing & SSR Hydration** | TanStack Router (`@tanstack/react-router`) + TanStack Query (`@tanstack/react-query`) |
| **SSR Runtime & Bundler** | Node.js / Express SSR Server + Vite SSR Pipeline (Package Manager: **`pnpm`**) |
| **ORM & Schema Management** | Drizzle ORM (`drizzle-orm`, `drizzle-kit`) |
| **Cloud Database** | Neon Serverless PostgreSQL (`@neondatabase/serverless`) + Local Persistent Fallback Engine |
| **Styling & Design System** | Tailwind CSS + Custom Apple macOS Glass & Traffic-Light Component Styles (`Plus Jakarta Sans`) |

---

## 1. Arsitektur Tingkat Tinggi (High-Level System Architecture)

```mermaid
flowchart TB
    subgraph Client["Browser Client (Hydrated React + TanStack)"]
        UI_Catalog["Halaman Katalog (/)<br/>Filter Bulan 1-3, Status Badge, Profil Mentor"]
        UI_Slide["Slide Deck Engine (/modul/$slug)<br/>3 Dot macOS, Summary Gate, Full Slide & Task Form"]
        UI_Mentor["Dashboard Mentor (/mentor)<br/>Tabel Peserta, Review Task & Tombol ACC"]
        TQ_Client["TanStack Query Client Cache<br/>(Hydrated from SSR __DEHYDRATED_STATE__)"]
    end

    subgraph Server["Node.js / Express + Vite SSR Server"]
        SSR_Handler["SSR Request Handler (entry-server.tsx)<br/>Prefetch Queries + Render React + Inject State"]
        API_Router["REST API Controller (/api/*)<br/>Auth, Modules, Slides, Task Submissions, Mentor ACC"]
        Access_Guard["Progressive Unlock & RBAC Engine<br/>Guest Summary Filter • Sequential Task Lock • Mentor Override"]
        Repo_Layer["Data Repository Layer (Drizzle + Hybrid Adapter)"]
    end

    subgraph DataLayer["Persistence Layer"]
        Drizzle["Drizzle ORM Schema (src/db/schema.ts)"]
        NeonDB[("Neon Serverless PostgreSQL<br/>(DATABASE_URL)")]
        LocalStore[("Local Persistent Store (.data/bootcamp-db.json)<br/>Auto-Fallback saat Offline/Tanpa DATABASE_URL")]
    end

    UI_Catalog & UI_Slide & UI_Mentor <--> TQ_Client
    TQ_Client <-->|"Initial HTML + Hydrated JSON"| SSR_Handler
    TQ_Client <-->|"JSON Mutations & Refetches"| API_Router
    SSR_Handler --> Access_Guard
    API_Router --> Access_Guard
    Access_Guard --> Repo_Layer
    Repo_Layer --> Drizzle
    Drizzle -->|"Cloud Production"| NeonDB
    Repo_Layer -.->|"Zero-Config Local Fallback"| LocalStore
```

---

## 2. Desain Skema Database (Drizzle ORM & Neon PostgreSQL)

### 2.1. Entity-Relationship Diagram (ERD)

```mermaid
erDiagram
    USERS ||--o{ TASK_SUBMISSIONS : "submits (1:N)"
    USERS ||--o{ MODULE_UNLOCKS : "receives_unlock (1:N)"
    MODULES ||--|{ SLIDES : "contains (1:N)"
    MODULES ||--o{ TASK_SUBMISSIONS : "has_submissions (1:N)"
    MODULES ||--o{ MODULE_UNLOCKS : "unlocked_for (1:N)"

    USERS {
        serial id PK
        varchar name "Nama Lengkap Peserta / Mentor"
        varchar email UK "Email Unik"
        varchar school_origin "Asal Sekolah / Universitas / Instansi"
        varchar role "'user' | 'mentor'"
        timestamp created_at
    }

    MODULES {
        serial id PK
        int order_index UK "0..16 (1..15 = Pertemuan 1..15)"
        int month "1, 2, 3, atau 0 (Overview/SideQuest)"
        varchar slug UK "pertemuan-01-kickoff-web-overview"
        varchar code "P01 .. P15"
        varchar session_type "Kickoff | Materi | Praktik | Project Clinic | Evaluasi"
        varchar title "Judul Pertemuan"
        varchar subtitle "Subjudul / Tema"
        text summary_text "Ringkasan untuk Katalog & Mode Guest"
        text task_prompt "Instruksi Tugas Praktik Pertemuan"
        jsonb task_deliverables "Checklist Deliverable & Format Learning Log"
        varchar accent_gradient "Kelas Gradien Kartu Katalog"
        varchar icon_name "Nama Ikon Phosphor"
    }

    SLIDES {
        serial id PK
        int module_id FK
        int slide_number "1..N"
        boolean is_summary "true = Terbuka bagi Guest & Locked User"
        varchar layout_type "cover | summary | bento | comparison | practice | quiz | references | task"
        varchar badge "Label Kategori Slide"
        varchar title "Judul Slide"
        text subtitle "Subjudul / Penjelasan Utama"
        jsonb content_json "Payload Konten Terstruktur (Cards, Good/Bad Code, Steps, Links)"
    }

    TASK_SUBMISSIONS {
        serial id PK
        int user_id FK
        int module_id FK
        varchar repo_url "Link Repository / Commit GitHub"
        varchar demo_url "Link Demo / Screenshot"
        text learning_log "Catatan Learning Log Peserta"
        varchar status "'pending' | 'approved' | 'revision'"
        text mentor_feedback "Catatan Review dari Mentor Alfin Almustajab"
        varchar reviewed_by "Alfin Almustajab"
        timestamp submitted_at
        timestamp reviewed_at
    }

    MODULE_UNLOCKS {
        serial id PK
        int user_id FK
        int module_id FK
        varchar unlocked_by "'SYSTEM_INITIAL' | 'MENTOR_ACC' | 'MENTOR_MANUAL'"
        timestamp unlocked_at
    }
```

### 2.2. Implementasi Skema Drizzle (`src/db/schema.ts`)

Skema ditulis dengan `drizzle-orm/pg-core` sehingga sepenuhnya kompatibel dengan `drizzle-kit push` / `drizzle-kit generate` ke database **Neon PostgreSQL**:

```typescript
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

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 160 }).notNull(),
  email: varchar('email', { length: 180 }).notNull().unique(),
  schoolOrigin: varchar('school_origin', { length: 200 }).notNull(),
  role: varchar('role', { length: 20 }).notNull().default('user'), // 'user' | 'mentor'
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
```

---

## 3. Alur Server-Side Rendering (SSR) dengan React & TanStack

1. **Incoming HTTP Request (`GET /` atau `GET /modul/:slug` atau `GET /mentor`)**:
   - Server membaca cookie sesi `bootcamp_uid` (jika pengguna sudah login sebagai `user` atau `mentor`).
   - Server membuat instance baru `QueryClient` dari `@tanstack/react-query`.
   - Server melakukan `queryClient.prefetchQuery` untuk data awal halaman (`bootstrapData` dan `moduleDetail` jika berada di rute `/modul/$slug`) langsung melalui lapisan repositori Drizzle/Neon.
2. **Server Filtering untuk Keamanan Materi Terkunci**:
   - Sebelum data slide diserialisasi ke dalam state TanStack Query SSR, `Access_Guard` memeriksa apakah pengguna berhak membuka slide lengkap (`isSummary == false`).
   - Jika pengguna adalah **Guest** atau **Peserta yang belum menyelesaikan/di-ACC task pada pertemuan sebelumnya**, server **hanya mengirimkan slide dengan `isSummary: true`** ditambah metadata status kunci (`accessStatus: 'GUEST_SUMMARY_ONLY' | 'LOCKED_PREV_TASK'`) sehingga materi penuh benar-benar terlindungi di sisi server.
3. **HTML Render & Hydration**:
   - Server mengeksekusi `renderToString` pada pohon komponen React + TanStack Router, menyuntikkan `dehydrate(queryClient)` ke `window.__TANSTACK_STATE__`, lalu mengirim HTML lengkap ke browser.
   - Di sisi browser (`entry-client.tsx`), `hydrateRoot` menghidrasi aplikasi secara mulus tanpa *flicker*.

---

## 4. Struktur Direktori Proyek

```text
BATCH 1/
├── PRD.md                                  # Product Requirements Document
├── PDD.md                                  # Product Design Document
├── Design.md                               # UI/UX & Apple macOS Slide Design System
├── SRS.md                                  # Software Requirements Specification
├── sistem design.md                        # System Architecture & Drizzle/Neon Design
├── package.json                            # Dependencies (React, TanStack, Drizzle, Neon, Express, Vite)
├── tsconfig.json                           # Konfigurasi TypeScript
├── vite.config.ts                          # Konfigurasi Vite Client & SSR Build
├── drizzle.config.ts                       # Konfigurasi Drizzle Kit untuk Neon Postgres
├── .env.example                            # Template variabel DATABASE_URL Neon
├── server.ts                               # Express SSR + REST API Server
├── index.html                              # Template HTML SSR (Plus Jakarta Sans, Phosphor Icons)
└── src/
    ├── entry-client.tsx                    # Client Hydration Entry
    ├── entry-server.tsx                    # Server SSR Entry (TanStack Query Dehydration)
    ├── router.tsx                          # TanStack Router Definitions (/, /modul/$slug, /mentor)
    ├── styles/
    │   └── app.css                         # Apple macOS Glass, 3 Traffic Dots & Slide Deck Styles
    ├── db/
    │   ├── schema.ts                       # Skema Tabel Drizzle ORM (PostgreSQL / Neon)
    │   ├── seed-data.ts                    # Data Lengkap 15 Pertemuan + Slide + Profil Alfin Almustajab
    │   └── repository.ts                   # Layanan Data Drizzle Neon + Local JSON Persistence Adapter
    └── components/
        ├── MacTrafficDots.tsx              # Komponen 3 Dot Merah Kuning Hijau ala Apple macOS
        ├── Navbar.tsx                      # Glass Navbar + Status Role & Tombol Registrasi/Mentor
        ├── RegistrationModal.tsx           # Modal Registrasi Peserta (Nama, Email, Asal Sekolah) & Login Mentor
        ├── CatalogPage.tsx                 # Halaman Katalog Bootcamp (Hero, Grid 15 Pertemuan, Roadmap, Mentor)
        ├── SlideDeckPage.tsx               # Engine Slide Interaktif + Summary Gate + Form Task Submission
        └── MentorDashboardPage.tsx         # Dashboard Mentor (Antrean ACC Task, Feedback, Matrix Peserta)
```
