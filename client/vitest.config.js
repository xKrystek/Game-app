import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': resolve(__dirname, '.') }
  },
  test: {
    environment: 'jsdom',
    globals: true, // so you can use expect/test/describe without importing
    setupFiles: './tests/setup.js'
  }
});
