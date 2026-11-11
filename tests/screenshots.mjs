// One-off helper: full-page screenshots of every route at 360/768/1440.
// Usage: node tests/screenshots.mjs <outDir> (expects preview server on :4173)
import { chromium } from '@playwright/test'

const outDir = process.argv[2] ?? 'screenshots'
const routes = ['', 'services', 'gallery', 'testimonials', 'about', 'contact']
const widths = [360, 768, 1440]

const browser = await chromium.launch()
for (const width of widths) {
  const page = await browser.newPage({ viewport: { width, height: 900 } })
  for (const route of routes) {
    await page.goto(`http://localhost:4173/${route}`, { waitUntil: 'networkidle' })
    // let reveal animations settle
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(1200)
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(400)
    await page.screenshot({
      path: `${outDir}/${route || 'home'}-${width}.png`,
      fullPage: true,
    })
  }
  await page.close()
}
await browser.close()
console.log('done')
