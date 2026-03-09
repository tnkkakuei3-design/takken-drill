import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/takken-drill/',
  build: {
    outDir: 'dist',
    minify: 'esbuild',
  },
})
