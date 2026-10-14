// Turns the project illustrations in design/project-art/*.html into the JPG images the
// project cards show (public/images/projects/<name>.jpg).
//
// Usage: node scripts/render-art.mjs           all illustrations
//        node scripts/render-art.mjs larva     just one
//
// The illustrations are drawn in SVG, so they stay easy to edit: change the HTML file,
// run this script again, and the card picks up the new image.

import { readdir } from 'node:fs/promises'
import { chromium } from 'playwright-core'
import { createServer } from 'vite'

const only = process.argv[2]
const files = (await readdir('design/project-art'))
  .filter((file) => file.endsWith('.html'))
  .filter((file) => !only || file === `${only}.html`)

// Vite's dev server lets the illustrations load the site's self-hosted fonts from node_modules.
const server = await createServer({ server: { port: 5199 }, logLevel: 'silent' })
await server.listen()
const base = server.resolvedUrls.local[0]

const browser = await chromium.launch({ channel: 'msedge' })
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } })

try {
  for (const file of files) {
    await page.goto(`${base}design/project-art/${file}`, { waitUntil: 'networkidle' })
    await page.evaluate(() => document.fonts.ready)
    const out = `public/images/projects/${file.replace('.html', '.jpg')}`
    await page.screenshot({ path: out, type: 'jpeg', quality: 86 })
    console.log(`saved ${out}`)
  }
} finally {
  await browser.close()
  await server.close()
}
