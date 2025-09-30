import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // This base path is for GitHub Pages deployment.
  // Replace '<your-repo-name>' with your actual repository name.
  base: '/<your-repo-name>/'
})
