import type { SeedModuleInput } from '../../types/bootcamp';

export const MONTH_2_MODULES: SeedModuleInput[] = [
  // =========================================================================
  // PERTEMUAN 07 || Node.js, npm, Express.js & Arsitektur REST API
  // =========================================================================
  {
    orderIndex: 7,
    month: 2,
    slug: 'pertemuan-07-nodejs-express-rest-api',
    code: 'P07',
    sessionType: 'Materi 1',
    title: 'Node.js, npm, Express.js & Arsitektur REST API',
    subtitle:
      'Membangun server HTTP pertama dengan Node.js, npm, konfigurasi .env, Express.js, dan pengujian endpoint di Postman.',
    summaryText:
      'Peserta beralih dari penyimpanan lokal browser menuju arsitektur client-server menggunakan Node.js, Express.js, JSON, dan Postman.',
    taskPrompt:
      'Bangun backend Express.js untuk TaskFlow dengan API (data di memori) dengan endpoint GET /api/health, GET /api/tasks, dan POST /api/tasks berkonfigurasi .env serta uji di Postman.',
    taskDeliverables: [
      'Repositori GitHub berisi package.json, .gitignore (node_modules dan .env), .env.example, serta src/server.js',
      'Server Express.js berjalan memakai variabel PORT dari file .env',
      'Endpoint GET /api/tasks (200) dan POST /api/tasks (201 atau 400) berfungsi dengan data di memori',
      'Koleksi atau tangkapan layar Postman yang membuktikan respons JSON sesuai status code',
    ],
    accentGradient: 'from-green-600 to-emerald-500',
    iconName: 'PlugsConnected',
    slides: [
      {
        slideNumber: 1,
        isSummary: true,
        layoutType: 'cover',
        badge: 'Bulan 2 • Pertemuan 06 • Materi 1',
        title: 'Node.js, npm, Express.js & Arsitektur REST API',
        subtitle:
          'Transisi dari antarmuka statis menuju server backend berbasis protokol HTTP dan JSON.',
        contentJson: {
          eyebrow: 'DIGITEK BOOTCAMP || BACK-END FUNDAMENTAL',
          highlights: [
            'Perbedaan runtime JavaScript di browser dan di server Node.js',
            'Manajemen paket npm, ES Modules, dan konfigurasi variabel .env',
            'Kontrak REST API: HTTP method, status code, dan format JSON',
            'Pembuatan server Express.js pertama serta pengujian di Postman',
          ],
          stats: [
            { label: 'Komposisi Sesi', value: '30% Teori / 70% Praktik' },
            { label: 'Durasi', value: '2.5 – 3 Jam' },
            { label: 'Proyek Dual Track', value: 'TaskFlow / InternFlow dengan API' },
            { label: 'Mentor', value: 'Alfin Almustajab' },
          ],
          mentorTip:
            'Pahami alur satu HTTP request hingga kembali sebagai JSON response sebelum menghafal sintaks Express.',
        },
      },
      {
        slideNumber: 2,
        isSummary: true,
        layoutType: 'summary',
        badge: 'Ringkasan Materi',
        title: 'Mengapa Penyimpanan Browser Tidak Lagi Cukup?',
        subtitle:
          'Data aplikasi nyata harus terpusat di server agar aman dan dapat diakses lintas perangkat.',
        contentJson: {
          eyebrow: 'RINGKASAN EKSEKUTIF || MASALAH & SOLUSI',
          highlights: [
            'Data localStorage hilang saat cache dibersihkan dan terisolasi di satu browser',
            'Backend memisahkan tampilan antarmuka dari logika bisnis dan pengelolaan data',
            'Node.js menjalankan kode JavaScript langsung di sisi server',
            'Express.js menyederhanakan pembuatan rute REST API berformat JSON',
          ],
          stats: [
            { label: 'Bulan 1', value: 'HTML/CSS/JS + localStorage' },
            { label: 'Bulan 2 (P06)', value: 'Node.js + Express + JSON' },
            { label: 'Alat Uji API', value: 'Postman' },
          ],
        },
      },
      {
        slideNumber: 3,
        isSummary: true,
        layoutType: 'bento',
        badge: 'Peta Konsep & Agenda',
        title: 'Agenda Belajar: 30% Konsep & 70% Praktik',
        subtitle:
          'Empat tahap membangun pondasi REST API sebelum terhubung ke database MySQL.',
        contentJson: {
          eyebrow: 'PETA JALAN PERTEMUAN 06',
          highlights: [
            '45 menit konsep: runtime Node.js, npm, siklus HTTP, dan status code',
            '90 menit praktik: inisialisasi Express, konfigurasi .env, dan pengujian Postman',
          ],
          bentoCards: [
            {
              title: '1. Runtime Node.js & Terminal',
              tag: '00:00 – 00:20',
              description:
                'Menjalankan file JavaScript via terminal serta membedakan objek DOM dan process.',
            },
            {
              title: '2. npm, package.json & .env',
              tag: '00:20 – 00:40',
              description:
                'Mengelola dependensi eksternal, mengaktifkan ES Modules, dan menyimpan konfigurasi di .env.',
            },
            {
              title: '3. HTTP, JSON & Status Code',
              tag: '00:40 – 01:05',
              description:
                'Memetakan metode GET, POST, PUT, PATCH, DELETE beserta kode status HTTP.',
            },
            {
              title: '4. Routing Express & Postman',
              tag: '01:05 – 02:30',
              description:
                'Membangun endpoint TaskFlow dengan API di memori dan memverifikasi respons via Postman.',
            },
          ],
        },
      },
      {
        slideNumber: 4,
        isSummary: false,
        layoutType: 'bento',
        badge: '30% Konsep Fundamental',
        title: 'Arsitektur Client, REST API, Server, dan Status Code',
        subtitle:
          'Client mengirim permintaan terstandar melalui HTTP dan server mengembalikan respons JSON.',
        contentJson: {
          eyebrow: 'KONSEP KOMUNIKASI CLIENT-SERVER',
          highlights: [
            'Browser dan Postman bertindak sebagai client pengirim HTTP request',
            'REST API menjembatani pertukaran data antara antarmuka dan server',
            'Status code memberi sinyal hasil pemrosesan secara cepat dan konsisten',
          ],
          bentoCards: [
            {
              title: 'Browser JS vs Node.js',
              tag: 'Runtime',
              description:
                'Browser mengelola antarmuka DOM, sedangkan Node.js mengakses jaringan dan sistem operasi.',
              bullets: [
                'Browser merender HTML dan interaksi pengguna',
                'Node.js melayani HTTP request dan database',
                'Konfigurasi server dibaca melalui objek process.env',
              ],
            },
            {
              title: 'HTTP Methods Utama',
              tag: 'REST Verbs',
              description:
                'Setiap operasi CRUD memakai metode HTTP spesifik pada URL resource.',
              bullets: [
                'GET mengambil daftar atau detail data',
                'POST mengirim dan membuat data baru',
                'PUT, PATCH, DELETE mengubah atau menghapus data',
              ],
            },
            {
              title: 'HTTP Status Code Inti',
              tag: 'Status Codes',
              description:
                'Gunakan kode status semantik sesuai hasil proses, bukan selalu 200 OK.',
              bullets: [
                '200 OK berhasil, 201 Created data dibuat',
                '400 Bad Request input salah, 401 Unauthorized',
                '404 Not Found kosong, 500 Server Error',
              ],
            },
            {
              title: 'Format Payload JSON',
              tag: 'Payload',
              description:
                'Format teks berbasis pasangan key-value yang dipahami berbagai bahasa pemrograman.',
              bullets: [
                'Nama key wajib memakai tanda kutip ganda',
                'Middleware express.json() mengurai isi req.body',
                'Method res.json() mengirim respons berformat JSON',
              ],
            },
          ],
        },
      },
      {
        slideNumber: 5,
        isSummary: false,
        layoutType: 'bento',
        badge: 'Bedah Teknis & Sintaks',
        title: 'Anatomi Proyek Express.js Modern (.env & ES Modules)',
        subtitle:
          'Susun konfigurasi awal secara modular agar siap dikembangkan ke database MySQL.',
        contentJson: {
          eyebrow: 'SINTAKS INTI NODE.JS & EXPRESS',
          highlights: [
            'Aktifkan type module di package.json agar mendukung sintaks import dan export',
            'Baca variabel PORT dari file .env agar konfigurasi terpisah',
            'Pasang middleware express.json() sebelum mendaftarkan rute endpoint',
          ],
          bentoCards: [
            {
              title: 'package.json & Scripts',
              tag: 'npm Config',
              description:
                'Mendefinisikan modul ES, dependensi utama, dan skrip pengembangan otomatis.',
              code: {
                title: 'Konfigurasi package.json',
                language: 'json',
                filename: 'package.json',
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
}`,
              },
            },
            {
              title: 'Server Express & Middleware',
              tag: 'src/server.js',
              description:
                'Memuat variabel .env, mengurai body JSON, dan membuka rute pengecekan server.',
              code: {
                title: 'Bootstrap Express + .env',
                language: 'javascript',
                filename: 'src/server.js',
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
});`,
              },
            },
          ],
          codeBlocks: [
            {
              title: 'Template .env.example & .gitignore',
              language: 'bash',
              filename: '.env.example',
              snippet: `# Salin ke file .env lokal
PORT=3000
APP_NAME="TaskFlow API"

# Isi wajib pada file .gitignore:
# node_modules/ dan .env`,
            },
          ],
        },
      },
      {
        slideNumber: 6,
        isSummary: false,
        layoutType: 'comparison',
        badge: 'Good vs Bad Practice',
        title: 'Standar Endpoint Express vs Kesalahan Pemula',
        subtitle:
          'Validasi input klien dan ketepatan status code memudahkan integrasi di sisi frontend.',
        contentJson: {
          eyebrow: 'PERBANDINGAN KUALITAS KODE',
          highlights: [
            'Pisahkan variabel lingkungan di .env dan validasi payload sebelum menyimpan data',
            'Kirim kode 201 saat membuat data dan 400 saat gagal',
          ],
          comparison: {
            badTitle: '✕ Kesalahan Pemula (Bad Practice)',
            badPoints: [
              'Menulis port dan kredensial langsung di dalam file server.js',
              'Melewatkan express.json() sehingga nilai req.body menjadi undefined',
              'Mengembalikan status 200 OK meskipun validasi input gagal',
            ],
            badCode: {
              title: 'Endpoint tanpa validasi dan status semantik',
              language: 'javascript',
              filename: 'bad-server.js',
              snippet: `app.post('/tasks', (req, res) => {
  // Rawan error: req.body belum tervalidasi
  tasks.push(req.body);
  // Respons teks biasa dengan status default 200
  res.send('Berhasil disimpan');
});`,
            },
            goodTitle: '✓ Standar Software Engineer (Good Practice)',
            goodPoints: [
              'Membaca PORT dari process.env serta menyediakan .env.example dan .gitignore',
              'Memvalidasi field wajib sebelum memodifikasi data di server',
              'Mengirim respons JSON konsisten dengan status 201 atau 400',
            ],
            goodCode: {
              title: 'Endpoint POST tervalidasi dengan respons JSON',
              language: 'javascript',
              filename: 'src/server.js',
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
});`,
            },
          },
        },
      },
      {
        slideNumber: 7,
        isSummary: false,
        layoutType: 'practice',
        badge: '70% Praktik Hands-On',
        title: 'Membangun REST API TaskFlow dengan API & Uji Postman',
        subtitle:
          'Ikuti empat langkah ini untuk menyiapkan server Express dan memverifikasi endpoint.',
        contentJson: {
          eyebrow: 'PRAKTIK TERBIMBING || LANGKAH DEMI LANGKAH',
          highlights: [
            'Pastikan Node.js LTS sudah terpasang melalui perintah node -v di terminal',
            'Data disimpan sementara di memori sebelum dipindahkan ke MySQL pada P07',
          ],
          practiceSteps: [
            {
              step: 1,
              title: 'Inisialisasi Proyek & Pasang Paket',
              description:
                'Buat folder proyek baru, inisialisasi package.json, lalu pasang express dan dotenv.',
              command:
                'mkdir taskflow-backend && cd taskflow-backend && npm init -y && npm install express dotenv',
            },
            {
              step: 2,
              title: 'Siapkan .gitignore, .env & ES Modules',
              description:
                'Tambahkan type module di package.json, isi PORT=3000 di .env, dan buat file .gitignore.',
              code: `node_modules/
.env`,
            },
            {
              step: 3,
              title: 'Buat Endpoint GET & POST /api/tasks',
              description:
                'Tulis array data awal beserta rute GET dan POST tervalidasi di dalam src/server.js.',
              code: `const tasks = [
  { id: 1, title: 'Inisialisasi proyek Express', isDone: true },
  { id: 2, title: 'Uji endpoint di Postman', isDone: false },
];

app.get('/api/tasks', (req, res) => {
  res.status(200).json({ success: true, count: tasks.length, data: tasks });
});`,
            },
            {
              step: 4,
              title: 'Jalankan Server & Uji di Postman',
              description:
                'Jalankan npm run dev lalu uji respons 200, 201, dan 400 pada URL localhost:3000/api/tasks.',
              command: 'npm run dev',
            },
          ],
        },
      },
      {
        slideNumber: 8,
        isSummary: false,
        layoutType: 'quiz',
        badge: 'Kuis & Pustaka Referensi',
        title: 'Cek Pemahaman Dasar Backend & Referensi Belajar',
        subtitle:
          'Uji penguasaan konsep Node.js, HTTP, dan Express sebelum mempelajari database MySQL.',
        contentJson: {
          eyebrow: 'EVALUASI KONSEP & REFERENSI',
          highlights: [
            'Jawab empat pertanyaan inti secara mandiri sebelum membaca kunci jawaban',
            'Gunakan referensi gratis berbahasa Indonesia dan dokumentasi resmi berikut',
          ],
          quizItems: [
            {
              question: 'Apa perbedaan utama menjalankan JavaScript di browser dan di Node.js?',
              hint: 'Bandingkan manipulasi DOM dengan akses sistem server.',
              answer:
                'Di browser, JavaScript memanipulasi DOM dan tampilan pengguna tanpa akses langsung ke sistem file. Di Node.js, JavaScript berjalan di server tanpa DOM untuk mengelola jaringan HTTP, file, variabel lingkungan, dan database.',
            },
            {
              question: 'Mengapa file .env dan folder node_modules tidak boleh diunggah ke GitHub?',
              hint: 'Pertimbangkan keamanan kredensial dan ukuran repositori.',
              answer:
                'File .env menyimpan data rahasia seperti kata sandi atau kunci API yang berisiko bocor ke publik. Folder node_modules berukuran besar dan cukup dipasang ulang menggunakan perintah npm install dari package.json.',
            },
            {
              question: 'Kapan backend harus mengembalikan status code 201, 400, dan 404?',
              hint: 'Bedakan pembuatan data baru, kesalahan input, dan ketiadaan data.',
              answer:
                'Gunakan 201 Created saat POST berhasil menyimpan data baru dan 400 Bad Request saat input klien tidak valid. Gunakan 404 Not Found ketika rute URL atau ID data yang diminta tidak ditemukan.',
            },
            {
              question: 'Apa fungsi pemasangan app.use(express.json()) pada aplikasi Express.js?',
              hint: 'Perhatikan isi req.body jika middleware ini dilewatkan.',
              answer:
                'Middleware ini mengurai body HTTP request berformat JSON menjadi objek JavaScript pada req.body. Tanpa middleware tersebut, nilai req.body di dalam route handler akan bernilai undefined.',
            },
          ],
          references: [
            {
              title: 'Tutorial Node.js untuk Pemula (Full Tutorial)',
              url: 'https://mfikri.com/artikel/tutorial-nodejs',
              author: 'Mfikri',
              category: 'Node.js & Express',
              lang: 'ID',
              type: 'Book',
            },
            {
              title: 'Belajar NodeJS (Playlist Video)',
              url: 'https://youtube.com/playlist?list=PLFIM0718LjIW-XBdVOerYgKegBtD6rSfD',
              author: 'Sandhika Galih (Web Programming UNPAS)',
              category: 'Node.js',
              lang: 'ID',
              type: 'Course',
            },
            {
              title: 'ExpressJS Tutorial Indonesia',
              url: 'https://www.youtube.com/playlist?list=PL9At9z2rvOC-sgzJx7rM_wMDONnEM4E0A',
              author: 'Ekky Ridyanto (Baledemy)',
              category: 'Express.js',
              lang: 'ID',
              type: 'Course',
            },
            {
              title: 'MDN || HTTP Overview & Status Codes',
              url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview',
              author: 'MDN Web Docs',
              category: 'HTTP & REST API',
              lang: 'EN',
              type: 'Docs',
            },
            {
              title: 'Express.js Getting Started & Postman Learning Center',
              url: 'https://expressjs.com/en/starter/installing.html',
              author: 'Express.js',
              category: 'Express.js',
              lang: 'EN',
              type: 'Docs',
            },
          ],
          weeklyAssignment: {
            week: 6,
            title: 'Weekly Assignment 6: REST API Sederhana dengan Express',
            description:
              'Tambahkan endpoint GET /api/tasks/:id (status 404 bila tidak ditemukan) serta uji skenario sukses dan gagal di Postman.',
          },
        },
      },
      {
        slideNumber: 9,
        isSummary: false,
        layoutType: 'task',
        badge: 'Deliverable & Learning Log',
        title: 'Pengumpulan Tugas Pertemuan 06 untuk ACC Mentor',
        subtitle:
          'Pastikan file .env tidak ikut terunggah dan seluruh endpoint telah teruji di Postman.',
        contentJson: {
          eyebrow: 'SYARAT MEMBUKA PERTEMUAN 07',
          highlights: [
            'Mentor memeriksa package.json, .gitignore, validasi POST, dan bukti pengujian Postman',
            'Persetujuan tugas ini membuka akses penuh ke materi Pertemuan 07',
          ],
          deliverables: [
            'Tautan repositori GitHub proyek backend dengan riwayat commit yang jelas',
            'Server Express.js membaca PORT dari .env dan menyertakan .env.example',
            'Endpoint GET /api/health, GET /api/tasks, dan POST /api/tasks lulus uji Postman',
            'Catatan Learning Log berisi rangkuman materi dan kendala teknis',
          ],
          learningLogFields: [
            'Perbedaan runtime browser dan Node.js beserta fungsi status code HTTP',
            'Daftar endpoint Express.js yang dibuat dan diuji melalui Postman',
            'Kendala teknis saat konfigurasi proyek beserta solusi perbaikannya',
            'Tautan repositori GitHub dan kode commit terakhir',
          ],
          competencyChecklist: [
            'Memahami peran Node.js sebagai runtime JavaScript di sisi server',
            'Mampu menginisialisasi package.json dan memasang paket menggunakan npm',
            'Mampu menerapkan metode GET dan POST dengan status code semantik',
            'Mampu menguji request dan respons JSON menggunakan Postman',
          ],
          mentorTip:
            'Jalankan git status sebelum git commit untuk memastikan node_modules dan .env tidak masuk daftar unggahan.',
        },
      },
    ],
  },

  // =========================================================================
  // PERTEMUAN 08 || MySQL via XAMPP, SQL CRUD/JOIN & Koneksi mysql2
  // =========================================================================
  {
    orderIndex: 8,
    month: 2,
    slug: 'pertemuan-08-mysql-sql-koneksi-database',
    code: 'P08',
    sessionType: 'Materi 2',
    title: 'MySQL via XAMPP, SQL CRUD/JOIN & Koneksi mysql2',
    subtitle:
      'Merancang tabel relasional di MySQL, menulis query SQL CRUD serta JOIN, dan menghubungkan Express menggunakan mysql2.',
    summaryText:
      'Peserta memindahkan penyimpanan data ke MySQL melalui XAMPP, merancang relasi tabel, dan menjalankan parameterized query dari Node.js.',
    taskPrompt:
      'Buat database taskflow di MySQL dengan tabel berelasi categories dan tasks, isi data awal di schema.sql, lalu hubungkan Express memakai connection pool mysql2/promise.',
    taskDeliverables: [
      'File schema.sql berisi perintah CREATE DATABASE, CREATE TABLE berelasi, dan INSERT data awal',
      'Modul koneksi src/config/db.js menggunakan mysql2/promise createPool dengan kredensial dari .env',
      'Endpoint GET /api/tasks membaca data langsung dari MySQL beserta nama kategori melalui LEFT JOIN',
      'Catatan Learning Log mengenai relasi tabel, query JOIN, dan konfigurasi koneksi database',
    ],
    accentGradient: 'from-sky-600 to-blue-500',
    iconName: 'Database',
    slides: [
      {
        slideNumber: 1,
        isSummary: true,
        layoutType: 'cover',
        badge: 'Bulan 2 • Pertemuan 07 • Materi 2',
        title: 'MySQL via XAMPP, SQL CRUD/JOIN & Koneksi mysql2',
        subtitle:
          'Menyimpan data aplikasi secara permanen di database relasional dan menghubungkannya ke Node.js.',
        contentJson: {
          eyebrow: 'DIGITEK BOOTCAMP || DATABASE RELASIONAL',
          highlights: [
            'Struktur database relasional: tabel, baris, kolom, primary key, dan foreign key',
            'Pengoperasian MySQL atau MariaDB lokal melalui XAMPP dan phpMyAdmin',
            'Sintaks SQL inti: CREATE, INSERT, SELECT, UPDATE, DELETE, dan JOIN',
            'Koneksi aman dari Express memakai pool mysql2/promise dan parameterized query',
          ],
          stats: [
            { label: 'Komposisi Sesi', value: '30% Teori / 70% Praktik' },
            { label: 'DBMS Lokal', value: 'MySQL / MariaDB (XAMPP)' },
            { label: 'Driver Node.js', value: 'mysql2/promise' },
            { label: 'Mentor', value: 'Alfin Almustajab' },
          ],
          mentorTip:
            'Rancang relasi tabel dengan rapi sejak awal agar penulisan query API menjadi jauh lebih sederhana.',
        },
      },
      {
        slideNumber: 2,
        isSummary: true,
        layoutType: 'summary',
        badge: 'Ringkasan Materi',
        title: 'Dari Array Sementara Menuju Penyimpanan Permanen',
        subtitle:
          'Database relasional menjaga keutuhan data meskipun proses server dimatikan atau dimulai ulang.',
        contentJson: {
          eyebrow: 'RINGKASAN EKSEKUTIF || DATABASE RELASIONAL',
          highlights: [
            'Data di memori hilang setiap kali server Node.js mengalami proses restart',
            'MySQL menyimpan data secara permanen ke dalam tabel yang saling berelasi',
            'Primary key dan foreign key menghubungkan tugas dengan kategori tanpa duplikasi',
            'Driver mysql2 mengeksekusi query secara asinkron dan mencegah celah SQL Injection',
          ],
          stats: [
            { label: 'Database', value: 'taskflow' },
            { label: 'Relasi Utama', value: 'One-to-Many (1:N)' },
            { label: 'Keamanan Query', value: 'Parameterized (?)' },
          ],
        },
      },
      {
        slideNumber: 3,
        isSummary: true,
        layoutType: 'bento',
        badge: 'Peta Konsep & Agenda',
        title: 'Peta Konsep Database & Integrasi Backend',
        subtitle:
          'Empat tahap belajar dari menyalakan layanan MySQL hingga membaca tabel melalui Express.',
        contentJson: {
          eyebrow: 'AGENDA 30% KONSEP / 70% PRAKTIK',
          highlights: [
            '45 menit konsep: struktur tabel, tipe data, kunci relasi, dan SQL',
            '90 menit praktik: skema phpMyAdmin dan koneksi pool di Express',
          ],
          bentoCards: [
            {
              title: '1. Konsep Tabel & Relasi Kunci',
              tag: 'Konsep',
              description:
                'Membedakan database, tabel, primary key sebagai identitas unik, dan foreign key.',
            },
            {
              title: '2. XAMPP & phpMyAdmin',
              tag: 'Lingkungan Lokal',
              description:
                'Menjalankan service MySQL di port 3306 serta mengelola skema lewat phpMyAdmin.',
            },
            {
              title: '3. SQL CRUD, Filter & JOIN',
              tag: 'Query SQL',
              description:
                'Menulis perintah manipulasi data lengkap dengan klausa WHERE, ORDER BY, dan JOIN.',
            },
            {
              title: '4. Pool Koneksi mysql2',
              tag: 'Integrasi',
              description:
                'Menghubungkan Express ke MySQL memakai kredensial .env dan parameter tanda tanya.',
            },
          ],
        },
      },
      {
        slideNumber: 4,
        isSummary: false,
        layoutType: 'bento',
        badge: '30% Konsep Fundamental',
        title: 'Anatomi Tabel, Kunci Relasi, dan Normalisasi Data',
        subtitle:
          'Normalisasi memecah data ke tabel terpisah untuk menjaga konsistensi dan mencegah duplikasi.',
        contentJson: {
          eyebrow: 'KONSEP INTI RELATIONAL DATABASE',
          highlights: [
            'Database mewadahi seluruh tabel aplikasi seperti categories dan tasks',
            'Simpan category_id di tabel tasks agar nama kategori tidak ditulis berulang',
          ],
          bentoCards: [
            {
              title: 'Hierarki & Tipe Data MySQL',
              tag: 'Struktur',
              description:
                'Pilih tipe kolom yang presisi sesuai kebutuhan ukuran dan jenis nilai.',
              bullets: [
                'INT AUTO_INCREMENT untuk nomor ID otomatis',
                'VARCHAR dan TEXT untuk teks pendek atau panjang',
                'BOOLEAN dan TIMESTAMP untuk status serta waktu',
              ],
            },
            {
              title: 'Primary Key vs Foreign Key',
              tag: 'Kunci Relasi',
              description:
                'Dua jenis kunci yang menjaga integritas hubungan antarbaris di dalam tabel.',
              bullets: [
                'Primary key memberi identitas unik tiap baris',
                'Foreign key merujuk primary key tabel lain',
                'Index mempercepat pencarian pada klausa WHERE',
              ],
            },
            {
              title: 'Pola Relasi Antartabel',
              tag: 'Kardinalitas',
              description:
                'Tiga bentuk hubungan entitas yang paling sering digunakan dalam aplikasi.',
              bullets: [
                'One-to-One: satu pengguna punya satu profil',
                'One-to-Many: satu kategori memuat banyak tugas',
                'Many-to-Many: memakai tabel perantara tambahan',
              ],
            },
            {
              title: 'Kompatibilitas XAMPP & MariaDB',
              tag: 'Lingkungan',
              description:
                'XAMPP modern menyertakan MariaDB yang sepenuhnya kompatibel dengan protokol MySQL.',
              bullets: [
                'Berjalan di port standar 3306 secara lokal',
                'Mendukung sintaks SQL standar dan paket mysql2',
                'Periksa versi melalui perintah SELECT VERSION()',
              ],
            },
          ],
        },
      },
      {
        slideNumber: 5,
        isSummary: false,
        layoutType: 'bento',
        badge: 'Bedah Teknis & Sintaks',
        title: 'Skema SQL Relasional & Connection Pool mysql2/promise',
        subtitle:
          'Gunakan connection pool berbasis promise agar eksekusi query tetap ringan dan rapi.',
        contentJson: {
          eyebrow: 'SINTAKS SQL & DRIVER MYSQL2',
          highlights: [
            'Impor modul mysql2/promise supaya seluruh query mendukung sintaks async dan await',
            'Connection pool mengelola antrean koneksi tanpa membuka koneksi baru berulang kali',
          ],
          bentoCards: [
            {
              title: 'Skema Tabel & Query LEFT JOIN',
              tag: 'schema.sql',
              description:
                'Membangun relasi categories ke tasks lalu menggabungkan datanya menggunakan LEFT JOIN.',
              code: {
                title: 'Skema & Query JOIN TaskFlow',
                language: 'sql',
                filename: 'schema.sql',
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
FROM tasks t LEFT JOIN categories c ON t.category_id = c.id;`,
              },
            },
            {
              title: 'Konfigurasi Pool & Parameter (?)',
              tag: 'src/config/db.js',
              description:
                'Membaca kredensial database dari .env dan menjalankan query berparameter aman.',
              code: {
                title: 'Pool Koneksi & Parameterized Query',
                language: 'javascript',
                filename: 'src/config/db.js',
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
}`,
              },
            },
          ],
        },
      },
      {
        slideNumber: 6,
        isSummary: false,
        layoutType: 'comparison',
        badge: 'Good vs Bad Practice',
        title: 'Celah SQL Injection vs Parameterized Query',
        subtitle:
          'Menyambung input pengguna langsung ke teks SQL membuka celah kebocoran database.',
        contentJson: {
          eyebrow: 'KEAMANAN & KETEPATAN QUERY',
          highlights: [
            'Gunakan placeholder tanda tanya agar input diproses sebagai data murni',
            'Selalu sertakan klausa WHERE saat menjalankan perintah UPDATE maupun DELETE',
          ],
          comparison: {
            badTitle: '✕ Berisiko Tinggi (Bad Practice)',
            badPoints: [
              'Menggabungkan input pengguna ke string SQL memakai template literal',
              'Menyimpan kata sandi database secara terbuka di dalam kode sumber',
              'Menjalankan perintah UPDATE atau DELETE tanpa klausa penyaring WHERE',
            ],
            badCode: {
              title: 'Rentan SQL Injection dan kredensial terbuka',
              language: 'javascript',
              filename: 'bad-db.js',
              snippet: `const conn = await mysql.createConnection({
  host: 'localhost', user: 'root', password: 'secret123', database: 'taskflow',
});
// Rawan SQL Injection jika input berisi kutip tunggal
const sql = \`SELECT * FROM tasks WHERE title = '\${req.query.q}'\`;
const [rows] = await conn.query(sql);`,
            },
            goodTitle: '✓ Aman & Terstandar (Good Practice)',
            goodPoints: [
              'Memisahkan perintah SQL dan nilai parameter menggunakan array pada pool.query()',
              'Menyimpan kredensial koneksi database di dalam file .env lokal',
              'Menyertakan klausa WHERE berparameter saat mengubah atau menghapus baris',
            ],
            goodCode: {
              title: 'Aman dengan Pool dan Parameterized Query',
              language: 'javascript',
              filename: 'good-db.js',
              snippet: `// Kredensial dimuat dari .env melalui instance pool
const [rows] = await pool.query(
  'SELECT id, title, is_done FROM tasks WHERE title LIKE ? ORDER BY id DESC LIMIT 50',
  [\`%\${keyword}%\`]
);
// Pembaruan baris spesifik menggunakan parameter terikat
await pool.query('UPDATE tasks SET is_done = ? WHERE id = ?', [isDone, taskId]);`,
            },
          },
        },
      },
      {
        slideNumber: 7,
        isSummary: false,
        layoutType: 'practice',
        badge: '70% Praktik Hands-On',
        title: 'Membuat Database TaskFlow & Koneksi Express ke MySQL',
        subtitle:
          'Ikuti empat langkah ini untuk membaca data tabel MySQL langsung dari endpoint Express.',
        contentJson: {
          eyebrow: 'PRAKTIK TERBIMBING || MYSQL & EXPRESS',
          highlights: [
            'Jalankan MySQL melalui XAMPP agar pengujian berjalan cepat di komputer lokal',
            'Simpan seluruh perintah pembuatan tabel ke dalam file schema.sql di repositori',
          ],
          practiceSteps: [
            {
              step: 1,
              title: 'Aktifkan MySQL di XAMPP & Buka phpMyAdmin',
              description:
                'Klik Start pada modul Apache dan MySQL di XAMPP lalu akses localhost/phpmyadmin.',
            },
            {
              step: 2,
              title: 'Buat Database taskflow & Isi Data Awal',
              description:
                'Jalankan skema tabel categories dan tasks di tab SQL lalu masukkan data contoh.',
              code: `INSERT INTO categories (name) VALUES ('Backend'), ('Frontend');
INSERT INTO tasks (category_id, title, is_done) VALUES
  (1, 'Buat database taskflow di XAMPP', 1),
  (1, 'Hubungkan Express dengan mysql2', 0);`,
            },
            {
              step: 3,
              title: 'Pasang mysql2 & Lengkapi Konfigurasi .env',
              description:
                'Instal paket mysql2 di folder backend dan tambahkan kredensial database pada file .env.',
              command: 'npm install mysql2',
              code: `DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=taskflow`,
            },
            {
              step: 4,
              title: 'Hubungkan GET /api/tasks ke Tabel MySQL',
              description:
                'Panggil pool.query dengan LEFT JOIN pada rute GET /api/tasks lalu verifikasi lewat Postman.',
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
});`,
            },
          ],
        },
      },
      {
        slideNumber: 8,
        isSummary: false,
        layoutType: 'quiz',
        badge: 'Kuis & Pustaka Referensi',
        title: 'Evaluasi Konsep SQL & Referensi Database MySQL',
        subtitle:
          'Pastikan konsep kunci relasi, JOIN, dan keamanan query sudah dikuasai dengan baik.',
        contentJson: {
          eyebrow: 'KUIS KONSEP & REFERENSI',
          highlights: [
            'Jawab empat soal konsep database sebelum menyelesaikan tugas Pertemuan 07',
            'Manfaatkan buku elektronik dan materi video pilihan untuk latihan mandiri',
          ],
          quizItems: [
            {
              question: 'Apa perbedaan antara database dan tabel di dalam MySQL?',
              hint: 'Bandingkan wadah aplikasi secara utuh dengan struktur baris dan kolom.',
              answer:
                'Database adalah wadah utama yang mengelompokkan seluruh data milik satu aplikasi seperti taskflow. Tabel adalah struktur baris dan kolom di dalam database yang menyimpan satu entitas spesifik seperti tasks atau categories.',
            },
            {
              question: 'Apa peran primary key dan foreign key pada relasi One-to-Many?',
              hint: 'Perhatikan hubungan antara categories.id dan tasks.category_id.',
              answer:
                'Primary key memberi identitas unik pada setiap baris di tabel asalnya. Foreign key menyimpan rujukan ke primary key tabel lain untuk menjaga keutuhan relasi antartabel.',
            },
            {
              question: 'Mengapa eksekusi query di Node.js wajib memakai parameter tanda tanya (?)?',
              hint: 'Kaitkan dengan pencegahan serangan SQL Injection.',
              answer:
                'Parameterized query memisahkan struktur perintah SQL dari nilai input yang dikirim pengguna. Driver mysql2 akan mensterilkan nilai tersebut secara otomatis sehingga mencegah serangan SQL Injection.',
            },
            {
              question: 'Kapan kita memilih LEFT JOIN dibandingkan INNER JOIN saat membaca tasks?',
              hint: 'Pertimbangkan baris tugas yang kolom category_id-nya bernilai NULL.',
              answer:
                'LEFT JOIN tetap menampilkan seluruh baris tugas meskipun kolom category_id bernilai NULL. INNER JOIN hanya menampilkan baris tugas yang sudah memiliki pasangan kategori yang cocok.',
            },
          ],
          references: [
            {
              title: 'Tutorial MySQL untuk Pemula Hingga Mahir (PDF)',
              url: 'https://umardanny.com/tutorial-mysql-untuk-pemula-hingga-mahir-ebook-download-pdf/',
              author: 'Umar Danny',
              category: 'MySQL',
              lang: 'ID',
              type: 'Book',
            },
            {
              title: 'MYSQL Tutorial Bahasa Indonesia (Playlist)',
              url: 'https://www.youtube.com/playlist?list=PL-CtdCApEFH_P2_2zR6pvDublvpD3fF6W',
              author: 'Eko Kurniawan Khannedy (Programmer Zaman Now)',
              category: 'MySQL',
              lang: 'ID',
              type: 'Course',
            },
            {
              title: 'Belajar MySQL (Playlist)',
              url: 'https://www.youtube.com/playlist?list=PL2O3HdJI4voGs6CiEUPXwt1fhLLqu30E_',
              author: 'Indonesia Belajar',
              category: 'MySQL',
              lang: 'ID',
              type: 'Course',
            },
            {
              title: 'mysql2 || Node.js MySQL Client Documentation',
              url: 'https://sidorares.github.io/node-mysql2/',
              author: 'Andrey Sidorov',
              category: 'Node.js MySQL',
              lang: 'EN',
              type: 'Docs',
            },
            {
              title: 'MySQL Official Documentation & phpMyAdmin Docs',
              url: 'https://dev.mysql.com/doc/',
              author: 'Oracle MySQL',
              category: 'Database',
              lang: 'EN',
              type: 'Docs',
            },
          ],
          weeklyAssignment: {
            week: 7,
            title: 'Weekly Assignment 7: Database MySQL & Latihan Query CRUD',
            description:
              'Latih query INSERT, SELECT dengan WHERE serta ORDER BY, UPDATE, dan DELETE di phpMyAdmin lalu simpan ke sql/practice.sql.',
          },
        },
      },
      {
        slideNumber: 9,
        isSummary: false,
        layoutType: 'task',
        badge: 'Deliverable & Learning Log',
        title: 'Pengumpulan Tugas Pertemuan 07 untuk ACC Mentor',
        subtitle:
          'Unggah file schema.sql beserta modul koneksi mysql2/promise ke repositori GitHub Anda.',
        contentJson: {
          eyebrow: 'SYARAT MEMBUKA PERTEMUAN 08',
          highlights: [
            'Pastikan kredensial database berada di .env dan tercatat pada .gitignore',
            'Pertemuan 08 akan melanjutkan kelima endpoint CRUD hingga terhubung ke frontend',
          ],
          deliverables: [
            'File schema.sql berisi pembuatan database, tabel berelasi, dan data awal',
            'File src/config/db.js menggunakan mysql2/promise createPool berbasis variabel .env',
            'Endpoint GET /api/tasks menampilkan data nyata dari MySQL saat diuji di Postman',
            'Learning Log lengkap beserta tautan commit GitHub terbaru',
          ],
          learningLogFields: [
            'Konsep relasi primary key, foreign key, dan penggabungan tabel dengan JOIN',
            'Langkah pembuatan database di phpMyAdmin serta konfigurasi pool mysql2',
            'Kendala koneksi port atau sintaks SQL yang ditemui beserta solusinya',
            'Tautan repositori GitHub dan lokasi file schema.sql',
          ],
          competencyChecklist: [
            'Mampu merancang database dan tabel berelasi melalui phpMyAdmin',
            'Mampu menulis perintah SQL dasar beserta klausa penyaring dan JOIN',
            'Mampu menghubungkan Express ke MySQL memakai mysql2/promise dan .env',
            'Mampu menerapkan parameterized query untuk keamanan input dinamis',
          ],
          mentorTip:
            'Pastikan layanan MySQL di XAMPP sudah berstatus aktif sebelum menjalankan server agar terhindar dari error ECONNREFUSED.',
        },
      },
    ],
  },

  // =========================================================================
  // PERTEMUAN 09 || Praktik Bulan 2: REST API CRUD Express + MySQL & Integrasi Frontend
  // =========================================================================
  {
    orderIndex: 9,
    month: 2,
    slug: 'pertemuan-09-praktik-rest-api-crud-mysql',
    code: 'P09',
    sessionType: 'Praktik',
    title: 'Praktik Bulan 2: REST API CRUD Express + MySQL & Integrasi Frontend',
    subtitle:
      'Membangun lima endpoint CRUD Express dan MySQL lengkap dengan validasi, CORS, serta integrasi fetch di frontend.',
    summaryText:
      'Peserta menyatukan antarmuka Bulan 1 dengan REST API Express dan database MySQL melalui lima endpoint CRUD tervalidasi.',
    taskPrompt:
      'Lengkapi 5 endpoint CRUD /api/tasks menggunakan Express dan mysql2, pasang middleware CORS serta penangan error, lalu hubungkan antarmuka Bulan 1 via fetch().',
    taskDeliverables: [
      'Backend Express.js menyediakan 5 endpoint CRUD /api/tasks dengan parameterized query ke MySQL',
      'Middleware cors aktif disertai validasi input (400), pengecekan ID kosong (404), dan error handler (500)',
      'Frontend Bulan 1 memanggil REST API menggunakan fetch() untuk membaca, menambah, mengubah, dan menghapus tugas',
      'Dokumentasi README.md memuat tabel spesifikasi endpoint beserta bukti pengujian Postman',
    ],
    accentGradient: 'from-indigo-600 to-violet-500',
    iconName: 'HardDrives',
    slides: [
      {
        slideNumber: 1,
        isSummary: true,
        layoutType: 'cover',
        badge: 'Bulan 2 • Pertemuan 08 • Praktik',
        title: 'Praktik Bulan 2: REST API CRUD Express + MySQL & Integrasi Frontend',
        subtitle:
          'Menyatukan antarmuka Bulan 1 dengan backend Express dan penyimpanan permanen di MySQL.',
        contentJson: {
          eyebrow: 'DIGITEK BOOTCAMP || FULL CRUD INTEGRATION',
          highlights: [
            'Lima endpoint wajib: GET daftar, GET detail, POST, PUT, dan DELETE',
            'Validasi payload, pengecekan affectedRows untuk 404, dan penanganan error terpusat',
            'Konfigurasi middleware CORS untuk komunikasi antarmuka dan server beda port',
            'Migrasi kode frontend dari localStorage menuju pemanggilan fetch() asinkron',
          ],
          stats: [
            { label: 'Fokus Sesi', value: '80% Praktik Live Coding' },
            { label: 'Target API', value: '5 Endpoint CRUD' },
            { label: 'Integrasi', value: 'Frontend fetch() -> Express -> MySQL' },
            { label: 'Mentor', value: 'Alfin Almustajab' },
          ],
          mentorTip:
            'Pastikan kelima endpoint berjalan benar di Postman sebelum menyambungkannya ke kode antarmuka browser.',
        },
      },
      {
        slideNumber: 2,
        isSummary: true,
        layoutType: 'summary',
        badge: 'Ringkasan Materi',
        title: 'Menjembatani Browser dan Database melalui Kontrak API',
        subtitle:
          'Frontend kini bertukar data melalui jaringan HTTP menuju Express dan tabel MySQL.',
        contentJson: {
          eyebrow: 'RINGKASAN EKSEKUTIF || ALUR UJUNG KE UJUNG',
          highlights: [
            'Seluruh perubahan data dari antarmuka langsung tersimpan permanen di tabel MySQL',
            'Endpoint PUT dan DELETE memeriksa affectedRows bernilai nol untuk status 404',
            'Middleware cors membuka izin akses lintas port antara frontend dan backend',
            'Fungsi async di frontend memperbarui tampilan DOM sesuai respons server',
          ],
          stats: [
            { label: 'Endpoint CRUD', value: '5 Rute' },
            { label: 'Origin Frontend', value: 'localhost:5500' },
            { label: 'Origin API', value: 'localhost:3000' },
          ],
        },
      },
      {
        slideNumber: 3,
        isSummary: true,
        layoutType: 'bento',
        badge: 'Peta Konsep & Agenda',
        title: 'Arsitektur Alur Data & Target Praktik Sesi Ini',
        subtitle:
          'Menelusuri perjalanan data sejak tombol diklik hingga baris MySQL tampil kembali di layar.',
        contentJson: {
          eyebrow: 'AGENDA PRAKTIK PERTEMUAN 08',
          highlights: [
            '20% ulasan teknis: router modular, kontrak endpoint, dan kebijakan CORS',
            '80% praktik: penulisan CRUD MySQL, uji Postman, dan integrasi fetch',
          ],
          bentoCards: [
            {
              title: '1. Router Modular Express',
              tag: 'src/routes/tasks.js',
              description:
                'Memisahkan rute /api/tasks memakai express.Router() agar kode server tetap terorganisasi.',
            },
            {
              title: '2. Operasi CRUD & Cek 404',
              tag: 'Express + mysql2',
              description:
                'Memanfaatkan insertId pada POST serta affectedRows pada PUT dan DELETE.',
            },
            {
              title: '3. CORS & Global Error Handler',
              tag: 'Middleware',
              description:
                'Mengizinkan origin frontend lokal dan menangkap kegagalan server dalam format JSON.',
            },
            {
              title: '4. Integrasi fetch() di UI',
              tag: 'Antarmuka TaskFlow',
              description:
                'Mengganti fungsi localStorage dengan request GET, POST, PUT, dan DELETE ke API.',
            },
          ],
        },
      },
      {
        slideNumber: 4,
        isSummary: false,
        layoutType: 'bento',
        badge: 'Konsep Integrasi',
        title: 'Kebijakan CORS & Siklus Asinkron fetch() di Browser',
        subtitle:
          'Memahami aturan keamanan lintas port di browser serta cara menangani waktu tunggu respons.',
        contentJson: {
          eyebrow: 'KOMUNIKASI CLIENT-SERVER',
          highlights: [
            'Browser memblokir komunikasi beda port kecuali server menyertakan header izin CORS',
            'Gunakan blok try/catch dan periksa properti res.ok saat memproses respons jaringan',
          ],
          bentoCards: [
            {
              title: 'Penyebab & Solusi CORS',
              tag: 'Keamanan Browser',
              description:
                'Port 5500 pada frontend dan port 3000 pada API diperlakukan sebagai origin berbeda.',
              bullets: [
                'Pasang paket cors lalu daftarkan app.use(cors())',
                'Batasi domain origin khusus saat masuk produksi',
              ],
            },
            {
              title: 'Spesifikasi 5 Endpoint CRUD',
              tag: 'Kontrak REST',
              description:
                'Pola URL dan kode status standar untuk pengelolaan resource tugas.',
              bullets: [
                'GET /api/tasks dan /:id mengembalikan 200 atau 404',
                'POST /api/tasks mengembalikan 201 atau 400',
                'PUT dan DELETE /:id mengembalikan 200 atau 404',
              ],
            },
            {
              title: 'Konfigurasi fetch() POST & PUT',
              tag: 'Frontend JS',
              description:
                'Pengiriman payload membutuhkan deklarasi method, header JSON, dan serialisasi body.',
              bullets: [
                'Sertakan header Content-Type bernilai application/json',
                'Ubah objek menjadi teks lewat JSON.stringify()',
                'Periksa kondisi res.ok sebelum memperbarui tampilan',
              ],
            },
            {
              title: 'Penerapan pada Dual Track',
              tag: 'Fleksibilitas',
              description:
                'Arsitektur CRUD ini berlaku identik baik untuk jalur TaskFlow maupun InternFlow.',
              bullets: [
                'TaskFlow dengan API mengelola daftar tugas di /api/tasks',
                'InternFlow dengan API mengelola log kegiatan di /api/interns',
              ],
            },
          ],
        },
      },
      {
        slideNumber: 5,
        isSummary: false,
        layoutType: 'bento',
        badge: 'Bedah Teknis & Sintaks',
        title: 'Implementasi Router CRUD MySQL & Konsumsi fetch()',
        subtitle:
          'Contoh ringkas mutasi data di Express serta pemanggilannya dari skrip antarmuka.',
        contentJson: {
          eyebrow: 'KODE INTI BACKEND & FRONTEND',
          highlights: [
            'Gunakan properti result.insertId setelah INSERT untuk mengambil baris yang baru dibuat',
            'Periksa result.affectedRows bernilai nol pada UPDATE dan DELETE untuk status 404',
          ],
          bentoCards: [
            {
              title: 'Router Mutasi Data di Backend',
              tag: 'src/routes/tasks.js',
              description:
                'Menangani penambahan dan pembaruan tugas menggunakan parameterized query serta validasi.',
              code: {
                title: 'Cuplikan POST & DELETE dengan mysql2',
                language: 'javascript',
                filename: 'src/routes/tasks.js',
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
});`,
              },
            },
            {
              title: 'Pemanggilan API dari Frontend',
              tag: 'frontend/app.js',
              description:
                'Mengambil daftar tugas dan mengirim tugas baru menggunakan fungsi async fetch().',
              code: {
                title: 'Konsumsi REST API dengan fetch()',
                language: 'javascript',
                filename: 'frontend/app.js',
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
}`,
              },
            },
          ],
        },
      },
      {
        slideNumber: 6,
        isSummary: false,
        layoutType: 'comparison',
        badge: 'Good vs Bad Practice',
        title: 'Penanganan Error Rapuh vs Standar API Siap Produksi',
        subtitle:
          'Sembunyikan detail internal database dari publik dan tangani setiap kegagalan di antarmuka.',
        contentJson: {
          eyebrow: 'STANDAR KUALITAS INTEGRASI',
          highlights: [
            'Oper error ke middleware global agar struktur database tidak bocor',
            'Perbarui elemen DOM hanya setelah server mengonfirmasi status respons berhasil',
          ],
          comparison: {
            badTitle: '✕ Implementasi Rapuh (Bad Practice)',
            badPoints: [
              'Mengirim objek error SQL mentah langsung ke respons HTTP klien',
              'Mengembalikan status 200 OK meskipun ID yang dihapus tidak ditemukan',
              'Melewatkan header Content-Type saat mengirim payload JSON dari fetch()',
            ],
            badCode: {
              title: 'Membocorkan error internal dan mengabaikan affectedRows',
              language: 'javascript',
              filename: 'bad-route.js',
              snippet: `app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM tasks WHERE id = ' + req.params.id);
    res.json({ ok: true }); // Tetap 200 walau ID tidak ada
  } catch (err) {
    res.status(500).send(err); // Struktur tabel bocor ke publik
  }
});`,
            },
            goodTitle: '✓ Standar API Profesional (Good Practice)',
            goodPoints: [
              'Memeriksa result.affectedRows === 0 untuk mengirim status 404 secara akurat',
              'Mencatat log error internal dan mengirim pesan aman ke klien',
              'Memverifikasi nilai res.ok di frontend sebelum menyinkronkan ulang tampilan',
            ],
            goodCode: {
              title: 'Global Error Handler yang aman dan konsisten',
              language: 'javascript',
              filename: 'src/server.js',
              snippet: `// Pasang setelah seluruh rute terdaftar di server.js
