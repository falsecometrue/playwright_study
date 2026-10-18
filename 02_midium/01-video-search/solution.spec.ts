import { ScreenPage } from './pages/ScreenPage.js';
import { test, expect } from '@playwright/test';

test('検索中の状態から検索結果まで待つ', async ({ page }) => {
  await new ScreenPage(page).goto();
  // 実APIを使いつつ応答の解放を制御し、短い「検索中」も安定して検証する。
  let release!: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; });
  await page.route('**/api/search?*', async route => {
    const response = await route.fetch();
    await gate;
    await route.fulfill({ response });
  });
  await new ScreenPage(page).search('Playwright');
  try {
    await expect(page.getByRole('status')).toHaveText('検索中');
    await expect(page.getByRole('button', { name: '検索', exact: true })).toBeDisabled();
  } finally { release(); }
  await expect(page.getByRole('listitem')).toHaveText(['Playwright入門動画', 'Playwright実践動画']);
  await expect(page.getByRole('status')).toHaveText('2件');
  await expect(page.getByRole('button', { name: '検索', exact: true })).toBeEnabled();
  await new ScreenPage(page).search('該当なし');
  await expect(page.getByRole('status')).toHaveText('0件');
  await expect(page.getByRole('listitem')).toHaveCount(0);
  await expect(page.getByRole('button', { name: '検索', exact: true })).toBeEnabled();
});
