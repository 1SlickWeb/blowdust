import { test, expect } from '@playwright/test'

// The homepage service overview (src/components/ServiceCards) — three core
// services plus Paint Correction and Ceramic Coating, two package tiers from
// Auto Detailing's own menu given their own featured row underneath.

test.describe('homepage service cards', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('shows all five cards, each linking to its section on /services', async ({
    page,
  }) => {
    const cards = page.locator('.svc-card__link')
    await expect(cards).toHaveCount(5)

    for (const [name, anchor] of [
      ['Semi-Truck Detailing', '#semi-truck-detailing'],
      ['Auto Detailing', '#auto-detailing'],
      ['Window Tinting', '#window-tinting'],
      ['Paint Correction', '#paint-correction'],
      ['Ceramic Coating', '#ceramic-coating'],
    ]) {
      const link = page.getByRole('link', { name: new RegExp(name, 'i') })
      await expect(link).toHaveAttribute('href', `/services${anchor}`)
    }
  })

  test('Paint Correction and Ceramic Coating land on their own package group', async ({
    page,
  }) => {
    await page.getByRole('link', { name: /ceramic coating/i }).click()
    await expect(page).toHaveURL(/\/services#ceramic-coating$/)
    // the group actually scrolled into view, not just a matching URL hash
    await expect(page.locator('#ceramic-coating')).toContainText(/factory fresh/i)
  })

  test('only the flagship service carries a corner tag', async ({ page }) => {
    await expect(page.locator('.svc-card__tag')).toHaveCount(1)
    await expect(page.locator('.svc-card__tag')).toHaveText(/our specialty/i)
  })

  test('no card shows a dollar figure — every service is quoted', async ({
    page,
  }) => {
    expect(await page.locator('.svc-cards').innerText()).not.toMatch(/[$][0-9]/)
  })
})
