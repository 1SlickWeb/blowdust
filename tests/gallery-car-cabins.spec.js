import { test, expect } from '@playwright/test'
import { CAR_CABIN_WORK } from '../src/data/carCabinWork.js'

// The car-interior wall on /gallery — a small, hand-curated companion to the
// much larger semi-truck cab wall (tests/gallery-cabwork.spec.js). No paging
// contract to guard here (the whole set fits on screen at once); this just
// checks the set actually renders as its own section and nothing from the
// excluded/held-back photos (see CAR_CABIN / HELD_BACK / NOT_A_VEHICLE in
// scripts/gen-gallery.mjs) leaked in.

const grid = (page) => page.locator('#car-cabin-wall .phototile')

test.describe('car interior photo wall', () => {
  test('shows every curated photo at once, with no "View more" left', async ({
    page,
  }) => {
    await page.goto('/gallery')
    await grid(page).first().scrollIntoViewIfNeeded()

    await expect(grid(page)).toHaveCount(CAR_CABIN_WORK.length)
    await expect(page.locator('#car-cabin-wall .photogrid__count')).toHaveText(
      `Showing ${CAR_CABIN_WORK.length} of ${CAR_CABIN_WORK.length}`,
    )
    await expect(
      page.locator('#car-cabin-wall').getByRole('button', { name: /View more/ }),
    ).toHaveCount(0)
  })

  test('sits in its own section, separate from the truck cab wall', async ({
    page,
  }) => {
    await page.goto('/gallery')
    await expect(page.locator('#car-cabin-wall')).toContainText(/inside the car/i)
    // neither section's heading/copy should bleed into the other
    await expect(page.locator('#truck-cab-wall')).not.toContainText(/inside the car/i)
    await expect(page.locator('#car-cabin-wall')).not.toContainText(/inside the cab\b/i)
  })

  test('lightbox opens on a tile and steps through the set', async ({ page }) => {
    await page.goto('/gallery')
    await grid(page).first().scrollIntoViewIfNeeded()
    await grid(page).first().click()

    const box = page.locator('.lightbox')
    await expect(box).toBeVisible()
    await expect(page.locator('.lightbox__position')).toHaveText(
      `1 of ${CAR_CABIN_WORK.length}`,
    )
    await expect(page.getByRole('button', { name: 'Previous photo' })).toBeDisabled()

    await page.getByRole('button', { name: 'Next photo' }).click()
    await expect(page.locator('.lightbox__position')).toHaveText(
      `2 of ${CAR_CABIN_WORK.length}`,
    )

    await page.keyboard.press('Escape')
    await expect(box).toHaveCount(0)
  })
})
