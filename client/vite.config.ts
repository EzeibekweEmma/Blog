import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import postcss from './postcss.config.ts'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  css: { postcss },
  base: '/',
  build: {
    sourcemap: true, // Source maps for debugging
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['react-helmet-async', 'react-toastify'],
          utils: ['axios', 'dompurify', 'js-cookie']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'axios']
  }
})
