import { test, expect } from '@playwright/test'

test.describe('mobile navigation', () => {
  test.skip(({ isMobile }) => !isMobile, 'mobile-only behaviour')

  test('hamburger opens the menu and navigates', async ({ page }) => {
    await page.goto('/')

    const toggle = page.getByTestId('nav-toggle')
    await expect(toggle).toBeVisible()
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')

    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')

    const nav = page.getByRole('navigation', { name: 'Main navigation' })
    await expect(nav.getByRole('link', { name: 'Services' })).toBeVisible()

    await nav.getByRole('link', { name: 'Services' }).click()
    await expect(page).toHaveURL(/\/services$/)

    // menu closes after navigating
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await expect(nav.getByRole('link', { name: 'Gallery' })).toBeHidden()
  })

  test('menu shows all six pages and a call link', async ({ page }) => {
    await page.goto('/')
    await page.getByTestId('nav-toggle').click()

    const nav = page.getByRole('navigation', { name: 'Main navigation' })
    for (const label of ['Home', 'Services', 'Gallery', 'Testimonials', 'About', 'Contact']) {
      await expect(nav.getByRole('link', { name: label, exact: true })).toBeVisible()
    }
    await expect(nav.getByRole('link', { name: /^Call/ })).toHaveAttribute('href', /^tel:/)
  })

  test('desktop nav links are hidden behind the hamburger on mobile', async ({ page }) => {
    await page.goto('/')
    const nav = page.getByRole('navigation', { name: 'Main navigation' })
    await expect(nav.getByRole('link', { name: 'Services' })).toBeHidden()
  })
})
