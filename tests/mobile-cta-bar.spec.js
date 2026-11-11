import { test, expect } from '@playwright/test'

const PAGES = ['/', '/services', '/gallery', '/testimonials', '/about', '/contact']

test.describe('sticky mobile CTA bar', () => {
  test.skip(({ isMobile }) => !isMobile, 'mobile-only behaviour')

  for (const path of PAGES) {
    test(`visible and pinned to the bottom on ${path}`, async ({ page }) => {
      await page.goto(path)

      const bar = page.getByTestId('mobile-cta-bar')
      await expect(bar).toBeVisible()
      await expect(page.getByTestId('cta-bar-call')).toBeVisible()
      await expect(page.getByTestId('cta-bar-quote')).toBeVisible()

      // pinned to the viewport bottom even after scrolling
      await page.mouse.wheel(0, 2000)
      await page.waitForTimeout(300)
      const box = await bar.boundingBox()
      const viewport = page.viewportSize()
      expect(box.y + box.height).toBeGreaterThan(viewport.height - 2)
      await expect(bar).toBeVisible()
    })
  }

  test('call button is a tel: link, quote button routes to /contact', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('cta-bar-call')).toHaveAttribute('href', /^tel:\+?\d+/)
    await page.getByTestId('cta-bar-quote').click()
    await expect(page).toHaveURL(/\/contact$/)
    await expect(page.getByTestId('quote-form')).toBeVisible()
  })
})

test.describe('desktop', () => {
  test.skip(({ isMobile }) => isMobile, 'desktop-only behaviour')

  test('CTA bar is hidden on desktop widths', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('mobile-cta-bar')).toBeHidden()
  })
})
