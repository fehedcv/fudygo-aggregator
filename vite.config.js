import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // Use a relative base so built assets work when loaded from file:// (Capacitor)
  base: './',
  plugins: [react(), tailwindcss(), ],
})
