import { test, expect, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const shotDir = join(process.cwd(), 'test-results', 'webgal-shots');
mkdirSync(shotDir, { recursive: true });

async function clickTitleStart(page: Page) {
  await page.goto('./');
  await expect(page).toHaveTitle('雨夜回声');
  // Title screen buttons are rendered as text nodes inside WebGAL title UI.
  const start = page.getByText('开始游戏', { exact: true });
  await expect(start).toBeVisible({ timeout: 30_000 });
  await page.screenshot({ path: join(shotDir, '01-title.png'), fullPage: true });
  await start.click();
}

async function advanceDialogue(page: Page, times = 1) {
  for (let i = 0; i < times; i++) {
    // Prefer spacebar advance; also click stage center as fallback.
    await page.keyboard.press('Space');
    await page.waitForTimeout(120);
  }
}

async function waitForChoice(page: Page, label: string) {
  const choice = page.getByText(label, { exact: true });
  // Keep advancing dialogue until the post-dialogue choose appears.
  for (let i = 0; i < 80; i++) {
    if (await choice.isVisible().catch(() => false)) return choice;
    await advanceDialogue(page, 1);
  }
  await expect(choice).toBeVisible({ timeout: 5_000 });
  return choice;
}

async function choose(page: Page, label: string) {
  const choice = await waitForChoice(page, label);
  await page.screenshot({
    path: join(shotDir, `choice-${label.slice(0, 12)}.png`),
    fullPage: true,
  });
  await choice.click();
}

async function reachText(page: Page, text: string | RegExp, maxAdvances = 100) {
  const locator = typeof text === 'string' ? page.getByText(text, { exact: false }) : page.getByText(text);
  for (let i = 0; i < maxAdvances; i++) {
    if (await locator.first().isVisible().catch(() => false)) return locator.first();
    await advanceDialogue(page, 1);
  }
  await expect(locator.first()).toBeVisible({ timeout: 5_000 });
  return locator.first();
}

test.describe('WebGAL Rain Echo', () => {
  test('title page enters ADV with figure and textbox', async ({ page }) => {
    await clickTitleStart(page);
    await reachText(page, /青岚学园|顾舟|回响/);
    // ADV chrome: name/text UI and stage should exist.
    await expect(page.locator('#textBox, .TextBox_main, [class*="TextBox"]').first()).toBeVisible({
      timeout: 15_000,
    });
    await page.screenshot({ path: join(shotDir, '02-adv-dialog.png'), fullPage: true });
  });

  test('branches to four endings', async ({ page }) => {
    const endings: Array<{ path: string[]; marker: RegExp; shot: string }> = [
      {
        path: ['去图书馆找林激', '一起听录音并核对证词', '先不公开录音，与林激守护备份'],
        marker: /回声中的约定/,
        shot: 'ending-echo.png',
      },
      {
        path: [
          '去图书馆找林激',
          '一起听录音并核对证词',
          '共同保全材料，讨论公开方式',
          '共同提交证据，要求重启调查',
        ],
        marker: /雨停之后的真相/,
        shot: 'ending-truth.png',
      },
      {
        path: [
          '跟夏遥去学生会查报纸',
          '按流程申请事故附件',
          '与夏遥核对档案手续',
          '先在校内说明并复核证词',
        ],
        marker: /不再沉默的春天/,
        shot: 'ending-spring.png',
      },
      {
        path: [
          '跟夏遥去学生会查报纸',
          '和夏遥检查旧广播线路',
          '冒雨闯入封锁区寻找原始带',
          '独自越过警戒线继续深入',
        ],
        marker: /雨夜回声/,
        shot: 'ending-nightmare.png',
      },
    ];

    for (const ending of endings) {
      await page.evaluate(() => localStorage.clear());
      await clickTitleStart(page);
      for (const label of ending.path) {
        await choose(page, label);
      }
      await reachText(page, ending.marker);
      await page.screenshot({ path: join(shotDir, ending.shot), fullPage: true });
    }
  });

  test('save and load from formal menus', async ({ page }) => {
    await clickTitleStart(page);
    await choose(page, '去图书馆找林激');
    await reachText(page, /图书馆|林激/);

    // Open save UI via control button label.
    const saveBtn = page.getByText('存档', { exact: true });
    await expect(saveBtn).toBeVisible({ timeout: 20_000 });
    await saveBtn.click();
    // Click first save slot area if present; otherwise click page center save panel.
    const slot = page.locator('[class*="Save_"], [class*="save"], .Meun_Save_item, [class*="Saving"]').first();
    if (await slot.isVisible().catch(() => false)) {
      await slot.click();
    } else {
      // Fallback: click approximate first slot region.
      await page.mouse.click(420, 320);
    }
    await page.waitForTimeout(500);

    // Return to title and load.
    const titleBtn = page.getByText('标题', { exact: true });
    if (await titleBtn.isVisible().catch(() => false)) {
      await titleBtn.click();
      const confirm = page.getByText('确定', { exact: false });
      if (await confirm.first().isVisible().catch(() => false)) {
        await confirm.first().click();
      }
    } else {
      await page.goto('./');
    }

    await expect(page.getByText('开始游戏', { exact: true })).toBeVisible({ timeout: 30_000 });
    const load = page.getByText('读取存档', { exact: true });
    await load.click();
    const loadSlot = page.locator('[class*="Save_"], [class*="save"], .Meun_Save_item, [class*="Saving"]').first();
    if (await loadSlot.isVisible().catch(() => false)) {
      await loadSlot.click();
    } else {
      await page.mouse.click(420, 320);
    }
    await reachText(page, /图书馆|林激|报刊/);
    await page.screenshot({ path: join(shotDir, '03-load.png'), fullPage: true });
  });

  test('exposes backlog and auto controls in-game', async ({ page }) => {
    await clickTitleStart(page);
    await reachText(page, /青岚学园|顾舟/);
    await expect(page.getByText('自动', { exact: true })).toBeVisible({ timeout: 20_000 });
    await expect(page.getByText('快进', { exact: true })).toBeVisible();
    await expect(page.getByText('回想', { exact: true })).toBeVisible();
    await page.getByText('回想', { exact: true }).click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: join(shotDir, '04-backlog.png'), fullPage: true });
    // Close backlog by Escape or clicking outside.
    await page.keyboard.press('Escape');
  });
});
