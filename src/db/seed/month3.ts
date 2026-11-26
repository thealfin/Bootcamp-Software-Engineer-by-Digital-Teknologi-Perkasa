import type { SeedModuleInput } from '../../types/bootcamp';

const STANDARD_LEARNING_LOG_FIELDS: string[] = [
  'Tanggal',
  'Materi',
  'Hal baru yang dipahami',
  'Praktik yang dikerjakan',
  'Kendala yang ditemukan',
  'Cara mengatasi',
  'Hal yang belum dipahami',
  'Tautan repositori / commit',
];

export const MONTH_3_MODULES: SeedModuleInput[] = [
  {
    orderIndex: 12,
    month: 3,
    code: 'P12',
    slug: 'pertemuan-12-vite-vuejs-3-fundamental',
    sessionType: 'Materi 1',
    title: 'Vite Build Tool & Vue.js 3 Single File Component',
    subtitle:
      'Bangun antarmuka modular menggunakan Vite dan Vue.js 3 Composition API berbasis komponen reaktif.',
    summaryText:
      'Beralih dari manipulasi DOM manual ke komponen Vue 3 SFC dengan ref, v-model, props, dan emit.',
    taskPrompt:
      'Bangun antarmuka TaskFlow fullstack menggunakan Vite dan Vue 3 yang terhubung ke REST API Bulan 2.',
    taskDeliverables: [
      'Repositori GitHub proyek Vite + Vue 3 tanpa folder node_modules',
      'Minimal 3 komponen SFC (.vue) dengan <script setup>, ref, v-for (:key), v-if, dan v-model',
      'Komunikasi antarkomponen melalui defineProps dan defineEmits tanpa mutasi prop langsung',
      'Integrasi CRUD penuh ke endpoint REST API Bulan 2',
      'Catatan Learning Log lengkap beserta tautan commit terbaru',
    ],
    accentGradient: 'from-emerald-500 to-green-600',
    iconName: 'Lightning',
    slides: [
      {
        slideNumber: 1,
        isSummary: true,
        layoutType: 'cover',
        badge: 'Pertemuan 11 • Bulan 3',
        title: 'Vite Build Tool & Vue.js 3 Single File Component',
        subtitle:
          'Pahami perbedaan build tool dan framework untuk membangun antarmuka reaktif.',
        contentJson: {
          eyebrow: 'Materi 1 • Bulan 3: Modern Frontend',
          highlights: [
            'Pahami fungsi Vite dan mekanisme Hot Module Replacement (HMR).',
            'Kuasai struktur Single File Component (.vue) dengan <script setup>.',
            'Gunakan ref(), v-if, v-for, v-model, serta komunikasi props dan emit.',
            'Hubungkan komponen Vue 3 ke REST API Bulan 2.',
          ],
          stats: [
            { label: 'Porsi Sesi', value: '30% Konsep / 70% Praktik' },
            { label: 'Stack Utama', value: 'Vite + Vue.js 3' },
            { label: 'Target Output', value: 'TaskFlow UI Modular' },
            { label: 'Minggu', value: 'Week 11' },
          ],
        },
      },
      {
        slideNumber: 2,
        isSummary: true,
        layoutType: 'summary',
        badge: 'Ringkasan Eksekutif',
        title: 'Mengapa Beralih dari Vanilla JS ke Vite & Vue 3?',
        subtitle:
          'Manipulasi DOM manual sulit dirawat saat fitur aplikasi terus bertambah.',
        contentJson: {
          eyebrow: 'Executive Summary • Evolusi TaskFlow & InternFlow',
          highlights: [
            'Vite menyajikan kode via ES Modules dengan pembaruan HMR instan.',
            'Vue.js 3 menyinkronkan tampilan otomatis setiap kali state berubah.',
            'File .vue menyatukan logika, template, dan CSS terisolasi per fitur.',
            'Fondasi Vue 3 menyiapkan transisi ke Nuxt.js pada Pertemuan 12.',
          ],
          stats: [
            { label: 'Bulan 1', value: 'DOM Manual + localStorage' },
            { label: 'Bulan 2', value: 'HTML/JS + Express + MySQL' },
            { label: 'Bulan 3 (P11)', value: 'Vite + Vue 3 SFC' },
          ],
        },
      },
      {
        slideNumber: 3,
        isSummary: true,
        layoutType: 'bento',
        badge: 'Peta Konsep & Agenda',
        title: 'Peta Konsep & Agenda Sesi 30/70',
        subtitle:
          'Pelajari arsitektur Vite dan Vue 3, lalu bangun komponen TaskFlow secara langsung.',
        contentJson: {
          eyebrow: 'Roadmap Pertemuan 11 (2–3 Jam)',
          highlights: [
            'Kenali skrip dev, build, dan preview pada package.json.',
            'Gunakan <script setup> sebagai standar utama Vue 3 dan Nuxt.',
          ],
          bentoCards: [
            {
              title: '1. Vite & Build Tool (15%)',
              tag: '30% Konsep',
              description:
                'Pahami peran dev server, HMR, struktur proyek, dan proses bundling produksi.',
              bullets: [
                'npm run dev untuk server lokal',
                'npm run build ke folder dist/',
                'Vite sebagai tooling, Vue sebagai framework',
              ],
            },
            {
              title: '2. Vue 3 SFC & Reaktivitas (15%)',
              tag: '30% Konsep',
              description:
                'Pelajari anatomi file .vue, state ref(), direktif template, serta aliran data komponen.',
              bullets: [
                '<script setup> ringkas tanpa boilerplate',
                'Aliran data Props Down, Events Up',
                'Pengenalan composable dan Vue Router',
              ],
            },
            {
              title: '3. Praktik Komponen TaskFlow (50%)',
              tag: '70% Praktik',
              description:
                'Inisialisasi proyek Vite dan pecah antarmuka menjadi TaskForm, TaskList, serta TaskItem.',
              bullets: [
                'Kelola daftar tugas dengan ref()',
                'Ikat input form memakai v-model',
                'Kirim aksi via defineProps dan defineEmits',
              ],
            },
            {
              title: '4. Integrasi REST API (20%)',
              tag: '70% Praktik',
              description:
                'Sambungkan komponen Vue ke endpoint CRUD Bulan 2 menggunakan Fetch API.',
              bullets: [
                'Muat data awal saat onMounted',
                'Perbarui status dan hapus tugas',
              ],
            },
          ],
        },
      },
      {
        slideNumber: 4,
        isSummary: false,
        layoutType: 'bento',
        badge: '30% Konsep • Analogi',
        title: 'Analogi Vite & Aliran Data Komponen Vue 3',
        subtitle:
          'Pahami pembagian tugas antara bundler, komponen, state induk, dan direktif kondisi.',
        contentJson: {
          eyebrow: 'Analogi & Konsep Fundamental',
          highlights: [
            'Vite menyajikan modul kode, sedangkan Vue mengelola logika tampilan.',
            'State milik komponen induk tidak boleh diubah langsung oleh anak.',
          ],
          bentoCards: [
            {
              title: 'Vite = Dapur Saji Sesuai Pesanan',
              tag: 'Build Tool',
              description:
                'Vite memproses modul saat diminta browser ketika development, lalu membundelnya untuk produksi.',
              bullets: [
                'HMR memperbarui komponen tanpa muat ulang',
                'Build produksi meminifikasi kode ke dist/',
              ],
            },
            {
              title: 'Komponen = Blok Modular Independen',
              tag: 'SFC (.vue)',
              description:
                'Pecah halaman besar menjadi Navbar, TaskForm, TaskList, dan TaskItem yang dapat dipakai ulang.',
              bullets: [
                'Satu file .vue memegang satu tanggung jawab',
                '<style scoped> mencegah bentrok aturan CSS',
              ],
            },
            {
              title: 'Props Down, Events Up',
              tag: 'Komunikasi',
              description:
                'Induk mengirim data baca-saja lewat props, sedangkan anak melapor perubahan lewat emit.',
              bullets: [
                'Induk ke anak: :task="item"',
                'Anak ke induk: @toggle="handleToggle"',
              ],
            },
            {
              title: 'v-if vs v-show',
              tag: 'Direktif Kondisi',
              description:
                'v-if melepas elemen dari DOM, sedangkan v-show hanya mengubah properti CSS display.',
              bullets: [
                'Pakai v-if untuk kondisi jarang berubah',
                'Pakai v-show untuk panel sering dibuka',
              ],
            },
          ],
        },
      },
      {
        slideNumber: 5,
        isSummary: false,
        layoutType: 'bento',
        badge: 'Bedah Teknis • Sintaks Inti',
        title: 'Sintaks Vite, <script setup>, Props/Emit & Composable',
        subtitle:
          'Pola dasar Composition API Vue 3 yang dipakai hingga proyek Nuxt.js.',
        contentJson: {
          eyebrow: 'Sintaks Inti Vite + Vue.js 3',
          highlights: [
            'Akses nilai ref memakai .value di script, otomatis terbuka di template.',
            'Pisahkan logika fetch ke composable useTasks agar komponen tetap ringkas.',
          ],
          bentoCards: [
            {
              title: 'Skrip Standar Proyek Vite',
              tag: 'package.json',
              description:
                'Konfigurasi skrip untuk menjalankan server HMR lokal dan kompilasi produksi.',
              code: {
                filename: 'package.json',
                language: 'json',
                snippet: `{
  "name": "taskflow-vue",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": { "vue": "^3.5.0" },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.2.0",
    "vite": "^6.0.0"
  }
}`,
              },
            },
            {
              title: 'Komponen Induk: ref & v-for',
              tag: 'App.vue',
              description:
                'Kelola state daftar tugas di induk dan render item memakai :key unik.',
              code: {
                filename: 'src/App.vue',
                language: 'vue',
                snippet: `<script setup>
import { ref, onMounted } from 'vue';
import TaskItem from './components/TaskItem.vue';

const tasks = ref([]);
onMounted(async () => {
  const res = await fetch('http://localhost:3001/api/tasks');
  tasks.value = await res.json();
});
</script>
<template>
  <p v-if="!tasks.length">Belum ada tugas.</p>
  <TaskItem v-for="t in tasks" :key="t.id" :task="t" />
</template>`,
              },
            },
            {
              title: 'Komponen Anak: Props & Emit',
              tag: 'TaskItem.vue',
              description:
                'Terima objek tugas lewat defineProps dan teruskan aksi pengguna lewat defineEmits.',
              code: {
                filename: 'src/components/TaskItem.vue',
                language: 'vue',
                snippet: `<script setup>
const props = defineProps({ task: { type: Object, required: true } });
const emit = defineEmits(['toggle', 'remove']);
</script>
<template>
  <li class="task-row">
    <button @click="emit('toggle', props.task.id)">Ubah Status</button>
    <span>{{ props.task.title }}</span>
    <button @click="emit('remove', props.task.id)">Hapus</button>
  </li>
</template>`,
              },
            },
            {
              title: 'Composable Logika API',
              tag: 'useTasks.js',
              description:
                'Ekstrak state dan fungsi fetch ke composable agar mudah dipakai ulang.',
              code: {
                filename: 'src/composables/useTasks.js',
                language: 'javascript',
                snippet: `import { ref } from 'vue';

export function useTasks(apiUrl) {
  const tasks = ref([]);
  async function addTask(title) {
    if (!title.trim()) return;
    await fetch(\`\${apiUrl}/tasks\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
  }
  return { tasks, addTask };
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
        title: 'Anti-Pattern Pemula Vue 3 vs Standar Engineer',
        subtitle:
          'Hindari mutasi props langsung dan pastikan setiap v-for memiliki :key unik.',
        contentJson: {
          eyebrow: 'Code Quality Review • Vue.js 3',
          highlights: [
            'Ubah state hanya di komponen pemilik state tersebut.',
            'Hindari indeks array sebagai :key saat item dapat dihapus.',
          ],
          comparison: {
            badTitle: '✕ Anti-Pattern Pemula',
            badPoints: [
              'Mengubah properti props langsung dari dalam komponen anak.',
              'Menulis perulangan v-for tanpa atribut :key yang unik.',
              'Menyimpan state dinamis pada variabel biasa tanpa ref().',
            ],
            badCode: {
              filename: 'BadTaskItem.vue',
              language: 'vue',
              snippet: `<script setup>
const props = defineProps(['task']);
function markDone() {
  // Salah: mutasi prop secara langsung
  props.task.is_done = true;
}
</script>
<template>
  <li v-for="item in list" @click="markDone">{{ item.title }}</li>
</template>`,
            },
            goodTitle: '✓ Standar Software Engineer',
            goodPoints: [
              'Kirim event via defineEmits agar induk memperbarui state.',
              'Pasang :key="task.id" yang stabil pada setiap elemen v-for.',
              'Bungkus state dinamis memakai ref() dan pisahkan composable.',
            ],
            goodCode: {
              filename: 'GoodTaskItem.vue',
              language: 'vue',
              snippet: `<script setup>
const props = defineProps({ task: { type: Object, required: true } });
const emit = defineEmits(['toggle']);
</script>
<template>
  <li @click="emit('toggle', props.task.id)">
    {{ props.task.title }}
  </li>
</template>`,
            },
          },
        },
      },
      {
        slideNumber: 7,
        isSummary: false,
        layoutType: 'practice',
        badge: '70% Hands-On • PBL',
        title: 'Langkah Praktik: Membangun TaskFlow Vue 3 + Vite',
        subtitle:
          'Bangun antarmuka komponen Vue 3 dan sambungkan ke REST API Bulan 2.',
        contentJson: {
          eyebrow: '70% Praktik Langsung • TaskFlow fullstack',
          highlights: [
            'Pastikan server API Bulan 2 aktif sebelum menguji fetch data.',
            'Struktur components/ dan composables/ ini selaras dengan arsitektur Nuxt.',
          ],
          practiceSteps: [
            {
              step: 1,
              title: 'Inisialisasi Proyek Vite + Vue',
              description:
                'Buat proyek menggunakan template resmi Vue, instal dependensi, lalu jalankan server HMR.',
              command:
                'npm create vite@latest taskflow-vue -- --template vue && cd taskflow-vue && npm install && npm run dev',
            },
            {
              step: 2,
              title: 'Susun Komponen & Composable',
              description:
                'Pisahkan antarmuka menjadi TaskForm.vue, TaskList.vue, TaskItem.vue, serta logika API di useTasks.js.',
              code: `src/
├── components/
│   ├── TaskForm.vue
│   ├── TaskList.vue
│   └── TaskItem.vue
├── composables/
│   └── useTasks.js
└── App.vue`,
            },
            {
              step: 3,
              title: 'Buat Form Input dengan v-model',
              description:
                'Ikat input judul memakai v-model, validasi teks kosong, lalu kirim event ke induk.',
              code: `<script setup>
import { ref } from 'vue';
const title = ref('');
const emit = defineEmits(['submit-task']);
function onSubmit() {
  if (!title.value.trim()) return;
  emit('submit-task', title.value.trim());
  title.value = '';
}
</script>`,
            },
            {
              step: 4,
              title: 'Integrasikan CRUD API & Build Produksi',
              description:
                'Hubungkan operasi GET, POST, PUT, dan DELETE ke API Bulan 2, lalu uji build produksi.',
              command:
                'npm run build && git add . && git commit -m "feat: taskflow vue 3 with vite"',
            },
          ],
        },
      },
      {
        slideNumber: 8,
        isSummary: false,
        layoutType: 'quiz',
        badge: 'Kuis & Referensi',
        title: 'Evaluasi Konsep, Referensi & Tugas Mingguan',
        subtitle:
          'Uji pemahaman konsep Vite dan Vue 3 sebelum mengerjakan tugas mandiri.',
        contentJson: {
          eyebrow: 'Evaluasi Pemahaman & Pustaka Terkurasi',
          highlights: [
            'Jelaskan perbedaan Vite dan Vue dengan kalimat Anda sendiri.',
            'Pahami alasan aliran data satu arah pada komunikasi komponen.',
          ],
          quizItems: [
            {
              question: 'Apa perbedaan peran antara Vite dan Vue.js 3?',
              hint: 'Bandingkan alat pengemas kode dengan pengatur tampilan.',
              answer:
                'Vite adalah build tool dan dev server penyedia HMR serta bundling produksi. Vue.js 3 adalah framework untuk membangun antarmuka berbasis komponen reaktif.',
            },
            {
              question:
                'Mengapa ref() membutuhkan .value di <script setup>, tetapi tidak di <template>?',
              hint: 'Perhatikan cara kerja kompilator template Vue.',
              answer:
                'Di JavaScript, ref membungkus nilai dalam objek { value } agar perubahan terdeteksi. Di <template>, Vue membuka pembungkus tersebut secara otomatis.',
            },
            {
              question: 'Kapan Anda memilih v-if dibandingkan v-show?',
              hint: 'Tinjau frekuensi perubahan tampilan elemen.',
              answer:
                'Gunakan v-if saat kondisi jarang berubah karena elemen dilepas dari DOM. Gunakan v-show untuk elemen yang sering dibuka-tutup via CSS.',
            },
            {
              question:
                'Mengapa komponen anak menggunakan defineEmits alih-alih mengubah props langsung?',
              hint: 'Prinsip satu sumber kebenaran state.',
              answer:
                'Aliran data satu arah menjaga state tetap terpusat di komponen induk sehingga sumber perubahan data mudah dilacak.',
            },
          ],
          references: [
            {
              title: 'Belajar Vue.js',
              url: 'https://variancode.com/belajar-vue-js/',
              author: 'Varian Hermianto',
              category: 'Vue.js (Free Programming Books ID)',
              lang: 'ID',
              type: 'Book',
            },
            {
              title: 'Dokumentasi Vue Bahasa Indonesia',
              url: 'https://github.com/vuejs-id/docs',
              author: 'Vue.js Indonesia',
              category: 'Vue.js (Free Programming Books ID)',
              lang: 'ID',
              type: 'Book',
            },
            {
              title: 'Vue 3 Dasar & Composition API',
              url: 'https://youtube.com/playlist?list=PLnQvfeVegcJbn7ZDOUNbRN25obY4htSlB',
              author: 'Nusendra Hanggarawan',
              category: 'Vue.js (Free Courses ID)',
              lang: 'ID',
              type: 'Course',
            },
            {
              title: 'Tutorial Vue.js dengan API Bahasa Indonesia',
              url: 'https://www.youtube.com/playlist?list=PLIan8aHxsPj3a7oLHb2a8pw8IHBq45WYu',
              author: 'Wahidev Academy',
              category: 'Vue.js + API (Free Courses ID)',
              lang: 'ID',
              type: 'Course',
            },
            {
              title: 'Vite Guide (Official)',
              url: 'https://vite.dev/guide/',
              author: 'Vite Team',
              category: 'Build Tool',
              lang: 'EN',
              type: 'Docs',
            },
            {
              title: 'Vue.js Official Guide',
              url: 'https://vuejs.org/guide/introduction.html',
              author: 'Vue Core Team',
              category: 'Frontend Framework',
              lang: 'EN',
              type: 'Docs',
            },
            {
              title: 'Vue Router Documentation',
              url: 'https://router.vuejs.org/',
              author: 'Vue Core Team',
              category: 'SPA Routing',
              lang: 'EN',
              type: 'Docs',
            },
            {
              title: 'Vue.js To-Do List Tutorial (PBL)',
              url: 'https://www.youtube.com/watch?v=78tNYZUS-ps',
              author: 'Project Based Learning',
              category: 'Project-Based Learning',
              lang: 'EN',
              type: 'PBL',
            },
          ],
          weeklyAssignment: {
            week: 11,
            title: 'Membuat Proyek Vue Menggunakan Vite',
            description:
              'Bangun minimal 3 komponen Vue 3 dengan fitur tambah tugas, filter status, dan unggah ke GitHub.',
          },
        },
      },
      {
        slideNumber: 9,
        isSummary: false,
        layoutType: 'task',
        badge: 'Task Pertemuan 11',
        title: 'Deliverable Wajib & Pengumpulan Learning Log',
        subtitle:
          'Kumpulkan tugas Pertemuan 11 untuk membuka materi TypeScript dan Nuxt.js.',
        contentJson: {
          eyebrow: 'Submission Checklist • Pertemuan 11',
          highlights: [
            'Pastikan folder node_modules masuk ke dalam file .gitignore.',
            'Lampirkan tangkapan layar antarmuka yang terhubung ke REST API.',
          ],
          deliverables: [
            'Tautan repositori GitHub proyek Vite + Vue 3 bersih tanpa node_modules',
            'Minimal 3 komponen SFC (.vue) memakai <script setup>, ref, v-model, v-for (:key), v-if, props, dan emit',
            'Fitur tambah, tampil, ubah status, dan hapus tugas terhubung ke API Bulan 2',
            'Catatan Learning Log lengkap sesuai 8 poin standar program',
          ],
          learningLogFields: STANDARD_LEARNING_LOG_FIELDS,
          mentorTip:
            'Kuasai aliran props, emit, dan ref() bawaan Vue 3 sebelum menggunakan pustaka state eksternal seperti Pinia.',
        },
      },
    ],
  },
  {
    orderIndex: 13,
    month: 3,
    code: 'P13',
    slug: 'pertemuan-13-typescript-nuxtjs-server-api',
    sessionType: 'Materi 2',
    title: 'TypeScript Fundamental & Nuxt.js Server API (Nitro)',
    subtitle:
      'Terapkan keamanan tipe data TypeScript dan bangun aplikasi fullstack menggunakan Nuxt.js serta Nitro Server API.',
    summaryText:
      'Pelajari kontrak data TypeScript (interface, union, Promise<T>) serta arsitektur halaman, useFetch, dan server/api di Nuxt.js.',
    taskPrompt:
      'Buat proyek Nuxt.js bertipe TypeScript lengkap dengan kontrak data bersama, halaman useFetch, serta endpoint GET dan POST.',
    taskDeliverables: [
      'Repositori GitHub proyek Nuxt.js dengan pemeriksaan TypeScript aktif',
      'File shared/types/task.ts berisi interface Task, CreateTaskPayload, dan ApiResponse<T>',
      'Endpoint server/api/tasks.get.ts dan server/api/tasks.post.ts memakai defineEventHandler',
      'Halaman app/pages/index.vue menggunakan useFetch dan konfigurasi runtimeConfig di nuxt.config.ts',
      'Catatan Learning Log beserta bukti pengujian endpoint melalui Postman',
    ],
    accentGradient: 'from-cyan-600 to-teal-500',
    iconName: 'BracketsCurly',
    slides: [
      {
        slideNumber: 1,
        isSummary: true,
        layoutType: 'cover',
        badge: 'Pertemuan 12 • Bulan 3',
        title: 'TypeScript Fundamental & Nuxt.js Server API (Nitro)',
        subtitle:
          'Satukan antarmuka Vue dan REST API server dalam satu proyek bertipe aman.',
        contentJson: {
          eyebrow: 'Materi 2 • Bulan 3: Type-Safe Fullstack',
          highlights: [
            'Kuasai tipe primitif, interface, union, optional, dan Promise<T> di TypeScript.',
            'Pahami struktur folder app/, file-based routing, dan pengambilan data useFetch.',
            'Bangun endpoint REST API internal di server/api/ menggunakan mesin Nitro.',
            'Amankan kredensial server menggunakan konfigurasi runtimeConfig dan file .env.',
          ],
          stats: [
            { label: 'Bagian A', value: 'TypeScript Fundamental' },
            { label: 'Bagian B', value: 'Nuxt + Nitro Server API' },
            { label: 'Data Fetching', value: 'useFetch<T>' },
            { label: 'Minggu', value: 'Week 12' },
          ],
        },
      },
      {
        slideNumber: 2,
        isSummary: true,
        layoutType: 'summary',
        badge: 'Ringkasan Eksekutif',
        title: 'Mengapa TypeScript & Nuxt.js Menjadi Standar Industri?',
        subtitle:
          'TypeScript mendeteksi salah ketik properti sebelum kode dijalankan di peramban pengguna.',
        contentJson: {
          eyebrow: 'Executive Summary • Fullstack Terpadu',
          highlights: [
            'Kontrak tipe data menyamakan struktur objek antara frontend dan backend.',
            'Nuxt.js menggabungkan render antarmuka Vue 3 dengan server API Nitro.',
            'Folder server/api/ menggantikan kebutuhan server Express terpisah pada proyek terpadu.',
            'Satu interface di shared/types/ dipakai bersama oleh halaman dan API.',
          ],
          stats: [
            { label: 'JavaScript', value: 'Galat Muncul Saat Jalan' },
            { label: 'TypeScript', value: 'Galat Dicegah Saat Tulis' },
            { label: 'Nuxt + Nitro', value: 'UI + API Satu Proyek' },
          ],
        },
      },
      {
        slideNumber: 3,
        isSummary: true,
        layoutType: 'bento',
        badge: 'Peta Konsep & Agenda',
        title: 'Peta Konsep & Agenda Sesi 30/70',
        subtitle:
          'Susun kontrak tipe data terlebih dahulu sebelum membangun halaman dan endpoint Nuxt.',
        contentJson: {
          eyebrow: 'Roadmap Pertemuan 12 (2–3 Jam)',
          highlights: [
            'Mulai dari model data Task sederhana agar alur fullstack jelas.',
            'Uji setiap endpoint API sebelum mengintegrasikannya ke komponen halaman.',
          ],
          bentoCards: [
            {
              title: '1. Dasar TypeScript (15%)',
              tag: '30% Konsep',
              description:
                'Pelajari anotasi tipe, interface, union literal, properti opsional, dan fungsi async.',
              bullets: [
                'interface Task untuk struktur objek',
                'Union literal untuk status terbatas',
                'Promise<Task[]> untuk fungsi async',
              ],
            },
            {
              title: '2. Arsitektur Nuxt & Nitro (15%)',
              tag: '30% Konsep',
              description:
                'Kenali pemisahan folder app/ untuk klien dan server/ untuk endpoint backend.',
              bullets: [
                'app/pages/ otomatis menjadi rute halaman',
                'server/api/ otomatis menjadi endpoint REST',
                'runtimeConfig memisahkan variabel publik dan rahasia',
              ],
            },
            {
              title: '3. Praktik Kontrak & API (40%)',
              tag: '70% Praktik',
              description:
                'Buat shared/types/task.ts serta handler GET dan POST memakai defineEventHandler.',
              bullets: [
                'Validasi body request dengan readBody<T>',
                'Uji respons JSON lewat Postman',
              ],
            },
            {
              title: '4. Integrasi Halaman UI (30%)',
              tag: '70% Praktik',
              description:
                'Konsumsi endpoint internal dari app/pages/index.vue menggunakan composable useFetch bertipe.',
              bullets: [
                'Tipe respons terbaca otomatis di template',
                'Panggil refresh() setelah menambah data',
              ],
            },
          ],
        },
      },
      {
        slideNumber: 4,
        isSummary: false,
        layoutType: 'bento',
        badge: '30% Konsep • Analogi',
        title: 'Analogi TypeScript & Arsitektur Nitro di Nuxt.js',
        subtitle:
          'Pahami batas eksekusi antara kode peramban dan kode server di Nuxt.',
        contentJson: {
          eyebrow: 'Analogi & Konsep Fundamental',
          highlights: [
            'TypeScript memvalidasi tipe saat kompilasi lalu menghasilkan JavaScript murni.',
            'Kode di dalam server/api/ tidak pernah dikirim ke peramban klien.',
          ],
          bentoCards: [
            {
              title: 'TypeScript = Formulir Bervalidasi',
              tag: 'Static Typing',
              description:
                'Setiap kolom memiliki aturan tipe jelas sehingga data salah tertolak sejak penulisan kode.',
              bullets: [
                'Inferensi tipe otomatis dari nilai awal',
                'Tanda ? menandai properti opsional',
              ],
            },
            {
              title: 'interface vs type',
              tag: 'Data Modeling',
              description:
                'Gunakan interface untuk struktur model objek dan type untuk union atau alias.',
              bullets: [
                'Union: "todo" | "in_progress" | "done"',
                'Generic: ApiResponse<T> untuk pembungkus JSON',
              ],
            },
            {
              title: 'Nuxt = Ruang Makan & Dapur',
              tag: 'Fullstack',
              description:
                'Folder app/ melayani tampilan pengguna, sedangkan server/ Nitro mengolah logika dan database.',
              bullets: [
                'Rute otomatis berdasarkan nama file',
                'Impor otomatis ref, computed, dan useFetch',
              ],
            },
            {
              title: 'Keamanan runtimeConfig',
              tag: 'Security',
              description:
                'Hanya properti di dalam runtimeConfig.public yang boleh diakses oleh peramban.',
              bullets: [
                'Kredensial database tetap aman di server',
                'Variabel NUXT_* terpetakan otomatis dari .env',
              ],
            },
          ],
        },
      },
      {
        slideNumber: 5,
        isSummary: false,
        layoutType: 'bento',
        badge: 'Bedah Teknis • Sintaks Inti',
        title: 'Sintaks Kontrak TypeScript, Nitro Handler & useFetch',
        subtitle:
          'Pola kode standar untuk berbagi tipe data antara server Nitro dan halaman Vue.',
        contentJson: {
          eyebrow: 'Bedah Teknis Bagian A & B',
          highlights: [
            'Akhiran nama file menentukan metode HTTP seperti tasks.get.ts dan tasks.post.ts.',
            'Gunakan useFetch saat pemuatan halaman dan $fetch saat aksi tombol.',
          ],
          bentoCards: [
            {
              title: 'Kontrak Tipe Bersama',
              tag: 'shared/types/task.ts',
              description:
                'Satukan definisi model, payload input, dan pembungkus respons API.',
              code: {
                filename: 'shared/types/task.ts',
                language: 'typescript',
                snippet: `export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}`,
              },
            },
            {
              title: 'Fungsi Async & Promise<T>',
              tag: 'useTaskHelper.ts',
              description:
                'Tentukan tipe kembalian Promise<T> agar hasil await tervalidasi otomatis.',
              code: {
                filename: 'app/composables/useTaskHelper.ts',
                language: 'typescript',
                snippet: `import type { ApiResponse, Task } from '../../shared/types/task';

export async function loadTasks(): Promise<Task[]> {
  const res = await $fetch<ApiResponse<Task[]>>('/api/tasks');
  return res.data;
}

export function countDone(tasks: Task[]): number {
  return tasks.filter((t) => t.status === 'done').length;
}`,
              },
            },
            {
              title: 'Endpoint Server Nitro',
              tag: 'server/api/tasks.get.ts',
              description:
                'Kembalikan respons JSON bertipe sesuai kontrak ApiResponse dari sisi server.',
              code: {
                filename: 'server/api/tasks.get.ts',
                language: 'typescript',
                snippet: `import type { ApiResponse, Task } from '../../shared/types/task';

export default defineEventHandler(async (event): Promise<ApiResponse<Task[]>> => {
  const config = useRuntimeConfig(event);
  const tasks: Task[] = [
    { id: 1, title: \`Belajar \${config.public.appName}\`, status: 'done' },
  ];
  return { success: true, data: tasks };
});`,
              },
            },
            {
              title: 'Pengambilan Data SSR',
              tag: 'app/pages/index.vue',
              description:
                'Panggil endpoint internal dengan useFetch untuk mendukung render sisi server.',
              code: {
                filename: 'app/pages/index.vue',
                language: 'vue',
                snippet: `<script setup lang="ts">
import type { ApiResponse, Task } from '../../shared/types/task';
const { data, pending, refresh } = await useFetch<ApiResponse<Task[]>>('/api/tasks');
</script>
<template>
  <p v-if="pending">Memuat data...</p>
  <ul v-else>
    <li v-for="t in data?.data ?? []" :key="t.id">{{ t.title }}</li>
  </ul>
  <button @click="refresh()">Muat Ulang</button>
</template>`,
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
        title: 'Anti-Pattern TypeScript & Nuxt vs Arsitektur Aman',
        subtitle:
          'Hindari penggunaan tipe any dan jangan pernah mengakses database dari komponen Vue.',
        contentJson: {
          eyebrow: 'Code Quality Review • TypeScript & Nuxt',
          highlights: [
            'Tipe any mematikan pemeriksaan tipe dan menyembunyikan potensi bug.',
            'Koneksi database wajib terisolasi di dalam folder server/.',
          ],
          comparison: {
            badTitle: '✕ Anti-Pattern Berbahaya',
            badPoints: [
              'Memakai tipe any sehingga kesalahan properti lolos dari kompilasi.',
              'Mengimpor driver database atau kredensial rahasia di komponen .vue.',
              'Memanggil $fetch langsung di setup hingga memicu request ganda.',
            ],
            badCode: {
              filename: 'BadPage.vue',
              language: 'vue',
              snippet: `<script setup lang="ts">
// Salah: akses database dari klien dan pemakaian tipe any
import mysql from 'mysql2/promise';
const db: any = await mysql.createConnection({ password: '123' });
const tasks: any = await db.query('SELECT * FROM tasks');
</script>`,
            },
            goodTitle: '✓ Standar Software Engineer',
            goodPoints: [
              'Bagikan interface ketat melalui folder shared/types/ untuk seluruh lapisan.',
              'Simpan kredensial database di runtimeConfig khusus sisi server.',
              'Gunakan useFetch pada setup halaman agar sinkron saat SSR.',
            ],
            goodCode: {
              filename: 'nuxt.config.ts',
              language: 'typescript',
              snippet: `export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  runtimeConfig: {
    dbHost: process.env.NUXT_DB_HOST || '127.0.0.1',
    dbUser: process.env.NUXT_DB_USER || 'root',
    dbPassword: process.env.NUXT_DB_PASSWORD || '',
    dbName: process.env.NUXT_DB_NAME || 'taskflow_db',
    public: { appName: 'TaskFlow Nuxt' },
  },
});`,
            },
          },
        },
      },
      {
        slideNumber: 7,
        isSummary: false,
        layoutType: 'practice',
        badge: '70% Hands-On • PBL',
        title: 'Langkah Praktik: Proyek Nuxt + TypeScript + Server API',
        subtitle:
          'Siapkan fondasi proyek Nuxt fullstack sebelum dihubungkan ke MySQL pada Pertemuan 13.',
        contentJson: {
          eyebrow: '70% Praktik Langsung • Nuxt.js & Nitro',
          highlights: [
            'Pisahkan folder app/, server/api/, dan shared/types/ sejak awal proyek.',
            'Pastikan pemeriksaan npx nuxi typecheck lulus tanpa pesan galat.',
          ],
          practiceSteps: [
            {
              step: 1,
              title: 'Inisialisasi Proyek Nuxt Baru',
              description:
                'Buat proyek menggunakan CLI resmi Nuxt, instal paket, dan nyalakan server lokal.',
              command:
                'npx nuxi@latest init taskflow-nuxt && cd taskflow-nuxt && npm install && npm run dev',
            },
            {
              step: 2,
              title: 'Susun Struktur Direktori Fullstack',
              description:
                'Siapkan direktori halaman, komponen, server API, serta kontrak tipe bersama.',
              code: `taskflow-nuxt/
├── app/
│   ├── components/
│   └── pages/index.vue
├── server/
│   ├── api/tasks.get.ts
│   └── api/tasks.post.ts
├── shared/types/task.ts
└── nuxt.config.ts`,
            },
            {
              step: 3,
              title: 'Buat Kontrak Tipe & Handler POST',
              description:
                'Definisikan interface di shared/types/task.ts lalu validasi input pada tasks.post.ts.',
              code: `import type { CreateTaskPayload, Task } from '../../shared/types/task';

export default defineEventHandler(async (event) => {
  const body = await readBody<CreateTaskPayload>(event);
  if (!body?.title?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Judul wajib diisi' });
  }
  const task: Task = { id: Date.now(), title: body.title.trim(), status: 'todo' };
  return { success: true, data: task };
});`,
            },
            {
              step: 4,
              title: 'Tampilkan Data dengan useFetch & Typecheck',
              description:
                'Hubungkan halaman utama ke /api/tasks, uji via Postman, lalu jalankan validasi tipe.',
              command: 'npx nuxi typecheck',
            },
          ],
        },
      },
      {
        slideNumber: 8,
        isSummary: false,
        layoutType: 'quiz',
        badge: 'Kuis & Referensi',
        title: 'Kuis TypeScript + Nuxt, Referensi & Tugas Mingguan',
        subtitle:
          'Evaluasi penguasaan kontrak tipe TypeScript dan cara kerja server API Nitro.',
        contentJson: {
          eyebrow: 'Evaluasi Pemahaman & Pustaka Terkurasi',
          highlights: [
            'Jalankan npx nuxi typecheck hingga bersih sebelum mengunggah tugas.',
            'Pelajari dokumentasi resmi Nuxt untuk pendalaman fitur server Nitro.',
          ],
          quizItems: [
            {
              question:
                'Apa perbedaan utama antara interface dan type di TypeScript?',
              hint: 'Bandingkan struktur objek dengan kombinasi union literal.',
              answer:
                'Interface dirancang untuk mendefinisikan bentuk objek yang dapat diperluas. Type mendukung union literal (seperti "todo" | "done"), alias primitif, serta tuple.',
            },
            {
              question:
                'Apa fungsi mesin Nitro di Nuxt.js dan bagaimana metode HTTP dibedakan?',
              hint: 'Perhatikan akhiran nama file di dalam server/api/.',
              answer:
                'Nitro menjalankan render sisi server dan endpoint REST API. Metode HTTP dibedakan lewat akhiran nama file seperti tasks.get.ts dan tasks.post.ts.',
            },
            {
              question:
                'Mengapa kredensial database ditaruh di runtimeConfig, bukan di runtimeConfig.public?',
              hint: 'Ingat batas akses antara server dan peramban.',
              answer:
                'Properti di luar runtimeConfig.public hanya tersedia di sisi server sehingga kata sandi database tidak terkirim ke peramban klien.',
            },
            {
              question:
                'Apa arti deklarasi async function getTasks(): Promise<Task[]>?',
              hint: 'Tinjau nilai kembalian fungsi asynchronous.',
              answer:
                'Fungsi async tersebut mengembalikan objek Promise yang menghasilkan array bertipe Task[] saat di-await.',
            },
          ],
          references: [
            {
              title: 'TypeScript untuk Pemula, Bagian 1: Memulai',
              url: 'https://code.tutsplus.com/id/tutorials/typescript-for-beginners-getting-started--cms-29329',
              author: 'Tutsplus',
              category: 'TypeScript (Free Programming Books ID)',
              lang: 'ID',
              type: 'Book',
            },
            {
              title: 'Tutorial TypeScript Dasar',
              url: 'https://www.youtube.com/watch?v=C_C64faSO4c',
              author: 'Eko Kurniawan Khannedy (Programmer Zaman Now)',
              category: 'TypeScript (Free Courses ID)',
              lang: 'ID',
              type: 'Course',
            },
            {
              title: 'TypeScript Dasar & OOP TypeScript',
              url: 'https://www.youtube.com/playlist?list=PLnQvfeVegcJbjCnML6FdusK-rl-oDRMXJ',
              author: 'Nusendra Hanggarawan',
              category: 'TypeScript (Free Courses ID)',
              lang: 'ID',
              type: 'Course',
            },
            {
              title: 'Belajar TypeScript Dasar Bahasa Indonesia',
              url: 'https://www.youtube.com/playlist?list=PLiuHSY2x882Z4NSJGNq0eB9Fz6tIx-CgO',
              author: 'Imam Farisi',
              category: 'TypeScript (Free Courses ID)',
              lang: 'ID',
              type: 'Course',
            },
            {
              title: 'TypeScript Handbook (Official)',
              url: 'https://www.typescriptlang.org/docs/handbook/intro.html',
              author: 'Microsoft TypeScript',
              category: 'TypeScript Official',
              lang: 'EN',
              type: 'Docs',
            },
            {
              title: 'Nuxt Documentation',
              url: 'https://nuxt.com/docs',
              author: 'Nuxt Core Team',
              category: 'Nuxt.js Official',
              lang: 'EN',
              type: 'Docs',
            },
            {
              title: 'Nuxt || Server Directory (Nitro)',
              url: 'https://nuxt.com/docs/guide/directory-structure/server',
              author: 'Nuxt Core Team',
              category: 'Nuxt Server API',
              lang: 'EN',
              type: 'Docs',
            },
            {
              title: 'Nuxt || Data Fetching (useFetch)',
              url: 'https://nuxt.com/docs/getting-started/data-fetching',
              author: 'Nuxt Core Team',
              category: 'Nuxt Data Fetching',
              lang: 'EN',
              type: 'Docs',
            },
          ],
          weeklyAssignment: {
            week: 12,
            title: 'Latihan TypeScript dan Endpoint Nuxt',
            description:
              'Buat kontrak tipe TypeScript lalu integrasikan dengan 1 halaman Nuxt dan 2 endpoint server/api.',
          },
        },
      },
      {
        slideNumber: 9,
        isSummary: false,
        layoutType: 'task',
        badge: 'Task Pertemuan 12',
        title: 'Deliverable Wajib & Pengumpulan Learning Log',
        subtitle:
          'Kumpulkan proyek Nuxt bertipe aman sebagai fondasi sesi Capstone Pertemuan 13.',
        contentJson: {
          eyebrow: 'Submission Checklist • Pertemuan 12',
          highlights: [
            'Masukkan file .env ke .gitignore dan sertakan template .env.example.',
            'Pastikan seluruh model data bebas dari penggunaan tipe any.',
          ],
          deliverables: [
            'Repositori GitHub proyek Nuxt.js dengan hasil npx nuxi typecheck bebas galat',
            'File shared/types/task.ts berisi model tipe lengkap tanpa tipe any',
            'Endpoint server/api/tasks.get.ts dan tasks.post.ts yang merespons JSON terstruktur',
            'Halaman app/pages/index.vue yang memakai useFetch serta konfigurasi runtimeConfig',
            'Catatan Learning Log lengkap beserta tautan commit GitHub',
          ],
          learningLogFields: STANDARD_LEARNING_LOG_FIELDS,
          mentorTip:
            'Perlakukan garis merah TypeScript sebagai pemeriksa dini yang mencegah kesalahan tipe data lolos ke produksi.',
        },
      },
    ],
  },
  {
    orderIndex: 14,
    month: 3,
    code: 'P14',
    slug: 'pertemuan-14-praktik-capstone-nuxt-mysql',
    sessionType: 'Praktik',
    title: 'Praktik Capstone: TaskFlow & InternFlow Fullstack Nuxt + MySQL',
    subtitle:
      'Hubungkan Nuxt Server API ke database MySQL menggunakan connection pool, parameterized query, dan validasi input.',
    summaryText:
      'Bangun aplikasi capstone CRUD penuh dengan antarmuka Vue, API Nitro, dan penyimpanan MySQL yang aman.',
    taskPrompt:
      'Selesaikan aplikasi CRUD fullstack Nuxt.js + TypeScript + MySQL lengkap dengan skema SQL dan dokumentasi README.',
    taskDeliverables: [
      'Aplikasi CRUD fullstack Nuxt + TypeScript + MySQL berjalan utuh (List, Add, Edit, Complete, Delete)',
      'Koneksi MySQL di server/utils/db.ts memakai mysql2/promise dan runtimeConfig',
      'Seluruh query SQL menggunakan parameterized query (?) serta validasi status HTTP',
      'File database/schema.sql dan README.md berisi panduan menjalankan proyek',
      'Catatan Learning Log progres capstone beserta tautan repositori GitHub',
    ],
    accentGradient: 'from-blue-600 to-indigo-600',
    iconName: 'Stack',
    slides: [
      {
        slideNumber: 1,
        isSummary: true,
        layoutType: 'cover',
        badge: 'Pertemuan 13 • Bulan 3',
        title: 'Praktik Capstone: TaskFlow & InternFlow Fullstack Nuxt + MySQL',
        subtitle:
          'Integrasikan antarmuka Vue 3 dan TypeScript dengan database relasional MySQL melalui Nitro.',
        contentJson: {
          eyebrow: 'Sesi Praktik Capstone • 70% Hands-On Coding',
          highlights: [
            'Bangun fitur ringkasan dashboard, tampil, tambah, ubah, selesai, dan hapus.',
            'Hubungkan MySQL lokal secara eksklusif melalui folder server/api/ Nuxt.',
            'Terapkan parameterized query (?), variabel environment, serta penanganan galat HTTP.',
            'Tambahkan filter status atau pencarian sebagai target pengayaan opsional.',
          ],
          stats: [
            { label: 'Target CRUD', value: '5 Endpoint REST' },
            { label: 'Database', value: 'MySQL (mysql2/promise)' },
            { label: 'Keamanan', value: 'Parameterized Query ?' },
            { label: 'Minggu', value: 'Week 13' },
          ],
        },
      },
      {
        slideNumber: 2,
        isSummary: true,
        layoutType: 'summary',
        badge: 'Ringkasan Eksekutif',
        title: 'Evolusi Arsitektur 3 Bulan: Dari Statis ke Fullstack',
        subtitle:
          'Lihat perkembangan arsitektur TaskFlow dari penyimpanan peramban hingga aplikasi fullstack terpadu.',
        contentJson: {
          eyebrow: 'Executive Summary • TaskFlow tahap awal -> dengan API -> fullstack',
          highlights: [
            'Bulan 1: HTML, CSS, dan Vanilla JS dengan penyimpanan localStorage.',
            'Bulan 2: Frontend terpisah berkomunikasi dengan Express.js dan database MySQL.',
            'Bulan 3: Halaman Vue, API Nitro, dan MySQL dalam satu proyek.',
            'Fokus utama adalah alur CRUD fullstack yang stabil dan aman.',
          ],
          stats: [
            { label: 'TaskFlow tahap awal', value: 'Vanilla + localStorage' },
            { label: 'TaskFlow dengan API', value: 'Express + MySQL' },
            { label: 'TaskFlow fullstack', value: 'Fullstack Nuxt + TS + MySQL' },
          ],
        },
      },
      {
        slideNumber: 3,
        isSummary: true,
        layoutType: 'bento',
        badge: 'Peta Fitur & Ketentuan',
        title: 'Spesifikasi Fitur Minimum & Ketentuan Teknis Capstone',
        subtitle:
          'Penuhi seluruh syarat inti sebelum mengerjakan fitur tambahan.',
        contentJson: {
          eyebrow: 'Spesifikasi Proyek Capstone Bulan 3',
          highlights: [
            'Pisahkan rute halaman, komponen UI, handler API, dan utilitas database.',
            'Seluruh ketentuan teknis ini akan diaudit pada sesi Code Review.',
          ],
          bentoCards: [
            {
              title: 'Fitur Minimum Wajib',
              tag: 'Core CRUD',
              description:
                'Seluruh operasi utama TaskFlow berjalan utuh dengan data tersimpan permanen di MySQL.',
              bullets: [
                'Dashboard ringkasan jumlah dan status tugas',
                'Tambah, ubah, tandai selesai, dan hapus',
                'Tampilan responsif di desktop maupun ponsel',
              ],
            },
            {
              title: 'Ketentuan Teknis Wajib',
              tag: 'Engineering Rules',
              description:
                'Standar keamanan dan kualitas kode yang wajib dipenuhi pada repositori capstone.',
              bullets: [
                'TypeScript aktif pada model dan API',
                'Konfigurasi kredensial melalui .env dan runtimeConfig',
                'Parameterized query (?) serta validasi status HTTP',
              ],
            },
            {
              title: 'Target Pengayaan Opsional',
              tag: 'Stretch Goal',
              description:
                'Fitur tambahan setelah seluruh fungsi CRUD utama berjalan stabil tanpa bug.',
              bullets: [
                'Filter daftar berdasarkan status tugas',
                'Pencarian kata kunci judul tugas',
                'Relasi tabel pengguna atau login dasar',
              ],
            },
            {
              title: 'Kelengkapan Paket Proyek',
              tag: 'Deliverable',
              description:
                'Siapkan repositori agar orang lain dapat menjalankan ulang proyek dengan mudah.',
              bullets: [
                'Kode sumber bersih di GitHub',
                'File skema dan data awal .sql',
                'Panduan instalasi lengkap pada README.md',
              ],
            },
          ],
        },
      },
      {
        slideNumber: 4,
        isSummary: false,
        layoutType: 'bento',
        badge: 'Konsep Alur Sistem',
        title: 'Alur Request Fullstack & Keamanan Lapisan Database',
        subtitle:
          'Pahami kerja connection pool, perlindungan SQL Injection, dan kode status HTTP.',
        contentJson: {
          eyebrow: 'Arsitektur Fullstack Nuxt + MySQL',
          highlights: [
            'Hanya server Nitro yang boleh memegang kredensial dan koneksi MySQL.',
            'Gunakan kode status HTTP akurat agar klien mudah menangani respons.',
          ],
          bentoCards: [
            {
              title: 'Connection Pool Efisien',
              tag: 'server/utils/db.ts',
              description:
                'mysql2.createPool() menyediakan jalur koneksi siap pakai tanpa membuka koneksi baru tiap request.',
              bullets: [
                'Satu instance pool untuk seluruh aplikasi',
                'Dipakai bersama oleh semua handler API',
              ],
            },
            {
              title: 'Parameterized Query Aman',
              tag: 'Anti SQL Injection',
              description:
                'Tanda tanya (?) memisahkan perintah SQL dari teks input pengguna berbahaya.',
              bullets: [
                'Gunakan db.execute(sql, [params]) secara konsisten',
                'Jangan gabungkan input memakai template string',
              ],
            },
            {
              title: 'Validasi & Kode HTTP',
              tag: 'Error Handling',
              description:
                'Kirim status 400 untuk input salah, 404 jika kosong, dan 500 saat gagal.',
              bullets: [
                'Lempar galat via createError({ statusCode })',
                'Sembunyikan detail internal SQL dari pengguna',
              ],
            },
            {
              title: 'Kompatibilitas MySQL & MariaDB',
              tag: 'XAMPP',
              description:
                'Driver mysql2 kompatibel dengan MySQL maupun MariaDB bawaan XAMPP pada port 3306.',
              bullets: [
                'Simpan cadangan ekspor .sql secara berkala',
              ],
            },
          ],
        },
      },
      {
        slideNumber: 5,
        isSummary: false,
        layoutType: 'bento',
        badge: 'Bedah Teknis • Fullstack Code',
        title: 'Implementasi Pool MySQL, Endpoint CRUD & Skema SQL',
        subtitle:
          'Referensi kode produksi untuk koneksi database, validasi input, dan rute dinamis.',
        contentJson: {
          eyebrow: 'Referensi Implementasi Capstone',
          highlights: [
            'Instal paket driver database terlebih dahulu menggunakan perintah npm install mysql2.',
            'Gunakan tipe ResultSetHeader agar hasil operasi tulis terketik rapi.',
          ],
          bentoCards: [
            {
              title: '1. Utilitas Connection Pool',
              tag: 'server/utils/db.ts',
              description:
                'Buat singleton pool MySQL yang membaca kredensial dari runtimeConfig server.',
              code: {
                filename: 'server/utils/db.ts',
                language: 'typescript',
                snippet: `import mysql from 'mysql2/promise';
let pool: mysql.Pool | null = null;

export function getDbPool(): mysql.Pool {
  if (!pool) {
    const cfg = useRuntimeConfig();
    pool = mysql.createPool({
      host: cfg.dbHost, port: Number(cfg.dbPort || 3306),
      user: cfg.dbUser, password: cfg.dbPassword, database: cfg.dbName,
    });
  }
  return pool;
}`,
              },
            },
            {
              title: '2. Endpoint POST Bervalidasi',
              tag: 'server/api/tasks.post.ts',
              description:
                'Validasi panjang judul sebelum menjalankan query INSERT berparameter.',
              code: {
                filename: 'server/api/tasks.post.ts',
                language: 'typescript',
                snippet: `import type { ResultSetHeader } from 'mysql2/promise';
import type { CreateTaskPayload } from '../../shared/types/task';

export default defineEventHandler(async (event) => {
  const body = await readBody<CreateTaskPayload>(event);
  const title = body?.title?.trim() ?? '';
  if (title.length < 3) {
    throw createError({ statusCode: 400, statusMessage: 'Judul minimal 3 karakter' });
  }
  const [res] = await getDbPool().execute<ResultSetHeader>(
    'INSERT INTO tasks (title, description, status) VALUES (?, ?, ?)',
    [title, body.description?.trim() ?? null, 'todo'],
  );
  return { success: true, id: res.insertId };
});`,
              },
            },
            {
              title: '3. Rute Dinamis PUT [id]',
              tag: 'server/api/tasks/[id].put.ts',
              description:
                'Ambil parameter ID rute dan periksa affectedRows untuk mendeteksi data kosong.',
              code: {
                filename: 'server/api/tasks/[id].put.ts',
                language: 'typescript',
                snippet: `import type { ResultSetHeader } from 'mysql2/promise';
import type { TaskStatus } from '../../../shared/types/task';

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'));
  if (!Number.isInteger(id) || id <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'ID tidak valid' });
  }
  const body = await readBody<{ title?: string; status?: TaskStatus }>(event);
  const [res] = await getDbPool().execute<ResultSetHeader>(
    'UPDATE tasks SET title = COALESCE(?, title), status = COALESCE(?, status) WHERE id = ?',
    [body.title?.trim() ?? null, body.status ?? null, id],
  );
  if (res.affectedRows === 0) throw createError({ statusCode: 404, statusMessage: 'Data kosong' });
  return { success: true };
});`,
              },
            },
            {
              title: '4. Skema Tabel Tasks',
              tag: 'database/schema.sql',
              description:
                'Definisi tabel relasional dengan kolom status bertipe ENUM dan pencatat waktu otomatis.',
              code: {
                filename: 'database/schema.sql',
                language: 'sql',
                snippet: `CREATE DATABASE IF NOT EXISTS taskflow_db;
USE taskflow_db;

CREATE TABLE IF NOT EXISTS tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(180) NOT NULL,
  description TEXT NULL,
  status ENUM('todo', 'in_progress', 'done') NOT NULL DEFAULT 'todo',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);`,
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
        title: 'Query Rawan Retas vs Implementasi Aman',
        subtitle:
          'Bandingkan penggabungan string SQL berbahaya dengan query berparameter dan validasi ketat.',
        contentJson: {
          eyebrow: 'Security & Reliability Check • Capstone',
          highlights: [
            'Penggabungan string pada SQL membuka celah keamanan SQL Injection.',
            'Periksa selalu nilai affectedRows saat mengubah atau menghapus baris.',
          ],
          comparison: {
            badTitle: '✕ Rawan SQL Injection',
            badPoints: [
              'Menyisipkan input pengguna langsung ke dalam template string SQL.',
              'Melewatkan validasi format ID dan pemeriksaan keberadaan baris data.',
              'Mengekspos pesan galat mentah MySQL langsung ke antarmuka klien.',
            ],
            badCode: {
              filename: 'BadHandler.ts',
              language: 'typescript',
              snippet: `// Bahaya: penggabungan string membuka celah SQL Injection
const id = getRouterParam(event, 'id');
const body = await readBody(event);
await db.query(
  \`UPDATE tasks SET title = '\${body.title}' WHERE id = \${id}\`,
);
return { ok: true };`,
            },
            goodTitle: '✓ Parameterized Query & Validasi',
            goodPoints: [
              'Memakai placeholder ? pada setiap pemanggilan db.execute(sql, params).',
              'Memvalidasi ID numerik dan payload sebelum menjalankan query database.',
              'Mengembalikan status HTTP 400 atau 404 dengan pesan terukur.',
            ],
            goodCode: {
              filename: 'GoodHandler.ts',
              language: 'typescript',
              snippet: `const id = Number(getRouterParam(event, 'id'));
if (!Number.isInteger(id) || id <= 0) {
  throw createError({ statusCode: 400, statusMessage: 'ID tidak valid' });
}
const [res] = await db.execute<ResultSetHeader>(
  'DELETE FROM tasks WHERE id = ?',
  [id],
);
if (res.affectedRows === 0) {
  throw createError({ statusCode: 404, statusMessage: 'Data tidak ditemukan' });
}`,
            },
          },
        },
      },
      {
        slideNumber: 7,
        isSummary: false,
        layoutType: 'practice',
        badge: '70% Hands-On • Capstone',
        title: 'Langkah Praktik: Merakit Capstone TaskFlow Fullstack',
        subtitle:
          'Sambungkan antarmuka Vue, API Nitro, dan database MySQL secara bertahap.',
        contentJson: {
          eyebrow: '70% Praktik Langsung • Fullstack Nuxt + MySQL',
          highlights: [
            'Uji setiap endpoint dengan Postman sebelum menyambungkannya ke antarmuka.',
            'Lakukan commit Git bertahap setiap kali satu fitur selesai.',
          ],
          practiceSteps: [
            {
              step: 1,
              title: 'Siapkan Database MySQL & Driver mysql2',
              description:
                'Aktifkan MySQL di XAMPP, impor database/schema.sql lewat phpMyAdmin, lalu instal paket mysql2.',
              command: 'npm install mysql2',
            },
            {
              step: 2,
              title: 'Konfigurasi .env & Utilitas Pool Database',
              description:
                'Isi kredensial NUXT_DB_* di file .env, petakan pada runtimeConfig, lalu buat server/utils/db.ts.',
              code: `NUXT_DB_HOST=127.0.0.1
NUXT_DB_PORT=3306
NUXT_DB_USER=root
NUXT_DB_PASSWORD=
NUXT_DB_NAME=taskflow_db`,
            },
            {
              step: 3,
              title: 'Bangun Endpoint CRUD & Antarmuka Dashboard',
              description:
                'Selesaikan kelima endpoint di server/api/ lalu hubungkan kartu ringkasan, form, dan daftar di index.vue.',
              code: `server/
├── api/
│   ├── tasks.get.ts
│   ├── tasks.post.ts
│   └── tasks/
│       ├── [id].put.ts
│       └── [id].delete.ts
└── utils/db.ts`,
            },
            {
              step: 4,
              title: 'Tulis Dokumentasi README & Validasi Akhir',
              description:
                'Dokumentasikan langkah instalasi lokal di README.md, jalankan pemeriksaan tipe, lalu simpan commit.',
              command:
                'npx nuxi typecheck && git add . && git commit -m "feat: fullstack nuxt mysql capstone"',
            },
          ],
        },
      },
      {
        slideNumber: 8,
        isSummary: false,
        layoutType: 'quiz',
        badge: 'Kuis & Referensi',
        title: 'Kuis Arsitektur Fullstack, Referensi & Tugas Mingguan',
        subtitle:
          'Pastikan Anda memahami alur data dari komponen halaman hingga tabel MySQL.',
        contentJson: {
          eyebrow: 'Evaluasi Pemahaman & Pustaka Terkurasi',
          highlights: [
            'Kemampuan menjelaskan alur kode jauh lebih bernilai daripada sekadar fitur jadi.',
          ],
          quizItems: [
            {
              question:
                'Mengapa aplikasi Nuxt wajib mengakses MySQL melalui server/api/, bukan dari halaman Vue?',
              hint: 'Tinjau keamanan kredensial dan lingkungan eksekusi peramban.',
              answer:
                'Peramban tidak mendukung koneksi TCP langsung ke MySQL dan akan membocorkan kata sandi database. Folder server/api/ berjalan aman di sisi server Nitro.',
            },
            {
              question:
                'Apa kegunaan placeholder ? pada db.execute("SELECT * FROM tasks WHERE id = ?", [id])?',
              hint: 'Perlindungan keamanan query.',
              answer:
                'Parameterized query memisahkan perintah SQL dari nilai input pengguna sehingga mencegah serangan SQL Injection.',
            },
            {
              question:
                'Bagaimana handler API mengetahui bahwa ID tugas yang diubah atau dihapus tidak ditemukan?',
              hint: 'Periksa properti pada ResultSetHeader.',
              answer:
                'Handler memeriksa kondisi result.affectedRows === 0 setelah query dijalankan, lalu mengembalikan status 404 melalui createError.',
            },
            {
              question:
                'Apa perbedaan penggunaan useFetch dan $fetch pada aplikasi Nuxt?',
              hint: 'Bandingkan pemuatan awal halaman dengan aksi klik pengguna.',
              answer:
                'Gunakan useFetch pada setup halaman agar data termuat sinkron saat SSR. Gunakan $fetch di dalam fungsi event seperti submit form POST, PUT, atau DELETE.',
            },
          ],
          references: [
            {
              title: 'Nuxt Documentation',
              url: 'https://nuxt.com/docs',
              author: 'Nuxt Core Team',
              category: 'Fullstack Framework',
              lang: 'EN',
              type: 'Docs',
            },
            {
              title: 'Nuxt Server API (Nitro)',
              url: 'https://nuxt.com/docs/guide/directory-structure/server',
              author: 'Nuxt Core Team',
              category: 'Backend Nitro',
              lang: 'EN',
              type: 'Docs',
            },
            {
              title: 'MySQL Documentation',
              url: 'https://dev.mysql.com/doc/',
              author: 'Oracle MySQL',
              category: 'Relational Database',
              lang: 'EN',
              type: 'Docs',
            },
            {
              title: 'Tutorial MySQL untuk Pemula Hingga Mahir',
              url: 'https://umardanny.com/tutorial-mysql-untuk-pemula-hingga-mahir-ebook-download-pdf/',
              author: 'Umar Danny',
              category: 'MySQL (Free Programming Books ID)',
              lang: 'ID',
              type: 'Book',
            },
            {
              title: 'MySQL Tutorial Bahasa Indonesia',
              url: 'https://www.youtube.com/playlist?list=PL-CtdCApEFH_P2_2zR6pvDublvpD3fF6W',
              author: 'Eko Kurniawan Khannedy (Programmer Zaman Now)',
              category: 'MySQL (Free Courses ID)',
              lang: 'ID',
              type: 'Course',
            },
            {
              title: 'Full Stack MEVN Application (Pembanding Arsitektur)',
              url: 'https://medium.com/@anaida07/mevn-stack-application-part-1-3a27b61dcae0',
              author: 'Project Based Learning',
              category: 'Project-Based Learning',
              lang: 'EN',
              type: 'PBL',
            },
          ],
          weeklyAssignment: {
            week: 13,
            title: 'Menyelesaikan Fitur Capstone Fullstack',
            description:
              'Tuntaskan seluruh fitur CRUD TaskFlow beserta skema .sql dan README.md di repositori GitHub.',
          },
        },
      },
      {
        slideNumber: 9,
        isSummary: false,
        layoutType: 'task',
        badge: 'Task Pertemuan 13',
        title: 'Deliverable Wajib & Pengumpulan Learning Log',
        subtitle:
          'Pastikan aplikasi capstone berjalan stabil di lokal sebelum dipresentasikan pada Pertemuan 14.',
        contentJson: {
          eyebrow: 'Submission Checklist • Pertemuan 13',
          highlights: [
            'Pastikan fitur CRUD inti bebas bug sebelum menambah fitur pengayaan.',
          ],
          deliverables: [
            'Repositori GitHub lengkap (app/, server/api/, shared/types/, database/schema.sql, README.md)',
            'Bukti seluruh operasi CRUD tersimpan permanen di database MySQL',
            'Bukti pengujian API dan validasi status 400/404 melalui Postman atau DevTools',
            'Catatan Learning Log berisi kendala teknis SQL atau TypeScript yang diselesaikan',
          ],
          learningLogFields: STANDARD_LEARNING_LOG_FIELDS,
          mentorTip:
            'Periksa log terminal tempat npm run dev berjalan saat muncul galat 500 agar pesan asli Nitro dan MySQL langsung terlihat.',
        },
      },
    ],
  },
  {
    orderIndex: 15,
    month: 3,
    code: 'P15',
    slug: 'pertemuan-15-presentasi-code-review-deployment',
    sessionType: 'Presentasi',
    title: 'Presentasi Fullstack, Code Review & Deployment Railway',
    subtitle:
      'Presentasikan arsitektur capstone, tindak lanjuti catatan code review mentor, dan latih proses deployment ke Railway.',
    summaryText:
      'Sesi demo proyek fullstack, peninjauan kualitas kode dan GitHub, serta latihan deployment cloud beserta cadangan .sql.',
    taskPrompt:
      'Selesaikan perbaikan hasil code review mentor, siapkan cadangan database .sql, dan verifikasi build produksi atau deploy Railway.',
    taskDeliverables: [
      'Commit perbaikan hasil Code Review pada repositori GitHub TaskFlow fullstack',
      'File cadangan database .sql hasil ekspor phpMyAdmin atau mysqldump',
      'File .env.example dan README.md berisi panduan instalasi serta deployment',
      'Tautan deployment Railway atau bukti uji build produksi lokal beserta Postman',
      'Catatan Learning Log berisi daftar perbaikan code review yang dituntaskan',
    ],
    accentGradient: 'from-purple-600 to-fuchsia-600',
    iconName: 'CloudArrowUp',
    slides: [
      {
        slideNumber: 1,
        isSummary: true,
        layoutType: 'cover',
        badge: 'Pertemuan 14 • Bulan 3',
        title: 'Presentasi Fullstack, Code Review & Deployment Railway',
        subtitle:
          'Uji kesiapan proyek bersama mentor, rapikan kode, dan pelajari alur deployment.',
        contentJson: {
          eyebrow: 'Sesi Presentasi, Code Review & Project Clinic',
          highlights: [
            'Demonstrasikan operasi CRUD penuh serta alur Halaman menuju MySQL.',
            'Tinjau kualitas TypeScript, keamanan query SQL, serta kerapian commit GitHub.',
            'Pelajari konfigurasi environment produksi dan latihan deploy ke Railway.',
            'Siapkan cadangan ekspor .sql sebelum memasuki Evaluasi Akhir Pertemuan 15.',
          ],
          stats: [
            { label: 'Aktivitas 1', value: 'Demo & Bedah Arsitektur' },
            { label: 'Aktivitas 2', value: 'Code Review Mentor' },
            { label: 'Aktivitas 3', value: 'Deploy Railway / Build' },
            { label: 'Minggu', value: 'Week 14' },
          ],
        },
      },
      {
        slideNumber: 2,
        isSummary: true,
        layoutType: 'summary',
        badge: 'Ringkasan Eksekutif',
        title: 'Dari Lokal Menuju Aplikasi Siap Dipresentasikan',
        subtitle:
          'Aplikasi siap kerja menuntut kode terstruktur, konfigurasi rapi, dan penjelasan alur lugas.',
        contentJson: {
          eyebrow: 'Executive Summary • Kualitas & Deployment',
          highlights: [
            'Presentasi melatih kemampuan menjelaskan alasan teknis di balik struktur kode.',
            'Code review mempercepat peningkatan standar keamanan dan keterbacaan kode.',
            'Deployment melatih pengelolaan environment variable, build produksi, dan database jarak jauh.',
            'Jika kuota Railway terbatas, verifikasi lokal dan file .sql tetap dinilai.',
          ],
          stats: [
            { label: 'Bobot Presentasi', value: '20% Penilaian' },
            { label: 'Bobot Git & Repo', value: '10% Penilaian' },
            { label: 'Deploy Scope', value: 'Latihan Terukur' },
          ],
        },
      },
      {
        slideNumber: 3,
        isSummary: true,
        layoutType: 'bento',
        badge: 'Peta Aktivitas Sesi',
        title: 'Agenda Presentasi, Code Review & Strategi Deployment',
        subtitle:
          'Empat tahapan evaluasi proyek capstone sebelum memasuki sesi penutupan akhir.',
        contentJson: {
          eyebrow: 'Alur Sesi Pertemuan 14',
          highlights: [
            'Pastikan seluruh fitur berjalan stabil di localhost sebelum memulai deployment cloud.',
          ],
          bentoCards: [
            {
              title: '1. Demo & Penjelasan Alur',
              tag: 'Presentasi',
              description:
                'Tunjukkan operasi CRUD penuh sambil menjelaskan peran folder app/, server/api/, dan shared/types/.',
              bullets: [
                'Demo tambah, ubah, selesai, dan hapus',
                'Tunjukkan perubahan baris di tabel MySQL',
              ],
            },
            {
              title: '2. Audit Kode & GitHub',
              tag: 'Code Quality',
              description:
                'Periksa keamanan query, penanganan galat, kelengkapan .gitignore, serta kualitas dokumentasi README.',
              bullets: [
                'Pastikan tidak ada kredensial rahasia bocor',
                'Catat poin revisi untuk Pertemuan 15',
              ],
            },
            {
              title: '3. Deployment Latihan Railway',
              tag: 'Cloud Hosting',
              description:
                'Hubungkan layanan Nuxt dan MySQL di Railway memakai konfigurasi variabel environment.',
              bullets: [
                'Isi NUXT_DB_* pada menu Variables Railway',
                'Gunakan 1 proyek latihan secara efisien',
              ],
            },
            {
              title: '4. Mitigasi Kuota & Backup',
              tag: 'Risk Mitigation',
              description:
                'Antisipasi batas kredit akun percobaan Railway dengan menyimpan cadangan database lokal.',
              bullets: [
                'Periksa kebijakan kuota di railway.com/pricing',
                'Wajib simpan ekspor .sql dari phpMyAdmin',
              ],
            },
          ],
        },
      },
      {
        slideNumber: 4,
        isSummary: false,
        layoutType: 'bento',
        badge: 'Konsep Environment',
        title: 'Perbedaan Localhost vs Produksi & Strategi Railway',
        subtitle:
          'Pahami perbedaan kompilasi produksi, keamanan kredensial, dan rencana cadangan kuota cloud.',
        contentJson: {
          eyebrow: 'Analogi & Prinsip Deployment',
          highlights: [
            'Selalu siapkan cadangan database .sql dan skenario verifikasi lokal.',
          ],
          bentoCards: [
            {
              title: 'Development vs Production',
              tag: 'Build & Runtime',
              description:
                'Localhost memakai npm run dev, sedangkan server cloud menjalankan hasil kompilasi npm run build.',
              bullets: [
                'Nitro menghasilkan bundel mandiri di .output/',
                'Perintah jalan: node .output/server/index.mjs',
              ],
            },
            {
              title: 'Kerahasiaan File .env',
              tag: 'Credential Safety',
              description:
                'Simpan hanya nama variabel kosong di .env.example, lalu isi nilai aslinya di dashboard Railway.',
              bullets: [
                'Periksa git status sebelum melakukan commit',
                'Blokir file .env melalui aturan .gitignore',
              ],
            },
            {
              title: 'Kebijakan Kredit Railway',
              tag: 'Catatan Silabus',
              description:
                'Akun percobaan Railway memiliki kuota terbatas sehingga layanan latihan perlu dimatikan seusai demo.',
              bullets: [
                'Deployment latihan dimulai pada Pertemuan 14',
                'Pantau pemakaian resource di dashboard Railway',
              ],
            },
            {
              title: 'Rencana Cadangan Evaluasi',
              tag: 'Backup Plan',
              description:
                'Apabila kredit cloud habis, penilaian dilakukan penuh melalui build lokal, Postman, dan file .sql.',
              bullets: [
                'Fokus penilaian terletak pada pemahaman kode',
              ],
            },
          ],
        },
      },
      {
        slideNumber: 5,
        isSummary: false,
        layoutType: 'bento',
        badge: 'Bedah Teknis • Review & Deploy',
        title: 'Checklist Code Review & Konfigurasi Produksi Nuxt',
        subtitle:
          'Periksa kesiapan build lokal, variabel environment, dan standar kualitas repositori.',
        contentJson: {
          eyebrow: 'Audit Teknis & Deployment Config',
          highlights: [
            'Uji npm run build lokal untuk mendeteksi galat kompilasi lebih awal.',
          ],
          bentoCards: [
            {
              title: '1. Uji Typecheck & Build Lokal',
              tag: 'Pre-Deploy Check',
              description:
                'Pastikan TypeScript dan bundler Nitro berhasil membangun bundel produksi tanpa galat.',
              code: {
                filename: 'terminal-check.sh',
                language: 'bash',
                snippet: `# Periksa tipe data TypeScript
npx nuxi typecheck

# Bangun dan jalankan bundel produksi lokal
npm run build
node .output/server/index.mjs`,
              },
            },
            {
              title: '2. Template .env.example',
              tag: 'Repo Hygiene',
              description:
                'Dokumentasikan nama variabel yang dibutuhkan aplikasi tanpa menyertakan kata sandi asli.',
              code: {
                filename: '.env.example',
                language: 'dotenv',
                snippet: `NUXT_DB_HOST=127.0.0.1
NUXT_DB_PORT=3306
NUXT_DB_USER=root
NUXT_DB_PASSWORD=
NUXT_DB_NAME=taskflow_db`,
              },
            },
            {
              title: '3. Variabel Referensi Railway',
              tag: 'Railway Env',
              description:
                'Hubungkan layanan aplikasi Nuxt ke layanan MySQL di Railway menggunakan variabel referensi.',
              code: {
                filename: 'railway-variables.txt',
                language: 'dotenv',
                snippet: `NITRO_HOST=0.0.0.0
NUXT_DB_HOST=\${{MySQL.MYSQLHOST}}
NUXT_DB_PORT=\${{MySQL.MYSQLPORT}}
NUXT_DB_USER=\${{MySQL.MYSQLUSER}}
NUXT_DB_PASSWORD=\${{MySQL.MYSQLPASSWORD}}
NUXT_DB_NAME=\${{MySQL.MYSQLDATABASE}}`,
              },
            },
            {
              title: '4. Fokus Audit Code Review',
              tag: 'Review Rubric',
              description:
                'Enam aspek teknis utama yang diperiksa mentor pada repositori peserta.',
              bullets: [
                'Struktur folder rapi dan bebas tipe any',
                'Query SQL berparameter (?) dan validasi HTTP',
                'Riwayat Git bersih dilengkapi panduan README.md',
              ],
            },
          ],
        },
      },
      {
        slideNumber: 6,
        isSummary: false,
        layoutType: 'comparison',
        badge: 'Good vs Bad Practice',
        title: 'Kebiasaan Git & Deployment Buruk vs Profesional',
        subtitle:
          'Jaga kebersihan repositori dari file rahasia dan selalu siapkan cadangan database.',
        contentJson: {
          eyebrow: 'Code Review & Deployment Hygiene',
          highlights: [
            'Kata sandi yang telanjur terunggah ke repositori publik wajib segera diganti.',
          ],
          comparison: {
            badTitle: '✕ Kebiasaan Buruk Saat Deploy',
            badPoints: [
              'Mengunggah file .env serta folder node_modules ke repositori GitHub.',
              'Mencoba deploy ke cloud saat aplikasi lokal masih mengalami galat.',
              'Menulis pesan commit acak tanpa panduan README dan cadangan .sql.',
            ],
            badCode: {
              filename: 'bad-git-workflow.sh',
              language: 'bash',
              snippet: `# Salah: tanpa .gitignore, file .env ikut terunggah ke publik
git add .
git commit -m "update dikit"
git push origin main`,
            },
            goodTitle: '✓ Standar Siap Review',
            goodPoints: [
              'Memblokir node_modules, .nuxt, .output, dan .env melalui file .gitignore.',
              'Memastikan typecheck dan npm run build lulus sebelum deploy.',
              'Menyertakan pesan commit jelas, README lengkap, serta cadangan .sql.',
            ],
            goodCode: {
              filename: '.gitignore',
              language: 'text',
              snippet: `node_modules
.nuxt
.output
.env
*.log`,
            },
          },
        },
      },
      {
        slideNumber: 7,
        isSummary: false,
        layoutType: 'practice',
        badge: '70% Hands-On • Review & Deploy',
        title: 'Langkah Praktik: Perbaikan Review, Backup .sql & Deploy',
        subtitle:
          'Jalankan audit tipe, ekspor database, uji build produksi, dan deploy terukur.',
        contentJson: {
          eyebrow: '70% Praktik Langsung • Project Clinic & Deployment',
          highlights: [
            'Ikuti urutan kerja: audit lokal, ekspor .sql, uji build, lalu deploy.',
          ],
          practiceSteps: [
            {
              step: 1,
              title: 'Tuntaskan Revisi Code Review & Typecheck',
              description:
                'Rapikan struktur folder, hapus kode debug yang tidak diperlukan, dan pastikan pemeriksaan TypeScript bersih.',
              command: 'npx nuxi typecheck',
            },
            {
              step: 2,
              title: 'Ekspor Cadangan Database .sql',
              description:
                'Ekspor skema beserta data contoh dari phpMyAdmin ke dalam file database/taskflow_backup.sql.',
            },
            {
              step: 3,
              title: 'Verifikasi Build Produksi di Lokal',
              description:
                'Bangun aplikasi Nuxt dan uji jalankan bundel server Nitro secara lokal.',
              command: 'npm run build && node .output/server/index.mjs',
            },
            {
              step: 4,
              title: 'Deploy ke Railway & Unggah Dokumentasi Final',
              description:
                'Hubungkan repositori ke Railway dengan variabel NUXT_DB_* (atau gunakan skenario lokal), lalu perbarui README.md.',
              command:
                'git add . && git commit -m "chore: apply code review fixes and deploy config" && git push',
            },
          ],
        },
      },
      {
        slideNumber: 8,
        isSummary: false,
        layoutType: 'quiz',
        badge: 'Kuis & Referensi',
        title: 'Kuis Deployment, Referensi & Tugas Mingguan',
        subtitle:
          'Uji kesiapan teknis menghadapi pertanyaan environment produksi dan peninjauan kode.',
        contentJson: {
          eyebrow: 'Evaluasi Pemahaman & Pustaka Terkurasi',
          highlights: [
            'Siapkan penjelasan ringkas alur aplikasi untuk Evaluasi Akhir Pertemuan 15.',
          ],
          quizItems: [
            {
              question:
                'Mengapa kita wajib memverifikasi aplikasi di localhost dan mengekspor file .sql sebelum deploy?',
              hint: 'Pertimbangkan kecepatan pelacakan bug dan batas kuota cloud.',
              answer:
                'Pelacakan bug jauh lebih cepat dilakukan di lokal, sedangkan file .sql menjadi cadangan skema dan data apabila kuota layanan cloud habis.',
            },
            {
              question:
                'Apa fungsi file .env.example jika file .env dilarang masuk ke GitHub?',
              hint: 'Dokumentasi konfigurasi untuk pengembang lain.',
              answer:
                'File .env.example mencatat daftar nama variabel environment yang dibutuhkan proyek tanpa mengekspos nilai kata sandi asli.',
            },
            {
              question:
                'Apa saja empat aspek utama yang perlu dijelaskan saat presentasi aplikasi fullstack Nuxt?',
              hint: 'Urutkan dari struktur proyek hingga penyimpanan data.',
              answer:
                'Jelaskan struktur folder Nuxt, alur request halaman ke server/api, eksekusi query MySQL berparameter, serta penerapan kontrak TypeScript.',
            },
            {
              question:
                'File mana yang dijalankan server produksi setelah perintah npm run build selesai?',
              hint: 'Perhatikan hasil kompilasi mesin Nitro.',
              answer:
                'Server menjalankan titik masuk bundel Nitro pada file .output/server/index.mjs.',
            },
          ],
          references: [
            {
              title: 'Railway Documentation',
              url: 'https://docs.railway.com/',
              author: 'Railway Team',
              category: 'Cloud Deployment',
              lang: 'EN',
              type: 'Docs',
            },
            {
              title: 'Railway Pricing & Quota Policy',
              url: 'https://railway.com/pricing',
              author: 'Railway Team',
              category: 'Deployment Cost Policy',
              lang: 'EN',
              type: 'Docs',
            },
            {
              title: 'Nuxt Deployment & Nitro Output',
              url: 'https://nuxt.com/docs',
              author: 'Nuxt Core Team',
              category: 'Fullstack Deployment',
              lang: 'EN',
              type: 'Docs',
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
              title: 'Pro Git 2nd Edition (Bahasa Indonesia)',
              url: 'https://git-scm.com/book/id/',
              author: 'Scott Chacon & Ben Straub',
              category: 'Git (Free Programming Books ID)',
              lang: 'ID',
              type: 'Book',
            },
            {
              title: 'Belajar Git untuk Pemula',
              url: 'https://github.com/petanikode/belajar-git',
              author: 'Ahmad Muhardian (Petani Kode)',
              category: 'Git (Free Programming Books ID)',
              lang: 'ID',
              type: 'Book',
            },
          ],
          weeklyAssignment: {
            week: 14,
            title: 'Code Review dan Penyempurnaan Proyek',
            description:
              'Tuntaskan seluruh catatan revisi mentor, rapikan README.md, dan pastikan cadangan file .sql siap diuji.',
          },
        },
      },
      {
        slideNumber: 9,
        isSummary: false,
        layoutType: 'task',
        badge: 'Task Pertemuan 14',
        title: 'Deliverable Wajib & Pengumpulan Learning Log',
        subtitle:
          'Tuntaskan revisi code review sebelum mengikuti Evaluasi Akhir pada Pertemuan 15.',
        contentJson: {
          eyebrow: 'Submission Checklist • Pertemuan 14',
          highlights: [
            'Pastikan proyek bersih dari galat sebelum sesi Live Coding akhir.',
          ],
          deliverables: [
            'Commit perbaikan pasca-review pada repositori GitHub',
            'File .env.example, .gitignore yang tepat, serta README.md lengkap',
            'File cadangan database .sql berisi skema dan data contoh',
            'Tautan deployment Railway aktif atau tangkapan layar build lokal dan Postman',
            'Catatan Learning Log berisi rincian revisi yang diselesaikan',
          ],
          learningLogFields: STANDARD_LEARNING_LOG_FIELDS,
          mentorTip:
            'Jadikan setiap catatan code review sebagai umpan balik objektif untuk meningkatkan standar kerapian dan keamanan kode Anda.',
        },
      },
    ],
  },
  {
    orderIndex: 16,
    month: 3,
    code: 'P16',
    slug: 'pertemuan-16-evaluasi-akhir-live-coding',
    sessionType: 'Evaluasi Akhir',
    title: 'Evaluasi Akhir, Live Coding, Checklist Kompetensi & Penutupan',
    subtitle:
      'Uji penguasaan materi tiga bulan melalui kuis lintas modul, live coding, dan verifikasi 35 kompetensi.',
    summaryText:
      'Sesi evaluasi komprehensif berisi tantangan live coding Nuxt + MySQL, penilaian akhir, serta peta belajar lanjutan.',
    taskPrompt:
      'Kumpulkan repositori final TaskFlow fullstack, hasil live coding, evaluasi mandiri 35 kompetensi, dan rencana belajar pasca-bootcamp.',
    taskDeliverables: [
      'Repositori final GitHub TaskFlow fullstack lengkap dengan README.md dan database .sql',
      'Penyelesaian 4 tantangan Live Coding bersama mentor',
      'Evaluasi mandiri 35 Checklist Kompetensi Akhir (Frontend, Backend/DB, Modern Fullstack)',
      'Refleksi pembelajaran 3 bulan dan pilihan 3 topik prioritas pasca-bootcamp',
      'Catatan Learning Log penutupan program',
    ],
    accentGradient: 'from-orange-500 to-red-500',
    iconName: 'GraduationCap',
    slides: [
      {
        slideNumber: 1,
        isSummary: true,
        layoutType: 'cover',
        badge: 'Pertemuan 15 • Evaluasi Akhir',
        title: 'Evaluasi Akhir, Live Coding, Checklist Kompetensi & Penutupan',
        subtitle:
          'Buktikan penguasaan fullstack tiga bulan dan susun langkah pengembangan karier berikutnya.',
        contentJson: {
          eyebrow: 'Sesi Final • PT Digital Teknologi Perkasa',
          highlights: [
            'Uji konsep lintas bulan: Frontend dasar, MySQL, dan Fullstack Nuxt.',
            'Selesaikan 4 tantangan Live Coding: halaman, endpoint, alur SQL, dan debugging.',
            'Verifikasi ketuntasan 35 Checklist Kompetensi bersama mentor.',
            'Terima evaluasi akhir serta panduan 10 topik pengembangan pasca-program.',
          ],
          stats: [
            { label: 'Durasi Program', value: '3 Bulan • 15 Pertemuan' },
            { label: 'Target Level', value: 'Advanced Beginner' },
            { label: 'Checklist', value: '35 Kompetensi' },
            { label: 'Minggu', value: 'Week 15' },
          ],
        },
      },
      {
        slideNumber: 2,
        isSummary: true,
        layoutType: 'summary',
        badge: 'Ringkasan Eksekutif',
        title: 'Prinsip Kelulusan & Standar Advanced Beginner',
        subtitle:
          'Kelulusan diukur dari kemampuan membangun, memahami, dan menjelaskan alur kerja aplikasi.',
        contentJson: {
          eyebrow: 'Executive Summary • Prinsip Utama Bootcamp',
          highlights: [
            'Pegang prinsip: pahami konsep, bangun fitur, kuasai kode, dan jelaskan hasilnya.',
            'Lulusan mencapai level Advanced Beginner pada stack Nuxt, TypeScript, dan MySQL.',
            'Skala industri menuntut pendalaman lanjutan di bidang keamanan, pengujian, dan arsitektur.',
            'Sepuluh topik pasca-program disiapkan sebagai peta belajar mandiri berikutnya.',
          ],
          stats: [
            { label: 'Beginner', value: 'HTML, CSS, JS Statis' },
            { label: 'Intermediate', value: 'Vue.js & CRUD Dasar' },
            { label: 'Advanced Beginner', value: 'Fullstack Nuxt + TS + MySQL' },
          ],
        },
      },
      {
        slideNumber: 3,
        isSummary: true,
        layoutType: 'bento',
        badge: 'Peta Evaluasi Akhir',
        title: 'Peta Aktivitas Evaluasi & Komponen Penilaian',
        subtitle:
          'Empat komponen utama yang menentukan kelulusan serta arah pengembangan pasca-program.',
        contentJson: {
          eyebrow: 'Struktur Evaluasi Pertemuan 15',
          highlights: [
            'Mentor menguji modifikasi fitur langsung untuk memvalidasi keaslian pemahaman kode.',
          ],
          bentoCards: [
            {
              title: '1. Bobot Nilai (40/30/20/10)',
              tag: 'Sistem Evaluasi',
              description:
                'Penilaian menggabungkan hasil proyek, penguasaan teori, komunikasi teknis, dan kerapian Git.',
              bullets: [
                '40% proyek berjalan dan 30% kuis konsep',
                '20% presentasi dan penjelasan alur kode',
                '10% kerapian commit Git serta README',
              ],
            },
            {
              title: '2. Empat Skenario Live Coding',
              tag: 'Live Assessment',
              description:
                'Pengujian praktik langsung untuk mengukur ketangkasan merakit fitur dan melacak galat.',
              bullets: [
                'Buat halaman daftar tugas dan endpoint API',
                'Jelaskan alur eksekusi query ke MySQL',
                'Lacak serta perbaiki 1 galat tersembunyi',
              ],
            },
            {
              title: '3. Audit 35 Kompetensi',
              tag: 'Capaian Belajar',
              description:
                'Pemetaan menyeluruh atas keterampilan teknis dari Bulan 1 hingga Bulan 3.',
              bullets: [
                '10 kompetensi dasar HTML, CSS, dan JS',
                '11 kompetensi Node.js, REST API, dan MySQL',
                '14 kompetensi Vite, Vue, TypeScript, dan Nuxt',
              ],
            },
            {
              title: '4. Peta Belajar Lanjutan',
              tag: 'Pasca-Bootcamp',
              description:
                'Penentuan prioritas topik lanjutan setelah fondasi utama tiga bulan terbentuk.',
              bullets: [
                'Autentikasi, password hashing, dan validasi skema',
                'Automated testing, Docker, serta alur CI/CD',
              ],
            },
          ],
        },
      },
      {
        slideNumber: 4,
        isSummary: false,
        layoutType: 'bento',
        badge: 'Sintesis 3 Bulan',
        title: 'Sintesis 3 Bulan: Dari Antarmuka ke Produksi',
        subtitle:
          'Lihat keterkaitan materi Pertemuan 01 hingga 15 sebagai satu kesatuan sistem.',
        contentJson: {
          eyebrow: 'Analogi Peta Besar Fullstack',
          highlights: [
            'Antarmuka, API server, dan database bekerja sebagai satu aliran terpadu.',
          ],
          bentoCards: [
            {
              title: 'Bulan 1 || Fondasi Antarmuka',
              tag: 'P01 – P05',
              description:
                'HTML5 semantik menyusun struktur, CSS mengatur tata letak responsif, dan JS menangani interaksi.',
              bullets: [
                'Inspeksi elemen dan konsol melalui DevTools',
                'Pencatatan riwayat perubahan kode dengan Git',
              ],
            },
            {
              title: 'Bulan 2 || Backend & Database',
              tag: 'P06 – P10',
              description:
                'Node.js dan REST API menjembatani pertukaran JSON dengan penyimpanan relasional MySQL.',
              bullets: [
                'Alur Request -> Handler -> SQL -> Response',
                'Pengujian kontrak endpoint menggunakan Postman',
              ],
            },
            {
              title: 'Bulan 3 || Fullstack Modern',
              tag: 'P11 – P15',
              description:
                'Vue 3 memodularisasi komponen, TypeScript menjaga tipe data, dan Nuxt menyatukan server API.',
              bullets: [
                'Pengembangan aplikasi fullstack dalam satu kode sumber',
              ],
            },
            {
              title: 'Alur Pelacakan Bug',
              tag: 'Troubleshooting',
              description:
                'Telusuri masalah secara berurutan dari Console peramban, tab Network, log Nitro, hingga MySQL.',
              bullets: [
                'Isolasi letak galat sebelum mengubah baris kode',
              ],
            },
          ],
        },
      },
      {
        slideNumber: 5,
        isSummary: false,
        layoutType: 'bento',
        badge: 'Rubrik & Roadmap',
        title: 'Skala Nilai Akhir & 10 Topik Pasca-Bootcamp',
        subtitle:
          'Standar penilaian kelulusan beserta sepuluh topik lanjutan untuk pendalaman mandiri.',
        contentJson: {
          eyebrow: 'Skala Nilai & Peta Jalan Pasca-Program',
          highlights: [
            'Kuasai sepuluh topik lanjutan secara bertahap setelah fondasi fullstack selesai.',
          ],
          bentoCards: [
            {
              title: 'Skala Interpretasi Nilai',
              tag: 'Standar Evaluasi',
              description:
                'Rentang skor akhir mengacu pada kemandirian penyelesaian fitur dan ketepatan penjelasan konsep.',
              bullets: [
                '90–100: Paham konsep dan mandiri mengembangkan fitur',
                '80–89: Target selesai dengan sedikit arahan',
                '70–79: Paham dasar, di bawah 70 remedial',
              ],
            },
            {
              title: 'Roadmap #1–#5: Backend & Keamanan',
              tag: 'Pasca-Bootcamp 1–5',
              description:
                'Lima topik prioritas untuk mengamankan akses pengguna dan struktur data produksi.',
              bullets: [
                '1–2: Autentikasi RBAC, password hashing, dan sesi',
                '3–4: Normalisasi database dan validasi skema API',
                '5: Middleware serta utilitas server lanjutan Nuxt',
              ],
            },
            {
              title: 'Roadmap #6–#10: Kualitas & DevOps',
              tag: 'Pasca-Bootcamp 6–10',
              description:
                'Lima topik lanjutan untuk pengujian otomatis, infrastruktur server, dan kolaborasi tim.',
              bullets: [
                '6–7: Automated testing dan pipeline CI/CD produksi',
                '8: Kontainerisasi Docker dan dasar server Linux',
                '9–10: Clean architecture, Git branching, dan PR',
              ],
            },
            {
              title: 'Aset Portofolio Lulusan',
              tag: 'Career Ready',
              description:
                'Bukti karya nyata yang siap dilampirkan saat melamar magang lanjutan atau pekerjaan.',
              bullets: [
                'Aplikasi fullstack TaskFlow teruji end-to-end',
                'Repositori GitHub rapi dengan dokumentasi README',
                'Kemampuan menjelaskan arsitektur kode secara lugas',
              ],
            },
          ],
        },
      },
      {
        slideNumber: 6,
        isSummary: false,
        layoutType: 'comparison',
        badge: 'Good vs Bad Practice',
        title: 'Sikap Menghadapi Evaluasi & Live Coding',
        subtitle:
          'Kode salinan tanpa pemahaman tidak dihitung sebagai capaian kompetensi.',
        contentJson: {
          eyebrow: 'Mindset Software Engineer Saat Evaluasi',
          highlights: [
            'Penilaian berfokus pada penalaran alur data dan ketenangan membaca pesan galat.',
          ],
          comparison: {
            badTitle: '✕ Menghambat Kompetensi',
            badPoints: [
              'Menyalin kode utuh tanpa memahami fungsi setiap barisnya.',
              'Menebak perubahan secara acak tanpa membaca pesan galat terminal.',
              'Memoles tampilan CSS saat fungsi utama database masih gagal.',
            ],
            badCode: {
              filename: 'BuggyEndpoint.ts',
              language: 'typescript',
              snippet: `// Contoh bug akibat menyalin kode tanpa teliti
export default defineEventHandler(async (event) => {
  const body = readBody(event); // Lupa kata kunci await
  const rows = await getDbPool().execute(
    'INSERT INTO tasks (title) VALUES (body.title)',
  );
  return rows;
});`,
            },
            goodTitle: '✓ Sikap Engineer Terlatih',
            goodPoints: [
              'Menjelaskan fungsi setiap baris, termasuk await, tipe data, dan query.',
              'Membaca pesan galat lalu memeriksa tab Network serta log server.',
              'Memastikan alur CRUD inti stabil sebelum merapikan detail tampilan.',
            ],
            goodCode: {
              filename: 'FixedEndpoint.ts',
              language: 'typescript',
              snippet: `export default defineEventHandler(async (event) => {
  const body = await readBody<{ title?: string }>(event);
  if (!body?.title?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Judul wajib diisi' });
  }
  const [res] = await getDbPool().execute(
    'INSERT INTO tasks (title) VALUES (?)',
    [body.title.trim()],
  );
  return { success: true, data: res };
});`,
            },
          },
        },
      },
      {
        slideNumber: 7,
        isSummary: false,
        layoutType: 'practice',
        badge: 'Live Coding Test',
        title: '4 Tantangan Live Coding & Validasi Struktur Nuxt',
        subtitle:
          'Simulasikan empat skenario pengujian langsung bersama mentor pada sesi evaluasi.',
        contentJson: {
          eyebrow: '70% Praktik Evaluasi • Live Coding Challenge',
          highlights: [
            'Utamakan kode yang bersih, terketik rapi, dan mudah dijelaskan alurnya.',
          ],
          practiceSteps: [
            {
              step: 1,
              title: 'Tantangan 1: Buat Halaman Daftar Tugas',
              description:
                'Buat halaman app/pages/evaluasi.vue yang menampilkan daftar tugas via useFetch dan form input v-model.',
            },
            {
              step: 2,
              title: 'Tantangan 2: Buat Endpoint Ringkasan di Server API',
              description:
                'Tambahkan handler server/api/tasks/summary.get.ts yang menghitung jumlah tugas per status dalam format JSON.',
              code: `export default defineEventHandler(async () => {
  const [rows] = await getDbPool().execute(
    'SELECT status, COUNT(*) AS total FROM tasks GROUP BY status',
  );
  return { success: true, data: rows };
});`,
            },
            {
              step: 3,
              title: 'Tantangan 3: Jelaskan Alur Data End-to-End',
              description:
                'Uraikan secara lisan bagaimana useFetch memanggil endpoint Nitro, mengeksekusi query MySQL, dan merender JSON.',
              code: `taskflow/
├── app/pages/         # Komponen halaman & useFetch
├── server/api/        # Handler REST API Nitro
├── server/utils/db.ts # Connection pool MySQL
└── shared/types/      # Kontrak interface TypeScript`,
            },
            {
              step: 4,
              title: 'Tantangan 4: Perbaiki 1 Bug dari Mentor',
              description:
                'Temukan dan perbaiki satu galat yang disisipkan mentor, lalu pastikan validasi tipe lulus.',
              command: 'npx nuxi typecheck',
            },
          ],
        },
      },
      {
        slideNumber: 8,
        isSummary: false,
        layoutType: 'quiz',
        badge: 'Evaluasi & 35 Checklist',
        title: 'Kuis Lintas Bulan, 35 Kompetensi & Referensi',
        subtitle:
          'Uji pemahaman Bulan 1–3 dan periksa ketuntasan 35 daftar kompetensi.',
        contentJson: {
          eyebrow: 'Final Assessment • Kuis + 35 Checklist Kompetensi',
          highlights: [
            'Gunakan 35 daftar kompetensi ini sebagai tolok ukur capaian belajar Anda.',
          ],
          quizItems: [
            {
              question:
                '[Bulan 1] Mengapa elemen semantik HTML lebih disarankan daripada memakai <div> untuk semua bagian?',
              hint: 'Tinjau aspek aksesibilitas, SEO, dan keterbacaan struktur.',
              answer:
                'HTML semantik memberi makna struktur dokumen bagi pembaca layar, mesin pencari, serta memudahkan pengembang memahami hierarki halaman.',
            },
            {
              question:
                '[Bulan 2] Apa arti kode status HTTP 201, 400, 404, dan 500 pada REST API?',
              hint: 'Bedakan respons sukses, kesalahan klien, dan kegagalan server.',
              answer:
                'Kode 201 menandakan data berhasil dibuat, 400 input klien tidak valid, 404 data tidak ditemukan, dan 500 terjadi kegagalan di sisi server.',
            },
            {
              question:
                '[Bulan 3] Mengapa endpoint POST gagal membaca payload jika pemanggilan readBody(event) tidak memakai await?',
              hint: 'Perhatikan tipe kembalian fungsi asynchronous.',
              answer:
                'Fungsi readBody(event) mengembalikan Promise. Tanpa await, variabel hanya memegang objek Promise yang belum selesai dibaca.',
            },
            {
              question:
                '[Bulan 3] Bagaimana pembagian peran Vite, Vue 3, TypeScript, Nitro, dan MySQL di dalam proyek Nuxt?',
              hint: 'Urutkan dari tooling, antarmuka, tipe data, server, hingga penyimpanan.',
              answer:
                'Vite membundel kode, Vue 3 membangun komponen UI, TypeScript menjaga kontrak tipe, Nitro menjalankan server/api/, dan MySQL menyimpan data relasional.',
            },
            {
              question:
                '[Keamanan] Mengapa file .env wajib masuk .gitignore dan query SQL wajib memakai tanda tanya (?)?',
              hint: 'Dua lapis perlindungan kredensial dan database.',
              answer:
                'Aturan .gitignore mencegah kebocoran kata sandi ke repositori publik, sedangkan placeholder (?) mencegah injeksi perintah SQL berbahaya.',
            },
          ],
          competencyChecklist: [
            'Memahami struktur dasar dokumen HTML.',
            'Menggunakan elemen HTML semantik dengan tepat.',
            'Menyusun tata letak halaman menggunakan CSS.',
            'Menerapkan Flexbox dan CSS Grid.',
            'Membangun tampilan web responsif.',
            'Memahami variabel dan tipe data JavaScript.',
            'Menggunakan function, array, dan object.',
            'Mengelola DOM dan event listener.',
            'Menyimpan data sisi klien di localStorage.',
            'Mengelola versi kode dengan Git dan GitHub.',
            'Memahami peran runtime Node.js.',
            'Menjalankan skrip proyek menggunakan npm.',
            'Memahami konsep dasar Express.js.',
            'Memahami siklus HTTP request dan response.',
            'Memahami standar arsitektur REST API.',
            'Membangun endpoint CRUD fungsional.',
            'Memahami konsep database relasional.',
            'Merancang tabel pada database MySQL.',
            'Menulis query SQL CRUD dasar.',
            'Menghubungkan aplikasi Node.js dengan MySQL.',
            'Menguji endpoint API menggunakan Postman.',
            'Memahami peran Vite sebagai build tool.',
            'Memahami struktur proyek Vue.js 3.',
            'Membuat komponen Single File Component (.vue).',
            'Menggunakan ref, v-if, v-for, dan v-model.',
            'Menerapkan komunikasi komponen lewat props dan emit.',
            'Memahami anotasi tipe dasar TypeScript.',
            'Menggunakan type dan interface secara konsisten.',
            'Memahami struktur direktori fullstack Nuxt.',
            'Membuat halaman dengan file-based routing Nuxt.',
            'Membuat endpoint server API menggunakan Nitro.',
            'Menghubungkan server API Nuxt dengan MySQL.',
            'Mengamankan konfigurasi melalui environment variables.',
            'Mendemonstrasikan dan menjelaskan alur aplikasi fullstack.',
            'Menyiapkan latihan deployment Railway serta cadangan file .sql.',
          ],
          references: [
            {
              title: 'Free Programming Books (Bahasa Indonesia)',
              url: 'https://github.com/EbookFoundation/free-programming-books/blob/main/books/free-programming-books-id.md',
              author: 'EbookFoundation',
              category: 'Katalog E-Book Gratis',
              lang: 'ID',
              type: 'Book',
            },
            {
              title: 'Project-Based Learning Repository',
              url: 'https://github.com/practical-tutorials/project-based-learning#html-and-css',
              author: 'Practical Tutorials',
              category: 'Katalog Proyek Praktik',
              lang: 'EN',
              type: 'PBL',
            },
            {
              title: 'Nuxt Documentation (Middleware, Utils & Production)',
              url: 'https://nuxt.com/docs',
              author: 'Nuxt Core Team',
              category: 'Materi Lanjutan',
              lang: 'EN',
              type: 'Docs',
            },
            {
              title: 'Belajar Docker untuk Pemula (Roadmap #8)',
              url: 'https://www.youtube.com/playlist?list=PL-CtdCApEFH-A7jBmdertzbeACuQWvQao',
              author: 'Eko Kurniawan Khannedy (Programmer Zaman Now)',
              category: 'DevOps Lanjutan (Free Courses ID)',
              lang: 'ID',
              type: 'Course',
            },
            {
              title: 'TypeScript Handbook',
              url: 'https://www.typescriptlang.org/docs/handbook/intro.html',
              author: 'Microsoft TypeScript',
              category: 'Type Safety Lanjutan',
              lang: 'EN',
              type: 'Docs',
            },
          ],
          weeklyAssignment: {
            week: 15,
            title: 'Refleksi dan Rencana Belajar Lanjutan',
            description:
              'Tulis refleksi perkembangan belajar 3 bulan dan pilih 3 topik prioritas dari Roadmap Pasca-Bootcamp.',
          },
        },
      },
      {
        slideNumber: 9,
        isSummary: false,
        layoutType: 'task',
        badge: 'Final Deliverable • Penutupan',
        title: 'Pengumpulan Proyek Final, Refleksi & Penutupan',
        subtitle:
          'Lengkapi paket portofolio akhir Anda untuk verifikasi kelulusan program.',
        contentJson: {
          eyebrow: 'Final Submission • Graduation',
          highlights: [
            'Jadikan repositori TaskFlow fullstack sebagai portofolio rekayasa perangkat lunak Anda.',
          ],
          deliverables: [
            'Tautan repositori GitHub final TaskFlow fullstack (README lengkap, .env.example, database .sql)',
            'Tautan demo Railway atau dokumentasi tangkapan layar aplikasi beserta pengujian Postman',
            'Bukti penyelesaian 4 tantangan Live Coding Pertemuan 15',
            'Evaluasi 35 Checklist Kompetensi serta rencana belajar 3 topik pasca-bootcamp',
            'Catatan Learning Log penutupan program',
          ],
          learningLogFields: STANDARD_LEARNING_LOG_FIELDS,
          mentorTip:
            'Kelulusan ini merupakan titik awal untuk terus membangun proyek nyata dan memperdalam pemahaman atas setiap kode yang Anda tulis.',
        },
      },
    ],
  },
  {
    orderIndex: 17,
    month: 0,
    code: 'P17',
    slug: 'pustaka-learning-hub',
    sessionType: 'Learning Hub',
    title: 'Pustaka Learning Hub: Free Programming Books & Project-Based Learning',
    subtitle:
      'Katalog referensi gratis Bahasa Indonesia dan Inggris dari buku terbuka, kursus video, serta dokumentasi resmi.',
    summaryText:
      'Pusat rujukan mandiri berisi e-book Bahasa Indonesia, playlist video, proyek latihan bertahap, dan dokumentasi resmi.',
    taskPrompt:
      'Gunakan Pustaka Learning Hub sebagai pendamping belajar mandiri lintas materi Bulan 1 hingga Bulan 3.',
    taskDeliverables: [
      'Pilih minimal 1 bacaan atau video Bahasa Indonesia serta 1 proyek latihan sesuai topik pertemuan aktif',
    ],
    accentGradient: 'from-teal-600 to-emerald-600',
    iconName: 'Books',
    slides: [
      {
        slideNumber: 1,
        isSummary: true,
        layoutType: 'bento',
        badge: 'Learning Hub • Pilar Pustaka',
        title: 'Peta Pustaka Learning Hub & Strategi Belajar',
        subtitle:
          'Pilih topik bacaan dan proyek latihan yang sesuai dengan pertemuan aktif Anda.',
        contentJson: {
          eyebrow: 'Pustaka Terkurasi • Digitek Software Engineering Bootcamp',
          highlights: [
            'Baca e-book Bahasa Indonesia untuk memperkuat konsep sebelum kelas dimulai.',
            'Kerjakan proyek kecil PBL untuk melatih logika pemrograman mandiri.',
            'Rujuk dokumentasi resmi untuk spesifikasi teknis Vite, Vue, TypeScript, dan Nuxt.',
          ],
          stats: [
            { label: 'Pilar 1', value: 'Free Books ID' },
            { label: 'Pilar 2', value: 'Free Courses ID' },
            { label: 'Pilar 3', value: 'Project-Based Learning' },
            { label: 'Pilar 4', value: 'Official Docs Stack' },
          ],
          bentoCards: [
            {
              title: '1. Free Programming Books (ID)',
              tag: 'Slide 02',
              description:
                'Kumpulan buku digital dan panduan teks berbahasa Indonesia untuk penguatan konsep dasar.',
              bullets: [
                'HTML, CSS, dan Git (Petani Kode)',
                'JavaScript Modern (id.javascript.info)',
                'Node.js, MySQL, Vue.js, dan TypeScript',
              ],
            },
            {
              title: '2. Free Video Courses (ID)',
              tag: 'Slide 03',
              description:
                'Playlist video pembelajaran berbahasa Indonesia untuk melihat demonstrasi penulisan kode.',
              bullets: [
                'Web Programming UNPAS (Frontend & Git)',
                'Programmer Zaman Now (Node, MySQL, TS)',
                'Nusendra & Wahidev (Vue 3 & API)',
              ],
            },
            {
              title: '3. Project-Based Learning (PBL)',
              tag: 'Slide 04',
              description:
                'Daftar tutorial berbasis proyek nyata untuk melatih pemecahan masalah secara bertahap.',
              bullets: [
                'HTML/CSS: Loading Screen & Calculator',
                'JavaScript: Todo, Weather App, JavaScript30',
                'Vue & Fullstack: Budgeting App & MEVN',
              ],
            },
            {
              title: '4. Dokumentasi Resmi Stack',
              tag: 'Slide 04',
              description:
                'Rujukan teknis utama paling mutakhir untuk teknologi Bulan 1 hingga Bulan 3.',
              bullets: [
                'MDN Web Docs, Node.js, dan MySQL',
                'Vite, Vue 3, TypeScript, dan Nuxt',
                'Postman Learning Center & Railway Docs',
              ],
            },
          ],
        },
      },
      {
        slideNumber: 2,
        isSummary: true,
        layoutType: 'references',
        badge: 'E-Book Gratis (ID)',
        title: 'Kurasi Free Programming Books (Bahasa Indonesia)',
        subtitle:
          'Kumpulan buku digital dan panduan pemrograman gratis berbahasa Indonesia sesuai kurikulum.',
        contentJson: {
          eyebrow: 'Pilar 1 • Katalog Bacaan Bahasa Indonesia',
          highlights: [
            'Pelajari bab yang relevan sebelum sesi pertemuan dimulai.',
            'Catat istilah teknis baru ke dalam dokumen Learning Log Anda.',
          ],
          references: [
            {
              title: 'Tutorial HTML untuk Pemula',
              url: 'https://www.petanikode.com/tutorial/html/',
              author: 'Ahmad Muhardian (Petani Kode)',
              category: 'HTML & CSS (Bulan 1)',
              lang: 'ID',
              type: 'Book',
            },
            {
              title: 'Tutorial Dasar CSS untuk Pemula',
              url: 'https://www.petanikode.com/tutorial/css/',
              author: 'Ahmad Muhardian (Petani Kode)',
              category: 'HTML & CSS (Bulan 1)',
              lang: 'ID',
              type: 'Book',
            },
            {
              title: 'Tutorial JavaScript Modern',
              url: 'https://id.javascript.info',
              author: 'Ilya Kantor',
              category: 'JavaScript (Bulan 1)',
              lang: 'ID',
              type: 'Book',
            },
            {
              title: 'Learn JavaScript (Edisi Indonesia)',
              url: 'https://javascript.sumankunwar.com.np/id',
              author: 'Suman Kumar & Contributors',
              category: 'JavaScript (Bulan 1)',
              lang: 'ID',
              type: 'Book',
            },
            {
              title: 'Belajar Git untuk Pemula',
              url: 'https://github.com/petanikode/belajar-git',
              author: 'Ahmad Muhardian (Petani Kode)',
              category: 'Git & GitHub (Bulan 1)',
              lang: 'ID',
              type: 'Book',
            },
            {
              title: 'Pro Git 2nd Edition (Bahasa Indonesia)',
              url: 'https://git-scm.com/book/id/',
              author: 'Scott Chacon & Ben Straub',
              category: 'Git & GitHub (Bulan 1–3)',
              lang: 'ID',
              type: 'Book',
            },
            {
              title: 'Belajar Node.js',
              url: 'http://idjs.github.io/belajar-nodejs/',
              author: 'IDJS Community',
              category: 'Node.js (Bulan 2)',
              lang: 'ID',
              type: 'Book',
            },
            {
              title: 'Tutorial Node.js untuk Pemula',
              url: 'https://mfikri.com/artikel/tutorial-nodejs',
              author: 'M. Fikri',
              category: 'Node.js (Bulan 2)',
              lang: 'ID',
              type: 'Book',
            },
            {
              title: 'Tutorial MySQL untuk Pemula Hingga Mahir',
              url: 'https://umardanny.com/tutorial-mysql-untuk-pemula-hingga-mahir-ebook-download-pdf/',
              author: 'Umar Danny',
              category: 'MySQL & SQL (Bulan 2–3)',
              lang: 'ID',
              type: 'Book',
            },
            {
              title: 'Belajar Vue.js',
              url: 'https://variancode.com/belajar-vue-js/',
              author: 'Varian Hermianto',
              category: 'Vue.js (Bulan 3)',
              lang: 'ID',
              type: 'Book',
            },
            {
              title: 'Dokumentasi Vue Bahasa Indonesia',
              url: 'https://github.com/vuejs-id/docs',
              author: 'Vue.js Indonesia',
              category: 'Vue.js (Bulan 3)',
              lang: 'ID',
              type: 'Book',
            },
            {
              title: 'TypeScript untuk Pemula, Bagian 1: Memulai',
              url: 'https://code.tutsplus.com/id/tutorials/typescript-for-beginners-getting-started--cms-29329',
              author: 'Tutsplus',
              category: 'TypeScript (Bulan 3)',
              lang: 'ID',
              type: 'Book',
            },
          ],
        },
      },
      {
        slideNumber: 3,
        isSummary: true,
        layoutType: 'references',
        badge: 'Video Courses (ID)',
        title: 'Kurasi Free Video Courses (Bahasa Indonesia)',
        subtitle:
          'Playlist video tutorial terstruktur berbahasa Indonesia untuk pendamping praktik Bulan 1–3.',
        contentJson: {
          eyebrow: 'Pilar 2 • Video Pembelajaran Bahasa Indonesia',
          highlights: [
            'Ketik ulang dan modifikasi setiap contoh kode dari video.',
            'Gunakan kecepatan putar sesuai kenyamanan saat meninjau ulang materi.',
          ],
          references: [
            {
              title: 'Belajar HTML5',
              url: 'https://www.youtube.com/playlist?list=PLFIM0718LjIX-K5eeHRImnZhPUMhsw9A7',
              author: 'Sandhika Galih (Web Programming UNPAS)',
              category: 'HTML5 (Bulan 1)',
              lang: 'ID',
              type: 'Course',
            },
            {
              title: 'Belajar Flexbox & CSS Grid',
              url: 'https://www.youtube.com/playlist?list=PLFIM0718LjIU1lWlM34j6E9fMlrrSGZ1k',
              author: 'Web Programming UNPAS',
              category: 'CSS Layout (Bulan 1)',
              lang: 'ID',
              type: 'Course',
            },
            {
              title: 'Belajar Tailwind CSS',
              url: 'https://youtube.com/playlist?list=PLFIM0718LjIUHFRMzPJ0wGjx9_NlC5d1h',
              author: 'Web Programming UNPAS',
              category: 'Modern CSS (Bulan 1–3)',
              lang: 'ID',
              type: 'Course',
            },
            {
              title: 'JavaScript dan DOM (Document Object Model)',
              url: 'https://www.youtube.com/playlist?list=PLFIM0718LjIWB3YRoQbQh82ZewAGtE2-3',
              author: 'Web Programming UNPAS',
              category: 'JavaScript DOM (Bulan 1)',
              lang: 'ID',
              type: 'Course',
            },
            {
              title: 'Git & GitHub Playlist',
              url: 'https://www.youtube.com/playlist?list=PLFIM0718LjIVknj6sgsSceMqlq242-jNf',
              author: 'Sandhika Galih (Web Programming UNPAS)',
              category: 'Git & GitHub (Bulan 1–3)',
              lang: 'ID',
              type: 'Course',
            },
            {
              title: 'Tutorial Node.js Dasar Bahasa Indonesia',
              url: 'https://www.youtube.com/watch?v=b39Xqf5iyjo',
              author: 'Eko Kurniawan Khannedy (Programmer Zaman Now)',
              category: 'Node.js (Bulan 2)',
              lang: 'ID',
              type: 'Course',
            },
            {
              title: 'MySQL Tutorial Bahasa Indonesia',
              url: 'https://www.youtube.com/playlist?list=PL-CtdCApEFH_P2_2zR6pvDublvpD3fF6W',
              author: 'Programmer Zaman Now',
              category: 'MySQL (Bulan 2–3)',
              lang: 'ID',
              type: 'Course',
            },
            {
              title: 'Vue 3 Dasar',
              url: 'https://youtube.com/playlist?list=PLnQvfeVegcJbV2NGXpay7ulU6ybASzAlG',
              author: 'Nusendra Hanggarawan',
              category: 'Vue.js 3 (Bulan 3)',
              lang: 'ID',
              type: 'Course',
            },
            {
              title: 'Vue 3 Composition API',
              url: 'https://youtube.com/playlist?list=PLnQvfeVegcJbn7ZDOUNbRN25obY4htSlB',
              author: 'Nusendra Hanggarawan',
              category: 'Vue.js 3 (Bulan 3)',
              lang: 'ID',
              type: 'Course',
            },
            {
              title: 'Vue 3 Lanjutan & Pinia',
              url: 'https://youtube.com/playlist?list=PLnQvfeVegcJYV7uSax0W8z3peCyiOxr6W',
              author: 'Nusendra Hanggarawan',
              category: 'Vue.js 3 (Bulan 3)',
              lang: 'ID',
              type: 'Course',
            },
            {
              title: 'Tutorial Vue.js dengan API Bahasa Indonesia',
              url: 'https://www.youtube.com/playlist?list=PLIan8aHxsPj3a7oLHb2a8pw8IHBq45WYu',
              author: 'Wahidev Academy',
              category: 'Vue.js + API (Bulan 3)',
              lang: 'ID',
              type: 'Course',
            },
            {
              title: 'Tutorial TypeScript Dasar',
              url: 'https://www.youtube.com/watch?v=C_C64faSO4c',
              author: 'Eko Kurniawan Khannedy (Programmer Zaman Now)',
              category: 'TypeScript (Bulan 3)',
              lang: 'ID',
              type: 'Course',
            },
            {
              title: 'TypeScript Dasar & OOP TypeScript',
              url: 'https://www.youtube.com/playlist?list=PLnQvfeVegcJbjCnML6FdusK-rl-oDRMXJ',
              author: 'Nusendra Hanggarawan',
              category: 'TypeScript (Bulan 3)',
              lang: 'ID',
              type: 'Course',
            },
            {
              title: 'Tutorial Docker untuk Pemula (Roadmap Lanjutan)',
              url: 'https://www.youtube.com/playlist?list=PL-CtdCApEFH-A7jBmdertzbeACuQWvQao',
              author: 'Eko Kurniawan Khannedy (Programmer Zaman Now)',
              category: 'Pasca-Bootcamp DevOps',
              lang: 'ID',
              type: 'Course',
            },
          ],
        },
      },
      {
        slideNumber: 4,
        isSummary: true,
        layoutType: 'references',
        badge: 'PBL & Docs Resmi',
        title: 'Kurasi Project-Based Learning & Dokumentasi Resmi',
        subtitle:
          'Ide proyek latihan bertahap beserta dokumentasi resmi dari HTML hingga Railway.',
        contentJson: {
          eyebrow: 'Pilar 3 & 4 • Latihan Proyek Nyata & Official Docs',
          highlights: [
            'Jadikan dokumentasi resmi rujukan utama untuk Nuxt, TypeScript, dan Vite.',
            'Pilih satu proyek kecil PBL setiap akhir pekan untuk latihan.',
          ],
          references: [
            {
              title: 'Build a Loading Screen (HTML & CSS)',
              url: 'https://medium.freecodecamp.org/how-to-build-a-delightful-loading-screen-in-5-minutes-847991da509f',
              author: 'Project Based Learning',
              category: 'PBL HTML & CSS',
              lang: 'EN',
              type: 'PBL',
            },
            {
              title: 'Build an HTML Calculator with JS',
              url: 'https://medium.freecodecamp.org/how-to-build-an-html-calculator-app-from-scratch-using-javascript-4454b8714b98',
              author: 'Project Based Learning',
              category: 'PBL HTML/CSS/JS',
              lang: 'EN',
              type: 'PBL',
            },
            {
              title: 'Build a Todo List App in JavaScript',
              url: 'https://github.com/dwyl/javascript-todo-list-tutorial',
              author: 'dwyl (Project Based Learning)',
              category: 'PBL JavaScript',
              lang: 'EN',
              type: 'PBL',
            },
            {
              title: 'Build a Simple Weather App with Vanilla JS',
              url: 'https://webdesign.tutsplus.com/tutorials/build-a-simple-weather-app-with-vanilla-javascript--cms-33893',
              author: 'Project Based Learning',
              category: 'PBL JavaScript & Fetch API',
              lang: 'EN',
              type: 'PBL',
            },
            {
              title: 'JavaScript30 || Build 30 Things in 30 Days',
              url: 'https://javascript30.com',
              author: 'Wes Bos (PBL)',
              category: 'PBL JavaScript',
              lang: 'EN',
              type: 'PBL',
            },
            {
              title: 'Creating a Simple Budgeting App with Vue',
              url: 'https://matthiashager.com/complete-vuejs-application-tutorial/',
              author: 'Matthias Hager (PBL)',
              category: 'PBL Vue.js',
              lang: 'EN',
              type: 'PBL',
            },
            {
              title: 'Full Stack MEVN Application (Pembanding Arsitektur)',
              url: 'https://medium.com/@anaida07/mevn-stack-application-part-1-3a27b61dcae0',
              author: 'Project Based Learning',
              category: 'PBL Fullstack',
              lang: 'EN',
              type: 'PBL',
            },
            {
              title: 'MDN Web Docs || HTML & CSS',
              url: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
              author: 'Mozilla MDN',
              category: 'Official Docs (Bulan 1)',
              lang: 'EN',
              type: 'Docs',
            },
            {
              title: 'Node.js Learn & Express Documentation',
              url: 'https://nodejs.org/en/learn',
              author: 'OpenJS Foundation',
              category: 'Official Docs (Bulan 2)',
              lang: 'EN',
              type: 'Docs',
            },
            {
              title: 'MySQL Documentation',
              url: 'https://dev.mysql.com/doc/',
              author: 'Oracle MySQL',
              category: 'Official Docs (Bulan 2–3)',
              lang: 'EN',
              type: 'Docs',
            },
            {
              title: 'Vite Guide & Vue.js Official Documentation',
              url: 'https://vite.dev/guide/',
              author: 'Vite & Vue Core Team',
              category: 'Official Docs (Bulan 3)',
              lang: 'EN',
              type: 'Docs',
            },
            {
              title: 'TypeScript Handbook',
              url: 'https://www.typescriptlang.org/docs/handbook/intro.html',
              author: 'Microsoft TypeScript',
              category: 'Official Docs (Bulan 3)',
              lang: 'EN',
              type: 'Docs',
            },
            {
              title: 'Nuxt Documentation & Server Directory',
              url: 'https://nuxt.com/docs',
              author: 'Nuxt Core Team',
              category: 'Official Docs (Bulan 3)',
              lang: 'EN',
              type: 'Docs',
            },
            {
              title: 'Postman Learning Center & Railway Docs',
              url: 'https://docs.railway.com/',
              author: 'Postman & Railway',
              category: 'Official Docs (Testing & Deploy)',
              lang: 'EN',
              type: 'Docs',
            },
          ],
        },
      },
    ],
  },
];
