# SOFTWARE ENGINEERING INTERNSHIP PROGRAM
## Program Pemahaman Software Engineering — 3 Bulan

**Penyelenggara:** Digital Teknologi Perkasa  
**Peserta:** Intern / Siswa Praktik Kerja Lapangan (PKL)  
**Durasi:** 3 bulan  
**Total pertemuan formal:** 15 pertemuan (1 pertemuan = 1 hari)  
**Fokus:** Fundamental web development hingga membangun aplikasi fullstack sederhana berbasis database.

---

## 1. Ringkasan Program


Program ini dirancang untuk membimbing peserta pemula memahami proses pengembangan perangkat lunak secara bertahap. Peserta memulai dari fundamental front-end menggunakan HTML, CSS, dan JavaScript Vanilla, kemudian mempelajari backend, REST API, dan database MySQL, lalu mengembangkan aplikasi menggunakan Vite, Vue.js, TypeScript, dan Nuxt.js.

Program menekankan praktik langsung. Setiap pertemuan menggunakan pendekatan sekitar **30% penjelasan konsep dan 70% praktik/demonstrasi**. Di luar 15 pertemuan formal, peserta dianjurkan mengerjakan latihan mandiri mingguan.

### Tujuan umum

Pada akhir program, peserta diharapkan mampu:

1. Menjelaskan cara kerja dasar web: browser, client-server, HTTP, request, dan response.
2. Membuat halaman web responsif menggunakan HTML dan CSS.
3. Membuat interaksi antarmuka menggunakan JavaScript Vanilla dan DOM.
4. Menggunakan Git dan GitHub untuk mengelola source code.
5. Memahami Node.js, npm, modul, dan dasar backend.
6. Membuat REST API dengan operasi CRUD.
7. Mendesain database relasional sederhana menggunakan MySQL.
8. Menghubungkan aplikasi dengan MySQL.
9. Mengembangkan frontend menggunakan Vite dan Vue.js 3.
10. Memahami dan menerapkan TypeScript dasar.
11. Membuat server API menggunakan Nuxt.js.
12. Mengintegrasikan frontend, API, dan database menjadi aplikasi fullstack sederhana.
13. Melakukan pengujian dan deployment aplikasi ke lingkungan latihan.

### Batasan capaian

Target program adalah **Mini Fullstack Web App / Mini SaaS untuk pembelajaran**, bukan aplikasi SaaS siap produksi. Autentikasi, otorisasi, keamanan, backup, observability, skalabilitas, dan pengelolaan data produksi membutuhkan pembelajaran lanjutan.

---

## 2. Asumsi dan Struktur 15 Pertemuan

Pola inti yang diinginkan adalah empat pertemuan per bulan: dua sesi materi, satu praktik, dan satu presentasi/evaluasi. Pola tersebut menghasilkan 12 pertemuan dalam tiga bulan. Agar total menjadi 15 tanpa mengubah pola inti, ditambahkan tiga sesi pendukung:

- **Bulan 1:** Kickoff dan setup lingkungan kerja.
- **Bulan 2:** Buffer/remedial dan debugging.
- **Bulan 3:** Evaluasi akhir dan penutupan.

Dengan demikian, setiap bulan memiliki lima pertemuan.

| Bulan | Fokus | Pertemuan | Komposisi |
|---|---|---:|---|
| 1 | Fondasi Front-End | 1–5 | Kickoff, 2 materi, praktik, presentasi |
| 2 | Back-End dan Database | 6–10 | 2 materi, praktik, buffer/remedial, presentasi |
| 3 | Modern Front-End dan Fullstack | 11–15 | 2 materi, praktik, presentasi, evaluasi akhir |
| **Total** | | **15** | |

### Format pelaksanaan

- Satu pertemuan berlangsung sekitar 2–3 jam.
- Sesi materi: sekitar 30% konsep, 70% demonstrasi dan latihan langsung.
- Sesi praktik: peserta mengerjakan target project secara mandiri atau berpasangan.
- Project clinic/buffer: mentor membantu debugging, code review, dan peserta yang tertinggal.
- Presentasi: peserta melakukan demo, menjelaskan kode, dan menjawab pertanyaan.
- Peserta menyimpan pekerjaan di repository GitHub sejak awal program.

---

## 3. Peta Jalan Pembelajaran

| Tahap | Kompetensi utama | Teknologi | Hasil |
|---|---|---|---|
| Bulan 1 — Foundation | Struktur web, styling, logika JavaScript, DOM, Git | HTML, CSS, JavaScript Vanilla, Git, GitHub | Halaman profil dan To-Do List |
| Bulan 2 — Backend | Runtime server, REST API, SQL, CRUD, koneksi database | Node.js, Express.js, MySQL, XAMPP, Postman | REST API To-Do terhubung database |
| Bulan 3 — Fullstack | Tooling modern, komponen UI, typing, server API, integrasi | Vite, Vue 3, TypeScript, Nuxt.js, MySQL | Aplikasi fullstack CRUD online |

### Alur perkembangan project

Peserta mengembangkan **satu project yang sama secara bertahap**, bukan membuat project baru dari nol setiap bulan.

**Project pembelajaran: TaskFlow — To-Do / Task Management App**

