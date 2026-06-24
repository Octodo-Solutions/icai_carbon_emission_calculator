import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // On GitHub Pages the app is served from /<repo-name>/, so the CI workflow
  // sets VITE_BASE_PATH to that sub-path. Locally it falls back to '/'.
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react()],
})