app.use((err, req, res, next) => {
  console.error('[API Error]', err.message);
  res.status(500).json({
    success: false,
    message: 'Terjadi gangguan pada server. Silakan coba kembali.',
  });
});`,
            },
          },
        },
      },
      {
        slideNumber: 7,
        isSummary: false,
        layoutType: 'practice',
        badge: '70% Praktik Hands-On',
        title: 'Eksekusi Full CRUD TaskFlow dengan API & Integrasi Antarmuka',
        subtitle:
          'Bangun kelima endpoint CRUD, verifikasi di Postman, lalu sambungkan ke halaman web.',
        contentJson: {
          eyebrow: 'LANGKAH PRAKTIK TERSTRUKTUR',
          highlights: [
            'Pastikan layanan MySQL aktif dan tabel tasks sudah tersedia di database',
            'Nyalakan server Express dan server statis frontend secara bersamaan saat pengujian',
          ],
          practiceSteps: [
            {
              step: 1,
              title: 'Pasang Middleware CORS & Pisahkan Router',
              description:
                'Instal paket cors, aktifkan app.use(cors()), dan hubungkan router /api/tasks di server.js.',
              command: 'npm install cors',
            },
            {
              step: 2,
              title: 'Lengkapi 5 Endpoint CRUD di src/routes/tasks.js',
              description:
                'Tulis rute GET semua, GET detail, POST, PUT, dan DELETE menggunakan parameterized query.',
            },
            {
              step: 3,
              title: 'Uji Siklus Lengkap CRUD Melalui Postman',
              description:
                'Uji urutan tambah data, baca detail, ubah status, hapus baris, hingga verifikasi kode 404.',
            },
            {
              step: 4,
              title: 'Ganti localStorage dengan fetch() di Frontend',
              description:
                'Hubungkan antarmuka Bulan 1 ke API lalu muat ulang halaman untuk memastikan data bertahan.',
            },
          ],
        },
      },
      {
        slideNumber: 8,
        isSummary: false,
        layoutType: 'quiz',
        badge: 'Kuis & Pustaka Referensi',
        title: 'Evaluasi Integrasi Client-Server & Referensi Pendukung',
        subtitle:
          'Uji pemahaman mengenai kebijakan CORS, pengecekan baris database, dan pengiriman header fetch.',
        contentJson: {
          eyebrow: 'KUIS INTEGRASI & REFERENSI',
          highlights: [
            'Pahami alur utuh dari klik pengguna, fetch, SQL, hingga DOM',
            'Pelajari materi asinkron JavaScript dan dokumentasi Express untuk memperdalam praktik',
          ],
          quizItems: [
            {
              question: 'Mengapa error CORS muncul saat frontend lokal memanggil API dan bagaimana solusinya?',
              hint: 'Bandingkan nomor port antarmuka dengan nomor port backend.',
              answer:
                'Browser menerapkan Same-Origin Policy ketika frontend di port 5500 memanggil API di port 3000. Masalah ini diatasi dengan memasang middleware cors pada Express agar server menyertakan header Access-Control-Allow-Origin.',
            },
            {
              question: 'Bagaimana cara mengetahui apakah ID pada PUT atau DELETE benar-benar ada di MySQL?',
              hint: 'Periksa objek hasil eksekusi dari pool.query().',
              answer:
                'Periksa nilai properti result.affectedRows setelah menjalankan query UPDATE atau DELETE. Jika nilainya 0, baris dengan ID tersebut tidak ada dan server wajib mengembalikan status 404 Not Found.',
            },
            {
              question: 'Mengapa header Content-Type application/json wajib disertakan pada fetch() POST dan PUT?',
              hint: 'Ingat syarat agar middleware express.json() memproses body.',
              answer:
                'Middleware express.json() hanya mengurai isi body apabila header Content-Type bernilai application/json. Tanpa header tersebut, objek req.body di sisi backend akan tetap kosong.',
            },
          ],
          references: [
            {
              title: 'Express.js 4.x API Reference',
              url: 'https://expressjs.com/en/4x/api.html',
              author: 'Express.js',
              category: 'Express.js',
              lang: 'EN',
              type: 'Docs',
            },
            {
              title: 'Tutorial JavaScript Modern (Fetch & Async/Await)',
              url: 'https://id.javascript.info',
              author: 'Ilya Kantor',
              category: 'JavaScript Async',
              lang: 'ID',
              type: 'Book',
            },
            {
              title: 'Belajar JavaScript Async (Playlist)',
              url: 'https://www.youtube.com/playlist?list=PL-CtdCApEFH-I4CD6km3BcXqrhWAkY4et',
              author: 'Eko Kurniawan Khannedy (Programmer Zaman Now)',
              category: 'JavaScript Async',
              lang: 'ID',
              type: 'Course',
            },
            {
              title: 'Postman Learning Center',
              url: 'https://learning.postman.com/',
              author: 'Postman',
              category: 'API Testing',
              lang: 'EN',
              type: 'Docs',
            },
            {
              title: 'Project-Based Learning (Web & Node.js)',
              url: 'https://github.com/practical-tutorials/project-based-learning',
              author: 'Practical Tutorials',
              category: 'Project-Based Learning',
              lang: 'EN',
              type: 'PBL',
            },
          ],
          weeklyAssignment: {
            week: 8,
            title: 'Weekly Assignment 8: Menghubungkan API Express dengan MySQL',
            description:
              'Tambahkan fitur pencarian query string (q=kata) memakai klausa SQL LIKE berparameter dan hubungkan ke kotak cari frontend.',
          },
        },
      },
      {
        slideNumber: 9,
        isSummary: false,
        layoutType: 'task',
        badge: 'Deliverable & Learning Log',
        title: 'Pengumpulan Tugas Pertemuan 08 untuk ACC Mentor',
        subtitle:
          'Kumpulkan repositori berisi backend CRUD, frontend terintegrasi, dan dokumentasi endpoint pada README.md.',
        contentJson: {
          eyebrow: 'SYARAT MEMBUKA PERTEMUAN 09',
          highlights: [
            'Pastikan tugas baru tetap tampil setelah halaman browser dimuat ulang',
            'Pertemuan 09 berfokus pada debugging, audit kode, dan cadangan file .sql',
          ],
          deliverables: [
            '5 endpoint CRUD /api/tasks berjalan lengkap dengan status 200, 201, 400, 404, dan 500',
            'Antarmuka Bulan 1 terhubung penuh ke API Express menggunakan fetch() async dan await',
            'File README.md memuat panduan instalasi, variabel .env.example, dan daftar endpoint',
            'Catatan Learning Log beserta tautan commit GitHub terbaru',
          ],
          learningLogFields: [
            'Alur komunikasi dari fetch() di browser menuju Express hingga tabel MySQL',
            'Daftar fitur CRUD yang telah diuji melalui Postman dan halaman antarmuka',
            'Kendala integrasi seperti CORS atau format payload beserta cara mengatasinya',
            'Tautan repositori GitHub untuk kode backend dan frontend',
          ],
          competencyChecklist: [
            'Mampu membangun 5 endpoint REST API CRUD menggunakan Express dan mysql2',
            'Mampu menerapkan parameterized query, validasi input, dan penanganan error terpusat',
            'Mampu menguji skenario positif serta negatif secara menyeluruh di Postman',
            'Mampu mengintegrasikan antarmuka web dengan REST API melalui fetch()',
          ],
          mentorTip:
            'Buka tab Network di Chrome DevTools untuk memeriksa status code dan isi payload saat hasil di antarmuka tidak sesuai harapan.',
        },
      },
    ],
  },

  // =========================================================================
  // PERTEMUAN 10 || Project Clinic, Debugging API, Code Review & Intro Railway
  // =========================================================================
  {
    orderIndex: 10,
    month: 2,
    slug: 'pertemuan-10-project-clinic-debugging-railway',
    code: 'P10',
    sessionType: 'Project Clinic',
    title: 'Project Clinic, Debugging API, Code Review & Intro Railway',
    subtitle:
      'Mendiagnosis bug API dan koneksi MySQL, meninjau kerapian repositori Git, mencadangkan file .sql, serta pengenalan Railway.',
    summaryText:
      'Sesi klinik kode memastikan proyek bebas bug, aman dari kebocoran kredensial, memiliki cadangan .sql, dan terdokumentasi rapi.',
    taskPrompt:
      'Tuntaskan seluruh bug pada TaskFlow atau InternFlow dengan API, rapikan struktur folder dan README, ekspor cadangan database/taskflow.sql, serta siapkan koleksi Postman.',
    taskDeliverables: [
      'Seluruh 5 endpoint CRUD dan antarmuka berjalan stabil tanpa error di konsol maupun server',
      'File cadangan database/taskflow.sql hasil ekspor phpMyAdmin tersimpan di dalam repositori',
      'Dokumentasi README.md dan file koleksi Postman (.json) memuat contoh request serta respons',
      'Catatan hasil audit kode dan perbaikan bug tercatat rapi pada Learning Log',
    ],
    accentGradient: 'from-amber-600 to-orange-500',
    iconName: 'Wrench',
    slides: [
      {
        slideNumber: 1,
        isSummary: true,
        layoutType: 'cover',
        badge: 'Bulan 2 • Pertemuan 09 • Project Clinic',
        title: 'Project Clinic, Debugging API, Code Review & Intro Railway',
        subtitle:
          'Menuntaskan bug tersisa, mengaudit keamanan repositori, mencadangkan file .sql, dan mengenal persiapan deployment.',
        contentJson: {
          eyebrow: 'DIGITEK BOOTCAMP || KLINIK KODE & AUDIT KUALITAS',
          highlights: [
            'Diagnosis terarah untuk error koneksi MySQL, CORS, dan endpoint CRUD',
            'Tinjauan struktur folder, keamanan .gitignore, serta kerapian riwayat commit Git',
            'Ekspor cadangan database .sql dan penyusunan dokumentasi koleksi Postman',
            'Pengenalan deployment di Railway beserta kesiapan demonstrasi lokal',
          ],
          stats: [
            { label: 'Format Sesi', value: 'Klinik Kode & Review 1-on-1' },
            { label: 'Target', value: 'CRUD Stabil + Cadangan .sql' },
            { label: 'Cloud Intro', value: 'Railway (Opsional / Latihan)' },
            { label: 'Mentor', value: 'Alfin Almustajab' },
          ],
          mentorTip:
            'Gunakan sesi klinik untuk memahami akar penyebab setiap bug agar kesalahan serupa tidak terulang pada proyek berikutnya.',
        },
      },
      {
        slideNumber: 2,
        isSummary: true,
        layoutType: 'summary',
        badge: 'Ringkasan Materi',
        title: 'Menyiapkan Proyek Berstandar Tim Sebelum Evaluasi',
        subtitle:
          'Kesiapan demo ditentukan oleh stabilitas penanganan error, keamanan kredensial, dan kelengkapan cadangan database.',
        contentJson: {
          eyebrow: 'RINGKASAN EKSEKUTIF || PROJECT CLINIC',
          highlights: [
            'Memastikan seluruh peserta menuntaskan fitur minimum sebelum sesi evaluasi Pertemuan 10',
            'Melatih pembacaan kode error Node.js dan MySQL dari log terminal',
            'Mengenalkan konsep deployment cloud dengan demonstrasi lokal sebagai standar utama',
          ],
          stats: [
            { label: 'Bobot Proyek', value: '40% Nilai Bulan 2' },
            { label: 'Bobot Git & Repo', value: '10% Nilai Bulan 2' },
            { label: 'Cadangan Wajib', value: 'taskflow.sql' },
          ],
        },
      },
      {
        slideNumber: 3,
        isSummary: true,
        layoutType: 'bento',
        badge: 'Peta Konsep & Agenda',
        title: 'Empat Pos Pemeriksaan Kualitas Proyek Bulan 2',
        subtitle:
          'Tahapan audit menyeluruh agar aplikasi siap didemonstrasikan tanpa kendala teknis.',
        contentJson: {
          eyebrow: 'DAFTAR PERIKSA PROJECT CLINIC',
          highlights: [
            'Peserta melewati pos debugging, audit kode, cadangan SQL, dan dokumentasi',
          ],
          bentoCards: [
            {
              title: 'Pos 1: Diagnosis Koneksi & API',
              tag: 'Diagnostik',
              description:
                'Menelusuri penyebab error ECONNREFUSED, ER_ACCESS_DENIED, pemblokiran CORS, dan req.body kosong.',
            },
            {
              title: 'Pos 2: Code Review & Kerapian Git',
              tag: 'Kualitas Kode',
              description:
                'Memeriksa pemisahan folder, konsistensi penamaan, parameter SQL, serta perlindungan file .env.',
            },
            {
              title: 'Pos 3: Cadangan .sql & Dokumentasi',
              tag: 'Portabilitas',
              description:
                'Mengekspor skema database dan koleksi Postman agar proyek mudah dijalankan ulang.',
            },
            {
              title: 'Pos 4: Pengenalan Deployment Railway',
              tag: 'Deployment',
              description:
                'Mempelajari pengaturan variabel lingkungan cloud, batas kuota latihan, dan skenario demo lokal.',
            },
          ],
        },
      },
      {
        slideNumber: 4,
        isSummary: false,
        layoutType: 'bento',
        badge: 'Panduan Debugging',
        title: 'Panduan Cepat Diagnosis Error Backend & MySQL',
        subtitle:
          'Baca kode error pada terminal untuk menemukan sumber masalah secara presisi.',
        contentJson: {
          eyebrow: 'PANDUAN PENANGANAN MASALAH',
          highlights: [
            'Pesan error Node.js dan MySQL memuat kode spesifik beserta baris penyebabnya',
          ],
          bentoCards: [
            {
              title: 'ECONNREFUSED 127.0.0.1:3306',
              tag: 'Koneksi',
              description:
                'Aplikasi Node.js gagal menjangkau layanan server database di komputer lokal.',
              bullets: [
                'Pastikan modul MySQL di XAMPP sudah berstatus Start',
                'Cocokkan nilai DB_PORT di .env dengan port aktif',
              ],
            },
            {
              title: 'ER_ACCESS_DENIED / ER_BAD_DB_ERROR',
              tag: 'Autentikasi',
              description:
                'Kredensial pengguna keliru atau nama database tujuan belum tersedia di MySQL.',
              bullets: [
                'Pengaturan bawaan XAMPP memakai user root tanpa sandi',
                'Periksa kesamaan ejaan DB_NAME dengan daftar di phpMyAdmin',
              ],
            },
            {
              title: 'Property of undefined (req.body)',
              tag: 'Payload',
              description:
                'Isi JSON dari client tidak terurai sebelum masuk ke fungsi penangan rute.',
              bullets: [
                'Letakkan app.use(express.json()) di atas deklarasi rute',
                'Pastikan pengirim menyertakan header Content-Type application/json',
              ],
            },
            {
              title: 'Kebijakan Latihan Cloud Railway',
              tag: 'Deployment',
              description:
                'Prinsip aman saat mencoba mengunggah aplikasi backend ke layanan cloud.',
              bullets: [
                'Pastikan aplikasi berjalan stabil di lokal terlebih dahulu',
                'Isi kredensial melalui menu Variables pada dashboard Railway',
                'Siapkan demo lokal dan file .sql cadangan',
              ],
            },
          ],
        },
      },
      {
        slideNumber: 5,
        isSummary: false,
        layoutType: 'bento',
        badge: 'Code Review & Struktur',
        title: 'Struktur Folder Ideal & Konfigurasi Port Dinamis',
        subtitle:
          'Tata letak repositori yang bersih mempermudah peninjauan kode maupun proses deployment.',
        contentJson: {
          eyebrow: 'STANDAR REPOSITORI & DEPLOYMENT',
          highlights: [
            'Gunakan process.env.PORT agar server menyesuaikan port lokal maupun port dinamis cloud',
            'Lampirkan database/taskflow.sql dan .env.example agar proyek mudah direplikasi',
          ],
          bentoCards: [
            {
              title: 'Tata Letak Repositori Rapi',
              tag: 'Struktur Folder',
              description:
                'Pisahkan direktori backend, frontend, cadangan SQL, dan koleksi pengujian Postman.',
              code: {
                title: 'Struktur Proyek TaskFlow dengan API',
                language: 'text',
                filename: 'tree.txt',
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
└── README.md`,
              },
            },
            {
              title: 'Healthcheck & Port Dinamis',
              tag: 'Konfigurasi Server',
              description:
                'Menyediakan rute pemeriksaan koneksi database serta mendengarkan host 0.0.0.0.',
              code: {
                title: 'Dynamic PORT & Healthcheck',
                language: 'javascript',
                filename: 'backend/src/server.js',
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
});`,
              },
            },
          ],
        },
      },
      {
        slideNumber: 6,
        isSummary: false,
        layoutType: 'comparison',
        badge: 'Good vs Bad Practice',
        title: 'Repositori Berantakan vs Repositori Siap Dinilai',
        subtitle:
          'Kerapian riwayat Git dan dokumentasi menyumbang sepuluh persen dari nilai evaluasi.',
        contentJson: {
          eyebrow: 'STANDAR PENINJAUAN KODE',
          highlights: [
            'Buat commit bertahap dengan pesan deskriptif sesuai perubahan fitur yang dikerjakan',
          ],
          comparison: {
            badTitle: '✕ Repositori Bermasalah (Bad Practice)',
            badPoints: [
              'File .env ikut terunggah ke GitHub sehingga kredensial database terbuka',
              'Tidak menyertakan file .sql sehingga struktur tabel sulit direplikasi',
              'Riwayat commit hanya berisi pesan singkat yang tidak menjelaskan perubahan',
            ],
            badCode: {
              title: 'Riwayat commit tidak deskriptif dan tanpa struktur',
              language: 'bash',
              filename: 'bad-git-log.txt',
              snippet: `# Contoh pesan commit yang menyulitkan penelusuran bug
