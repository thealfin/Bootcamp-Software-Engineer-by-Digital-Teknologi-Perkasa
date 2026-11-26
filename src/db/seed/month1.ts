import type { SeedModuleInput } from '../../types/bootcamp';

const STANDARD_LEARNING_LOG_FIELDS = [
  'Tanggal',
  'Materi',
  'Hal baru yang dipahami',
  'Praktik yang dikerjakan',
  'Kendala yang ditemukan',
  'Cara mengatasi',
  'Hal yang masih belum dipahami',
  'Link repository / commit',
];

export const MONTH_1_MODULES: SeedModuleInput[] = [
  // ============================================================================
  // P00 || PANDUAN KURIKULUM & EVALUASI
  // ============================================================================
  {
    orderIndex: 0,
    month: 0,
    slug: 'panduan-kurikulum-evaluasi',
    code: 'P00',
    sessionType: 'Panduan Program',
    title: 'Panduan Program, Dual-Track Project & Rubrik Evaluasi',
    subtitle:
      'Peta belajar tiga bulan magang rekayasa perangkat lunak dari dasar web hingga aplikasi fullstack.',
    summaryText:
      'Pelajari porsi 30% konsep dan 70% praktik, evolusi proyek, rubrik nilai, serta aturan Learning Log.',
    taskPrompt:
      'Pelajari panduan kurikulum, aktifkan akun GitHub, dan pahami alur persetujuan bertahap sebelum memulai Pertemuan 01.',
    taskDeliverables: [
      'Memahami struktur 15 pertemuan selama 3 bulan.',
      'Memahami evolusi proyek TaskFlow dan InternFlow.',
      'Menyiapkan templat Learning Log untuk setiap akhir pertemuan.',
    ],
    accentGradient: 'from-slate-900 to-slate-700',
    iconName: 'Compass',
    slides: [
      {
        slideNumber: 1,
        isSummary: true,
        layoutType: 'cover',
        badge: 'Panduan Resmi',
        title: 'Software Engineering Internship || Roadmap 3 Bulan',
        subtitle:
          'Program pembinaan magang PT Digital Teknologi Perkasa berbasis konsep terukur dan praktik nyata.',
        contentJson: {
          eyebrow: 'PT Digital Teknologi Perkasa • Lead Mentor: Alfin Almustajab',
          highlights: [
            'Program mencakup 15 pertemuan formal berdurasi 2–3 jam per sesi.',
            'Setiap sesi terdiri atas 30% konsep dasar dan 70% praktik.',
            'Lima belas tugas mingguan menjaga ritme latihan mandiri peserta.',
            'Target akhir berupa aplikasi web fullstack siap pakai dan terpublikasi.',
          ],
          stats: [
            { label: 'Durasi Program', value: '3 Bulan (12 Minggu)' },
            { label: 'Komposisi Sesi', value: '30% Konsep : 70% Praktik' },
            { label: 'Total Pertemuan', value: '15 Pertemuan Formal' },
            { label: 'Target Output', value: 'Fullstack Web App' },
          ],
        },
      },
      {
        slideNumber: 2,
        isSummary: true,
        layoutType: 'summary',
        badge: 'Dual-Track Project',
        title: 'Satu Produk Berevolusi: TaskFlow & InternFlow',
        subtitle:
          'Kembangkan satu produk secara bertahap dari peramban lokal menuju arsitektur fullstack modern.',
        contentJson: {
          eyebrow: 'Arsitektur Bertahap Bulan 1 Hingga Bulan 3',
          highlights: [
            'Kebutuhan produk tetap sama, sedangkan arsitektur teknis meningkat setiap bulan.',
            'TaskFlow melatih pembuatan aplikasi manajemen tugas dari DOM hingga Nuxt.',
            'InternFlow melatih pembuatan portal profil responsif hingga terhubung basis data.',
          ],
          bentoCards: [
            {
              title: 'Bulan 1 || Foundation',
              tag: 'Pertemuan 01–05',
              description:
                'Membangun antarmuka TaskFlow dan InternFlow langsung di dalam peramban.',
              bullets: [
                'HTML5 semantik dan tata letak CSS3',
                'JavaScript murni, DOM, dan event listener',
                'Penyimpanan localStorage serta dasar Git',
              ],
            },
            {
              title: 'Bulan 2 || Backend & Database',
              tag: 'Pertemuan 06–10',
              description:
                'Menghubungkan antarmuka ke REST API Express dan basis data relasional MySQL.',
              bullets: [
                'Node.js, npm, dan REST API Express',
                'Basis data MySQL dan relasi tabel',
                'Integrasi fetch API dan uji Postman',
              ],
            },
            {
              title: 'Bulan 3 || Modern Fullstack',
              tag: 'Pertemuan 11–15',
              description:
                'Menulis ulang aplikasi dengan Vue 3, TypeScript, Nuxt, hingga rilis daring.',
              bullets: [
                'Vite, komponen Vue 3, dan TypeScript',
                'Fullstack Nuxt Nitro dengan MySQL',
                'Rilis ke Railway dan presentasi akhir',
              ],
            },
          ],
        },
      },
      {
        slideNumber: 3,
        isSummary: true,
        layoutType: 'bento',
        badge: 'Rubrik Evaluasi',
        title: 'Bobot Penilaian & Prinsip Evaluasi Bulanan',
        subtitle:
          'Penilaian mengukur fungsi aplikasi sekaligus pemahaman peserta atas setiap baris kode.',
        contentJson: {
          eyebrow: 'Komposisi Penilaian 100% Akhir Bulan',
          highlights: [
            'Pahami konsep, bangun fitur, kuasai kode, dan jelaskan alur kerjanya.',
            'Mentor menguji pemahaman melalui modifikasi kode langsung saat sesi presentasi.',
            'Salin tempel kode tanpa pemahaman konsep dinyatakan belum lulus evaluasi.',
          ],
          stats: [
            { label: 'Proyek Berjalan', value: '40%' },
            { label: 'Kuis Konsep', value: '30%' },
            { label: 'Penjelasan Kode', value: '20%' },
            { label: 'Kerapian Git', value: '10%' },
          ],
          bentoCards: [
            {
              title: '40% || Proyek Sesuai Target',
              description:
                'Seluruh fitur wajib berjalan lancar tanpa galat di konsol peramban.',
            },
            {
              title: '30% || Kuis Konsep Dasar',
              description:
                'Peserta menguasai istilah teknis dan logika dasar pada bulan berjalan.',
            },
            {
              title: '20% || Presentasi & Bedah Kode',
              description:
                'Peserta menjelaskan alur data dan menyelesaikan ubahan kode secara langsung.',
            },
            {
              title: '10% || Git & Kerapian Repositori',
              description:
                'Riwayat commit tercatat rapi, struktur berkas bersih, dan README tersedia.',
            },
          ],
        },
      },
      {
        slideNumber: 4,
        isSummary: false,
        layoutType: 'bento',
        badge: 'Skala Nilai & Learning Log',
        title: 'Skala Nilai Resmi & Format Learning Log',
        subtitle:
          'Tulis refleksi belajar pada Learning Log sebagai syarat pengajuan persetujuan mentor.',
        contentJson: {
          eyebrow: 'Standar Evaluasi & Dokumentasi Teknis',
          highlights: [
            'Nilai di bawah 70 memerlukan perbaikan terarah pada sesi klinik proyek.',
            'Learning Log melatih komunikasi tertulis mengenai kendala dan solusi teknis.',
          ],
          bentoCards: [
            {
              title: 'Kategori Lulus (70–100)',
              tag: 'Standar Kompeten',
              description:
                'Rentang nilai peserta yang memenuhi syarat lanjut ke tahap berikutnya.',
              bullets: [
                '90–100: Sangat baik dan mandiri',
                '80–89: Baik dengan sedikit arahan',
                '70–79: Cukup dan paham dasar',
              ],
            },
            {
              title: 'Kategori Perbaikan (< 70)',
              tag: 'Pendampingan',
              description:
                'Rentang nilai yang mewajibkan perbaikan fitur sebelum modul baru terbuka.',
              bullets: [
                '60–69: Perlu perbaikan fitur inti',
                '< 60: Wajib remedial materi dasar',
              ],
            },
            {
              title: 'Format Wajib Learning Log',
              tag: 'Templat Catatan',
              description:
                'Salin dan lengkapi delapan butir catatan ini saat mengumpulkan tugas.',
              code: {
                title: 'Templat Learning Log',
                language: 'text',
                filename: 'learning-log.txt',
                snippet: `Tanggal: 2026-xx-xx
Materi: Pertemuan 01 - Kickoff & Setup Git
Hal baru yang dipahami: ...
Praktik yang dikerjakan: ...
Kendala yang ditemukan: ...
Cara mengatasi: ...
Hal yang masih belum dipahami: ...
Link repository / commit: https://github.com/username/repo`,
              },
            },
          ],
        },
      },
      {
        slideNumber: 5,
        isSummary: false,
        layoutType: 'task',
        badge: 'Aturan Main & Etika Git',
        title: 'Aturan Pembukaan Modul Bertahap & Disiplin Git',
        subtitle:
          'Modul terbuka berurutan setelah tugas sebelumnya di-ACC mentor agar fondasi kuat.',
        contentJson: {
          eyebrow: 'Komitmen Peserta',
          highlights: [
            'Pertemuan berikutnya terbuka otomatis sesudah tugas saat ini di-ACC mentor.',
            'Jika berstatus revisi, perbaiki kode sesuai catatan lalu kirim ulang commit.',
            'Rekam progres lewat commit kecil per fitur, bukan satu tumpukan akhir.',
          ],
          comparison: {
            badTitle: '✕ Kebiasaan Penghambat Belajar',
            badPoints: [
              'Menyalin kode AI mentah tanpa memahami alur logika program.',
              'Menyimpan berkas proyek memakai arsip manual tanpa riwayat Git.',
              'Menulis pesan commit kabur seperti update atau perbaikan biasa.',
            ],
            goodTitle: '✓ Standar Intern PT Digital Teknologi Perkasa',
            goodPoints: [
              'Memahami konsep dasar, mengetik kode mandiri, lalu menguji hasilnya.',
              'Melakukan commit bertahap setiap kali satu fitur selesai diuji.',
              'Menulis pesan commit spesifik serta mencatat kendala di Learning Log.',
            ],
          },
          deliverables: [
            'Mendaftar akun peserta dengan nama, surel, dan asal sekolah yang valid.',
            'Memahami mekanisme pembukaan modul berurutan melalui persetujuan mentor.',
            'Menyiapkan catatan Learning Log untuk diisi jujur sejak Pertemuan 01.',
          ],
          learningLogFields: STANDARD_LEARNING_LOG_FIELDS,
          mentorTip:
            'Pesan galat di terminal dan konsol adalah petunjuk kerja harian, jadi biasakan membaca baris pesannya dan mencatat solusinya.',
        },
      },
    ],
  },

  // ============================================================================
  // P01 || KICKOFF, CARA KERJA WEB & SETUP GIT/GITHUB
  // ============================================================================
  {
    orderIndex: 1,
    month: 1,
    slug: 'pertemuan-01-kickoff-web-overview',
    code: 'P01',
    sessionType: 'Kickoff',
    title: 'Kickoff, Cara Kerja Web & Setup Git/GitHub',
    subtitle:
      'Pahami komunikasi klien-server melalui HTTP, siapkan perkakas kerja, dan unggah repositori GitHub pertama.',
    summaryText:
      'Pelajari alur permintaan HTTP, peran tiga lapisan web, instalasi perkakas, serta alur dasar Git.',
    taskPrompt:
      'Pasang perkakas kerja, buat repositori GitHub berisi index.html profil awal, lalu kirim tautan beserta Learning Log.',
    taskDeliverables: [
      'VS Code, Git, Node.js, dan XAMPP terpasang serta terverifikasi di terminal.',
      'Repositori publik pertama telah dibuat di akun GitHub masing-masing.',
      'Berkas index.html dan README.md berhasil di-commit serta di-push.',
    ],
    accentGradient: 'from-orange-500 to-amber-500',
    iconName: 'RocketLaunch',
    slides: [
      {
        slideNumber: 1,
        isSummary: true,
        layoutType: 'cover',
        badge: 'Bulan 1 • Pertemuan 01',
        title: 'Kickoff, Cara Kerja Web & Setup Git/GitHub',
        subtitle:
          'Pahami cara kerja internet di balik layar dan siapkan lingkungan kerja standar industri.',
        contentJson: {
          eyebrow: 'Sesi Kickoff • 30% Konsep / 70% Praktik',
          highlights: [
            'Mengenal alur kerja rekayasa perangkat lunak dari analisis hingga rilis.',
            'Memahami komunikasi klien, server, DNS, domain, dan protokol HTTP.',
            'Membedakan tanggung jawab frontend, backend, dan basis data aplikasi.',
            'Menyiapkan ruang kerja lokal lalu mengunggah kode perdana ke GitHub.',
          ],
          stats: [
            { label: 'Jenis Sesi', value: 'Kickoff' },
            { label: 'Durasi', value: '2–3 Jam' },
            { label: 'Target Output', value: 'Repo GitHub #1' },
            { label: 'Tugas Mingguan', value: 'Minggu 1' },
          ],
        },
      },
      {
        slideNumber: 2,
        isSummary: true,
        layoutType: 'summary',
        badge: 'Executive Summary',
        title: 'Mengapa Arsitektur Web & Git Wajib Dikuasai Sejak Awal?',
        subtitle:
          'Pahami lokasi eksekusi kode dan cara mengamankan versi berkas sebelum menulis fitur.',
        contentJson: {
          eyebrow: 'Fondasi Kerja Pengembang Web',
          highlights: [
            'Model klien-server memperjelas batas kode di peramban dan di server.',
            'Git dan GitHub menjaga riwayat perubahan sekaligus menjadi portofolio peninjauan.',
            'Instalasi perkakas hari pertama mencegah hambatan teknis pada pertemuan berikutnya.',
          ],
          bentoCards: [
            {
              title: 'Rumah Proyek InternFlow',
              tag: 'Workspace',
              description:
                'Repositori yang dibuat hari ini menjadi fondasi pengembangan halaman profil InternFlow.',
            },
            {
              title: 'Target Keluaran Sesi',
              tag: 'Deliverable',
              description:
                'Seluruh perkakas terverifikasi di terminal dan halaman HTML perdana tampil di GitHub.',
            },
          ],
        },
      },
      {
        slideNumber: 3,
        isSummary: true,
        layoutType: 'bento',
        badge: 'Peta Konsep & Agenda',
        title: 'Agenda Sesi: 30% Konsep Web & 70% Setup Perkakas',
        subtitle:
          'Alokasi waktu belajar terarah dari konsep jaringan hingga praktik terminal langsung.',
        contentJson: {
          eyebrow: 'Alur Kegiatan Pertemuan 01',
          highlights: [
            'Bagian awal (30%) membahas alur HTTP serta pembagian tiga lapisan web.',
            'Bagian inti (70%) mempraktikkan instalasi perkakas, konfigurasi Git, dan push kode.',
          ],
          bentoCards: [
            {
              title: '1. Cara Kerja Web',
              tag: '15 Menit',
              description:
                'Proses penerjemahan domain di DNS hingga halaman tampil di peramban.',
            },
            {
              title: '2. Tiga Pilar Aplikasi',
              tag: '15 Menit',
              description:
                'Pembagian peran antarmuka frontend, logika backend, dan penyimpanan basis data.',
            },
            {
              title: '3. Persiapan Perkakas',
              tag: '35 Menit',
              description:
                'Verifikasi instalasi VS Code, Git CLI, Node.js, dan modul XAMPP.',
            },
            {
              title: '4. Repositori Pertama',
              tag: '55 Menit',
              description:
                'Pembuatan index.html diikuti perintah git init, commit, dan push.',
            },
          ],
        },
      },
      {
        slideNumber: 4,
        isSummary: false,
        layoutType: 'bento',
        badge: 'Analogi & Konsep',
        title: 'Analogi Restoran: Klien, Server, HTTP & Tiga Lapisan',
        subtitle:
          'Komunikasi peramban dan server bekerja layaknya pemesanan menu di sebuah restoran.',
        contentJson: {
          eyebrow: 'Model Klien-Server',
          highlights: [
            'Peramban bertindak sebagai tamu yang mengirim pesanan melalui permintaan HTTP.',
            'Server memproses permintaan lalu mengembalikan respons berisi HTML atau JSON.',
            'Domain adalah nama lokasi mudah diingat yang mewakili alamat IP.',
          ],
          bentoCards: [
            {
              title: 'Frontend (Ruang Makan)',
              tag: 'Sisi Klien',
              description:
                'Bagian visual di dalam peramban yang dilihat dan dioperasikan langsung oleh pengguna.',
              bullets: [
                'HTML sebagai kerangka konten',
                'CSS sebagai penata tampilan',
                'JavaScript sebagai penggerak interaksi',
              ],
            },
            {
              title: 'Backend (Dapur Server)',
              tag: 'Sisi Server',
              description:
                'Layanan di server yang memvalidasi aturan bisnis, izin akses, dan pertukaran data.',
              bullets: [
                'Node.js dan kerangka Express',
                'Mesin server Nuxt Nitro',
                'Jalur komunikasi REST API',
              ],
            },
            {
              title: 'Database (Gudang Data)',
              tag: 'Penyimpanan',
              description:
                'Sistem penyimpan data pengguna dan tugas secara terstruktur serta permanen.',
              bullets: [
                'Basis data relasional MySQL',
                'PostgreSQL pada layanan awan',
                'Struktur tabel dan relasi kunci',
              ],
            },
          ],
        },
      },
      {
        slideNumber: 5,
        isSummary: false,
        layoutType: 'bento',
        badge: 'Bedah Teknis & Terminal',
        title: 'Perintah Dasar Terminal & Siklus Kerja Git',
        subtitle:
          'Kelola perubahan kode melewati folder kerja, area persiapan, hingga repositori daring.',
        contentJson: {
          eyebrow: 'Working Directory → Staging → Repository → GitHub',
          highlights: [
            'Jalankan git status kapan saja untuk memeriksa berkas yang berubah.',
            'Gunakan git add untuk memilih berkas dan git commit menguncinya.',
          ],
          codeBlocks: [
            {
              title: 'Verifikasi Perkakas & Identitas Git',
              language: 'bash',
              filename: 'terminal-check.sh',
              snippet: `node -v
npm -v
git --version
code --version

git config --global user.name "Nama Lengkap"
git config --global user.email "nama@email.com"`,
            },
            {
              title: 'Alur Inisialisasi Hingga Push ke GitHub',
              language: 'bash',
              filename: 'git-workflow.sh',
              snippet: `git init
git add .
git commit -m "feat: inisialisasi halaman profil awal"
git branch -M main
git remote add origin https://github.com/USERNAME/internflow-profil.git
git push -u origin main`,
            },
          ],
        },
      },
      {
        slideNumber: 6,
        isSummary: false,
        layoutType: 'comparison',
        badge: 'Bad vs Good Practice',
        title: 'Pengelolaan Berkas: Salinan Manual vs Alur Git',
        subtitle:
          'Bandingkan kebiasaan menggandakan folder manual dengan pengelolaan versi standar industri.',
        contentJson: {
          eyebrow: 'Disiplin Manajemen Kode',
          highlights: [
            'Git memungkinkan pemulihan kode ke versi sebelumnya tanpa menduplikasi folder proyek.',
          ],
          comparison: {
            badTitle: '✕ Cara Manual (Rawan Tertukar)',
            badPoints: [
              'Menggandakan folder bernama revisi_final dan revisi_terakhir di Desktop.',
              'Mengunggah berkas lewat fitur seret lepas di situs web GitHub.',
              'Menulis pesan commit singkat yang tidak menjelaskan isi perubahan.',
            ],
            badCode: {
              title: 'Struktur & Commit Tidak Teratur',
              language: 'text',
              filename: 'Desktop/tugas1/',
              snippet: `Desktop/
├── web_rev1.html
├── web_rev2_fix.html
└── index (1).html

git commit -m "upload tugas"`,
            },
            goodTitle: '✓ Standar Rekayasa Perangkat Lunak',
            goodPoints: [
              'Menyimpan seluruh proyek di dalam satu folder ruang kerja khusus.',
              'Menjalankan git add, commit, dan push langsung melalui terminal.',
              'Memakai awalan pesan commit yang jelas seperti feat atau fix.',
            ],
            goodCode: {
              title: 'Struktur & Commit Standar',
              language: 'text',
              filename: 'workspace/internflow-profil/',
              snippet: `digitek-bootcamp/
└── internflow-profil/
    ├── index.html
    └── README.md

git commit -m "feat: tambah halaman profil awal internflow"`,
            },
          },
        },
      },
      {
        slideNumber: 7,
        isSummary: false,
        layoutType: 'practice',
        badge: '70% Hands-On Praktik',
        title: 'Langkah Praktik: Setup Ruang Kerja & Push Pertama',
        subtitle:
          'Ikuti empat langkah berurutan ini untuk menuntaskan target praktik Pertemuan 01.',
        contentJson: {
          eyebrow: 'Lab Pertemuan 01 || InternFlow Profil Awal',
          highlights: [
            'Pastikan XAMPP sudah terpasang sebagai persiapan basis data Bulan 2.',
          ],
          practiceSteps: [
            {
              step: 1,
              title: 'Siapkan Folder Ruang Kerja Proyek',
              description:
                'Buat direktori khusus proyek magang lalu buka folder tersebut di VS Code.',
              command:
                'mkdir -p ~/digitek-bootcamp/internflow-profil && cd ~/digitek-bootcamp/internflow-profil && code .',
            },
            {
              step: 2,
              title: 'Tulis Berkas index.html & README.md',
              description:
                'Buat kerangka dasar HTML5 berisi nama, asal sekolah, dan target belajar tiga bulan.',
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
</html>`,
            },
            {
              step: 3,
              title: 'Rekam Commit Pertama di Lokal',
              description:
                'Inisialisasi Git di terminal VS Code lalu simpan versi perdana kode.',
              command:
                'git init && git add . && git commit -m "feat: buat halaman profil html perdana"',
            },
            {
              step: 4,
              title: 'Hubungkan Repositori Publik & Push ke GitHub',
              description:
                'Buat repositori kosong bernama internflow-profil di GitHub lalu unggah cabang utama.',
              command:
                'git branch -M main && git remote add origin https://github.com/USERNAME/internflow-profil.git && git push -u origin main',
            },
          ],
        },
      },
      {
        slideNumber: 8,
        isSummary: false,
        layoutType: 'quiz',
        badge: 'Kuis & Pustaka Belajar',
        title: 'Uji Pemahaman Pertemuan 01 & Referensi Belajar',
        subtitle:
          'Jawab tiga pertanyaan konsep berikut secara mandiri sebelum mencocokkan kunci jawaban.',
        contentJson: {
          eyebrow: 'Evaluasi Konsep & Referensi Terkurasi',
          highlights: [
            'Jelaskan jawaban menggunakan kalimat sendiri sebelum membuka kunci konsep.',
          ],
          quizItems: [
            {
              question:
                'Apa alur yang terjadi sejak pengguna mengetik alamat situs di peramban hingga halaman tampil?',
              hint: 'Urutkan peran DNS, HTTP Request, Server, dan HTTP Response.',
              answer:
                'Peramban mencari alamat IP server melalui DNS lalu mengirim HTTP Request. Server memproses permintaan dan membalas dengan HTTP Response berisi berkas web untuk di-render ke layar.',
            },
            {
              question:
                'Apa perbedaan tanggung jawab antara Frontend, Backend, dan Database?',
              hint: 'Pisahkan area tampilan pengguna, pemrosesan logika, dan penyimpanan data.',
              answer:
                'Frontend menyajikan antarmuka di peramban, sedangkan Backend memproses logika bisnis serta API di server. Database menyimpan data aplikasi secara terstruktur dan permanen.',
            },
            {
              question:
                'Mengapa kita menjalankan git add sebelum git commit, lalu mengakhirinya dengan git push?',
              hint: 'Perhatikan perpindahan berkas dari folder kerja ke GitHub.',
              answer:
                'Perintah git add memilih perubahan ke Staging Area, lalu git commit merekamnya ke riwayat lokal. Perintah git push mengunggah riwayat lokal tersebut ke repositori GitHub.',
            },
          ],
          references: [
            {
              title: 'Belajar Git untuk Pemula',
              url: 'https://github.com/petanikode/belajar-git',
              author: 'Ahmad Muhardian (Petani Kode)',
              category: 'Git & Version Control',
              lang: 'ID',
              type: 'Book',
            },
            {
              title: 'Pro Git 2nd Edition (Bahasa Indonesia)',
              url: 'https://git-scm.com/book/id/',
              author: 'Scott Chacon & Ben Straub',
              category: 'Git & Version Control',
              lang: 'ID',
              type: 'Book',
            },
            {
              title: 'GIT & GITHUB Playlist',
              url: 'https://www.youtube.com/playlist?list=PLFIM0718LjIVknj6sgsSceMqlq242-jNf',
              author: 'Sandhika Galih (Web Programming UNPAS)',
              category: 'Git & GitHub',
              lang: 'ID',
              type: 'Course',
            },
            {
              title: 'How the Web Works || MDN Web Docs',
              url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works',
              author: 'MDN Contributors',
              category: 'Web Fundamentals',
              lang: 'EN',
              type: 'Docs',
            },
          ],
          weeklyAssignment: {
            week: 1,
            title: 'Weekly Coding Assignment || Minggu 1',
            description:
              'Pasang ekstensi Live Server dan Prettier di VS Code, lengkapi biodata singkat pada index.html, lalu unggah minimal dua commit terpisah ke GitHub.',
          },
        },
      },
      {
        slideNumber: 9,
        isSummary: false,
        layoutType: 'task',
        badge: 'Task Submission',
        title: 'Pengumpulan Tugas Pertemuan 01 & Pembukaan P02',
        subtitle:
          'Kirim tautan repositori GitHub publik beserta Learning Log untuk diperiksa oleh mentor.',
        contentJson: {
          eyebrow: 'Syarat Pembukaan Pertemuan 02',
          highlights: [
            'Pertemuan 02 terbuka otomatis setelah tugas ini di-ACC oleh mentor.',
            'Pastikan visibilitas repositori diatur ke Public agar dapat ditinjau.',
          ],
          deliverables: [
            'Tautan repositori GitHub publik untuk proyek profil awal.',
            'Berkas index.html dan README.md dengan pesan commit yang rapi.',
            'Catatan Learning Log berisi hasil verifikasi versi perkakas dan kendala instalasi.',
          ],
          learningLogFields: STANDARD_LEARNING_LOG_FIELDS,
          mentorTip:
            'Saat diminta autentikasi ketika menjalankan git push, gunakan Git Credential Manager atau Personal Access Token lalu catat langkahnya di Learning Log.',
        },
      },
    ],
  },

  // ============================================================================
  // P02 || HTML5 SEMANTIK, BOX MODEL, FLEXBOX, GRID & RESPONSIVE
  // ============================================================================
  {
    orderIndex: 2,
    month: 1,
    slug: 'pertemuan-02-html-semantik-css-fundamental',
    code: 'P02',
    sessionType: 'Materi 1',
    title: 'HTML5 Semantik, Box Model, Flexbox, Grid & Responsive',
    subtitle:
      'Susun dokumen HTML5 semantik dan tata letak responsif memakai Box Model, Flexbox, serta CSS Grid.',
    summaryText:
      'Kuasai elemen semantik HTML5, aturan Box Model, tata letak Flexbox-Grid, dan media query.',
    taskPrompt:
      'Bangun halaman profil statis InternFlow memakai HTML5 semantik dan berkas CSS terpisah yang responsif di ponsel maupun desktop.',
    taskDeliverables: [
      'Dokumen memakai tag semantik header, nav, main, section, article, dan footer.',
      'Berkas style.css terpisah menerapkan border-box, Flexbox, serta CSS Grid.',
      'Tata letak tampil rapi di layar ponsel dan desktop menggunakan media query.',
    ],
    accentGradient: 'from-blue-600 to-cyan-500',
    iconName: 'Layout',
    slides: [
      {
        slideNumber: 1,
        isSummary: true,
        layoutType: 'cover',
        badge: 'Bulan 1 • Pertemuan 02',
        title: 'HTML5 Semantik, Box Model, Flexbox, Grid & Responsive',
        subtitle:
          'Bangun kerangka dokumen yang aksesibel dan tata letak adaptif untuk berbagai ukuran layar.',
        contentJson: {
          eyebrow: 'Materi 1 • 30% Konsep / 70% Praktik Tata Letak',
          highlights: [
            'Gunakan tag HTML5 semantik yang menjelaskan peran setiap blok konten.',
            'Atur ukuran elemen secara presisi melalui konsep CSS Box Model.',
            'Padukan Flexbox satu dimensi dengan CSS Grid dua dimensi.',
            'Sesuaikan tampilan layar ponsel dan desktop menggunakan aturan media query.',
          ],
          stats: [
            { label: 'Jenis Sesi', value: 'Materi 1' },
            { label: 'Fokus Proyek', value: 'InternFlow' },
            { label: 'Target Output', value: 'Profil Responsif' },
            { label: 'Tugas Mingguan', value: 'Minggu 2' },
          ],
        },
      },
      {
        slideNumber: 2,
        isSummary: true,
        layoutType: 'summary',
        badge: 'Executive Summary',
        title: 'Mengapa Struktur Semantik & Tata Letak Modern Penting?',
        subtitle:
          'Kode yang terstruktur rapi memudahkan pembacaan mesin pencari, pembaca layar, dan rekan setim.',
        contentJson: {
          eyebrow: 'Peran Pertemuan 02 pada Evolusi Produk',
          highlights: [
            'HTML semantik meningkatkan kualitas SEO sekaligus aksesibilitas bagi pengguna pembaca layar.',
            'Pemahaman Box Model dan Grid menghentikan kebiasaan menebak margin acak.',
            'Antarmuka InternFlow menjadi fondasi gaya visual untuk aplikasi TaskFlow berikutnya.',
          ],
          bentoCards: [
            {
              title: 'HTML sebagai Struktur Makna',
              tag: 'Kerangka',
              description:
                'Menentukan hierarki judul, navigasi, konten inti, formulir, dan kaki halaman.',
            },
            {
              title: 'CSS sebagai Sistem Tata Letak',
              tag: 'Visual',
              description:
                'Mengendalikan tipografi, ruang kosong, susunan kartu, dan adaptasi lebar layar.',
            },
          ],
        },
      },
      {
        slideNumber: 3,
        isSummary: true,
        layoutType: 'bento',
        badge: 'Peta Konsep & Agenda',
        title: 'Peta Materi: Dari HTML5 Semantik Hingga Media Query',
        subtitle:
          'Pelajari empat fondasi antarmuka lalu terapkan langsung pada halaman profil InternFlow.',
        contentJson: {
          eyebrow: 'Agenda Sesi Pertemuan 02',
          highlights: [
            'Sesi konsep (30%) membedah tag semantik, Box Model, dan Grid.',
            'Sesi praktik (70%) merakit navigasi Flexbox, kartu Grid, dan responsif.',
          ],
          bentoCards: [
            {
              title: '1. HTML5 Semantik & Form',
              tag: '20 Menit',
              description:
                'Penggunaan tag struktural halaman beserta elemen input dan label formulir.',
            },
            {
              title: '2. Selektor & Box Model',
              tag: '25 Menit',
              description:
                'Perhitungan ruang content, padding, border, margin, dan aturan border-box.',
            },
            {
              title: '3. Flexbox & CSS Grid',
              tag: '45 Menit',
              description:
                'Penyusunan baris navigasi dengan Flex dan daftar kartu proyek dengan Grid.',
            },
            {
              title: '4. Desain Responsif',
              tag: '50 Menit',
              description:
                'Penyesuaian kolom dan arah elemen di layar ponsel melalui media query.',
            },
          ],
        },
      },
      {
        slideNumber: 4,
        isSummary: false,
        layoutType: 'bento',
        badge: 'Analogi & Konsep',
        title: 'Analogi Paket Kiriman (Box Model) & Pemilihan Layout',
        subtitle:
          'Setiap elemen HTML merupakan kotak empat lapis yang disusun satu atau dua arah.',
        contentJson: {
          eyebrow: 'Model Visual CSS',
          highlights: [
            'Empat lapis Box Model mencakup content, padding, border, dan margin.',
            'Gunakan Flexbox untuk satu arah dan Grid untuk baris-kolom.',
          ],
          bentoCards: [
            {
              title: 'Elemen Semantik Utama',
              tag: 'Struktur HTML5',
              description:
                'Gunakan tag bermakna jelas sesuai peran konten di dalam halaman.',
              bullets: [
                'header dan nav untuk kepala navigasi',
                'main untuk satu area konten utama',
                'section, article, dan footer sesuai konteks',
              ],
            },
            {
              title: 'Aturan Wajib border-box',
              tag: 'Ukuran Presisi',
              description:
                'Nilai lebar elemen langsung mencakup ruang padding dan garis border tanpa melebar keluar.',
            },
            {
              title: 'Prinsip Desain Responsif',
              tag: 'Multi-Layar',
              description:
                'Padukan meta viewport, satuan relatif rem atau fr, dan titik potong media query.',
            },
          ],
        },
      },
      {
        slideNumber: 5,
        isSummary: false,
        layoutType: 'bento',
        badge: 'Bedah Teknis & Sintaks',
        title: 'Pola Kode HTML Semantik, Flexbox & Grid Responsif',
        subtitle:
          'Gunakan pola dasar ini untuk menjaga struktur dokumen tetap bersih dan adaptif.',
        contentJson: {
          eyebrow: 'Cuplikan Kode Inti',
          highlights: [
            'Hubungkan berkas style.css melalui elemen link di dalam bagian head.',
            'Fungsi auto-fit dan minmax membuat kolom Grid menyesuaikan lebar layar otomatis.',
          ],
          codeBlocks: [
            {
              title: 'Kerangka HTML5 Semantik',
              language: 'html',
              filename: 'index.html',
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
<footer><p>&copy; 2026 InternFlow</p></footer>`,
            },
            {
              title: 'Reset Box Model, Flexbox & Grid',
              language: 'css',
              filename: 'style.css',
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
}`,
            },
          ],
        },
      },
      {
        slideNumber: 6,
        isSummary: false,
        layoutType: 'comparison',
        badge: 'Bad vs Good Practice',
        title: 'Div Berlebihan & Gaya Inline vs Semantik & CSS Terpisah',
        subtitle:
          'Pisahkan struktur HTML dari aturan gaya CSS agar kode mudah dirawat.',
        contentJson: {
          eyebrow: 'Perbandingan Kualitas Kode',
          highlights: [
            'Berkas CSS eksternal menjaga dokumen HTML tetap ringkas dan konsisten.',
          ],
          comparison: {
            badTitle: '✕ Penulisan Kaku & Sulit Dirawat',
            badPoints: [
              'Membungkus seluruh bagian halaman hanya menggunakan elemen div generik.',
              'Menulis atribut style berulang langsung di dalam tag HTML.',
              'Memasang lebar piksel kaku sehingga tampilan terpotong di layar ponsel.',
            ],
            badCode: {
              title: 'Contoh Div Soup & Lebar Kaku',
              language: 'html',
              filename: 'bad-profile.html',
              snippet: `<div style="width: 1200px; background: blue; color: white;">
  <div style="font-size: 24px;">Profil Saya</div>
</div>
<br><br>
<div onclick="kirim()">Klik di sini</div>`,
            },
            goodTitle: '✓ Standar Semantik & Responsif',
            goodPoints: [
              'Memilih tag header, main, section, dan button sesuai fungsi aslinya.',
              'Menempatkan seluruh aturan tampilan di dalam berkas style.css terpisah.',
              'Memakai max-width, Flexbox, dan Grid agar adaptif di semua layar.',
            ],
            goodCode: {
              title: 'HTML Semantik Bersih',
              language: 'html',
              filename: 'good-profile.html',
              snippet: `<header class="site-header">
  <h1 class="site-title">Profil Saya</h1>
</header>
<main class="container">
  <section class="profile-card">
    <button type="button" class="btn-primary">Lihat Proyek</button>
  </section>
</main>`,
            },
          },
        },
      },
      {
        slideNumber: 7,
        isSummary: false,
        layoutType: 'practice',
        badge: '70% Hands-On Praktik',
        title: 'Langkah Praktik: Merakit Halaman Profil InternFlow',
        subtitle:
          'Kembangkan halaman HTML awal menjadi portal profil responsif dalam empat langkah.',
        contentJson: {
          eyebrow: 'Lab Pertemuan 02 || InternFlow',
          highlights: [
            'Aktifkan Live Server di VS Code untuk memantau perubahan langsung.',
          ],
          practiceSteps: [
            {
              step: 1,
              title: 'Susun Kerangka Semantik & Tautkan CSS',
              description:
                'Buat berkas style.css lalu bangun struktur header, main, daftar proyek, form kontak, dan footer.',
              command: 'touch style.css',
            },
            {
              step: 2,
              title: 'Terapkan Reset Box Model & Pembungkus Lebar',
              description:
                'Pasang aturan border-box serta kelas pembungkus tengah agar konten nyaman dibaca.',
              code: `*, *::before, *::after { box-sizing: border-box; }
.container {
  width: min(100% - 2rem, 1040px);
  margin-inline: auto;
}`,
            },
            {
              step: 3,
              title: 'Atur Navigasi Flexbox & Kartu Proyek Grid',
              description:
                'Sejajarkan menu navigasi memakai Flexbox dan tata daftar keahlian menggunakan CSS Grid.',
            },
            {
              step: 4,
              title: 'Uji Layar Ponsel di DevTools & Push ke GitHub',
              description:
                'Periksa tampilan pada lebar 375px dan 1280px tanpa geser samping, lalu unggah commit.',
              command:
                'git add . && git commit -m "feat: terapkan html semantik dan css responsif internflow" && git push',
            },
          ],
        },
      },
      {
        slideNumber: 8,
        isSummary: false,
        layoutType: 'quiz',
        badge: 'Kuis & Pustaka Belajar',
        title: 'Uji Pemahaman Pertemuan 02 & Referensi HTML/CSS',
        subtitle:
          'Uji penguasaan konsep semantik, lapisan Box Model, serta pemilihan Flexbox dan Grid.',
        contentJson: {
          eyebrow: 'Evaluasi Konsep & Referensi Terkurasi',
          highlights: [
            'Rumuskan jawaban singkat terlebih dahulu sebelum melihat kunci konsep.',
          ],
          quizItems: [
            {
              question:
                'Mengapa elemen semantik seperti header, main, dan footer lebih disarankan daripada div?',
              hint: 'Pertimbangkan keterbacaan kode, aksesibilitas, dan mesin pencari.',
              answer:
                'Elemen semantik memberi arti struktural yang jelas pada setiap bagian dokumen. Hal ini memudahkan pemeliharaan kode, pembaca layar aksesibilitas, serta pengindeksan SEO.',
            },
            {
              question:
                'Sebutkan empat lapisan Box Model dari dalam ke luar beserta fungsi aturan border-box.',
              hint: 'Urutkan dari isi konten hingga jarak antar elemen.',
              answer:
                'Empat lapisannya adalah Content, Padding, Border, dan Margin. Aturan box-sizing: border-box menjaga total lebar elemen tetap sesuai nilai width karena sudah menyertakan padding dan border.',
            },
            {
              question:
                'Kapan kita sebaiknya memilih Flexbox dan kapan memilih CSS Grid?',
              hint: 'Bedakan kebutuhan tata letak satu arah dan dua arah.',
              answer:
                'Gunakan Flexbox untuk menyusun elemen satu dimensi seperti baris navigasi atau deretan tombol. Gunakan CSS Grid untuk mengatur baris dan kolom sekaligus seperti galeri kartu.',
            },
          ],
          references: [
            {
              title: 'Tutorial HTML untuk Pemula',
              url: 'https://www.petanikode.com/tutorial/html/',
              author: 'Ahmad Muhardian (Petani Kode)',
              category: 'HTML & CSS',
              lang: 'ID',
              type: 'Book',
            },
            {
              title: 'Tutorial Dasar CSS untuk Pemula',
              url: 'https://www.petanikode.com/tutorial/css/',
              author: 'Ahmad Muhardian (Petani Kode)',
              category: 'HTML & CSS',
              lang: 'ID',
              type: 'Book',
            },
            {
              title: 'Belajar FLEXBOX',
              url: 'https://www.youtube.com/playlist?list=PLFIM0718LjIU1lWlM34j6E9fMlrrSGZ1k',
              author: 'Sandhika Galih (Web Programming UNPAS)',
              category: 'CSS Layout',
              lang: 'ID',
              type: 'Course',
            },
            {
              title: 'CSS Grid Layout Playlist',
              url: 'https://www.youtube.com/playlist?list=PLFIM0718LjIXmbwX0dEsoRVX-PC16vmuw',
              author: 'Sandhika Galih (Web Programming UNPAS)',
              category: 'CSS Layout',
              lang: 'ID',
              type: 'Course',
            },
            {
              title: 'MDN Web Docs || CSS Reference',
              url: 'https://developer.mozilla.org/en-US/docs/Web/CSS',
              author: 'MDN Contributors',
              category: 'HTML & CSS',
              lang: 'EN',
              type: 'Docs',
            },
          ],
          weeklyAssignment: {
            week: 2,
            title: 'Weekly Coding Assignment || Minggu 2',
            description:
              'Sempurnakan profil InternFlow dengan seksi Hero, Grid kartu proyek, dan formulir kontak yang rapi pada lebar layar 375px.',
          },
        },
      },
      {
        slideNumber: 9,
        isSummary: false,
        layoutType: 'task',
        badge: 'Task Submission',
        title: 'Pengumpulan Tugas Pertemuan 02 & Pembukaan P03',
        subtitle:
          'Unggah kode profil responsif ke GitHub dan isi Learning Log untuk membuka materi JavaScript.',
        contentJson: {
          eyebrow: 'Syarat Pembukaan Pertemuan 03',
          highlights: [
            'Mentor memeriksa tag semantik, pemisahan berkas CSS, dan tampilan ponsel.',
          ],
          deliverables: [
            'Tautan repositori GitHub berisi index.html dan style.css terpisah.',
            'Penerapan elemen HTML5 semantik secara tepat di seluruh bagian halaman.',
            'Tata letak Flexbox dan Grid yang adaptif di layar ponsel maupun desktop.',
          ],
          learningLogFields: STANDARD_LEARNING_LOG_FIELDS,
          mentorTip:
            'Jika halaman ponsel masih bergeser ke samping, periksa elemen yang memakai lebar piksel tetap dan tambahkan max-width: 100% pada gambar.',
        },
      },
    ],
  },

  // ============================================================================
  // P03 - TAILWIND CSS: UTILITY-FIRST DAN PERBANDINGAN CSS VANILLA
  // ============================================================================
  {
    orderIndex: 3,
    month: 1,
    slug: 'pertemuan-03-tailwind-css-utility-first',
    code: 'P03',
    sessionType: 'Materi 2',
    title: 'Tailwind CSS: Utility-First dan Perbandingan CSS Vanilla',
    subtitle:
      'Mengenal pendekatan utility-first Tailwind CSS serta perbedaannya dengan CSS vanilla.',
    summaryText:
      'Pelajari konsep utility-first, bedah sintaks Tailwind CSS, perbandingan langsung dengan CSS vanilla, dan praktik mengubah kartu profil.',
    taskPrompt:
      'Ubah halaman kartu profil statis menggunakan kelas utilitas Tailwind CSS melalui CDN agar responsif dan rapi.',
    taskDeliverables: [
      'Mengubah komponen kartu profil dari CSS vanilla ke kelas utilitas Tailwind CSS.',
      'Menerapkan layout responsif dengan prefix breakpoint (md:, lg:) dan state (hover:).',
      'Mengunggah hasil praktik ke repositori GitHub beserta Learning Log.',
    ],
    iconName: 'PaintBrush',
    accentGradient: 'from-cyan-500 to-sky-500',
    slides: [
      {
        slideNumber: 1,
        isSummary: true,
        layoutType: 'cover',
        badge: 'Pertemuan 03 || Materi 2',
        title: 'Tailwind CSS: Utility-First dan Perbandingan CSS Vanilla',
        subtitle:
          'Membangun antarmuka modern lebih cepat tanpa bolak-balik berpindah berkas CSS.',
        contentJson: {
          eyebrow: 'Materi 2 || 30% Konsep / 70% Praktik',
          highlights: [
            'Memahami alasan beralih dari CSS vanilla ke utility-first.',
            'Membaca dan menulis kelas utilitas Tailwind secara percaya diri.',
            'Membandingkan efisiensi kode CSS vanilla vs Tailwind CSS.',
          ],
          stats: [
            { label: 'Fokus Materi', value: 'Utility-First CSS' },
            { label: 'Porsi Praktik', value: '70% Hands-On' },
            { label: 'Target', value: 'Kartu Profil Tailwind' },
          ],
        },
      },
      {
        slideNumber: 2,
        isSummary: true,
        layoutType: 'summary',
        badge: 'Ringkasan Materi',
        title: 'Ringkasan: Mengapa Beralih ke Tailwind CSS?',
        subtitle:
          'Mengatasi masalah klasik CSS vanilla seperti penamaan kelas dan konflik cascade.',
        contentJson: {
          eyebrow: 'Ringkasan',
          highlights: [
            'Pada CSS vanilla, semakin besar proyek, semakin sulit menjaga konsistensi jarak, warna, dan nama kelas.',
          ],
          bentoCards: [
            {
              title: 'Bebas Bingung Menamai Kelas',
              description:
                'Tidak perlu lagi memikirkan nama seperti .card-wrapper-inner-box atau .btn-primary-alt.',
            },
            {
              title: 'Tidak Ada Efek Samping Global',
              description:
                'Mengubah kelas di satu elemen HTML tidak akan merusak tampilan halaman lain.',
            },
            {
              title: 'Desain Konsisten Secara Bawaan',
              description:
                'Skala spasi, ukuran teks, dan palet warna sudah terstruktur rapi sejak awal.',
            },
          ],
          mentorTip:
            'Tailwind CSS bukan pengganti pemahaman CSS, melainkan cara menulis CSS yang lebih cepat dan terprediksi.',
        },
      },
      {
        slideNumber: 3,
        isSummary: true,
        layoutType: 'bento',
        badge: 'Peta Konsep',
        title: 'Peta Konsep Pertemuan 03',
        subtitle:
          'Alur belajar dari teori utility-first hingga praktik mengubah kartu profil.',
        contentJson: {
          eyebrow: 'Peta Konsep',
          highlights: [
            'Empat langkah utama untuk menguasai dasar Tailwind CSS dalam satu sesi.',
          ],
          bentoCards: [
            {
              title: '1. Utility-First vs Cascade',
              description:
                'Memahami perbedaan mendasar antara kelas utilitas tunggal dan aturan CSS tradisional.',
            },
            {
              title: '2. Bedah Sintaks Utilitas',
              description:
                'Membaca pola warna, spasi, flexbox, state hover, dan breakpoint responsif.',
            },
            {
              title: '3. Perbandingan Kode Nyata',
              description:
                'Melihat langsung perbandingan CSS vanilla dengan Tailwind CSS pada komponen yang sama.',
            },
            {
              title: '4. Praktik Kartu Profil',
              description:
                'Mengonversi kartu profil HTML/CSS menjadi komponen Tailwind CSS yang responsif.',
            },
          ],
        },
      },
      {
        slideNumber: 4,
        isSummary: false,
        layoutType: 'bento',
        badge: 'Konsep Inti',
        title: 'Konsep Utility-First vs Cascade CSS Vanilla',
        subtitle:
          'Satu kelas mewakili satu properti gaya yang jelas dan langsung terlihat di HTML.',
        contentJson: {
          eyebrow: 'Konsep Inti',
          highlights: [
            'CSS vanilla mengandalkan cascade dan selektor terpisah, sedangkan utility-first menyusun tampilan langsung dari blok-blok kecil di HTML.',
          ],
          bentoCards: [
            {
              title: 'CSS Vanilla (Semantic Class)',
              description:
                'Menulis struktur di HTML, lalu berpindah ke berkas .css untuk mendefinisikan setiap properti.',
            },
            {
              title: 'Tailwind CSS (Utility-First)',
              description:
                'Menggabungkan kelas kecil seperti p-4, rounded-lg, dan bg-white langsung pada elemen.',
            },
            {
              title: 'Kapan Tetap Pakai CSS Vanilla?',
              description:
                'Animasi kompleks dengan @keyframes atau aturan khusus tetap dapat ditulis di CSS biasa.',
            },
          ],
        },
      },
      {
        slideNumber: 5,
        isSummary: false,
        layoutType: 'bento',
        badge: 'Bedah Sintaks',
        title: 'Bedah Sintaks Kelas Utilitas Tailwind CSS',
        subtitle:
          'Pola penamaan yang konsisten membuat kelas Tailwind mudah ditebak tanpa menghafal semua.',
        contentJson: {
          eyebrow: 'Bedah Sintaks',
          highlights: [
            'Kenali lima pola kelas yang paling sering dipakai saat membangun komponen antarmuka.',
          ],
          bentoCards: [
            {
              title: 'bg-red-500 & hover:bg-red-700',
              description:
                'Memberikan warna latar merah 500, lalu berubah menjadi merah 700 saat kursor diarahkan.',
            },
            {
              title: 'p-4',
              description: 'Menambahkan padding 1rem (16px) di keempat sisi elemen.',
            },
            {
              title: 'flex gap-3',
              description:
                'Mengaktifkan Flexbox dengan jarak antar item sebesar 0.75rem (12px).',
            },
            {
              title: 'md:grid-cols-2',
              description:
                'Mengatur tata letak menjadi 2 kolom mulai ukuran layar medium (768px ke atas).',
            },
          ],
        },
      },
      {
        slideNumber: 6,
        isSummary: false,
        layoutType: 'comparison',
        badge: 'Perbandingan Kode',
        title: 'Perbandingan: CSS Vanilla vs Tailwind CSS',
        subtitle:
          'Komponen tombol yang sama, ditulis dengan dua pendekatan berbeda.',
        contentJson: {
          eyebrow: 'Perbandingan Kode',
          highlights: [
            'Tailwind memangkas kebutuhan menulis dan merawat berkas CSS terpisah untuk komponen standar.',
          ],
          comparison: {
            badTitle: 'CSS Vanilla (HTML + CSS terpisah)',
            badPoints: [
              'Harus memikirkan nama kelas semantik dan berpindah antar berkas.',
              'Berisiko menimbulkan konflik cascade atau gaya yang tidak terduga.',
            ],
            badCode: {
              language: 'css',
              filename: 'style.css & index.html',
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
<button class="btn-danger">Hapus</button>`,
            },
            goodTitle: 'Tailwind CSS (Langsung di HTML)',
            goodPoints: [
              'Gaya langsung terlihat pada elemen HTML tanpa membuat berkas CSS baru.',
              'Skala warna, spasi, dan state hover konsisten secara bawaan.',
            ],
            goodCode: {
              language: 'html',
              filename: 'index.html',
              snippet: `<button class="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-lg">
  Hapus
</button>`,
            },
          },
        },
      },
      {
        slideNumber: 7,
        isSummary: false,
        layoutType: 'practice',
        badge: 'Praktik 70%',
        title: 'Praktik 70%: Mengubah Kartu Profil ke Tailwind CSS',
        subtitle:
          'Terapkan langsung pada proyek profil dengan Play CDN Tailwind.',
        contentJson: {
          eyebrow: 'Lab Pertemuan 03 || Kartu Profil Tailwind',
          highlights: [
            'Gunakan Play CDN Tailwind untuk mengubah kartu profil HTML/CSS menjadi komponen responsif.',
          ],
          practiceSteps: [
            {
              step: 1,
              title: 'Pasang Tailwind Play CDN',
              description:
                'Tambahkan skrip CDN Tailwind di dalam tag <head> pada berkas index.html.',
              code: `<script src="https://cdn.tailwindcss.com"></script>`,
            },
            {
              step: 2,
              title: 'Susun Kartu Profil dengan Utilitas',
              description:
                'Gunakan kelas flex, gap-4, p-6, rounded-xl, shadow-md, dan responsif md:flex-row.',
              code: `<article class="max-w-md mx-auto bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row items-center gap-4">
  <img class="w-20 h-20 rounded-full object-cover" src="avatar.jpg" alt="Foto Profil" />
  <div>
    <h2 class="text-lg font-bold text-slate-900">Nama Peserta</h2>
    <p class="text-sm text-slate-600">Full-Stack Intern</p>
  </div>
</article>`,
            },
            {
              step: 3,
              title: 'Simpan dan Dorong ke GitHub',
              description:
                'Commit perubahan kartu profil Tailwind CSS ke repositori.',
              code: 'git add . && git commit -m "feat: ubah kartu profil menggunakan tailwind css" && git push',
            },
          ],
        },
      },
      {
        slideNumber: 8,
        isSummary: false,
        layoutType: 'quiz',
        badge: 'Kuis & Referensi',
        title: 'Kuis Pemahaman & Referensi Belajar',
        subtitle:
          'Uji pemahaman sintaks utility-first dan pelajari dokumentasi resmi.',
        contentJson: {
          eyebrow: 'Evaluasi Singkat',
          highlights: [
            'Jawab dua pertanyaan singkat dan simpan referensi resmi Tailwind CSS.',
          ],
          quizItems: [
            {
              question:
                'Apa fungsi prefix md: pada kelas seperti md:grid-cols-2 di Tailwind CSS?',
              answer:
                'Menerapkan kelas utilitas tersebut hanya pada ukuran layar medium (768px) ke atas.',
              hint: 'Berkaitan dengan ukuran layar minimum 768px.',
            },
            {
              question:
                'Mengapa Tailwind CSS membantu mengurangi konflik gaya antar halaman?',
              answer:
                'Karena setiap kelas utilitas hanya mengatur satu properti langsung pada elemen HTML terkait, tanpa mengubah aturan CSS global.',
              hint: 'Ingat sifat kelas utilitas yang hanya berlaku pada elemen tempat kelas itu dipasang.',
            },
          ],
          references: [
            {
              title: 'Learn Tailwind CSS (dwyl/learn-tailwind)',
              url: 'https://github.com/dwyl/learn-tailwind',
              category: 'Tailwind CSS',
              lang: 'EN',
              type: 'Docs',
            },
            {
              title: 'Tailwind CSS Official Documentation',
              url: 'https://tailwindcss.com/docs',
              category: 'Tailwind CSS',
              lang: 'EN',
              type: 'Docs',
            },
          ],
        },
      },
      {
        slideNumber: 9,
        isSummary: false,
        layoutType: 'task',
        badge: 'Penugasan Mingguan',
        title: 'Tugas Pertemuan 03 & Learning Log',
        subtitle:
          'Selesaikan konversi kartu profil dan catat proses belajar di Learning Log.',
        contentJson: {
          eyebrow: 'Penugasan Mingguan',
          highlights: [
            'Ubah kartu profil dan bagian daftar keahlian menggunakan kelas utilitas Tailwind CSS.',
          ],
          weeklyAssignment: {
            week: 3,
            title: 'Weekly Coding Assignment || Tailwind CSS',
            description:
              'Ubah kartu profil dan bagian daftar keahlian pada halaman profil agar sepenuhnya memakai kelas utilitas Tailwind CSS yang responsif.',
          },
          deliverables: [
            'Tautan repositori GitHub berisi index.html dengan kelas utilitas Tailwind CSS.',
            'Tampilan kartu profil yang rapi di layar ponsel maupun desktop.',
            'Catatan Learning Log yang lengkap.',
          ],
          learningLogFields: STANDARD_LEARNING_LOG_FIELDS,
          mentorTip:
            'Biasakan membaca kelas Tailwind dari luar ke dalam: tata letak (flex/grid), jarak (p-/m-/gap-), warna, lalu responsif.',
        },
      },
    ],
  },

  // ============================================================================
  // P04 - JAVASCRIPT VANILLA, ARRAY METHODS, DOM & ASYNC FETCH
  // ============================================================================
  {
    orderIndex: 4,
    month: 1,
    slug: 'pertemuan-04-javascript-vanilla-dom',
    code: 'P06',
    sessionType: 'Materi 2',
    title: 'JavaScript Vanilla, Array Methods, DOM & Async Fetch',
    subtitle:
      'Hidupkan halaman statis memakai logika JavaScript ES6+, olahan array, manipulasi DOM, dan async fetch.',
    summaryText:
      'Pelajari variabel modern, fungsi, metode array, manipulasi DOM, event listener, serta async fetch.',
    taskPrompt:
      'Tambahkan berkas script.js pada InternFlow untuk menerapkan penyaringan data array, interaksi tombol, dan validasi formulir kontak.',
    taskDeliverables: [
      'Berkas script.js terpisah terhubung memakai atribut defer pada HTML.',
      'Penerapan struktur array of objects beserta metode map, filter, atau find.',
      'Interaksi pengguna berjalan lewat addEventListener tanpa galat di konsol.',
    ],
    accentGradient: 'from-amber-500 to-yellow-500',
    iconName: 'Code',
    slides: [
      {
        slideNumber: 1,
        isSummary: true,
        layoutType: 'cover',
        badge: 'Bulan 1 • Pertemuan 03',
        title: 'JavaScript Vanilla, Array Methods, DOM & Async Fetch',
        subtitle:
          'Ubah halaman statis menjadi antarmuka dinamis yang mengolah data dan merespons aksi pengguna.',
        contentJson: {
          eyebrow: 'Materi 2 • 30% Konsep / 70% Praktik Interaksi DOM',
          highlights: [
            'Kuasai dasar ES6+ meliputi const, let, perbandingan ketat, dan fungsi.',
            'Olahan daftar objek menjadi lebih ringkas menggunakan map, filter, dan find.',
            'Manipulasi elemen halaman secara langsung melalui DOM dan addEventListener.',
            'Kenali JSON, fetch, dan async/await sebagai fondasi komunikasi API.',
          ],
          stats: [
            { label: 'Jenis Sesi', value: 'Materi 2' },
            { label: 'Bahasa', value: 'JavaScript ES6+' },
            { label: 'Target Output', value: 'Profil Interaktif' },
            { label: 'Tugas Mingguan', value: 'Minggu 3' },
          ],
        },
      },
      {
        slideNumber: 2,
        isSummary: true,
        layoutType: 'summary',
        badge: 'Executive Summary',
        title: 'Mengapa JavaScript Murni Wajib Kuat Sebelum Framework?',
        subtitle:
          'Kerangka kerja seperti Vue dan Nuxt berdiri sepenuhnya di atas konsep dasar JavaScript.',
        contentJson: {
          eyebrow: 'Jembatan Menuju TaskFlow & REST API',
          highlights: [
            'Daftar tugas modern mengolah array objek langsung ke dalam DOM.',
            'Metode map, filter, dan find dipakai rutin di ekosistem Vue.',
            'Pemahaman JSON dan async/await mempermudah integrasi API Express di Bulan 2.',
          ],
          bentoCards: [
            {
              title: 'Pengelola Data (JS Core)',
              tag: 'Logika',
              description:
                'Menyimpan serta memproses status aplikasi menggunakan variabel, fungsi, array, dan objek.',
            },
            {
              title: 'Pengendali Tampilan (DOM)',
              tag: 'Interaksi',
              description:
                'Menghubungkan aksi klik atau pengiriman formulir ke pembaruan layar seketika.',
            },
          ],
        },
      },
      {
        slideNumber: 3,
        isSummary: true,
        layoutType: 'bento',
        badge: 'Peta Konsep & Agenda',
        title: 'Agenda Sesi: Dasar Bahasa, Metode Array, DOM & Async',
        subtitle:
          'Empat tahapan materi inti yang langsung diterapkan pada proyek InternFlow.',
        contentJson: {
          eyebrow: 'Alokasi Waktu 30% Konsep / 70% Praktik',
          highlights: [
            'Manfaatkan tab Console di DevTools untuk menguji ekspresi kode secara cepat.',
          ],
          bentoCards: [
            {
              title: '1. Variabel & Percabangan',
              tag: '25 Menit',
              description:
                'Deklarasi const dan let, tipe data dasar, operator ===, serta kondisional.',
            },
            {
              title: '2. Fungsi, Array & Objek',
              tag: '35 Menit',
              description:
                'Pembuatan fungsi modular serta transformasi data dengan map, filter, dan find.',
            },
            {
              title: '3. DOM & Event Listener',
              tag: '45 Menit',
              description:
                'Seleksi elemen querySelector, pembaruan textContent, classList, dan penanganan klik.',
            },
            {
              title: '4. JSON & Async Fetch',
              tag: '35 Menit',
              description:
                'Struktur pertukaran JSON, mekanisme Promise, serta pengambilan data async/await.',
            },
          ],
        },
      },
      {
        slideNumber: 4,
        isSummary: false,
        layoutType: 'bento',
        badge: 'Analogi & Konsep',
        title: 'Model Mental JavaScript: Variabel, Olahan Array & Async',
        subtitle:
          'Pahami cara peramban merepresentasikan halaman sebagai pohon objek yang siap dimanipulasi.',
        contentJson: {
          eyebrow: 'Konsep Inti JavaScript Peramban',
          highlights: [
            'DOM memetakan HTML menjadi pohon objek yang dikendalikan lewat JavaScript.',
            'Fungsi addEventListener memantau peristiwa pada elemen dan menjalankan kode saat dipicu.',
          ],
          bentoCards: [
            {
              title: 'Aturan const vs let',
              tag: 'Variabel',
              description:
                'Gunakan const sebagai pilihan baku dan pakai let hanya saat nilai berubah.',
            },
            {
              title: 'Tiga Metode Array Utama',
              tag: 'Transformasi Data',
              description:
                'Proses koleksi data secara bersih tanpa merusak susunan array aslinya.',
              bullets: [
                'map: mengubah bentuk setiap item',
                'filter: menyaring item sesuai syarat',
                'find: mengambil satu item pertama',
              ],
            },
            {
              title: 'Promise & Async/Await',
              tag: 'Asinkron',
              description:
                'Menunggu respons data jaringan secara terstruktur tanpa membekukan antarmuka pengguna.',
            },
          ],
        },
      },
      {
        slideNumber: 5,
        isSummary: false,
        layoutType: 'bento',
        badge: 'Bedah Teknis & Sintaks',
        title: 'Pola Penyaringan Array ke DOM & Pemanggilan Fetch',
        subtitle:
          'Pelajari pola kode ES6+ bersih untuk merender daftar data dan menangani permintaan jaringan.',
        contentJson: {
          eyebrow: 'Cuplikan Kode ES6+',
          highlights: [
            'Gunakan operator === agar nilai sekaligus tipe datanya diperiksa secara akurat.',
            'Bungkus pemanggilan async fetch dengan blok try/catch untuk menangani kegagalan jaringan.',
          ],
          codeBlocks: [
            {
              title: 'Filter Array Objek & Render DOM',
              language: 'javascript',
              filename: 'dom-array.js',
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
});`,
            },
            {
              title: 'Pengambilan Data JSON dengan Async/Await',
              language: 'javascript',
              filename: 'async-fetch.js',
              snippet: `async function loadSampleTask() {
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/todos/1');
    if (!res.ok) throw new Error(\`Gagal memuat: \${res.status}\`);
    const data = await res.json();
    console.log('Contoh tugas:', data.title);
  } catch (err) {
    console.error('Kendala jaringan:', err.message);
  }
}`,
            },
          ],
        },
      },
      {
        slideNumber: 6,
        isSummary: false,
        layoutType: 'comparison',
        badge: 'Bad vs Good Practice',
        title: 'Atribut onclick & var vs addEventListener & const',
        subtitle:
          'Jaga kode tetap aman dan terpisah dari markup HTML menggunakan standar ES6+.',
        contentJson: {
          eyebrow: 'Perbandingan Kualitas Skrip',
          highlights: [
            'Pemisahan skrip dengan addEventListener memudahkan pelacakan alur program di DevTools.',
          ],
          comparison: {
            badTitle: '✕ Rawan Bug (Global var & Inline JS)',
            badPoints: [
              'Memakai kata kunci var yang rawan tertimpa lintas cakupan blok.',
              'Mencampur pemanggilan fungsi onclick langsung di dalam atribut HTML.',
              'Memakai perbandingan longgar == dan menyisipkan input mentah ke innerHTML.',
            ],
            badCode: {
              title: 'Skrip Rentan Masalah Tipe & XSS',
              language: 'javascript',
              filename: 'bad-script.js',
              snippet: `var total = '1';
function hitung() {
  if (total == 1) {
    document.getElementById('info').innerHTML = 'Nilai: ' + total;
  }
}`,
            },
            goodTitle: '✓ Standar Modern & Aman',
            goodPoints: [
              'Mendeklarasikan referensi tetap dengan const dan variabel dinamis dengan let.',
              'Mendaftarkan seluruh interaksi dari berkas JS memakai addEventListener.',
              'Memakai operator ketat === serta properti textContent untuk teks aman.',
            ],
            goodCode: {
              title: 'Skrip Terstruktur & Aman',
              language: 'javascript',
              filename: 'good-script.js',
              snippet: `const total = 1;
const btn = document.querySelector('#btn-tambah');
const infoEl = document.querySelector('#info');

btn.addEventListener('click', () => {
  if (total === 1) infoEl.textContent = \`Nilai valid: \${total}\`;
});`,
            },
          },
        },
      },
      {
        slideNumber: 7,
        isSummary: false,
        layoutType: 'practice',
        badge: '70% Hands-On Praktik',
        title: 'Langkah Praktik: Menambahkan Interaksi DOM pada InternFlow',
        subtitle:
          'Pasang fitur penyaringan keahlian, pengubah tema, dan validasi formulir secara bertahap.',
        contentJson: {
          eyebrow: 'Lab Pertemuan 03 || Profil Interaktif',
          highlights: [
            'Pasang atribut defer agar skrip berjalan sesudah struktur HTML siap.',
          ],
          practiceSteps: [
            {
              step: 1,
              title: 'Hubungkan Berkas script.js dengan Atribut defer',
              description:
                'Buat berkas script.js di folder proyek lalu tautkan pada bagian head dokumen HTML.',
              code: `<script src="script.js" defer></script>`,
            },
            {
              step: 2,
              title: 'Render & Saring Daftar Keahlian dari Array Objek',
              description:
                'Simpan daftar keahlian atau proyek dalam array lalu buat tombol filter kategori.',
            },
            {
              step: 3,
              title: 'Tambahkan Tombol Tema & Validasi Formulir Kontak',
              description:
                'Gunakan classList.toggle untuk tema gelap dan cegah pengiriman input kosong dengan preventDefault.',
              code: `form.addEventListener('submit', (event) => {
  event.preventDefault();
  const nama = namaInput.value.trim();
  if (!nama) {
    statusEl.textContent = 'Nama wajib diisi terlebih dahulu.';
    return;
  }
  statusEl.textContent = \`Terima kasih, \${nama}. Pesan tercatat.\`;
});`,
            },
            {
              step: 4,
              title: 'Verifikasi Konsol Bersih & Unggah ke GitHub',
              description:
                'Uji seluruh tombol di peramban, pastikan konsol bebas galat merah, lalu push commit.',
              command:
                'git add . && git commit -m "feat: tambah filter array dan validasi form di dom" && git push',
            },
          ],
        },
      },
      {
        slideNumber: 8,
        isSummary: false,
        layoutType: 'quiz',
        badge: 'Kuis & Pustaka Belajar',
        title: 'Uji Pemahaman JavaScript & Referensi Belajar',
        subtitle:
          'Uji penguasaan variabel, metode array, penanganan formulir, dan komunikasi asinkron.',
        contentJson: {
          eyebrow: 'Evaluasi Konsep & Referensi Terkurasi',
          highlights: [
            'Biasakan menelusuri nilai kembalian setiap ekspresi kode sebelum menjalankannya.',
          ],
          quizItems: [
            {
              question:
                'Kapan kita menggunakan const dan kapan menggunakan let?',
              hint: 'Perhatikan apakah referensi variabelnya diisi ulang.',
              answer:
                'Gunakan const secara baku ketika referensi variabel tidak akan diganti ulang. Gunakan let hanya apabila nilainya memang diperbarui selama program berjalan.',
            },
            {
              question:
                'Apa perbedaan nilai kembalian antara metode .filter() dan .find()?',
              hint: 'Bandingkan daftar hasil saringan dengan pencarian tunggal.',
              answer:
                'Metode .filter() selalu mengembalikan array baru berisi seluruh elemen yang cocok. Metode .find() hanya mengembalikan satu elemen pertama yang memenuhi syarat atau undefined.',
            },
            {
              question:
                'Mengapa kita memanggil event.preventDefault() saat menangani submit formulir?',
              hint: 'Ingat perilaku bawaan peramban ketika tombol kirim ditekan.',
              answer:
                'Secara bawaan, pengiriman formulir akan memuat ulang halaman peramban. Pemanggilan preventDefault() menahan muat ulang tersebut agar validasi dapat diproses oleh JavaScript.',
            },
            {
              question:
                'Bagaimana JSON, fetch(), dan async/await saling bekerja sama?',
              hint: 'Hubungkan pengiriman permintaan jaringan, waktu tunggu, dan penguraian data.',
              answer:
                'Fungsi fetch() meminta data dari server dan mengembalikan Promise yang ditunggu secara rapi memakai async/await. Selanjutnya, response.json() mengurai teks JSON menjadi objek JavaScript.',
            },
          ],
          references: [
            {
              title: 'Tutorial JavaScript Modern (Bahasa Indonesia)',
              url: 'https://id.javascript.info',
              author: 'Ilya Kantor & Kontributor ID',
              category: 'JavaScript',
              lang: 'ID',
              type: 'Book',
            },
            {
              title: 'Learn JavaScript (Bahasa Indonesia)',
              url: 'https://javascript.sumankunwar.com.np/id',
              author: 'Suman Kumar & GitHub Contributors',
              category: 'JavaScript',
              lang: 'ID',
              type: 'Book',
            },
            {
              title: 'JavaScript dan DOM (Document Object Model)',
              url: 'https://www.youtube.com/playlist?list=PLFIM0718LjIWB3YRoQbQh82ZewAGtE2-3',
              author: 'Sandhika Galih (Web Programming UNPAS)',
              category: 'JavaScript DOM',
              lang: 'ID',
              type: 'Course',
            },
            {
              title: 'Belajar JavaScript Async',
              url: 'https://www.youtube.com/playlist?list=PL-CtdCApEFH-I4CD6km3BcXqrhWAkY4et',
              author: 'Eko Kurniawan Khannedy (Programmer Zaman Now)',
              category: 'Async JavaScript',
              lang: 'ID',
              type: 'Course',
            },
            {
              title: 'MDN || Introduction to the DOM',
              url: 'https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction',
              author: 'MDN Contributors',
              category: 'Web APIs',
              lang: 'EN',
              type: 'Docs',
            },
          ],
          weeklyAssignment: {
            week: 3,
            title: 'Weekly Coding Assignment || Minggu 3',
            description:
              'Buat skrip yang mengolah minimal lima data objek memakai map, filter, dan find lalu menampilkannya ke halaman HTML.',
          },
        },
      },
      {
        slideNumber: 9,
        isSummary: false,
        layoutType: 'task',
        badge: 'Task Submission',
        title: 'Pengumpulan Tugas Pertemuan 03 & Pembukaan P04',
        subtitle:
          'Kirim repositori InternFlow interaktif beserta Learning Log untuk lanjut membangun TaskFlow.',
        contentJson: {
          eyebrow: 'Syarat Pembukaan Pertemuan 04',
          highlights: [
            'Pastikan seluruh logika JavaScript diketik mandiri dan siap dijelaskan cara kerjanya.',
          ],
          deliverables: [
            'Repositori GitHub memuat berkas index.html, style.css, dan script.js terpisah.',
            'Fitur interaktif berjalan melalui addEventListener dan metode olahan array.',
            'Konsol peramban bersih tanpa pesan galat saat halaman diuji.',
          ],
          learningLogFields: STANDARD_LEARNING_LOG_FIELDS,
          mentorTip:
            'Jika muncul galat pembacaan properti bernilai null, periksa kecocokan nama selektor di HTML dan pastikan tag script memakai atribut defer.',
        },
      },
    ],
  },

  // ============================================================================
  // P04 || PRAKTIK BULAN 1: TASKFLOW & INTERNFLOW STATIS
  // ============================================================================
  {
    orderIndex: 4,
    month: 1,
    slug: 'pertemuan-04-praktik-taskflow-todolist',
    code: 'P06',
    sessionType: 'Praktik',
    title: 'Praktik Bulan 1: TaskFlow & InternFlow Statis',
    subtitle:
      'Padukan HTML5, CSS3, dan JavaScript murni untuk membangun aplikasi TaskFlow berbasis localStorage.',
    summaryText:
      'Bangun fitur tambah, tampil, tandai selesai, hapus, validasi input, dan penyimpanan localStorage.',
    taskPrompt:
      'Bangun aplikasi manajemen tugas TaskFlow dengan penyimpanan localStorage, desain responsif, dan dokumentasi README yang rapi di GitHub.',
    taskDeliverables: [
      'Fitur tambah, lihat daftar, tandai selesai, dan hapus tugas berjalan lancar.',
      'Validasi mencegah penyimpanan tugas kosong atau berisi spasi saja.',
      'Data tersimpan di localStorage sehingga tetap utuh saat peramban di-refresh.',
      'Berkas HTML, CSS, JS terpisah rapi serta dilengkapi README.md di GitHub.',
    ],
    accentGradient: 'from-emerald-500 to-teal-500',
    iconName: 'CheckSquareOffset',
    slides: [
      {
        slideNumber: 1,
        isSummary: true,
        layoutType: 'cover',
        badge: 'Bulan 1 • Pertemuan 04',
        title: 'Praktik Bulan 1: TaskFlow & InternFlow Statis',
        subtitle:
          'Satukan seluruh materi Bulan 1 ke dalam aplikasi manajemen tugas yang utuh dan persisten.',
        contentJson: {
          eyebrow: 'Sesi Praktik & Klinik Proyek • Fokus Eksekusi',
          highlights: [
            'Bangun alur CRUD lokal meliputi tambah, tampil, tandai selesai, dan hapus.',
            'Simpan daftar tugas secara permanen di peramban menggunakan localStorage.',
            'Pertahankan arsitektur berkas terpisah antara HTML semantik, CSS, dan JS.',
            'Dokumentasikan fitur serta langkah penggunaan di dalam berkas README.md.',
          ],
          stats: [
            { label: 'Jenis Sesi', value: 'Praktik' },
            { label: 'Proyek Utama', value: 'TaskFlow' },
            { label: 'Penyimpanan', value: 'localStorage' },
            { label: 'Tugas Mingguan', value: 'Minggu 4' },
          ],
        },
      },
      {
        slideNumber: 2,
        isSummary: true,
        layoutType: 'summary',
        badge: 'Executive Summary',
        title: 'TaskFlow: Pola Dasar Sebelum Terhubung ke Basis Data',
        subtitle:
          'Alur pengelolaan state lokal hari ini mencerminkan pola aplikasi fullstack di bulan berikutnya.',
        contentJson: {
          eyebrow: 'Alur State → Storage → Render',
          highlights: [
            'Array objek di JavaScript berperan sebagai sumber kebenaran tunggal data aplikasi.',
            'Pada Bulan 2, localStorage digantikan oleh panggilan REST API MySQL.',
            'Halaman InternFlow turut dirapikan sebagai pendamping portofolio evaluasi Bulan 1.',
          ],
          bentoCards: [
            {
              title: 'Tujuh Fitur Wajib TaskFlow',
              tag: 'Target Produk',
              description:
                'Tambah, tampilkan, selesai, hapus, validasi kosong, tata letak responsif, dan localStorage.',
            },
            {
              title: 'Standar Kualitas Kode',
              tag: 'Peninjauan',
              description:
                'Penamaan fungsi camelCase yang jelas, berkas terpisah, dan riwayat commit bertahap.',
            },
          ],
        },
      },
      {
        slideNumber: 3,
        isSummary: true,
        layoutType: 'bento',
        badge: 'Peta Konsep & Agenda',
        title: 'Tahapan Pengerjaan: Dari Antarmuka Hingga localStorage',
        subtitle:
          'Bagi pengerjaan ke dalam empat tahap kecil agar setiap fitur mudah diuji.',
        contentJson: {
          eyebrow: 'Rencana Eksekusi Praktik',
          highlights: [
            'Selesaikan dan rekam commit satu fitur sebelum lanjut fitur berikutnya.',
          ],
          bentoCards: [
            {
              title: '1. Struktur & Desain UI',
              tag: '25 Menit',
              description:
                'Pembuatan formulir tugas, pesan validasi, penghitung ringkas, dan daftar ul.',
            },
            {
              title: '2. State & Fungsi Render',
              tag: '30 Menit',
              description:
                'Penyusunan fungsi renderTasks untuk menggambar ulang daftar dari array data.',
            },
            {
              title: '3. Tambah, Selesai & Hapus',
              tag: '45 Menit',
              description:
                'Penerapan validasi trim, pembalikan status selesai, dan penghapusan berdasar ID.',
            },
            {
              title: '4. Persistensi & Dokumentasi',
              tag: '40 Menit',
              description:
                'Penyimpanan JSON di localStorage serta penulisan dokumentasi README.md.',
            },
          ],
        },
      },
      {
        slideNumber: 4,
        isSummary: false,
        layoutType: 'bento',
        badge: 'Analogi & Konsep',
        title: 'Sumber Data Tunggal & Mekanisme localStorage',
        subtitle:
          'Perbarui array data terlebih dahulu, simpan ke localStorage, lalu gambar ulang tampilan.',
        contentJson: {
          eyebrow: 'Arsitektur Data TaskFlow',
          highlights: [
            'Karena localStorage hanya menyimpan teks, ubah array memakai JSON.stringify dan JSON.parse.',
            'Urutan State, Save, dan Render menjaga tampilan sinkron dengan data.',
          ],
          bentoCards: [
            {
              title: 'Model Objek Tugas',
              tag: 'Struktur Data',
              description:
                'Setiap item tugas direpresentasikan secara konsisten menggunakan tiga properti utama.',
              bullets: [
                'id: penanda unik setiap tugas',
                'title: teks tugas hasil trim',
                'completed: status boolean selesai',
              ],
            },
            {
              title: 'Siklus Tiga Langkah CRUD',
              tag: 'Alur Kerja',
              description:
                'Jalankan urutan baku ini setiap kali pengguna memicu perubahan tugas.',
              bullets: [
                '1. Perbarui isi array tasks',
                '2. Simpan JSON ke localStorage',
                '3. Panggil fungsi renderTasks()',
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
        title: 'Kode Inti Penyimpanan Lokal & Render Aman ke DOM',
        subtitle:
          'Gunakan pola fungsi modular ini untuk menjaga kode aplikasi tetap bersih dan aman.',
        contentJson: {
          eyebrow: 'Implementasi Inti TaskFlow',
          highlights: [
            'Sediakan nilai cadangan array kosong saat penyimpanan awal masih bernilai null.',
            'Gunakan atribut data-id dan data-action untuk mengenali tombol yang diklik.',
          ],
          codeBlocks: [
            {
              title: 'Muat, Simpan & Validasi Tambah Tugas',
              language: 'javascript',
              filename: 'app.js',
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
}`,
            },
            {
              title: 'Ubah Status, Hapus & Render Daftar',
              language: 'javascript',
              filename: 'render.js',
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
}`,
            },
          ],
        },
      },
      {
        slideNumber: 6,
        isSummary: false,
        layoutType: 'comparison',
        badge: 'Bad vs Good Practice',
        title: 'Manipulasi DOM Langsung vs Pengelolaan State Terstruktur',
        subtitle:
          'Kelola daftar tugas berbasis data agar mudah disaring dan dihubungkan ke API.',
        contentJson: {
          eyebrow: 'Standar Arsitektur Aplikasi',
          highlights: [
            'Data berbentuk array objek memudahkan penambahan penghitung tugas dan filter status.',
          ],
          comparison: {
            badTitle: '✕ Manipulasi Tanpa State & Validasi',
            badPoints: [
              'Menempelkan string li langsung ke innerHTML tanpa menyimpan array data.',
              'Membiarkan spasi kosong lolos karena tidak memanggil metode .trim().',
              'Menyimpan array ke localStorage tanpa konversi JSON.stringify terlebih dahulu.',
            ],
            badCode: {
              title: 'Penyimpanan Rusak & Rawan Bug',
              language: 'javascript',
              filename: 'bad-todo.js',
              snippet: `// Menyimpan "[object Object]" di peramban
localStorage.setItem('tasks', tasks);

if (input.value !== '') {
  list.innerHTML += '<li>' + input.value + '</li>';
}`,
            },
            goodTitle: '✓ Berbasis State, Trim & JSON',
            goodPoints: [
              'Membersihkan spasi input dengan .trim() lalu menampilkan pesan validasi jelas.',
              'Mengonversi data memakai JSON.stringify saat simpan dan JSON.parse saat muat.',
              'Merender teks tugas memakai textContent agar aman dari injeksi kode.',
            ],
            goodCode: {
              title: 'Validasi & Persistensi Bersih',
              language: 'javascript',
              filename: 'good-todo.js',
              snippet: `const cleanTitle = taskInput.value.trim();
if (!cleanTitle) {
  errorMsg.textContent = 'Nama tugas tidak boleh kosong.';
  return;
}
tasks.unshift({ id: Date.now(), title: cleanTitle, completed: false });
localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
renderTasks(listEl);`,
            },
          },
        },
      },
      {
        slideNumber: 7,
        isSummary: false,
        layoutType: 'practice',
        badge: '70% Hands-On Praktik',
        title: 'Langkah Praktik: Membangun TaskFlow Hingga Siap Demo',
        subtitle:
          'Selesaikan empat langkah terstruktur ini dengan minimal tiga riwayat commit terpisah.',
        contentJson: {
          eyebrow: 'Lab Pertemuan 04 || TaskFlow',
          highlights: [
            'Muat ulang halaman guna memastikan data pulih utuh dari localStorage.',
          ],
          practiceSteps: [
            {
              step: 1,
              title: 'Siapkan Berkas Proyek & Kerangka Semantik',
              description:
                'Buat folder taskflow berisi index.html, style.css, app.js, dan README.md dengan formulir tugas.',
              command:
                'mkdir taskflow && cd taskflow && touch index.html style.css app.js README.md',
            },
            {
              step: 2,
              title: 'Tata Antarmuka Kartu Tugas yang Responsif',
              description:
                'Atur tampilan kartu terpusat, pembeda visual tugas selesai, dan tombol aksi yang rapi di ponsel.',
            },
            {
              step: 3,
              title: 'Pasang Event Delegation & Persistensi localStorage',
              description:
                'Tangani aksi selesai dan hapus pada elemen ul induk lalu simpan setiap perubahan ke localStorage.',
              code: `taskListEl.addEventListener('click', (event) => {
  const btn = event.target.closest('button[data-action]');
  if (!btn) return;
  const id = Number(btn.dataset.id);
  if (btn.dataset.action === 'toggle') toggleTask(id);
  if (btn.dataset.action === 'delete') deleteTask(id);
  renderTasks(taskListEl);
});`,
            },
            {
              step: 4,
              title: 'Uji Kasus Batas, Tulis README & Push ke GitHub',
              description:
                'Uji input kosong serta muat ulang F5, lengkapi dokumentasi README.md, lalu unggah commit.',
              command:
                'git add . && git commit -m "feat: selesaikan aplikasi taskflow dengan localstorage" && git push',
            },
          ],
        },
      },
      {
        slideNumber: 8,
        isSummary: false,
        layoutType: 'quiz',
        badge: 'Kuis & Pustaka PBL',
        title: 'Kuis Praktik TaskFlow & Referensi Proyek',
        subtitle:
          'Periksa pemahaman teknis seputar Web Storage, sanitasi input, dan delegasi event.',
        contentJson: {
          eyebrow: 'Evaluasi Teknis & Referensi Project-Based Learning',
          highlights: [
            'Pelajari contoh proyek sejenis untuk memperkaya kerapian struktur kode aplikasi.',
          ],
          quizItems: [
            {
              question:
                'Mengapa kita wajib memakai JSON.stringify() dan JSON.parse() pada localStorage?',
              hint: 'Ingat batas tipe data yang diterima oleh Web Storage API.',
              answer:
                'Penyimpanan localStorage hanya menerima nilai bertipe string. JSON.stringify() mengubah array objek menjadi teks JSON saat disimpan, sedangkan JSON.parse() mengembalikannya menjadi array saat dibaca.',
            },
            {
              question:
                'Apa kegunaan pemanggilan .trim() saat memvalidasi input formulir tugas?',
              hint: 'Bayangkan pengguna hanya mengetik beberapa spasi lalu menekan tombol tambah.',
              answer:
                'Metode .trim() membuang spasi berlebih di ujung awal dan akhir teks. Dengan demikian, input berisi spasi kosong berubah menjadi string kosong dan langsung ditolak validasi.',
            },
            {
              question:
                'Mengapa teknik event delegation pada elemen ul lebih efisien daripada memasang listener di tiap tombol?',
              hint: 'Perhatikan apa yang terjadi ketika daftar item terus digambar ulang.',
              answer:
                'Satu listener pada elemen induk ul tetap aktif menangkap klik dari seluruh tombol anak meskipun isi daftar ditambah, dihapus, atau di-render ulang.',
            },
          ],
          references: [
            {
              title: 'Build a Todo List App in JavaScript',
              url: 'https://github.com/dwyl/javascript-todo-list-tutorial',
              author: 'dwyl (Project-Based Learning)',
              category: 'Project-Based Learning',
              lang: 'EN',
              type: 'PBL',
            },
            {
              title: 'Project-Based Learning || HTML & CSS Track',
              url: 'https://github.com/practical-tutorials/project-based-learning#html-and-css',
              author: 'Practical Tutorials',
              category: 'Project-Based Learning',
              lang: 'EN',
              type: 'PBL',
            },
            {
              title: 'Build an HTML Calculator with JS',
              url: 'https://medium.freecodecamp.org/how-to-build-an-html-calculator-app-from-scratch-using-javascript-4454b8714b98',
              author: 'freeCodeCamp (PBL)',
              category: 'DOM & Logic Practice',
              lang: 'EN',
              type: 'PBL',
            },
            {
              title: 'MDN || Web Storage API (localStorage)',
              url: 'https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API',
              author: 'MDN Contributors',
              category: 'Browser Storage',
              lang: 'EN',
              type: 'Docs',
            },
            {
              title: 'Ebook Belajar HTML Dan CSS Dasar',
              url: 'https://www.malasngoding.com/download-ebook-belajar-html-dan-css-dasar-gratis/',
              author: 'Malas Ngoding',
              category: 'HTML & CSS',
              lang: 'ID',
              type: 'Book',
            },
          ],
          weeklyAssignment: {
            week: 4,
            title: 'Weekly Coding Assignment || Minggu 4',
            description:
              'Tambahkan filter status tugas (Semua, Aktif, Selesai) beserta penghitung sisa tugas aktif pada TaskFlow sebelum sesi evaluasi.',
          },
        },
      },
      {
        slideNumber: 9,
        isSummary: false,
        layoutType: 'task',
        badge: 'Task Submission',
        title: 'Pengumpulan TaskFlow & Pembukaan Evaluasi Bulan 1',
        subtitle:
          'Kirim repositori TaskFlow beserta Learning Log untuk memasuki sesi evaluasi Pertemuan 05.',
        contentJson: {
          eyebrow: 'Syarat Pembukaan Pertemuan 05',
          highlights: [
            'Pastikan ketujuh fitur minimum telah diuji mandiri tanpa galat sebelum dikirim.',
          ],
          deliverables: [
            'Tautan repositori GitHub TaskFlow dengan berkas HTML, CSS, JS terpisah dan README.md.',
            'Seluruh fitur tambah, lihat, selesai, hapus, validasi, responsif, dan localStorage berfungsi.',
            'Riwayat commit tercatat bertahap serta Learning Log terisi lengkap.',
          ],
          learningLogFields: STANDARD_LEARNING_LOG_FIELDS,
          mentorTip:
            'Uji aplikasi pada jendela penyamaran peramban untuk memastikan halaman tetap berjalan normal ketika data localStorage masih kosong.',
        },
      },
    ],
  },

  // ============================================================================
  // P05 || PRESENTASI, REVIEW KODE & EVALUASI FUNDAMENTAL BULAN 1
  // ============================================================================
  {
    orderIndex: 5,
    month: 1,
    slug: 'pertemuan-05-presentasi-evaluasi-bulan-1',
    code: 'P06',
    sessionType: 'Presentasi',
    title: 'Presentasi, Review Kode & Evaluasi Fundamental Bulan 1',
    subtitle:
      'Presentasikan TaskFlow dan InternFlow, jelaskan alur kode, serta selesaikan evaluasi Bulan 1.',
    summaryText:
      'Sesi demonstrasi produk, bedah kode langsung, sepuluh kuis konsep dasar, dan audit repositori.',
    taskPrompt:
      'Tuntaskan audit akhir repositori TaskFlow dan InternFlow, kuasai sepuluh konsep dasar, lalu kumpulkan untuk persetujuan lanjut Bulan 2.',
    taskDeliverables: [
      'Repositori InternFlow dan TaskFlow bersih, responsif, serta memiliki README jelas.',
      'Riwayat commit teratur dan seluruh fitur berjalan tanpa galat di konsol.',
      'Kesiapan menjelaskan alur HTML, CSS, DOM, dan localStorage saat evaluasi.',
    ],
    accentGradient: 'from-violet-600 to-purple-500',
    iconName: 'PresentationChart',
    slides: [
      {
        slideNumber: 1,
        isSummary: true,
        layoutType: 'cover',
        badge: 'Bulan 1 • Pertemuan 05',
        title: 'Presentasi, Review Kode & Evaluasi Fundamental Bulan 1',
        subtitle:
          'Buktikan penguasaan fondasi frontend melalui demonstrasi produk dan penjelasan alur kode.',
        contentJson: {
          eyebrow: 'Sesi Evaluasi Akhir Bulan 1 • Gerbang Menuju Backend',
          highlights: [
            'Demonstrasikan langsung fitur InternFlow dan TaskFlow di depan mentor.',
            'Jelaskan struktur HTML semantik, tata letak CSS, serta logika DOM JavaScript.',
            'Jawab sepuluh soal konsep dasar dan selesaikan tantangan ubahan kode singkat.',
            'Tinjau kerapian riwayat Git untuk menentukan kelulusan menuju Bulan 2.',
          ],
          stats: [
            { label: 'Jenis Sesi', value: 'Presentasi' },
            { label: 'Bobot Nilai', value: '40/30/20/10' },
            { label: 'Kuis Konsep', value: '10 Soal Inti' },
            { label: 'Tugas Mingguan', value: 'Minggu 5' },
          ],
        },
      },
      {
        slideNumber: 2,
        isSummary: true,
        layoutType: 'summary',
        badge: 'Executive Summary',
        title: 'Fokus Penilaian Mentor pada Evaluasi Bulan 1',
        subtitle:
          'Pemahaman jujur atas cara kerja kode bernilai lebih tinggi daripada tampilan hasil menyalin.',
        contentJson: {
          eyebrow: 'Transparansi Rubrik Bulan 1',
          highlights: [
            'Sebanyak 40% nilai berasal dari kelancaran fitur wajib saat didemonstrasikan.',
            'Sebanyak 30% nilai berasal dari ketepatan menjawab sepuluh soal konsep dasar.',
            'Sebanyak 20% menilai kejelasan presentasi serta modifikasi kode secara langsung.',
            'Sebanyak 10% menilai kerapian struktur berkas, riwayat commit, dan README.',
          ],
          bentoCards: [
            {
              title: 'Indikator Siap Lanjut',
              tag: 'Lulus Bulan 1',
              description:
                'Peserta memahami alur penambahan data hingga render DOM serta mampu mengubah fitur kecil.',
            },
            {
              title: 'Pendampingan Perbaikan',
              tag: 'Umpan Balik',
              description:
                'Mentor memberikan catatan spesifik bagian kode yang perlu diperkuat sebelum masuk materi server.',
            },
          ],
        },
      },
      {
        slideNumber: 3,
        isSummary: true,
        layoutType: 'bento',
        badge: 'Peta Konsep & Agenda',
        title: 'Alur Sesi Evaluasi: Demo, Bedah Kode, Kuis & Audit Git',
        subtitle:
          'Empat tahapan evaluasi terukur untuk setiap peserta selama sekitar dua puluh menit.',
        contentJson: {
          eyebrow: 'Urutan Pelaksanaan Evaluasi',
          highlights: [
            'Siapkan tab peramban, VS Code, dan GitHub sebelum giliran dimulai.',
          ],
          bentoCards: [
            {
              title: '1. Demo Produk (7 Menit)',
              tag: 'Bobot 40%',
              description:
                'Uji tampilan responsif InternFlow serta siklus CRUD dan muat ulang TaskFlow.',
            },
            {
              title: '2. Bedah Kode (5 Menit)',
              tag: 'Bobot 20%',
              description:
                'Tunjukkan struktur tag semantik, aturan Flexbox/Grid, dan fungsi penyimpanan lokal.',
            },
            {
              title: '3. Kuis & Live Edit (5 Menit)',
              tag: 'Bobot 30%',
              description:
                'Jawab pertanyaan konsep lisan lalu terapkan modifikasi kecil sesuai instruksi mentor.',
            },
            {
              title: '4. Audit Git & Umpan Balik',
              tag: 'Bobot 10%',
              description:
                'Pemeriksaan riwayat commit GitHub, kelengkapan README, dan penyampaian skor evaluasi.',
            },
          ],
        },
      },
      {
        slideNumber: 4,
        isSummary: false,
        layoutType: 'bento',
        badge: 'Struktur Presentasi',
        title: 'Kerangka Empat Langkah Menjelaskan Proyek Secara Runtut',
        subtitle:
          'Mulai penjelasan dari fungsi yang dilihat pengguna lalu telusuri kode penggeraknya.',
        contentJson: {
          eyebrow: 'Komunikasi Teknis Software Engineer',
          highlights: [
            'Penjelasan yang runtut memudahkan rekan tim dan mentor meninjau arsitektur kode.',
          ],
          bentoCards: [
            {
              title: '1. Tujuan & Daftar Fitur',
              tag: '30 Detik',
              description:
                'Sebutkan fungsi utama aplikasi beserta fitur inti yang telah selesai dibangun.',
            },
            {
              title: '2. Struktur HTML & CSS',
              tag: '1 Menit',
              description:
                'Tunjukkan pembagian elemen semantik serta cara Grid dan Flexbox menjaga tata letak.',
            },
            {
              title: '3. Alur Data JavaScript',
              tag: '2 Menit',
              description:
                'Urutkan perjalanan satu tugas dari validasi input, array, localStorage, hingga render DOM.',
            },
            {
              title: '4. Kendala & Solusi',
              tag: '1 Menit',
              description:
                'Ceritakan satu bug nyata yang ditemui beserta cara melacaknya lewat DevTools.',
            },
          ],
        },
      },
      {
        slideNumber: 5,
        isSummary: false,
        layoutType: 'bento',
        badge: 'Simulasi Live Coding',
        title: 'Contoh Tantangan Ubah Kode & Standar README.md',
        subtitle:
          'Latih modifikasi fitur ringkas dan pastikan dokumentasi repositori mudah dipahami pembaca.',
        contentJson: {
          eyebrow: 'Persiapan Bedah Kode & Repositori',
          highlights: [
            'Penulis kode mandiri dapat menuntaskan ubahan kecil dalam beberapa baris.',
          ],
          codeBlocks: [
            {
              title: 'Contoh Tantangan: Penghitung Tugas Aktif & Selesai',
              language: 'javascript',
              filename: 'counter.js',
              snippet: `function updateCounter(tasks, counterEl) {
  const total = tasks.length;
  const done = tasks.filter((t) => t.completed).length;
  const active = total - done;
  counterEl.textContent = \`Selesai: \${done} | Aktif: \${active} | Total: \${total}\`;
}`,
            },
            {
              title: 'Templat Ringkas README.md Evaluasi',
              language: 'markdown',
              filename: 'README.md',
              snippet: `# TaskFlow || Manajemen Tugas Vanilla JS

## Fitur Utama
- Tambah, tandai selesai, dan hapus tugas dengan validasi input
- Penyimpanan persisten di peramban melalui localStorage
- Tata letak responsif untuk layar ponsel dan desktop

## Teknologi
- HTML5 Semantik, CSS3 Flexbox/Grid, dan JavaScript ES6+`,
            },
          ],
        },
      },
      {
        slideNumber: 6,
        isSummary: false,
        layoutType: 'comparison',
        badge: 'Bad vs Good Practice',
        title: 'Presentasi Menghafal Teks vs Memahami Alur Data',
        subtitle:
          'Tunjukkan penguasaan lokasi fungsi dan alur logika saat sesi peninjauan kode.',
        contentJson: {
          eyebrow: 'Sikap Profesional Saat Code Review',
          highlights: [
            'Sampaikan jujur bagian yang belum dipahami untuk dibahas bersama mentor.',
          ],
          comparison: {
            badTitle: '✕ Kurang Siap Saat Peninjauan',
            badPoints: [
              'Bingung mencari letak fungsi tambah atau hapus di berkas sendiri.',
              'Mengeja sintaks kata demi kata tanpa menjelaskan tujuan bisnis fungsinya.',
              'Mengumpulkan repositori tanpa README dengan satu commit bertuliskan final.',
            ],
            badCode: {
              title: 'Riwayat Repositori Minim Informasi',
              language: 'text',
              filename: 'audit-buruk.txt',
              snippet: `Commit history:
- "upload semua" (1 commit sebulan)

README.md: tidak tersedia
Catatan: tidak tahu fungsi JSON.parse pada kode sendiri`,
            },
            goodTitle: '✓ Standar Presentasi Engineer',
            goodPoints: [
              'Menjelaskan hubungan antar-fungsi mulai dari pemicu klik hingga pembaruan DOM.',
              'Mendemonstrasikan tampilan responsif serta ketahanan data saat halaman dimuat ulang.',
              'Menyajikan commit bertahap per fitur dilengkapi berkas README yang rapi.',
            ],
            goodCode: {
              title: 'Riwayat Repositori Terstruktur',
              language: 'text',
              filename: 'audit-baik.txt',
              snippet: `Commit history:
- feat: bangun struktur semantik dan css responsif
- feat: tambah logika crud tugas di dom
- feat: hubungkan penyimpanan localstorage
- docs: lengkapi panduan di readme`,
            },
          },
        },
      },
      {
        slideNumber: 7,
        isSummary: false,
        layoutType: 'practice',
        badge: 'Checklist Sebelum Maju',
        title: 'Langkah Praktik: Audit Mandiri Sebelum Sesi Evaluasi',
        subtitle:
          'Jalankan empat pemeriksaan akhir ini agar demonstrasi berjalan lancar tanpa kendala.',
        contentJson: {
          eyebrow: 'Audit Mandiri Akhir Bulan 1',
          highlights: [
            'Audit mandiri lima belas menit mencegah galat saat demonstrasi berlangsung.',
          ],
          practiceSteps: [
            {
              step: 1,
              title: 'Uji Seluruh Skenario Fitur & Layar Responsif',
              description:
                'Uji input normal, penolakan spasi kosong, hapus tugas, muat ulang halaman, dan ukuran layar 375px.',
            },
            {
              step: 2,
              title: 'Bersihkan Kode Sisa Percobaan',
              description:
                'Hapus komentar usang serta console.log percobaan, lalu periksa perubahan dengan git diff.',
              command: 'git status && git diff',
            },
            {
              step: 3,
              title: 'Finalisasi README.md & Unggah Commit Terakhir',
              description:
                'Pastikan deskripsi fitur dan cara menjalankan aplikasi tertulis jelas di README.md.',
              command:
                'git add . && git commit -m "chore: rapikan kode dan readme evaluasi bulan 1" && git push',
            },
            {
              step: 4,
              title: 'Latih Jawaban Lisan Sepuluh Soal Evaluasi',
              description:
                'Pelajari sepuluh soal pada salindia berikutnya dan latih penjelasannya tanpa membaca catatan.',
            },
          ],
        },
      },
      {
        slideNumber: 8,
        isSummary: false,
        layoutType: 'quiz',
        badge: '10 Soal Evaluasi Resmi',
        title: '10 Pertanyaan Evaluasi Bulan 1 & Pustaka Persiapan Bulan 2',
        subtitle:
          'Kuasai kesepuluh pertanyaan resmi ini sebagai syarat kelulusan menuju materi backend.',
        contentJson: {
          eyebrow: 'Bank Soal Resmi Bulan 1 & Bacaan Awal Bulan 2',
          highlights: [
            'Jawab setiap pertanyaan secara ringkas dan tepat menggunakan bahasa sendiri.',
          ],
          quizItems: [
            {
              question: '1. Apa perbedaan peran HTML, CSS, dan JavaScript?',
              hint: 'Bedakan kerangka konten, tata tampilan, dan logika interaksi.',
              answer:
                'HTML menyusun struktur dan makna konten, CSS mengatur tampilan serta tata letak, sedangkan JavaScript menjalankan logika dan interaksi dinamis.',
            },
            {
              question: '2. Apa fungsi utama penggunaan HTML semantik?',
              hint: 'Bandingkan tag bermakna seperti main dan article terhadap div biasa.',
              answer:
                'HTML semantik memperjelas peran setiap bagian halaman bagi pengembang, mesin pencari (SEO), dan perangkat pembaca layar aksesibilitas.',
            },
            {
              question: '3. Apa yang dimaksud dengan CSS Box Model?',
              hint: 'Sebutkan empat lapisan kotak elemen dari dalam ke luar.',
              answer:
                'CSS Box Model memandang setiap elemen sebagai kotak empat lapis dari dalam ke luar, yaitu Content, Padding, Border, dan Margin.',
            },
            {
              question: '4. Apa perbedaan deklarasi variabel let dan const?',
              hint: 'Periksa boleh tidaknya nilai variabel diisi ulang.',
              answer:
                'Kata kunci const mengunci referensi variabel agar tidak diisi ulang, sedangkan let dipakai untuk variabel yang nilainya berubah.',
            },
            {
              question: '5. Apa pengertian dan manfaat function di JavaScript?',
              hint: 'Pikirkan blok kode bernama yang dapat dipanggil berulang kali.',
              answer:
                'Function adalah blok kode terbungkus untuk menjalankan satu tugas spesifik yang dapat menerima parameter, mengembalikan nilai, dan mencegah duplikasi kode.',
            },
            {
              question: '6. Apa perbedaan struktur data array dan object?',
              hint: 'Bandingkan akses berbasis indeks angka dan nama properti.',
              answer:
                'Array menyimpan daftar nilai berurutan yang diakses memakai indeks angka mulai nol, sedangkan Object menyimpan pasangan kunci-nilai bernama.',
            },
            {
              question: '7. Apa fungsi DOM di dalam peramban web?',
              hint: 'Ingat jembatan antara dokumen HTML dan kode JavaScript.',
              answer:
                'DOM merepresentasikan dokumen HTML sebagai pohon objek sehingga JavaScript dapat membaca, mengubah, menambah, atau menghapus elemen secara dinamis.',
            },
            {
              question: '8. Apa kegunaan metode addEventListener?',
              hint: 'Bagaimana skrip merespons klik tombol atau pengiriman formulir?',
              answer:
                'Metode addEventListener memasang fungsi penangan yang dijalankan otomatis saat suatu peristiwa seperti click atau submit terjadi pada elemen.',
            },
            {
              question: '9. Apa fungsi penyimpanan localStorage?',
              hint: 'Mengapa daftar tugas TaskFlow tidak hilang saat halaman dimuat ulang?',
              answer:
                'Fitur localStorage menyimpan pasangan kunci-nilai bertipe string secara persisten di peramban sehingga data bertahan meski halaman di-refresh.',
            },
            {
              question: '10. Bagaimana peramban menampilkan sebuah halaman situs web?',
              hint: 'Urutkan dari pencarian DNS, HTTP, hingga pembentukan DOM dan render layar.',
              answer:
                'Peramban meminta halaman ke server lewat HTTP, lalu mengurai balasan HTML menjadi DOM dan CSS menjadi CSSOM untuk digambar ke layar sambil menjalankan JavaScript.',
            },
          ],
          references: [
            {
              title: 'Tutorial Node.js untuk Pemula (Persiapan Bulan 2)',
              url: 'https://mfikri.com/artikel/tutorial-nodejs',
              author: 'Mfikri',
              category: 'Node.js & Backend',
              lang: 'ID',
              type: 'Book',
            },
            {
              title: 'Belajar NodeJS Playlist (Persiapan Bulan 2)',
              url: 'https://youtube.com/playlist?list=PLFIM0718LjIW-XBdVOerYgKegBtD6rSfD',
              author: 'Sandhika Galih (Web Programming UNPAS)',
              category: 'Node.js & Backend',
              lang: 'ID',
              type: 'Course',
            },
            {
              title: 'Belajar Git Playlist',
              url: 'https://www.youtube.com/playlist?list=PLuGFxya63u24bmP-ILRaiGeMwZh3PGxW4',
              author: 'Galih Pratama',
              category: 'Git & GitHub',
              lang: 'ID',
              type: 'Course',
            },
            {
              title: 'JavaScript.info || Bahasa Indonesia',
              url: 'https://id.javascript.info/',
              author: 'Ilya Kantor',
              category: 'JavaScript',
              lang: 'ID',
              type: 'Book',
            },
          ],
          weeklyAssignment: {
            week: 5,
            title: 'Weekly Coding Assignment || Minggu 5 (Jembatan Bulan 2)',
            description:
              'Jalankan berkas JavaScript sederhana menggunakan perintah node di terminal dan pelajari fungsi berkas package.json hasil npm init.',
          },
        },
      },
      {
        slideNumber: 9,
        isSummary: false,
        layoutType: 'task',
        badge: 'Evaluasi Akhir Bulan 1',
        title: 'Daftar Kompetensi Bulan 1 & Pengajuan ACC ke Bulan 2',
        subtitle:
          'Pastikan sepuluh kompetensi dasar telah dikuasai lalu kirim pengajuan akhir Bulan 1.',
        contentJson: {
          eyebrow: 'Daftar Periksa Kompetensi Frontend Fundamentals',
          highlights: [
            'Sesudah tugas di-ACC mentor, materi Backend Bulan 2 mulai terbuka.',
          ],
          competencyChecklist: [
            'Memahami struktur dasar dokumen HTML.',
            'Menggunakan elemen HTML5 semantik secara tepat.',
            'Menyusun tata letak halaman menggunakan CSS eksternal.',
            'Menerapkan Flexbox dan CSS Grid sesuai kebutuhan.',
            'Membuat desain responsif untuk ponsel dan desktop.',
            'Memahami variabel serta tipe data JavaScript.',
            'Mengolah data memakai function, array, dan object.',
            'Memanipulasi DOM serta menangani event listener.',
            'Menyimpan data persisten menggunakan localStorage.',
            'Mengelola riwayat kode memakai Git dan GitHub.',
          ],
          deliverables: [
            'Tautan repositori final Bulan 1 (TaskFlow dan InternFlow) beserta README.md.',
            'Tautan GitHub Pages atau tangkapan layar aplikasi pada tampilan ponsel dan desktop.',
            'Learning Log evaluasi Bulan 1 berisi refleksi capaian, kendala, dan kesiapan masuk Bulan 2.',
          ],
          learningLogFields: STANDARD_LEARNING_LOG_FIELDS,
          mentorTip:
            'Tuliskan konsep yang masih terasa samar pada kolom Learning Log agar kita bahas tuntas sebelum mulai membangun REST API di Bulan 2.',
        },
      },
    ],
  },
];
