# Silabus Program Pemahaman Software Engineering

Program Intern / PKL, PT. Digital Teknologi Perkasa. From Zero to Fullstack Web Developer.

## 1. Ringkasan Program

| Komponen | Keterangan |
| --- | --- |
| Durasi | 3 bulan (12 minggu), 15 pertemuan |
| Target peserta | Intern / siswa PKL pemula |
| Metode | Fundamental, demonstrasi, praktik, project, presentasi |
| Teknologi | HTML, CSS, JavaScript, Git/GitHub, Vite, Vue.js, Node.js, TypeScript, Nuxt.js, MySQL (XAMPP), Railway |
| Durasi sesi | 2-3 jam per pertemuan |

## 2. Konsep dan Tujuan Akhir

Program ini sengaja tidak dibuat seperti kelas pemrograman konvensional yang sarat teori. Tujuannya membentuk pemahaman alur kerja seorang software engineer: memahami kebutuhan, merancang solusi, menulis kode, menguji, memperbaiki, sampai deployment.

Di akhir program, peserta mampu membuat aplikasi web dinamis sederhana yang memiliki:

- Tampilan frontend responsif.
- Interaksi menggunakan JavaScript.
- Arsitektur frontend berbasis Vue.js.
- Backend dan REST API menggunakan Nuxt.js (server routes).
- Database MySQL.
- CRUD (Create, Read, Update, Delete).
- Deployment ke server latihan.

## 3. Pembagian 15 Pertemuan

Jadwal awal (2 materi, 1 praktik, 1 presentasi dan evaluasi per bulan) menghasilkan 4 pertemuan per bulan, atau 12 pertemuan selama 3 bulan. Karena target yang diinginkan 15 pertemuan, ditambahkan 1 sesi Project Clinic (mentoring) setiap bulan. Format inti tetap terjaga.

| Jenis sesi | Jumlah |
| --- | --- |
| Materi | 6 |
| Praktik | 3 |
| Project Clinic | 3 |
| Presentasi dan evaluasi | 3 |
| **Total** | **15** (5 pertemuan x 3 bulan) |

## 4. Roadmap 3 Bulan

| Bulan | Tema | Fokus |
| --- | --- | --- |
| 1 | Frontend Fundamentals (Build the Foundation) | HTML, CSS, JavaScript vanila, DOM, Git dan GitHub |
| 2 | Modern Frontend dan Backend Basics (Build the Application) | Vite, Vue.js, Node.js, HTTP, REST API, MySQL dan XAMPP |
| 3 | Fullstack Development (Build the Product) | TypeScript, Nuxt.js, Server API, integrasi MySQL, deployment |

## 5. Silabus 15 Pertemuan

### Bulan 1: Frontend Fundamentals

Target: peserta memahami cara kerja website dan mampu membangun website statis yang interaktif dengan HTML, CSS, dan JavaScript murni.

| # | Materi / Kegiatan | Output | Referensi |
| --- | --- | --- | --- |
| 01 | Basic web dan HTML: cara kerja website, browser, client-server, struktur HTML, semantic HTML, form, link, image. Setup VS Code, Git, Node, XAMPP. | Halaman profil pribadi | Tutorial HTML (Petani Kode) |
| 02 | CSS dan JavaScript fundamental: selector, box model, Flexbox, Grid, responsive; variabel, tipe data, operator, function, condition, loop. | Website responsif sederhana | Tutorial CSS (Petani Kode), Tutorial JavaScript Modern (Ilya Kantor) |
| 03 | Praktik mandiri: website company profile sederhana dengan HTML, CSS, JS dan manipulasi DOM. | Mini project website | Build a Loading Screen, HTML Calculator, Todo List (Project Based Learning) |
| 04 | Project Clinic: review kode, debugging, perbaikan struktur folder, pengenalan Git dan GitHub. | Repository GitHub | Belajar Git untuk Pemula (Petani Kode), Pro Git |
| 05 | Presentasi dan evaluasi: presentasi website, live coding HTML/CSS/JS, tanya jawab fundamental. | Penilaian bulan 1 | - |

Materi yang wajib dipahami:

- Perbedaan HTML, CSS, dan JavaScript.
- Bagaimana browser membaca website.
- Variabel, tipe data, function, array, object.
- DOM manipulation dan event listener.
- Responsive design.
- Dasar Git: commit, push, pull, repository.

Project bulan 1: dashboard statis InternFlow (lihat bagian 6), atau alternatifnya Personal Profile / Company Profile Website.

