import type { MentorProfile } from '../../types/bootcamp';

export const DEFAULT_MENTOR_USER = {
  name: 'Alfin',
  email: 'kangalfin95@gmail.com',
  schoolOrigin: 'PT Digital Teknologi Perkasa',
  role: 'mentor' as const,
};

export const MENTOR_PROFILE: MentorProfile = {
  name: 'Alfin',
  roleTitle: 'Software Engineer Digitek Perkasa',
  company: 'PT Digital Teknologi Perkasa',
  division: 'Berfokus pada bidang Full-Stack Development, UI/UX Design, dan DevOps',
  tagline:
    'Saya merancang bootcamp ini untuk membagikan wawasan yang telah saya kuasai melalui penyampaian yang ringkas dan mudah diikuti. Seluruh materi disusun berdasarkan praktik kerja nyata, bukan sekadar teori.',
  specializations: [
    'Nuxt 4 & Nitro',
    'Vue 3 Composition API',
    'TypeScript',
    'Tailwind CSS',
    'Supabase & MySQL',
    'Neon Serverless Postgres',
    'AI & RAG Integrator',
  ],
  projects: [
    {
      name: 'CoupleCash',
      year: '2026',
      description:
        'Aplikasi keuangan pasangan dengan asisten AI dan pemindai struk otomatis berbasis Vision AI.',
      stack: ['Nuxt 4', 'Vue 3', 'TypeScript', 'Tailwind CSS', 'Vision AI'],
    },
    {
      name: 'Digitek Corporate Web',
      year: '2025',
      description:
        'Situs resmi dan panel admin PT Digital Teknologi Perkasa untuk manajemen profil layanan.',
      stack: ['Vue 3', 'Nuxt', 'Tailwind CSS', 'Supabase'],
    },
    {
      name: 'E-Lapak Pontren',
      year: '2025',
      description:
        'Platform niaga UMKM pondok pesantren yang memenuhi standar aksesibilitas inklusif WCAG 2.2 AA.',
      stack: ['HTML5', 'CSS3', 'JavaScript', 'WCAG 2.2 AA'],
    },
    {
      name: 'Katalog Website PPDB Pesantren Smart Digital',
      year: '2026',
      description:
        'Katalog solusi penerimaan santri baru berbasis web dengan mesin server Nitro dan Postgres.',
      stack: ['Nuxt', 'Vue 3', 'Nitro', 'Neon Serverless Postgres'],
    },
    {
      name: 'Gateway Pemesanan Padang & Web PPDB Yayasan',
      year: '2025',
      description:
        'Implementasi HTML semantik, Tailwind CSS, dan JavaScript interaktif untuk UMKM serta yayasan pendidikan.',
      stack: ['HTML5', 'CSS3', 'Tailwind CSS', 'JavaScript'],
    },
  ],
  contacts: {
    websites: ['https://allfine.my.id'],
    whatsapp: 'https://wa.me/6285789824597',
    email: 'kangalfin95@gmail.com',
    cvUrl: 'https://allfine.my.id/Alfin-Almustajab-CV.pdf',
  },
};
