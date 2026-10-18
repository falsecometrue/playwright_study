import { ScreenPage } from './pages/ScreenPage.js';
import { test, expect } from '@playwright/test';

test('ホームから説明ページへ遷移して戻る', async ({ page }) => {
  await new ScreenPage(page).goto();
  await expect(page).toHaveTitle('チャンネル画面と概要への遷移');
  await expect(page.getByRole('heading', { name: 'ホーム', exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'チャンネル概要' }).click();
  await expect(page).toHaveURL(/\?view=about$/);
  await expect(page).toHaveTitle('チャンネル概要');
  await expect(page.getByRole('heading', { name: 'チャンネル概要', exact: true })).toBeVisible();
  await expect(page.getByText('テスト学習チャンネルです', { exact: true })).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/\/01_low\/01-channel-navigation\/$/);
  await expect(page.getByRole('heading', { name: 'ホーム', exact: true })).toBeVisible();
});
