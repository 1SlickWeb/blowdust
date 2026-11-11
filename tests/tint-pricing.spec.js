import { test, expect } from '@playwright/test'

// The window-tint price list (src/components/TintPricing) and the
// "?tintPackage=" deep link into the quote form.

test.describe('tint pricing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/services')
  })

  test('publishes every coverage tier, all quoted rather than priced', async ({ page }) => {
    const list = page.locator('#tint-pricing')
    await expect(list).toBeVisible()

    for (const name of [
      '2 Windows',
      'Side Windows & Rear Screen',
      'Full Car',
    ]) {
      const row = list.locator('.tint-pricing__row', { hasText: name }).first()
      await expect(row).toContainText(/on quote/i)
    }
    expect(await list.innerText()).not.toMatch(/[$][0-9]/)
  })

  test('lists the tint add-ons, all On quote, including the per-window unit', async ({ page }) => {
    const list = page.locator('#tint-pricing')
    await expect(list).toContainText('Quarter Panels')
    await expect(list).toContainText('Windshield')
    expect(await list.innerText()).not.toMatch(/[$][0-9]/)

    // Tint removal is priced per window, not per car — the unit has to survive
    // even with no figure attached to it.
    const removal = list
      .locator('.tint-pricing__row', { hasText: 'Tint Removal' })
      .first()
    await expect(removal).toContainText(/on quote/i)
    await expect(removal).toContainText(/per window/i)
  })

  test('never shows the struck-out $119 option from the source sheet', async ({
    page,
  }) => {
    // The client's sheet carried a fourth package at $119 whose name was
    // crossed out and unreadable. A price with no service attached must not
    // reach the site — see data/tintPricing.js.
    expect(await page.locator('#tint-pricing').innerText()).not.toContain('119')
  })

  test('keeps a single orange CTA in the pricing block', async ({ page }) => {
    // Brand rule CLAUDE.md §2.5 — the rows are cyan links, not buttons.
    await expect(page.locator('#tint-pricing .btn')).toHaveCount(1)
  })
})

test.describe('tint package deep link', () => {
  test('a coverage tier carries its name into the quote form', async ({ page }) => {
    await page.goto('/services')
    await page
      .locator('#tint-pricing')
      .getByRole('link', { name: 'Full Car' })
      .click()

    await expect(page).toHaveURL(/\/contact\?/)
    await expect(page.getByLabel('Service needed *')).toHaveValue('Window Tinting')
    await expect(page.getByLabel('Notes')).toHaveValue(/Full Car/)
  })

  test('ignores a tintPackage that is not one we offer', async ({ page }) => {
    await page.goto('/contact?service=Window%20Tinting&tintPackage=%3Cscript%3E')

    await expect(page.getByLabel('Service needed *')).toHaveValue('Window Tinting')
    await expect(page.getByLabel('Notes')).toHaveValue('')
  })
})
