import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Forward browser calls like /api/* to the backend.
      // Make the port configurable to avoid ECONNREFUSED when backend port changes.
      '/api': {
        target: `http://localhost:${3001}`,
        changeOrigin: true,
      },
    },
  },
})

