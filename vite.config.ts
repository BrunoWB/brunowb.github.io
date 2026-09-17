import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  base: './',
  server: {
    port: 5173,
    proxy: {
      '/scyan-zmk-studio': {
        target: 'http://127.0.0.1:5174',
        ws: true,
      },
      '/bwpx-editor': {
        target: 'http://127.0.0.1:5175',
        ws: true,
      },
    },
  },
});

