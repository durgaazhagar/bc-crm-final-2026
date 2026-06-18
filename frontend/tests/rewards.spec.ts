import { test, expect } from '@playwright/test';

test.describe('Rewards Redemption flow', () => {
  test.beforeEach(async ({ page }) => {
    // Mock API responses for redemption flow
    await page.route('**/api/rewards/redeem', async (route) => {
      const req = route.request();
      const body = await req.postDataJSON().catch(() => ({}));
      // respond with updated points and badges
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ points: 1000, badges: ['lifesaver'] }),
      });
    });

    await page.route('**/api/rewards/history/*', async (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
    });

    await page.goto('/app/volunteers/rewards');
  });

  test('cards render with icons, names, points and Redeem buttons', async ({ page }) => {
    const cards = await page.locator('button:has-text("Redeem Now")');
    await expect(cards.first()).toBeVisible();
  });

  test('click Redeem Now opens modal and Confirm redeems', async ({ page }) => {
    const firstRedeem = page.locator('button:has-text("Redeem Now")').first();
    await firstRedeem.click();
    const confirm = page.locator('button:has-text("Confirm")');
    await expect(confirm).toBeVisible();
    await confirm.click();
    // success toast appears
    const toast = page.locator('text=Reward redeemed');
    await expect(toast).toBeVisible({ timeout: 5000 });
  });

  test('Cancel closes modal without changes', async ({ page }) => {
    await page.locator('button:has-text("Redeem Now")').first().click();
    await page.locator('button:has-text("Cancel")').click();
    await expect(page.locator('text=Confirm redemption')).toHaveCount(0);
  });
});
