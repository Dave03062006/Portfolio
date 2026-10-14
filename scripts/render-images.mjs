// Turns the drawings in design/ into the image files the site uses.
//
//   design/project-art/<name>.html  →  public/images/projects/<name>.webp   (project cards)
//   design/share/og.html            →  public/og.jpg                       (link previews)
//   design/share/touch-icon.html    →  public/apple-touch-icon.png         (iPhone home screen)
//
// Usage: node scripts/render-images.mjs           everything
//        node scripts/render-images.mjs larva     just the files whose name contains "larva"
//
// The drawings are SVG inside HTML, so they stay easy to edit: change the HTML file,
// run this script again, and the site picks up the new image.

import { readdir, writeFile } from 'node:fs/promises'
import { chromium } from 'playwright-core'
import { createServer } from 'vite'

const projectArt = (await readdir('design/project-art'))
  .filter((file) => file.endsWith('.html'))
  .map((file) => ({
    source: `design/project-art/${file}`,
    out: `public/images/projects/${file.replace('.html', '.webp')}`,
    // Drawn at 1600 × 1000, saved at 1200 × 750: sharp on a card even on high-resolution screens.
    width: 1600,
    height: 1000,
    scale: 0.75,
  }))

const jobs = [
  ...projectArt,
  { source: 'design/share/og.html', out: 'public/og.jpg', width: 1200, height: 630, scale: 1 },
  { source: 'design/share/touch-icon.html', out: 'public/apple-touch-icon.png', width: 180, height: 180, scale: 1 },
].filter((job) => !process.argv[2] || job.source.includes(process.argv[2]))

// Vite's dev server lets the drawings load the site's self-hosted fonts from node_modules.
const server = await createServer({ server: { port: 5199 }, logLevel: 'silent' })
await server.listen()
const base = server.resolvedUrls.local[0]
const browser = await chromium.launch({ channel: 'msedge' })

try {
  for (const job of jobs) {
    const page = await browser.newPage({
      viewport: { width: job.width, height: job.height },
      deviceScaleFactor: job.scale,
    })
    await page.goto(base + job.source, { waitUntil: 'networkidle' })
    await page.evaluate(() => document.fonts.ready)

    if (job.out.endsWith('.webp')) {
      // Browsers can't screenshot straight to WebP, so take a PNG and convert it in a canvas.
      const png = await page.screenshot({ type: 'png' })
      const webp = await page.evaluate(async (pngBase64) => {
        const image = new Image()
        image.src = `data:image/png;base64,${pngBase64}`
        await image.decode()
        const canvas = document.createElement('canvas')
        canvas.width = image.naturalWidth
        canvas.height = image.naturalHeight
        canvas.getContext('2d').drawImage(image, 0, 0)
        return canvas.toDataURL('image/webp', 0.82).split(',')[1]
      }, png.toString('base64'))
      await writeFile(job.out, Buffer.from(webp, 'base64'))
    } else if (job.out.endsWith('.jpg')) {
      await page.screenshot({ path: job.out, type: 'jpeg', quality: 88 })
    } else {
      await page.screenshot({ path: job.out, type: 'png' })
    }
    console.log(`saved ${job.out}`)
    await page.close()
  }
} finally {
  await browser.close()
  await server.close()
}
