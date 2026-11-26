import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    watch: {
      ignored: [
        '**/.data/**',
        '**/docs/**',
        '**/media/**',
        '**/dist/**',
        '**/.archify/**',
        '**/prep doc/**',
        '**/materi batch 1/**',
      ],
    },
  },
  ssr: {
    noExternal: ['@phosphor-icons/react'],
  },
});

