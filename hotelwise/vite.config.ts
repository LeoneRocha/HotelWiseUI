import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Especifique o novo diretório de saída
  },
  // Configure o Vite para usar variáveis de ambiente
  envDir: './',
});

 