### Bulan 2: Modern Frontend dan Backend Fundamentals

Target: peserta memahami framework frontend, struktur aplikasi modern, konsep server, database, dan komunikasi API.

| # | Materi / Kegiatan | Output | Referensi |
| --- | --- | --- | --- |
| 06 | Vite dan Vue.js fundamental: Node.js environment, npm, package.json, Vite, Vue SFC, template, reactive state, event, props, components. | Vue dashboard sederhana | Dokumentasi Vue Bahasa Indonesia, Belajar Vue.js (Varian Hermianto) |
| 07 | Node.js dan database fundamental: runtime Node.js, module, async/await, HTTP, REST API, SQL, tabel, relasi, CRUD, XAMPP/phpMyAdmin. | Database dan pemahaman API | Tutorial Node.js (Mfikri), Belajar Node.js, Tutorial MySQL Pemula hingga Mahir |
| 08 | Praktik mandiri: aplikasi manajemen data sederhana dengan Vue.js dan backend latihan Node.js/MySQL (Express minimal hanya sebagai alat bantu). | Aplikasi CRUD | Vue.js To-Do List Tutorial (video) |
| 09 | Project Clinic: debugging, integrasi frontend-backend, API testing dengan Postman, Git workflow, review database. | CRUD terintegrasi | - |
| 10 | Presentasi dan evaluasi: demo aplikasi, alur request-response, query SQL, proses CRUD. | Penilaian bulan 2 | - |

Materi yang wajib dipahami:

- Perbedaan library, framework, dan build tool.
- Fungsi Vite dan alasan memakai Vue.js.
- Component, props, state/reactivity, lifecycle dasar.
- Apa itu Node.js dan npm.
- Cara kerja HTTP request dan response.
- REST API: GET, POST, PUT/PATCH, DELETE.
- Database, tabel, primary key, foreign key.
- SQL: SELECT, INSERT, UPDATE, DELETE, JOIN.
- Koneksi aplikasi dengan MySQL lokal melalui XAMPP.

Project bulan 2: migrasi InternFlow ke Vue.js dengan CRUD ke database, atau alternatifnya Student / Employee Management System.

### Bulan 3: Fullstack Development dan Deployment

Target: peserta mampu membuat aplikasi web dinamis berbasis fullstack JavaScript, memahami pembuatan API dengan TypeScript, dan menghubungkannya dengan MySQL.

| # | Materi / Kegiatan | Output | Referensi |
| --- | --- | --- | --- |
| 11 | TypeScript fundamental: type annotation, primitive types, array, object, interface, type, function, optional properties, async/Promise, typing API. | Latihan TypeScript | TypeScript untuk Pemula (Tutsplus), dokumentasi resmi TypeScript |
| 12 | Nuxt.js fullstack dan server API: struktur Nuxt, pages, layouts, components, composables, server/api, HTTP methods, validasi, runtime config, koneksi MySQL. | API Nuxt dan frontend | Dokumentasi resmi Nuxt |
| 13 | Praktik capstone: aplikasi fullstack dengan CRUD, relasi database, dashboard dan API. Autentikasi dasar sebagai target tambahan (stretch goal). | Aplikasi fullstack | - |
| 14 | Project Clinic dan deployment: testing API, debugging, GitHub, environment variables, deployment aplikasi dan database latihan ke Railway. | Aplikasi online | Dokumentasi Railway |
| 15 | Final presentation dan evaluasi: demo, presentasi arsitektur, live coding kecil (1 endpoint + 1 halaman), evaluasi pemahaman. | Final project | - |

Materi yang wajib dipahami:

- Perbedaan JavaScript dan TypeScript.
- Type safety dan interface.
- Konsep fullstack framework.
- Struktur project Nuxt.js.
- Server routes dan API handlers.
- Integrasi frontend dengan server API.
- Koneksi Nuxt dengan MySQL.
- Environment variables dan keamanan konfigurasi.
- Deployment dan pengenalan production environment.

Project bulan 3: InternFlow fullstack (Nuxt.js + TypeScript + MySQL), online di Railway.

## 6. Project Utama: InternFlow (Intern Management System)

Agar peserta tidak mengerjakan project yang berbeda-beda, gunakan satu project utama yang dikembangkan bertahap selama 3 bulan: aplikasi manajemen intern dan aktivitas kerja perusahaan.

Fitur yang dikembangkan bertahap:

