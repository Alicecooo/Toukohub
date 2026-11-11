import { test, expect } from '@playwright/test';

test('official WebGAL UI boots as 雨夜回声 and exposes start choice', async ({ page }) => {
  await page.goto('./');
  await expect(page).toHaveTitle(/雨夜回声/);

  // Dismiss WebGAL splash if present
  const splash = page.locator('.html-body__title-enter');
  if (await splash.isVisible().catch(() => false)) {
    await splash.click({ force: true });
  }

  // Title screen: start game
  const startBtn = page.getByText(/开始游戏|Start|スタート|새 게임|Nouvelle/i).first();
  if (await startBtn.isVisible().catch(() => false)) {
    await startBtn.click();
  } else {
    // Fallback: click likely title menu button role
    const anyStart = page.locator('div,button').filter({ hasText: /开始/ }).first();
    if (await anyStart.isVisible().catch(() => false)) await anyStart.click();
  }

  // Wait for dialogue / choice from start.txt
  await expect(page.getByText(/青岚学园|三声回响|顾舟/).first()).toBeVisible({ timeout: 20_000 });
});
