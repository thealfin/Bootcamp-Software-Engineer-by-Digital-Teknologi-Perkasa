# Digitek Software Engineering Bootcamp

Platform Learning Management System (LMS) dan Slide Deck Interaktif untuk program pembinaan siswa PKL dan mahasiswa magang di **PT Digital Teknologi Perkasa** bersama Mentor **Alfin**.

---

## Ringkasan Program

Program ini dirancang untuk membimbing peserta dari nol hingga mampu membangun dan men-deploy aplikasi web fullstack sederhana (**TaskFlow** dan **InternFlow**) selama 3 bulan (16 pertemuan formal + 2 modul panduan & pustaka):

- **Bulan 1 || Fondasi Front-End (`P01`–`P06`)**: Cara kerja web, Git & GitHub, HTML5 semantik, CSS3 (Box Model, Flexbox, Grid, Responsive), **Tailwind CSS** (*utility-first* & perbandingan dengan CSS vanilla), serta JavaScript Vanilla & DOM.
- **Bulan 2 || Back-End, REST API & Database (`P07`–`P11`)**: Node.js, npm, Express.js, REST API, MySQL (XAMPP/phpMyAdmin), `mysql2` *parameterized query*, Postman, dan pengenalan deployment Railway.
- **Bulan 3 || Modern Front-End & Fullstack (`P12`–`P16`)**: Vite, Vue.js 3 (`<script setup>`), TypeScript, Nuxt.js (`server/api` Nitro), integrasi database, code review, serta evaluasi akhir.

Setiap pertemuan menerapkan komposisi **30% pemahaman konsep** dan **70% praktik langsung**.

---

## Fitur Utama & Kontrol Akses

### 1. Mode Tamu (Guest)
- Mengakses halaman utama, silabus materi, alur belajar 3 bulan, dan halaman **Profil Mentor** (`/profil-mentor`).
- Membaca **3 slide ringkasan pertama** pada setiap pertemuan.
- Slide ke-4 menampilkan **Gerbang Pendaftaran** (Nama Lengkap, Email, Asal Sekolah/Kampus, dan Kata Sandi).

### 2. Mode Peserta Terdaftar (User)
- Registrasi dan masuk akun menggunakan **Email & Kata Sandi** (`scrypt` + *signed HttpOnly cookie*).
- Pertemuan `P01` otomatis terbuka penuh (`Unlocked`).
- **Sequential Task-Gated Learning**: Pertemuan `N+1` tetap terkunci hingga peserta mengumpulkan **Task & Learning Log** pada Pertemuan `N` dan mendapat **ACC** dari Mentor.
- Halaman utama menampilkan panel samping **Daftar Task Kamu** beserta status (`Siap Dikerjakan`, `Menunggu ACC`, `Perlu Revisi`, `Di-ACC`, `Terkunci`).
- **Slide Player Layar Penuh**: Bebas distraksi tanpa navbar, dilengkapi transisi **GSAP** dan kontrol 3 dot macOS (Merah = keluar, Kuning = kecilkan jendela, Hijau = layar penuh).

### 3. Panel Admin Mentor (`/admin/login` & `/admin/*`)
- Akses khusus melalui URL manual `/admin/login` (tanpa tombol di halaman publik).
- **Ringkasan (`/admin`)**: KPI peserta, antrean review terbaru, dan pintasan menu.
- **Review Tugas (`/admin/review`)**: Memeriksa repositori GitHub & *Learning Log* peserta, memberi catatan mentor, lalu memilih **Setujui & Buka Materi Berikutnya** atau **Minta Revisi**. Tugas yang sudah **Disetujui** otomatis terkunci dan hanya dapat diedit kembali melalui **ikon pena** dengan verifikasi **Kata Sandi Mentor**.
- **Data Peserta (`/admin/peserta`)**: Matriks progres `P01`–`P16` per peserta dengan kontrol *Manual Unlock / Lock*.
- **Materi & Slide (`/admin/materi`)**: Tambah, ubah, atur urutan, dan hapus modul maupun slide langsung ke database.
- **Analitik Peserta (`/admin/analitik`)**: Statistik keaktifan, rata-rata progres, waktu review, tingkat revisi per modul, sebaran asal sekolah, dan tren mingguan.

