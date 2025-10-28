import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': 'C:\\Users\\User\\Programowanie\\React\\tic-tac-toe\\client'
    }
  },
  server: {
    watch: {
      usePolling: true, // required for Docker volume mounts
      interval: 100 // optional: check file changes every 100ms
    }
  }
});
