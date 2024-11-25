import { expect, test } from '@playwright/test'

test.describe('TestComponentWithProvider SSR', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/scope/Counter')
  })

  test('renders initial state correctly on SSR', async ({ page }) => {
    const scope1 = await page.locator('text=scope1:2')
    const scope2 = await page.locator('text=scope2:200')

    // Ensure both scopes render with correct initial values
    await expect(scope1).toBeVisible()
    await expect(scope2).toBeVisible()
  })

  test('hydrates correctly and supports increment interactions', async ({ page }) => {
    const incrementButtons = await page.locator('[data-testid="increment-button"]')
    const scope1 = await page.locator('[data-testid="scope1"]')
    const scope2 = await page.locator('[data-testid="scope2"]')

    // Increment scope1
    await incrementButtons.nth(0).click()

    await expect(scope1).toHaveText('scope1:3')

    await incrementButtons.nth(1).click()

    await expect(scope2).toHaveText('scope2:201')
  })

  test('isolates state between multiple scopes', async ({ page }) => {
    const scope1 = await page.locator('[data-testid="scope1"]')
    const scope2 = await page.locator('[data-testid="scope2"]')
    const incrementButtons = await page.locator('[data-testid="increment-button"]')

    // Increment only scope1
    await incrementButtons.nth(0).click()
    await expect(scope1).toHaveText('scope1:3')
    await expect(scope2).toHaveText('scope2:200')

    // Increment only scope2
    await incrementButtons.nth(1).click()
    await expect(scope1).toHaveText('scope1:3')
    await expect(scope2).toHaveText('scope2:201')
  })
})
