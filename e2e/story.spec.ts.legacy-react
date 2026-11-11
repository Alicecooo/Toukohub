import { test, expect } from '@playwright/test';

const fixture = {
  version: 'e2e-1', startNode: 'start', characters: { narrator: '旁白' },
  nodes: [
    { id: 'start', speaker: 'narrator', text: '测试剧情起点', choices: [{ text: '分支一', next: 'middle' }, { text: '直达结局二', next: 'ending-2' }, { text: '直达结局三', next: 'ending-3' }, { text: '直达结局四', next: 'ending-4' }] },
    { id: 'middle', text: '测试剧情分支', choices: [{ text: '结局一', next: 'ending-1' }] },
    ...['一', '二', '三', '四'].map((number, i) => ({ id: `ending-${i + 1}`, text: '故事结束', ending: { title: `结局${number}` } })),
  ],
};

test.beforeEach(async ({ page }) => {
  await page.route('**/Toukohub/story.json', route => route.fulfill({ json: fixture }));
});

test('plays a branch to an ending and persists it', async ({ page }) => {
  await page.goto('./');
  await expect(page.getByText('测试剧情起点')).toBeVisible();
  await page.getByRole('button', { name: '分支一' }).click();
  await page.getByRole('button', { name: '结局一' }).click();
  await expect(page.getByText('结局一', { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText('结局一', { exact: true })).toBeVisible();
});

test('presents four endings supplied by the story data', async ({ page }) => {
  for (const [index, number] of ['一', '二', '三', '四'].entries()) {
    await page.goto('./');
    if (index === 0) {
      await page.getByRole('button', { name: '分支一' }).click();
    } else {
      await page.getByRole('button', { name: `直达结局${number}` }).click();
    }
    if (index === 0) await page.getByRole('button', { name: '结局一' }).click();
    await expect(page.getByText(`结局${number}`, { exact: true })).toBeVisible();
    await page.evaluate(() => localStorage.clear());
  }
});

test('uses the game title and loads the published story path', async ({ page }) => {
  let requestedStoryPath = '';
  await page.unroute('**/Toukohub/story.json');
  page.on('request', request => {
    if (request.url().endsWith('/Toukohub/story.json')) requestedStoryPath = new URL(request.url()).pathname;
  });
  await page.goto('./');
  await expect(page).toHaveTitle('雨夜回声');
  await expect(page.getByText(/转学生顾舟来到临海的青岚学园/)).toBeVisible();
  await expect(page.getByRole('button', { name: '去图书馆找林激' })).toBeVisible();
  expect(requestedStoryPath).toBe('/Toukohub/story.json');
  await page.getByRole('button', { name: '去图书馆找林激' }).click();
  await page.getByRole('button', { name: '温和地问他为何在意这件事' }).click();
  const save = await page.evaluate(() => JSON.parse(localStorage.getItem('touko-galgame-save-v1')!));
  expect(save.flags['trust.lin']).toBe(2);
  await page.reload();
  await expect(page.getByText(/林激终于坦白/)).toBeVisible();
});

test('keeps the game title when story loading fails', async ({ page }) => {
  await page.route('**/Toukohub/story.json', route => route.fulfill({ status: 500, body: 'Failed' }));
  await page.goto('./');
  await expect(page).toHaveTitle('雨夜回声');
  await expect(page.getByRole('heading', { name: '雨夜回声' })).toBeVisible();
  await expect(page.getByRole('alert')).toHaveText('剧情加载失败 (500)');
});
