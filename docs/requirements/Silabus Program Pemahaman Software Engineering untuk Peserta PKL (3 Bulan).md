# Silabus Program Pemahaman Software Engineering untuk Peserta PKL (3 Bulan)

Disusun untuk PT. Digital Teknologi Perkasa. Referensi: EbookFoundation/free-programming-books (versi Indonesia) dan practical-tutorials/project-based-learning.

## Asumsi Program

- **Jumlah pertemuan:** 4 pertemuan per bulan (2 materi, 1 praktek, 1 presentasi dan evaluasi) hanya menjadi 12. Agar sesuai 15 pertemuan, ditambahkan 3 pertemuan: kickoff di Bulan 1, remedial/buffer di Bulan 2, dan evaluasi akhir di Bulan 3.
- **Satu project yang berkembang:** peserta membuat satu aplikasi catatan/to-do yang diperluas tiap bulan, dari front-end, ke REST API, lalu ke aplikasi fullstack.
- **Format pertemuan:** satu pertemuan dianggap satu hari, dengan sekitar 30% penjelasan dan 70% praktek langsung.

## Bulan 1: Fondasi Front-End

Project: halaman profil dan To-Do List.

| # | Jenis | Isi ringkas | Output | Referensi |
| --- | --- | --- | --- | --- |
| 1 | Kickoff | Cara kerja web (browser, server, HTTP); setup VS Code, Git/GitHub, Node, XAMPP | Repo GitHub pertama | Belajar Git untuk Pemula (Petani Kode) |
| 2 | Materi 1 | HTML semantik; CSS (box model, flexbox, grid, responsive) | Halaman profil responsif | Tutorial HTML dan CSS Petani Kode |
| 3 | Materi 2 | JS vanila: variabel, fungsi, array/object, DOM, event, fetch dan async | Interaksi DOM sederhana | id.javascript.info |
| 4 | Praktek | To-Do List HTML + CSS + JS (tambah, hapus, tandai selesai) | To-Do List berjalan | Build a Todo List App in JavaScript, Build an HTML Calculator (project-based-learning) |
| 5 | Presentasi | Demo project, tanya-jawab kode, kuis DOM/event | Nilai Bulan 1 | - |

## Bulan 2: Back-End

Project: REST API untuk To-Do.

| # | Jenis | Isi ringkas | Output | Referensi |
| --- | --- | --- | --- | --- |
| 6 | Materi 1 | Node.js, npm, modul, Express; konsep REST (GET/POST/PUT/DELETE); JSON; Postman | API in-memory | Tutorial Node.js (Mfikri), Belajar Node.js |
| 7 | Materi 2 | MySQL via XAMPP/phpMyAdmin (tabel, CRUD, JOIN); koneksi mysql2; .env; deploy ke Railway | Database lokal lalu online | Tutorial MySQL untuk Pemula Hingga Mahir |
| 8 | Praktek | API CRUD Express + MySQL, dipasang di Railway; front-end Bulan 1 memanggil API ini | API publik + front-end terhubung | - |
| 9 | Buffer/remedial | Debugging bersama, perbaikan project yang tertinggal | Project selesai | - |
| 10 | Presentasi | Demo API (Postman), jelaskan alur request ke database, kuis | Nilai Bulan 2 | - |

## Bulan 3: Vite, Vue, TypeScript, dan Nuxt

Project: aplikasi fullstack.

| # | Jenis | Isi ringkas | Output | Referensi |
| --- | --- | --- | --- | --- |
| 11 | Materi 1 | Vite (dev server, HMR, build); Vue 3 (script setup, ref, v-if/v-for/v-model, komponen, props/emit) | To-Do versi Vue memanggil API Bulan 2 | Dokumentasi Vue Bahasa Indonesia, Belajar Vue.js (Varian) |
| 12 | Materi 2 | TypeScript secukupnya untuk API (type, interface, typing fungsi dan request/response); Nuxt (routing berbasis file, server/api, useFetch, runtime config) | Endpoint Nuxt bertipe | TypeScript untuk Pemula (Tutsplus) |
| 13 | Praktek | Aplikasi fullstack Nuxt: halaman Vue + server/api + MySQL Railway | Aplikasi CRUD fullstack | Vue.js To-Do List Tutorial (video) |
| 14 | Presentasi | Demo aplikasi, jelaskan struktur Nuxt dan alur data | Nilai Bulan 3 | - |
| 15 | Evaluasi akhir | Live coding kecil (buat 1 endpoint dan 1 halaman), refleksi, penutupan | Nilai akhir | - |

Catatan: kedua repo referensi tidak memuat materi Nuxt dan hanya satu artikel TypeScript. Untuk pertemuan 11 sampai 13 sebaiknya ditambah dokumentasi resmi Nuxt dan TypeScript sebagai pendamping.

## Evaluasi (sama setiap bulan)

- Project berjalan sesuai target bulan itu (40%)
- Kuis konsep lisan atau tertulis, 10 soal (30%)
- Kemampuan menjelaskan kode sendiri saat presentasi (20%)
- Kerapian Git: commit rutin, repo jelas (10%)

## Catatan Railway

Railway saat ini tidak sepenuhnya gratis. Akun baru mendapat kredit percobaan sekali pakai $5 yang berlaku 30 hari, lalu turun ke paket Free dengan kredit $1 per bulan. Paket berbayar Hobby seharga $5 per bulan. Kredit $1 per bulan cukup untuk demo kecil, tetapi database dan server yang selalu menyala bisa menghabiskannya.

Saran:

- Mulai deploy di Pertemuan 7, bukan lebih awal.
- Pakai satu akun Railway bersama untuk semua peserta, atau satu project per tim.
- Siapkan cadangan, misalnya ekspor .sql dari XAMPP, agar praktek tidak terhenti jika kredit habis.
- Cek ulang kebijakan harga di halaman resmi Railway sebelum program dimulai.
