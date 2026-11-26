# UI/UX & Visual Design System (`Design.md`)
## Digitek Software Engineering Bootcamp — Apple macOS Aesthetics × Halopolca Slide Structure

| Atribut Desain | Spesifikasi |
| :--- | :--- |
| **Inspirasi Tata Letak** | [bootcamp.halopolca.my.id](https://bootcamp.halopolca.my.id) (Katalog Grid & Hero) & [Fundamental Desain.html](https://bootcamp.halopolca.my.id/Fundamental%20Desain.html) (Full-Viewport Slide Deck, Bento Cards, Good vs Bad Comparison, Floating Bottom Navigation Pill) |
| **Gaya Visual** | Apple macOS Sequoia / Keynote Glassmorphism + Clean Editorial Light Surface |
| **Font Utama** | **Plus Jakarta Sans** & Apple System Sans-Serif (`-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', sans-serif`) |
| **Font Kode** | **JetBrains Mono** & `'SF Mono', Menlo, Consolas, monospace` |
| **Ornamen Wajib** | **3 Dot macOS (Merah `#FF5F56`, Kuning `#FFBD2E`, Hijau `#27C93F`)** pada setiap pojok frame slide utama dan setiap kartu bento/katalog |

---

## 1. Sistem Tipografi (Plus Jakarta Sans & Apple Sans-Serif)

Sesuai instruksi pengguna (*"dengan font text jakarta sans & sans serif ala apple"*), seluruh teks antarmuka dan slide menggunakan skala tipografi ber-tracking rapat (*tight letter-spacing*) khas Apple Human Interface Guidelines:

```css
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,600&display=swap');

:root {
  --font-apple-jakarta: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont,
    'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif;
  --font-apple-mono: 'JetBrains Mono', 'SF Mono', SFMono-Regular, Menlo, Consolas, monospace;
}
```

| Elemen | Ukuran (Desktop / Mobile) | Weight | Letter Spacing | Line Height |
| :--- | :--- | :---: | :---: | :---: |
| **Slide Display Headline (`h1`)** | `3.75rem` (60px) / `2.25rem` (36px) | `800` (ExtraBold) | `-0.035em` | `1.08` |
| **Slide Section Title (`h2`)** | `2.5rem` (40px) / `1.75rem` (28px) | `700` (Bold) | `-0.028em` | `1.15` |
| **Bento Card Title (`h3`)** | `1.25rem` (20px) / `1.125rem` (18px) | `700` (Bold) | `-0.018em` | `1.3` |
| **Slide Body Lead** | `1.125rem` (18px) / `1rem` (16px) | `400`–`500` | `-0.011em` | `1.6` |
| **Badge / Pill / Eyebrow** | `0.75rem` (12px) | `700` (Uppercase) | `+0.08em` | `1.2` |
| **Code Block / Snippet** | `0.875rem` (14px) | `500` | `0em` | `1.65` |

---

## 2. Palet Warna & Token Glassmorphism

Menggabungkan kehangatan latar `#F6F6F4` dari `bootcamp.halopolca.my.id` dengan *translucent glass* dan aksen presisi khas Apple macOS:

| Token | Hex / RGBA | Kegunaan |
| :--- | :--- | :--- |
| `--bg-canvas` | `#F5F5F7` | Latar utama halaman katalog dan kanvas slide (Apple Light Canvas) |
| `--bg-card-glass` | `rgba(255, 255, 255, 0.88)` | Permukaan kartu slide & bento dengan `backdrop-filter: blur(24px)` |
| `--ink-primary` | `#111113` | Warna judul dan teks utama berkontras tinggi |
| `--ink-secondary` | `#52525B` | Warna deskripsi dan penjelasan konsep |
| `--ink-muted` | `#8E8E93` | Warna metadata, counter slide, dan label sekunder |
| `--brand-accent` | `#FF4D00` | Aksen utama hangat ala Halopolca (CTA, nomor urut, sorotan) |
| `--apple-blue` | `#0071E3` | Aksen interaktif Apple (Fokus input, link teknis, badge Mentor) |
| `--mac-red` | `#FF5F56` | Dot kiri macOS (Close Traffic Light) + Indikator *Bad Code / Locked* |
| `--mac-yellow` | `#FFBD2E` | Dot tengah macOS (Minimize Traffic Light) + Indikator *Summary / Pending ACC* |
| `--mac-green` | `#27C93F` | Dot kanan macOS (Maximize Traffic Light) + Indikator *Good Code / Unlocked / Approved* |

---

## 3. Spesifikasi Komponen "3 Dot macOS" di Setiap Pojok Slide & Card

Sesuai permintaan eksplisit: *"dan untuk setiap pojok2 slide berikan 3 dot merah kuning hijau ala apple mac"*, kami menetapkan komponen standar **`<MacTrafficDots />`** yang selalu dirender pada:

1. **Pojok Kiri Atas Frame Utama Setiap Slide (`.slide-mac-window`)**
2. **Pojok Kiri Atas Setiap Kartu Katalog Pertemuan (`.catalog-mac-card`)**
3. **Pojok Kiri Atas Setiap Bento Card, Code Editor Card, dan Modal di Dalam Slide (`.bento-mac-card`)**
4. **Opsional Pojok Kanan Atas / Bawah (`variant="corner-accent"`)** untuk memberi identitas visual macOS yang konsisten di seluruh sudut kanvas slide.

### Struktur Visual Frame Slide macOS:

```text
╭──────────────────────────────────────────────────────────────────────────╮
│  🔴 🟡 🟢   PERTEMUAN 02 • HTML5 SEMANTIK & CSS3      [Slide 04 / 09]   │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   [Badge: 30% KONSEP & ANALOGI]                                          │
│   Judul Slide dengan Font Plus Jakarta Sans ExtraBold                    │
│                                                                          │
│   ╭─────────────────────────────────╮  ╭──────────────────────────────╮  │
│   │ 🔴 🟡 🟢  ✕ Bad Practice        │  │ 🔴 🟡 🟢  ✓ Good Practice    │  │
│   │ ─────────────────────────────── │  │ ──────────────────────────── │  │
│   │ <div class="header">...</div>   │  │ <header><nav>...</nav>       │  │
│   ╰─────────────────────────────────╯  ╰──────────────────────────────╯  │
│                                                                          │
╰──────────────────────────────────────────────────────────────────────────╯
                  ╭────────────────────────────────────╮
                  │  [ ← ]   04 / 09  ━━━━━━░░  [ → ]  │
                  ╰────────────────────────────────────╯
```

---

## 4. Desain Status Kartu & Gate Unlock Materi

Untuk mengomunikasikan aturan **Role (`mentor` vs `user` vs `guest`)** dan **Sequential Task Lock** secara visual dan intuitif:

### 4.1. Variasi Badge pada Katalog Pertemuan (`/`)
1. **Guest Mode (Belum Register)**:
   - Setiap kartu pertemuan menampilkan badge kuning: `👁️ Preview Ringkasan (3 Slide)`
   - Banner atas katalog: *"Kamu sedang dalam Mode Tamu (Guest). Daftar menggunakan Nama, Email, dan Asal Sekolah untuk membuka materi lengkap & mengumpulkan Task."*
2. **Registered User — Pertemuan Terbuka (`Unlocked`)**:
   - Badge hijau: `🟢 Materi Terbuka • Siap Dipelajari`
   - Efek hover kartu terangkat (`transform: translateY(-6px)`) dengan garis gradien aktif di bagian bawah kartu.
3. **Registered User — Task Sudah Dikirim (`Pending Mentor ACC`)**:
   - Badge biru/amber: `⏳ Task Dikirim • Menunggu ACC Mentor`
4. **Registered User — Perlu Revisi (`Revision Needed`)**:
   - Badge merah/oranye: `⚠️ Revisi Task (Lihat Catatan Mentor)`
5. **Registered User — Pertemuan Terkunci (`Locked`)**:
   - Kartu memiliki efek `.card.locked` (opacity tereduksi, ikon gembok `🔒 Locked — Selesaikan & ACC Task Pertemuan Sebelumnya`).
   - Jika diklik, peserta tetap dapat melihat **3 Slide Ringkasan**, namun Slide ke-4 menampilkan layar pemberitahuan bahwa mereka harus menyelesaikan & meminta ACC Mentor pada pertemuan sebelumnya terlebih dahulu.

### 4.2. Desain Gate Slide (Slide Pengunci)
Ketika pengguna mencoba membuka slide ke-4 pada pertemuan yang belum terbuka:
- **Jika Belum Registrasi (`Guest`)**:
  Muncul kartu macOS ber-dot Merah-Kuning-Hijau di tengah slide berisi **Form Registrasi Cepat Peserta Bootcamp**:
  - Input 1: **Nama Lengkap** (contoh: *Budi Santoso*)
  - Input 2: **Email Aktif** (contoh: *budi@smkn1lampung.sch.id*)
  - Input 3: **Asal Sekolah / Kampus** (contoh: *SMKN 1 Bandar Lampung*)
  - Tombol CTA: `Daftar & Buka Materi Pertemuan 1 Sekarang →`
- **Jika Sudah Registrasi tapi Pertemuan `N` Belum Di-ACC Mentor**:
  Muncul kartu status macOS yang menjelaskan:
  - Status Pertemuan `N-1` saat ini (*Belum Mengumpulkan Task* / *Sedang Menunggu ACC Mentor Alfin Almustajab* / *Perlu Revisi*).
  - Tombol pintas: `← Kembali ke Task Pertemuan Sebelumnya`.

---

## 5. Responsivitas & Aksesibilitas

1. **Desktop (`>= 1024px`)**: Kanvas slide terpusat (`max-width: 1120px`), grid bento 2–3 kolom, navigasi keyboard (`←`, `→`, `Space`), dan *floating bottom pill*.
2. **Tablet & Mobile (`< 768px`)**: Slide mendukung *vertical scroll* halus di dalam frame dengan ruang aman bawah (`padding-bottom: 110px`), mendukung *horizontal touch swipe* untuk berpindah slide, serta *drawer* daftar slide yang responsif.
3. **Kontras & Keterbacaan**: Mengikuti standar kontras tinggi (WCAG AA) dengan blok kode gelap (`#0F172A`) ber-header 3 dot macOS agar sintaks HTML, CSS, JS, SQL, Vue, TypeScript, dan Nuxt terbaca tajam di proyektor kelas maupun layar laptop peserta.
