import { screen } from './pages/screen.js';
import { test, expect } from './video-feed.fixture.js';

test('学習を絞り込んで動画を後で見るに追加する', async ({ feed, page }, testInfo) => {
  await test.step('初期画面を確認する', async () => {
    await feed.goto();
    await expect(page).toHaveTitle(screen.title);
    await expect(feed.videos).toHaveCount(3);
    await expect(feed.watchLater).toHaveText('後で見る：0件');
    await feed.expectInitialLayout();
  });
  await test.step('学習カテゴリを選択する', async () => {
    await feed.selectCategory('学習');
    await expect(feed.videos).toHaveCount(2);
    await expect(feed.videos).toHaveText(['Playwright入門動画追加', 'テスト設計動画追加']);
  });
  await test.step('動画を追加して結果を記録する', async () => {
    await feed.saveVideo('Playwright入門動画');
    await expect(feed.watchLater).toHaveText('後で見る：1件');
    await testInfo.attach('後で見るの表示', {
      body: await page.screenshot(),
      contentType: 'image/png',
    });
  });
});

test.beforeEach(async ({}, testInfo) => {
  await testInfo.attach('画面仕様', {
    body: JSON.stringify(screen, null, 2),
    contentType: 'application/json',
  });
});
