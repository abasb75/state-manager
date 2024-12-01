import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/state-manager',
  plugins: [react()],
  resolve: {
    alias: {
      "@lib":"/lib",
      "@src":"/react-test",
    },
  },
})
