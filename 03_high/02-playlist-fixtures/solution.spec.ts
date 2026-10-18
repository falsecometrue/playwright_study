import { screen } from './pages/screen.js';
import { ScreenPage } from './pages/ScreenPage.js';
import { test, expect } from './playlist.fixture.js';

test.describe.configure({ mode: 'parallel' });

test('APIで準備した動画がUIに表示される', async ({ page, playlistData }) => {
  await test.step('画面を開く', async () => { await new ScreenPage(page).goto(); });
  await test.step('作成したplaylistを読み込む', async () => {
    await new ScreenPage(page).loadPlaylist(playlistData.playlist);
  });
  await expect(page.getByRole('listitem')).toHaveCount(1);
  await expect(page.getByRole('listitem')).toContainText(playlistData.item.title);
});

test('UIで削除した動画がAPIからも消える', async ({ page, request, playlistData }) => {
  await test.step('画面を開く', async () => { await new ScreenPage(page).goto(); });
  await test.step('作成したplaylistを読み込む', async () => {
    await new ScreenPage(page).loadPlaylist(playlistData.playlist);
  });
  const row = page.getByRole('listitem').filter({ hasText: playlistData.item.title });
  await row.getByRole('button', { name: '削除', exact: true }).click();
  await expect(page.getByRole('listitem')).toHaveCount(0);
  const response = await request.get(`/api/playlist-items?playlist=${encodeURIComponent(playlistData.playlist)}`);
  expect(response.status()).toBe(200);
  expect((await response.json()).items).toEqual([]);
});

test.beforeEach(async ({}, testInfo) => {
  await testInfo.attach('画面仕様', {
    body: JSON.stringify(screen, null, 2),
    contentType: 'application/json',
  });
});
