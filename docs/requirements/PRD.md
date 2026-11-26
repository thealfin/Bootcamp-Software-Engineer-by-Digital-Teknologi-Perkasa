# Product Requirements Document (PRD)
## Digitek Software Engineering Bootcamp Platform — Batch 1

| Metadata Dokumen | Detail |
| :--- | :--- |
| **Nama Produk** | Digitek Software Engineering Bootcamp LMS & Interactive Slide Platform (Batch 1) |
| **Penyelenggara** | PT. Digital Teknologi Perkasa (`COMP-DTP-001`) |
| **Lead Mentor & Product Owner** | **Alfin Almustajab** (*Front-End Developer • Nuxt Specialist • AI Integrator*) |
| **Target Pengguna** | Siswa PKL / Mahasiswa Magang (Intern) & Mentor Bootcamp |
| **Durasi Kurikulum** | 3 Bulan (12 Minggu • 15 Pertemuan Formal + 15 Weekly Assignments) |
| **Arsitektur Teknis** | React 19 + TanStack (Router & Query SSR) + Drizzle ORM + Neon Serverless PostgreSQL |
| **Status Dokumen** | Approved — v1.0.0 |

---

## 1. Latar Belakang & Tujuan Produk (Executive Summary)

Program **Software Engineering Internship (3 Bulan)** di **PT. Digital Teknologi Perkasa** dirancang untuk membimbing peserta PKL/Intern dari tingkat pemula (*Zero*) hingga mampu membangun dan men-deploy aplikasi web fullstack sederhana (*Mini SaaS / CRUD Fullstack*). Setiap pertemuan menerapkan komposisi **30% penjelasan konsep** dan **70% praktik langsung (live coding & project)**.

Untuk memastikan peserta tidak sekadar melompati materi tanpa pemahaman nyata, platform website bootcamp ini menggabungkan dua pengalaman utama:
1. **Interactive Web Slide Deck (Ala Apple Keynote & `bootcamp.halopolca.my.id`)**: Materi disampaikan dalam bentuk slide kartu interaktif berestetika Apple macOS (font **Plus Jakarta Sans** & sistem sans-serif Apple, dilengkapi **3 dot merah-kuning-hijau khas macOS** di setiap pojok slide dan kartu).
2. **Sequential Task-Gated Learning & Mentor Approval (ACC)**:
   - Pengunjung yang **belum registrasi (Guest)** hanya diberikan **Materi Ringkasan (Summary Preview)** pada setiap pertemuan.
   - Untuk membaca slide lengkap dan mengerjakan tugas praktik, peserta **wajib registrasi** menggunakan **Nama Lengkap**, **Email**, dan **Asal Sekolah / Kampus**.
   - Materi dibuka **secara bertahap**: Pertemuan `N+1` tetap terkunci (`Locked`) hingga peserta menyelesaikan dan mengumpulkan *Task* pada Pertemuan `N` **serta telah di-ACC (`Approved`) oleh Mentor (Alfin Almustajab)** melalui Dashboard Mentor.

---

## 2. Cakupan Materi Kurikulum (Sintesis 4 Dokumen Silabus Batch 1)

