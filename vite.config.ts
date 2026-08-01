import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import EnvironmentPlugin from 'vite-plugin-environment';

/**
 * VITE_UI_VERSION é estático (commitado nos .env*).
 * Atualizar só com: npm run version:ui  |  pipeline/env override.
 * Não regenerar em todo `vite`/`dev`.
 */
function resolveUiVersion(env: Record<string, string>): string {
  const fromProcess = process.env.VITE_UI_VERSION?.trim();
  const fromFile = env.VITE_UI_VERSION?.trim();
  return fromProcess || fromFile || '0.0.0.0';
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const uiVersion = resolveUiVersion(env);

  return {
    plugins: [
      react(),
      EnvironmentPlugin({
        VITE_API_BASE_URL: env.VITE_API_BASE_URL || process.env.VITE_API_BASE_URL,
        VITE_UI_VERSION: uiVersion,
        VITE_TECHNOLOGIES_JSON: env.VITE_TECHNOLOGIES_JSON || process.env.VITE_TECHNOLOGIES_JSON || '[]',
      }),
    ],
    build: {
      outDir: 'dist',
      // Bundle principal ~1.2 MB (gzip ~340 KB); silencia o aviso padrão de 500 KB
      chunkSizeWarningLimit: 1500,
    },
    envDir: './',
  };
});
