import { test, expect } from '@playwright/test';

test.describe('Volunteer pages', ()=>{
  test('pages render and interactions', async ({ page }) => {
    await page.goto('/app/volunteers');
    await expect(page.locator('text=Volunteer Command Center')).toBeVisible();

    await page.click('text=Volunteer Profiles');
    await expect(page).toHaveURL(/volunteers\/profiles/);

    await page.goto('/app/volunteers/events');
    await expect(page.locator('text=Upcoming Events')).toBeVisible();

    await page.goto('/app/volunteers/metrics');
    await expect(page.locator('text=Engagement Metrics')).toBeVisible();
    // toggle checkboxes
    const hours = page.locator('label:has-text("Hours") input');
    await hours.click();
    await expect(hours).not.toBeChecked();

    const smoothing = page.locator('label:has-text("Smoothing") input');
    await smoothing.click();
    await expect(smoothing).toBeChecked();

    await page.goto('/app/volunteers/comm');
    await expect(page.locator('text=Communication Hub')).toBeVisible();

    await page.goto('/app/volunteers/ai');
    await expect(page.locator('text=AI Suggestions')).toBeVisible();
  });
});
