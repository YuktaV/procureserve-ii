import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    port: 3005,
    host: true
  },
  define: {
    global: 'globalThis'
  }
})