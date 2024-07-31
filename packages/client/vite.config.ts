import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Define constants for different environments
const API_BASE_URL = 'http://localhost:3000';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3300,
    proxy: {
      '/api': {
        target: API_BASE_URL,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