---

## Tangkapan Layar (Screenshot)

> Simpan atau hasilkan tangkapan layar ke folder `docs/screenshots/` agar tampil otomatis di bawah ini.

### 1. Tampilan Mode Tamu (Guest)
| Beranda & Silabus (Guest) | Slide Ringkasan & Gerbang Daftar |
| :---: | :---: |
| ![Beranda Guest](docs/screenshots/guest-landing.png) | ![Gerbang Daftar Slide 4](docs/screenshots/guest-slide-gate.png) |

### 2. Tampilan Peserta Login (User)
| Silabus & Sidebar Daftar Task | Slide Player Layar Penuh (GSAP) |
| :---: | :---: |
| ![Silabus & Task Sidebar](docs/screenshots/student-syllabus-tasks.png) | ![Slide Player Terbuka](docs/screenshots/student-slide-unlocked.png) |

### 3. Tampilan Admin Mentor (`/admin/*`)
| Ringkasan Admin (`/admin`) | Review Tugas (`/admin/review`) | Analitik Peserta (`/admin/analitik`) |
| :---: | :---: | :---: |
| ![Admin Overview](docs/screenshots/admin-overview.png) | ![Admin Review](docs/screenshots/admin-review.png) | ![Admin Analitik](docs/screenshots/admin-analytics.png) |

---

## Arsitektur & Teknologi

- **Frontend & SSR**: React 19, TypeScript, TanStack Router, TanStack Query (SSR Hydration), Tailwind CSS v4, GSAP, Phosphor Icons.
- **Backend**: Node.js, Express, Zod, HMAC-SHA256 Signed Cookies, `scrypt` Password Hashing.
- **Database**: Neon Serverless PostgreSQL via Drizzle ORM (dengan *local JSON fallback* otomatis di `.data/bootcamp-db.json` bila `DATABASE_URL` tidak tersedia).
- **Diagram Arsitektur**: Lihat [docs/architecture/digitek-bootcamp-architecture.html](docs/architecture/digitek-bootcamp-architecture.html).

---

## Struktur Direktori

```text
├── docs/
│   ├── architecture/        # Diagram arsitektur interaktif (Archify)
│   ├── materi-batch-1/      # Referensi materi pendukung
│   ├── requirements/        # PRD, SRS, PDD, Design, System Design, Silabus
│   └── screenshots/         # Tangkapan layar aplikasi untuk dokumentasi
├── media/                   # Aset logo sumber (.svg & .png)
├── public/                  # Favicon & logo statis yang disajikan server
├── server.ts                # Express SSR + REST API server
└── src/
    ├── components/          # Komponen bersama (BrandLogo, MacTrafficDots)
    ├── db/                  # Skema Drizzle, repository (Neon + fallback), dan seed
    ├── features/
    │   ├── admin/           # Panel Admin (/admin/*)
    │   ├── landing/         # Halaman publik, profil mentor, modal auth
    │   └── slides/          # Slide Player GSAP + 8 layout + Gate & Task
    ├── lib/                 # API hooks, access-guard, session & crypto
    ├── styles/              # Token desain & CSS global
    └── types/               # Kontrak tipe TypeScript bersama
```

---

## Cara Menjalankan

### 1. Instalasi Dependensi
```bash
pnpm install
```

### 2. Konfigurasi Lingkungan
Salin `.env.example` menjadi `.env` lalu isi `DATABASE_URL` (Neon PostgreSQL), `MENTOR_PASSCODE`, dan `SESSION_SECRET`:
```bash
cp .env.example .env
```

### 3. Push Skema & Seed Kurikulum
```bash
pnpm db:push
pnpm db:seed
```

### 4. Jalankan Aplikasi
- **Mode Pengembangan (Vite HMR + Express SSR)**:
  ```bash
  pnpm dev
  ```
- **Mode Produksi**:
  ```bash
  pnpm build
  pnpm start
  ```

Buka `http://localhost:3000` di browser.

### 5. Pengujian & Verifikasi
```bash
pnpm typecheck
pnpm test
```
