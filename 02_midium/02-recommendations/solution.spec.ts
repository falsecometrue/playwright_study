import { ScreenPage } from './pages/ScreenPage.js';
import { test, expect } from '@playwright/test';

const responseBody = { videos: [{ name: 'テスト動画', views: 1200 }] };
test.beforeEach(async ({ page }) => { await new ScreenPage(page).goto(); });

test('成功応答のモック', async ({ page }) => {
  await page.route('**/api/recommendations', route => route.fulfill({ status: 200, json: responseBody }));
  const responsePromise = page.waitForResponse(response => response.url().endsWith('/api/recommendations'));
  await new ScreenPage(page).loadRecommendations();
  expect((await responsePromise).status()).toBe(200);
  await expect(page.getByRole('listitem')).toHaveText(['テスト動画：1200回視聴']);
  await expect(page.getByRole('alert')).toBeEmpty();
});

test('HTTP 500でエラーを表示する', async ({ page }) => {
  await page.route('**/api/recommendations', route => route.fulfill({ status: 500, json: {} }));
  await new ScreenPage(page).loadRecommendations();
  await expect(page.getByRole('alert')).toHaveText('おすすめ動画を読み込めませんでした');
  await expect(page.getByRole('listitem')).toHaveCount(0);
});

test('再試行の成功でエラーを消す', async ({ page }) => {
  let calls = 0;
  await page.route('**/api/recommendations', route => route.fulfill(++calls === 1
    ? { status: 500, json: {} }
    : { status: 200, json: responseBody }));
  await new ScreenPage(page).loadRecommendations();
  await expect(page.getByRole('alert')).toHaveText('おすすめ動画を読み込めませんでした');
  await new ScreenPage(page).loadRecommendations();
  await expect(page.getByRole('listitem')).toHaveText(['テスト動画：1200回視聴']);
  await expect(page.getByRole('alert')).toBeEmpty();
  expect(calls).toBe(2);
});
