import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/lumina_-decision-clarity-engine/',
  define: {
    'process.env': {}
  }
});