import { test, expect } from '@playwright/test';
import { ScreenPage } from './pages/ScreenPage.js';

test('高評価を付けて取り消す', async ({ page }) => {
  const video = new ScreenPage(page);
  await video.goto();
  await expect(video.likes).toHaveText('高評価：100件');
  await expect(video.like).toHaveAttribute('aria-pressed', 'false');
  await video.like.click();
  await expect(video.like).toHaveAttribute('aria-pressed', 'true');
  await expect(video.likes).toHaveText('高評価：101件');
  await video.like.click();
  await expect(video.like).toHaveAttribute('aria-pressed', 'false');
  await expect(video.likes).toHaveText('高評価：100件');
});
test('チャンネル登録と解除は高評価に影響しない', async ({ page }) => {
  const video = new ScreenPage(page);
  await video.goto();
  await video.subscriptionButton.click();
  await expect(video.subscriptionButton).toHaveAccessibleName('登録済み');
  await expect(video.subscriptionButton).toHaveAttribute('aria-pressed', 'true');
  await expect(video.subscription).toHaveText('登録しました');
  await video.subscriptionButton.click();
  await expect(video.subscriptionButton).toHaveAccessibleName('チャンネル登録');
  await expect(video.subscription).toHaveText('未登録');
  await expect(video.likes).toHaveText('高評価：100件');
});
