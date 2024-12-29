import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // or specify a host like '0.0.0.0' or 'localhost'
    port: 5173,
  }
})
