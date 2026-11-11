import { test, expect } from '@playwright/test'
import { CAB_WORK, CAB_WORK_PAGE_SIZE } from '../src/data/cabWork.js'

// The cab-interior wall is ~98 photos. The whole point of the component is
// that a phone on LTE never pays for all of them, so these guard the batching
// and the lazy/skeleton contract rather than the visual styling.

// Scoped to the truck wall specifically — /gallery now has a second, much
// smaller <PhotoGrid /> for car interiors (see carCabinWork.js /
// gallery-car-cabins.spec.js), so an unscoped `.phototile` locator matches
// tiles from both.
const grid = (page) => page.locator('#truck-cab-wall .phototile')

test.describe('cab interior photo wall', () => {
  test('renders only the first batch until View more is pressed', async ({
    page,
  }) => {
    await page.goto('/gallery')

    await expect(grid(page)).toHaveCount(CAB_WORK_PAGE_SIZE)
    await expect(page.locator('#truck-cab-wall .photogrid__count')).toHaveText(
      `Showing ${CAB_WORK_PAGE_SIZE} of ${CAB_WORK.length}`,
    )

    await page.getByRole('button', { name: /View more/ }).click()
    await expect(grid(page)).toHaveCount(CAB_WORK_PAGE_SIZE * 2)

    // the button reports what's actually left, not a fixed label
    await expect(page.getByRole('button', { name: /View more/ })).toHaveText(
      `View more (${CAB_WORK.length - CAB_WORK_PAGE_SIZE * 2} left)`,
    )
  })

  test('every mounted thumbnail is lazy and reserves its box', async ({
    page,
  }) => {
    await page.goto('/gallery')

    const imgs = page.locator('#truck-cab-wall .phototile__img')
    const count = await imgs.count()
    expect(count).toBe(CAB_WORK_PAGE_SIZE)

    for (let i = 0; i < count; i++) {
      const img = imgs.nth(i)
      await expect(img).toHaveAttribute('loading', 'lazy')
      // explicit width/height + the tile's aspect-ratio are what stop the
      // grid shifting as photos stream in
      await expect(img).toHaveAttribute('width', /\d+/)
      await expect(img).toHaveAttribute('height', /\d+/)
    }
  })

  test('a tile that has not loaded keeps its skeleton up', async ({ page }) => {
    // hang every photo request so nothing can resolve
    await page.route('**/images/gallery/opt/**', () => {})
    await page.goto('/gallery')

    const tile = grid(page).first()
    await tile.scrollIntoViewIfNeeded()
    await expect(tile).not.toHaveClass(/is-loaded/)
    await expect(tile.locator('.phototile__skeleton')).toBeVisible()

    // the box is still reserved — a skeleton with no height would collapse
    const box = await tile.boundingBox()
    expect(box.height).toBeGreaterThan(100)
  })

  test('loaded tiles drop the skeleton', async ({ page }) => {
    await page.goto('/gallery')
    const tile = grid(page).first()
    await tile.scrollIntoViewIfNeeded()
    await expect(tile).toHaveClass(/is-loaded/)
  })

  test('lightbox opens on a tile and steps through the set', async ({
    page,
  }) => {
    await page.goto('/gallery')
    await grid(page).first().scrollIntoViewIfNeeded()
    await grid(page).first().click()

    const box = page.locator('.lightbox')
    await expect(box).toBeVisible()
    // counter is against the whole set, not the revealed batch
    await expect(page.locator('.lightbox__position')).toHaveText(
      `1 of ${CAB_WORK.length}`,
    )
    // nowhere to go back from the first photo
    await expect(page.getByRole('button', { name: 'Previous photo' })).toBeDisabled()

    await page.getByRole('button', { name: 'Next photo' }).click()
    await expect(page.locator('.lightbox__position')).toHaveText(
      `2 of ${CAB_WORK.length}`,
    )

    await page.keyboard.press('ArrowLeft')
    await expect(page.locator('.lightbox__position')).toHaveText(
      `1 of ${CAB_WORK.length}`,
    )

    await page.keyboard.press('Escape')
    await expect(box).toHaveCount(0)
  })

  test('stepping stops at the end of what has been revealed', async ({
    page,
  }) => {
    await page.goto('/gallery')
    await grid(page).last().scrollIntoViewIfNeeded()
    await grid(page).last().click()

    await expect(page.locator('.lightbox__position')).toHaveText(
      `${CAB_WORK_PAGE_SIZE} of ${CAB_WORK.length}`,
    )
    // photo 13 isn't mounted yet, so there is nothing to step to
    await expect(page.getByRole('button', { name: 'Next photo' })).toBeDisabled()
  })
})
