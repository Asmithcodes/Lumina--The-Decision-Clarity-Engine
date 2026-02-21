import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/Lumina-The-Decision-Engine/',
  define: {
    'process.env': {}
  }
});