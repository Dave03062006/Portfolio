import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vitest/config'

/**
 * The site's public web address. Link previews (WhatsApp, LinkedIn, Instagram...) need the
 * full address of the preview image, so change this once the site is published.
 */
const SITE_URL = 'https://dave-tristian-portfolio.vercel.app'

/** Fills in %SITE_URL% wherever it appears in index.html. */
const siteUrl = (): Plugin => ({
  name: 'site-url',
  transformIndexHtml: (html) => html.replaceAll('%SITE_URL%', SITE_URL),
})

// Vite runs the site locally (`npm run dev`) and builds it for the web (`npm run build`).
// The `test` block configures Vitest, which runs the files ending in `.test.ts(x)`.
export default defineConfig({
  plugins: [react(), siteUrl()],
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