git add .
git commit -m "upload semua file"
git commit -m "perbaikan error"
git commit -m "versi final revisi"`,
            },
            goodTitle: '✓ Standar Siap Review (Good Practice)',
            goodPoints: [
              'File .gitignore melindungi node_modules serta .env dan dilengkapi .env.example',
              'Tersedia file database/taskflow.sql yang siap diimpor melalui phpMyAdmin',
              'README.md memuat langkah instalasi, konfigurasi, dan tabel daftar endpoint',
            ],
            goodCode: {
              title: 'Riwayat commit terstruktur dan mudah ditelusuri',
              language: 'bash',
              filename: 'good-git-log.txt',
              snippet: `# Pesan commit jelas sesuai cakupan perubahan
git commit -m "feat(api): setup express server and health endpoint"
git commit -m "feat(db): add mysql2 pool and taskflow schema"
git commit -m "feat(tasks): implement CRUD routes with validation"
git commit -m "docs: add API specification and sql backup"`,
            },
          },
        },
      },
      {
        slideNumber: 7,
        isSummary: false,
        layoutType: 'practice',
        badge: '70% Praktik Hands-On',
        title: 'Audit Proyek, Ekspor .sql, & Dokumentasi Postman',
        subtitle:
          'Jalankan empat langkah pembersihan ini agar proyek siap didemonstrasikan pada Pertemuan 10.',
        contentJson: {
          eyebrow: 'RENCANA AKSI PROJECT CLINIC',
          highlights: [
            'Utamakan kestabilan aplikasi lokal, kelengkapan koleksi Postman, dan file cadangan .sql',
          ],
          practiceSteps: [
            {
              step: 1,
              title: 'Uji Ulang 5 Endpoint & Penanganan Error',
              description:
                'Tambahkan endpoint GET /api/health lalu verifikasi respons 200, 201, 400, dan 404 di Postman.',
            },
            {
              step: 2,
              title: 'Ekspor Database ke database/taskflow.sql',
              description:
                'Buka tab Export di phpMyAdmin dalam format SQL lalu simpan hasilnya ke folder database/.',
            },
            {
              step: 3,
              title: 'Ekspor Koleksi Postman & Lengkapi README.md',
              description:
                'Simpan file ekspor Collection v2.1 ke folder postman/ dan tulis panduan instalasi di README.md.',
            },
            {
              step: 4,
              title: 'Tinjau Kesiapan Konfigurasi Deployment',
              description:
                'Pastikan kode memakai process.env untuk seluruh konfigurasi dan lakukan simulasi demo lokal.',
            },
          ],
        },
      },
      {
        slideNumber: 8,
        isSummary: false,
        layoutType: 'quiz',
        badge: 'Kuis & Pustaka Referensi',
        title: 'Latihan Diagnosis Bug & Referensi Pengelolaan Proyek',
        subtitle:
          'Uji ketepatan membaca error umum backend serta langkah pengamanan kredensial.',
        contentJson: {
          eyebrow: 'KUIS DIAGNOSTIK & DOKUMENTASI',
          highlights: [
            'Siapkan pemahaman menyeluruh untuk menghadapi sesi tanya jawab pada Pertemuan 10',
          ],
          quizItems: [
            {
              question: 'Apa dua hal pertama yang harus diperiksa saat muncul error ECONNREFUSED di lokal?',
              hint: 'Periksa status modul di XAMPP dan konfigurasi port.',
              answer:
                'Pertama, pastikan layanan MySQL pada XAMPP Control Panel sudah dijalankan. Kedua, periksa kesesuaian nilai DB_HOST dan DB_PORT pada file .env dengan port aktif MySQL.',
            },
            {
              question: 'Mengapa file cadangan .sql wajib disertakan di dalam repositori proyek?',
              hint: 'Bayangkan ketika proyek harus dijalankan di perangkat lain.',
              answer:
                'File .sql memungkinkan struktur tabel beserta data awal diimpor dengan cepat di perangkat mentor maupun server lain. Cara ini mencegah perbedaan skema saat pengujian berlangsung.',
            },
            {
              question: 'Apa aturan keamanan utama saat mengunggah aplikasi Express dan MySQL ke layanan cloud?',
              hint: 'Perhatikan pengelolaan kata sandi dan batas kuota layanan.',
              answer:
                'Jangan pernah menyimpan kata sandi atau kredensial database di dalam kode sumber maupun repositori publik. Masukkan seluruh nilai rahasia melalui fitur Environment Variables pada dashboard penyedia layanan.',
            },
          ],
          references: [
            {
              title: 'Railway Documentation (Variables & Node.js Deploy)',
              url: 'https://docs.railway.com/',
              author: 'Railway',
              category: 'Deployment',
              lang: 'EN',
              type: 'Docs',
            },
            {
              title: 'Railway Pricing & Trial Credits Policy',
              url: 'https://railway.com/pricing',
              author: 'Railway',
              category: 'Deployment Policy',
              lang: 'EN',
              type: 'Docs',
            },
            {
              title: 'phpMyAdmin Documentation (Export & Import SQL)',
              url: 'https://docs.phpmyadmin.net/',
              author: 'phpMyAdmin',
              category: 'Database Tool',
              lang: 'EN',
              type: 'Docs',
            },
            {
              title: 'Belajar Git untuk Pemula',
              url: 'https://github.com/petanikode/belajar-git',
              author: 'Ahmad Muhardian (Petani Kode)',
              category: 'Git & Repository',
              lang: 'ID',
              type: 'Book',
            },
            {
              title: 'GIT & GITHUB (Playlist Video)',
              url: 'https://www.youtube.com/playlist?list=PLFIM0718LjIVknj6sgsSceMqlq242-jNf',
              author: 'Sandhika Galih (Web Programming UNPAS)',
              category: 'Git & GitHub',
              lang: 'ID',
              type: 'Course',
            },
          ],
          weeklyAssignment: {
            week: 9,
            title: 'Weekly Assignment 9: Perbaikan Proyek & Dokumentasi API',
            description:
              'Lakukan simulasi presentasi mandiri selama 5 menit mencakup pengujian Postman, interaksi antarmuka, dan verifikasi data di phpMyAdmin.',
          },
        },
      },
      {
        slideNumber: 9,
        isSummary: false,
        layoutType: 'task',
        badge: 'Deliverable & Learning Log',
        title: 'Pengumpulan Tugas Pertemuan 09 untuk ACC Mentor',
        subtitle:
          'Pastikan proyek telah bebas bug, dicadangkan dalam file .sql, dan terdokumentasi lengkap.',
        contentJson: {
          eyebrow: 'SYARAT MEMBUKA PERTEMUAN 10',
          highlights: [
            'Pertemuan 09 merupakan tahap verifikasi akhir sebelum sesi evaluasi Bulan 2',
            'Periksa riwayat Git untuk memastikan file .env tidak pernah ikut terunggah',
          ],
          deliverables: [
            'Aplikasi TaskFlow atau InternFlow dengan API berjalan stabil pada seluruh fitur CRUD',
            'File cadangan database/taskflow.sql dan koleksi postman/*.json tersedia di repositori',
            'README.md memuat langkah instalasi lokal, contoh .env, dan spesifikasi endpoint',
            'Learning Log mencatat daftar bug yang diperbaiki selama sesi Project Clinic',
          ],
          learningLogFields: [
            'Daftar bug yang ditemukan beserta langkah teknis perbaikannya',
            'Hasil audit keamanan untuk file .env, .gitignore, dan parameterized query',
            'Status kelengkapan cadangan .sql serta dokumentasi pengujian API',
            'Tautan repositori GitHub terbaru yang siap dievaluasi',
          ],
          competencyChecklist: [
            'Mampu mendiagnosis dan memperbaiki kegagalan koneksi MySQL maupun rute API',
            'Mampu menata struktur folder proyek dan menjaga kebersihan riwayat commit Git',
            'Mampu mengekspor cadangan database .sql serta koleksi pengujian Postman',
            'Memahami tata cara pengaturan variabel lingkungan untuk kebutuhan deployment',
          ],
          mentorTip:
            'Uji kloning repositori Anda ke folder baru dan ikuti langkah di README.md untuk memastikan panduan instalasi akurat.',
        },
      },
    ],
  },

  // =========================================================================
  // PERTEMUAN 11 || Presentasi API Postman, Alur Database & Evaluasi Bulan 2
  // =========================================================================
  {
    orderIndex: 11,
    month: 2,
    slug: 'pertemuan-11-presentasi-evaluasi-bulan-2',
    code: 'P11',
    sessionType: 'Presentasi',
    title: 'Presentasi API Postman, Alur Database & Evaluasi Bulan 2',
    subtitle:
      'Mendemonstrasikan endpoint CRUD di Postman, integrasi antarmuka ke MySQL, alur kode backend, serta sepuluh soal evaluasi.',
    summaryText:
      'Peserta mempresentasikan proyek akhir Bulan 2 secara langsung, menjelaskan alur request hingga SQL, dan menuntaskan evaluasi konsep.',
    taskPrompt:
      'Demonstrasikan aplikasi TaskFlow atau InternFlow dengan API melalui Postman, browser, dan phpMyAdmin, jelaskan alur kode beserta SQL, lalu jawab 10 soal evaluasi Bulan 2.',
    taskDeliverables: [
      'Demonstrasi langsung atau rekaman pengujian 5 endpoint di Postman dan antarmuka terintegrasi MySQL',
      'Penjelasan alur HTTP request menuju query SQL berparameter pada kode sumber proyek',
      'Repositori GitHub final Bulan 2 dengan struktur rapi dan dokumentasi README.md lengkap',
      'Jawaban tertulis untuk 10 pertanyaan evaluasi Bulan 2 pada Learning Log',
    ],
    accentGradient: 'from-rose-500 to-pink-500',
    iconName: 'ChartBar',
    slides: [
      {
        slideNumber: 1,
        isSummary: true,
        layoutType: 'cover',
        badge: 'Bulan 2 • Pertemuan 10 • Presentasi & Evaluasi',
        title: 'Presentasi API Postman, Alur Database & Evaluasi Bulan 2',
        subtitle:
          'Membuktikan penguasaan arsitektur backend, REST API, dan MySQL sebelum memasuki materi Bulan 3.',
        contentJson: {
          eyebrow: 'DIGITEK BOOTCAMP || EVALUASI BULAN 2',
          highlights: [
            'Demonstrasi 5 endpoint CRUD melalui Postman dan halaman antarmuka web',
            'Penjelasan alur HTTP request dari browser menuju Express hingga MySQL',
            'Tinjauan metode HTTP, status code, query SQL, dan riwayat commit GitHub',
            'Evaluasi pemahaman melalui 10 pertanyaan inti backend dan database',
          ],
          stats: [
            { label: 'Proyek Berjalan', value: '40%' },
            { label: 'Kuis Konsep', value: '30%' },
            { label: 'Presentasi Kode', value: '20%' },
            { label: 'Git & Kerapian Repo', value: '10%' },
          ],
          mentorTip:
            'Fokuskan presentasi pada alasan teknis di balik kode yang Anda tulis, bukan sekadar membacakan baris program.',
        },
      },
      {
        slideNumber: 2,
        isSummary: true,
        layoutType: 'summary',
        badge: 'Ringkasan Evaluasi',
        title: 'Komponen Penilaian & Jembatan Menuju Bulan 3',
        subtitle:
          'Evaluasi mengukur kemampuan membangun fitur, memahami alur kode, dan menjelaskan arsitektur sistem.',
        contentJson: {
          eyebrow: 'RINGKASAN EKSEKUTIF || RUBRIK KELULUSAN',
          highlights: [
            'Komposisi nilai: 40% proyek, 30% kuis, 20% presentasi, dan 10% Git',
            'Batas lulus minimal skor 70 dengan target optimal 80 hingga 100',
            'Penguasaan REST API dan SQL menjadi pondasi materi Nuxt Bulan 3',
          ],
          stats: [
            { label: 'Standar Lulus', value: 'Minimal 70 (Cukup)' },
            { label: 'Target Optimal', value: '80 – 100 (Baik)' },
            { label: 'Tahap Berikutnya', value: 'Bulan 3: Vue 3, TS & Nuxt' },
          ],
        },
      },
      {
        slideNumber: 3,
        isSummary: true,
        layoutType: 'bento',
        badge: 'Peta Konsep & Agenda',
        title: 'Susunan Sesi Presentasi & Evaluasi Bulan 2',
        subtitle:
          'Empat tahapan evaluasi selama lima belas menit untuk setiap peserta secara bergiliran.',
        contentJson: {
          eyebrow: 'AGENDA PRESENTASI & EVALUASI',
          highlights: [
            'Sesi per peserta mencakup demo Postman, antarmuka, bedah SQL, dan kuis',
          ],
          bentoCards: [
            {
              title: '1. Demo Postman (5 Endpoint)',
              tag: 'Tahap 1',
              description:
                'Menjalankan pengujian GET, POST (201 dan 400), PUT, serta DELETE secara langsung.',
            },
            {
              title: '2. Demo Antarmuka & phpMyAdmin',
              tag: 'Tahap 2',
              description:
                'Mengubah data melalui browser, memuat ulang halaman, dan memverifikasi tabel di phpMyAdmin.',
            },
            {
              title: '3. Bedah Kode & Riwayat Git',
              tag: 'Presentasi (20%)',
              description:
                'Menjelaskan alur rute Express, koneksi database, query SQL, serta catatan commit GitHub.',
            },
            {
              title: '4. Kuis 10 Soal & Modifikasi Kecil',
              tag: 'Evaluasi (30%)',
              description:
                'Menjawab 10 soal konsep inti dan menyelesaikan penyesuaian kode sederhana dari mentor.',
            },
          ],
        },
      },
      {
        slideNumber: 4,
        isSummary: false,
        layoutType: 'bento',
        badge: 'Alur Arsitektur Lengkap',
        title: 'Menjelaskan Siklus Request dari Browser hingga MySQL',
        subtitle:
          'Gunakan kerangka empat langkah ini saat memaparkan cara kerja aplikasi kepada mentor.',
        contentJson: {
          eyebrow: 'SIKLUS HIDUP PERMINTAAN DATA',
          highlights: [
            'Uraikan perjalanan satu aksi simpan data dari browser hingga ke MySQL',
          ],
          bentoCards: [
            {
              title: 'Langkah 1: Pemicu di Frontend',
              tag: 'Browser / UI',
              description:
                'Event submit formulir memanggil fetch() POST dengan header JSON dan data terformat.',
            },
            {
              title: 'Langkah 2: Validasi di Express',
              tag: 'Backend Server',
              description:
                'Middleware CORS dan express.json() memproses permintaan lalu router memvalidasi kelengkapan input.',
            },
            {
              title: 'Langkah 3: Eksekusi SQL Berparameter',
              tag: 'Database Layer',
              description:
                'Connection pool mysql2 mengirim perintah INSERT berparameter tanda tanya ke server MySQL.',
            },
            {
              title: 'Langkah 4: Respons JSON & Update DOM',
              tag: 'Umpan Balik',
              description:
                'Server membalas status 201 beserta data baru lalu antarmuka memperbarui tampilan daftar.',
            },
          ],
        },
      },
      {
        slideNumber: 5,
        isSummary: false,
        layoutType: 'bento',
        badge: 'Bedah Kode Presentasi',
        title: 'Bagian Kode Inti yang Wajib Dikuasai Saat Tanya Jawab',
        subtitle:
          'Kenali fungsi setiap baris pada modul koneksi database dan file rute utama Anda.',
        contentJson: {
          eyebrow: 'PERSIAPAN PENJELASAN KODE',
          highlights: [
            'Kuasai peran server.js, config/db.js, routes/tasks.js, dan skrip frontend/app.js',
          ],
          bentoCards: [
            {
              title: 'Konfigurasi Pool & Variabel .env',
              tag: 'Keamanan',
              description:
                'Menjelaskan alasan pemisahan kredensial di .env serta efisiensi penggunaan createPool.',
              code: {
                title: 'Koneksi Pool Aman',
                language: 'javascript',
                filename: 'backend/src/config/db.js',
                snippet: `import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10,
});`,
              },
            },
            {
              title: 'Query JOIN & Parameter Tanda Tanya',
              tag: 'Query Inti',
              description:
                'Menjelaskan penggabungan tabel melalui LEFT JOIN dan penyaringan aman pada klausa WHERE.',
              code: {
                title: 'Query Baca Data + Filter Parameter',
                language: 'sql',
                filename: 'query-summary.sql',
                snippet: `SELECT t.id, t.title, t.is_done, c.name AS category_name
