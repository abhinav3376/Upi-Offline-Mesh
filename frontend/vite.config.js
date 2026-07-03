import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Dev server on :5173. API calls go straight to the Spring backend on
// :8080 (see src/api/client.js) using credentials: 'include' + CORS —
// no proxy needed, but one is left here commented in case you'd rather
// avoid configuring CORS on the backend at all.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // proxy: {
    //   '/api': 'http://localhost:8080',
    //   '/oauth2': 'http://localhost:8080',
    //   '/login': 'http://localhost:8080',
    // },
  },
});
