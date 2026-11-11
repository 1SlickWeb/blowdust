import { test, expect } from '@playwright/test'

// Real Google reviews replaced the placeholder array (src/data/testimonials).
// These guard the two things most likely to regress: placeholder copy sneaking
// back in, and the derived rating summary drifting from the review data.

const REVIEWERS = [
  'Charanjit Singh',
  'Serhii Chorpita',
  'Yograj Singh',
  'Ranjit Aujla',
  'Tarun Sarout',
  'Jag Singh',
  'Harpreet Singh',
  'sony mundi',
  'Jotinder Singh',
  'Priyanka Rana',
  'JP BRAR',
]

test.describe('testimonials', () => {
  test('every reviewer appears in the full review list', async ({ page }) => {
    await page.goto('/testimonials')
    const cards = page.locator('.review-card')
    await expect(cards).toHaveCount(REVIEWERS.length)

    for (const name of REVIEWERS) {
      await expect(cards.filter({ hasText: name })).toHaveCount(1)
    }
  })

  test('only the client-supplied reviewers appear — no others', async ({
    page,
  }) => {
    await page.goto('/testimonials')
    // Every name rendered anywhere on the page must be one of the 11 supplied.
    // Guards against vendored demo components reintroducing invented reviews.
    const names = await page
      .locator('.review-card footer strong, .tm-name')
      .allInnerTexts()
    for (const raw of names) {
      const name = raw.replace(/local guide/i, '').trim()
      expect(REVIEWERS).toContain(name)
    }
  })

  test('marquee rows are disjoint — no review shown twice at once', async ({
    page,
  }) => {
    await page.goto('/testimonials')
    const rows = page.locator('.testimonials-marquee__rows > div')
    const top = await rows.nth(0).innerText()
    const bottom = await rows.nth(1).innerText()

    expect(top).toContain('Charanjit Singh')
    expect(bottom).not.toContain('Charanjit Singh')
    expect(bottom).toContain('JP BRAR')
    expect(top).not.toContain('JP BRAR')
  })

  test('rating summary matches the review data', async ({ page }) => {
    await page.goto('/testimonials')
    const score = page.locator('.tm-score')
    await expect(score).toContainText('5.0')
    await expect(score).toContainText(`${REVIEWERS.length} reviews on Google`)
  })

  test('quotes are verbatim, including the reviewers’ own spelling', async ({
    page,
  }) => {
    await page.goto('/testimonials')
    // If someone "fixes" these, the reviews stop being what the people wrote.
    await expect(page.locator('.review-card')).toContainText([/puntual/])
    await expect(
      page.locator('.review-card', { hasText: 'Charanjit Singh' }),
    ).toContainText('fantasticly')
  })

  // Scoped to the review components on purpose: the gallery legitimately
  // renders a visible "Placeholder" tag on its stand-in before/after images
  // until the client's real photos land (BeforeAfter.jsx, CLAUDE.md §9).
  test('no placeholder copy survives in any review card', async ({ page }) => {
    for (const [route, selector] of [
      ['/', '.home-review'],
      ['/testimonials', '.review-card'],
      ['/testimonials', '.tm-avatar'],
    ]) {
      await page.goto(route)
      const cards = page.locator(selector)
      await expect(cards.first()).toBeVisible()
      for (const text of await cards.allInnerTexts()) {
        expect(text).not.toMatch(/placeholder/i)
      }
    }
  })

  test('home page previews three real reviews with star ratings', async ({
    page,
  }) => {
    await page.goto('/')
    const previews = page.locator('.home-review')
    await expect(previews).toHaveCount(3)
    await expect(previews.first()).toContainText('Charanjit Singh')
    await expect(previews.first().locator('.home-review__stars')).toContainText(
      '★★★★★',
    )
  })
})