- Dashboard ringkasan aktivitas.
- Data peserta intern.
- Manajemen tugas dan status pengerjaan.
- Catatan evaluasi mentor.
- Database pengguna dan aktivitas.
- REST API untuk pengelolaan data.
- Login dan autentikasi dasar (target tambahan).

| Bulan | Target project |
| --- | --- |
| 1 | Dashboard statis dengan HTML, CSS, JS |
| 2 | Migrasi tampilan ke Vue.js dan CRUD dengan database |
| 3 | Aplikasi fullstack dengan Nuxt.js, TypeScript dan MySQL, di-deploy |

Dengan cara ini peserta melihat bagaimana website sederhana berkembang menjadi aplikasi yang sesungguhnya.

## 7. Teknologi dan Tools

| Teknologi | Fungsi |
| --- | --- |
| VS Code | Code editor |
| HTML5, CSS3 | Struktur dan styling, responsive |
| JavaScript | Logika aplikasi |
| Git dan GitHub | Version control |
| Node.js dan npm | Runtime JavaScript dan package manager |
| Vite | Build tool dan development server frontend |
| Vue.js 3 | Frontend framework |
| XAMPP | MySQL/MariaDB lokal dan phpMyAdmin |
| Postman | API testing |
| TypeScript | Static typing |
| Nuxt.js | Fullstack framework |
| Railway | Deployment latihan |

Catatan arsitektur yang perlu dijelaskan kepada intern:

1. Vite bukan framework frontend, melainkan build tool dan development server.
2. Vue.js adalah framework frontend.
3. Node.js adalah runtime JavaScript di luar browser.
4. Nuxt.js memakai Vue.js dan Nitro sebagai server engine untuk server routes/API.
5. MySQL adalah relational database; XAMPP adalah paket server lokal yang menyediakan MariaDB atau MySQL tergantung distribusinya.
6. Railway hanya lingkungan deployment latihan.

Express.js tidak perlu diajarkan mendalam. Cukup pahami konsep Node.js dan cara kerja backend, lalu praktikkan API dengan Nuxt.js agar jumlah framework dalam tiga bulan tidak berlebihan.

Catatan Railway: tidak ada jaminan gratis permanen. Berdasarkan informasi harga yang dicek pada November 2026, akun baru mendapat kredit percobaan sekali pakai (sekitar 5 dolar AS, 30 hari), lalu turun ke paket Free dengan kredit sekitar 1 dolar AS per bulan; paket Hobby sekitar 5 dolar AS per bulan. Kebijakan dapat berubah, jadi cek halaman harga resmi sebelum program dimulai.

Saran praktis Railway: deploy baru pada pertemuan 14; gunakan satu akun atau satu project bersama; siapkan cadangan ekspor .sql dari XAMPP agar praktik tidak terhenti jika kredit habis.

## 8. Pola Pelaksanaan Setiap Pertemuan

| Jenis pertemuan | Aktivitas |
| --- | --- |
| Materi | Penjelasan konsep, live coding, demonstrasi lanjutan |
| Praktik | Peserta mengerjakan project secara mandiri |
| Project Clinic | Review kode, mentoring, debugging |
| Presentasi | Demo hasil, tanya jawab, evaluasi |

Komposisi sesi materi: 30% penjelasan konsep, 50% demonstrasi coding, 20% latihan singkat. Pada sesi praktik, peserta wajib menulis kode sendiri, bukan hanya mengikuti instruktur.

## 9. Sistem Evaluasi

Evaluasi tidak hanya menilai hasil website, tetapi juga kemampuan peserta menjelaskan kode yang mereka tulis.

| Komponen penilaian | Bobot |
| --- | --- |
| Pemahaman fundamental (kuis konsep) | 20% |
| Kemampuan praktik / coding | 30% |
| Kualitas project (termasuk kerapian Git) | 25% |
| Pemahaman alur sistem | 15% |
| Presentasi dan komunikasi | 10% |

Standar kelulusan akhir:

| Level | Kompetensi |
| --- | --- |
| Beginner | Mampu membuat website statis dan memahami HTML, CSS, JS |
| Intermediate | Mampu membuat aplikasi Vue.js dan melakukan CRUD |
| Advanced Beginner | Mampu membuat aplikasi fullstack sederhana dengan Nuxt.js, TypeScript dan MySQL |