Seluruh materi disarikan dari empat dokumen silabus resmi folder `BATCH 1` dan diperkaya dengan kurasi **[Project-Based Learning](https://github.com/practical-tutorials/project-based-learning#html-and-css)** serta **[Free Programming Books Bahasa Indonesia](https://github.com/EbookFoundation/free-programming-books/blob/main/books/free-programming-books-id.md)**:

| Bulan | Fokus Kompetensi | Pertemuan | Proyek Utama (Dual Track) |
| :---: | :--- | :---: | :--- |
| **Bulan 1** | **Fondasi Front-End** (Cara Kerja Web, HTML5 Semantik, CSS3 Flexbox/Grid/Responsive, JS Vanilla, DOM, `localStorage`, Git & GitHub) | **Pertemuan 01 – 05** | **TaskFlow v1** (To-Do List Vanilla JS) & **InternFlow v1** (Halaman Profil / Dashboard Statis) |
| **Bulan 2** | **Back-End, Modern UI, REST API & Database** (Node.js, npm, Express.js / Vue Basics, HTTP Methods & Status Codes, MySQL via XAMPP/phpMyAdmin, SQL CRUD & JOIN, `mysql2`, Postman, Pengenalan Railway) | **Pertemuan 06 – 10** | **TaskFlow v2 / InternFlow v2** (REST API CRUD Express/Node + MySQL terhubung ke Frontend) |
| **Bulan 3** | **Vite, Vue.js 3, TypeScript & Fullstack Nuxt.js** (Vite HMR, Vue 3 SFC `<script setup>`, Reactivity `ref`, Props/Emit, TypeScript Interface/Typing, Nuxt `server/api` Nitro, MySQL Integration & Deployment Railway) | **Pertemuan 11 – 15** | **TaskFlow v3 / InternFlow v3** (Fullstack Nuxt.js + TypeScript + MySQL Online) |

---

## 3. Peran Pengguna (User Roles & Personas)

### 3.1. Guest (Pengunjung Belum Terdaftar)
- **Akses**:
  - Dapat melihat halaman utama katalog bootcamp, roadmap 3 bulan, sistem evaluasi, dan profil mentor **Alfin Almustajab**.
  - Dapat membuka setiap pertemuan, namun **hanya disuguhi Slide Ringkasan (Summary Mode — 3 slide pertama)**.
- **Batasan**:
  - Saat mencoba lanjut ke slide ke-4 (materi inti, perbandingan *Good vs Bad Code*, langkah praktik, dan pengumpulan task), sistem menampilkan **Gate Registrasi Peserta**.

### 3.2. User (Peserta Bootcamp / Siswa PKL Terdaftar)
- **Syarat Pendaftaran**: Mengisi form registrasi dengan **Nama Lengkap**, **Email**, dan **Asal Sekolah / Universitas**.
- **Akses & Aturan Gating**:
  - Setelah registrasi, **Pertemuan 01** otomatis berstatus **`Unlocked`** (semua slide terbuka penuh).
  - Pertemuan 02 s.d. 15 berstatus **`Locked`** di awal.
  - Pada akhir slide pertemuan yang sedang aktif (`Unlocked`), peserta wajib mengumpulkan **Task Pertemuan** (berisi URL Repository GitHub / Commit, URL Demo/Screenshot opsional, dan catatan *Learning Log*).
  - Setelah task dikirim, status pertemuan menjadi **`Menunggu ACC Mentor` (`pending`)**.
  - Begitu Mentor melakukan **ACC (`approved`)**, sistem otomatis membuka kunci (**`Unlock`**) pertemuan berikutnya (`Pertemuan N+1`).
  - Jika Mentor meminta revisi (**`revision`**), peserta melihat catatan *feedback* mentor di dalam slide dan dapat mengirim ulang perbaikan task.

### 3.3. Mentor (Alfin Almustajab — Lead Mentor & Admin Bootcamp)
- **Identitas Mentor**:
  - **Nama**: Alfin Almustajab
  - **Spesialisasi**: Front-End Developer • Nuxt Specialist • AI Integrator (`PT. Digital Teknologi Perkasa` & `Divisi Pesantren Smart Digital`)
- **Akses Khusus**:
  - Dapat mengakses seluruh 15 pertemuan dan semua slide secara penuh tanpa terkunci (Mode Presentasi Kelas / Live Teaching).
  - Memiliki akses ke **Dashboard Mentor Bootcamp (`/mentor`)**:
    1. **Ringkasan Statistik**: Total peserta terdaftar, total task menunggu review (`Pending ACC`), total task disetujui (`Approved`), dan distribusi progres peserta per bulan.
    2. **Antrean Review Task (Task Approval Queue)**: Memeriksa kiriman task peserta (Nama, Email, Asal Sekolah, Pertemuan ke-N, Link GitHub Repo, Isi Learning Log), memberikan komentar feedback, lalu menekan tombol **ACC & Unlock Materi Berikutnya** atau **Minta Revisi**.
    3. **Manajemen Peserta & Unlock Manual**: Melihat progres tiap peserta dari Pertemuan 1–15 dan memiliki tombol *override* untuk membuka/mengunci pertemuan tertentu secara manual bila diperlukan (misal saat sesi *Project Clinic / Buffer*).
    4. **Manajemen Materi & Task**: Mengedit ringkasan materi, deskripsi task, atau menambahkan catatan mentor yang tersimpan di database Neon via Drizzle ORM.

---

## 4. Fitur Utama (Functional Scope)

1. **Katalog Materi Interaktif (`/` — SSR)**:
   - Hero section dengan profil singkat Mentor **Alfin Almustajab**, indikator status login/role saat ini, dan statistik bootcamp.
   - Filter pertemuan berdasarkan **Semua**, **Bulan 1 (Front-End)**, **Bulan 2 (Back-End & DB)**, **Bulan 3 (Vue, TS & Nuxt)**, serta **Pustaka Learning Hub**.
   - Kartu pertemuan bergaya `bootcamp.halopolca.my.id` dengan **3 dot macOS** di pojok atas, badge status dinamis per user:
     - 🟡 `Summary Only (Belum Register)` — untuk Guest
     - 🟢 `Tersedia / Unlocked` — untuk Pertemuan yang sudah terbuka
     - 🔵 `Menunggu ACC Mentor` — Task sudah dikirim, sedang direview
     - 🔴 `Perlu Revisi Task` — Mentor memberi catatan perbaikan
     - 🔒 `Locked (Selesaikan Task Sebelumnya)` — Pertemuan belum terbuka
     - ✅ `Selesai & Di-ACC` — Pertemuan sudah lulus
2. **Slide Deck Viewer (`/modul/$slug` — SSR + Interactive Client)**:
   - Tampilan slide layar penuh dengan transisi halus `cubic-bezier(0.16, 1, 0.3, 1)`.
   - Setiap slide memiliki frame kartu dengan **3 dot macOS (Merah, Kuning, Hijau)** di pojok, nomor slide, dan badge kategori (`Ringkasan`, `30% Konsep`, `Good vs Bad Code`, `70% Praktik PBL`, `Free Books Reference`, `Kuis & Evaluasi`, `Task Submission`).
   - Navigasi bawah berbentuk *Floating Glass Pill* (`Prev`, `01 / XX`, `Progress Bar`, `Next`, serta tombol `Daftar Slide`).
   - Mendukung shortcut keyboard (`ArrowRight`, `ArrowLeft`, `Space`) dan *touch swipe* di smartphone.
3. **Sistem Registrasi Cepat & Role Switcher**:
   - Form registrasi peserta menggunakan **Nama Lengkap**, **Email**, dan **Asal Sekolah**.
   - Login cepat untuk peserta yang sudah pernah mendaftar (menggunakan email) serta akses login **Mentor (Alfin Almustajab)** untuk membuka Dashboard Mentor.
4. **Panel Pengumpulan Task & Learning Log Terintegrasi**:
   - Berada di slide terakhir setiap pertemuan (dan dapat dibuka lewat tombol *Task Pertemuan* di pojok atas slide).
   - Mengikuti format resmi *Learning Log* silabus: *Hal baru yang dipahami, Praktik yang dikerjakan, Kendala & solusi, serta Link Repository/Commit GitHub*.
5. **Dashboard Mentor (`/mentor`)**:
   - Antarmuka manajemen peserta, review task, tombol **ACC (Unlock Next Module)**, tombol **Revisi**, dan kontrol unlock manual per peserta.

---

## 5. Metrik Keberhasilan (Success Metrics)

1. **100% Kepatuhan Urutan Belajar**: Tidak ada peserta (`role: user`) yang dapat membuka materi penuh Pertemuan `N+1` sebelum task Pertemuan `N` berstatus `approved` oleh mentor.
2. **Kecepatan Akses & SSR**: Halaman katalog dan slide pertama di-render dari server (SSR) dengan waktu muat awal `< 1.5 detik`.
3. **Kelengkapan Kurikulum**: Seluruh 15 pertemuan, 15 tugas mingguan, rubrik penilaian (40% Project, 30% Kuis, 20% Presentasi, 10% Git), checklist kompetensi, serta referensi *Project-Based Learning* dan *Free Programming Books* tersedia lengkap di dalam slide.
