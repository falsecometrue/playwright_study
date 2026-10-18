import { ScreenPage } from './pages/ScreenPage.js';
import { test, expect } from '@playwright/test';

test('追加・特定行の視聴済み・削除と空白入力', async ({ page }) => {
  await new ScreenPage(page).goto();
  for (const title of ['JavaScript入門', 'Playwright入門', 'テスト設計']) {
    await page.getByLabel('動画タイトル').fill(title);
    await page.getByRole('button', { name: '追加', exact: true }).click();
  }
  const rows = page.getByRole('listitem');
  await expect(rows).toHaveCount(3);
  const study = rows.filter({ has: page.getByLabel('Playwright入門', { exact: true }) });
  await study.getByRole('checkbox').check();
  await expect(study.getByRole('checkbox')).toBeChecked();
  await expect(page.getByLabel('JavaScript入門', { exact: true })).not.toBeChecked();
  await expect(page.getByLabel('テスト設計', { exact: true })).not.toBeChecked();
  await rows.filter({ has: page.getByLabel('JavaScript入門', { exact: true }) }).getByRole('button', { name: '削除' }).click();
  await expect(rows).toHaveCount(2);
  await expect(rows).toHaveText(['Playwright入門削除', 'テスト設計削除']);
  await page.getByLabel('動画タイトル').fill('   ');
  await page.getByRole('button', { name: '追加', exact: true }).click();
  await expect(rows).toHaveCount(2);
});
