import { ScreenPage } from './pages/ScreenPage.js';
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => { await new ScreenPage(page).goto(); });

test('別タブの動画を共有を確認する', async ({ page }) => {
  const popupPromise = page.waitForEvent('popup');
  await page.getByRole('link', { name: '共有画面を開く' }).click();
  const receipt = await popupPromise;
  try {
    await expect(receipt.getByRole('heading', { name: '動画を共有', exact: true })).toBeVisible();
    await expect(receipt.getByText('動画URL：/watch?v=demo', { exact: true })).toBeVisible();
  } finally { await receipt.close(); }
});

test('iframe内で再生位置（秒）を保存する', async ({ page }) => {
  const screenPage = new ScreenPage(page);
  await screenPage.seekTo('30');
  const frame = screenPage.playerFrame;
  await expect(frame.getByRole('status')).toHaveText('再生位置：30秒');
  await frame.getByRole('button', { name: '再生', exact: true }).click();
  await expect(frame.getByRole('button', { name: '一時停止', exact: true })).toHaveAttribute('aria-pressed', 'true');
});

for (const accept of [false, true]) {
  test(`削除確認を${accept ? '承認' : 'キャンセル'}する`, async ({ page }) => {
    page.once('dialog', async dialog => {
      expect(dialog.type()).toBe('confirm');
      expect(dialog.message()).toBe('視聴履歴を削除しますか？');
      if (accept) await dialog.accept(); else await dialog.dismiss();
    });
    await page.getByRole('button', { name: '視聴履歴を削除' }).click();
    await expect(page.getByRole('status')).toHaveText(accept ? '削除しました' : 'キャンセルしました');
  });
}
