import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // This base path is for GitHub Pages deployment.
  // It should match your repository name.
  base: '/Car/',
})