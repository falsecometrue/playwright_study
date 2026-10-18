import { ScreenPage } from './pages/ScreenPage.js';
import { test, expect } from '@playwright/test';

test('ダークテーマはリロード後も保持される', async ({ page }) => {
  await new ScreenPage(page).goto();
  await expect(page.getByRole('status')).toHaveText('現在のテーマ：ライト');
  await expect(page.locator('body')).toHaveAttribute('data-theme', 'light');
  await new ScreenPage(page).selectTheme('dark');
  await page.reload();
  await expect(page.getByRole('status')).toHaveText('現在のテーマ：ダーク');
  await expect(page.locator('body')).toHaveAttribute('data-theme', 'dark');
});

test('ページの初期化前にlocalStorageを設定する', async ({ page }) => {
  await page.addInitScript(() => { localStorage.setItem('theme', 'dark'); });
  await new ScreenPage(page).goto();
  await expect(page.getByRole('status')).toHaveText('現在のテーマ：ダーク');
  await expect(page.locator('body')).toHaveAttribute('data-theme', 'dark');
});

test('独立したテストの初期状態はライト', async ({ page }) => {
  // テストごとに新しいcontextが用意されるため、実行順に関係なくライト。
  await new ScreenPage(page).goto();
  await expect(page.getByRole('status')).toHaveText('現在のテーマ：ライト');
  expect(await page.evaluate(() => localStorage.getItem('theme'))).toBeNull();
});
