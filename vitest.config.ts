import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import EnvironmentPlugin from 'vite-plugin-environment';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    EnvironmentPlugin({
      VITE_API_BASE_URL: 'http://localhost:3000/api',
      VITE_UI_VERSION: '1.0',
    }),
  ],
  resolve: {
    alias: [
      {
        find: /^uuid$/,
        replacement: path.resolve(rootDir, './__mocks__/uuid.js'),
      },
      {
        find: /^react-date-picker$/,
        replacement: path.resolve(rootDir, './__mocks__/react-date-picker.js'),
      },
    ],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/tests/**/*.{test,spec}.{ts,tsx}'],
    css: false,
    coverage: {
      provider: 'v8',
      reporter: ['html', 'lcov', 'text-summary'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/__tests__/**',
        'src/**/*.{test,spec}.{ts,tsx}',
        'src/**/*.d.ts',
        'src/**/index.tsx',
        'src/**/reportWebVitals.ts',
        'src/**/*.{service,constant,interface,model}.ts',
      ],
    },
    reporters: ['default', 'junit'],
    outputFile: {
      junit: './coverage/junit/test-results.xml',
    },
  },
  envDir: './',
});