1. Bulan 1: membuat antarmuka To-Do List menggunakan HTML, CSS, dan JavaScript Vanilla.
2. Bulan 2: membuat REST API dengan Node.js dan Express.js, menyimpan task di MySQL, lalu menghubungkan frontend bulan pertama ke API.
3. Bulan 3: membangun ulang frontend menggunakan Vue.js dan Vite, kemudian mengembangkan versi fullstack menggunakan Nuxt.js, TypeScript, dan MySQL.

Pendekatan ini membantu peserta memahami bahwa teknologi dan arsitektur aplikasi dapat berkembang, sementara kebutuhan produk tetap sama.

---

# 4. Silabus Detail 15 Pertemuan

## BULAN 1 — FRONT-END FUNDAMENTALS

**Tema:** Memahami cara kerja web dan membangun antarmuka interaktif menggunakan HTML, CSS, dan JavaScript Vanilla.

**Project bulan ini:** Halaman Profil + To-Do List.

**Target akhir bulan:** Peserta mampu membuat website responsif dan To-Do List sederhana yang dapat menambah, menghapus, serta menandai tugas selesai.

### Pertemuan 1 — Kickoff, Web Overview, dan Setup Development Environment

**Jenis:** Kickoff

**Materi:**
- Pengenalan program, target belajar, aturan kerja, dan metode evaluasi.
- Gambaran profesi dan proses kerja software engineer.
- Cara kerja web: browser, client, server, domain, hosting, dan HTTP.
- Perbedaan frontend, backend, dan database.
- Pengenalan code editor dan terminal.
- Instalasi/pengecekan VS Code, Git, Node.js, dan XAMPP.
- Membuat akun atau memastikan akses GitHub.
- Membuat repository pertama dan melakukan commit serta push.

**Praktik:**
- Membuat folder workspace.
- Membuat repository GitHub.
- Menulis file HTML pertama.
- Melakukan `git add`, `git commit`, dan `git push`.

**Output:**
- Lingkungan kerja siap digunakan.
- Repository GitHub pertama.
- Peserta mampu mengunggah perubahan sederhana ke GitHub.

