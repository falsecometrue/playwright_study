# 模範解答：動画検索と読み込み待機

## ファイル

- [solution.spec.ts](solution.spec.ts)：完成したテスト
- [画面仕様](pages/SCREEN.md)：前提条件・初期表示・期待結果
- [results.config.ts](results.config.ts)
- [pages/ScreenPage.ts](pages/ScreenPage.ts)
- [pages/screen.ts](pages/screen.ts)

## 実行方法

ルートから実行。サーバーは自動起動し、課題別の模範解答と結果設定を使用します。

```sh
npx playwright test --config 02_midium/01-video-search/results.config.ts
npx playwright show-report reports/by-exercise/02_midium/01-video-search/html
```

Firefoxを使う最後の課題では`npx playwright install firefox`が必要です。`npm test`は学習用テスト、`npm run test:solutions`は全模範解答です。

## 前提条件と実装の考え方

入力・検索結果は空、検索ボタンは有効。/api/searchは遅延応答する。

route.fetchで実APIを呼び、応答の解放だけPromiseで制御します。短い検索中状態を確実に検証した後、結果の描画をexpectで待ちます。

## 検証する内容

1. Playwrightを検索し、検索中とボタン無効を検証する。
2. Playwright入門動画・Playwright実践動画の2件とボタン有効を検証する。
3. 該当なしの検索で0件になること。
4. waitForTimeoutを使わずに実装する。

## テストソース

```ts
import { ScreenPage } from './pages/ScreenPage.js';
import { test, expect } from '@playwright/test';

test('検索中の状態から検索結果まで待つ', async ({ page }) => {
  await new ScreenPage(page).goto();
  // 実APIを使いつつ応答の解放を制御し、短い「検索中」も安定して検証する。
  let release!: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; });
  await page.route('**/api/search?*', async route => {
    const response = await route.fetch();
    await gate;
    await route.fulfill({ response });
  });
  await new ScreenPage(page).search('Playwright');
  try {
    await expect(page.getByRole('status')).toHaveText('検索中');
    await expect(page.getByRole('button', { name: '検索', exact: true })).toBeDisabled();
  } finally { release(); }
  await expect(page.getByRole('listitem')).toHaveText(['Playwright入門動画', 'Playwright実践動画']);
  await expect(page.getByRole('status')).toHaveText('2件');
  await expect(page.getByRole('button', { name: '検索', exact: true })).toBeEnabled();
  await new ScreenPage(page).search('該当なし');
  await expect(page.getByRole('status')).toHaveText('0件');
  await expect(page.getByRole('listitem')).toHaveCount(0);
  await expect(page.getByRole('button', { name: '検索', exact: true })).toBeEnabled();
});
```

## 結果の設定

`results.config.ts`は全体設定を継承し、課題別のHTML・JSON・JUnitを`reports/by-exercise/02_midium/01-video-search/`へ保存します。失敗時の画像・trace・動画とテスト固有の出力は`test-results/by-exercise/02_midium/01-video-search/`です。

全体解答は`reports/solutions/`、学習用は`reports/exercises/`に出力します。同じconfigで再実行すると同じ保存先を更新します。添付はtestInfo.outputPath/attachでテストごとに分離します。

[結果の共通解説](../../RESULTS.md) / [共通設定](../../config/results.ts)

## 公式資料

[Locators](https://playwright.dev/docs/locators) / [Fixtures](https://playwright.dev/docs/test-fixtures) / [Reporters](https://playwright.dev/docs/test-reporters)
