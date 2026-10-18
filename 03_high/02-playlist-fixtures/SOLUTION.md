# 模範解答：再生リストのAPI準備と後片付け

## ファイル

- [solution.spec.ts](solution.spec.ts)：完成したテスト
- [画面仕様](pages/SCREEN.md)：前提条件・初期表示・期待結果
- [playlist.fixture.ts](playlist.fixture.ts)
- [results.config.ts](results.config.ts)
- [pages/ScreenPage.ts](pages/ScreenPage.ts)
- [pages/screen.ts](pages/screen.ts)

## 実行方法

ルートから実行。サーバーは自動起動し、課題別の模範解答と結果設定を使用します。

```sh
npx playwright test --config 03_high/02-playlist-fixtures/results.config.ts
npx playwright show-report reports/by-exercise/03_high/02-playlist-fixtures/html
```

Firefoxを使う最後の課題では`npx playwright install firefox`が必要です。`npm test`は学習用テスト、`npm run test:solutions`は全模範解答です。

## 前提条件と実装の考え方

テストごとにUUIDのplaylistを作る。サーバーはメモリ保存で再起動時に消える。

準備はAPI、操作はUI、期待結果はUIとAPIで確認します。固定の再生リストIDを共有すると並列テストが干渉します。

## 検証する内容

1. fixtureでPOST /api/playlist-itemsに{playlist,title}を送り、動画を作成する。
2. UIに再生リストIDを設定して読み込み、作成した動画を検証する。
3. UI削除後、GET APIでもitems=[]であること。
4. finallyでそのplaylistの残存動画をDELETEし、失敗時も後片付けする。
5. 2テストを並列実行し、互いの動画を削除しない。

## テストソース

```ts
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
```

## 結果の設定

`results.config.ts`は全体設定を継承し、課題別のHTML・JSON・JUnitを`reports/by-exercise/03_high/02-playlist-fixtures/`へ保存します。失敗時の画像・trace・動画とテスト固有の出力は`test-results/by-exercise/03_high/02-playlist-fixtures/`です。

全体解答は`reports/solutions/`、学習用は`reports/exercises/`に出力します。同じconfigで再実行すると同じ保存先を更新します。添付はtestInfo.outputPath/attachでテストごとに分離します。

[結果の共通解説](../../RESULTS.md) / [共通設定](../../config/results.ts)

## API契約

- `POST /api/playlist-items`：`{playlist,title}` → 201 `{item:{id,title}}`
- `GET /api/playlist-items?playlist=...` → 200 `{items:[{id,title}]}`
- `DELETE /api/playlist-items/:id?playlist=...` → 204
- `DELETE /api/playlist-items?playlist=...` → 204（指定再生リストのみ）

## 公式資料

[Locators](https://playwright.dev/docs/locators) / [Fixtures](https://playwright.dev/docs/test-fixtures) / [Reporters](https://playwright.dev/docs/test-reporters)
