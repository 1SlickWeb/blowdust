import { test, expect } from '@playwright/test'

// The window-tint visualiser (src/components/TintSimulator) and the
// "Get a quote for N% tint" deep link into the quote form.

// Opacity of the film layer over the car's glass. Higher = darker tint. Read
// computed rather than from the style attribute so the CSS transition is
// accounted for — always poll it, never sample once.
const filmOpacity = (page) =>
  page
    .locator('.tint-car__film')
    .evaluate((el) => Number(getComputedStyle(el).opacity))

async function openSimulator(page) {
  await page.goto('/services')
  const sim = page.locator('#tint-simulator')
  await sim.scrollIntoViewIfNeeded()
  return sim
}

test.describe('tint visualiser', () => {
  test('offers every percentage the client installs', async ({ page }) => {
    const sim = await openSimulator(page)
    for (const pct of ['5%', '15%', '20%', '35%', '40%', '50%']) {
      await expect(sim.getByRole('radio', { name: pct, exact: true })).toBeVisible()
    }
  })

  test('settles on the default level after the intro sweep', async ({ page }) => {
    const sim = await openSimulator(page)
    await expect(sim.getByRole('radio', { name: '20%', exact: true })).toHaveAttribute(
      'aria-checked',
      'true',
      { timeout: 5000 },
    )
  })

  test('a lower percentage darkens the glass', async ({ page }) => {
    const sim = await openSimulator(page)

    await sim.getByRole('radio', { name: '50%', exact: true }).click()
    await expect.poll(() => filmOpacity(page)).toBeLessThan(0.5)

    await sim.getByRole('radio', { name: '5%', exact: true }).click()
    await expect.poll(() => filmOpacity(page)).toBeGreaterThan(0.9)
  })

  test('the readout tracks the selection', async ({ page }) => {
    const sim = await openSimulator(page)
    await sim.getByRole('radio', { name: '35%', exact: true }).click()

    await expect(sim.locator('.tint-sim__pct')).toHaveText('35%')
    await expect(sim.locator('.tint-sim__name')).toHaveText(/medium/i)
  })

  test('arrow keys step through the picker', async ({ page }) => {
    const sim = await openSimulator(page)
    const chip = (pct) => sim.getByRole('radio', { name: pct, exact: true })

    await chip('20%').click()
    await chip('20%').press('ArrowRight')
    await expect(chip('35%')).toHaveAttribute('aria-checked', 'true')

    await chip('35%').press('ArrowLeft')
    await expect(chip('20%')).toHaveAttribute('aria-checked', 'true')
  })

  test('carries no prices — shade does not change the figure', async ({ page }) => {
    // Tint IS priced now, but by coverage (see #tint-pricing), not by
    // darkness: 5% costs the same as 50%. A figure here would imply it does.
    const sim = await openSimulator(page)
    expect(await sim.innerText()).not.toMatch(/[$][0-9]/)
  })
})

test.describe('tint visualiser layout', () => {
  // 360px is the floor CLAUDE.md §6 sets; 1199/1200 straddle the point where
  // the readout stops stacking and starts overlaying the car.
  const WIDTHS = [320, 360, 414, 620, 621, 768, 1024, 1199, 1200, 1440]

  test('never overflows horizontally at any width', async ({ page }) => {
    for (const width of WIDTHS) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/services')
      await page.locator('#tint-simulator').scrollIntoViewIfNeeded()
      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      )
      expect(overflow, `horizontal overflow at ${width}px`).toBe(0)
    }
  })

  test('every percentage chip stays a 44px touch target', async ({ page }) => {
    for (const width of [320, 360, 414, 620, 768]) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/services')
      const chips = page.locator('.tint-sim__chip')
      for (const box of await chips.evaluateAll((els) =>
        els.map((el) => el.getBoundingClientRect().height),
      )) {
        expect(box, `chip height at ${width}px`).toBeGreaterThanOrEqual(44)
      }
    }
  })

  test('the readout never prints over the car', async ({ page }) => {
    // The overlaid readout is fixed-size text sitting in the car's empty upper
    // left. The car scales with the container, so below 1200px the text
    // outgrows that corner and the blurb lands across the front fender. Guard
    // the rule that keeps it honest: overlay only once the stage has stopped
    // growing, otherwise stack.
    for (const width of [900, 1024, 1199, 1200, 1440]) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/services')
      await page.locator('#tint-simulator').scrollIntoViewIfNeeded()
      await page.waitForTimeout(300)

      const clash = await page.evaluate(() => {
        const readout = document.querySelector('.tint-sim__readout')
        if (getComputedStyle(readout).position !== 'absolute') return false
        const blurb = document.querySelector('.tint-sim__blurb').getBoundingClientRect()
        const car = document.querySelector('.tint-car').getBoundingClientRect()
        // Bottom edge of the blurb, expressed in the SVG's own viewBox units.
        const yInCar = ((blurb.bottom - car.top) / car.height) * 500
        const xInCar = ((blurb.right - car.left) / car.width) * 1200
        // The bodywork's top edge runs y≈236 at x=148 down to y≈210 at x=472.
        const bodyTop = xInCar < 148 ? Infinity : 236 - ((xInCar - 148) / 324) * 26
        return yInCar > bodyTop
      })
      expect(clash, `readout overlaps the car at ${width}px`).toBe(false)
    }
  })
})

test.describe('tint deep link', () => {
  test('the CTA carries the chosen percentage into the quote form', async ({
    page,
  }) => {
    const sim = await openSimulator(page)
    await sim.getByRole('radio', { name: '35%', exact: true }).click()
    await sim.getByRole('link', { name: /get a quote for 35% tint/i }).click()

    await expect(page).toHaveURL(/\/contact\?/)
    await expect(page.getByLabel('Service needed *')).toHaveValue('Window Tinting')
    await expect(page.getByLabel('Notes')).toHaveValue(/35% window tint/)
  })

  test('ignores a tint param that is not one of the offered levels', async ({
    page,
  }) => {
    await page.goto('/contact?service=Window%20Tinting&tint=99%3Cscript%3E')

    await expect(page.getByLabel('Service needed *')).toHaveValue('Window Tinting')
    await expect(page.getByLabel('Notes')).toHaveValue('')
  })
})
