// Takes screenshots of the built site in headless Microsoft Edge, so changes can be
// checked at laptop and phone sizes without clicking around by hand.
//
// Usage (build first):
//   npm run build
//   npm run shots                          all chapters, at laptop, tablet and phone sizes
//   npm run shots -- --at=0,0.12,about     scroll positions: 0–1 fractions of the page, pixels (760px), or section ids
//   npm run shots -- --only=phone          one viewport only (desktop | tablet | phone)
//   npm run shots -- --reduced-motion      as if "reduce motion" is on in the OS
//   npm run shots -- --no-webgl            as if the browser has no 3D support
//   npm run shots -- --full                one tall screenshot of the whole page
//
// Screenshots are saved in the `shots/` folder, which git ignores.

import { mkdir } from 'node:fs/promises'
import { chromium } from 'playwright-core'
import { preview } from 'vite'

const args = process.argv.slice(2)
const has = (name) => args.includes(`--${name}`)
const value = (name, fallback) => {
  const hit = args.find((arg) => arg.startsWith(`--${name}=`))
  return hit ? hit.slice(name.length + 3) : fallback
}

const VIEWPORTS = {
  desktop: { width: 1440, height: 900, deviceScaleFactor: 1 },
  tablet: { width: 820, height: 1180, deviceScaleFactor: 1, isMobile: true, hasTouch: true },
  phone: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
}
const only = value('only', '')
const viewports = Object.entries(VIEWPORTS).filter(([name]) => !only || name === only)
const targets = value('at', 'intro,about,projects,experience,contact').split(',')
const reducedMotion = has('reduced-motion')
const noWebgl = has('no-webgl')
const tag = [reducedMotion && 'reduced', noWebgl && 'nowebgl'].filter(Boolean).join('-')

await mkdir('shots', { recursive: true })

// Serve the `dist/` folder exactly like `npm run preview` does.
const server = await preview({ preview: { port: 4173, strictPort: false }, logLevel: 'silent' })
const url = server.resolvedUrls.local[0]

const browser = await chromium.launch({
  channel: 'msedge',
  args: noWebgl
    ? ['--disable-webgl', '--disable-webgl2', '--disable-3d-apis']
    : [], // the machine's real graphics card renders the 3D logo
})

try {
  for (const [name, viewport] of viewports) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: viewport.deviceScaleFactor,
      isMobile: viewport.isMobile ?? false,
      hasTouch: viewport.hasTouch ?? false,
      reducedMotion: reducedMotion ? 'reduce' : 'no-preference',
    })
    const page = await context.newPage()
    page.on('pageerror', (error) => console.error(`[page error] ${error.message}`))
    await page.goto(url, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1200) // let fonts settle and the intro play

    if (has('full')) {
      // Scroll down the page like a visitor would, so lazily loaded images load, then go back up.
      await page.evaluate(async () => {
        for (let y = 0; y < document.documentElement.scrollHeight; y += window.innerHeight / 2) {
          window.scrollTo({ top: y, behavior: 'instant' })
          await new Promise((resolve) => setTimeout(resolve, 120))
        }
        window.scrollTo({ top: 0, behavior: 'instant' })
      })
      await page.waitForTimeout(1200)
      const file = `shots/${[tag, name, 'full'].filter(Boolean).join('-')}.png`
      await page.screenshot({ path: file, fullPage: true })
      console.log(`saved ${file}`)
    } else {
      for (const target of targets) {
        await page.evaluate((t) => {
          const max = document.documentElement.scrollHeight - window.innerHeight
          const asNumber = Number(t)
          let top
          if (t.endsWith('px')) top = Number.parseFloat(t) // exact pixels, e.g. 760px
          else if (!Number.isNaN(asNumber)) top = asNumber * max // a fraction of the page, e.g. 0.5
          else top = (document.getElementById(t)?.getBoundingClientRect().top ?? 0) + window.scrollY
          window.scrollTo({ top, behavior: 'instant' })
        }, target)
        await page.waitForTimeout(900) // scroll-linked animation eases into place
        const file = `shots/${[tag, name, target.replace('.', '_')].filter(Boolean).join('-')}.png`
        await page.screenshot({ path: file })
        console.log(`saved ${file}`)
      }
    }
    await context.close()
  }
} finally {
  await browser.close()
  await new Promise((resolve) => server.httpServer.close(resolve))
}
