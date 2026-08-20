import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
      '/static': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
      '/admin': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
      '/login': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
      '/logout': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
      '/demo': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
      '/download_resume': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      }
    }
  }
})
