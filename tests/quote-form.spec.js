import { test, expect } from '@playwright/test'

test.describe('quote form validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact')
  })

  test('empty submit shows errors for every required field', async ({ page }) => {
    await page.getByRole('button', { name: /send quote request/i }).click()

    await expect(page.getByText('Please tell us your name.')).toBeVisible()
    await expect(page.getByText('We need a phone number to reach you.')).toBeVisible()
    await expect(page.getByText('We need an email for the written quote.')).toBeVisible()
    await expect(page.getByText('Select a vehicle type.')).toBeVisible()
    await expect(page.getByText('Select the service you’re after.')).toBeVisible()

    // still on the form, no success state
    await expect(page.getByTestId('quote-form')).toBeVisible()
  })

  test('rejects malformed phone and email', async ({ page }) => {
    await page.getByLabel('Phone *').fill('abc')
    await page.getByLabel('Email *').fill('not-an-email')
    await page.getByRole('button', { name: /send quote request/i }).click()

    await expect(page.getByText('That phone number doesn’t look right.')).toBeVisible()
    await expect(page.getByText('That email address doesn’t look right.')).toBeVisible()
  })

  test('valid submission reaches the success state', async ({ page }) => {
    await page.getByLabel('Name *').fill('Test Fleet Owner')
    await page.getByLabel('Phone *').fill('(403) 555-0000')
    await page.getByLabel('Email *').fill('test@example.com')
    await page.getByLabel('Vehicle type *').selectOption('Semi-truck / rig')
    await page.getByLabel('Service needed *').selectOption('Semi-Truck Detailing')
    await page.getByRole('button', { name: /send quote request/i }).click()

    await expect(page.getByTestId('quote-success')).toBeVisible()
    await expect(page.getByTestId('quote-success')).toContainText('Request received')
  })

  test('fixing an error clears it on next input', async ({ page }) => {
    await page.getByRole('button', { name: /send quote request/i }).click()
    await expect(page.getByText('Please tell us your name.')).toBeVisible()

    await page.getByLabel('Name *').fill('T')
    await expect(page.getByText('Please tell us your name.')).toBeHidden()
  })
})