FROM tasks t
LEFT JOIN categories c ON t.category_id = c.id
WHERE t.is_done = ?
ORDER BY t.id DESC
LIMIT 20;`,
              },
            },
          ],
        },
      },
      {
        slideNumber: 6,
        isSummary: false,
        layoutType: 'comparison',
        badge: 'Good vs Bad Presentation',
        title: 'Presentasi Hafalan vs Presentasi Berbasis Pemahaman',
        subtitle:
          'Kode yang disalin tanpa memahami cara kerjanya tidak dihitung sebagai pencapaian kompetensi.',
        contentJson: {
          eyebrow: 'STANDAR EVALUASI KOMPETENSI',
          highlights: [
            'Pemahaman arsitektur memudahkan peserta menyelesaikan modifikasi kode langsung dari mentor',
          ],
          comparison: {
            badTitle: '✕ Indikasi Kurang Menguasai (Hindari)',
            badPoints: [
              'Membaca baris kode tanpa memahami dampak apabila bagian tersebut diubah',
              'Gagal membedakan fungsi metode POST, PUT, dan kode status 201',
              'Bingung menelusuri penyebab respons 400 atau 404 saat diuji Postman',
            ],
            goodTitle: '✓ Indikasi Siap Lulus (Target)',
            goodPoints: [
              'Menguraikan alur data secara runtut dari antarmuka hingga tabel MySQL',
              'Dapat menunjukkan peran parameterized query dalam mencegah celah SQL Injection',
              'Mendemonstrasikan skenario sukses maupun validasi gagal di Postman secara terstruktur',
            ],
          },
        },
      },
      {
        slideNumber: 7,
        isSummary: false,
        layoutType: 'practice',
        badge: '70% Demo & Verifikasi',
        title: 'Urutan Demonstrasi Wajib Saat Evaluasi Bulan 2',
        subtitle:
          'Siapkan seluruh aplikasi pendukung sebelum giliran presentasi dimulai agar waktu berjalan efektif.',
        contentJson: {
          eyebrow: 'PANDUAN JALANNYA PRESENTASI',
          highlights: [
            'Siapkan XAMPP, Express, Postman, tab Network browser, dan GitHub sebelum maju',
          ],
          practiceSteps: [
            {
              step: 1,
              title: 'Demonstrasi 5 Endpoint di Postman',
              description:
                'Tunjukkan respons GET (200), POST valid (201), POST kosong (400), PUT (200), dan DELETE hingga 404.',
            },
            {
              step: 2,
              title: 'Demonstrasi Integrasi Antarmuka & Database',
              description:
                'Tambah serta ubah tugas dari browser, perlihatkan request di tab Network, dan cek barisnya di phpMyAdmin.',
            },
            {
              step: 3,
              title: 'Penjelasan Kode Backend & Query SQL',
              description:
                'Paparkan isi config/db.js, routes/tasks.js, relasi kunci tabel, serta penggunaan parameter tanda tanya.',
            },
            {
              step: 4,
              title: 'Tinjauan Repositori GitHub & Modifikasi Langsung',
              description:
                'Perlihatkan riwayat commit, file taskflow.sql, README.md, lalu kerjakan penyesuaian singkat dari mentor.',
            },
          ],
        },
      },
      {
        slideNumber: 8,
        isSummary: false,
        layoutType: 'quiz',
        badge: 'Evaluasi Resmi 10 Soal',
        title: '10 Pertanyaan Evaluasi Bulan 2 & Pustaka Pengayaan',
        subtitle:
          'Sepuluh pertanyaan resmi silabus Bulan 2 untuk menguji kesiapan menuju materi Bulan 3.',
        contentJson: {
          eyebrow: 'EVALUASI RESMI BULAN 2 (10 PERTANYAAN)',
          highlights: [
            'Rumuskan jawaban secara mandiri sebelum mencocokkannya dengan kunci konsep berikut',
          ],
          quizItems: [
            {
              question: '1. Apa fungsi utama Node.js dalam pengembangan web?',
              hint: 'Ingat peran runtime JavaScript di luar browser.',
              answer:
                'Node.js adalah runtime environment yang menjalankan kode JavaScript di sisi server. Teknologi ini digunakan untuk membangun layanan backend, REST API, dan koneksi ke database.',
            },
            {
              question: '2. Apa perbedaan tanggung jawab antara frontend dan backend?',
              hint: 'Bandingkan interaksi layar pengguna dengan pengolahan data di server.',
              answer:
                'Frontend berjalan di browser untuk menampilkan antarmuka dan menangkap interaksi pengguna. Backend berjalan di server untuk memproses logika bisnis, memvalidasi input, dan mengelola database.',
            },
            {
              question: '3. Apa yang dimaksud dengan REST API?',
              hint: 'Kaitkan dengan protokol HTTP, URL resource, dan format JSON.',
              answer:
                'REST API adalah antarmuka komunikasi standar berbasis HTTP antara client dan server. Pertukaran datanya menggunakan URL endpoint, metode HTTP spesifik, serta format payload JSON.',
            },
            {
              question: '4. Apa perbedaan penggunaan metode HTTP GET dan POST?',
              hint: 'Bedakan pembacaan data dengan pengiriman data baru.',
              answer:
                'Metode GET digunakan untuk mengambil data dari server tanpa mengubah isi database. Metode POST digunakan untuk mengirim payload di dalam request body guna membuat data baru.',
            },
            {
              question: '5. Apa fungsi kode status HTTP pada respons API?',
              hint: 'Ingat arti kode 200, 201, 400, 401, 404, dan 500.',
              answer:
                'Kode status HTTP memberi tahu client hasil pemrosesan suatu request secara terstandar. Contohnya 200 atau 201 menandakan berhasil, 400 input keliru, 404 data tidak ditemukan, dan 500 gangguan server.',
            },
            {
              question: '6. Apa perbedaan antara database dan tabel?',
              hint: 'Bandingkan wadah penyimpanan aplikasi dengan struktur baris dan kolom.',
              answer:
                'Database adalah wadah utama yang menampung seluruh koleksi data milik suatu aplikasi. Tabel adalah struktur terorganisasi berisi kolom dan baris untuk menyimpan satu entitas spesifik.',
            },
            {
              question: '7. Apa fungsi primary key dan foreign key pada database relasional?',
              hint: 'Bedakan penanda identitas unik dengan kolom penghubung relasi.',
              answer:
                'Primary key memberi penanda unik pada setiap baris agar tidak terjadi duplikasi identitas. Foreign key merujuk ke primary key di tabel lain untuk membentuk relasi dan menjaga integritas data.',
            },
            {
              question: '8. Apa perbedaan perintah SQL SELECT, INSERT, UPDATE, dan DELETE?',
              hint: 'Petakan keempat perintah tersebut ke dalam siklus CRUD.',
              answer:
                'SELECT berfungsi membaca data, sedangkan INSERT berfungsi menambahkan baris baru ke tabel. UPDATE mengubah nilai baris tertentu dengan klausa WHERE, dan DELETE menghapus baris dari tabel.',
            },
            {
              question: '9. Mengapa eksekusi query database wajib menggunakan parameter?',
              hint: 'Pertimbangkan risiko keamanan dari input pengguna.',
              answer:
                'Penggunaan parameter tanda tanya memisahkan struktur perintah SQL dari nilai input pengguna. Mekanisme ini mensterilkan karakter berbahaya secara otomatis sehingga mencegah serangan SQL Injection.',
            },
            {
              question: '10. Bagaimana cara frontend mengambil dan mengirim data ke backend?',
              hint: 'Sebutkan fungsi HTTP client bawaan browser modern.',
              answer:
                'Frontend mengirim permintaan HTTP secara asinkron menggunakan fungsi fetch() dengan async dan await. Setelah melewati izin CORS dan menerima JSON, frontend memperbarui elemen DOM di layar.',
            },
          ],
          references: [
            {
              title: 'Tutorial NodeJS Dasar - Bahasa Indonesia',
              url: 'https://www.youtube.com/watch?v=b39Xqf5iyjo',
              author: 'Eko Kurniawan Khannedy (Programmer Zaman Now)',
              category: 'Node.js Review',
              lang: 'ID',
              type: 'Course',
            },
            {
              title: 'Tutorial Node.js untuk Pemula',
              url: 'https://mfikri.com/artikel/tutorial-nodejs',
              author: 'Mfikri',
              category: 'Node.js & REST API',
              lang: 'ID',
              type: 'Book',
            },
            {
              title: 'Tutorial MySQL untuk Pemula Hingga Mahir (PDF)',
              url: 'https://umardanny.com/tutorial-mysql-untuk-pemula-hingga-mahir-ebook-download-pdf/',
              author: 'Umar Danny',
              category: 'MySQL Review',
              lang: 'ID',
              type: 'Book',
            },
            {
              title: 'Belajar Dengan Jenius Amazon Web Service & Node.js (PDF)',
              url: 'https://github.com/gungunfebrianza/Belajar-Dengan-Jenius-Node.js/releases/download/1.2/Belajar.Dengan.Jenius.Javascript.Node.pdf',
              author: 'Gun Gun Febrianza',
              category: 'Node.js Lanjut',
              lang: 'ID',
              type: 'Book',
            },
            {
              title: 'Node.js Official Learn Portal',
              url: 'https://nodejs.org/en/learn',
              author: 'OpenJS Foundation',
              category: 'Node.js Docs',
              lang: 'EN',
              type: 'Docs',
            },
          ],
          weeklyAssignment: {
            week: 10,
            title: 'Weekly Assignment 10: Evaluasi Akhir Backend & Persiapan Bulan 3',
            description:
              'Tindak lanjuti catatan evaluasi mentor pada repositori Anda lalu pelajari pengenalan Vite dan Vue 3 untuk persiapan Pertemuan 11.',
          },
        },
      },
      {
        slideNumber: 9,
        isSummary: false,
        layoutType: 'task',
        badge: 'Deliverable & Learning Log',
        title: 'Pengumpulan Evaluasi Final Bulan 2 untuk ACC Mentor',
        subtitle:
          'Persetujuan pada tahap ini menandai kelulusan Bulan 2 dan membuka akses materi Bulan 3.',
        contentJson: {
          eyebrow: 'SYARAT KELULUSAN BULAN 2 & AKSES BULAN 3',
          highlights: [
            'Lampirkan repositori final, bukti demonstrasi, dan jawaban 10 soal evaluasi',
            'Pastikan seluruh catatan revisi saat sesi presentasi telah dituntaskan dengan rapi',
          ],
          deliverables: [
            'Repositori GitHub final Bulan 2 memuat backend, frontend, cadangan .sql, koleksi Postman, dan README.md',
            'Bukti demonstrasi pengujian Postman serta integrasi antarmuka dengan database MySQL',
            'Riwayat commit Git bersih tanpa kebocoran file .env maupun folder node_modules',
            'Learning Log lengkap berisi refleksi Bulan 2 dan rangkuman jawaban 10 soal evaluasi',
          ],
          learningLogFields: [
            'Rangkuman pemahaman atas 10 konsep inti backend, REST API, dan database MySQL',
            'Catatan umpan balik mentor saat sesi demonstrasi beserta tindak lanjutnya',
            'Kompetensi yang sudah dikuasai dengan kuat dan bagian yang perlu diperdalam',
            'Tautan repositori GitHub final Bulan 2 serta dokumentasi pengujian Postman',
          ],
          competencyChecklist: [
            'Mampu mendemonstrasikan kelima endpoint REST API CRUD menggunakan Postman',
            'Mampu menunjukkan integrasi penuh antara antarmuka web dan database MySQL',
            'Mampu menguraikan siklus HTTP request hingga eksekusi query SQL secara runtut',
            'Menjawab minimal tujuh dari sepuluh soal evaluasi konsep Bulan 2 dengan tepat',
          ],
          mentorTip:
            'Kuasai pemisahan peran frontend, REST API, dan SQL dari Bulan 2 sebagai bekal utama membangun aplikasi fullstack Nuxt di Bulan 3.',
        },
      },
    ],
  },
];
