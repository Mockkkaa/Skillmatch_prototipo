import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      // Toda petición que empiece con /api se redirige al backend
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,  // Cambia el header 'Host' al del target
        secure: false,       // Permite HTTP en desarrollo
      },
      // Proxy para archivos subidos (fotos de perfil, etc.)
      '/uploads': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
