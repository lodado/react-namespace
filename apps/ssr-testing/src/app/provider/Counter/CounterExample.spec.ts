import { expect, test } from '@playwright/test'

test.describe('Namespace Store Tests', () => {
  test('renders with initial state', async ({ page }) => {
    await page.goto('/provider/Counter')
    const countValue = await page.textContent('[data-testid="count-value"]')
    expect(countValue).toBe('Count: 0')
  })

  test('increments the count', async ({ page }) => {
    await page.goto('/provider/Counter')
    await page.click('[data-testid="increment-button"]')
    const countValue = await page.textContent('[data-testid="count-value"]')
    expect(countValue).toBe('Count: 1')
  })

  test('decrements the count', async ({ page }) => {
    await page.goto('/provider/Counter')
    await page.click('[data-testid="increment-button"]')
    await page.click('[data-testid="decrement-button"]')
    const countValue = await page.textContent('[data-testid="count-value"]')
    expect(countValue).toBe('Count: 0')
  })

  test('resets the count', async ({ page }) => {
    await page.goto('/provider/Counter')
    await page.click('[data-testid="increment-button"]')
    await page.click('[data-testid="reset-button"]')
    const countValue = await page.textContent('[data-testid="count-value"]')
    expect(countValue).toBe('Count: 0')
  })

  test('handles multiple increments and decrements', async ({ page }) => {
    await page.goto('/provider/Counter')
    await page.click('[data-testid="increment-button"]')
    await page.click('[data-testid="increment-button"]')
    await page.click('[data-testid="decrement-button"]')
    const countValue = await page.textContent('[data-testid="count-value"]')
    expect(countValue).toBe('Count: 1')
  })
})
