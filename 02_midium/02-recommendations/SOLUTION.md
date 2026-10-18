# 模範解答：おすすめ動画のAPIモック

## ファイル

- [solution.spec.ts](solution.spec.ts)：完成したテスト
- [画面仕様](pages/SCREEN.md)：前提条件・初期表示・期待結果
- [results.config.ts](results.config.ts)
- [pages/ScreenPage.ts](pages/ScreenPage.ts)
- [pages/screen.ts](pages/screen.ts)

## 実行方法

ルートから実行。サーバーは自動起動し、課題別の模範解答と結果設定を使用します。

```sh
npx playwright test --config 02_midium/02-recommendations/results.config.ts
npx playwright show-report reports/by-exercise/02_midium/02-recommendations/html
```

Firefoxを使う最後の課題では`npx playwright install firefox`が必要です。`npm test`は学習用テスト、`npm run test:solutions`は全模範解答です。

## 前提条件と実装の考え方

おすすめ一覧は空。読み込みボタンでGET /api/recommendationsが発生する。

成功・エラー・回復をそれぞれ確認します。HTTP応答を待つだけで終わらず、画面上の一覧とエラーまで検証します。

## 検証する内容

1. {videos:[{name:"テスト動画",views:1200}]}を返し「テスト動画：1200回視聴」を検証する。
2. HTTP 500で「おすすめ動画を読み込めませんでした」と動画0件を検証する。
3. 最初は失敗、再試行は成功とし、エラーが消え、通信が2回であること。
4. routeとwaitForResponseはクリック前に登録する。

## テストソース

```ts
import { ScreenPage } from './pages/ScreenPage.js';
import { test, expect } from '@playwright/test';

const responseBody = { videos: [{ name: 'テスト動画', views: 1200 }] };
test.beforeEach(async ({ page }) => { await new ScreenPage(page).goto(); });

test('成功応答のモック', async ({ page }) => {
  await page.route('**/api/recommendations', route => route.fulfill({ status: 200, json: responseBody }));
  const responsePromise = page.waitForResponse(response => response.url().endsWith('/api/recommendations'));
  await new ScreenPage(page).loadRecommendations();
  expect((await responsePromise).status()).toBe(200);
  await expect(page.getByRole('listitem')).toHaveText(['テスト動画：1200回視聴']);
  await expect(page.getByRole('alert')).toBeEmpty();
});

test('HTTP 500でエラーを表示する', async ({ page }) => {
  await page.route('**/api/recommendations', route => route.fulfill({ status: 500, json: {} }));
  await new ScreenPage(page).loadRecommendations();
  await expect(page.getByRole('alert')).toHaveText('おすすめ動画を読み込めませんでした');
  await expect(page.getByRole('listitem')).toHaveCount(0);
});

test('再試行の成功でエラーを消す', async ({ page }) => {
  let calls = 0;
  await page.route('**/api/recommendations', route => route.fulfill(++calls === 1
    ? { status: 500, json: {} }
    : { status: 200, json: responseBody }));
  await new ScreenPage(page).loadRecommendations();
  await expect(page.getByRole('alert')).toHaveText('おすすめ動画を読み込めませんでした');
  await new ScreenPage(page).loadRecommendations();
  await expect(page.getByRole('listitem')).toHaveText(['テスト動画：1200回視聴']);
  await expect(page.getByRole('alert')).toBeEmpty();
  expect(calls).toBe(2);
});
```

## 結果の設定

`results.config.ts`は全体設定を継承し、課題別のHTML・JSON・JUnitを`reports/by-exercise/02_midium/02-recommendations/`へ保存します。失敗時の画像・trace・動画とテスト固有の出力は`test-results/by-exercise/02_midium/02-recommendations/`です。

全体解答は`reports/solutions/`、学習用は`reports/exercises/`に出力します。同じconfigで再実行すると同じ保存先を更新します。添付はtestInfo.outputPath/attachでテストごとに分離します。

[結果の共通解説](../../RESULTS.md) / [共通設定](../../config/results.ts)

## 公式資料

[Locators](https://playwright.dev/docs/locators) / [Fixtures](https://playwright.dev/docs/test-fixtures) / [Reporters](https://playwright.dev/docs/test-reporters)
