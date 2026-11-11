import { test, expect } from '@playwright/test'

// The auto-detailing package menu (src/components/PackageMenu) and the
// "Request this package" deep link into the quote form.

test.describe('package menu', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/services')
  })

  test('renders every tier as On quote, never a dollar figure', async ({ page }) => {
    const menu = page.locator('#packages')
    await expect(menu).toBeVisible()

    for (const name of [
      'Select Interior Detail',
      'Signature Interior Detail',
      'Select Full Detail',
      'Premier Full Detail',
      'Signature Full Detail',
    ]) {
      const card = menu.locator('.pkg', { hasText: name }).first()
      await expect(card).toContainText(/on quote/i)
      expect(await card.innerText()).not.toMatch(/[$][0-9]/)
    }
  })

  test('lists the add-ons, all quoted rather than priced', async ({ page }) => {
    const addOns = page.locator('#add-ons')
    await expect(addOns).toContainText('Pet Hair Removal')
    await expect(addOns).toContainText('Headlight Restoration')
    await expect(addOns).toContainText('Glass Protection Treatment')
    expect(await addOns.innerText()).not.toMatch(/[$][0-9]/)
    await expect(addOns.locator('.addons__price').first()).toContainText(/on quote/i)
  })

  test('semi-truck detailing never shows a dollar figure', async ({
    page,
  }) => {
    // Every service is quote-only right now (see CLAUDE.md §1), but
    // semi-truck was the original and stays the one with no client-supplied
    // figures hidden behind the scenes at all — rigs vary too much to price.
    const text = await page.locator('#semi-truck-detailing').innerText()
    expect(text).not.toMatch(/[$][0-9]/)
  })

  test('ceramic coating tiers say they are quoted, not a made-up figure', async ({
    page,
  }) => {
    // The client supplied the coating line-ups without prices. The cards must
    // say so rather than borrow a number from a neighbouring tier.
    const group = page.locator('#ceramic-coating')
    await expect(group).toBeVisible()
    for (const name of ['Factory Fresh', 'Everyday Shield', 'Complete Revival']) {
      const card = group.locator('.pkg', { hasText: name }).first()
      await expect(card).toContainText(/on quote/i)
      expect(await card.innerText()).not.toMatch(/[$][0-9]/)
    }
  })

  test('paint correction tiers are quoted, never a dollar figure', async ({ page }) => {
    const group = page.locator('#paint-correction')
    for (const name of [
      'Decontamination',
      'Initial-Stage Package',
      '2nd Stage Paint Correction',
    ]) {
      const card = group.locator('.pkg', { hasText: name }).first()
      await expect(card).toContainText(/on quote/i)
      expect(await card.innerText()).not.toMatch(/[$][0-9]/)
    }
  })

  test('semi-truck section never advertises exterior detailing', async ({
    page,
  }) => {
    // The company doesn't do exterior work on rigs — cab interior and metal
    // polish only. Guards against exterior copy creeping back in.
    const text = await page.locator('#semi-truck-detailing').innerText()
    expect(text).not.toMatch(/exterior|trailer wash|tire (&|and) rim/i)
  })

  test('auto detailing lists pet hair removal as an add-on', async ({ page }) => {
    await expect(page.locator('#auto-detailing')).toContainText(
      /pet hair removal \(add-on\)/i,
    )
  })

  test('keeps a single orange CTA in the packages section', async ({ page }) => {
    // Brand rule CLAUDE.md §2.5 — tier cards use cyan links, not more buttons.
    await expect(page.locator('#packages .btn')).toHaveCount(1)
  })

  test('the auto-detailing top section offers a real number to call or DM, never a price', async ({
    page,
  }) => {
    // Replaces the old "Set packages from $149" callout — that figure no
    // longer exists anywhere on the site, so the box points people at the
    // phone instead of a number that isn't shown.
    const top = page.locator('#auto-detailing')
    await expect(top).toContainText(/call or dm us/i)
    const phoneLink = top.getByRole('link', { name: '(403) 313-7803' })
    await expect(phoneLink).toHaveAttribute('href', 'tel:+14033137803')
    expect(await top.innerText()).not.toMatch(/[$][0-9]/)
  })
})

test.describe('package deep link', () => {
  test('"Request this package" prefills the quote form', async ({ page }) => {
    await page.goto('/services')
    const card = page.locator('.pkg', { hasText: 'Premier Full Detail' }).first()
    await card.getByRole('link', { name: /request this package/i }).click()

    await expect(page).toHaveURL(/\/contact\?/)
    await expect(page.getByLabel('Service needed *')).toHaveValue('Auto Detailing')
    await expect(page.getByLabel('Notes')).toHaveValue(/Premier Full Detail/)
  })

  test('ignores unrecognised service and package params', async ({ page }) => {
    await page.goto('/contact?service=whatever&package=%3Cscript%3E')

    await expect(page.getByLabel('Service needed *')).toHaveValue('')
    await expect(page.getByLabel('Notes')).toHaveValue('')
  })
})
