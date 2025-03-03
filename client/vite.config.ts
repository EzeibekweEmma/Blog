import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import postcss from './postcss.config.ts'

export default defineConfig({
  plugins: [react()],
  css: { postcss },
  base: '/'
})
