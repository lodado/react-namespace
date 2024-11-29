import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  // Use fake timers to control async timing
  await page.context().addInitScript(() => {
    ;(window as any).__setTimeout = window.setTimeout
    ;(window as any).setTimeout = (fn: any, ms?: number) => {
      fn()
    }
  })
})

test.describe('Namespace Store Tests', () => {
  test('renders with initial state', async ({ page }) => {
    await page.goto('/suspense/Counter')

    await page.waitForSelector('[data-testid="loading"]', { state: 'detached' })

    await expect(page.locator('[data-testid="count-value"]')).toHaveText('Count: 1')
  })

  test('increments the count', async ({ page }) => {
    await page.goto('/suspense/Counter')
    await page.waitForSelector('[data-testid="loading"]', { state: 'detached' })

    await page.waitForTimeout(0)

    const incrementButton = await page.waitForSelector('[data-testid="increment-button"]')

    // 버튼 클릭
    await incrementButton.click()

    await expect(page.locator('[data-testid="count-value"]')).toHaveText('Count: 2')
  })

  test('increment 2 times the count', async ({ page }) => {
    await page.goto('/suspense/Counter')
    await page.waitForSelector('[data-testid="loading"]', { state: 'detached' })

    await page.waitForTimeout(0)

    const incrementButton = await page.waitForSelector('[data-testid="increment-button"]')

    // 버튼 클릭
    await incrementButton.click()
    await incrementButton.click()

    await expect(page.locator('[data-testid="count-value"]')).toHaveText('Count: 3')
  })
})
