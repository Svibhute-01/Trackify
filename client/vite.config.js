import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: true,
    proxy: {
       '/auth': { target: 'http://localhost:4000' },
  '/buses': { target: 'http://localhost:4000' },
  '/routes': { target: 'http://localhost:4000' },
  '/schedules': { target: 'http://localhost:4000' },
  '/drivers': { target: 'http://localhost:4000' }
    },
  },
})
