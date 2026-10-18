import { test, expect } from '@playwright/test';
import { ScreenPage } from './pages/ScreenPage.js';

test.beforeEach(async ({ page }) => {
  const upload = new ScreenPage(page);
  await upload.goto();
  await upload.titleInput.fill('Playwright入門動画');
  await upload.visibility.selectOption('限定公開');
});
test('動画の投稿設定を保存する', async ({ page }) => {
  const upload = new ScreenPage(page);
  await upload.rights.check();
  await upload.save.click();
  await expect(upload.result).toHaveText('Playwright入門動画：限定公開で保存しました');
});
test('著作権の確認前は保存できない', async ({ page }) => {
  const upload = new ScreenPage(page);
  await expect(upload.rights).not.toBeChecked();
  await upload.save.click();
  await expect(upload.result).toBeEmpty();
  expect(await upload.rights.evaluate(element => (element as HTMLInputElement).validity.valueMissing)).toBe(true);
});