Istilah Advanced Beginner dipakai dengan sengaja, bukan junior fullstack developer. Aplikasi siap komersial masih membutuhkan pemahaman lanjutan tentang keamanan, testing, arsitektur, scalability, dan maintenance.

## 10. Referensi Pembelajaran

Kedua repository berikut adalah katalog sumber belajar, bukan kurikulum yang harus diselesaikan seluruhnya.

**A. Free Programming Books (Bahasa Indonesia)** - EbookFoundation/free-programming-books, berkas books/free-programming-books-id.md

| Topik | Referensi |
| --- | --- |
| HTML dan CSS | Tutorial HTML dan CSS untuk Pemula (Petani Kode) |
| JavaScript | Tutorial JavaScript Modern (Ilya Kantor), javascript.info versi Indonesia |
| Git | Belajar Git untuk Pemula (Petani Kode), Pro Git |
| Vue.js | Belajar Vue.js (Varian Hermianto), Dokumentasi Vue Bahasa Indonesia |
| TypeScript | TypeScript untuk Pemula, Bagian 1 (Tutsplus) |
| MySQL | Tutorial MySQL untuk Pemula Hingga Mahir |
| Node.js | Belajar Node.js, Tutorial Node.js (Mfikri), Node.js Handbook |

**B. Project Based Learning** - practical-tutorials/project-based-learning

| Topik | Ide project |
| --- | --- |
| HTML dan CSS | Build a Loading Screen |
| HTML, CSS dan JS | HTML Calculator |
| JavaScript | Todo List App, Weather App (Vanilla JS), JavaScript30 |
| Vue.js | Vue.js To-Do List Tutorial, simple budgeting app |
| Fullstack | Full Stack Web Application (MEVN) sebagai bahan pembanding |

Kedua repository tidak memuat materi Nuxt.js dan hanya satu artikel TypeScript. Untuk pertemuan 11-14, tambahkan dokumentasi resmi Nuxt, TypeScript, dan Railway sebagai pendamping.

## 11. Catatan Kepadatan Materi dan Mitigasi

Beberapa pertemuan sangat padat bagi pemula, yaitu pertemuan 02 (CSS sekaligus JavaScript), 07 (Node.js sekaligus database), dan 12 (Nuxt sekaligus server API dan MySQL). Pertemuan 13 juga ambisius jika autentikasi diwajibkan. Mitigasi yang disarankan:

- Bagikan bahan bacaan atau video singkat sebelum sesi (flipped learning).
- Beri satu tugas mingguan ringan di luar jadwal formal.
- Jadikan pertemuan Project Clinic sebagai ruang mengejar ketertinggalan.
- Tetapkan autentikasi sebagai target tambahan, bukan syarat kelulusan.
- Jika perlu, geser sebagian materi ke pertemuan Project Clinic bulan berikutnya.

## 12. Target Kompetensi Setelah 3 Bulan

Setelah menyelesaikan program, intern diharapkan dapat:

1. Memahami fundamental pemrograman web dan cara kerja client-server.
2. Membangun website responsive dengan HTML, CSS dan JavaScript.
3. Menggunakan Git dan GitHub untuk mengelola source code.
4. Mengembangkan frontend modern dengan Vue.js dan Vite.
5. Memahami backend, HTTP, REST API dan Node.js.
6. Membuat database relasional dengan MySQL.
7. Memahami TypeScript dan menerapkannya dalam pembuatan API.
8. Membangun aplikasi fullstack dengan Nuxt.js.
9. Mengintegrasikan frontend, backend, dan database.
10. Melakukan deployment aplikasi ke server latihan.

Final outcome: mampu membangun dan menjelaskan sebuah aplikasi web fullstack dari nol sampai online.

## 13. Pengembangan Program Internal

15 pertemuan sebaiknya bukan satu-satunya waktu belajar. Di luar jadwal, berikan weekly coding assignment ringan yang dikerjakan selama aktivitas PKL. Dengan begitu pertemuan menjadi mentoring terstruktur, sementara kemampuan coding tumbuh lewat latihan rutin.

Setiap peserta sebaiknya memiliki:

- Repository GitHub pribadi.
- Catatan pembelajaran (learning log).
- Daftar tugas mingguan.
- Dokumentasi project.
- Riwayat evaluasi mentor.

Tahap lanjutan: silabus ini dapat dijadikan dokumen resmi Software Engineering Internship Program (3 bulan), lengkap dengan RPP tiap pertemuan, modul mentor, tugas mingguan, rubrik penilaian, dan checklist kompetensi peserta.