**Referensi:**
- [Belajar Git untuk Pemula — Petani Kode](https://www.petanikode.com/tutorial/git/)
- [GitHub Skills](https://skills.github.com/)
- [MDN — How the Web Works](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works)

### Pertemuan 2 — HTML Semantik dan CSS Fundamental

**Jenis:** Materi 1

**Materi HTML:**
- Struktur dokumen HTML.
- Tag, element, attribute, heading, paragraph, link, image, dan list.
- Semantic HTML: `header`, `nav`, `main`, `section`, `article`, dan `footer`.
- Form dan input dasar.

**Materi CSS:**
- Cara menghubungkan CSS ke HTML.
- Selector, property, dan value.
- Color, typography, margin, padding, dan border.
- Box model.
- Display dan positioning dasar.
- Flexbox dan CSS Grid.
- Responsive design dan media query.

**Praktik:**
- Membuat halaman profil pribadi.
- Membuat layout navigasi, konten utama, dan footer.
- Membuat halaman dapat digunakan di layar desktop dan mobile.

**Output:**
- Halaman profil responsif.

**Referensi:**
- [Petani Kode — Tutorial HTML](https://www.petanikode.com/tutorial/html/)
- [Petani Kode — Tutorial CSS](https://www.petanikode.com/tutorial/css/)
- [MDN — HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)
- [MDN — CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)

### Pertemuan 3 — JavaScript Vanilla dan DOM Manipulation

**Jenis:** Materi 2

**Materi:**
- Peran JavaScript pada website.
- `let`, `const`, dan variabel.
- Tipe data: string, number, boolean, null, dan undefined.
- Operator dan perbandingan.
- Percabangan: `if`, `else`, dan `switch`.
- Perulangan: `for` dan `while`.
- Function dan parameter.
- Array dan object.
- Array methods dasar: `map`, `filter`, dan `find`.
- DOM selection dan manipulation.
- Event listener dan event handling.
- JSON dan pengenalan `fetch`.
- Pengenalan asynchronous JavaScript: Promise dan `async/await`.

**Praktik:**
- Mengambil elemen HTML melalui JavaScript.
- Mengubah teks dan class elemen.
- Menangani klik tombol dan input form.
- Membuat interaksi sederhana dengan DOM.

**Output:**
- Halaman profil dengan interaksi JavaScript.
- Peserta memahami hubungan HTML, CSS, dan JavaScript.

**Referensi:**
- [JavaScript.info — Bahasa Indonesia](https://id.javascript.info/)
- [MDN — JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [MDN — DOM Introduction](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction)

### Pertemuan 4 — Praktik Project To-Do List

**Jenis:** Praktik

**Project:** To-Do List menggunakan HTML, CSS, dan JavaScript Vanilla.

**Fitur minimum:**
- Menambahkan task.
- Menampilkan daftar task.
- Menghapus task.
- Menandai task selesai.
- Validasi input kosong.
- Tampilan responsif.
- Menyimpan data menggunakan `localStorage` sebagai pengenalan penyimpanan data di browser.

**Ketentuan praktik:**
- Struktur HTML menggunakan elemen semantik.
- CSS dipisahkan ke file tersendiri.
- JavaScript dipisahkan ke file tersendiri.
- Kode diberi nama variabel dan fungsi yang jelas.
- Peserta melakukan commit ke GitHub.

**Output:**
- To-Do List berjalan di browser.
- Repository project bulan pertama.

**Referensi project:**
- [Project Based Learning — HTML & CSS](https://github.com/practical-tutorials/project-based-learning#html-and-css)
- [MDN — Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)

### Pertemuan 5 — Presentasi dan Evaluasi Bulan 1

**Jenis:** Presentasi dan evaluasi

**Aktivitas:**
- Demo halaman profil dan To-Do List.
- Menjelaskan struktur HTML dan CSS.
- Menjelaskan alur JavaScript dan DOM.
- Menunjukkan fungsi tambah, hapus, dan selesai.
- Menjelaskan penggunaan `localStorage`.
- Tanya jawab dan kuis fundamental.
- Review repository dan histori commit.

**Pertanyaan evaluasi contoh:**
1. Apa perbedaan HTML, CSS, dan JavaScript?
2. Apa fungsi semantic HTML?
3. Apa yang dimaksud dengan CSS box model?
4. Apa perbedaan `let` dan `const`?
5. Apa itu function?
6. Apa perbedaan array dan object?
7. Apa fungsi DOM?
8. Apa kegunaan `addEventListener`?
9. Apa fungsi `localStorage`?
10. Bagaimana browser menampilkan halaman website?

**Output:**
- Nilai bulan pertama.
- Catatan kekuatan dan hal yang perlu diperbaiki.
- Daftar materi remedial jika diperlukan.

---

## BULAN 2 — BACK-END, REST API, DAN DATABASE

**Tema:** Memahami cara kerja backend, membuat REST API, dan menyimpan data aplikasi ke MySQL.

**Project bulan ini:** REST API untuk TaskFlow / To-Do List.

**Target akhir bulan:** Peserta mampu membuat API CRUD dengan Express.js, menghubungkannya ke MySQL, dan membuat frontend bulan pertama mengambil data dari API.

### Pertemuan 6 — Node.js, npm, Express.js, dan REST API

**Jenis:** Materi 1

**Materi Node.js:**
- Perbedaan JavaScript browser dan Node.js.
- Pengertian runtime.
- Pengenalan terminal dan menjalankan file JavaScript dengan Node.js.
- npm dan `package.json`.
- Instalasi package.
- Module: `import` dan `export`.
- Environment variable dan pengenalan `.env`.

**Materi backend dan API:**
- Pengertian backend dan server.
- HTTP request dan response.
- Method HTTP: GET, POST, PUT, PATCH, DELETE.
- Status code dasar: 200, 201, 400, 401, 404, dan 500.
- JSON.
- REST API dan endpoint.
- Pengenalan Express.js.
- Routing dan middleware dasar.
- Pengujian endpoint menggunakan Postman.

**Praktik:**
- Membuat project Node.js.
- Menginstal Express.js.
- Membuat server sederhana.
- Membuat endpoint GET dan POST dengan data sementara (in-memory).
- Menguji endpoint menggunakan Postman.

**Output:**
- Server Express berjalan lokal.
- API sederhana dengan data sementara.

**Referensi:**
- [Node.js Documentation](https://nodejs.org/en/learn)
- [Express.js Getting Started](https://expressjs.com/en/starter/installing.html)
- [MDN — HTTP Overview](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview)
- [Postman Learning Center](https://learning.postman.com/)

### Pertemuan 7 — MySQL, SQL, dan Koneksi Database

**Jenis:** Materi 2

**Materi database:**
- Pengertian database dan relational database.
- Database, table, row, dan column.
- Data type dasar MySQL.
- Primary key dan foreign key.
- Relasi one-to-one, one-to-many, dan pengenalan many-to-many.
- Pengenalan normalisasi database.
- Membuat database menggunakan XAMPP dan phpMyAdmin.

**Materi SQL:**
- `CREATE DATABASE` dan `CREATE TABLE`.
- `INSERT`.
- `SELECT`.
- `UPDATE`.
- `DELETE`.
- `WHERE`, `ORDER BY`, dan `LIMIT`.
- `JOIN` dasar.
- Pengenalan index.

**Koneksi backend:**
- Menghubungkan Node.js ke MySQL menggunakan package `mysql2`.
- Connection pool secara pengenalan.
- Menjalankan query dari backend.
- Menggunakan placeholder/parameterized query.
- Menyimpan konfigurasi database di `.env`.

**Praktik:**
- Menyalakan MySQL melalui XAMPP.
- Membuat database `taskflow`.
- Membuat tabel `tasks`.
- Mengisi dan membaca data melalui phpMyAdmin.
- Menghubungkan project Node.js ke MySQL.

**Output:**
- Database lokal.
- Tabel task.
- Backend berhasil membaca data dari MySQL.

**Referensi:**
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [W3Schools — SQL Tutorial](https://www.w3schools.com/sql/)
- [phpMyAdmin Documentation](https://docs.phpmyadmin.net/)
- [mysql2 — Node.js MySQL Client](https://sidorares.github.io/node-mysql2/)
- [XAMPP](https://www.apachefriends.org/)

### Pertemuan 8 — Praktik REST API CRUD dengan Express dan MySQL

**Jenis:** Praktik

**Project:** Mengembangkan backend TaskFlow.

**Fitur minimum API:**
- `GET /api/tasks` — mengambil seluruh task.
- `GET /api/tasks/:id` — mengambil satu task.
- `POST /api/tasks` — menambahkan task.
- `PUT /api/tasks/:id` — memperbarui task.
- `DELETE /api/tasks/:id` — menghapus task.

**Ketentuan teknis:**
- Menggunakan Express.js.
- Menggunakan MySQL lokal dari XAMPP.
- Menggunakan `mysql2`.
- Menggunakan parameterized query.
- Mengembalikan response JSON.
- Menggunakan status code yang sesuai.
- Melakukan validasi input sederhana.
- Menangani error dasar.
- Menguji semua endpoint menggunakan Postman.
- Menghubungkan frontend To-Do List bulan pertama ke API.

**Output:**
- API CRUD berfungsi.
- Frontend dapat mengambil dan mengubah data melalui API.
- Dokumentasi endpoint sederhana.

**Referensi:**
- [Express.js API Reference](https://expressjs.com/en/4x/api.html)
- [Postman Learning Center](https://learning.postman.com/)
- [Project Based Learning](https://github.com/practical-tutorials/project-based-learning)

### Pertemuan 9 — Buffer, Remedial, dan Debugging

**Jenis:** Buffer / remedial

**Aktivitas:**
- Memeriksa project peserta satu per satu.
- Memperbaiki error koneksi database.
- Memperbaiki endpoint yang belum berjalan.
- Memeriksa request dan response API.
- Memeriksa validasi dan error handling.
- Code review struktur folder.
- Mengulang konsep yang belum dipahami.
- Pengenalan deployment API ke Railway jika project sudah siap.

**Output:**
- Project bulan kedua mencapai fitur minimum.
- Catatan hasil mentoring.
- Project siap dipresentasikan.

**Catatan deployment:**
- Deployment Railway bersifat latihan dan mengikuti ketersediaan kredit/kuota.
- Siapkan alternatif demonstrasi lokal jika layanan deployment tidak tersedia.
- Jangan menaruh credential database di source code atau repository publik.

### Pertemuan 10 — Presentasi dan Evaluasi Bulan 2

**Jenis:** Presentasi dan evaluasi

**Aktivitas:**
- Demo API menggunakan Postman.
- Demo frontend yang mengambil data dari API.
- Menjelaskan alur request hingga database.
- Menjelaskan fungsi setiap HTTP method.
- Menjelaskan query SQL yang digunakan.
- Menunjukkan histori commit GitHub.
- Kuis dan tanya jawab.

**Pertanyaan evaluasi contoh:**
1. Apa fungsi Node.js?
2. Apa perbedaan frontend dan backend?
3. Apa itu REST API?
4. Apa perbedaan GET dan POST?
5. Apa fungsi status code HTTP?
6. Apa perbedaan database dan tabel?
7. Apa fungsi primary key dan foreign key?
8. Apa perbedaan SELECT, INSERT, UPDATE, dan DELETE?
9. Mengapa query database perlu menggunakan parameter?
10. Bagaimana frontend mengambil data dari backend?

**Output:**
- Nilai bulan kedua.
- API CRUD dan database yang dapat didemonstrasikan.
- Catatan kompetensi yang perlu ditingkatkan.

---

## BULAN 3 — VITE, VUE.JS, TYPESCRIPT, DAN NUXT.JS

**Tema:** Mengembangkan aplikasi modern dengan Vue.js, memahami TypeScript, dan membangun aplikasi fullstack menggunakan Nuxt.js.

**Project bulan ini:** TaskFlow Fullstack Application.

**Target akhir bulan:** Peserta mampu membuat aplikasi CRUD fullstack menggunakan Nuxt.js, TypeScript, dan MySQL serta memahami proses deployment dasar.

### Pertemuan 11 — Vite dan Vue.js 3 Fundamental

**Jenis:** Materi 1

**Materi Vite:**
- Mengapa menggunakan build tool.
- Fungsi Vite.
- Development server.
- Hot Module Replacement (HMR).
- Struktur project.
- `package.json` dan npm scripts.
- Development dan production build.

**Materi Vue.js:**
- Pengenalan Vue.js dan Single File Component.
- Struktur `.vue`.
- `<script setup>`.
- Template syntax.
- Reactivity dengan `ref`.
- Event handling dengan `@click`.
- Conditional rendering: `v-if` dan `v-show`.
- List rendering: `v-for`.
- Form binding: `v-model`.
- Components.
- Props dan emit.
- Pengenalan composables.
- Pengenalan Vue Router jika waktu mencukupi.

**Praktik:**
- Membuat project Vue menggunakan Vite.
- Membuat komponen daftar task.
- Membuat form tambah task.
- Menampilkan data dari API bulan kedua.
- Mengubah status dan menghapus task melalui API.

**Output:**
- Frontend TaskFlow versi Vue.js.
- Peserta memahami component-based development.

**Referensi:**
- [Vite Guide](https://vite.dev/guide/)
- [Vue.js Documentation](https://vuejs.org/guide/introduction.html)
- [Vue.js — Tutorial](https://vuejs.org/tutorial/)
- [Vue Router](https://router.vuejs.org/)

### Pertemuan 12 — TypeScript Fundamental dan Nuxt.js Server API

**Jenis:** Materi 2

**Bagian A — TypeScript Fundamental**

- Mengapa TypeScript digunakan.
- Perbedaan JavaScript dan TypeScript.
- Type annotation.
- Primitive types.
- Array dan object typing.
- `type` dan `interface`.
- Optional properties.
- Function typing.
- Union types secara pengenalan.
- Typing request dan response.
- Pengenalan type inference.
- Pengenalan `Promise` dan `async/await` dengan tipe.

**Bagian B — Nuxt.js Fundamental**

- Pengertian Nuxt.js dan hubungannya dengan Vue.js.
- Struktur folder Nuxt.
- File-based routing.
- Pages dan layouts.
- Components dan composables.
- `useFetch` dan pengambilan data.
- Folder `server/api`.
- Server routes dan HTTP method.
- Mengembalikan response JSON.
- Runtime config dan environment variable.
- Pengenalan Nitro server engine.

**Praktik:**
- Membuat type/interface untuk data task.
- Membuat project Nuxt.
- Membuat satu halaman daftar task.
- Membuat satu endpoint API di `server/api`.
- Menguji endpoint dari browser atau Postman.

**Output:**
- Project Nuxt dasar.
- Endpoint API dengan TypeScript.
- Peserta memahami hubungan frontend dan server API dalam Nuxt.

**Referensi:**
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Nuxt Documentation](https://nuxt.com/docs)
- [Nuxt — Server Directory](https://nuxt.com/docs/guide/directory-structure/server)
- [Nuxt — Data Fetching](https://nuxt.com/docs/getting-started/data-fetching)

### Pertemuan 13 — Praktik Capstone: Fullstack Nuxt + MySQL

**Jenis:** Praktik

**Project:** TaskFlow Fullstack Application.

**Target fitur minimum:**
- Halaman dashboard sederhana.
- Menampilkan daftar task.
- Menambahkan task.
- Mengedit task.
- Menghapus task.
- Menandai task selesai.
- Menyimpan data di MySQL.
- Mengambil dan mengubah data melalui Nuxt Server API.
- Validasi input sederhana.
- Error handling dasar.

**Ketentuan teknis:**
- Menggunakan Nuxt.js.
- Menggunakan TypeScript pada model data dan handler API.
- Menggunakan MySQL.
- Menggunakan environment variable untuk konfigurasi.
- Menggunakan server API Nuxt sebagai jalur akses database.
- Tidak menghubungkan browser langsung ke database.
- Menggunakan parameterized query.
- Memisahkan tanggung jawab komponen, halaman, dan API.
- Source code dikelola di GitHub.

**Fitur tambahan jika waktu mencukupi:**
- Login dan logout.
- Relasi user dan task.
- Filter status task.
- Pencarian task.
- Dashboard ringkasan task.

**Output:**
- Aplikasi CRUD fullstack.
- Source code di GitHub.
- Database dan struktur tabel.
- Dokumentasi singkat cara menjalankan project.

**Referensi:**
- [Nuxt Documentation](https://nuxt.com/docs)
- [Nuxt Server API](https://nuxt.com/docs/guide/directory-structure/server)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [MySQL Documentation](https://dev.mysql.com/doc/)

### Pertemuan 14 — Presentasi Project dan Code Review Bulan 3

**Jenis:** Presentasi

**Aktivitas:**
- Demo aplikasi fullstack.
- Menjelaskan struktur folder Nuxt.
- Menjelaskan alur halaman ke server API.
- Menjelaskan proses API mengakses database.
- Menjelaskan penggunaan TypeScript.
- Menunjukkan operasi CRUD.
- Code review dan tanya jawab.
- Review GitHub repository.
- Menjelaskan proses deployment jika aplikasi telah online.

**Output:**
- Nilai project bulan ketiga.
- Catatan code review.
- Daftar perbaikan sebelum evaluasi akhir.

### Pertemuan 15 — Evaluasi Akhir, Live Coding, dan Penutupan

**Jenis:** Evaluasi akhir

**Aktivitas:**
- Tes pemahaman fundamental HTML, CSS, JavaScript.
- Tes konsep backend, API, dan database.
- Tes konsep Vue, TypeScript, dan Nuxt.
- Live coding singkat.
- Refleksi pembelajaran.
- Penyampaian feedback mentor.
- Penutupan program.

**Contoh live coding:**
1. Membuat satu halaman daftar task sederhana.
2. Membuat satu endpoint GET atau POST di Nuxt.
3. Menjelaskan bagaimana endpoint mengambil data dari MySQL.
4. Memperbaiki satu error sederhana yang disiapkan mentor.

**Output:**
- Nilai akhir program.
- Rekap kompetensi peserta.
- Repository final.
- Dokumentasi project.
- Rekomendasi pembelajaran lanjutan.

---

# 5. Standar Project dan Hasil Akhir

## Project utama: TaskFlow

TaskFlow merupakan aplikasi manajemen tugas sederhana yang dikembangkan bertahap selama tiga bulan.

### Fitur minimum

| Fitur | Keterangan |
|---|---|
| Task list | Menampilkan daftar tugas |
| Add task | Menambahkan tugas |
| Edit task | Mengubah judul/deskripsi |
| Delete task | Menghapus tugas |
| Complete task | Menandai tugas selesai |
| Persistence | Data tersimpan dan tidak hilang saat halaman dimuat ulang |
| API | Data diakses melalui endpoint backend |
| Database | Data disimpan di MySQL |
| Responsive UI | Tampilan dapat digunakan di desktop dan mobile |

### Perkembangan arsitektur

**Bulan 1 — Client-side application**

```text
Browser
  ├── index.html
  ├── style.css
  └── script.js
        └── localStorage
```

**Bulan 2 — Frontend dan backend terpisah**

```text
Browser
  └── HTML + CSS + JavaScript
          |
          | HTTP Request / JSON
          v
      Node.js + Express
          |
          v
        MySQL
```

**Bulan 3 — Fullstack Nuxt**

```text
Browser
  |
  v
Nuxt Pages / Vue Components
  |
  v
Nuxt Server API (Nitro)
  |
  v
Database Layer
  |
  v
MySQL
```

### Contoh struktur project Nuxt

```text
taskflow/
├── app/
│   ├── assets/
│   ├── components/
│   ├── composables/
│   ├── layouts/
│   └── pages/
│       └── index.vue
├── server/
│   └── api/
│       ├── tasks.get.ts
│       ├── tasks.post.ts
│       ├── tasks/
│       │   ├── [id].get.ts
│       │   ├── [id].put.ts
│       │   └── [id].delete.ts
│       └── utils/
│           └── db.ts
├── shared/
│   └── types/
│       └── task.ts
├── .env
├── .gitignore
├── nuxt.config.ts
└── package.json
```

Struktur di atas adalah contoh konseptual. Struktur aktual dapat menyesuaikan versi Nuxt dan konfigurasi project yang digunakan.

---

# 6. Sistem Evaluasi Peserta

Evaluasi dilakukan setiap bulan dengan komposisi yang sama agar perkembangan peserta dapat dibandingkan.

| Komponen | Bobot | Indikator |
|---|---:|---|
| Project berjalan sesuai target | 40% | Fitur minimum berfungsi dan dapat didemonstrasikan |
| Kuis konsep | 30% | Memahami konsep dan istilah yang dipelajari |
| Presentasi dan penjelasan kode | 20% | Mampu menjelaskan kode sendiri dan alur aplikasi |
| Git dan kerapian repository | 10% | Commit rutin, struktur folder jelas, README tersedia |
| **Total** | **100%** | |

### Skala interpretasi nilai

| Nilai | Kategori | Keterangan |
|---:|---|---|
| 90–100 | Sangat Baik | Memahami konsep dan mampu mengembangkan project secara mandiri |
| 80–89 | Baik | Mampu menyelesaikan project dengan sedikit arahan |
| 70–79 | Cukup | Memahami dasar, tetapi masih membutuhkan pendampingan |
| 60–69 | Perlu Perbaikan | Beberapa konsep dan fitur belum dikuasai |
| <60 | Remedial | Perlu pengulangan materi dan praktik terarah |

### Prinsip evaluasi

- Jangan hanya menilai tampilan akhir aplikasi.
- Peserta harus mampu menjelaskan kode yang dibuat.
- Mentor dapat meminta peserta mengubah fitur kecil secara langsung.
- Kode yang disalin tanpa pemahaman tidak dianggap sebagai kompetensi.
- Peserta yang belum mencapai target diberi tugas remedial yang spesifik.

---

# 7. Weekly Coding Assignment

Selain 15 pertemuan formal, peserta dapat diberikan tugas mingguan ringan. Tugas ini tidak menambah pertemuan formal, tetapi menjaga konsistensi latihan.

| Minggu | Tugas |
|---|---|
| 1 | Setup VS Code, Git, GitHub, dan membuat halaman HTML pertama |
| 2 | Membuat halaman profil dengan HTML dan CSS |
| 3 | Latihan JavaScript: function, array, object, dan DOM |
| 4 | Menyelesaikan To-Do List Vanilla JS |
| 5 | Membuat server Node.js dan memahami npm |
| 6 | Membuat REST API sederhana menggunakan Express |
| 7 | Membuat database MySQL dan query CRUD |
| 8 | Menghubungkan API Express dengan MySQL |
| 9 | Memperbaiki project dan membuat dokumentasi API |
| 10 | Mengulang materi backend dan menyiapkan presentasi |
| 11 | Membuat project Vue menggunakan Vite |
| 12 | Latihan TypeScript dan membuat endpoint Nuxt |
| 13 | Menyelesaikan fitur capstone fullstack |
| 14 | Code review dan memperbaiki project |
| 15 | Refleksi dan rencana belajar lanjutan |

Tugas mingguan dapat berupa latihan kecil, bukan project besar. Mentor cukup memeriksa hasil dan memberi feedback melalui repository atau sesi mentoring.

---

# 8. Perangkat dan Lingkungan Pengembangan

## Software wajib

| Tools | Fungsi |
|---|---|
| Visual Studio Code | Code editor |
| Google Chrome / Firefox | Browser dan developer tools |
| Git | Version control |
| GitHub | Repository dan kolaborasi |
| Node.js LTS | JavaScript runtime |
| npm | Package manager |
| XAMPP | Lingkungan database lokal |
| phpMyAdmin | Antarmuka pengelolaan database |
| Postman | Pengujian REST API |
| Railway | Deployment latihan |

## Teknologi yang dipelajari

| Teknologi | Tingkat penguasaan yang ditargetkan |
|---|---|
| HTML5 | Fundamental |
| CSS3 | Fundamental |
| JavaScript Vanilla | Fundamental |
| Git & GitHub | Fundamental |
| Node.js | Dasar |
| Express.js | Dasar untuk REST API |
| MySQL | Dasar CRUD dan relasi |
| Vite | Dasar penggunaan |
| Vue.js 3 | Dasar pengembangan frontend |
| TypeScript | Fundamental |
| Nuxt.js | Dasar fullstack dan server API |

### Catatan teknis

- Vite adalah build tool dan development server, bukan framework frontend.
- Vue.js adalah framework frontend.
- Node.js adalah runtime JavaScript.
- Express.js adalah framework backend untuk Node.js.
- Nuxt.js adalah framework berbasis Vue.js yang menyediakan fitur fullstack melalui server engine Nitro.
- XAMPP dapat menyediakan MariaDB sebagai pengganti MySQL pada beberapa versi. Periksa engine dan versinya sebelum praktik agar perbedaan kompatibilitas diketahui.
- Gunakan versi Node.js LTS dan versi dependency yang konsisten untuk semua peserta.

---

# 9. Strategi Deployment dengan Railway

Railway digunakan sebagai lingkungan deployment latihan, bukan sebagai ketergantungan wajib agar seluruh materi dapat dipelajari.

### Rekomendasi pelaksanaan

1. Seluruh latihan database dimulai menggunakan MySQL lokal melalui XAMPP.
2. Peserta menyelesaikan koneksi backend dan database lokal terlebih dahulu.
3. Deployment baru dilakukan setelah aplikasi dapat berjalan secara lokal.
4. Gunakan satu project per tim atau akun latihan yang dikelola perusahaan.
5. Siapkan backup database `.sql`.
6. Jangan menyimpan password, token, atau credential di repository publik.
7. Gunakan environment variables untuk konfigurasi server.
8. Hentikan atau hapus resource latihan yang tidak digunakan.
9. Periksa kebijakan harga dan kuota Railway sebelum program dimulai.

### Perhatian biaya

Railway tidak boleh diasumsikan sebagai layanan gratis tanpa batas. Kredit percobaan, paket, dan kuota dapat berubah.

Informasi harga yang berlaku harus diperiksa langsung pada:

- [Railway Pricing](https://railway.com/pricing)
- [Railway Documentation](https://docs.railway.com/)

Klaim harga atau kredit tertentu tidak dicantumkan sebagai angka tetap dalam silabus karena dapat berubah sewaktu-waktu.

### Rencana cadangan

Jika deployment tidak dapat dilakukan karena keterbatasan kredit atau kendala layanan:

- Jalankan frontend dan backend secara lokal.
- Gunakan MySQL lokal melalui XAMPP.
- Demonstrasikan API menggunakan Postman.
- Ekspor database menjadi file `.sql`.
- Tetap lakukan penilaian berdasarkan fungsi dan pemahaman aplikasi, bukan status online semata.

---

# 10. Referensi Pembelajaran Utama

Program ini menggunakan dua repository yang diberikan sebagai sumber kurasi materi dan ide project. Dokumentasi resmi ditambahkan untuk topik yang tidak dibahas secara memadai di kedua repository, khususnya Vite, Vue.js, TypeScript, dan Nuxt.js.

## A. Free Programming Books — Bahasa Indonesia

Repository:
[https://github.com/EbookFoundation/free-programming-books/blob/main/books/free-programming-books-id.md](https://github.com/EbookFoundation/free-programming-books/blob/main/books/free-programming-books-id.md)

Gunakan repository ini sebagai katalog untuk mencari buku dan tutorial berbahasa Indonesia. Tidak semua materi perlu diselesaikan; mentor memilih bab yang sesuai dengan pertemuan.

Topik pencarian:
- HTML dan CSS.
- JavaScript.
- Git dan GitHub.
- Node.js.
- MySQL dan SQL.
- Vue.js.
- TypeScript.

## B. Project Based Learning

Repository:
[https://github.com/practical-tutorials/project-based-learning#html-and-css](https://github.com/practical-tutorials/project-based-learning#html-and-css)

Gunakan repository ini untuk mencari ide project dan latihan berbasis praktik. Pilih project kecil yang sesuai dengan kemampuan peserta dan target pertemuan.

## C. Dokumentasi resmi pendamping

| Materi | Dokumentasi |
|---|---|
| HTML | [MDN HTML](https://developer.mozilla.org/en-US/docs/Web/HTML) |
| CSS | [MDN CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) |
| JavaScript | [JavaScript.info](https://id.javascript.info/) |
| Git | [Git Documentation](https://git-scm.com/doc) |
| Node.js | [Node.js Learn](https://nodejs.org/en/learn) |
| Express.js | [Express Documentation](https://expressjs.com/) |
| MySQL | [MySQL Documentation](https://dev.mysql.com/doc/) |
| Vite | [Vite Guide](https://vite.dev/guide/) |
| Vue.js | [Vue Documentation](https://vuejs.org/guide/) |
| TypeScript | [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html) |
| Nuxt.js | [Nuxt Documentation](https://nuxt.com/docs) |
| Postman | [Postman Learning Center](https://learning.postman.com/) |
| Railway | [Railway Documentation](https://docs.railway.com/) |

---

# 11. Peran Mentor dan Peserta

## Tanggung jawab mentor

- Menyiapkan materi ringkas sebelum sesi.
- Menjelaskan konsep dengan contoh sederhana.
- Melakukan live coding.
- Memberikan latihan yang sesuai target.
- Memeriksa repository dan hasil praktik.
- Memberikan feedback yang spesifik.
- Mencatat perkembangan kompetensi peserta.
- Memastikan peserta memahami kode yang dikumpulkan.

## Tanggung jawab peserta

- Mengikuti seluruh pertemuan.
- Menyiapkan perangkat dan lingkungan coding.
- Menulis kode sendiri selama praktik.
- Mengerjakan tugas mingguan.
- Menyimpan pekerjaan di GitHub.
- Menulis learning log.
- Bertanya ketika menemui kendala.
- Mampu menjelaskan kode yang dibuat.
- Menyelesaikan dan mempresentasikan project.

## Format learning log

Setiap peserta mengisi catatan singkat setelah belajar:

```text
Tanggal:
Materi:
Hal baru yang dipahami:
Praktik yang dikerjakan:
Kendala yang ditemukan:
Cara mengatasi:
Hal yang masih belum dipahami:
Link repository / commit:
```

---

# 12. Checklist Kompetensi Akhir

Checklist ini digunakan mentor untuk memastikan capaian pembelajaran, bukan sekadar memeriksa kehadiran.

## Frontend Fundamentals

- [ ] Memahami struktur HTML.
- [ ] Mampu menggunakan semantic HTML.
- [ ] Mampu membuat layout dengan CSS.
- [ ] Memahami Flexbox dan Grid.
- [ ] Mampu membuat responsive design.
- [ ] Memahami variabel dan tipe data JavaScript.
- [ ] Mampu menggunakan function, array, dan object.
- [ ] Memahami DOM dan event listener.
- [ ] Mampu menggunakan localStorage.
- [ ] Memahami Git dan GitHub.

## Backend dan Database

- [ ] Memahami fungsi Node.js.
- [ ] Mampu menjalankan project dengan npm.
- [ ] Memahami Express.js dasar.
- [ ] Memahami HTTP request dan response.
- [ ] Memahami REST API.
- [ ] Mampu membuat endpoint CRUD.
- [ ] Memahami database relasional.
- [ ] Mampu membuat tabel MySQL.
- [ ] Mampu menggunakan query SQL CRUD.
- [ ] Mampu menghubungkan Node.js dengan MySQL.
- [ ] Mampu menguji API menggunakan Postman.

## Modern Frontend dan Fullstack

- [ ] Memahami fungsi Vite.
- [ ] Memahami struktur project Vue.
- [ ] Mampu membuat komponen Vue.
- [ ] Memahami `ref`, `v-if`, `v-for`, dan `v-model`.
- [ ] Memahami props dan emit.
- [ ] Memahami TypeScript dasar.
- [ ] Mampu menggunakan type dan interface.
- [ ] Memahami struktur project Nuxt.
- [ ] Mampu membuat halaman Nuxt.
- [ ] Mampu membuat server API Nuxt.
- [ ] Mampu menghubungkan Nuxt dengan MySQL.
- [ ] Memahami environment variables.
- [ ] Mampu mendemonstrasikan aplikasi fullstack.

---

# 13. Rekomendasi Pengembangan Setelah Program

Setelah program tiga bulan selesai, peserta yang memiliki hasil baik dapat diarahkan ke materi lanjutan:

1. Authentication dan authorization.
2. Password hashing dan session management.
3. Database design dan normalisasi lebih lanjut.
4. API validation dan security.
5. Nuxt middleware dan server utilities.
6. Testing frontend dan backend.
7. Deployment production.
8. Docker dan dasar Linux server.
9. Software architecture dan clean code.
10. Kolaborasi tim dengan Git branching dan pull request.

Materi lanjutan tersebut tidak perlu dipaksakan masuk ke 15 pertemuan awal. Fokus utama program adalah membangun fondasi yang kuat dan membuat peserta mampu menyelesaikan aplikasi fullstack sederhana.

---

# 14. Penutup

**Software Engineering Internship Program — 3 Months** dirancang sebagai program pembelajaran bertahap yang menggabungkan pemahaman konsep, praktik coding, pengembangan project, mentoring, dan evaluasi.

Keberhasilan program tidak diukur dari banyaknya framework yang berhasil diperkenalkan, tetapi dari kemampuan peserta memahami proses pengembangan aplikasi secara utuh.

Pada akhir program, setiap peserta diharapkan memiliki:

- Pemahaman fundamental software engineering.
- Kemampuan dasar frontend dan backend.
- Pengalaman menggunakan database relasional.
- Pengalaman membangun REST API.
- Pengalaman menggunakan Vue.js, TypeScript, dan Nuxt.js.
- Satu project fullstack yang dapat didemonstrasikan.
- Repository GitHub dan dokumentasi project.
- Kemampuan menjelaskan keputusan dan kode yang dibuat.

**Prinsip utama:** Learn the concept, build the feature, understand the code, and explain the result.
