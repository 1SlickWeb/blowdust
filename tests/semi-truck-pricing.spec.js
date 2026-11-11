import { test, expect } from '@playwright/test'

// The semi-truck package menu (src/components/SemiTruckPricing) and the
// "?truckPackage=" deep link into the quote form.

test.describe('semi-truck pricing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/services')
  })

  test('publishes all three tiers, each priced "On quote"', async ({ page }) => {
    const menu = page.locator('#semi-truck-packages')
    await expect(menu).toBeVisible()

    for (const name of ['Cab Essentials', 'Full Cab Detail', 'Complete Rig Detail']) {
      const card = menu.locator('.pkg', { hasText: name }).first()
      await expect(card).toContainText(/on quote/i)
    }
  })

  test('never shows a dollar figure — semi-truck stays quote-only', async ({
    page,
  }) => {
    // Brand rule CLAUDE.md §1: rig size and condition swing too far to post a
    // price. The package-menu format must not smuggle a number in.
    const text = await page.locator('#semi-truck-packages').innerText()
    expect(text).not.toMatch(/\$\d/)
  })

  test('tiers are cumulative and stay inside the confirmed cab-interior scope', async ({
    page,
  }) => {
    // No trailer wash, tire/rim dressing or exterior wash — see
    // data/services.js and the test in packages.spec.js that guards the same
    // rule on the top section.
    const text = await page.locator('#semi-truck-packages').innerText()
    expect(text).not.toMatch(/exterior|trailer wash|tire (&|and) rim/i)
    await expect(page.locator('#semi-truck-packages')).toContainText(
      'Aluminum & chrome polish',
    )
    await expect(page.locator('#semi-truck-packages')).toContainText(
      'Fuel tank polish',
    )
  })

  test('the top section links down to the package menu', async ({ page }) => {
    await page
      .locator('#semi-truck-detailing')
      .getByRole('link', { name: /see the full menu below/i })
      .click()
    await expect(page).toHaveURL(/#semi-truck-packages$/)
  })

  test('keeps a single orange CTA in the semi-truck pricing block', async ({
    page,
  }) => {
    // Brand rule CLAUDE.md §2.5 — tier cards use cyan links, not more buttons.
    await expect(page.locator('#semi-truck-packages .btn')).toHaveCount(1)
  })
})

test.describe('semi-truck package deep link', () => {
  test('a tier carries its name into the quote form', async ({ page }) => {
    await page.goto('/services')
    await page
      .locator('#semi-truck-packages')
      .getByRole('link', { name: /request this package/i })
      .last()
      .click()

    await expect(page).toHaveURL(/\/contact\?/)
    await expect(page.getByLabel('Service needed *')).toHaveValue(
      'Semi-Truck Detailing',
    )
    await expect(page.getByLabel('Notes')).toHaveValue(/Complete Rig Detail/)
  })

  test('ignores a truckPackage that is not one we offer', async ({ page }) => {
    await page.goto(
      '/contact?service=Semi-Truck%20Detailing&truckPackage=%3Cscript%3E',
    )

    await expect(page.getByLabel('Service needed *')).toHaveValue(
      'Semi-Truck Detailing',
    )
    await expect(page.getByLabel('Notes')).toHaveValue('')
  })
})
