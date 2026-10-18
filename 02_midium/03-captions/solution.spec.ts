import { ScreenPage } from './pages/ScreenPage.js';
import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import { readFile } from 'node:fs/promises';

test('CSVと不正ファイルをアップロードする', async ({ page }) => {
  await new ScreenPage(page).goto();
  await new ScreenPage(page).uploadFile(fileURLToPath(new URL('./fixtures/captions.csv', import.meta.url)));
  await expect(page.getByRole('status')).toHaveText('captions.csv：3行');
  await new ScreenPage(page).uploadFile(fileURLToPath(new URL('./fixtures/invalid.txt', import.meta.url)));
  await expect(page.getByRole('status')).toHaveText('字幕CSVを選択してください');
});

test('ダウンロードしたCSVの名前と内容を確認する', async ({ page }, testInfo) => {
  await new ScreenPage(page).goto();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('link', { name: '字幕をダウンロード' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('captions.csv');
  const output = testInfo.outputPath('captions.csv');
  await download.saveAs(output);
  const csv = await readFile(output, 'utf8');
  expect(csv).toContain('time,text');
  expect(csv).toContain('00:00,こんにちは');
});
