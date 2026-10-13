// FE-016: Field crew closes a ticket with a mandatory after-photo.
// Verifies the close button stays disabled until a photo is attached.
import { expect, test } from '@playwright/test'

test.describe('FE-016 crew closure: photo required', () => {
  test.use({
    viewport: { width: 360, height: 740 },
    hasTouch: true,
    isMobile: true,
  })

  test('close stays disabled until a photo is attached', async ({ page }) => {
    await page.goto('/field/tickets')

    const firstTicket = page.locator('[data-testid="ticket-card"]').first()
    await expect(firstTicket).toBeVisible()
    await firstTicket.click()

    const closeButton = page.locator('[data-testid="close-ticket"]')
    await expect(closeButton).toBeDisabled()

    const photoInput = page.locator('[data-testid="after-photo-input"]')
    await photoInput.setInputFiles({
      name: 'after.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from([0xff, 0xd8, 0xff, 0xe0]),
    })

    await expect(closeButton).toBeEnabled()
  })
})
