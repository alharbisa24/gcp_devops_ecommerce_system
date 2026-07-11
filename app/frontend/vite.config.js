import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/register': 'http://localhost:8000',
      '/login': 'http://localhost:8000',
      '/items': 'http://localhost:8000',
      '/orders': 'http://localhost:8001',
      '/orders/by-number': 'http://localhost:8001',
    },
  },
})
