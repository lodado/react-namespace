import { expect, test } from '@playwright/test'

test('Home page has correct title and content', async ({ page }) => {
  // Navigate to the homepage
  await page.goto('/')

  // Check the title
  await expect(page).toHaveTitle(/Next.js/)

  // Check for the H1 text
  const header = await page.locator('h1')
  await expect(header).toHaveText('Hello, Playwright!')

  // Click the button and verify the alert
  page.once('dialog', async (dialog) => {
    expect(dialog.message()).toBe('Button Clicked')
    await dialog.dismiss()
  })

  await page.click('text=Click Me')
})
