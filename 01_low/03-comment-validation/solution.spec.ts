import { test, expect } from '@playwright/test';
import { ScreenPage } from './pages/ScreenPage.js';

test.beforeEach(async ({ page }) => { await new ScreenPage(page).goto(); });
test('表示名が空なら投稿できない', async ({ page }) => {
  const comments = new ScreenPage(page);
  await comments.comment.fill('参考になりました');
  await comments.submit.click();
  await expect(comments.error).toHaveText('表示名を入力してください');
  await expect(comments.result).toBeEmpty();
});
for (const length of [2, 3, 100, 101]) {
  test(`コメント${length}文字の境界値`, async ({ page }) => {
    const comments = new ScreenPage(page);
    await comments.author.fill('Alice');
    await comments.comment.fill('あ'.repeat(length));
    await comments.submit.click();
    const error = length < 3 ? 'コメントは3文字以上です' : length > 100 ? 'コメントは100文字以内です' : '';
    await expect(comments.error).toHaveText(error);
    await expect(comments.result).toHaveText(error ? '' : 'Alice：' + 'あ'.repeat(length));
  });
}
test('修正するとエラーが消える', async ({ page }) => {
  const comments = new ScreenPage(page);
  await comments.author.fill('Alice');
  await comments.comment.fill('  ');
  await comments.submit.click();
  await expect(comments.error).toHaveText('コメントは3文字以上です');
  await comments.comment.fill('わかりやすいです');
  await comments.submit.click();
  await expect(comments.error).toBeEmpty();
  await expect(comments.result).toHaveText('Alice：わかりやすいです');
});
