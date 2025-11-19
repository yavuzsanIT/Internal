import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // load env variables for current mode (development/production)
  const env = loadEnv(mode, (globalThis as any).process?.cwd?.() || '.', '');
  const base = env.VITE_BASE || '/';

  return {
    base,
    plugins: [react()],
    server: {
      port: 5173,
      open: true,
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
    },
  };
});
