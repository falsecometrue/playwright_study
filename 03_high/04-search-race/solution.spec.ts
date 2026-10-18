import { screen } from './pages/screen.js';
import { ScreenPage } from './pages/ScreenPage.js';
import { test, expect } from '@playwright/test';

function deferred() {
  let resolve!: () => void;
  const promise = new Promise<void>(done => { resolve = done; });
  return { promise, resolve };
}

test('旧応答が遅れても最新の検索結果を維持する', async ({ page }) => {
  // 通信完了だけではアプリ側のjson解析・描画完了を保証できない。
  // JSON消費後の次のタスクで目印を付け、アプリの継続処理を待つ。
  await page.addInitScript(() => {
    const original = Response.prototype.json;
    Response.prototype.json = async function (...args: Parameters<typeof original>) {
      const data = await original.apply(this, args);
      if (data.items?.[0] === '古い動画候補') {
        setTimeout(() => { document.documentElement.dataset.oldResponseProcessed = 'true'; }, 0);
      }
      return data;
    };
  });
  const oldArrived = deferred();
  const releaseOld = deferred();
  await page.route('**/api/search?*', async route => {
    const query = new URL(route.request().url()).searchParams.get('q');
    if (query === '古い検索語') {
      oldArrived.resolve();
      await releaseOld.promise;
      await route.fulfill({ json: { items: ['古い動画候補'] } });
    } else {
      await route.fulfill({ json: { items: ['新しい動画候補'] } });
    }
  });
  await test.step('画面を開く', async () => { await new ScreenPage(page).goto(); });
  try {
    await test.step('古い検索語を送信する', async () => { await new ScreenPage(page).search('古い検索語'); });
    // expect.pollでタイムアウトを持たせ、到着前に次の入力をしない。
    let arrived = false;
    void oldArrived.promise.then(() => { arrived = true; });
    await expect.poll(() => arrived).toBe(true);
    await test.step('新しい検索語を送信する', async () => { await new ScreenPage(page).search('新しい検索語'); });
    await expect(page.getByRole('listitem')).toHaveText(['新しい動画候補']);
    await expect(page.getByRole('status')).toHaveText('1件');
    releaseOld.resolve();
    await expect(page.locator('html')).toHaveAttribute('data-old-response-processed', 'true');
    await expect(page.getByRole('listitem')).toHaveText(['新しい動画候補']);
    await expect(page.getByRole('status')).toHaveText('1件');
  } finally { releaseOld.resolve(); }
});

test.beforeEach(async ({}, testInfo) => {
  await testInfo.attach('画面仕様', {
    body: JSON.stringify(screen, null, 2),
    contentType: 'application/json',
  });
});
