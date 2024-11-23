import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import EnvironmentPlugin from 'vite-plugin-environment';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    EnvironmentPlugin(['VITE_API_BASE_URL', 'VITE_UI_VERSION']) // Adicione suas variáveis de ambiente aqui
  ],
  build: {
    outDir: 'dist', // Especifique o novo diretório de saída
  },
  // Configure o Vite para usar variáveis de ambiente
  envDir: './',
});

/*import { defineConfig } from 'vite';
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

 */