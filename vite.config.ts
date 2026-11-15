import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/clock_icon/',
  publicDir: 'mochi_assets',
  plugins: [react(), tailwindcss()],
});
