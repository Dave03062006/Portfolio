import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// Vite runs the site locally (`npm run dev`) and builds it for the web (`npm run build`).
// The `test` block configures Vitest, which runs the files ending in `.test.ts(x)`.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
