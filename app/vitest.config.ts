import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    // Mirror vite.config.ts: '@' alias, and .ts before the legacy .js twins
    // (router/index, store/auth.store) so tests load the same modules as build.
    extensions: ['.mts', '.ts', '.tsx', '.mjs', '.js', '.jsx', '.json'],
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    include: ['tests/unit/**/*.spec.{js,ts}'],
    setupFiles: ['tests/setup.ts'],
  },
});
