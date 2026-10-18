import { test, expect } from '@playwright/test';
import { ScreenPage } from './pages/ScreenPage.js';

test('コメント投稿の入力検証', async ({ page }) => {
  test.fixme(true, 'READMEの条件を満たしてから解除してください');
  const screenPage = new ScreenPage(page);
  await screenPage.goto();
  // TODO: READMEの前提条件を準備し、操作と期待結果を実装する。
  // TODO: pages/SCREEN.mdとRESULTS.mdで要素の識別と結果設定を確認する。
});
