import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': import.meta.cwd() }
  },
  test: {
    environment: 'jsdom',
    globals: true, // so you can use expect/test/describe without importing
    setupFiles: './tests/setup.js'
  }
});
