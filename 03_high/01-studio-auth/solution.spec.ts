import { screen } from './pages/screen.js';
import { ScreenPage } from './pages/ScreenPage.js';
import { test, expect } from '@playwright/test';

test('保存した状態でログイン操作なしにYouTube風Studioを表示する', async ({ page }) => {
  await test.step('画面を開く', async () => { await new ScreenPage(page).goto(); });
  await expect(page.getByRole('heading', { name: 'YouTube風Studio', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'ログイン', exact: true })).toBeHidden();
});

test('ログアウトすると認証が失われる', async ({ page, context }) => {
  await test.step('画面を開く', async () => { await new ScreenPage(page).goto(); });
  await expect(page.getByRole('heading', { name: 'YouTube風Studio', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'ログアウト', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'YouTube風Studio', exact: true })).toBeHidden();
  await expect(page.getByRole('button', { name: 'ログイン', exact: true })).toBeVisible();
  expect((await context.request.get('/api/me')).status()).toBe(401);
});

test('認証なしの別contextではAPIが401を返す', async ({ browser, baseURL }) => {
  const anonymous = await browser.newContext({ baseURL, storageState: { cookies: [], origins: [] } });
  try {
    const response = await anonymous.request.get('/api/me');
    expect(response.status()).toBe(401);
  } finally { await anonymous.close(); }
});

test.beforeEach(async ({}, testInfo) => {
  await testInfo.attach('画面仕様', {
    body: JSON.stringify(screen, null, 2),
    contentType: 'application/json',
  });
});
